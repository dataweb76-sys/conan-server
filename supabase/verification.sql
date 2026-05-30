-- ══════════════════════════════════════════════════════
--  Verificación de personaje in-game
--  Pegar en: supabase.com > SQL Editor > New query > Run
-- ══════════════════════════════════════════════════════

-- Nuevas columnas en profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified          BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_code TEXT;

-- Restringir lectura de perfiles: solo el dueño puede ver su propio perfil
-- (protege el código de verificación de quedar expuesto)
DROP POLICY IF EXISTS "read profiles"    ON profiles;
DROP POLICY IF EXISTS "read own profile" ON profiles;
CREATE POLICY "read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Función server-side para verificar el código (el código nunca llega al cliente)
CREATE OR REPLACE FUNCTION verify_character(code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_code TEXT;
BEGIN
  SELECT verification_code INTO stored_code
  FROM profiles
  WHERE id = auth.uid() AND verified = false;

  IF stored_code IS NOT NULL AND upper(stored_code) = upper(code) THEN
    UPDATE profiles
    SET verified = true, verification_code = NULL
    WHERE id = auth.uid();
    RETURN true;
  END IF;

  RETURN false;
END;
$$;
