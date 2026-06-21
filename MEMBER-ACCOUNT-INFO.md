# 👤 AKUN MEMBER DENGAN RIWAYAT PEMESANAN

## ✅ AKUN YANG SUDAH DIBUAT

### 🎯 2 AKUN MEMBER TERSEDIA

---

## 1️⃣ AKUN MEMBER BARU (Tanpa Riwayat)

### 📋 Detail Akun:
```
Nama    : John Member
Email   : member@novotel.com
Password: 123456
Role    : user
Phone   : +62 812-3456-7890
Address : Jl. Sudirman No. 456, Jakarta
```

### 🔐 Login:
```
URL     : http://localhost:5174/login-member
Email   : member@novotel.com
Password: 123456
```

### 📊 Status:
- ✅ Akun sudah dibuat di database
- ❌ Belum ada riwayat pemesanan
- 📋 Cocok untuk testing member baru

---

## 2️⃣ AKUN MEMBER DENGAN RIWAYAT (CST001) ⭐

### 📋 Detail Akun:
```
Nama    : Andi Wijaya
Email   : andi.wijaya@gmail.com
Password: member123
Role    : user
Phone   : +62 812-3456-7890
Address : Jl. Sudirman No. 45, Jakarta
```

### 🔐 Login:
```
URL     : http://localhost:5174/login-member
Email   : andi.wijaya@gmail.com
Password: member123
```

### 📊 Status:
- ✅ Akun sudah dibuat di database
- ✅ Sudah punya riwayat pemesanan
- 🔗 Terhubung dengan customer CST001
- 📋 Semua reservasi CST001 akan muncul

### 🎯 Matching Logic:
```javascript
// Step 1: Get member data dari localStorage
const memberData = JSON.parse(localStorage.getItem("member"));
// { email: "andi.wijaya@gmail.com", ... }

// Step 2: Find customer berdasarkan email
const customer = customers.find(c => c.email === memberData.email);
// { id: "CST001", name: "Andi Wijaya", email: "andi.wijaya@gmail.com", ... }

// Step 3: Filter reservations yang punya customer ID ini
const memberTransactions = reservations.filter(r => 
  r.id.startsWith(customer.id)
);
// Semua reservasi yang ID-nya dimulai dengan "CST001"
```

---

## 📦 DATA YANG TERSEDIA

### Customer CST001:
```javascript
{
  id: 'CST001',
  name: 'Andi Wijaya',
  email: 'andi.wijaya@gmail.com',
  phone: '+62 812-3456-7890',
  address: 'Jl. Sudirman No. 45, Jakarta',
  membershipType: 'Gold',
  joinDate: '2023-01-15'
}
```

### Reservasi dengan ID CST001:
```
Pattern: CST001-RES001, CST001-RES002, CST001-RES003, ...

Total: Semua reservasi yang ID-nya dimulai dengan "CST001"
```

### Contoh Reservasi:
```javascript
{
  id: 'CST001-RES001',
  roomType: 'Standard',
  checkIn: '2024-01-10',
  checkOut: '2024-01-12',
  totalPayment: 1600000,
  payment: 'Lunas'
}

{
  id: 'CST001-RES002',
  roomType: 'Deluxe',
  checkIn: '2024-02-05',
  checkOut: '2024-02-08',
  totalPayment: 3600000,
  payment: 'Pending'
}

{
  id: 'CST001-RES003',
  roomType: 'Suite',
  checkIn: '2024-03-20',
  checkOut: '2024-03-23',
  totalPayment: 7500000,
  payment: 'Lunas'
}
```

---

## 🔍 CARA CEK RIWAYAT TRANSAKSI

### Step-by-Step:

**1. Login sebagai member:**
```
http://localhost:5174/login-member

Email: andi.wijaya@gmail.com
Password: member123
```

**2. Setelah login, Anda akan diarahkan ke:**
```
http://localhost:5174/member-dashboard
```

**3. Default tab adalah "Profile":**
```
Menampilkan:
- Avatar dengan initial "AW"
- Nama: Andi Wijaya
- Email: andi.wijaya@gmail.com
- Role: user
- Phone: +62 812-3456-7890
- Address: Jl. Sudirman No. 45, Jakarta
- Tanggal bergabung
```

**4. Klik tab "Riwayat Transaksi":**
```
Menampilkan:
- List semua reservasi dari CST001
- Setiap card menampilkan:
  * Booking ID (CST001-RES001)
  * Tipe Kamar (Standard/Deluxe/Suite/Executive)
  * Check-in Date
  * Check-out Date
  * Durasi (X malam)
  * Total Payment (Rp)
  * Status Payment (Lunas/Pending/Belum Bayar)
```

**5. Klik tab "Statistik":**
```
Menampilkan:
- Total Booking (jumlah total)
- Booking Lunas (count)
- Booking Pending (count)
- Total Pengeluaran (sum)
- Recent Activity (5 terakhir)
```

---

## 📊 YANG AKAN TERLIHAT

### Tab 1: Profile
```
┌────────────────────────────────────────┐
│  [Avatar: AW]  Andi Wijaya             │
│                Role: user               │
│                                         │
│  📧 Email   : andi.wijaya@gmail.com    │
│  📱 Phone   : +62 812-3456-7890        │
│  📍 Address : Jl. Sudirman No. 45...   │
│  📅 Joined  : 21 Juni 2026             │
└────────────────────────────────────────┘
```

### Tab 2: Riwayat Transaksi
```
┌────────────────────────────────────────┐
│  Booking: CST001-RES001   [Lunas]      │
│  🛏️  Standard Room                     │
│  📅 10 Jan - 12 Jan 2024 (2 malam)    │
│  💰 Rp 1.600.000                       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  Booking: CST001-RES002   [Pending]    │
│  🏨 Deluxe Room                        │
│  📅 05 Feb - 08 Feb 2024 (3 malam)    │
│  💰 Rp 3.600.000                       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  Booking: CST001-RES003   [Lunas]      │
│  👑 Suite Room                         │
│  📅 20 Mar - 23 Mar 2024 (3 malam)    │
│  💰 Rp 7.500.000                       │
└────────────────────────────────────────┘
```

### Tab 3: Statistik
```
┌─────────────────┐  ┌─────────────────┐
│  📊 Total       │  │  ✅ Lunas       │
│     45          │  │     30          │
│  Booking        │  │  Booking        │
└─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐
│  ⏳ Pending     │  │  💰 Total       │
│     10          │  │  Rp 89.5 Juta   │
│  Booking        │  │  Pengeluaran    │
└─────────────────┘  └─────────────────┘

Recent Activity:
• Booking Suite - CST001-RES003 (Lunas)
• Booking Deluxe - CST001-RES002 (Pending)
• Booking Standard - CST001-RES001 (Lunas)
```

---

## 🧪 TESTING GUIDE

### Test Case 1: Login Member Baru (No History)
```
Email   : member@novotel.com
Password: 123456

Expected:
✅ Login berhasil
✅ Redirect ke /member-dashboard
✅ Tab Profile terisi
❌ Tab Riwayat Transaksi kosong (empty state)
📊 Tab Statistik: semua 0
```

### Test Case 2: Login Member dengan History
```
Email   : andi.wijaya@gmail.com
Password: member123

Expected:
✅ Login berhasil
✅ Redirect ke /member-dashboard
✅ Tab Profile terisi dengan data Andi Wijaya
✅ Tab Riwayat Transaksi: List reservasi CST001
✅ Tab Statistik: Data sesuai reservasi
```

### Test Case 3: Logout
```
1. Klik button "Logout"

Expected:
✅ localStorage cleared
✅ Redirect ke / (GuestPage)
✅ Tidak bisa akses /member-dashboard
```

### Test Case 4: Direct Access (Not Logged In)
```
1. Clear localStorage
2. Akses: http://localhost:5174/member-dashboard

Expected:
❌ Redirect ke /login-member
```

---

## 🔐 SECURITY

### Authentication Flow:
```javascript
// 1. Login → LoginMember.jsx
const { data } = await supabase.rpc("login_user", {
  p_email: email,
  p_password: password
});

// 2. Save to localStorage
localStorage.setItem("memberToken", `member-token-${data[0].id}`);
localStorage.setItem("member", JSON.stringify(data[0]));

// 3. Redirect
navigate("/member-dashboard");

// 4. Protected Route → MemberDashboard.jsx
useEffect(() => {
  const token = localStorage.getItem("memberToken");
  if (!token) {
    navigate("/login-member");
  }
}, []);

// 5. Logout
localStorage.removeItem("memberToken");
localStorage.removeItem("member");
navigate("/");
```

---

## 📝 DATA FLOW DIAGRAM

```
┌─────────────────┐
│  Login Member   │
│  (Email/Pass)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase RPC   │
│  login_user()   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  localStorage   │
│  memberToken    │
│  member (JSON)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Member Dashboard│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌──────┐  ┌──────────────┐
│Profile│ │ Riwayat      │
└──────┘  └─────┬────────┘
                │
          ┌─────▼─────────────────┐
          │ 1. Get member.email   │
          └─────┬─────────────────┘
                │
          ┌─────▼─────────────────┐
          │ 2. Find customer by   │
          │    email in DataContext│
          └─────┬─────────────────┘
                │
          ┌─────▼─────────────────┐
          │ 3. Filter reservations│
          │    by customer.id     │
          └─────┬─────────────────┘
                │
          ┌─────▼─────────────────┐
          │ 4. Display list       │
          └───────────────────────┘
```

---

## 🎯 KEY FEATURES

### ✅ Implemented:
1. **2 Akun Member**
   - Member baru (no history)
   - Member dengan history (CST001)

2. **Login System**
   - Validasi dengan Supabase
   - Role check (user only)
   - Token management

3. **Protected Routes**
   - Check token sebelum akses
   - Auto redirect jika no token

4. **Riwayat Transaksi**
   - Filter by email
   - Match dengan customer ID
   - Display semua reservasi

5. **Statistik Dashboard**
   - Total booking
   - Booking lunas/pending
   - Total pengeluaran
   - Recent activity

---

## 📊 DATABASE SCHEMA

### Table: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Sample Data:
```sql
-- Member 1: No history
INSERT INTO users (name, email, password, role, phone, address)
VALUES (
  'John Member',
  'member@novotel.com',
  '123456',
  'user',
  '+62 812-3456-7890',
  'Jl. Sudirman No. 456, Jakarta'
);

-- Member 2: With history (CST001)
INSERT INTO users (name, email, password, role, phone, address)
VALUES (
  'Andi Wijaya',
  'andi.wijaya@gmail.com',
  'member123',
  'user',
  '+62 812-3456-7890',
  'Jl. Sudirman No. 45, Jakarta'
);
```

---

## 🎉 SUMMARY

### ✅ Yang Sudah Dibuat:
1. **2 Akun Member** di database Supabase
2. **Member dengan riwayat** (matching dengan CST001)
3. **Login system** dengan validasi
4. **Protected routes** untuk security
5. **Dashboard** dengan 3 tabs (Profile, Riwayat, Statistik)
6. **Data matching** email → customer → reservations

### 🔐 Credentials:

**Member Baru:**
```
Email   : member@novotel.com
Password: 123456
History : No
```

**Member dengan Riwayat:**
```
Email   : andi.wijaya@gmail.com
Password: member123
History : Yes (CST001)
```

### 🚀 Ready to Test:
1. Login dengan salah satu akun
2. Cek tab Profile
3. Cek tab Riwayat Transaksi
4. Cek tab Statistik
5. Test logout

---

**Dibuat:** 21 Juni 2026  
**Status:** ✅ READY FOR TESTING  
**Database:** ✅ CONNECTED  
**Akun:** ✅ 2 MEMBER CREATED
