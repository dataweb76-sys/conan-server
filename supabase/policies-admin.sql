-- ══════════════════════════════════════════════════════
--  Políticas RLS para el panel admin
--  Pegar en: supabase.com > SQL Editor > New query > Run
-- ══════════════════════════════════════════════════════

-- Admin: leer todas las solicitudes (incluyendo pendientes de otros)
DROP POLICY IF EXISTS "admin read requests"      ON requests;
DROP POLICY IF EXISTS "admin update requests"    ON requests;
DROP POLICY IF EXISTS "admin read all market"    ON market_items;
DROP POLICY IF EXISTS "admin insert market"      ON market_items;
DROP POLICY IF EXISTS "admin update market"      ON market_items;
DROP POLICY IF EXISTS "admin delete market"      ON market_items;
DROP POLICY IF EXISTS "admin read donations"     ON donations;
DROP POLICY IF EXISTS "admin update donations"   ON donations;

CREATE POLICY "admin read requests"   ON requests    FOR SELECT USING (auth.jwt() ->> 'email' = 'datawebgames@gmail.com');
CREATE POLICY "admin update requests" ON requests    FOR UPDATE USING (auth.jwt() ->> 'email' = 'datawebgames@gmail.com');
CREATE POLICY "admin read all market" ON market_items FOR SELECT USING (auth.jwt() ->> 'email' = 'datawebgames@gmail.com');
CREATE POLICY "admin insert market"   ON market_items FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'datawebgames@gmail.com');
CREATE POLICY "admin update market"   ON market_items FOR UPDATE USING (auth.jwt() ->> 'email' = 'datawebgames@gmail.com');
CREATE POLICY "admin delete market"   ON market_items FOR DELETE USING (auth.jwt() ->> 'email' = 'datawebgames@gmail.com');
CREATE POLICY "admin read donations"  ON donations    FOR SELECT USING (auth.jwt() ->> 'email' = 'datawebgames@gmail.com');
CREATE POLICY "admin update donations" ON donations   FOR UPDATE USING (auth.jwt() ->> 'email' = 'datawebgames@gmail.com');
