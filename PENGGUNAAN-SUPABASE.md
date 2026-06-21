# 📘 PENGGUNAAN SUPABASE DI PROJECT

## 🎯 APA ITU SUPABASE?

**Supabase** adalah platform **Backend-as-a-Service (BaaS)** yang menyediakan:
- 🗄️ **Database PostgreSQL** (untuk menyimpan data)
- 🔐 **Authentication** (untuk login/register)
- 📡 **RESTful API** (untuk komunikasi frontend-backend)
- 🔄 **Real-time subscriptions** (data update otomatis)
- 📦 **Storage** (untuk upload file)

**Analogi Sederhana:**
> Supabase = Database + Backend Server yang sudah jadi.  
> Anda tidak perlu buat server sendiri, tinggal connect dari React.

---

## 📍 DI MANA SUPABASE DIGUNAKAN?

Berdasarkan analisa code, Supabase digunakan di **3 file**:

### 1. ✅ `src/pages/auth/Login.jsx`
### 2. ✅ `src/pages/auth/Register.jsx`
### 3. ✅ `src/pages/UsersPage.jsx`

---

## 🔧 BAGIAN 1: KONFIGURASI SUPABASE

### A. File `.env` (Environment Variables)

**Lokasi:** `d:\Semester 4\PFL Semester 4\fend-app\.env`

```env
VITE_SUPABASE_URL=https://qmbqkuxejbgjhfudwehy.supabase.co
VITE_SUPABASE_KEY=sb_publishable_pOrDPsPaBaearve4jceAFA_mjxGdqm-
```

**Kegunaan:**
- Menyimpan **URL database Supabase** Anda
- Menyimpan **API Key** untuk autentikasi
- File ini **TIDAK** di-commit ke Git (private)

**Analogi:**
> Seperti alamat rumah (URL) dan kunci pintu (Key) untuk akses database Anda.

---

### B. File `src/lib/supabase.js` (Client Connection)

**Lokasi:** `src/lib/supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js';

// Ambil config dari .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Warning jika config kosong
if (!supabaseUrl || !supabaseKey) {
    console.error('Konfigurasi Supabase belum lengkap...');
}

// Buat koneksi client
export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Kegunaan:**
- Membuat **client connection** ke database Supabase
- File ini di-import oleh halaman yang butuh akses database
- Hanya perlu dibuat **1 kali**, dipakai berkali-kali

**Analogi:**
> Seperti bikin koneksi WiFi. Sekali connect, semua device bisa pakai.

---

## 🔐 BAGIAN 2: LOGIN.JSX (Autentikasi Login)

### File: `src/pages/auth/Login.jsx`

**Import Supabase:**
```javascript
import { supabase } from "../../lib/supabase";
```

---

### Fungsi: Login User

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // ===== PANGGIL FUNCTION DATABASE =====
    const { data, error: rpcError } = await supabase.rpc("login_user", {
      p_email: dataForm.email,
      p_password: dataForm.password,
    });

    // Cek error dari Supabase
    if (rpcError) {
      setError("Terjadi kesalahan saat login. Coba lagi.");
      return;
    }

    // Cek apakah email/password cocok
    if (!data || data.length === 0) {
      setError("Email atau password salah");
      return;
    }

    // ===== LOGIN BERHASIL =====
    const user = data[0];
    
    // 1. Simpan token ke localStorage
    localStorage.setItem("token", `local-token-${user.id}`);
    
    // 2. Simpan data user (id, name, email, role)
    localStorage.setItem("user", JSON.stringify(user));
    
    // 3. Panggil callback onLogin (set isLoggedIn = true)
    if (onLogin) onLogin(user);
    
    // 4. Redirect ke dashboard
    navigate("/dashboard", { replace: true });
    
  } catch {
    setError("Tidak dapat terhubung ke server.");
  } finally {
    setLoading(false);
  }
};
```

---

### Penjelasan Detail:

#### 1️⃣ `supabase.rpc("login_user", {...})`

**Apa itu RPC?**
- RPC = **Remote Procedure Call**
- Cara memanggil **function yang ada di database** dari frontend

**Function `login_user` di Database:**
```sql
CREATE FUNCTION login_user(p_email TEXT, p_password TEXT)
RETURNS TABLE (id UUID, name TEXT, email TEXT, role TEXT)
AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, email, role
  FROM users
  WHERE email = p_email AND password = p_password;
END;
$$ LANGUAGE plpgsql;
```

**Flow:**
```
Frontend (Login.jsx)
  └─ supabase.rpc("login_user")
     └─ HTTPS Request ke Supabase
        └─ Execute function login_user
           └─ Query: SELECT * FROM users WHERE email AND password
              └─ Return: User data (jika cocok) atau Empty array (jika salah)
```

---

#### 2️⃣ Response Handling

**Jika Login Berhasil (`data.length > 0`):**
```javascript
const user = data[0]; // { id, name, email, role, created_at }

// Simpan ke localStorage (persistent storage di browser)
localStorage.setItem("token", "local-token-uuid-123");
localStorage.setItem("user", '{"id":"...","name":"John","role":"admin"}');

// Redirect ke dashboard
navigate("/dashboard");
```

**Jika Login Gagal (`data.length === 0`):**
```javascript
setError("Email atau password salah");
// User tetap di halaman login, error ditampilkan
```

---

### Kegunaan Supabase di Login.jsx:

✅ **Validasi Login** → Cek email + password di database  
✅ **Ambil Data User** → Dapat id, name, email, role  
✅ **Keamanan** → Password dicek di server (tidak di frontend)  
✅ **Real Database** → Data disimpan permanen di Supabase

**Analogi:**
> Seperti login ke Facebook. Backend Facebook cek email/password di database mereka, kalau cocok → login berhasil, dapat data profile.

---

## 📝 BAGIAN 3: REGISTER.JSX (Registrasi User Baru)

### File: `src/pages/auth/Register.jsx`

**Import Supabase:**
```javascript
import { supabase } from "../../lib/supabase";
```

---

### Fungsi: Register User Baru

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  // ===== VALIDASI DI FRONTEND =====
  if (dataForm.password.length < 6) {
    setError("Password minimal 6 karakter");
    return;
  }

  if (dataForm.password !== dataForm.confirmPassword) {
    setError("Password dan konfirmasi password tidak sama");
    return;
  }

  setLoading(true);

  try {
    // ===== PANGGIL FUNCTION DATABASE =====
    const { error: rpcError } = await supabase.rpc("register_user", {
      p_name: dataForm.name,
      p_email: dataForm.email,
      p_password: dataForm.password,
    });

    // Cek error (misal: email sudah terdaftar)
    if (rpcError) {
      if (rpcError.message && rpcError.message.includes("sudah terdaftar")) {
        setError("Email sudah terdaftar. Gunakan email lain.");
      } else {
        setError("Gagal mendaftar. Coba lagi.");
      }
      return;
    }

    // ===== REGISTER BERHASIL =====
    setSuccess("Pendaftaran berhasil! Mengarahkan ke halaman login...");
    
    // Redirect ke login setelah 1.5 detik
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);
    
  } catch {
    setError("Tidak dapat terhubung ke server.");
  } finally {
    setLoading(false);
  }
};
```

---

### Penjelasan Detail:

#### 1️⃣ `supabase.rpc("register_user", {...})`

**Function `register_user` di Database:**
```sql
CREATE FUNCTION register_user(
  p_name TEXT, 
  p_email TEXT, 
  p_password TEXT
)
RETURNS VOID
AS $$
BEGIN
  -- Cek apakah email sudah ada
  IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email sudah terdaftar';
  END IF;

  -- Insert user baru
  INSERT INTO users (name, email, password, role)
  VALUES (p_name, p_email, p_password, 'user');
END;
$$ LANGUAGE plpgsql;
```

**Flow:**
```
Frontend (Register.jsx)
  └─ Validasi: Password min 6, Confirm password match
     └─ supabase.rpc("register_user")
        └─ HTTPS Request ke Supabase
           └─ Execute function register_user
              ├─ Check: Email sudah ada? → RAISE EXCEPTION
              └─ Insert: INSERT INTO users (...)
                 └─ Return: Success (no error) atau Error (duplicate email)
```

---

#### 2️⃣ Response Handling

**Jika Register Berhasil (`!rpcError`):**
```javascript
setSuccess("Pendaftaran berhasil!");
setTimeout(() => navigate("/login"), 1500);
// User bisa login dengan akun baru
```

**Jika Email Sudah Terdaftar:**
```javascript
setError("Email sudah terdaftar. Gunakan email lain.");
// User tetap di halaman register, harus ganti email
```

---

### Kegunaan Supabase di Register.jsx:

✅ **Insert Data Baru** → Tambah user ke table `users`  
✅ **Validasi Email** → Cek duplicate email di database  
✅ **Keamanan** → Data langsung masuk database (persistent)  
✅ **Error Handling** → Tangkap error dari database (duplicate key)

**Analogi:**
> Seperti daftar akun Instagram. Backend Instagram insert data Anda ke database mereka, cek email sudah ada atau belum.

---

## 👥 BAGIAN 4: USERSPAGE.JSX (CRUD Manajemen User)

### File: `src/pages/UsersPage.jsx`

**Import Supabase:**
```javascript
import { supabase } from "../lib/supabase";
```

Halaman ini menggunakan **FULL CRUD** (Create, Read, Update, Delete) untuk manajemen user.

---

### A. READ - Ambil Data User

```javascript
const fetchUsers = useCallback(async () => {
  setLoading(true);
  setError("");

  // ===== SELECT DATA DARI TABLE USERS =====
  const { data, error: fetchError } = await supabase
    .from("users")                    // Dari table "users"
    .select("id, name, email, role, phone, address, created_at") // Kolom yang diambil
    .order("created_at", { ascending: true }); // Sort by created_at

  if (fetchError) {
    setError("Gagal memuat data user.");
  } else {
    setUsers(data || []); // Set ke state
  }
  setLoading(false);
}, []);

// Jalankan saat component mount
useEffect(() => {
  fetchUsers();
}, [fetchUsers]);
```

**Kegunaan:**
- Ambil **semua user** dari table `users`
- Kolom **password tidak diambil** (keamanan)
- Data ditampilkan di **Table component**

**SQL Equivalent:**
```sql
SELECT id, name, email, role, phone, address, created_at
FROM users
ORDER BY created_at ASC;
```

---

### B. CREATE - Tambah User Baru

```javascript
const handleSave = async (e) => {
  // ... validasi

  // ===== INSERT DATA BARU =====
  const { error: insertError } = await supabase.from("users").insert({
    name: form.name,
    email: form.email.toLowerCase(),
    password: form.password,
    role: form.role,
    phone: form.phone,
    address: form.address,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      setFormError("Email sudah terdaftar.");
    } else {
      setFormError("Gagal menambah user.");
    }
    return;
  }

  // Tutup modal dan refresh data
  setShowModal(false);
  fetchUsers(); // Reload data
};
```

**Kegunaan:**
- Admin bisa **tambah user baru** langsung
- Insert ke table `users` di database
- Error code `23505` = **Duplicate email** (UNIQUE constraint)

**SQL Equivalent:**
```sql
INSERT INTO users (name, email, password, role, phone, address)
VALUES ('John Doe', 'john@example.com', '123456', 'user', '081234', 'Jakarta');
```

---

### C. UPDATE - Edit User

```javascript
const handleSave = async (e) => {
  // ... validasi

  if (editingId) {
    // ===== MODE EDIT =====
    const updateData = {
      name: form.name,
      email: form.email.toLowerCase(),
      role: form.role,
      phone: form.phone,
      address: form.address,
    };

    // Password opsional (jika diisi, update; jika kosong, skip)
    if (form.password) {
      updateData.password = form.password;
    }

    // ===== UPDATE DATA =====
    const { error: updateError } = await supabase
      .from("users")
      .update(updateData)  // Data yang diupdate
      .eq("id", editingId); // WHERE id = editingId

    if (updateError) {
      setFormError("Gagal menyimpan perubahan.");
      return;
    }

    // Refresh data
    fetchUsers();
  }
};
```

**Kegunaan:**
- Admin bisa **edit data user** yang sudah ada
- Update field tertentu (name, email, role, dll)
- Password **opsional** (hanya update jika diisi)

**SQL Equivalent:**
```sql
UPDATE users
SET name = 'John Smith',
    email = 'john.smith@example.com',
    role = 'admin',
    phone = '089999',
    address = 'Bandung'
WHERE id = 'uuid-123';
```

---

### D. DELETE - Hapus User

```javascript
const handleDelete = async (user) => {
  // Cegah admin hapus akun sendiri
  if (user.id === currentUser.id) {
    alert("Anda tidak bisa menghapus akun Anda sendiri.");
    return;
  }

  // Konfirmasi
  if (!window.confirm(`Yakin ingin menghapus user "${user.name}"?`)) return;

  // ===== DELETE DATA =====
  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", user.id); // WHERE id = user.id

  if (deleteError) {
    alert("Gagal menghapus user.");
  } else {
    fetchUsers(); // Reload data
  }
};
```

**Kegunaan:**
- Admin bisa **hapus user** dari database
- Validasi: Admin **tidak bisa hapus akun sendiri**
- Data terhapus **permanent** dari database

**SQL Equivalent:**
```sql
DELETE FROM users
WHERE id = 'uuid-123';
```

---

### Kegunaan Supabase di UsersPage.jsx:

✅ **READ** → `select()` → Tampilkan list user di table  
✅ **CREATE** → `insert()` → Tambah user baru (admin only)  
✅ **UPDATE** → `update()` → Edit data user (admin only)  
✅ **DELETE** → `delete()` → Hapus user (admin only)  
✅ **Role-based Access** → Admin vs User punya akses berbeda

**Analogi:**
> Seperti panel admin di website. Admin bisa manage semua user: tambah, edit, hapus. User biasa hanya bisa lihat.

---

## 📊 DIAGRAM ARSITEKTUR

```
┌───────────────────────────────────────────────────────┐
│               FRONTEND (React App)                     │
├───────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────────────┐      ┌─────────────────┐        │
│  │  Login.jsx      │      │  Register.jsx   │        │
│  ├─────────────────┤      ├─────────────────┤        │
│  │ - Email         │      │ - Name          │        │
│  │ - Password      │      │ - Email         │        │
│  │                 │      │ - Password      │        │
│  │ [Supabase]      │      │ [Supabase]      │        │
│  │  └─ rpc()       │      │  └─ rpc()       │        │
│  └─────────────────┘      └─────────────────┘        │
│                                                        │
│  ┌──────────────────────────────────────────┐        │
│  │  UsersPage.jsx (CRUD)                    │        │
│  ├──────────────────────────────────────────┤        │
│  │ [Supabase]                               │        │
│  │  ├─ select() → READ                      │        │
│  │  ├─ insert() → CREATE                    │        │
│  │  ├─ update() → UPDATE                    │        │
│  │  └─ delete() → DELETE                    │        │
│  └──────────────────────────────────────────┘        │
│                                                        │
│  ┌──────────────────────────────────────────┐        │
│  │  src/lib/supabase.js                     │        │
│  │  createClient(URL, KEY)                  │        │
│  └────────────┬─────────────────────────────┘        │
│               │                                        │
└───────────────┼────────────────────────────────────────┘
                │
                │ HTTPS Request
                │
┌───────────────▼────────────────────────────────────────┐
│          SUPABASE (Backend Service)                     │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────┐          │
│  │  PostgreSQL Database                    │          │
│  ├─────────────────────────────────────────┤          │
│  │                                          │          │
│  │  Table: users                            │          │
│  │  ┌────┬──────┬───────┬──────┬──────┐   │          │
│  │  │ id │ name │ email │ pwd  │ role │   │          │
│  │  ├────┼──────┼───────┼──────┼──────┤   │          │
│  │  │ 1  │ John │ j@... │ ***  │admin │   │          │
│  │  │ 2  │ Jane │ jane@.│ ***  │user  │   │          │
│  │  └────┴──────┴───────┴──────┴──────┘   │          │
│  │                                          │          │
│  │  Functions:                              │          │
│  │  - login_user(email, password)           │          │
│  │  - register_user(name, email, password)  │          │
│  │                                          │          │
│  └─────────────────────────────────────────┘          │
│                                                         │
│  RESTful API Endpoints:                                │
│  - POST /rest/v1/rpc/login_user                        │
│  - POST /rest/v1/rpc/register_user                     │
│  - GET  /rest/v1/users (select)                        │
│  - POST /rest/v1/users (insert)                        │
│  - PATCH /rest/v1/users?id=eq.X (update)               │
│  - DELETE /rest/v1/users?id=eq.X (delete)              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 RINGKASAN KEGUNAAN SUPABASE

### 1. **Login.jsx** → Autentikasi User
- **Method:** `supabase.rpc("login_user")`
- **Fungsi:** Validasi email + password
- **Output:** User data (id, name, email, role)
- **Use Case:** User login ke aplikasi

---

### 2. **Register.jsx** → Daftar User Baru
- **Method:** `supabase.rpc("register_user")`
- **Fungsi:** Insert user baru ke database
- **Output:** Success/error (duplicate email)
- **Use Case:** User bikin akun baru

---

### 3. **UsersPage.jsx** → Manajemen User (CRUD)

#### A. **READ** - Lihat Daftar User
- **Method:** `supabase.from("users").select()`
- **Fungsi:** Ambil semua data user
- **Output:** Array of users
- **Use Case:** Tampilkan table user

#### B. **CREATE** - Tambah User
- **Method:** `supabase.from("users").insert()`
- **Fungsi:** Tambah user baru (admin only)
- **Output:** Success/error
- **Use Case:** Admin tambah user manual

#### C. **UPDATE** - Edit User
- **Method:** `supabase.from("users").update().eq()`
- **Fungsi:** Update data user tertentu
- **Output:** Success/error
- **Use Case:** Admin edit info user

#### D. **DELETE** - Hapus User
- **Method:** `supabase.from("users").delete().eq()`
- **Fungsi:** Hapus user dari database
- **Output:** Success/error
- **Use Case:** Admin hapus user

---

## 💡 KEUNTUNGAN PAKAI SUPABASE

### ✅ Tanpa Backend Sendiri
- Tidak perlu buat server Node.js/Express
- Tidak perlu setup database PostgreSQL sendiri
- Tidak perlu buat RESTful API manual

### ✅ Keamanan Terjamin
- Password di-hash otomatis (jika setup trigger)
- API Key untuk autentikasi
- Row Level Security (RLS) untuk akses control

### ✅ Real-time (Opsional)
- Data bisa sync otomatis antar device
- Websocket built-in

### ✅ Gratis untuk Development
- Free tier cukup untuk project kuliah/demo
- Upgrade ke paid jika production

---

## 🔐 SECURITY NOTES

### ⚠️ Current Implementation:
- Password disimpan **plain text** (tidak secure)
- Untuk **production**, harus hash password pakai **bcrypt**

### ✅ Recommendation:
```sql
-- Buat trigger untuk auto-hash password
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.password IS DISTINCT FROM OLD.password THEN
    NEW.password = crypt(NEW.password, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_hash_password
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION hash_password();
```

---

## 📚 PERBANDINGAN

### Tanpa Supabase (Traditional):
```
Frontend (React)
  └─ Fetch ke Backend API (Node.js/Express)
     └─ Query ke Database (PostgreSQL/MySQL)
        └─ Return data ke Frontend

HARUS BUAT:
- Backend server (Express/Fastify)
- Database setup (PostgreSQL/MySQL)
- RESTful API endpoints
- Authentication middleware
- CORS setup
- Deploy backend & database
```

### Dengan Supabase:
```
Frontend (React)
  └─ Supabase Client (supabase.from(), supabase.rpc())
     └─ Database di Cloud (PostgreSQL)

SUDAH TERSEDIA:
- Database PostgreSQL
- RESTful API otomatis
- Authentication built-in
- Real-time subscriptions
- File storage
- Hosting database
```

---

## 🎓 KESIMPULAN

### Supabase digunakan untuk:

1. **Authentication** (Login/Register)
   - `Login.jsx` → Validasi user
   - `Register.jsx` → Daftar user baru

2. **Database Operations** (CRUD)
   - `UsersPage.jsx` → Manage user (tambah, edit, hapus, lihat)

3. **Backend Replacement**
   - Tidak perlu buat server Node.js sendiri
   - Database PostgreSQL di cloud
   - RESTful API otomatis

---

### Kenapa Pakai Supabase?

✅ **Cepat** → Tidak perlu setup backend  
✅ **Mudah** → Tinggal panggil function dari React  
✅ **Aman** → Database di cloud, tidak lokal  
✅ **Gratis** → Free tier untuk development  
✅ **Production-ready** → Bisa di-scale untuk aplikasi real

---

**Dibuat:** 14 Juni 2026  
**File yang Menggunakan:**  
1. `src/pages/auth/Login.jsx` (Authentication)  
2. `src/pages/auth/Register.jsx` (Authentication)  
3. `src/pages/UsersPage.jsx` (CRUD Operations)

🎉 **Supabase adalah Backend + Database yang siap pakai untuk aplikasi React Anda!**
