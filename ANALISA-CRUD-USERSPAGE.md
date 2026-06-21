# 📝 ANALISA CRUD - UsersPage.jsx

## 🎯 APA ITU CRUD?

**CRUD** = **C**reate, **R**ead, **U**pdate, **D**elete

4 operasi dasar untuk mengelola data di database:
- **C**reate → Tambah data baru
- **R**ead → Tampilkan/baca data
- **U**pdate → Edit/ubah data yang ada
- **D**elete → Hapus data

---

## 📍 LOKASI CODE CRUD DI USERSPAGE.JSX

File: `src/pages/UsersPage.jsx`

### 1️⃣ **READ** → Baca Data User (Line 52-66)
### 2️⃣ **CREATE** → Tambah User Baru (Line 147-168)
### 3️⃣ **UPDATE** → Edit User (Line 123-146)
### 4️⃣ **DELETE** → Hapus User (Line 172-188)

---

## 1️⃣ READ - Baca Data User

### 📍 Lokasi: Line 52-66

```javascript
const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    // ===== QUERY DATABASE =====
    const { data, error: fetchError } = await supabase
        .from("users")                              // Dari table "users"
        .select("id, name, email, role, phone, address, created_at") // Kolom yang diambil
        .order("created_at", { ascending: true });  // Sort by created_at

    if (fetchError) {
        setError("Gagal memuat data user.");
    } else {
        setUsers(data || []); // Simpan ke state
    }
    setLoading(false);
}, []);

// Jalankan saat component mount
useEffect(() => {
    fetchUsers();
}, [fetchUsers]);
```

---

### 📊 Penjelasan:

**Fungsi:** Ambil semua data user dari database dan tampilkan di table

**Flow:**
```
1. User buka halaman UsersPage
2. useEffect jalan → panggil fetchUsers()
3. fetchUsers() query ke Supabase:
   - SELECT id, name, email, role, phone, address, created_at
   - FROM users
   - ORDER BY created_at ASC
4. Data disimpan ke state: setUsers(data)
5. Table component tampilkan data
```

**SQL Equivalent:**
```sql
SELECT id, name, email, role, phone, address, created_at
FROM users
ORDER BY created_at ASC;
```

**Output:**
```javascript
[
  { id: "uuid-1", name: "John", email: "john@mail.com", role: "admin", ... },
  { id: "uuid-2", name: "Jane", email: "jane@mail.com", role: "user", ... },
  ...
]
```

**Kenapa Password Tidak Diambil?**
- Keamanan! Password tidak boleh ditampilkan di frontend
- Hanya ambil kolom yang diperlukan

---

## 2️⃣ CREATE - Tambah User Baru

### 📍 Lokasi: Line 147-168

```javascript
// MODE TAMBAH (editingId = null)
const { error: insertError } = await supabase.from("users").insert({
    name: form.name,
    email: form.email.toLowerCase(),
    password: form.password,
    role: form.role,
    phone: form.phone,
    address: form.address,
});

if (insertError) {
    // Error 23505 = Duplicate email (UNIQUE constraint)
    setFormError(
        insertError.code === "23505"
            ? "Email sudah terdaftar."
            : "Gagal menambah user."
    );
    return;
}

// Tutup modal dan refresh data
setShowModal(false);
fetchUsers(); // Reload table
```

---

### 📊 Penjelasan:

**Fungsi:** Admin tambah user baru ke database

**Flow:**
```
1. Admin klik button "+ Tambah User"
2. Modal form muncul
3. Admin isi form (name, email, password, role, phone, address)
4. Klik "Simpan"
5. Code panggil: supabase.from("users").insert({...})
6. Supabase insert data ke table users
7. Jika berhasil:
   - Modal tutup
   - fetchUsers() reload data
   - User baru muncul di table
8. Jika gagal (email duplicate):
   - Tampilkan error: "Email sudah terdaftar"
```

**SQL Equivalent:**
```sql
INSERT INTO users (name, email, password, role, phone, address)
VALUES ('John Doe', 'john@mail.com', '123456', 'user', '081234', 'Jakarta');
```

**Error Handling:**
- **Code 23505** = Duplicate email (email sudah ada di database)
- Email harus UNIQUE (constraint di table)

---

## 3️⃣ UPDATE - Edit User

### 📍 Lokasi: Line 123-146

```javascript
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
        if (form.password.length < 6) {
            setFormError("Password minimal 6 karakter.");
            setSaving(false);
            return;
        }
        updateData.password = form.password;
    }

    // ===== QUERY UPDATE =====
    const { error: updateError } = await supabase
        .from("users")
        .update(updateData)    // Data yang diupdate
        .eq("id", editingId);  // WHERE id = editingId

    if (updateError) {
        setFormError(
            updateError.code === "23505"
                ? "Email sudah dipakai user lain."
                : "Gagal menyimpan perubahan."
        );
        return;
    }

    // Tutup modal dan refresh
    setShowModal(false);
    fetchUsers();
}
```

---

### 📊 Penjelasan:

**Fungsi:** Admin edit data user yang sudah ada

**Flow:**
```
1. Admin klik button "Edit" di salah satu row
2. Modal form muncul, terisi dengan data user
3. Admin ubah data (misal: ubah role dari user → admin)
4. Klik "Simpan"
5. Code panggil: supabase.from("users").update({...}).eq("id", ...)
6. Supabase update data di table users
7. Modal tutup, data refresh
```

**SQL Equivalent:**
```sql
UPDATE users
SET name = 'John Smith',
    email = 'john.smith@mail.com',
    role = 'admin',
    phone = '089999',
    address = 'Bandung'
WHERE id = 'uuid-123';
```

**Fitur Khusus:**
- **Password Opsional:**
  - Jika field password **kosong** → password lama tetap (tidak diubah)
  - Jika field password **diisi** → password baru di-update
  
  ```javascript
  if (form.password) {
      updateData.password = form.password; // Update password
  }
  // Jika kosong, password tidak masuk updateData
  ```

**Kenapa Begini?**
- User tidak perlu isi password setiap edit
- Hanya isi password jika ingin ganti password

---

## 4️⃣ DELETE - Hapus User

### 📍 Lokasi: Line 172-188

```javascript
const handleDelete = async (user) => {
    // ===== VALIDASI: Cegah admin hapus akun sendiri =====
    if (user.id === currentUser.id) {
        alert("Anda tidak bisa menghapus akun Anda sendiri.");
        return;
    }

    // Konfirmasi
    if (!window.confirm(`Yakin ingin menghapus user "${user.name}"?`)) return;

    // ===== QUERY DELETE =====
    const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);  // WHERE id = user.id

    if (deleteError) {
        alert("Gagal menghapus user.");
    } else {
        fetchUsers(); // Reload data
    }
};
```

---

### 📊 Penjelasan:

**Fungsi:** Admin hapus user dari database

**Flow:**
```
1. Admin klik button "Hapus" di salah satu row
2. Validasi:
   - Jika user yang dihapus = akun admin sendiri → TOLAK
   - Alasan: Admin tidak boleh hapus akun sendiri
3. Muncul confirm dialog: "Yakin ingin menghapus user John?"
4. Jika "OK":
   - Code panggil: supabase.from("users").delete().eq("id", ...)
   - Supabase hapus data dari table users
   - Data refresh (user hilang dari table)
5. Jika "Cancel":
   - Tidak jadi hapus
```

**SQL Equivalent:**
```sql
DELETE FROM users
WHERE id = 'uuid-123';
```

**Fitur Keamanan:**
- **Cegah Self-Delete:**
  ```javascript
  if (user.id === currentUser.id) {
      alert("Anda tidak bisa menghapus akun Anda sendiri.");
      return;
  }
  ```
  
  **Kenapa?**
  - Jika admin hapus akunnya sendiri → logout otomatis
  - Tidak ada admin lain → aplikasi tidak bisa dikelola
  - Best practice: Admin tidak boleh hapus akun sendiri

---

## 📊 TABEL PERBANDINGAN CRUD

| Operasi | Method Supabase | SQL Equivalent | Fungsi |
|---------|----------------|----------------|--------|
| **CREATE** | `.insert({})` | `INSERT INTO users (...)` | Tambah user baru |
| **READ** | `.select()` | `SELECT * FROM users` | Tampilkan list user |
| **UPDATE** | `.update({}).eq()` | `UPDATE users SET ... WHERE` | Edit data user |
| **DELETE** | `.delete().eq()` | `DELETE FROM users WHERE` | Hapus user |

---

## 🔐 ROLE-BASED ACCESS CONTROL

### Admin vs User:

```javascript
const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = currentUser.role === "admin"; // true/false
```

**Admin (role = "admin"):**
- ✅ Bisa lihat list user (READ)
- ✅ Bisa tambah user (CREATE)
- ✅ Bisa edit user (UPDATE)
- ✅ Bisa hapus user (DELETE)
- ✅ Ada button: "+ Tambah User", "Edit", "Hapus"

**User Biasa (role = "user"):**
- ✅ Bisa lihat list user (READ only)
- ❌ **TIDAK** bisa tambah user
- ❌ **TIDAK** bisa edit user
- ❌ **TIDAK** bisa hapus user
- ❌ Button "Tambah", "Edit", "Hapus" **TIDAK MUNCUL**

**Code:**
```javascript
// Button tambah hanya untuk admin
{isAdmin && (
    <Button variant="success" onClick={openAddModal}>
        + Tambah User
    </Button>
)}

// Kolom Aksi hanya untuk admin
if (isAdmin) {
    columns.push({
        header: "Aksi",
        render: (value, row) => (
            <>
                <Button onClick={() => openEditModal(row)}>Edit</Button>
                <Button onClick={() => handleDelete(row)}>Hapus</Button>
            </>
        ),
    });
}
```

---

## 🎨 UI COMPONENTS

### Modal Form (Tambah/Edit):

```javascript
<Modal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    title={editingId ? "Edit User" : "Tambah User"}
>
    <form onSubmit={handleSave}>
        <Input label="Nama" name="name" ... />
        <Input label="Email" type="email" name="email" ... />
        <Input label="Password" type="password" name="password" ... />
        <select name="role">
            <option value="user">user</option>
            <option value="admin">admin</option>
        </select>
        <Input label="Telepon" name="phone" ... />
        <Input label="Alamat" name="address" ... />
        
        <Button type="submit">Simpan</Button>
    </form>
</Modal>
```

**Mode Form:**
- **Tambah User** (editingId = null):
  - Title: "Tambah User"
  - Form kosong
  - Password **wajib** diisi
  
- **Edit User** (editingId = "uuid-123"):
  - Title: "Edit User"
  - Form terisi data user
  - Password **opsional** (kosongkan jika tidak diubah)

---

## 🔄 DATA FLOW DIAGRAM

```
┌────────────────────────────────────────────────────┐
│            UsersPage Component                      │
├────────────────────────────────────────────────────┤
│                                                     │
│  1. Component Mount                                 │
│     └─ useEffect → fetchUsers()                    │
│        └─ supabase.from("users").select()          │
│           └─ setUsers(data)                        │
│              └─ Table tampilkan data               │
│                                                     │
│  2. Admin Klik "+ Tambah User"                     │
│     └─ openAddModal()                              │
│        └─ setShowModal(true)                       │
│           └─ Modal form muncul (kosong)            │
│              └─ Admin isi & simpan                 │
│                 └─ handleSave()                    │
│                    └─ supabase.insert({...})       │
│                       └─ fetchUsers() refresh      │
│                                                     │
│  3. Admin Klik "Edit" di Row                       │
│     └─ openEditModal(user)                         │
│        └─ setEditingId(user.id)                    │
│           └─ setForm(user data)                    │
│              └─ Modal form muncul (terisi)         │
│                 └─ Admin ubah & simpan             │
│                    └─ handleSave()                 │
│                       └─ supabase.update({...})    │
│                          └─ fetchUsers() refresh   │
│                                                     │
│  4. Admin Klik "Hapus" di Row                      │
│     └─ handleDelete(user)                          │
│        └─ Validasi: user !== currentUser           │
│           └─ window.confirm()                      │
│              └─ supabase.delete()                  │
│                 └─ fetchUsers() refresh            │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

## 📝 VALIDASI FORM

### Validasi di Frontend:

```javascript
// 1. Nama & Email wajib
if (!form.name || !form.email) {
    setFormError("Nama dan email wajib diisi.");
    return;
}

// 2. Password minimal 6 karakter (saat tambah)
if (!editingId && form.password.length < 6) {
    setFormError("Password minimal 6 karakter.");
    return;
}

// 3. Email lowercase (normalisasi)
email: form.email.toLowerCase()
```

### Error dari Database:

```javascript
// Error 23505 = Duplicate email (UNIQUE constraint)
if (insertError.code === "23505") {
    setFormError("Email sudah terdaftar.");
}
```

---

## 🎯 KESIMPULAN

### CRUD di UsersPage.jsx:

| Operasi | Trigger | Code | Result |
|---------|---------|------|--------|
| **CREATE** | Klik "+ Tambah User" | `supabase.insert()` | User baru di table |
| **READ** | Component mount | `supabase.select()` | Tampilkan list user |
| **UPDATE** | Klik "Edit" | `supabase.update().eq()` | Data user berubah |
| **DELETE** | Klik "Hapus" | `supabase.delete().eq()` | User hilang dari table |

### Fitur Keamanan:
- ✅ Role-based access (Admin vs User)
- ✅ Admin tidak bisa hapus akun sendiri
- ✅ Password tidak ditampilkan di table
- ✅ Confirm dialog sebelum delete
- ✅ Validasi form (email, password min 6)

### Flow Sederhana:
```
Admin buka page → Table tampil (READ)
Admin klik button → Form muncul
Admin isi form → Klik simpan
Code panggil Supabase → Database berubah
Table refresh → Perubahan terlihat
```

---

**Dibuat:** 14 Juni 2026  
**File:** `src/pages/UsersPage.jsx`  
**Total Operations:** 4 (Create, Read, Update, Delete)  
**Access Control:** Role-based (Admin/User)

🎉 **Ini adalah implementasi CRUD lengkap dengan keamanan & validasi!**
