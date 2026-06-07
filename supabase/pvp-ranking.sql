-- ══════════════════════════════════════════════════════
--  PVP Ranking — Dragones y Demonios
--  Pegar en: supabase.com > SQL Editor > New query > Run
-- ══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS pvp_ranking (
  char_name    TEXT PRIMARY KEY,
  kills        INTEGER NOT NULL DEFAULT 0,
  last_kill_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pvp_ranking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read pvp_ranking" ON pvp_ranking;
CREATE POLICY "read pvp_ranking" ON pvp_ranking FOR SELECT USING (true);
