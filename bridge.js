'use strict';
/**
 * bridge.js — sincroniza datos del servidor Conan Exiles con Supabase
 * Correr con: node bridge.js
 * Se puede agregar al inicio de Windows con pm2 o Task Scheduler.
 */
require('dotenv').config();
const net = require('net');
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const RCON_HOST = process.env.RCON_HOST || '190.174.183.144';
const RCON_PORT = parseInt(process.env.RCON_PORT) || 25575;
const RCON_PASS = process.env.RCON_PASS || 'dani123';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { realtime: { transport: ws } }
);

// ── RCON ──────────────────────────────────────────────

function buildPacket(id, type, body) {
  const b   = Buffer.from(body, 'utf8');
  const pkt = Buffer.alloc(4 + b.length + 10);
  pkt.writeInt32LE(b.length + 10, 0);
  pkt.writeInt32LE(id, 4); pkt.writeInt32LE(type, 8);
  b.copy(pkt, 12); return pkt;
}

function rcon(command) {
  return new Promise((resolve, reject) => {
    const sock = new net.Socket();
    let buf = Buffer.alloc(0), authed = false, done = false;
    const finish = (err, val) => {
      if (done) return; done = true;
      clearTimeout(timer); sock.destroy();
      err ? reject(err) : resolve(val);
    };
    const timer = setTimeout(() => finish(new Error('timeout')), 12000);
    sock.connect(RCON_PORT, RCON_HOST, () => sock.write(buildPacket(1, 3, RCON_PASS)));
    sock.on('data', chunk => {
      buf = Buffer.concat([buf, chunk]);
      while (buf.length >= 4) {
        const size = buf.readInt32LE(0);
        if (size < 10 || size > 65536) { finish(new Error('bad packet')); return; }
        if (buf.length < 4 + size) break;
        const id = buf.readInt32LE(4), type = buf.readInt32LE(8);
        const body = buf.slice(12, Math.max(12, size + 2)).toString('utf8').replace(/\x00/g, '').trim();
        buf = buf.slice(4 + size);
        if (!authed) {
          if (type === 2) {
            if (id === -1) { finish(new Error('RCON auth failed')); return; }
            authed = true; sock.write(buildPacket(2, 2, command));
          }
        } else { finish(null, body); return; }
      }
    });
    sock.on('error', finish);
  });
}

// ── Parsers ───────────────────────────────────────────

function parsePlayers(raw) {
  if (!raw) return [];
  return raw.split('\n').map(l => l.trim()).filter(l => /^\d+/.test(l))
    .map(line => {
      const p = line.split('|').map(s => s.trim());
      return { idx: parseInt(p[0]) || 0, name: p[1] || '?' };
    });
}

function parseSqlRows(raw) {
  if (!raw || raw.startsWith('Successfully executed')) return [];
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  return lines.slice(1).map(line => {
    const vals = line.replace(/^#\d+\s+/, '').split('|').map(v => v.trim());
    const row = {};
    headers.forEach((h, i) => { row[h] = vals[i] ?? ''; });
    return row;
  });
}

// ── Sync funciones ────────────────────────────────────

const onlineSince    = new Map();
let   currentOnline  = new Map(); // nombre → idx de jugadores online ahora

async function syncOnlinePlayers() {
  try {
    const raw     = await rcon('listplayers');
    const players = parsePlayers(raw).filter(p => p.name !== '?');
    const names   = players.map(p => p.name);

    if (!names.length) {
      await supabase.from('online_players').delete().neq('name', '__never__');
      onlineSince.clear();
      currentOnline.clear();
      console.log('[bridge] 0 jugadores online — tabla limpiada');
      return;
    }

    // Enriquecer con nivel y clan — CAST porque g.name es BLOB en SQLite
    const list  = names.map(n => `'${n.replace(/'/g, "''")}'`).join(',');
    const raw2  = await rcon(`sql SELECT c.char_name, c.level, c.id, CAST(g.name AS TEXT) as clan, g.owner FROM characters c LEFT JOIN guilds g ON c.guild = g.guildId WHERE c.char_name IN (${list})`);
    const rows  = parseSqlRows(raw2);
    const charMap = {};
    rows.forEach(r => {
      const clan = r.clan && r.clan !== 'void' && r.clan !== 'BLOB' ? r.clan : null;
      charMap[r.char_name] = {
        level:     parseInt(r.level) || 0,
        clan,
        is_leader: r.owner && r.id && r.owner.trim() === r.id.trim(),
      };
    });

    // Mapa nombre → idx para usar con el comando 'con'
    currentOnline = new Map(players.map(p => [p.name, p.idx]));

    const now = Date.now();
    names.forEach(n => { if (!onlineSince.has(n)) onlineSince.set(n, now); });
    for (const [n] of onlineSince) { if (!names.includes(n)) onlineSince.delete(n); }

    const upserts = names.map(name => ({
      name,
      level:       charMap[name]?.level ?? 0,
      clan:        charMap[name]?.clan  ?? null,
      is_leader:   charMap[name]?.is_leader ?? false,
      online_since: onlineSince.get(name),
      updated_at:  new Date().toISOString(),
    }));

    await supabase.from('online_players').upsert(upserts, { onConflict: 'name' });
    // Eliminar los que ya no están online
    await supabase.from('online_players').delete().not('name', 'in', `(${names.map(n => `"${n}"`).join(',')})`);

    console.log(`[bridge] ${names.length} jugadores online sincronizados`);
  } catch (e) {
    console.error('[bridge] Error sync players:', e.message);
  }
}

async function sendVerificationCodes() {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('char_name, verification_code')
      .eq('verified', false)
      .not('verification_code', 'is', null)
      .not('char_name', 'is', null)
      .neq('char_name', '');

    if (!data?.length) return;

    for (const p of data) {
      if (!currentOnline.has(p.char_name)) continue;
      try {
        await rcon(`directmessage "Tienda D&D" "${p.char_name}" "Código de verificación del sitio web: ${p.verification_code}"`);
        console.log(`[bridge] Código enviado a ${p.char_name}: ${p.verification_code}`);
      } catch (e) {
        console.error(`[bridge] Error enviando código a ${p.char_name}:`, e.message);
      }
    }
  } catch (e) {
    console.error('[bridge] Error sendVerificationCodes:', e.message);
  }
}

async function deliverPendingItems() {
  try {
    const { data } = await supabase
      .from('requests')
      .select('id, character_name, item_name, market_items(template_id)')
      .eq('type', 'market')
      .eq('status', 'approved');

    if (!data?.length) return;

    for (const req of data) {
      const charName   = req.character_name;
      const templateId = req.market_items?.template_id;
      const itemName   = req.item_name || '?';

      const playerIdx = currentOnline.get(charName);
      if (playerIdx === undefined) continue; // offline, reintenta en 30s

      let rconNote;
      if (!templateId) {
        rconNote = 'Sin template_id — actualizar el ID en MERCADO y reintentar.';
      } else {
        try {
          const resp = await rcon(`con ${playerIdx} SpawnItem ${templateId} 1`);
          console.log(`[bridge] SpawnItem response: "${resp}"`);
          // Notificar al jugador
          try { await rcon(`directmessage "Tienda D&D" "${charName}" "Tu pedido de ${itemName} fue entregado! Revisa tu inventario."`); } catch {}
          rconNote = `Entregado (SpawnItem ${templateId}, idx=${playerIdx}). Resp: ${resp}`;
          console.log(`[bridge] ✓ Ítem entregado: ${itemName} → ${charName}`);
        } catch (e) {
          rconNote = `SpawnItem falló: ${e.message} — entregar manualmente.`;
          console.error(`[bridge] Delivery falló para ${charName}:`, e.message);
        }
      }

      await supabase.from('requests').update({
        status:       'delivered',
        processed_at: new Date().toISOString(),
        rcon_note:    rconNote,
      }).eq('id', req.id);
    }
  } catch (e) {
    console.error('[bridge] Error deliverPendingItems:', e.message);
  }
}

async function syncRanking() {
  try {
    // Query 1 — niveles (sin JOIN, para evitar el problema de BLOB en guild names)
    const rawChars = await rcon(
      'sql SELECT char_name, level FROM characters WHERE char_name != "" ORDER BY level DESC LIMIT 1000'
    );
    const charRows = parseSqlRows(rawChars);
    if (!charRows.length) return;

    await new Promise(r => setTimeout(r, 800));

    // Query 2 — clanes: personajes con su guild (INNER JOIN, solo los que tienen clan)
    const rawClans = await rcon(
      'sql SELECT c.char_name, CAST(g.name AS TEXT) as clan FROM characters c INNER JOIN guilds g ON c.guild = g.guildId WHERE g.guildId IS NOT NULL'
    );
    const clanRows = parseSqlRows(rawClans);

    // Mapa nombre → clan
    const clanMap = {};
    for (const r of clanRows) {
      const clan = r.clan && r.clan !== 'BLOB' && r.clan !== 'void' ? r.clan.trim() : null;
      if (clan) clanMap[r.char_name] = clan;
    }

    // Merge y upsert
    const upserts = charRows.map(r => ({
      name:       r.char_name,
      level:      parseInt(r.level) || 0,
      clan:       clanMap[r.char_name] || null,
      updated_at: new Date().toISOString(),
    }));

    await supabase.from('characters_ranking').upsert(upserts, { onConflict: 'name' });
    console.log(`[bridge] Ranking actualizado — ${charRows.length} personajes, ${Object.keys(clanMap).length} en clanes`);
  } catch (e) {
    console.error('[bridge] Error sync ranking:', e.message);
  }
}

// ══════════════════════════════════════════════════════
// EVENTO AL-MERAYAH — Commander Bakt-Nimlot
// ══════════════════════════════════════════════════════
//
// MECÁNICA:
//   • Nimlot está activo en el castillo → el bridge anuncia el evento.
//   • Alguien lo mata → recibe 30x Retazo de Armadura + 50 monedas Pippi.
//   • Notificaciones estilo purga en pantalla de todos los jugadores.
//   • A las 2 horas → Nimlot reaparece → nuevo anuncio → loop infinito.
//
// DETECCIÓN AUTOMÁTICA:
//   - Por coordenadas (radio 12000 unidades de Al-Merayah 22010,82868)
//   - + patrón de nombre del NPC (Nimlot, Bakt, Commander, Stygian)

// ── Config evento ─────────────────────────────────────
const NIMLOT_PRIZE_ITEM  = 11112;           // Retazo de Armadura
const NIMLOT_PRIZE_QTY   = 30;             // cantidad de ítems
const NIMLOT_COINS       = 50;             // monedas Pippi
const NIMLOT_RESPAWN_MS  = 2 * 60 * 60 * 1000; // 2 horas

// Coordenadas del castillo Al-Merayah
const ALM_X = 22010, ALM_Y = 82868, ALM_RADIUS = 12000;

// NPCs del mapa que NO son el boss de Al-Merayah (para ignorarlos)
const WILDLIFE_RE = /Wildlife|Rabbit|Deer|Bird|Fish|Wolf|Bear|Croc|Hyena|Elephant|Rhino|Tiger|Panther|Spider|Scorpion|Rocknose|Kappa|Shalebacks|Gazelle|Horse|Vulture|Bat|Snake/i;

function esNimlot(objectName, x, y) {
  const nx = parseFloat(x) || 0, ny = parseFloat(y) || 0;
  const enCastillo = Math.abs(nx - ALM_X) < ALM_RADIUS && Math.abs(ny - ALM_Y) < ALM_RADIUS;
  if (!enCastillo) return false;
  // Ignorar animales salvajes, detectar cualquier NPC humanoide/boss del castillo
  return !WILDLIFE_RE.test(objectName);
}

// ── Castillos — Sistema de Asedio (guardianes normales) ──
//
// MECÁNICA ESPECIAL — COMMANDER BAKT-NIMLOT (Al-Merayah):
//   1. Al aparecer: broadcast de aviso a todo el servidor.
//   2. Al morir: el líder del clan ganador recibe ítems de premio + thrall.
//   3. El clan obtiene +20% de tax durante 2 horas.
//   4. A las 2 horas: Nimlot reaparece, se avisa, y el bonus se cancela.
//
// CÓMO COMPLETAR:
//   - NIMLOT_CLASS: el objectName que aparece en game_events al matarlo.
//     Para saberlo: matalo y ejecutá en RCON:
//     sql SELECT objectName FROM game_events WHERE eventType=86 ORDER BY rowid DESC LIMIT 5
//   - NIMLOT_THRALL_TEMPLATE: el template_id del thrall Commander Bakt-Nimlot.
//     Para saberlo: capturalo y ejecutá:
//     sql SELECT template_id FROM item_inventory WHERE owner_id=(SELECT id FROM characters WHERE char_name='TuPersonaje') ORDER BY item_id DESC LIMIT 5


// ── Config castillos (guardianes normales) ────────────
const CASTLES_CONFIG = [
  {
    id:             'castillo_norte',
    guardian_class: '',        // ← COMPLETAR: objectName del NPC guardián
    x:              0,         // ← COMPLETAR: coordenada X del castillo
    y:              0,         // ← COMPLETAR: coordenada Y del castillo
    radius:         8000,
  },
  {
    id:             'castillo_sur',
    guardian_class: '',
    x:              0,
    y:              0,
    radius:         8000,
  },
  {
    id:             'castillo_centro',
    guardian_class: '',
    x:              0,
    y:              0,
    radius:         8000,
  },
];

// ID del último game_event procesado — evita re-procesar al reiniciar
let lastSiegeEventRowId = 0;

async function initSiegeEventCursor() {
  try {
    const raw  = await rcon('sql SELECT MAX(rowid) as maxid FROM game_events');
    const rows = parseSqlRows(raw);
    lastSiegeEventRowId = parseInt(rows[0]?.maxid) || 0;
    console.log(`[castles] Cursor de eventos iniciado en rowid ${lastSiegeEventRowId}`);
  } catch (e) {
    console.warn('[castles] No se pudo leer game_events:', e.message);
  }
}

function distancia2D(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

async function pollSiegeEvents() {
  try {
    // Leer kills de NPC (eventType=86) con jugador que los causó
    const raw  = await rcon(
      `sql SELECT rowid, objectName, causerName, causerGuildName, x, y FROM game_events ` +
      `WHERE rowid > ${lastSiegeEventRowId} AND eventType = 86 AND causerName != '' ` +
      `ORDER BY rowid ASC LIMIT 50`
    );
    const rows = parseSqlRows(raw);
    if (!rows.length) return;

    for (const row of rows) {
      const rid = parseInt(row.rowid) || 0;
      if (rid > lastSiegeEventRowId) lastSiegeEventRowId = rid;

      const killX     = parseFloat(row.x) || 0;
      const killY     = parseFloat(row.y) || 0;
      const player    = (row.causerName || '').trim();
      const npcClass  = (row.objectName || '').trim();
      const clan      = (row.causerGuildName || '').trim();

      if (!player) continue;

      // Log de todos los kills para debug
      console.log(`[siege-debug] kill: "${npcClass}" por ${player} en (${Math.round(killX)},${Math.round(killY)})`);

      // ── Verificar si es Nimlot ──
      if (esNimlot(npcClass, row.x, row.y)) {
        await nimlotMuerto(player, clan || null);
        continue;
      }

      // ── Verificar castillos normales ──
      for (const cfg of CASTLES_CONFIG) {
        // Saltar castillos sin coordenadas configuradas
        if (!cfg.x && !cfg.y) continue;

        // Verificar clase del guardián (si está definida)
        if (cfg.guardian_class && cfg.guardian_class !== npcClass) continue;

        // Verificar que el kill fue dentro del radio del castillo
        if (distancia2D(killX, killY, cfg.x, cfg.y) > cfg.radius) continue;

        // ¡Kill válido! Reclamar el castillo para este jugador
        await processCastleClaim(cfg.id, player, row.causerGuildName);
        break;
      }
    }
  } catch (e) {
    console.error('[castles] pollSiegeEvents error:', e.message);
  }
}

async function processCastleClaim(castleId, playerName, guildNameRaw) {
  try {
    const { data: castle } = await supabase
      .from('castles').select('id, name, owner').eq('id', castleId).single();
    if (!castle) {
      console.warn(`[castles] Castillo "${castleId}" no existe en Supabase — agregarlo con el SQL`);
      return;
    }

    // Ignorar si ya es el dueño
    if (castle.owner === playerName) return;

    const anteriorDuenio = castle.owner;
    const clan = guildNameRaw && guildNameRaw !== 'BLOB' && guildNameRaw !== 'void' ? guildNameRaw.trim() : null;

    await supabase.from('castles').update({
      owner:        playerName,
      clan,
      claimed_at:   new Date().toISOString(),
      is_contested: false,
    }).eq('id', castleId);

    // Anuncio servidor
    const clanTag = clan ? ` [${clan}]` : '';
    await rcon(`broadcast ¡${playerName}${clanTag} ha conquistado ${castle.name} en combate!`).catch(() => {});

    // Notificar al dueño anterior si está online
    if (anteriorDuenio && currentOnline.has(anteriorDuenio)) {
      await rcon(`directmessage "Sistema de Castillos" "${anteriorDuenio}" "¡Perdiste ${castle.name}! ${playerName} derrotó a tu guardián."`).catch(() => {});
    }

    // Guardar en historial
    await supabase.from('castle_siege_log').insert({
      castle_id:      castleId,
      castle_name:    castle.name,
      action:         'conquest',
      player:         playerName,
      clan,
      previous_owner: anteriorDuenio || null,
      created_at:     new Date().toISOString(),
    }).catch(() => {});

    console.log(`[castles] ✓ ${playerName}${clanTag} conquistó "${castle.name}" (antes: ${anteriorDuenio || 'nadie'})`);
  } catch (e) {
    console.error('[castles] processCastleClaim error:', e.message);
  }
}

// ══════════════════════════════════════════════════════
// EVENTO AL-MERAYAH — Funciones
// ══════════════════════════════════════════════════════

// Anuncia el evento a todos los jugadores (estilo purga)
async function anunciarNimlotActivo() {
  await rcon('broadcast ⚔️ El Rey desperto! Mata al Commander Bakt-Nimlot en Al-Merayah y gana items! TeleportPlayer 22010 82868 -5586').catch(() => {});
  console.log('[nimlot] Evento anunciado al servidor');
}

// Procesa la muerte de Nimlot
async function nimlotMuerto(killerName, killerClan) {
  console.log(`[nimlot] ¡Nimlot derrotado por ${killerName} [${killerClan || 'sin clan'}]!`);

  // Buscar líder del clan (o el mismo jugador si no tiene clan)
  let leaderName = killerName;
  if (killerClan) {
    const raw = await rcon(
      `sql SELECT c.char_name FROM characters c INNER JOIN guilds g ON g.owner = c.id WHERE CAST(g.name AS TEXT) = '${killerClan.replace(/'/g,"''")}' LIMIT 1`
    ).catch(() => '');
    const rows = parseSqlRows(raw);
    if (rows[0]?.char_name) leaderName = rows[0].char_name.trim();
  }

  // Guardar en Supabase (para el timer de 2h)
  const respawnAt = new Date(Date.now() + NIMLOT_RESPAWN_MS);
  await supabase.from('nimlot_state').upsert({
    id:                1,
    killed_by:         killerName,
    killed_by_clan:    killerClan || null,
    leader_rewarded:   leaderName,
    killed_at:         new Date().toISOString(),
    respawn_at:        respawnAt.toISOString(),
    bonus_active:      true,
    respawn_announced: false,
  }, { onConflict: 'id' }).catch(() => {});

  const clanTag = killerClan ? ` [${killerClan}]` : '';
  await new Promise(r => setTimeout(r, 500));
  await rcon(`broadcast 💀 El Rey Commander Bakt-Nimlot fue derrotado por ${killerName}${clanTag}! Premio entregado. Regresara en 2 horas.`).catch(() => {});

  // Entregar premios
  await entregarPremiosNimlot(leaderName, killerClan);
}

// Entrega los premios al líder del clan ganador
async function entregarPremiosNimlot(leaderName, clan) {
  const playerIdx = currentOnline.get(leaderName);

  if (playerIdx === undefined) {
    // Offline → encolar para cuando conecte
    await supabase.from('nimlot_pending_prizes').insert({
      leader: leaderName, clan: clan || null, created_at: new Date().toISOString(),
    }).catch(() => {});
    console.log(`[nimlot] ${leaderName} offline — premios encolados`);
    return;
  }

  // 30x Retazo de Armadura
  await rcon(`con ${playerIdx} SpawnItem ${NIMLOT_PRIZE_ITEM} ${NIMLOT_PRIZE_QTY}`).catch(e =>
    console.error('[nimlot] Error SpawnItem:', e.message)
  );
  await new Promise(r => setTimeout(r, 500));

  // 50 Monedas de Plata Pippi
  await rcon(`pippi currency give ${leaderName} ${NIMLOT_COINS}`).catch(() => {});

  await rcon(`directmessage "Evento Al-Merayah" "${leaderName}" "¡Felicidades ${leaderName}! Recibiste ${NIMLOT_PRIZE_QTY} Retazos de Armadura y ${NIMLOT_COINS} Monedas de Plata por matar al Commander Bakt-Nimlot."`).catch(() => {});
  console.log(`[nimlot] Premios entregados a ${leaderName}: ${NIMLOT_PRIZE_QTY}x${NIMLOT_PRIZE_ITEM} + ${NIMLOT_COINS} monedas`);
}

// Entrega premios pendientes cuando el jugador se conecta
async function deliverPendingNimlotPrizes() {
  try {
    const { data } = await supabase.from('nimlot_pending_prizes').select('id, leader, clan');
    if (!data?.length) return;
    for (const prize of data) {
      if (!currentOnline.has(prize.leader)) continue;
      await entregarPremiosNimlot(prize.leader, prize.clan);
      await supabase.from('nimlot_pending_prizes').delete().eq('id', prize.id);
      console.log(`[nimlot] Premios pendientes entregados a ${prize.leader}`);
    }
  } catch (e) {
    console.error('[nimlot] Error premios pendientes:', e.message);
  }
}

// Verifica cada minuto si Nimlot ya debe reaparecer
async function checkNimlotRespawn() {
  try {
    const { data } = await supabase
      .from('nimlot_state').select('*')
      .eq('id', 1).eq('bonus_active', true).eq('respawn_announced', false)
      .single();

    if (!data) return;
    if (new Date() < new Date(data.respawn_at)) return;

    // Marcar como anunciado
    await supabase.from('nimlot_state').update({
      bonus_active: false, respawn_announced: true,
    }).eq('id', 1);

    console.log('[nimlot] 2 horas cumplidas — reseteando fortaleza y anunciando');
    await respawnFort();
    await anunciarNimlotActivo();
  } catch (e) { /* sin estado previo = normal */ }
}

// Carga el estado al arrancar el bridge
async function respawnFort() {
  try {
    // dc togglefort necesita ejecutarse como un jugador online (admin)
    // Buscar cualquier jugador online para usarlo como canal
    if (currentOnline.size === 0) {
      console.log('[nimlot] Sin jugadores online para resetear la fortaleza');
      return;
    }
    // Preferir LADM, sino el primero disponible
    const adminIdx = currentOnline.get('LADM') ?? [...currentOnline.values()][0];

    console.log('[nimlot] Reseteando fortaleza Al-Merayah con idx', adminIdx);
    // Apagar fortaleza
    await rcon(`con ${adminIdx} dc togglefort`).catch(() => {});
    await new Promise(r => setTimeout(r, 3000));
    // Encender fortaleza — Nimlot y NPCs reaparecen
    await rcon(`con ${adminIdx} dc togglefort`).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    console.log('[nimlot] Fortaleza reseteada');
  } catch (e) {
    console.error('[nimlot] Error respawnFort:', e.message);
  }
}

async function initSiegeState() {
  try {
    const { data } = await supabase
      .from('nimlot_state').select('*').eq('id', 1).single();

    if (!data || !data.bonus_active) {
      // Nimlot activo — resetear fortaleza y anunciar
      console.log('[nimlot] Reseteando y anunciando evento...');
      await respawnFort();
      setTimeout(anunciarNimlotActivo, 5_000);
      return;
    }

    // Bonus activo → verificar si ya venció
    const respawnAt = new Date(data.respawn_at);
    if (new Date() >= respawnAt && !data.respawn_announced) {
      await supabase.from('nimlot_state').update({ bonus_active: false, respawn_announced: true }).eq('id', 1);
      setTimeout(anunciarNimlotActivo, 5_000);
    } else if (data.bonus_active) {
      console.log(`[nimlot] Bonus activo — ${data.leader_rewarded} tiene el premio hasta ${data.respawn_at}`);
    }
  } catch (e) {
    console.log('[nimlot] Sin estado previo — anunciando en 60s');
    setTimeout(anunciarNimlotActivo, 5_000);
  }
}

async function distributeTax() {
  try {
    const { data: castles } = await supabase
      .from('castles')
      .select('id, name, owner, clan, tax_rate')
      .not('owner', 'is', null);

    if (!castles?.length) return;

    // Verificar si hay bonus de Nimlot activo y para qué clan
    const { data: nimlot } = await supabase
      .from('nimlot_state')
      .select('killed_by_clan, killed_by, leader_rewarded, bonus_active')
      .eq('id', 1)
      .eq('bonus_active', true)
      .single()
      .catch(() => ({ data: null }));

    const nimlotBonusClan   = nimlot?.killed_by_clan  || null;
    const nimlotBonusPlayer = nimlot?.leader_rewarded || null;

    let distributed = 0;
    for (const castle of castles) {
      if (!currentOnline.has(castle.owner)) continue;

      // Calcular si este dueño tiene el bonus de Nimlot
      const tieneBonus = nimlotBonusClan
        ? castle.clan === nimlotBonusClan
        : castle.owner === nimlotBonusPlayer;

      const taxBase  = castle.tax_rate;
      const taxTotal = tieneBonus
        ? Math.round(taxBase * (1 + SIEGE_TAX_BONUS / 100))
        : taxBase;

      try {
        await rcon(`pippi currency give ${castle.owner} ${taxTotal}`);

        const bonusMsg = tieneBonus ? ` (+${SIEGE_TAX_BONUS}%% bonus Al-Merayah)` : '';
        await rcon(`directmessage "Tesoro Real" "${castle.owner}" "Recibiste ${taxTotal} monedas de impuestos de ${castle.name}${bonusMsg}."`);

        await supabase.from('castle_tax_log').insert({
          castle_id:    castle.id,
          castle_name:  castle.name,
          recipient:    castle.owner,
          amount:       taxTotal,
          nimlot_bonus: tieneBonus,
          created_at:   new Date().toISOString(),
        }).catch(() => {});

        console.log(`[castles] Tax: ${taxTotal} monedas → ${castle.owner} (${castle.name})${tieneBonus ? ' ★ bonus Nimlot' : ''}`);
        distributed++;
      } catch (e) {
        console.error(`[castles] Tax error ${castle.owner}:`, e.message);
      }
    }

    if (distributed) console.log(`[castles] Tax distribuida a ${distributed} dueños`);
  } catch (e) {
    console.error('[castles] distributeTax error:', e.message);
  }
}

// ── Notificaciones programadas ────────────────────────
//
// Lunes-Viernes: PVP activo 20:00–23:00
// Sábado-Domingo: Asedio de Bases 20:00–23:00
// Zona horaria: Argentina (UTC-3)

const BROADCAST_TZ_OFFSET = -3; // UTC-3 Argentina

// Guarda qué keys ya se enviaron hoy para no repetirlas
const sentBroadcasts = new Set();

const SCHEDULED_BROADCASTS = [
  {
    key:      'pvp_start',
    hour:     20,
    minute:   0,
    days:     [1, 2, 3, 4, 5], // Lun–Vie (0=Dom, 6=Sáb)
    message:  '⚔️ Cuidado Exiliados! El PVP esta ACTIVO hasta las 23:00 hs. Preparen sus armas!',
  },
  {
    key:      'pvp_end',
    hour:     23,
    minute:   0,
    days:     [1, 2, 3, 4, 5],
    message:  '😌 Uff... termino el PVP por hoy! Ahora si a viciar tranquilos. Buenas noches!',
  },
  {
    key:      'siege_start',
    hour:     20,
    minute:   0,
    days:     [6, 0], // Sáb y Dom
    message:  '🏰 Muajaja! Comenzo la HORA DE LOS ASEDIOS! Cuiden sus Bases Exiliados! La purga ha comenzado!',
  },
  {
    key:      'siege_end',
    hour:     23,
    minute:   0,
    days:     [6, 0],
    message:  '🛡️ Ha terminado el Ataque a Bases por hoy! Ahora a descansar... si pueden. Buenas noches!',
  },
];

function getArgentinaTime() {
  const now    = new Date();
  const utcMs  = now.getTime() + now.getTimezoneOffset() * 60_000;
  return new Date(utcMs + BROADCAST_TZ_OFFSET * 3_600_000);
}

async function checkScheduledBroadcasts() {
  const ar    = getArgentinaTime();
  const day   = ar.getDay();   // 0=Dom … 6=Sáb
  const hour  = ar.getHours();
  const min   = ar.getMinutes();

  // Resetear el set al inicio de cada día
  const todayKey = `${ar.getFullYear()}-${ar.getMonth()}-${ar.getDate()}`;
  if (!sentBroadcasts.has('__day__' + todayKey)) {
    sentBroadcasts.clear();
    sentBroadcasts.add('__day__' + todayKey);
  }

  for (const evt of SCHEDULED_BROADCASTS) {
    if (!evt.days.includes(day)) continue;
    if (evt.hour !== hour || evt.minute !== min) continue;

    const key = `${todayKey}_${evt.key}`;
    if (sentBroadcasts.has(key)) continue;

    sentBroadcasts.add(key);
    try {
      await rcon(`broadcast ${evt.message}`);
      console.log(`[broadcast] ✓ "${evt.key}" enviado a las ${hour}:${String(min).padStart(2,'0')} (AR)`);
    } catch (e) {
      console.error(`[broadcast] Error enviando "${evt.key}":`, e.message);
    }
  }
}

// ── Loop principal ────────────────────────────────────

async function run() {
  console.log('\n🐉  Bridge Dragones y Demonios → Supabase\n');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('ERROR: Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en .env');
    process.exit(1);
  }

  await syncOnlinePlayers();
  await deliverPendingItems();
  await syncRanking();
  await initSiegeEventCursor();
  // await initSiegeState(); // EVENTO PAUSADO

  // Online + entregas + verificaciones + asedios + premios pendientes: cada 30s
  setInterval(async () => {
    await syncOnlinePlayers();
    await deliverPendingItems();
    await sendVerificationCodes();
    // await pollSiegeEvents();         // EVENTO PAUSADO
    // await deliverPendingNimlotPrizes(); // EVENTO PAUSADO
  }, 30_000);
  // Ranking: cada 5 min
  setInterval(syncRanking, 300_000);
  // Notificaciones programadas (PVP / Asedio): cada 1 minuto
  setInterval(checkScheduledBroadcasts, 60_000);
  // Nimlot respawn check: cada 1 minuto
  // setInterval(checkNimlotRespawn, 60_000); // EVENTO PAUSADO
  // Tax de castillos: cada 1 hora
  setInterval(distributeTax, 3_600_000);
}

run();
