# 🔢 UPDATE SIDEBAR - TAMBAH DATA DUMMY (BADGE COUNTER)

## ✅ YANG SUDAH DIKERJAKAN

Semua menu sidebar sekarang memiliki **badge counter** yang menampilkan data dummy berdasarkan kalkulasi dari data reservasi dan customer.

---

## 📊 BADGE COUNTER UNTUK SETIAP MENU

| No | Menu | Badge | Sumber Data | Kalkulasi |
|----|------|-------|-------------|-----------|
| 1 | 📊 Dashboard | `1` | Fixed | Static number |
| 2 | 📋 Reservasi | `800` | `reservations.length` | Total reservasi |
| 3 | 👥 Profil Pelanggan | `800` | `customers.length` | Total customer |
| 4 | 💳 Pembayaran | `~500` | `paidCount` | Filter status "Lunas" |
| 5 | 📊 Laporan | `~12` | `uniqueMonths` | Unique bulan dari check-in |
| 6 | ⭐ Membership | `~600` | `memberCount` | Customer dengan membership |
| 7 | 🏨 Kamar | `250` | `totalRooms` | Total kamar hotel (fixed) |
| 8 | 🏢 Data Hotel | `5` | Fixed | Static number (5 kategori data) |
| 9 | 💬 Feedback | `~240` | `feedbackCount` | 30% dari total reservasi |

---

## 💻 KODE IMPLEMENTASI

### Sidebar.jsx - Kalkulasi Badge

```javascript
const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const { reservations, customers } = useData();

  // ========== HITUNG DATA DUMMY UNTUK BADGE ========== 
  
  // 1. Pembayaran Lunas
  const paidCount = reservations.filter(r => r.payment === 'Lunas').length;
  
  // 2. Laporan (bulan unik dari check-in)
  const uniqueMonths = [...new Set(reservations.map(r => {
    const date = new Date(r.checkIn);
    return `${date.getMonth()}-${date.getFullYear()}`;
  }))].length;
  
  // 3. Member (customer dengan membership)
  const memberCount = customers.filter(c => 
    c.membershipLevel && c.membershipLevel !== 'None'
  ).length;
  
  // 4. Total kamar hotel
  const totalRooms = 250;
  
  // 5. Feedback (30% dari total reservasi)
  const feedbackCount = Math.floor(reservations.length * 0.3);

  return (
    // ... JSX
  );
};
```

---

## 🎯 DETAIL SETIAP BADGE

### 1️⃣ Dashboard Badge: `1`
**Kalkulasi:**
```javascript
<span className="menu-item-badge">1</span>
```
**Penjelasan:** Fixed number, menunjukkan 1 dashboard utama

---

### 2️⃣ Reservasi Badge: `800`
**Kalkulasi:**
```javascript
<span className="menu-item-badge">{reservations.length}</span>
```
**Penjelasan:** Total semua reservasi dari mockData
**Data Real:** 800 reservasi

---

### 3️⃣ Profil Pelanggan Badge: `800`
**Kalkulasi:**
```javascript
<span className="menu-item-badge">{customers.length}</span>
```
**Penjelasan:** Total semua customer dari mockData
**Data Real:** 800 customer

---

### 4️⃣ Pembayaran Badge: `~500`
**Kalkulasi:**
```javascript
const paidCount = reservations.filter(r => r.payment === 'Lunas').length;
<span className="menu-item-badge">{paidCount}</span>
```
**Penjelasan:** 
- Filter reservasi yang sudah **Lunas**
- Dari 800 reservasi, sekitar 60-65% sudah lunas
- Estimasi: 480-520 pembayaran lunas

---

### 5️⃣ Laporan Badge: `~12`
**Kalkulasi:**
```javascript
const uniqueMonths = [...new Set(reservations.map(r => {
  const date = new Date(r.checkIn);
  return `${date.getMonth()}-${date.getFullYear()}`;
}))].length;
<span className="menu-item-badge">{uniqueMonths}</span>
```
**Penjelasan:**
- Hitung bulan unik dari tanggal check-in
- Misal: Januari 2024, Februari 2024, dst
- Estimasi: 12 bulan (1 tahun data)

---

### 6️⃣ Membership Badge: `~600`
**Kalkulasi:**
```javascript
const memberCount = customers.filter(c => 
  c.membershipLevel && c.membershipLevel !== 'None'
).length;
<span className="menu-item-badge">{memberCount}</span>
```
**Penjelasan:**
- Filter customer yang punya membership (Silver/Gold/Platinum)
- Dari 800 customer, sekitar 75% adalah member
- Estimasi: 600 member aktif

---

### 7️⃣ Kamar Badge: `250`
**Kalkulasi:**
```javascript
const totalRooms = 250;
<span className="menu-item-badge">{totalRooms}</span>
```
**Penjelasan:** 
- Total kamar hotel (fixed/dummy)
- Breakdown:
  - Standard: 100 kamar
  - Deluxe: 80 kamar
  - Suite: 50 kamar
  - Executive: 20 kamar

---

### 8️⃣ Data Hotel Badge: `5`
**Kalkulasi:**
```javascript
<span className="menu-item-badge">5</span>
```
**Penjelasan:** 
- Fixed number (5 kategori data hotel)
- Misal: Lokasi, Fasilitas, Kontak, Info, History

---

### 9️⃣ Feedback Badge: `~240`
**Kalkulasi:**
```javascript
const feedbackCount = Math.floor(reservations.length * 0.3);
<span className="menu-item-badge">{feedbackCount}</span>
```
**Penjelasan:**
- 30% dari total reservasi memberikan feedback
- 800 × 30% = 240 feedback
- Asumsi: Tidak semua tamu memberikan review

---

## 🎨 TAMPILAN SIDEBAR

```
┌─────────────────────────────────┐
│  🏢 Novotel                     │
├─────────────────────────────────┤
│  📊 Dashboard           [1]     │
├─────────────────────────────────┤
│  📋 Reservasi         [800]     │
├─────────────────────────────────┤
│  👥 Profil Pelanggan  [800]     │
├─────────────────────────────────┤
│  💳 Pembayaran        [~500]    │
├─────────────────────────────────┤
│  📊 Laporan           [~12]     │
├─────────────────────────────────┤
│  ⭐ Membership        [~600]    │
├─────────────────────────────────┤
│  🏨 Kamar             [250]     │
├─────────────────────────────────┤
│  🏢 Data Hotel        [5]       │
├─────────────────────────────────┤
│  💬 Feedback          [~240]    │
├─────────────────────────────────┤
│                                 │
│  👤 Stifend                     │
│  🚪 Logout                      │
└─────────────────────────────────┘
```

---

## 📊 STATISTIK DATA DUMMY

### Berdasarkan 800 Reservasi & 800 Customer:

| Kategori | Jumlah | Persentase | Kalkulasi |
|----------|--------|------------|-----------|
| Total Reservasi | 800 | 100% | Base data |
| Pembayaran Lunas | ~500 | 62.5% | Filter status |
| Laporan Bulanan | ~12 | - | Unique months |
| Member Aktif | ~600 | 75% | Has membership |
| Total Kamar | 250 | - | Fixed |
| Data Hotel | 5 | - | Fixed |
| Feedback | ~240 | 30% | 800 × 0.3 |

---

## 🔄 DATA DINAMIS vs STATIS

### ✅ Data Dinamis (Update Otomatis):
1. **Reservasi** → Berubah jika data reservasi bertambah/berkurang
2. **Profil Pelanggan** → Berubah jika data customer bertambah
3. **Pembayaran** → Update saat payment status berubah
4. **Laporan** → Update jika ada reservasi bulan baru
5. **Membership** → Update jika customer upgrade/downgrade
6. **Feedback** → Update proporsional dengan reservasi

### ❌ Data Statis (Fixed):
1. **Dashboard** → Selalu 1
2. **Kamar** → Selalu 250 (kecuali renovasi hotel)
3. **Data Hotel** → Selalu 5 (kategori tetap)

---

## 🚀 CARA TEST

### 1. Run Dev Server:
```bash
npm run dev
```

### 2. Login ke Aplikasi:
- Username: `admin`
- Password: `123`

### 3. Lihat Sidebar:
- ✅ Setiap menu punya badge
- ✅ Badge menampilkan angka
- ✅ Angka sesuai dengan data

### 4. Test Dynamic Update:
```javascript
// Edit customer membership di CustomerDetail
// Badge Membership akan update otomatis

// Update payment status di ReservationDetail
// Badge Pembayaran akan update otomatis
```

---

## 💡 KEUNTUNGAN DATA DUMMY

### 1. **Visual Feedback**
- User langsung tahu ada berapa data
- Lebih informatif dari menu kosong

### 2. **Real-time Update**
- Badge update otomatis saat data berubah
- Menggunakan Context API (reactive)

### 3. **User Experience**
- Lebih professional
- Mudah navigasi
- Quick overview data

### 4. **Data Insight**
- Langsung tahu statistik penting
- Tidak perlu buka page dulu

---

## 📁 FILE YANG DIUBAH

### Sidebar.jsx
```diff
+ // Kalkulasi badge counters
+ const paidCount = reservations.filter(r => r.payment === 'Lunas').length;
+ const uniqueMonths = [...new Set(...)].length;
+ const memberCount = customers.filter(...).length;
+ const totalRooms = 250;
+ const feedbackCount = Math.floor(reservations.length * 0.3);

+ // Tambah badge di setiap menu
+ <span className="menu-item-badge">{paidCount}</span>
+ <span className="menu-item-badge">{uniqueMonths}</span>
+ <span className="menu-item-badge">{memberCount}</span>
+ <span className="menu-item-badge">{totalRooms}</span>
+ <span className="menu-item-badge">5</span>
+ <span className="menu-item-badge">{feedbackCount}</span>
```

---

## ✅ BUILD STATUS

```bash
npm run build
```

**Result:** ✅ SUCCESS
```
✓ dist/assets/index-C4CDkmEz.css   46.38 kB
✓ dist/assets/index-PvWGHpc2.js   315.53 kB (+0.63 kB)
✓ built in 2.26s
```

**Perubahan:**
- JS size bertambah 0.63 kB (untuk kalkulasi badge)
- No errors
- Build time normal

---

## 🎓 KESIMPULAN

### ✅ Yang Sudah Dikerjakan:
1. ✅ Semua 9 menu punya badge counter
2. ✅ 6 badge dinamis (update otomatis)
3. ✅ 3 badge statis (fixed number)
4. ✅ Kalkulasi berdasarkan data real
5. ✅ Build success tanpa error

### 📊 Summary Badge:
| Type | Count | Menus |
|------|-------|-------|
| Dynamic | 6 | Reservasi, Customer, Payments, Reports, Membership, Feedback |
| Static | 3 | Dashboard, Rooms, Hotel Data |

### 💡 Next Steps (Optional):
- [ ] Tambah color coding untuk badge (merah = urgent, hijau = ok)
- [ ] Tambah tooltip untuk detail info
- [ ] Tambah animation saat badge number berubah

---

**Update:** 7 Juni 2026  
**Status:** ✅ COMPLETE  
**Semua menu sidebar sekarang punya data dummy badge!** 🎉

