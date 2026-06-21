# 🚀 CRUD USERSPAGE - PENJELASAN SINGKAT

## 📍 File: `src/pages/UsersPage.jsx`

---

## 1️⃣ **C**REATE - Tambah User Baru

**Lokasi:** Line 147-168

```javascript
await supabase.from("users").insert({
    name: form.name,
    email: form.email,
    password: form.password,
    role: form.role,
});
```

**Fungsi:** Admin tambah user baru ke database  
**Trigger:** Klik button "+ Tambah User" → Isi form → Simpan  
**SQL:** `INSERT INTO users (...) VALUES (...)`

---

## 2️⃣ **R**EAD - Tampilkan List User

**Lokasi:** Line 52-66

```javascript
const { data } = await supabase
    .from("users")
    .select("id, name, email, role, phone, address")
    .order("created_at", { ascending: true });

setUsers(data); // Simpan ke state → tampil di table
```

**Fungsi:** Ambil semua user dari database dan tampilkan di table  
**Trigger:** Saat halaman dibuka (useEffect)  
**SQL:** `SELECT * FROM users ORDER BY created_at`

---

## 3️⃣ **U**PDATE - Edit User

**Lokasi:** Line 123-146

```javascript
const updateData = {
    name: form.name,
    email: form.email,
    role: form.role,
};

// Password opsional
if (form.password) {
    updateData.password = form.password;
}

await supabase
    .from("users")
    .update(updateData)
    .eq("id", editingId); // WHERE id = editingId
```

**Fungsi:** Admin edit data user yang sudah ada  
**Trigger:** Klik button "Edit" di row → Ubah data → Simpan  
**SQL:** `UPDATE users SET ... WHERE id = 'xxx'`  
**Catatan:** Password **opsional** (kosongkan jika tidak diubah)

---

## 4️⃣ **D**ELETE - Hapus User

**Lokasi:** Line 172-188

```javascript
// Validasi: Cegah admin hapus akun sendiri
if (user.id === currentUser.id) {
    alert("Anda tidak bisa menghapus akun Anda sendiri.");
    return;
}

// Confirm
if (!window.confirm(`Yakin hapus "${user.name}"?`)) return;

// Delete
await supabase
    .from("users")
    .delete()
    .eq("id", user.id);
```

**Fungsi:** Admin hapus user dari database  
**Trigger:** Klik button "Hapus" → Confirm → Data terhapus  
**SQL:** `DELETE FROM users WHERE id = 'xxx'`  
**Keamanan:** Admin **TIDAK BISA** hapus akun sendiri

---

## 🔐 ROLE-BASED ACCESS

### **Admin** (role = "admin"):
✅ CREATE → Bisa tambah user  
✅ READ → Bisa lihat list user  
✅ UPDATE → Bisa edit user  
✅ DELETE → Bisa hapus user

### **User** (role = "user"):
✅ READ → **HANYA** bisa lihat list user  
❌ CREATE, UPDATE, DELETE → **TIDAK BISA**

```javascript
const isAdmin = currentUser.role === "admin";

// Button tambah hanya muncul untuk admin
{isAdmin && <Button>+ Tambah User</Button>}
```

---

## 🎯 FLOW SEDERHANA

```
1. User buka halaman
   └─ READ: Tampilkan table user

2. Admin klik "+ Tambah User"
   └─ CREATE: Insert user baru

3. Admin klik "Edit" di row
   └─ UPDATE: Ubah data user

4. Admin klik "Hapus" di row
   └─ DELETE: Hapus user dari database
```

---

## 📊 QUICK REFERENCE

| Operasi | Method | Line | Trigger |
|---------|--------|------|---------|
| **CREATE** | `insert()` | 147-168 | Button "+ Tambah User" |
| **READ** | `select()` | 52-66 | Component mount |
| **UPDATE** | `update().eq()` | 123-146 | Button "Edit" |
| **DELETE** | `delete().eq()` | 172-188 | Button "Hapus" |

---

## 🔍 DETAIL LEBIH LENGKAP

Baca file: **`ANALISA-CRUD-USERSPAGE.md`** untuk:
- Penjelasan code per line
- Diagram flow lengkap
- Error handling
- Validasi form
- Security notes

---

**Kesimpulan:**  
UsersPage.jsx = **CRUD Lengkap** untuk manajemen user dengan **Role-based Access Control**

📚 **4 Operasi:** Create, Read, Update, Delete  
🔐 **2 Role:** Admin (full access) vs User (read-only)  
✅ **Security:** Admin tidak bisa hapus akun sendiri
