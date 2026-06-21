-- ====================================
-- CREATE MEMBER ACCOUNT
-- ====================================
-- Script untuk membuat 1 akun member di database Supabase
-- Gunakan script ini di Supabase SQL Editor
-- ====================================

-- 1. CREATE TABLE users (jika belum ada)
-- Skip step ini jika table sudah ada

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- 2. INSERT 1 AKUN MEMBER
-- ====================================

INSERT INTO users (name, email, password, role, phone, address)
VALUES (
  'John Member',                    -- Nama member
  'member@novotel.com',             -- Email member
  '123456',                         -- Password (plain text - untuk demo)
  'user',                           -- Role: 'user' (bukan 'admin')
  '+62 812-3456-7890',             -- Telepon
  'Jl. Sudirman No. 456, Jakarta'  -- Alamat
)
ON CONFLICT (email) DO NOTHING;   -- Skip jika email sudah ada

-- ====================================
-- 3. VERIFY - Cek apakah data masuk
-- ====================================

SELECT id, name, email, role, phone, address, created_at
FROM users
WHERE email = 'member@novotel.com';

-- ====================================
-- EXPECTED RESULT:
-- ====================================
-- id                                 | name         | email                | role | phone              | address                         | created_at
-- -----------------------------------|--------------|----------------------|------|--------------------|--------------------------------|-------------------------
-- abc123-uuid...                     | John Member  | member@novotel.com   | user | +62 812-3456-7890  | Jl. Sudirman No. 456, Jakarta  | 2026-06-14 10:00:00

-- ====================================
-- 4. CLEANUP (Optional)
-- ====================================
-- Jika ingin hapus akun member (untuk testing ulang):

-- DELETE FROM users WHERE email = 'member@novotel.com';
