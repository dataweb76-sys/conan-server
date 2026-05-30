'use strict';
require('dotenv').config();
const express = require('express');
const net     = require('net');
const path    = require('path');
const fs      = require('fs');
const { createClient } = require('@supabase/supabase-js');

const app  = express();
const PORT = process.env.PORT || 8100;

// CORS — permite que Vercel (u otro origen) llame a la API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,x-admin-key');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const RCON_HOST  = process.env.RCON_HOST  || '190.174.183.144';
const RCON_PORT  = parseInt(process.env.RCON_PORT)  || 25575;
const RCON_PASS  = process.env.RCON_PASS  || 'dani123';
const ADMIN_KEY  = process.env.ADMIN_KEY  || 'dani_admin_2024';

// Supabase (SERVICE_KEY para operaciones del servidor)
const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

const DATA = p => path.join(__dirname, 'data', p);

// ── RCON ─────────────────────────────────────────────────────────────────────

function buildPacket(id, type, body) {
  const b = Buffer.from(body, 'utf8');
  const pkt = Buffer.alloc(4 + b.length + 10);
  pkt.writeInt32LE(b.length + 10, 0);
  pkt.writeInt32LE(id, 4); pkt.writeInt32LE(type, 8);
  b.copy(pkt, 12); return pkt;
}

// Cola RCON: el servidor solo acepta una conexión a la vez.
// Todas las llamadas pasan por aquí en orden, sin superponerse.
let _rconBusy = false;
const _rconQueue = [];

function rconExecute(command) {
  return new Promise((resolve, reject) => {
    _rconQueue.push({ command, resolve, reject });
    _drainRcon();
  });
}

function _drainRcon() {
  if (_rconBusy || !_rconQueue.length) return;
  _rconBusy = true;
  const { command, resolve, reject } = _rconQueue.shift();
  _rconConnect(command)
    .then(resolve, reject)
    .finally(() => { _rconBusy = false; setImmediate(_drainRcon); });
}

function _rconConnect(command) {
  return new Promise((resolve, reject) => {
    const sock = new net.Socket();
    let buf = Buffer.alloc(0), authed = false, done = false;
    function finish(err, val) {
      if (done) return; done = true;
      clearTimeout(timer); sock.destroy();
      err ? reject(err) : resolve(val);
    }
    const timer = setTimeout(() => finish(new Error('RCON timeout')), 10000);
    sock.connect(RCON_PORT, RCON_HOST, () => sock.write(buildPacket(1, 3, RCON_PASS)));
    sock.on('data', chunk => {
      buf = Buffer.concat([buf, chunk]);
      while (buf.length >= 4) {
        const size = buf.readInt32LE(0);
        if (size < 10 || size > 65536) { finish(new Error('Paquete inválido')); return; }
        if (buf.length < 4 + size) break;
        const id = buf.readInt32LE(4), type = buf.readInt32LE(8);
        const body = buf.slice(12, Math.max(12, size + 2)).toString('utf8').replace(/\x00/g,'').trim();
        buf = buf.slice(4 + size);
        if (!authed) {
          if (type === 2) {
            if (id === -1) { finish(new Error('Contraseña RCON incorrecta')); return; }
            authed = true; sock.write(buildPacket(2, 2, command));
          }
        } else { finish(null, body); return; }
      }
    });
    sock.on('error', e => finish(e));
    sock.on('timeout', () => finish(new Error('Timeout')));
  });
}

// ── Parsers ───────────────────────────────────────────────────────────────────

function parseListPlayers(raw) {
  if (!raw) return [];
  return raw.split('\n').map(l => l.trim()).filter(l => /^\d+/.test(l))
    .map(line => {
      const p = line.split('|').map(s => s.trim());
      return { idx: parseInt(p[0])||0, name: p[1]||'?', steamName: p[2]||null, ping: null };
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

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchCharData(names) {
  if (!names.length) return {};
  const list = names.map(n => `'${n.replace(/'/g,"''")}'`).join(',');
  try {
    const raw  = await rconExecute(`sql SELECT c.char_name, c.level, c.id, g.name as clan, g.owner FROM characters c LEFT JOIN guilds g ON c.guild = g.guildId WHERE c.char_name IN (${list})`);
    const rows = parseSqlRows(raw);
    const map  = {};
    rows.forEach(r => {
      map[r.char_name] = {
        level:    parseInt(r.level)||null,
        clan:     r.clan && r.clan !== 'void' ? r.clan : null,
        isLeader: r.owner && r.id && r.owner.trim() === r.id.trim(),
      };
    });
    return map;
  } catch { return {}; }
}

const sessions = new Map();
function trackSessions(players) {
  const now = Date.now(), names = new Set(players.map(p => p.name));
  players.forEach(p => { if (!sessions.has(p.name)) sessions.set(p.name, now); p.onlineSince = sessions.get(p.name); });
  for (const [n] of sessions) if (!names.has(n)) sessions.delete(n);
}

function readJson(file) { try { return JSON.parse(fs.readFileSync(DATA(file),'utf8')); } catch { return null; } }
function writeJson(file, data) { fs.writeFileSync(DATA(file), JSON.stringify(data, null, 2)); }

// ── Cache jugadores (30 s) ────────────────────────────────────────────────────

let playerCache = { players: [], ts: 0 };
const TTL = 30_000;

// ── Rutas ─────────────────────────────────────────────────────────────────────

// Jugadores online
app.get('/api/players', async (req, res) => {
  const now = Date.now();
  if (!req.query.force && now - playerCache.ts < TTL) {
    const fresh = playerCache.players.map(p => ({ ...p, onlineMs: sessions.has(p.name) ? now - sessions.get(p.name) : (p.onlineMs||0) }));
    return res.json({ ok: true, players: fresh, cached: true, ts: playerCache.ts });
  }
  try {
    const raw = await rconExecute('listplayers');
    let   pls = parseListPlayers(raw);
    trackSessions(pls);
    const map = await fetchCharData(pls.map(p => p.name));
    pls = pls.map(p => ({ ...p, ...(map[p.name]||{}), onlineMs: now - (sessions.get(p.name)||now) }));
    playerCache = { players: pls, ts: now };
    res.json({ ok: true, players: pls, ts: now });
  } catch (err) {
    res.json({ ok: false, error: err.message, players: playerCache.players, ts: now });
  }
});

// Estadísticas generales
app.get('/api/stats', async (req, res) => {
  try {
    const pRaw   = await rconExecute("sql SELECT COUNT(*) as total FROM characters");
    const cRaw   = await rconExecute("sql SELECT COUNT(*) as total FROM guilds");
    const topRaw = await rconExecute("sql SELECT c.char_name, c.level, g.name as clan FROM characters c LEFT JOIN guilds g ON c.guild = g.guildId ORDER BY c.level DESC LIMIT 1");
    const pRows   = parseSqlRows(pRaw);
    const cRows   = parseSqlRows(cRaw);
    const topRows = parseSqlRows(topRaw);
    res.json({
      ok:           true,
      totalPlayers: parseInt(pRows[0]?.total)  || 0,
      totalClans:   parseInt(cRows[0]?.total)  || 0,
      topPlayer:    topRows[0] ? { name: topRows[0].char_name, level: parseInt(topRows[0].level)||0, clan: topRows[0].clan||null } : null,
    });
  } catch (err) { res.json({ ok: false, error: err.message }); }
});

// Ranking de personajes por nivel
app.get('/api/ranking', async (req, res) => {
  try {
    const raw  = await rconExecute("sql SELECT c.char_name, c.level, g.name as clan FROM characters c LEFT JOIN guilds g ON c.guild = g.guildId WHERE c.level > 0 ORDER BY c.level DESC LIMIT 15");
    const rows = parseSqlRows(raw);
    const onlineNames = new Set(playerCache.players.map(p => p.name));
    const players = rows.map(r => ({
      name:   r.char_name,
      level:  parseInt(r.level) || 0,
      clan:   r.clan && r.clan !== 'void' ? r.clan : null,
      online: onlineNames.has(r.char_name),
    }));
    res.json({ ok: true, players });
  } catch (err) { res.json({ ok: false, error: err.message }); }
});

// Clanes
app.get('/api/clans', async (req, res) => {
  try {
    const raw = await rconExecute(
      "sql SELECT g.name as clan, ldr.char_name as leader, COUNT(c.id) as members FROM guilds g LEFT JOIN characters c ON c.guild = g.guildId LEFT JOIN characters ldr ON ldr.id = g.owner GROUP BY g.guildId ORDER BY members DESC"
    );
    const clans = parseSqlRows(raw).map(r => ({
      name:    r.clan,
      leader:  r.leader,
      members: parseInt(r.members)||0,
    }));
    res.json({ ok: true, clans });
  } catch (err) { res.json({ ok: false, error: err.message }); }
});

// ── Helpers Supabase ──────────────────────────────────────────────────────────

function sbRequired(res) {
  if (!supabase) { res.json({ ok: false, error: 'Supabase no configurado. Revisá el .env' }); return false; }
  return true;
}
function adminCheck(req, res) {
  if (req.headers['x-admin-key'] !== ADMIN_KEY && req.query.key !== ADMIN_KEY)
    { res.status(403).json({ ok: false, error: 'No autorizado.' }); return false; }
  return true;
}

// ── Mercado Pippi ─────────────────────────────────────────────────────────────

// Catálogo público (activos)
app.get('/api/market', async (req, res) => {
  if (!supabase) return res.json({ ok: true, items: readJson('shop.json') || [] }); // fallback local
  const { data, error } = await supabase
    .from('market_items').select('*').eq('active', true).order('sort_order');
  if (error) return res.json({ ok: false, error: error.message });
  res.json({ ok: true, items: data });
});

// Solicitar ítem del mercado
app.post('/api/market/request', async (req, res) => {
  const { characterName, itemId } = req.body || {};
  if (!characterName?.trim() || !itemId) return res.json({ ok: false, error: 'Datos incompletos.' });

  // Verificar personaje en el juego
  try {
    const raw = await rconExecute(`sql SELECT char_name FROM characters WHERE char_name = '${characterName.replace(/'/g,"''")}'`);
    if (!parseSqlRows(raw).length) return res.json({ ok: false, error: 'Personaje no encontrado. Asegurate de haber jugado al menos una vez.' });
  } catch { return res.json({ ok: false, error: 'No se pudo verificar el personaje. Servidor no disponible.' }); }

  if (!supabase) return res.json({ ok: false, error: 'Supabase no configurado.' });

  // Buscar ítem
  const { data: itemData } = await supabase.from('market_items').select('*').eq('id', itemId).single();
  if (!itemData) return res.json({ ok: false, error: 'Ítem no encontrado.' });

  // Verificar solicitud duplicada pendiente
  const { data: dup } = await supabase.from('requests')
    .select('id').eq('character_name', characterName.trim())
    .eq('item_id', itemId).eq('status', 'pending').limit(1);
  if (dup?.length) return res.json({ ok: false, error: 'Ya tenés un pedido pendiente de ese ítem.' });

  const { error } = await supabase.from('requests').insert({
    type: 'market', character_name: characterName.trim(),
    item_id: itemData.id, item_name: itemData.name,
    pippi_cost: itemData.pippi_cost, status: 'pending',
  });
  if (error) return res.json({ ok: false, error: error.message });

  try { await rconExecute(`directmessage Servidor Carlota "Mercado: ${characterName} pidió ${itemData.name} (${itemData.pippi_cost} 🪙)"`); } catch {}
  res.json({ ok: true, message: `¡Pedido de "${itemData.name}" registrado! Juntá las ${itemData.pippi_cost} monedas Pippi y coordinamos en el juego.` });
});

// Solicitar unirse al clan
app.post('/api/clan/request', async (req, res) => {
  const { characterName, message } = req.body || {};
  if (!characterName?.trim()) return res.json({ ok: false, error: 'Escribí el nombre de tu personaje.' });

  try {
    const raw = await rconExecute(`sql SELECT char_name FROM characters WHERE char_name = '${characterName.replace(/'/g,"''")}'`);
    if (!parseSqlRows(raw).length) return res.json({ ok: false, error: 'Personaje no encontrado en el servidor.' });
  } catch { return res.json({ ok: false, error: 'No se pudo verificar el personaje.' }); }

  if (supabase) {
    const { data: dup } = await supabase.from('requests')
      .select('id').eq('character_name', characterName.trim()).eq('type', 'clan').eq('status', 'pending').limit(1);
    if (dup?.length) return res.json({ ok: false, error: 'Ya tenés una solicitud de clan pendiente.' });
    await supabase.from('requests').insert({
      type: 'clan', character_name: characterName.trim(),
      message: (message || '').trim(), status: 'pending',
    });
  } else {
    const requests = readJson('requests.json') || [];
    if (requests.find(r => r.characterName === characterName && r.type === 'clan' && r.status === 'pending'))
      return res.json({ ok: false, error: 'Ya tenés una solicitud de clan pendiente.' });
    requests.push({ type: 'clan', characterName: characterName.trim(), message: (message||'').trim(), ts: Date.now(), status: 'pending' });
    writeJson('requests.json', requests);
  }

  try {
    const msg = message?.trim() ? `Solicitud de clan de ${characterName}: "${message}"` : `${characterName} quiere unirse al clan.`;
    await rconExecute(`directmessage Servidor Carlota "${msg}"`);
  } catch {}
  res.json({ ok: true, message: '¡Solicitud enviada! Carlota te contactará pronto.' });
});

// ── Admin — Solicitudes ───────────────────────────────────────────────────────

app.get('/api/requests', async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('requests').select('*, market_items(name,template_id,pippi_cost)').order('created_at', { ascending: false });
    if (error) return res.json({ ok: false, error: error.message });
    // Normalizar para compatibilidad con el admin panel existente
    const normalized = data.map((r, i) => ({
      _id: r.id, idx: r.id,
      type:          r.type === 'market' ? 'shop' : r.type,
      characterName: r.character_name,
      itemId:        r.item_id,
      itemName:      r.item_name,
      pippiCost:     r.pippi_cost,
      message:       r.message,
      status:        r.status,
      rconNote:      r.rcon_note,
      ts:            new Date(r.created_at).getTime(),
    }));
    return res.json({ ok: true, requests: normalized });
  }
  res.json({ ok: true, requests: readJson('requests.json') || [] });
});

app.post('/api/requests/:id/approve', async (req, res) => {
  const id = req.params.id;
  let item;
  if (supabase) {
    const { data } = await supabase.from('requests').select('*').eq('id', id).single();
    item = data ? { ...data, characterName: data.character_name, type: data.type } : null;
  } else {
    const all = readJson('requests.json') || [];
    item = all[parseInt(id)];
  }
  if (!item) return res.json({ ok: false, error: 'Solicitud no encontrada.' });
  if (item.status !== 'pending') return res.json({ ok: false, error: 'Ya fue procesada.' });
  if (item.type !== 'clan') return res.json({ ok: false, error: 'Solo para solicitudes de clan.' });

  try {
    const gRaw = await rconExecute("sql SELECT g.guildId FROM guilds g JOIN characters c ON g.owner = c.id WHERE c.char_name = 'Carlota'");
    const gRows = parseSqlRows(gRaw);
    if (!gRows.length) return res.json({ ok: false, error: 'Clan de Carlota no encontrado.' });
    const safeName = item.characterName.replace(/'/g, "''");
    await rconExecute(`sql UPDATE characters SET guild = ${gRows[0].guildId} WHERE char_name = '${safeName}'`);

    if (supabase) await supabase.from('requests').update({ status: 'approved', processed_at: new Date().toISOString() }).eq('id', id);
    else { const all = readJson('requests.json') || []; all[parseInt(id)].status = 'approved'; writeJson('requests.json', all); }

    try { await rconExecute(`directmessage Servidor ${item.characterName} "¡Tu solicitud al clan fue aprobada! Bienvenid@ a Los Antiguos."`); } catch {}
    res.json({ ok: true, message: `${item.characterName} fue agregado al clan.` });
  } catch (err) { res.json({ ok: false, error: err.message }); }
});

app.post('/api/requests/:id/reject', async (req, res) => {
  const id = req.params.id;
  if (supabase) {
    const { error } = await supabase.from('requests').update({ status: 'rejected', processed_at: new Date().toISOString() }).eq('id', id);
    if (error) return res.json({ ok: false, error: error.message });
  } else {
    const all = readJson('requests.json') || []; all[parseInt(id)].status = 'rejected'; writeJson('requests.json', all);
  }
  res.json({ ok: true });
});

app.post('/api/requests/:id/deliver', async (req, res) => {
  const id = req.params.id;
  let item;
  if (supabase) {
    const { data } = await supabase.from('requests').select('*, market_items(template_id)').eq('id', id).single();
    item = data ? { ...data, characterName: data.character_name, itemName: data.item_name } : null;
  } else {
    const all = readJson('requests.json') || []; item = all[parseInt(id)];
  }
  if (!item) return res.json({ ok: false, error: 'Pedido no encontrado.' });

  const templateId = item.market_items?.template_id;
  let rconMsg = null, rconOk = false;

  if (templateId) {
    const onlineNames = new Set(playerCache.players.map(p => p.name));
    if (onlineNames.has(item.characterName)) {
      try {
        await rconExecute(`pippi give ${item.characterName} ${templateId} 1`);
        rconOk  = true; rconMsg = `Ítem enviado a ${item.characterName} vía Pippi.`;
        try { await rconExecute(`directmessage Servidor ${item.characterName} "¡Tu pedido de ${item.itemName} fue entregado!"`); } catch {}
      } catch (e) { rconMsg = `Online pero Pippi falló: ${e.message}. Dalo manualmente.`; }
    } else { rconMsg = `${item.characterName} no está online. Dalo cuando entre.`; }
  }

  if (supabase) await supabase.from('requests').update({ status: 'delivered', processed_at: new Date().toISOString(), rcon_note: rconMsg }).eq('id', id);
  else { const all = readJson('requests.json') || []; all[parseInt(id)].status = 'delivered'; writeJson('requests.json', all); }

  res.json({ ok: true, rconOk, rconMsg: rconMsg || 'Marcado como entregado.' });
});

// ── Admin — Gestión del Mercado ───────────────────────────────────────────────

app.get('/api/admin/market', async (req, res) => {
  if (!adminCheck(req, res) || !sbRequired(res)) return;
  const { data, error } = await supabase.from('market_items').select('*').order('sort_order');
  if (error) return res.json({ ok: false, error: error.message });
  res.json({ ok: true, items: data });
});

app.post('/api/admin/market', async (req, res) => {
  if (!adminCheck(req, res) || !sbRequired(res)) return;
  const { name, description, emoji, category, pippi_cost, template_id, sort_order } = req.body || {};
  if (!name?.trim() || pippi_cost == null) return res.json({ ok: false, error: 'Nombre y costo son obligatorios.' });
  const { data, error } = await supabase.from('market_items').insert({
    name: name.trim(), description: (description||'').trim(),
    emoji: emoji||'📦', category: category||'General',
    pippi_cost: parseInt(pippi_cost)||0,
    template_id: template_id||null, sort_order: parseInt(sort_order)||0,
  }).select().single();
  if (error) return res.json({ ok: false, error: error.message });
  res.json({ ok: true, item: data });
});

app.put('/api/admin/market/:id', async (req, res) => {
  if (!adminCheck(req, res) || !sbRequired(res)) return;
  const fields = {};
  ['name','description','emoji','category','pippi_cost','template_id','active','sort_order'].forEach(k => {
    if (req.body[k] !== undefined) fields[k] = req.body[k];
  });
  const { error } = await supabase.from('market_items').update(fields).eq('id', req.params.id);
  if (error) return res.json({ ok: false, error: error.message });
  res.json({ ok: true });
});

app.delete('/api/admin/market/:id', async (req, res) => {
  if (!adminCheck(req, res) || !sbRequired(res)) return;
  const { error } = await supabase.from('market_items').update({ active: false }).eq('id', req.params.id);
  if (error) return res.json({ ok: false, error: error.message });
  res.json({ ok: true });
});

// ── Donaciones ────────────────────────────────────────────────────────────────

app.post('/api/donations', async (req, res) => {
  const { donorName, amountArs, message } = req.body || {};
  if (!amountArs || amountArs < 1000) return res.json({ ok: false, error: 'Monto inválido.' });
  if (supabase) {
    const { error } = await supabase.from('donations').insert({
      donor_name: (donorName||'Anónimo').trim(),
      amount_ars: parseInt(amountArs),
      message:    (message||'').trim(),
      status:     'pending',
    });
    if (error) return res.json({ ok: false, error: error.message });
  }
  res.json({ ok: true, message: '¡Gracias! Recordá transferir el monto al alias danielmfaggi en Mercado Pago.' });
});

app.get('/api/donations/stats', async (req, res) => {
  if (!supabase) return res.json({ ok: true, total: 0, target: 100000, count: 0 });
  const now    = new Date();
  const start  = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { data, error } = await supabase.from('donations').select('amount_ars').eq('status', 'confirmed').gte('created_at', start);
  if (error) return res.json({ ok: false, error: error.message });
  const total = (data || []).reduce((s, r) => s + r.amount_ars, 0);
  res.json({ ok: true, total, target: 100000, count: (data||[]).length });
});
});

app.listen(PORT, () => console.log(`\n  🐉  Dragones y Demonios → http://localhost:${PORT}\n`));
