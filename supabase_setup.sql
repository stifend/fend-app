-- =====================================================================
-- NOVOTEL HOTEL DASHBOARD - SETUP DATABASE SUPABASE (VERSI FINAL)
-- =====================================================================
-- Cara pakai:
--   1. Buka project Supabase Anda
--   2. Masuk ke menu "SQL Editor" -> "New query"
--   3. Salin SELURUH isi file ini, lalu klik "Run"
--
-- File ini AMAN dijalankan berulang kali (idempotent). Setiap objek
-- akan di-drop dulu lalu dibuat ulang, jadi tidak akan error meskipun
-- sudah pernah dijalankan sebelumnya.
--
-- Yang akan terbentuk:
--   - Tabel "users" (akun admin & user biasa)
--   - Fungsi login_user()     -> proses LOGIN (cek email + password)
--   - Fungsi register_user()  -> proses PENDAFTARAN akun baru
--   - 1 akun ADMIN + 2 contoh akun USER (lihat bagian paling bawah)
--
-- Catatan keamanan:
--   - Password di-hash dengan bcrypt (ekstensi pgcrypto), TIDAK disimpan
--     sebagai teks biasa.
--   - Pembatasan "admin bisa CRUD, user hanya lihat" diatur di sisi
--     aplikasi (frontend) berdasarkan kolom "role".
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. AKTIFKAN EKSTENSI pgcrypto
--    Dibutuhkan untuk meng-hash password (fungsi crypt & gen_salt).
--    Di Supabase, ekstensi ini berada di schema "extensions".
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


-- ---------------------------------------------------------------------
-- 2. BERSIHKAN OBJEK LAMA (agar bisa dijalankan ulang tanpa error)
-- ---------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.login_user(text, text);
DROP FUNCTION IF EXISTS public.register_user(text, text, text);
-- Tabel users TIDAK di-drop agar data yang sudah ada tidak hilang.
-- Trigger di bawah akan dibuat ulang dengan CREATE OR REPLACE / DROP TRIGGER.


-- ---------------------------------------------------------------------
-- 3. BUAT TABEL "users"
--    Menyimpan semua akun: admin maupun user biasa.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),  -- ID unik otomatis
  name        text NOT NULL,                               -- Nama lengkap
  email       text NOT NULL UNIQUE,                        -- Email (untuk login, harus unik)
  password    text NOT NULL,                               -- Password (disimpan dalam bentuk hash)
  role        text NOT NULL DEFAULT 'user'                 -- Peran: 'admin' atau 'user'
              CHECK (role IN ('admin', 'user')),
  phone       text,                                        -- Nomor telepon (opsional)
  address     text,                                        -- Alamat (opsional)
  created_at  timestamptz NOT NULL DEFAULT now()           -- Tanggal akun dibuat
);

-- Index untuk mempercepat pencarian berdasarkan email
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);


-- ---------------------------------------------------------------------
-- 4. TRIGGER UNTUK HASH PASSWORD OTOMATIS
--    Setiap INSERT / UPDATE password, nilainya otomatis di-hash.
--    Kalau nilai sudah berbentuk hash bcrypt (diawali "$2"), tidak
--    di-hash ulang (mencegah double-hash saat update data lain).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.hash_user_password()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, extensions
AS $$
BEGIN
  IF NEW.password IS NOT NULL AND left(NEW.password, 2) <> '$2' THEN
    NEW.password := crypt(NEW.password, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_hash_user_password ON public.users;
CREATE TRIGGER trg_hash_user_password
  BEFORE INSERT OR UPDATE OF password ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_user_password();


-- ---------------------------------------------------------------------
-- 5. FUNGSI LOGIN
--    Dipanggil dari frontend: supabase.rpc('login_user', {...})
--    Mengembalikan data user (TANPA password) jika email & password
--    cocok. Jika tidak cocok, hasilnya kosong.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.login_user(
  p_email    text,
  p_password text
)
RETURNS TABLE (
  id         uuid,
  name       text,
  email      text,
  role       text,
  phone      text,
  address    text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT u.id, u.name, u.email, u.role, u.phone, u.address, u.created_at
  FROM public.users u
  WHERE u.email = lower(p_email)
    AND u.password = crypt(p_password, u.password);
$$;


-- ---------------------------------------------------------------------
-- 6. FUNGSI PENDAFTARAN (REGISTER)
--    Dipanggil dari halaman pendaftaran:
--      supabase.rpc('register_user', {...})
--    Membuat akun baru dengan role 'user'. Jika email sudah dipakai,
--    akan memunculkan error "Email sudah terdaftar".
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.register_user(
  p_name     text,
  p_email    text,
  p_password text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.users WHERE email = lower(p_email)) THEN
    RAISE EXCEPTION 'Email sudah terdaftar';
  END IF;

  INSERT INTO public.users (name, email, password, role)
  VALUES (p_name, lower(p_email), p_password, 'user');
END;
$$;


-- ---------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) + POLICY
--    RLS diaktifkan. Akses lewat anon key diizinkan; pembatasan peran
--    (admin vs user) diatur di sisi aplikasi (frontend).
-- ---------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Boleh baca users" ON public.users;
CREATE POLICY "Boleh baca users"
  ON public.users FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Boleh tambah users" ON public.users;
CREATE POLICY "Boleh tambah users"
  ON public.users FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Boleh ubah users" ON public.users;
CREATE POLICY "Boleh ubah users"
  ON public.users FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Boleh hapus users" ON public.users;
CREATE POLICY "Boleh hapus users"
  ON public.users FOR DELETE
  USING (true);


-- ---------------------------------------------------------------------
-- 8. IZIN AKSES FUNGSI RPC UNTUK ANON KEY
--    Agar login & register bisa dipanggil dari frontend.
-- ---------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.login_user(text, text)         TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_user(text, text, text) TO anon, authenticated;


-- ---------------------------------------------------------------------
-- 9. DATA AWAL (SEED)
--    Membuat 1 akun ADMIN dan 2 contoh user.
--    Password ditulis biasa di sini, otomatis di-hash oleh trigger.
--
--    >>> AKUN ADMIN UNTUK LOGIN <<<
--      Email    : admin@novotel.com
--      Password : admin123
--
--    >>> CONTOH AKUN USER (hanya bisa melihat) <<<
--      Email    : rina.amelia@email.com   |  Password : user123
--      Email    : andi.putra@email.com    |  Password : user123
-- ---------------------------------------------------------------------
INSERT INTO public.users (name, email, password, role, phone, address)
VALUES
  ('Administrator', 'admin@novotel.com', 'admin123', 'admin',
   '+62 812-0000-0001', 'Kantor Pusat Novotel'),
  ('Rina Amelia',  'rina.amelia@email.com',  'user123', 'user',
   '+62 812-3456-7890', 'Jl. Merdeka No. 123, Jakarta'),
  ('Andi Putra',   'andi.putra@email.com',   'user123', 'user',
   '+62 812-3456-7891', 'Jl. Sudirman No. 456, Surabaya')
ON CONFLICT (email) DO NOTHING;


-- =====================================================================
-- SELESAI. Database siap digunakan.
-- Login admin: admin@novotel.com / admin123
-- =====================================================================
