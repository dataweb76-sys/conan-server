'use strict';
/**
 * bridge.js — sincroniza datos del servidor Conan Exiles con Supabase
 * Correr con: node bridge.js
 *
 * IMPORTANTE: el RCON de Conan Exiles devuelve "BLOB" para columnas TEXT
 * cuando se usa un JOIN. La solución es usar dos queries separadas y
 * hacer el merge en JavaScript.
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
        const id   = buf.readInt32LE(4);
        const type = buf.readInt32LE(8);
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

// ── Helpers ───────────────────────────────────────────

/**
 * Obtiene el mapa de guilds: guildId (string) → { name, owner }
 * Query directa SIN JOIN — evita el bug de BLOB en RCON
 */
async function fetchGuildMap() {
  const raw = await rcon('sql SELECT guildId, name, owner FROM guilds');
  const rows = parseSqlRows(raw);
  const map = {};
  rows.forEach(r => {
    const id = String(r.guildId || '').trim();
    const name = (r.name || '').trim();
    if (id && name && name !== 'void' && name !== '0') {
      map[id] = { name, owner: String(r.owner || '').trim() };
    }
  });
  return map;
}

// ── Sync funciones ────────────────────────────────────

const onlineSince   = new Map();
let   currentOnline = new Map(); // nombre → idx de jugadores online ahora

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

    const list = names.map(n => `'${n.replace(/'/g, "''")}'`).join(',');

    // Dos queries separadas — sin JOIN (el JOIN rompe TEXT → devuelve "BLOB")
    const [charRaw, guildMap] = await Promise.all([
      rcon(`sql SELECT char_name, level, id, guild FROM characters WHERE char_name IN (${list})`),
      fetchGuildMap()
    ]);

    const charRows = parseSqlRows(charRaw);
    const charMap  = {};
    charRows.forEach(r => {
      const guildId = String(r.guild || '').trim();
      const guild   = guildId && guildId !== '0' ? guildMap[guildId] : null;
      charMap[r.char_name] = {
        level:     parseInt(r.level) || 0,
        clan:      guild ? guild.name : null,
        is_leader: guild ? String(r.id).trim() === guild.owner : false,
      };
    });

    currentOnline = new Map(players.map(p => [p.name, p.idx]));

    const now = Date.now();
    names.forEach(n => { if (!onlineSince.has(n)) onlineSince.set(n, now); });
    for (const [n] of onlineSince) { if (!names.includes(n)) onlineSince.delete(n); }

    const upserts = names.map(name => ({
      name,
      level:        charMap[name]?.level     ?? 0,
      clan:         charMap[name]?.clan      ?? null,
      is_leader:    charMap[name]?.is_leader ?? false,
      online_since: onlineSince.get(name),
      updated_at:   new Date().toISOString(),
    }));

    await supabase.from('online_players').upsert(upserts, { onConflict: 'name' });
    await supabase.from('online_players').delete()
      .not('name', 'in', `(${names.map(n => `"${n}"`).join(',')})`);

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
      if (playerIdx === undefined) continue;

      let rconNote;
      if (!templateId) {
        rconNote = 'Sin template_id — actualizar el ID en MERCADO y reintentar.';
      } else {
        try {
          const resp = await rcon(`con ${playerIdx} SpawnItem ${templateId} 1`);
          console.log(`[bridge] SpawnItem response: "${resp}"`);
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
    // Dos queries separadas — sin JOIN
    const [charRaw, guildMap] = await Promise.all([
      rcon('sql SELECT char_name, level, id, guild FROM characters WHERE char_name != "" ORDER BY level DESC LIMIT 1000'),
      fetchGuildMap()
    ]);

    const rows = parseSqlRows(charRaw);
    if (!rows.length) return;

    const upserts = rows.map(r => {
      const guildId = String(r.guild || '').trim();
      const guild   = guildId && guildId !== '0' ? guildMap[guildId] : null;
      return {
        name:       r.char_name,
        level:      parseInt(r.level) || 0,
        clan:       guild ? guild.name : null,
        updated_at: new Date().toISOString(),
      };
    });

    await supabase.from('characters_ranking').upsert(upserts, { onConflict: 'name' });
    console.log(`[bridge] Ranking actualizado (${rows.length} personajes)`);
  } catch (e) {
    console.error('[bridge] Error sync ranking:', e.message);
  }
}

async function syncClans() {
  try {
    // Dos queries separadas — sin JOIN
    const [guildMap, charRaw] = await Promise.all([
      fetchGuildMap(),
      rcon('sql SELECT id, char_name, guild FROM characters WHERE level > 0 LIMIT 500')
    ]);

    if (!Object.keys(guildMap).length) return;

    const charRows = parseSqlRows(charRaw);

    // Mapa id → char_name (para nombre del líder)
    const charIdMap = {};
    charRows.forEach(r => {
      if (r.id) charIdMap[String(r.id).trim()] = r.char_name;
    });

    // Contar miembros por guildId
    const memberCount = {};
    charRows.forEach(r => {
      const gId = String(r.guild || '').trim();
      if (gId && gId !== '0') memberCount[gId] = (memberCount[gId] || 0) + 1;
    });

    const upserts = Object.entries(guildMap).map(([guildId, g]) => ({
      clan_name:     g.name,
      leader_name:   charIdMap[g.owner] || null,
      leader_id:     parseInt(g.owner)  || null,
      members_count: memberCount[guildId] || 0,
      updated_at:    new Date().toISOString(),
    }));

    // upsert — la columna de imagen es "logo" en esta tabla
    await supabase.from('clans').upsert(upserts, { onConflict: 'clan_name' });
    console.log(`[bridge] ${upserts.length} clanes sincronizados`);
  } catch (e) {
    console.error('[bridge] Error sync clans:', e.message);
  }
}

// ── Thrall mata jefe / 3 calaveras / KO ──────────────
// game_events confirmados:
//   eventType 86  → NPC killed   (objectName = víctima, causerName = thrall/jugador)
//   eventType 115 → NPC kill alt (ídem)
//   eventType 106 → probable KO/dormido
//
// Patrones de boss/3-calaveras en objectName:
//   Boss_*         → jefes grandes
//   *Champion*     → campeones
//   *Warchief*     → jefes de guerra
//   *_Unique*      → únicos nombrados
//   *Sorcerer*     → hechiceros nombrados
//   (ajustá la lista según los NPCs de tu servidor)

const announcedThrallKills = new Set();
let   lastKillRowid        = 0; // arranca en 0, se inicializa al primer poll

// Patrones que indican boss o NPC de 3 calaveras
const BOSS_PATTERNS = [
  /^Boss_/i,
  /Champion/i,
  /Warchief/i,
  /Warlord/i,
  /_Unique/i,
  /Sorcerer/i,
  /Serpentman.*Leader/i,
  /King.*Cobra/i,
  /Undead.*Dragon/i,
  /Warmaker/i,
  /Demogorgon/i,
  /Arena.*Champion/i,
];

function isBossOrThreeSkull(name) {
  return BOSS_PATTERNS.some(re => re.test(name));
}

async function checkThrallBossKills() {
  try {
    // Inicializar el puntero al rowid más alto actual (para no anunciar historial viejo)
    if (lastKillRowid === 0) {
      const raw = await rcon('sql SELECT MAX(rowid) AS maxid FROM game_events WHERE eventType IN (86, 115, 106) AND causerName != ""');
      const rows = parseSqlRows(raw);
      lastKillRowid = parseInt(rows[0]?.maxid || '0') || 0;
      console.log(`[thrall-kill] Inicializado en rowid ${lastKillRowid}`);
      return; // primera corrida solo inicializa
    }

    // Solo eventos NUEVOS (más altos que el último procesado)
    const raw = await rcon(
      `sql SELECT rowid, eventType, objectName, causerName FROM game_events ` +
      `WHERE rowid > ${lastKillRowid} AND eventType IN (86, 115, 106) ` +
      `AND causerName != '' AND causerName IS NOT NULL ` +
      `ORDER BY rowid ASC LIMIT 50`
    );
    const rows = parseSqlRows(raw);
    if (!rows.length) return;

    // Obtener nombres de jugadores humanos para distinguir thralls
    const playerNames = new Set([...currentOnline.keys()]);

    for (const row of rows) {
      const rowid     = parseInt(row.rowid);
      if (rowid > lastKillRowid) lastKillRowid = rowid;

      const key = String(rowid);
      if (announcedThrallKills.has(key)) continue;
      announcedThrallKills.add(key);

      const causer    = (row.causerName  || '').trim();
      const victim    = (row.objectName  || '').trim();
      const evType    = parseInt(row.eventType);

      // Solo anunciar si el causer NO es un jugador humano online (= es thrall)
      if (playerNames.has(causer)) continue;

      const isKO   = evType === 106;
      const isBoss = isBossOrThreeSkull(victim);

      if (!isBoss) continue; // solo bosses / 3 calaveras

      const msg = isKO
        ? `💀 Laaaa que habil con el maso... ${causer}! dejo KO a ${victim}. Harto esclavo va a tener.`
        : `💀 Laaaa que fuerte que es... ${causer}! mato a ${victim}, si lo veo, le tiro un beso!!`;
      await rcon(`broadcast ${msg}`);
      console.log(`[thrall-kill] ${msg}`);
    }

    if (announcedThrallKills.size > 2000) announcedThrallKills.clear();
  } catch (e) {
    console.error('[thrall-kill] Error:', e.message);
  }
}

// ── Notificaciones programadas ────────────────────────
// Lun–Vie: PVP activo 20:00–23:00 | Sáb–Dom: Asedio de Bases 20:00–23:00
// Zona horaria Argentina (UTC-3)

const BROADCAST_TZ_OFFSET = -3;
const sentBroadcasts = new Set();

const SCHEDULED_BROADCASTS = [
  {
    key:     'pvp_start',
    hour:    20, minute: 0,
    days:    [1, 2, 3, 4, 5],
    message: '⚔️ Cuidado Exiliados! El PVP esta ACTIVO hasta las 23:00 hs. Preparen sus armas!',
  },
  {
    key:     'pvp_end',
    hour:    23, minute: 0,
    days:    [1, 2, 3, 4, 5],
    message: '😌 Uff... termino el PVP por hoy! Ahora si a viciar tranquilos. Buenas noches!',
  },
  {
    key:     'siege_start',
    hour:    20, minute: 0,
    days:    [6, 0],
    message: '🏰 Muajaja! Comenzo la HORA DE LOS ASEDIOS! Cuiden sus Bases Exiliados! La purga ha comenzado!',
  },
  {
    key:     'siege_end',
    hour:    23, minute: 0,
    days:    [6, 0],
    message: '🛡️ Ha terminado el Ataque a Bases por hoy! Ahora a descansar... si pueden. Buenas noches!',
  },
];

function getArgentinaTime() {
  const now   = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  return new Date(utcMs + BROADCAST_TZ_OFFSET * 3_600_000);
}

async function checkScheduledBroadcasts() {
  const ar  = getArgentinaTime();
  const day = ar.getDay(), hour = ar.getHours(), min = ar.getMinutes();

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
      console.log(`[broadcast] ✓ ${evt.key} — ${hour}:${String(min).padStart(2,'0')} AR`);
    } catch (e) {
      console.error(`[broadcast] Error ${evt.key}:`, e.message);
    }
  }
}

// ── NPC Kill Milestones ───────────────────────────────
// Avisa al jugador cuando llega a 100, 200, 300... kills de bichos.
// Se guarda en memoria — si el bridge se reinicia vuelve a avisar desde 0, lo cual está bien.

const npcMilestoneTracker = new Map(); // charName → último hito avisado

async function checkNpcKillMilestones() {
  try {
    if (!currentOnline.size) return;

    const list = [...currentOnline.keys()]
      .map(n => `'${n.replace(/'/g, "''")}'`).join(',');

    const raw = await rcon(
      `sql SELECT causerName, COUNT(*) AS kills FROM game_events ` +
      `WHERE eventType IN (86, 115) AND causerName IN (${list}) ` +
      `GROUP BY causerName`
    );
    const rows = parseSqlRows(raw);

    for (const row of rows) {
      const name  = (row.causerName || '').trim();
      const kills = parseInt(row.kills) || 0;
      if (!name || kills < 100) continue;

      const milestone     = Math.floor(kills / 100) * 100;
      const lastMilestone = npcMilestoneTracker.get(name) || 0;
      if (milestone <= lastMilestone) continue;

      npcMilestoneTracker.set(name, milestone);
      try {
        await rcon(
          `directmessage "Dragones y Demonios" "${name}" ` +
          `"⚔️ ${name}, llevas ${kills} criaturas eliminadas! ` +
          `Entrá al sitio y fijate como vas en el ranking. Seguí asi y habrá premios! ` +
          `dragonesydemonios.vercel.app"`
        );
        console.log(`[npc-milestone] 🎯 ${name}: ${kills} kills → hito ${milestone}`);
      } catch (e) {
        console.error(`[npc-milestone] Error mensaje a ${name}:`, e.message);
      }
    }
  } catch (e) {
    console.error('[npc-milestone] Error:', e.message);
  }
}

// ── PVP Kill Ranking ──────────────────────────────────
// Detecta kills jugador-vs-jugador (eventType 114) y suma en Supabase.

let lastPvpRowid = 0;

async function checkPvpKills() {
  try {
    // Primera corrida: inicializar puntero sin anunciar historial
    if (lastPvpRowid === 0) {
      const raw = await rcon(
        `sql SELECT MAX(rowid) AS maxid FROM game_events WHERE eventType = 114 AND causerName != ''`
      );
      const rows = parseSqlRows(raw);
      lastPvpRowid = parseInt(rows[0]?.maxid || '0') || 0;
      console.log(`[pvp] Inicializado en rowid ${lastPvpRowid}`);
      return;
    }

    // Solo eventos nuevos
    const raw = await rcon(
      `sql SELECT rowid, objectName, causerName FROM game_events ` +
      `WHERE rowid > ${lastPvpRowid} AND eventType = 114 ` +
      `AND causerName != '' AND objectName != '' ` +
      `ORDER BY rowid ASC LIMIT 50`
    );
    const rows = parseSqlRows(raw);
    if (!rows.length) return;

    // Verificar qué nombres son personajes jugadores (no thralls ni NPCs)
    const allNames = [...new Set(
      rows.flatMap(r => [r.causerName?.trim(), r.objectName?.trim()].filter(Boolean))
    )];
    const nameList = allNames.map(n => `'${n.replace(/'/g, "''")}'`).join(',');
    const charRaw  = await rcon(`sql SELECT char_name FROM characters WHERE char_name IN (${nameList})`);
    const charRows = parseSqlRows(charRaw);
    const playerSet = new Set(charRows.map(r => r.char_name?.trim()).filter(Boolean));

    for (const row of rows) {
      const rowid  = parseInt(row.rowid);
      if (rowid > lastPvpRowid) lastPvpRowid = rowid;

      const killer = row.causerName?.trim();
      const victim = row.objectName?.trim();

      // Ambos deben ser personajes jugadores para que sea PVP real
      if (!playerSet.has(killer) || !playerSet.has(victim)) continue;

      // Upsert en Supabase — incrementar kills
      const { data: existing } = await supabase
        .from('pvp_ranking')
        .select('kills')
        .eq('char_name', killer)
        .maybeSingle();

      const newKills = (existing?.kills || 0) + 1;
      await supabase.from('pvp_ranking').upsert({
        char_name:    killer,
        kills:        newKills,
        last_kill_at: new Date().toISOString(),
      }, { onConflict: 'char_name' });

      console.log(`[pvp] ⚔️ ${killer} → ${victim} (total bajas: ${newKills})`);
    }
  } catch (e) {
    console.error('[pvp] Error:', e.message);
  }
}

// ── Loop principal ────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('\n🐉  Bridge Dragones y Demonios → Supabase\n');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('ERROR: Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en .env');
    process.exit(1);
  }

  // Test de Supabase al arranque
  try {
    const { error } = await supabase.from('online_players').select('name').limit(1);
    if (error) throw error;
    console.log('[supabase] ✓ Conexión OK');
  } catch (e) {
    console.error('[supabase] ✗ Error de conexión:', e.message);
    console.error('  → Verificá SUPABASE_URL y SUPABASE_SERVICE_KEY en .env');
    process.exit(1);
  }

  // Arranque escalonado — 800ms entre cada llamada RCON para no saturar el servidor
  await syncOnlinePlayers();   await sleep(800);
  await deliverPendingItems(); await sleep(800);
  await syncRanking();         await sleep(800);
  await syncClans();           await sleep(800);
  await checkThrallBossKills(); await sleep(800);
  await checkPvpKills();

  // Online + entregas + verificaciones: cada 30s
  setInterval(async () => {
    await syncOnlinePlayers();
    await deliverPendingItems();
    await sendVerificationCodes();
  }, 30_000);

  // Ranking + clanes: cada 5 min
  setInterval(async () => {
    await syncRanking();
    await syncClans();
  }, 300_000);

  // Notificaciones PVP / Asedio: cada 1 minuto
  setInterval(checkScheduledBroadcasts, 60_000);

  // Thrall mata jefe / 3 calaveras: cada 30s
  setInterval(checkThrallBossKills, 30_000);

  // NPC kill milestones: cada 5 min
  setInterval(checkNpcKillMilestones, 300_000);

  // PVP kills: cada 30s
  setInterval(checkPvpKills, 30_000);
}

run();
