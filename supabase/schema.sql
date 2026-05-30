-- ══════════════════════════════════════════════════════
--  Dragones y Demonios — Supabase Schema
--  Ejecutar en: supabase.com > SQL Editor > New query
-- ══════════════════════════════════════════════════════

-- ── Jugadores online (actualizado por bridge.js cada 30s) ──
CREATE TABLE IF NOT EXISTS online_players (
  name         TEXT PRIMARY KEY,
  level        INTEGER DEFAULT 0,
  clan         TEXT,
  is_leader    BOOLEAN DEFAULT FALSE,
  online_since BIGINT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Ranking de personajes (actualizado por bridge.js cada 5 min) ──
CREATE TABLE IF NOT EXISTS characters_ranking (
  name       TEXT PRIMARY KEY,
  level      INTEGER DEFAULT 0,
  clan       TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Ítems del mercado Pippi ──
CREATE TABLE IF NOT EXISTS market_items (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  emoji       TEXT NOT NULL DEFAULT '📦',
  category    TEXT NOT NULL DEFAULT 'General',
  pippi_cost  INTEGER NOT NULL DEFAULT 0,
  template_id TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Solicitudes (mercado y clan) ──
CREATE TABLE IF NOT EXISTS requests (
  id             BIGSERIAL PRIMARY KEY,
  type           TEXT NOT NULL CHECK (type IN ('market', 'clan')),
  character_name TEXT NOT NULL,
  item_id        BIGINT REFERENCES market_items(id),
  item_name      TEXT,
  pippi_cost     INTEGER,
  message        TEXT,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','approved','rejected','delivered')),
  rcon_note      TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  processed_at   TIMESTAMPTZ
);

-- ── Donaciones ──
CREATE TABLE IF NOT EXISTS donations (
  id          BIGSERIAL PRIMARY KEY,
  donor_name  TEXT NOT NULL DEFAULT 'Anónimo',
  amount_ars  INTEGER NOT NULL,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','confirmed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS (Row Level Security) ──
ALTER TABLE online_players     ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters_ranking ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests           ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations          ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "read online_players"     ON online_players     FOR SELECT USING (true);
CREATE POLICY "read ranking"            ON characters_ranking FOR SELECT USING (true);
CREATE POLICY "read active market"      ON market_items       FOR SELECT USING (active = true);
CREATE POLICY "read all donations"      ON donations          FOR SELECT USING (true);

-- Escritura pública (los jugadores crean solicitudes y donaciones)
CREATE POLICY "insert requests"  ON requests  FOR INSERT WITH CHECK (true);
CREATE POLICY "insert donations" ON donations FOR INSERT WITH CHECK (true);

-- ── Datos iniciales del mercado ──
INSERT INTO market_items (name, description, emoji, category, pippi_cost, template_id, sort_order) VALUES
  ('Espada de Hierro',          'Hoja de hierro forjada a mano. Primer arma de todo exiliado.',            '⚔️', 'Armas',     50,  '11001', 1),
  ('Hacha de Guerra',           'Perfecta para romper armaduras y sembrar el caos en el campo de batalla.','🪓', 'Armas',     65,  '11061', 2),
  ('Armadura de Placas',        'Set completo de placas de acero. Alta protección ante enemigos y clima.',  '🛡️', 'Armaduras', 200, '52001', 3),
  ('Pico de Hierro',            'Extrae minerales raros con mayor eficiencia. Esencial para el progreso.', '⛏️', 'Recursos',  40,  '51001', 4),
  ('Kit de Supervivencia',      'Comida, vendas y materiales básicos para sobrevivir los primeros días.',  '🎒', 'Recursos',  30,  '18000', 5),
  ('Pergamino de Conocimiento', 'Desbloquea recetas avanzadas y habilidades de construcción.',             '📜', 'Especiales',150, '30000', 6)
ON CONFLICT DO NOTHING;
