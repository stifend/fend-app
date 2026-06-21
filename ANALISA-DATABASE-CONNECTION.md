# 🔍 ANALISA: Koneksi Database Auth Folder

## 📊 HASIL ANALISA

### ❌ STATUS: **TIDAK TERHUBUNG KE DATABASE**

**Alasan:**
Package `@supabase/supabase-js` **BELUM TERINSTALL** di project Anda!

---

## 🔎 DETAIL ANALISA

### 1. ✅ File Konfigurasi Sudah Ada

#### A. File `.env` (Environment Variables)
**Lokasi:** `d:\Semester 4\PFL Semester 4\fend-app\.env`

```env
VITE_SUPABASE_URL=https://qmbqkuxejbgjhfudwehy.supabase.co
VITE_SUPABASE_KEY=sb_publishable_pOrDPsPaBaearve4jceAFA_mjxGdqm-
```

**Status:** ✅ ADA dan sudah diisi
- Supabase URL: `https://qmbqkuxejbgjhfudwehy.supabase.co`
- Supabase Key: `sb_publishable_pOrDPsPaBaearve4jceAFA_mjxGdqm-`

---

#### B. File `src/lib/supabase.js` (Koneksi Client)
**Lokasi:** `d:\Semester 4\PFL Semester 4\fend-app\src\lib\supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Konfigurasi Supabase belum lengkap...');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Status:** ✅ ADA dan kode sudah benar

---

### 2. ✅ Halaman Auth Sudah Implement Database

#### A. Login.jsx
**Lokasi:** `src/pages/auth/Login.jsx`

**Code:**
```javascript
import { supabase } from "../../lib/supabase";

const handleSubmit = async (e) => {
  // ... code
  
  // PANGGIL FUNCTION DATABASE
  const { data, error } = await supabase.rpc("login_user", {
    p_email: dataForm.email,
    p_password: dataForm.password,
  });
  
  // ... handle result
};
```

**Fitur:**
- ✅ Import supabase client
- ✅ Panggil function `login_user` di database
- ✅ Handle success (simpan token + data user ke localStorage)
- ✅ Handle error (tampilkan pesan error)
- ✅ Redirect ke dashboard setelah login berhasil

**Status:** ✅ KODE SUDAH BENAR

---

#### B. Register.jsx
**Lokasi:** `src/pages/auth/Register.jsx`

**Code:**
```javascript
import { supabase } from "../../lib/supabase";

const handleSubmit = async (e) => {
  // ... code
  
  // PANGGIL FUNCTION DATABASE
  const { error } = await supabase.rpc("register_user", {
    p_name: dataForm.name,
    p_email: dataForm.email,
    p_password: dataForm.password,
  });
  
  // ... handle result
};
```

**Fitur:**
- ✅ Import supabase client
- ✅ Panggil function `register_user` di database
- ✅ Validasi password (min 6 karakter)
- ✅ Validasi konfirmasi password
- ✅ Handle error (misal: email sudah terdaftar)
- ✅ Redirect ke login setelah register berhasil

**Status:** ✅ KODE SUDAH BENAR

---

#### C. Forgot.jsx
**Lokasi:** `src/pages/auth/Forgot.jsx`

**Code:**
```javascript
// TIDAK ADA IMPORT SUPABASE
const handleSubmit = (e) => {
  // Simulasi kirim link reset password
  setTimeout(() => {
    setSuccess("Link reset password telah dikirim...");
  }, 600);
};
```

**Fitur:**
- ❌ Belum connect ke database
- ⚠️ Hanya simulasi (setTimeout)
- ℹ️ Butuh implement fungsi reset password di Supabase

**Status:** ⚠️ BELUM TERHUBUNG DATABASE (masih dummy)

---

### 3. ❌ MASALAH UTAMA: Package Belum Terinstall

**Check Package:**
```bash
npm list @supabase/supabase-js
```

**Result:**
```
fend-app@0.0.0 D:\Semester 4\PFL Semester 4\fend-app
└── (empty)

Exit Code: 1
```

**Artinya:**
- ❌ Package `@supabase/supabase-js` **TIDAK TERINSTALL**
- ❌ Import `import { createClient } from '@supabase/supabase-js'` **AKAN ERROR**
- ❌ Login & Register **TIDAK AKAN BERFUNGSI**

---

## 🎯 KESIMPULAN

### ✅ Yang Sudah Benar:

1. **File Konfigurasi:**
   - ✅ `.env` → Sudah ada dan terisi (URL + Key Supabase)
   - ✅ `src/lib/supabase.js` → Sudah ada dan kode benar

2. **Code Auth Pages:**
   - ✅ `Login.jsx` → Sudah implement `supabase.rpc("login_user")`
   - ✅ `Register.jsx` → Sudah implement `supabase.rpc("register_user")`
   - ✅ Error handling → Sudah lengkap
   - ✅ Validasi form → Sudah lengkap
   - ✅ Loading state → Sudah ada
   - ✅ Redirect → Sudah benar

3. **Database Functions:**
   - Halaman auth sudah memanggil 2 function:
     - `login_user(p_email, p_password)` → Return user data jika email/password cocok
     - `register_user(p_name, p_email, p_password)` → Insert user baru

### ❌ Yang Masih Kurang:

1. **Package Supabase BELUM TERINSTALL**
   - Ini adalah masalah utama!
   - Tanpa package ini, aplikasi akan error saat import

2. **Forgot Password:**
   - Belum terhubung database
   - Masih dummy/simulasi

3. **Database Functions:**
   - Perlu dipastikan function `login_user` dan `register_user` sudah ada di Supabase
   - Perlu dipastikan table `users` sudah ada

---

## 🔧 CARA MEMPERBAIKI

### Step 1: Install Package Supabase

```bash
npm install @supabase/supabase-js
```

**Expected Output:**
```
added 1 package, and audited X packages in Xs

found 0 vulnerabilities
```

---

### Step 2: Restart Dev Server

```bash
# Stop dev server (Ctrl+C)
npm run dev
```

---

### Step 3: Test Login/Register

1. **Buka browser:** http://localhost:5174/login
2. **Test Register:**
   - Klik "Register"
   - Isi form (nama, email, password)
   - Klik "Register"
   - **Expected:** Jika berhasil → redirect ke login
   - **Expected:** Jika email sudah ada → error "Email sudah terdaftar"

3. **Test Login:**
   - Masukkan email + password yang sudah didaftar
   - Klik "Login"
   - **Expected:** Jika berhasil → redirect ke dashboard
   - **Expected:** Jika salah → error "Email atau password salah"

---

### Step 4: Cek Console Browser

**Buka Console (F12):**

**❌ Jika Package Belum Terinstall:**
```
Failed to resolve module specifier "@supabase/supabase-js"
```

**✅ Jika Package Sudah Terinstall:**
- No errors
- Request ke Supabase API terlihat di Network tab

---

### Step 5: Verifikasi Database Function

**Pastikan function ini ada di Supabase:**

#### A. Function `login_user`

```sql
CREATE OR REPLACE FUNCTION login_user(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  role TEXT,
  created_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.name, u.email, u.role, u.created_at
  FROM users u
  WHERE u.email = p_email
    AND u.password = p_password; -- NOTE: Idealnya pakai bcrypt/hash
END;
$$;
```

#### B. Function `register_user`

```sql
CREATE OR REPLACE FUNCTION register_user(
  p_name TEXT,
  p_email TEXT,
  p_password TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Cek apakah email sudah terdaftar
  IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email sudah terdaftar';
  END IF;

  -- Insert user baru
  INSERT INTO users (name, email, password, role)
  VALUES (p_name, p_email, p_password, 'user');
END;
$$;
```

#### C. Table `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- NOTE: Idealnya pakai bcrypt
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📋 CHECKLIST KONEKSI DATABASE

### Before Install Package:
- [x] ✅ File `.env` ada dan terisi
- [x] ✅ File `src/lib/supabase.js` ada
- [x] ✅ Login.jsx import dan panggil supabase
- [x] ✅ Register.jsx import dan panggil supabase
- [ ] ❌ Package `@supabase/supabase-js` terinstall

### After Install Package:
- [ ] ✅ Package terinstall (`npm list @supabase/supabase-js` → found)
- [ ] ✅ Dev server berjalan tanpa error
- [ ] ✅ Login page bisa diakses
- [ ] ✅ Register page bisa diakses
- [ ] ✅ Console browser no errors
- [ ] ✅ Request ke Supabase terlihat di Network tab

### Database Verification:
- [ ] ✅ Table `users` ada di Supabase
- [ ] ✅ Function `login_user` ada di Supabase
- [ ] ✅ Function `register_user` ada di Supabase
- [ ] ✅ Test register berhasil (data masuk ke table)
- [ ] ✅ Test login berhasil (dapat user data)

---

## 🎯 FLOW AUTHENTICATION

### Register Flow:
```
1. User isi form Register
2. Frontend validasi (password min 6, confirm match)
3. Frontend panggil: supabase.rpc("register_user", {...})
4. Backend (Supabase):
   a. Cek email sudah ada? → Error
   b. Insert user baru ke table users
5. Frontend dapat response:
   a. Success → Redirect ke Login
   b. Error → Tampilkan error message
```

### Login Flow:
```
1. User isi form Login (email + password)
2. Frontend panggil: supabase.rpc("login_user", {...})
3. Backend (Supabase):
   a. Cek email + password di table users
   b. Return user data jika cocok
   c. Return empty array jika tidak cocok
4. Frontend dapat response:
   a. Success (data.length > 0):
      - Simpan token ke localStorage
      - Simpan user data ke localStorage
      - Panggil onLogin(user)
      - Redirect ke /dashboard
   b. Failed (data.length === 0):
      - Tampilkan error "Email atau password salah"
```

---

## 🔒 SECURITY NOTES

### ⚠️ Password Security:

**Current Implementation:**
- ❌ Password disimpan plain text (tidak di-hash)
- ❌ Tidak secure untuk production

**Recommendation untuk Production:**
```javascript
// Frontend: Hash password sebelum kirim
import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash(password, 10);

// Backend: Compare hash
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

**Untuk Project Kuliah/Demo:**
- ✅ Plain text password OK (untuk learning)
- ✅ Fokus ke flow authentication

---

## 📊 DIAGRAM KONEKSI

```
┌──────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐      ┌─────────────┐                   │
│  │  Login.jsx  │      │ Register.jsx│                   │
│  │             │      │             │                   │
│  │ - Email     │      │ - Name      │                   │
│  │ - Password  │      │ - Email     │                   │
│  │ - Submit    │      │ - Password  │                   │
│  └──────┬──────┘      └──────┬──────┘                   │
│         │                    │                           │
│         └────────┬───────────┘                           │
│                  │                                       │
│         ┌────────▼────────┐                             │
│         │ supabase.js     │ ◄──── .env                  │
│         │                 │       (URL + Key)           │
│         │ createClient()  │                             │
│         └────────┬────────┘                             │
│                  │                                       │
└──────────────────┼──────────────────────────────────────┘
                   │
                   │ HTTPS Request
                   │
┌──────────────────▼──────────────────────────────────────┐
│               BACKEND (Supabase)                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────────────────┐                              │
│  │  Database Functions    │                              │
│  │                        │                              │
│  │  • login_user()        │ ◄──── Check email+password  │
│  │  • register_user()     │ ◄──── Insert new user       │
│  │                        │                              │
│  └───────────┬────────────┘                              │
│              │                                            │
│  ┌───────────▼────────────┐                              │
│  │   Table: users         │                              │
│  │                        │                              │
│  │  • id (UUID)           │                              │
│  │  • name (TEXT)         │                              │
│  │  • email (TEXT)        │                              │
│  │  • password (TEXT)     │                              │
│  │  • role (TEXT)         │                              │
│  │  • created_at          │                              │
│  │                        │                              │
│  └────────────────────────┘                              │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🎓 KESIMPULAN AKHIR

### ❌ SAAT INI: TIDAK TERHUBUNG

**Alasan Utama:**
```
Package @supabase/supabase-js BELUM TERINSTALL
```

**Dampak:**
- Import error saat run dev server
- Login tidak bisa jalan
- Register tidak bisa jalan
- Application crash di auth pages

---

### ✅ SETELAH INSTALL PACKAGE: AKAN TERHUBUNG

**Jika function database sudah ada:**
- ✅ Login berfungsi (cek email+password di database)
- ✅ Register berfungsi (insert user baru ke database)
- ✅ Data user tersimpan di Supabase
- ✅ Authentication flow lengkap

---

## 🚀 NEXT STEPS

1. **Install Package** (PALING PENTING!)
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Restart Dev Server**
   ```bash
   npm run dev
   ```

3. **Test Auth Pages**
   - Register user baru
   - Login dengan user yang sudah terdaftar

4. **Implement Forgot Password** (Optional)
   - Buat function `reset_password` di Supabase
   - Connect Forgot.jsx dengan function tersebut

5. **Security Enhancement** (Untuk Production)
   - Hash password dengan bcrypt
   - Implement JWT token
   - Add refresh token

---

**Dibuat:** 14 Juni 2026  
**Status:** ❌ BELUM TERHUBUNG (Package belum terinstall)  
**Action Required:** Install `@supabase/supabase-js`

**Setelah install package → Status akan menjadi:** ✅ TERHUBUNG
