-- =====================================================================
-- NOVOTEL HOTEL DASHBOARD - SETUP DATABASE SUPABASE (LENGKAP)
-- =====================================================================
-- Cara pakai:
--   1. Buka project Supabase Anda
--   2. Masuk ke menu "SQL Editor" -> "New query"
--   3. Salin SELURUH isi file ini, lalu klik "Run"
--
-- File ini AMAN dijalankan berulang kali (idempotent).
--
-- Yang terbentuk:
--   TABEL
--     - users         : akun admin & member (login)
--     - customers      : profil pelanggan + tier membership
--     - reservations   : data reservasi/booking kamar
--   FUNGSI RPC (dipanggil dari frontend via supabase.rpc(...))
--     - login_user()              : LOGIN (cek email + password)
--     - register_user()           : DAFTAR akun member baru
--     - create_reservation()      : buat booking + auto-upsert customer & tier
--     - get_member_reservations() : riwayat reservasi milik 1 member
--     - get_all_reservations()    : semua reservasi (untuk admin)
--     - update_payment_status()   : ubah status pembayaran reservasi
--     - get_member_summary()      : ringkasan total spending + tier member
--
-- Catatan keamanan:
--   - Password di-hash bcrypt (pgcrypto), TIDAK disimpan sebagai teks biasa.
--   - Pembatasan peran (admin CRUD, member read-only) diatur di frontend
--     berdasarkan kolom "role". RLS di sini permisif via anon key; untuk
--     produksi sebaiknya diperketat (lihat catatan di bagian RLS).
--   - RPC mengembalikan key camelCase (roomType, totalPayment, dll) agar
--     cocok langsung dengan kode React tanpa mapping tambahan.
-- =====================================================================


-- =====================================================================
-- 1. EKSTENSI
-- =====================================================================
-- pgcrypto: untuk hash password (crypt & gen_salt).
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


-- =====================================================================
-- 2. BERSIHKAN FUNGSI LAMA (agar bisa dijalankan ulang tanpa error)
-- =====================================================================
DROP FUNCTION IF EXISTS public.login_user(text, text);
DROP FUNCTION IF EXISTS public.register_user(text, text, text);
DROP FUNCTION IF EXISTS public.create_reservation(text, text, text, text, text, date, date, integer, integer, text);
DROP FUNCTION IF EXISTS public.get_member_reservations(text);
DROP FUNCTION IF EXISTS public.get_all_reservations();
DROP FUNCTION IF EXISTS public.update_payment_status(text, text);
DROP FUNCTION IF EXISTS public.get_member_summary(text);
DROP FUNCTION IF EXISTS public.get_all_customers();
DROP FUNCTION IF EXISTS public.update_reservation(text, text, text, text, text, text);
DROP FUNCTION IF EXISTS public.update_customer(text, text, text, text, text, text);
DROP FUNCTION IF EXISTS public.get_all_feedback();
DROP FUNCTION IF EXISTS public.create_feedback(text, text, text, integer, text, text);
DROP FUNCTION IF EXISTS public.update_feedback_status(text, text);
DROP FUNCTION IF EXISTS public.create_lead(text, text, text);
DROP FUNCTION IF EXISTS public.get_all_leads();
DROP FUNCTION IF EXISTS public.membership_tier_for(numeric);
DROP FUNCTION IF EXISTS public.discount_for_tier(text);


-- =====================================================================
-- 3. TABEL users  (akun admin & member)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL UNIQUE,
  password    text NOT NULL,                       -- disimpan sebagai hash bcrypt
  role        text NOT NULL DEFAULT 'user'
              CHECK (role IN ('admin', 'user')),
  phone       text,
  address     text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);


-- =====================================================================
-- 4. TABEL customers  (profil pelanggan + tier membership)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id          text PRIMARY KEY,                    -- contoh: 'P001' / 'MEMBER123456'
  name        text NOT NULL,
  email       text NOT NULL UNIQUE,
  phone       text,
  address     text,
  city        text,
  membership  text NOT NULL DEFAULT 'None'
              CHECK (membership IN ('None', 'Silver', 'Gold', 'Platinum')),
  join_date   date NOT NULL DEFAULT current_date,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers (email);


-- =====================================================================
-- 5. TABEL reservations  (data booking kamar)
-- =====================================================================
-- Kolom disimpan snake_case di DB; RPC akan meng-alias ke camelCase
-- saat dikembalikan ke frontend.
CREATE TABLE IF NOT EXISTS public.reservations (
  id               text PRIMARY KEY,               -- contoh: 'P001-RES123456'
  reservation      text NOT NULL,                  -- nomor reservasi tampil
  name             text NOT NULL,
  email            text NOT NULL,
  phone            text,
  address          text,
  room_type        text NOT NULL
                   CHECK (room_type IN ('Standard', 'Deluxe', 'Suite', 'Executive')),
  check_in         date NOT NULL,
  check_out        date NOT NULL,
  nights           integer NOT NULL DEFAULT 1 CHECK (nights > 0),
  guests           integer NOT NULL DEFAULT 1 CHECK (guests > 0),
  subtotal         numeric(14,2) NOT NULL DEFAULT 0,
  discount_amount  numeric(14,2) NOT NULL DEFAULT 0,
  membership_tier  text NOT NULL DEFAULT 'None'
                   CHECK (membership_tier IN ('None', 'Silver', 'Gold', 'Platinum')),
  total_payment    numeric(14,2) NOT NULL DEFAULT 0,
  special_request  text,
  payment          text NOT NULL DEFAULT 'Pending'
                   CHECK (payment IN ('Lunas', 'Pending', 'Belum Bayar')),
  booking_date     timestamptz NOT NULL DEFAULT now(),
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_dates CHECK (check_out > check_in)
);

CREATE INDEX IF NOT EXISTS idx_reservations_email   ON public.reservations (email);
CREATE INDEX IF NOT EXISTS idx_reservations_payment ON public.reservations (payment);


-- =====================================================================
-- 5b. TABEL feedback  (ulasan & keluhan customer)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.feedback (
  id            text PRIMARY KEY,                  -- contoh: 'FB001'
  customer_id   text,                              -- relasi opsional ke customers.id
  customer_name text NOT NULL,
  email         text,
  rating        integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  type          text NOT NULL DEFAULT 'Suggestion'
                CHECK (type IN ('Compliment', 'Suggestion', 'Complaint')),
  message       text NOT NULL,
  status        text NOT NULL DEFAULT 'Pending'
                CHECK (status IN ('Resolved', 'Pending')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback (rating);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback (status);


-- =====================================================================
-- 5c. TABEL leads  (calon pelanggan dari CRM landing page)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  company     text,
  status      text NOT NULL DEFAULT 'New'
              CHECK (status IN ('New', 'Contacted', 'Qualified', 'Won', 'Lost')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_email  ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);


-- =====================================================================
-- 6. TRIGGER HASH PASSWORD (tabel users)
-- =====================================================================
-- Setiap INSERT/UPDATE password otomatis di-hash. Kalau sudah berbentuk
-- hash bcrypt (diawali '$2'), tidak di-hash ulang (cegah double-hash).
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


-- =====================================================================
-- 7. HELPER MEMBERSHIP (selaras dengan src/utils/membership.js)
-- =====================================================================
-- Ambang tier berbasis total pengeluaran (Rp):
--   None     : 0
--   Silver   : >= 1
--   Gold     : >= 5.000.000
--   Platinum : >= 15.000.000
CREATE OR REPLACE FUNCTION public.membership_tier_for(p_total numeric)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
           WHEN COALESCE(p_total, 0) >= 15000000 THEN 'Platinum'
           WHEN COALESCE(p_total, 0) >= 5000000  THEN 'Gold'
           WHEN COALESCE(p_total, 0) >= 1        THEN 'Silver'
           ELSE 'None'
         END;
$$;

-- Diskon per tier: None 0, Silver 5%, Gold 10%, Platinum 15%
CREATE OR REPLACE FUNCTION public.discount_for_tier(p_tier text)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_tier
           WHEN 'Platinum' THEN 0.15
           WHEN 'Gold'     THEN 0.10
           WHEN 'Silver'   THEN 0.05
           ELSE 0
         END;
$$;


-- =====================================================================
-- 8. RPC: LOGIN
-- =====================================================================
-- Frontend: supabase.rpc('login_user', { p_email, p_password })
-- Mengembalikan data user (tanpa password) jika cocok; kosong jika tidak.
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


-- =====================================================================
-- 9. RPC: REGISTER (member baru, role 'user')
-- =====================================================================
-- Frontend: supabase.rpc('register_user', { p_name, p_email, p_password })
-- Sekaligus membuat record customer awal (tier 'None') agar konsisten.
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
DECLARE
  v_email text := lower(p_email);
BEGIN
  IF EXISTS (SELECT 1 FROM public.users WHERE email = v_email) THEN
    RAISE EXCEPTION 'Email sudah terdaftar';
  END IF;

  INSERT INTO public.users (name, email, password, role)
  VALUES (p_name, v_email, p_password, 'user');

  -- Buat profil customer awal jika belum ada
  INSERT INTO public.customers (id, name, email, membership)
  VALUES ('MEMBER' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6),
          p_name, v_email, 'None')
  ON CONFLICT (email) DO NOTHING;
END;
$$;


-- =====================================================================
-- 10. RPC: BUAT RESERVASI (booking)
-- =====================================================================
-- Frontend: supabase.rpc('create_reservation', { ... })
-- Logika:
--   1. Hitung subtotal = harga kamar x nights
--   2. Diskon mengikuti tier SAAT INI (sebelum booking ini dihitung)
--   3. Simpan reservasi (status awal 'Pending')
--   4. Upsert customer + perbarui tier berdasarkan total spending terbaru
-- Mengembalikan baris reservasi (camelCase) yang baru dibuat.
CREATE OR REPLACE FUNCTION public.create_reservation(
  p_email          text,
  p_name           text,
  p_phone          text,
  p_address        text,
  p_room_type      text,
  p_check_in       date,
  p_check_out      date,
  p_guests         integer,
  p_special_request text DEFAULT NULL
)
RETURNS TABLE (
  id              text,
  reservation     text,
  name            text,
  email           text,
  phone           text,
  address         text,
  "roomType"      text,
  "checkIn"       date,
  "checkOut"      date,
  nights          integer,
  guests          integer,
  subtotal        numeric,
  "discountAmount" numeric,
  "membershipTier" text,
  "totalPayment"  numeric,
  "specialRequest" text,
  payment         text,
  "bookingDate"   timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_email     text := lower(p_email);
  v_price     numeric;
  v_nights    integer;
  v_subtotal  numeric;
  v_prev_spent numeric;
  v_tier      text;
  v_discount  numeric;
  v_disc_amt  numeric;
  v_total     numeric;
  v_cust_id   text;
  v_res_id    text;
  v_res_no    text;
BEGIN
  -- Harga per tipe kamar (selaras dengan frontend)
  v_price := CASE p_room_type
               WHEN 'Standard'  THEN 800000
               WHEN 'Deluxe'    THEN 1200000
               WHEN 'Suite'     THEN 2500000
               WHEN 'Executive' THEN 4000000
               ELSE NULL
             END;

  IF v_price IS NULL THEN
    RAISE EXCEPTION 'Tipe kamar tidak valid: %', p_room_type;
  END IF;

  IF p_check_out <= p_check_in THEN
    RAISE EXCEPTION 'Tanggal check-out harus setelah check-in';
  END IF;

  v_nights   := (p_check_out - p_check_in);
  v_subtotal := v_price * v_nights;

  -- Tier saat ini = berdasarkan total spending sebelum booking ini
  SELECT COALESCE(SUM(r.total_payment), 0)
    INTO v_prev_spent
  FROM public.reservations r
  WHERE r.email = v_email;

  v_tier     := public.membership_tier_for(v_prev_spent);
  v_discount := public.discount_for_tier(v_tier);
  v_disc_amt := round(v_subtotal * v_discount);
  v_total    := v_subtotal - v_disc_amt;

  -- ID customer (pakai yang ada, atau buat baru)
  SELECT c.id INTO v_cust_id FROM public.customers c WHERE c.email = v_email;
  IF v_cust_id IS NULL THEN
    v_cust_id := 'MEMBER' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);
  END IF;

  v_res_no := 'RSV-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);
  v_res_id := v_cust_id || '-RES' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);

  -- Simpan reservasi
  INSERT INTO public.reservations (
    id, reservation, name, email, phone, address,
    room_type, check_in, check_out, nights, guests,
    subtotal, discount_amount, membership_tier, total_payment,
    special_request, payment, booking_date
  )
  VALUES (
    v_res_id, v_res_no, p_name, v_email, p_phone, p_address,
    p_room_type, p_check_in, p_check_out, v_nights, p_guests,
    v_subtotal, v_disc_amt, v_tier, v_total,
    p_special_request, 'Pending', now()
  );

  -- Upsert customer + perbarui tier berdasarkan total spending terbaru
  INSERT INTO public.customers (id, name, email, phone, address, membership)
  VALUES (v_cust_id, p_name, v_email, p_phone, p_address,
          public.membership_tier_for(v_prev_spent + v_total))
  ON CONFLICT (email) DO UPDATE
    SET name       = COALESCE(EXCLUDED.name, public.customers.name),
        phone      = COALESCE(EXCLUDED.phone, public.customers.phone),
        address    = COALESCE(EXCLUDED.address, public.customers.address),
        membership = public.membership_tier_for(v_prev_spent + v_total);

  -- Kembalikan reservasi yang baru dibuat (camelCase)
  RETURN QUERY
  SELECT r.id, r.reservation, r.name, r.email, r.phone, r.address,
         r.room_type, r.check_in, r.check_out, r.nights, r.guests,
         r.subtotal, r.discount_amount, r.membership_tier, r.total_payment,
         r.special_request, r.payment, r.booking_date
  FROM public.reservations r
  WHERE r.id = v_res_id;
END;
$$;


-- =====================================================================
-- 11. RPC: RIWAYAT RESERVASI MEMBER
-- =====================================================================
-- Frontend: supabase.rpc('get_member_reservations', { p_email })
CREATE OR REPLACE FUNCTION public.get_member_reservations(p_email text)
RETURNS TABLE (
  id              text,
  reservation     text,
  name            text,
  email           text,
  phone           text,
  address         text,
  "roomType"      text,
  "checkIn"       date,
  "checkOut"      date,
  nights          integer,
  guests          integer,
  subtotal        numeric,
  "discountAmount" numeric,
  "membershipTier" text,
  "totalPayment"  numeric,
  "specialRequest" text,
  payment         text,
  "bookingDate"   timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT r.id, r.reservation, r.name, r.email, r.phone, r.address,
         r.room_type, r.check_in, r.check_out, r.nights, r.guests,
         r.subtotal, r.discount_amount, r.membership_tier, r.total_payment,
         r.special_request, r.payment, r.booking_date
  FROM public.reservations r
  WHERE r.email = lower(p_email)
  ORDER BY r.booking_date DESC;
$$;


-- =====================================================================
-- 12. RPC: SEMUA RESERVASI (untuk halaman admin)
-- =====================================================================
-- Frontend: supabase.rpc('get_all_reservations')
CREATE OR REPLACE FUNCTION public.get_all_reservations()
RETURNS TABLE (
  id              text,
  reservation     text,
  name            text,
  email           text,
  phone           text,
  address         text,
  "roomType"      text,
  "checkIn"       date,
  "checkOut"      date,
  nights          integer,
  guests          integer,
  subtotal        numeric,
  "discountAmount" numeric,
  "membershipTier" text,
  "totalPayment"  numeric,
  "specialRequest" text,
  payment         text,
  "bookingDate"   timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT r.id, r.reservation, r.name, r.email, r.phone, r.address,
         r.room_type, r.check_in, r.check_out, r.nights, r.guests,
         r.subtotal, r.discount_amount, r.membership_tier, r.total_payment,
         r.special_request, r.payment, r.booking_date
  FROM public.reservations r
  ORDER BY r.booking_date DESC;
$$;


-- =====================================================================
-- 13. RPC: UPDATE STATUS PEMBAYARAN
-- =====================================================================
-- Frontend: supabase.rpc('update_payment_status', { p_id, p_status })
CREATE OR REPLACE FUNCTION public.update_payment_status(
  p_id     text,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF p_status NOT IN ('Lunas', 'Pending', 'Belum Bayar') THEN
    RAISE EXCEPTION 'Status pembayaran tidak valid: %', p_status;
  END IF;

  UPDATE public.reservations
  SET payment = p_status
  WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservasi tidak ditemukan: %', p_id;
  END IF;
END;
$$;


-- =====================================================================
-- 14. RPC: RINGKASAN MEMBER (total spending + tier)
-- =====================================================================
-- Frontend: supabase.rpc('get_member_summary', { p_email })
CREATE OR REPLACE FUNCTION public.get_member_summary(p_email text)
RETURNS TABLE (
  email           text,
  "totalSpent"    numeric,
  "totalBooking"  bigint,
  "paidBooking"   bigint,
  "pendingBooking" bigint,
  tier            text,
  discount        numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  WITH agg AS (
    SELECT
      lower(p_email)                                            AS email,
      COALESCE(SUM(r.total_payment), 0)                         AS total_spent,
      COUNT(*)                                                  AS total_booking,
      COUNT(*) FILTER (WHERE r.payment = 'Lunas')               AS paid_booking,
      COUNT(*) FILTER (WHERE r.payment = 'Pending')             AS pending_booking
    FROM public.reservations r
    WHERE r.email = lower(p_email)
  )
  SELECT
    agg.email,
    agg.total_spent,
    agg.total_booking,
    agg.paid_booking,
    agg.pending_booking,
    public.membership_tier_for(agg.total_spent)                 AS tier,
    public.discount_for_tier(public.membership_tier_for(agg.total_spent)) AS discount
  FROM agg;
$$;


-- =====================================================================
-- 14b. RPC: SEMUA CUSTOMER (untuk halaman admin)
-- =====================================================================
-- Frontend: supabase.rpc('get_all_customers')
CREATE OR REPLACE FUNCTION public.get_all_customers()
RETURNS TABLE (
  id          text,
  name        text,
  email       text,
  phone       text,
  address     text,
  city        text,
  membership  text,
  "joinDate"  date
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT c.id, c.name, c.email, c.phone, c.address, c.city, c.membership, c.join_date
  FROM public.customers c
  ORDER BY c.created_at DESC;
$$;


-- =====================================================================
-- 14c. RPC: UPDATE DATA RESERVASI (nama, email, phone, dll)
-- =====================================================================
-- Frontend: supabase.rpc('update_reservation', { p_id, p_name, ... })
CREATE OR REPLACE FUNCTION public.update_reservation(
  p_id          text,
  p_name        text,
  p_email       text,
  p_phone       text,
  p_address     text,
  p_reservation text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  UPDATE public.reservations
  SET name        = COALESCE(p_name, name),
      email       = COALESCE(lower(p_email), email),
      phone       = COALESCE(p_phone, phone),
      address     = COALESCE(p_address, address),
      reservation = COALESCE(p_reservation, reservation)
  WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservasi tidak ditemukan: %', p_id;
  END IF;
END;
$$;


-- =====================================================================
-- 14d. RPC: UPDATE DATA CUSTOMER
-- =====================================================================
-- Frontend: supabase.rpc('update_customer', { p_id, p_name, ... })
CREATE OR REPLACE FUNCTION public.update_customer(
  p_id      text,
  p_name    text,
  p_email   text,
  p_phone   text,
  p_address text,
  p_city    text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  UPDATE public.customers
  SET name    = COALESCE(p_name, name),
      email   = COALESCE(lower(p_email), email),
      phone   = COALESCE(p_phone, phone),
      address = COALESCE(p_address, address),
      city    = COALESCE(p_city, city)
  WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Customer tidak ditemukan: %', p_id;
  END IF;
END;
$$;


-- =====================================================================
-- 14e. RPC: SEMUA FEEDBACK
-- =====================================================================
-- Frontend: supabase.rpc('get_all_feedback')
CREATE OR REPLACE FUNCTION public.get_all_feedback()
RETURNS TABLE (
  id             text,
  "customerId"   text,
  "customerName" text,
  email          text,
  rating         integer,
  type           text,
  message        text,
  status         text,
  date           timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT f.id, f.customer_id, f.customer_name, f.email, f.rating,
         f.type, f.message, f.status, f.created_at
  FROM public.feedback f
  ORDER BY f.created_at DESC;
$$;


-- =====================================================================
-- 14f. RPC: BUAT FEEDBACK
-- =====================================================================
-- Frontend: supabase.rpc('create_feedback', { ... })
-- Tipe (Compliment/Suggestion/Complaint) ditentukan otomatis dari rating.
CREATE OR REPLACE FUNCTION public.create_feedback(
  p_customer_id   text,
  p_customer_name text,
  p_email         text,
  p_rating        integer,
  p_message       text,
  p_status        text DEFAULT 'Pending'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_type text;
  v_id   text;
BEGIN
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating harus antara 1 sampai 5';
  END IF;

  v_type := CASE
              WHEN p_rating >= 4 THEN 'Compliment'
              WHEN p_rating = 3  THEN 'Suggestion'
              ELSE 'Complaint'
            END;

  v_id := 'FB' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);

  INSERT INTO public.feedback
    (id, customer_id, customer_name, email, rating, type, message, status)
  VALUES
    (v_id, p_customer_id, p_customer_name, lower(p_email), p_rating, v_type, p_message,
     COALESCE(p_status, 'Pending'));
END;
$$;


-- =====================================================================
-- 14g. RPC: UPDATE STATUS FEEDBACK
-- =====================================================================
-- Frontend: supabase.rpc('update_feedback_status', { p_id, p_status })
CREATE OR REPLACE FUNCTION public.update_feedback_status(
  p_id     text,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF p_status NOT IN ('Resolved', 'Pending') THEN
    RAISE EXCEPTION 'Status feedback tidak valid: %', p_status;
  END IF;

  UPDATE public.feedback SET status = p_status WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Feedback tidak ditemukan: %', p_id;
  END IF;
END;
$$;


-- =====================================================================
-- 14h. RPC: BUAT LEAD (dari CRM landing page lead form)
-- =====================================================================
-- Frontend: supabase.rpc('create_lead', { p_name, p_email, p_company })
CREATE OR REPLACE FUNCTION public.create_lead(
  p_name    text,
  p_email   text,
  p_company text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF p_name IS NULL OR length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'Nama wajib diisi';
  END IF;
  IF p_email IS NULL OR length(trim(p_email)) = 0 THEN
    RAISE EXCEPTION 'Email wajib diisi';
  END IF;

  INSERT INTO public.leads (name, email, company, status)
  VALUES (trim(p_name), lower(trim(p_email)), p_company, 'New');
END;
$$;


-- =====================================================================
-- 14i. RPC: SEMUA LEAD (untuk dashboard admin CRM)
-- =====================================================================
-- Frontend: supabase.rpc('get_all_leads')
CREATE OR REPLACE FUNCTION public.get_all_leads()
RETURNS TABLE (
  id         uuid,
  name       text,
  email      text,
  company    text,
  status     text,
  "createdAt" timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT l.id, l.name, l.email, l.company, l.status, l.created_at
  FROM public.leads l
  ORDER BY l.created_at DESC;
$$;


-- =====================================================================
-- 15. ROW LEVEL SECURITY (RLS) + POLICY
-- =====================================================================
-- CATATAN PRODUKSI:
--   Policy di bawah permisif (USING true) supaya anon key bisa membaca/menulis,
--   karena pembatasan peran saat ini ada di frontend. Untuk keamanan nyata,
--   pertimbangkan memakai Supabase Auth + auth.uid() dan memperketat policy
--   (mis. member hanya boleh baca reservasinya sendiri). RPC di atas memakai
--   SECURITY DEFINER sehingga tetap berjalan walau policy diperketat.
-- ---------------------------------------------------------------------
ALTER TABLE public.users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads        ENABLE ROW LEVEL SECURITY;

-- users
DROP POLICY IF EXISTS "users_select" ON public.users;
CREATE POLICY "users_select" ON public.users FOR SELECT USING (true);
DROP POLICY IF EXISTS "users_insert" ON public.users;
CREATE POLICY "users_insert" ON public.users FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "users_update" ON public.users;
CREATE POLICY "users_update" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "users_delete" ON public.users;
CREATE POLICY "users_delete" ON public.users FOR DELETE USING (true);

-- customers
DROP POLICY IF EXISTS "customers_select" ON public.customers;
CREATE POLICY "customers_select" ON public.customers FOR SELECT USING (true);
DROP POLICY IF EXISTS "customers_insert" ON public.customers;
CREATE POLICY "customers_insert" ON public.customers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "customers_update" ON public.customers;
CREATE POLICY "customers_update" ON public.customers FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "customers_delete" ON public.customers;
CREATE POLICY "customers_delete" ON public.customers FOR DELETE USING (true);

-- reservations
DROP POLICY IF EXISTS "reservations_select" ON public.reservations;
CREATE POLICY "reservations_select" ON public.reservations FOR SELECT USING (true);
DROP POLICY IF EXISTS "reservations_insert" ON public.reservations;
CREATE POLICY "reservations_insert" ON public.reservations FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "reservations_update" ON public.reservations;
CREATE POLICY "reservations_update" ON public.reservations FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "reservations_delete" ON public.reservations;
CREATE POLICY "reservations_delete" ON public.reservations FOR DELETE USING (true);

-- feedback
DROP POLICY IF EXISTS "feedback_select" ON public.feedback;
CREATE POLICY "feedback_select" ON public.feedback FOR SELECT USING (true);
DROP POLICY IF EXISTS "feedback_insert" ON public.feedback;
CREATE POLICY "feedback_insert" ON public.feedback FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "feedback_update" ON public.feedback;
CREATE POLICY "feedback_update" ON public.feedback FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "feedback_delete" ON public.feedback;
CREATE POLICY "feedback_delete" ON public.feedback FOR DELETE USING (true);

-- leads
DROP POLICY IF EXISTS "leads_select" ON public.leads;
CREATE POLICY "leads_select" ON public.leads FOR SELECT USING (true);
DROP POLICY IF EXISTS "leads_insert" ON public.leads;
CREATE POLICY "leads_insert" ON public.leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "leads_update" ON public.leads;
CREATE POLICY "leads_update" ON public.leads FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "leads_delete" ON public.leads;
CREATE POLICY "leads_delete" ON public.leads FOR DELETE USING (true);


-- =====================================================================
-- 16. GRANT EXECUTE UNTUK ANON KEY
-- =====================================================================
GRANT EXECUTE ON FUNCTION public.login_user(text, text)               TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_user(text, text, text)       TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_reservation(text, text, text, text, text, date, date, integer, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_member_reservations(text)         TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_reservations()                TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_payment_status(text, text)     TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_member_summary(text)              TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_customers()                   TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_reservation(text, text, text, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_customer(text, text, text, text, text, text)    TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_feedback()                    TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_feedback(text, text, text, integer, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_feedback_status(text, text)    TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_lead(text, text, text)         TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_leads()                       TO anon, authenticated;


-- =====================================================================
-- 17. DATA AWAL (SEED)
-- =====================================================================
-- Akun login (password otomatis di-hash trigger)
--   ADMIN  : admin@novotel.com / admin123
--   MEMBER : member@novotel.com / member123
INSERT INTO public.users (name, email, password, role, phone, address)
VALUES
  ('Administrator', 'admin@novotel.com', 'admin123', 'admin',
   '+62 812-0000-0001', 'Kantor Pusat Novotel'),
  ('Member Novotel', 'member@novotel.com', 'member123', 'user',
   '+62 812-3456-7890', 'Jl. Merdeka No. 123, Jakarta')
ON CONFLICT (email) DO NOTHING;

-- Profil customer (untuk akun member di atas)
INSERT INTO public.customers (id, name, email, phone, address, city, membership, join_date)
VALUES
  ('P001', 'Member Novotel', 'member@novotel.com', '+62 812-3456-7890', 'Jl. Merdeka No. 123, Jakarta', 'Jakarta', 'Silver', '2024-01-15')
ON CONFLICT (email) DO NOTHING;

-- Reservasi contoh (milik akun member di atas)
INSERT INTO public.reservations
  (id, reservation, name, email, phone, address, room_type, check_in, check_out,
   nights, guests, subtotal, discount_amount, membership_tier, total_payment, payment, booking_date)
VALUES
  ('P001-RES000001', 'RSV-7684', 'Member Novotel', 'member@novotel.com', '+62 812-3456-7890', 'Jl. Merdeka No. 123, Jakarta',
   'Deluxe',   '2026-01-10', '2026-01-12', 2, 2, 2400000, 0, 'Silver', 2400000, 'Lunas',   '2026-01-05T08:00:00Z'),
  ('P001-RES000002', 'RSV-7685', 'Member Novotel', 'member@novotel.com', '+62 812-3456-7890', 'Jl. Merdeka No. 123, Jakarta',
   'Standard', '2026-02-14', '2026-02-17', 3, 1, 2400000, 0, 'Silver', 2400000, 'Pending', '2026-02-10T09:30:00Z')
ON CONFLICT (id) DO NOTHING;


-- Feedback contoh
INSERT INTO public.feedback (id, customer_id, customer_name, email, rating, type, message, status)
VALUES
  ('FB001', 'P001', 'Member Novotel', 'member@novotel.com', 5, 'Compliment', 'Pelayanan sangat memuaskan, staff ramah!', 'Resolved'),
  ('FB002', 'P001', 'Member Novotel', 'member@novotel.com', 3, 'Suggestion',  'Sarapan bisa lebih bervariasi.',           'Pending')
ON CONFLICT (id) DO NOTHING;


-- =====================================================================
-- SELESAI. Database siap digunakan.
--   Login admin  : admin@novotel.com / admin123
--   Login member : member@novotel.com / member123
-- =====================================================================