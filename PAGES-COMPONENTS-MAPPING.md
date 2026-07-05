# 📄 MAPPING HALAMAN & KOMPONEN REUSABLE

Dokumen ini menunjukkan halaman mana saja yang menggunakan komponen reusable tertentu.

---

## 🗂️ DAFTAR HALAMAN

Total: **9 halaman**

1. **MainLayout** (`src/layouts/MainLayout.jsx`)
2. **Dashboard** (`src/pages/Dashboard.jsx`)
3. **CustomerPage** (`src/pages/CustomerPage.jsx`)
4. **CustomerDetail** (`src/pages/CustomerDetail.jsx`)
5. **ReservationPage** (`src/pages/ReservationPage.jsx`)
6. **ReservationDetail** (`src/pages/ReservationDetail.jsx`)
7. **UsersPage** (`src/pages/UsersPage.jsx`)
8. **PaymentsPage** (`src/pages/PaymentsPage.jsx`)
9. **Main App** (`src/main.jsx`)

---

## 📊 MAPPING VISUAL: KOMPONEN → HALAMAN

### 1. 🎯 Badge
```
Badge
├── ReservationDetail.jsx    ✅ Status pembayaran (Lunas/Pending/Belum Bayar)
└── ReservationPage.jsx       ✅ Status pembayaran di tabel
```

**Total:** 2 halaman

---

### 2. 🔘 Button
```
Button
├── Dashboard.jsx             ✅ Tombol navigasi ke halaman lain
├── CustomerPage.jsx          ✅ Tombol tambah customer
├── CustomerDetail.jsx        ✅ Tombol edit customer, kembali
├── ReservationPage.jsx       ✅ Tombol tambah reservasi
├── ReservationDetail.jsx     ✅ Tombol konfirmasi pembayaran, edit
└── UsersPage.jsx             ✅ Tombol tambah user, hapus user
```

**Total:** 6 halaman (PALING BANYAK! 🏆)

---

### 3. 📦 Card
```
Card
├── Dashboard.jsx             ✅ Wrapper konten dashboard
├── CustomerDetail.jsx        ✅ Card detail customer
└── ReservationDetail.jsx     ✅ Card detail reservasi
```

**Total:** 3 halaman

---

### 4. 📭 EmptyState
```
EmptyState
├── CustomerPage.jsx          ✅ Saat tidak ada data customer
├── ReservationPage.jsx       ✅ Saat tidak ada data reservasi
└── UsersPage.jsx             ✅ Saat tidak ada data user
```

**Total:** 3 halaman

---

### 5. 🛡️ ErrorBoundary
```
ErrorBoundary
└── main.jsx                  ✅ Wrapper global untuk error handling
```

**Total:** 1 halaman (wrapper app)

---

### 6. 💬 FeedbackItem
```
FeedbackItem
└── Dashboard.jsx             ✅ Menampilkan item feedback customer
```

**Total:** 1 halaman

---

### 7. 📌 Header
```
Header
└── MainLayout.jsx            ✅ Header utama dashboard admin
```

**Total:** 1 halaman (layout)

---

### 8. 📝 Input
```
Input
├── CustomerDetail.jsx        ✅ Form edit customer (nama, email, telepon)
├── ReservationDetail.jsx     ✅ Form edit reservasi (nama, email, dll)
└── UsersPage.jsx             ✅ Form tambah/edit user
```

**Total:** 3 halaman

---

### 9. ⏳ Loading
```
Loading
├── PaymentsPage.jsx          ✅ Loading saat fetch data payment
└── UsersPage.jsx             ✅ Loading saat fetch data user
```

**Total:** 2 halaman

---

### 10. 📊 MetricCard
```
MetricCard
└── Dashboard.jsx             ✅ Card statistik (total customer, reservasi, revenue)
```

**Total:** 1 halaman

---

### 11. 🪟 Modal
```
Modal
├── CustomerDetail.jsx        ✅ Modal edit customer
├── ReservationDetail.jsx     ✅ Modal konfirmasi pembayaran, edit reservasi
└── UsersPage.jsx             ✅ Modal tambah user, hapus user
```

**Total:** 3 halaman

---

### 12. 🛏️ RoomCard
```
RoomCard
└── Dashboard.jsx             ✅ Menampilkan card tipe kamar
```

**Total:** 1 halaman

---

### 13. 🧭 Sidebar
```
Sidebar
└── MainLayout.jsx            ✅ Sidebar navigasi dashboard admin
```

**Total:** 1 halaman (layout)

---

### 14. 📈 StatusRow
```
StatusRow
└── Dashboard.jsx             ✅ Status kamar (available, occupied, maintenance)
```

**Total:** 1 halaman

---

### 15. 📋 Table
```
Table
├── CustomerPage.jsx          ✅ Tabel daftar customer
├── ReservationPage.jsx       ✅ Tabel daftar reservasi
└── UsersPage.jsx             ✅ Tabel daftar user
```

**Total:** 3 halaman

---

## 📊 MAPPING VISUAL: HALAMAN → KOMPONEN

### 1. 📱 MainLayout (`src/layouts/MainLayout.jsx`)
```
MainLayout
├── Sidebar        ✅
└── Header         ✅
```
**Total:** 2 komponen

---

### 2. 🏠 Dashboard (`src/pages/Dashboard.jsx`)
```
Dashboard
├── Button         ✅
├── Card           ✅
├── MetricCard     ✅
├── RoomCard       ✅
├── StatusRow      ✅
└── FeedbackItem   ✅
```
**Total:** 6 komponen (PALING BANYAK! 🏆)

---

### 3. 👥 CustomerPage (`src/pages/CustomerPage.jsx`)
```
CustomerPage
├── Button         ✅
├── Table          ✅
└── EmptyState     ✅
```
**Total:** 3 komponen

---

### 4. 👤 CustomerDetail (`src/pages/CustomerDetail.jsx`)
```
CustomerDetail
├── Button         ✅
├── Card           ✅
├── Modal          ✅
└── Input          ✅
```
**Total:** 4 komponen

---

### 5. 📋 ReservationPage (`src/pages/ReservationPage.jsx`)
```
ReservationPage
├── Button         ✅
├── Badge          ✅
├── Table          ✅
└── EmptyState     ✅
```
**Total:** 4 komponen

---

### 6. 📄 ReservationDetail (`src/pages/ReservationDetail.jsx`)
```
ReservationDetail
├── Button         ✅
├── Badge          ✅
├── Card           ✅
├── Modal          ✅
└── Input          ✅
```
**Total:** 5 komponen

---

### 7. 👨‍💼 UsersPage (`src/pages/UsersPage.jsx`)
```
UsersPage
├── Button         ✅
├── Table          ✅
├── Modal          ✅
├── Input          ✅
├── EmptyState     ✅
└── Loading        ✅
```
**Total:** 6 komponen (PALING BANYAK! 🏆)

---

### 8. 💳 PaymentsPage (`src/pages/PaymentsPage.jsx`)
```
PaymentsPage
└── Loading        ✅
```
**Total:** 1 komponen

---

### 9. 🚀 Main App (`src/main.jsx`)
```
main.jsx
└── ErrorBoundary  ✅
```
**Total:** 1 komponen (wrapper global)

---

## 📈 STATISTIK HALAMAN

| Halaman | Jumlah Komponen | Peringkat |
|---------|-----------------|-----------|
| Dashboard | 6 komponen | 🥇 #1 |
| UsersPage | 6 komponen | 🥇 #1 |
| ReservationDetail | 5 komponen | 🥈 #3 |
| CustomerDetail | 4 komponen | 🥉 #4 |
| ReservationPage | 4 komponen | 🥉 #4 |
| CustomerPage | 3 komponen | #6 |
| MainLayout | 2 komponen | #7 |
| PaymentsPage | 1 komponen | #8 |
| main.jsx | 1 komponen | #8 |

---

## 🏆 KOMPONEN PALING POPULER

Ranking berdasarkan jumlah halaman yang menggunakan:

| Rank | Komponen | Jumlah Halaman | Badge |
|------|----------|----------------|-------|
| 🥇 #1 | **Button** | 6 halaman | ⭐⭐⭐⭐⭐⭐ |
| 🥈 #2 | **Card** | 3 halaman | ⭐⭐⭐ |
| 🥈 #2 | **EmptyState** | 3 halaman | ⭐⭐⭐ |
| 🥈 #2 | **Input** | 3 halaman | ⭐⭐⭐ |
| 🥈 #2 | **Modal** | 3 halaman | ⭐⭐⭐ |
| 🥈 #2 | **Table** | 3 halaman | ⭐⭐⭐ |
| 🥉 #7 | **Badge** | 2 halaman | ⭐⭐ |
| 🥉 #7 | **Loading** | 2 halaman | ⭐⭐ |
| #9 | **ErrorBoundary** | 1 halaman | ⭐ |
| #9 | **FeedbackItem** | 1 halaman | ⭐ |
| #9 | **Header** | 1 halaman | ⭐ |
| #9 | **MetricCard** | 1 halaman | ⭐ |
| #9 | **RoomCard** | 1 halaman | ⭐ |
| #9 | **Sidebar** | 1 halaman | ⭐ |
| #9 | **StatusRow** | 1 halaman | ⭐ |

---

## 🎯 KATEGORI PENGGUNAAN

### 🔘 Komponen Aksi (Action Components)
**Dipakai di:** Dashboard, Customer, Reservation, Users

- **Button** → 6 halaman
- **Modal** → 3 halaman
- **Input** → 3 halaman

### 📊 Komponen Tampilan Data (Display Components)
**Dipakai di:** Dashboard, Customer, Reservation, Users

- **Table** → 3 halaman
- **Card** → 3 halaman
- **Badge** → 2 halaman
- **MetricCard** → 1 halaman
- **StatusRow** → 1 halaman

### 🎨 Komponen UI State (State Components)
**Dipakai di:** Customer, Reservation, Users, Payments

- **EmptyState** → 3 halaman
- **Loading** → 2 halaman

### 🧭 Komponen Navigasi (Navigation Components)
**Dipakai di:** MainLayout

- **Sidebar** → 1 halaman
- **Header** → 1 halaman

### 🛡️ Komponen Utilitas (Utility Components)
**Dipakai di:** main.jsx, Dashboard

- **ErrorBoundary** → 1 halaman
- **FeedbackItem** → 1 halaman
- **RoomCard** → 1 halaman

---

## 📂 DETAIL PENGGUNAAN PER HALAMAN

### 🏠 Dashboard.jsx (6 komponen)

**Import:**
```javascript
import { Button, MetricCard, RoomCard, StatusRow, FeedbackItem, Card } from '../components';
```

**Penggunaan:**
1. **Button** - Tombol "Lihat Semua", "Tambah Customer", navigasi
2. **MetricCard** - Card statistik (Total Customer, Total Reservasi, Revenue)
3. **RoomCard** - Card tipe kamar (Standard, Deluxe, Suite, Executive)
4. **StatusRow** - Status kamar (Available, Occupied, Maintenance)
5. **FeedbackItem** - Item feedback customer dengan rating
6. **Card** - Wrapper untuk konten section

---

### 👥 CustomerPage.jsx (3 komponen)

**Import:**
```javascript
import { Button, Table, EmptyState } from '../components';
```

**Penggunaan:**
1. **Button** - Tombol "Tambah Customer"
2. **Table** - Tabel daftar customer (nama, email, telepon, membership)
3. **EmptyState** - Tampilan saat tidak ada data customer

---

### 👤 CustomerDetail.jsx (4 komponen)

**Import:**
```javascript
import { Button, Modal, Input, Card } from '../components';
```

**Penggunaan:**
1. **Button** - Tombol "Kembali", "Edit Customer", "Simpan"
2. **Card** - Wrapper detail customer
3. **Modal** - Modal edit customer
4. **Input** - Input nama, email, telepon, alamat, kota

---

### 📋 ReservationPage.jsx (4 komponen)

**Import:**
```javascript
import { Button, Badge, Table, EmptyState } from '../components';
```

**Penggunaan:**
1. **Button** - Tombol "Tambah Reservasi"
2. **Badge** - Status pembayaran (Lunas/Pending/Belum Bayar)
3. **Table** - Tabel daftar reservasi
4. **EmptyState** - Tampilan saat tidak ada reservasi

---

### 📄 ReservationDetail.jsx (5 komponen)

**Import:**
```javascript
import { Button, Modal, Input, Badge, Card } from '../components';
```

**Penggunaan:**
1. **Button** - Tombol "Kembali", "Konfirmasi Pembayaran", "Edit"
2. **Badge** - Status pembayaran (Success/Warning/Danger)
3. **Card** - Wrapper detail reservasi
4. **Modal** - Modal konfirmasi pembayaran, edit reservasi
5. **Input** - Input nomor reservasi, nama, email, telepon

---

### 👨‍💼 UsersPage.jsx (6 komponen)

**Import:**
```javascript
import { Button, Table, Modal, Input, EmptyState, Loading } from '../components';
```

**Penggunaan:**
1. **Button** - Tombol "Tambah User", "Hapus", "Edit"
2. **Table** - Tabel daftar user
3. **Modal** - Modal tambah user, konfirmasi hapus
4. **Input** - Input nama, email, password, role
5. **EmptyState** - Tampilan saat tidak ada user
6. **Loading** - Loading saat fetch data dari Supabase

---

### 💳 PaymentsPage.jsx (1 komponen)

**Import:**
```javascript
import { Loading } from '../components';
```

**Penggunaan:**
1. **Loading** - Loading screen saat fetch data payment

**Potensi Tambahan:**
- Alert (untuk notifikasi)
- Dropdown (untuk filter status)
- Pagination (untuk data banyak)

---

### 📱 MainLayout.jsx (2 komponen)

**Import:**
```javascript
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
```

**Penggunaan:**
1. **Sidebar** - Navigasi sidebar kiri (menu Dashboard, Customer, dll)
2. **Header** - Header atas (title halaman, user info)

**Struktur:**
```jsx
<MainLayout>
  <Sidebar />
  <div className="main-content">
    <Header />
    <div className="page-content">
      {children}
    </div>
  </div>
</MainLayout>
```

---

### 🚀 main.jsx (1 komponen)

**Import:**
```javascript
import { ErrorBoundary } from './components';
```

**Penggunaan:**
1. **ErrorBoundary** - Wrapper global untuk catch error React

**Struktur:**
```jsx
<ErrorBoundary>
  <RouterProvider router={router} />
</ErrorBoundary>
```

---

## 🎨 VISUAL DIAGRAM: KOMPONEN FLOW

```
┌─────────────────────────────────────────────────────────┐
│                      MAIN APP                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │         ErrorBoundary (Global Wrapper)           │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │            MainLayout                      │  │  │
│  │  │  ┌────────────┐  ┌────────────────────────┤  │  │
│  │  │  │  Sidebar   │  │      Header            │  │  │
│  │  │  │            │  │                        │  │  │
│  │  │  │ • Menu     │  │ • Title                │  │  │
│  │  │  │ • Logout   │  │ • User Info            │  │  │
│  │  │  └────────────┘  └────────────────────────┤  │  │
│  │  │                                           │  │  │
│  │  │              PAGE CONTENT                  │  │  │
│  │  │  ┌──────────────────────────────────────┐ │  │  │
│  │  │  │ • Button                             │ │  │  │
│  │  │  │ • Card                               │ │  │  │
│  │  │  │ • Table                              │ │  │  │
│  │  │  │ • Modal                              │ │  │  │
│  │  │  │ • Input                              │ │  │  │
│  │  │  │ • Badge                              │ │  │  │
│  │  │  │ • Loading                            │ │  │  │
│  │  │  │ • EmptyState                         │ │  │  │
│  │  │  │ • ... (component lainnya)            │ │  │  │
│  │  │  └──────────────────────────────────────┘ │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 KESIMPULAN

### Halaman Paling Banyak Menggunakan Komponen:
1. 🥇 **Dashboard** → 6 komponen
2. 🥇 **UsersPage** → 6 komponen
3. 🥈 **ReservationDetail** → 5 komponen

### Komponen Paling Sering Digunakan:
1. 🥇 **Button** → 6 halaman (67% halaman)
2. 🥈 **Card, EmptyState, Input, Modal, Table** → 3 halaman (33% halaman)

### Coverage Komponen:
- **Terpakai:** 15 dari 23 komponen (65.2%)
- **Belum Terpakai:** 8 dari 23 komponen (34.8%)

### Rekomendasi:
- ⭐ Tambahkan **Alert** untuk notifikasi di semua form
- ⭐ Tambahkan **Pagination** di halaman dengan tabel besar
- ⭐ Tambahkan **Dropdown** untuk filter yang lebih elegan
- ⭐ Tambahkan **Avatar** di Header untuk user profile
- ⭐ Tambahkan **Breadcrumb** di semua halaman detail

---

**Dokumentasi dibuat:** 5 Juli 2026  
**Total Halaman:** 9  
**Total Komponen Reusable:** 23  
**Komponen Terpakai:** 15 (65.2%)
