# ⚡ QUICK REFERENCE - REACT HOOKS

## 📊 TOTAL HOOKS: 28

| Hook | Jumlah |
|------|--------|
| useState | 15 |
| useEffect | 9 |
| useRef | 4 |

---

## 🎯 USEREF (4 LOKASI) - FOKUS TUGAS

### 1. Dropdown.jsx (line 38)
- **Fungsi:** Click outside detection
- **Method:** `.contains(event.target)`

### 2. CustomerPage.jsx (line 35) ⭐
- **Fungsi:** Auto focus search
- **Method:** `.focus()`

### 3. ReservationPage.jsx (line 36) ⭐
- **Fungsi:** Scroll to top
- **Method:** `.scrollIntoView({ behavior: 'smooth' })`

### 4. PaymentsPage.jsx (line 31) ⭐
- **Fungsi:** Track previous value
- **Method:** Compare old vs new

---

## 🎓 5W+1H SUPER SIMPLE

### CustomerPage - useRef
**What:** Reference ke input search  
**Why:** Auto focus setelah loading  
**Who:** User yang buka Customer  
**When:** Setelah loading 1 detik  
**Where:** Halaman Customer  
**How:** `searchInputRef.current.focus()`

### ReservationPage - useRef
**What:** Reference ke container  
**Why:** Scroll ke atas setelah loading  
**Who:** User yang refresh  
**When:** Setelah loading 1.5 detik  
**Where:** Halaman Reservation  
**How:** `containerRef.current.scrollIntoView({ behavior: 'smooth' })`

### PaymentsPage - useRef
**What:** Store previous filter  
**Why:** Track perubahan filter  
**Who:** Developer (debugging)  
**When:** Setiap filter berubah  
**Where:** Halaman Payments  
**How:** Compare `previousStatusRef.current` vs `selectedStatus`

---

## 💡 KENAPA USEREF?

### ✅ Keuntungan:
1. **Tidak re-render** → Performance lebih cepat
2. **Value persist** → Tidak hilang antar renders
3. **Akses DOM** → Focus, scroll, measure
4. **Store values** → Timer IDs, previous values

### ❌ Kapan TIDAK pakai:
1. Data yang harus tampil di UI → Pakai `useState`
2. Perubahan harus trigger render → Pakai `useState`

---

## 🚀 TEST CEPAT

```bash
npm run dev
```

### Test 1: CustomerPage
1. Login → Customer
2. Tunggu 1s
3. ✅ Input auto focus

### Test 2: ReservationPage
1. Reservation → Scroll bawah
2. Refresh (F5)
3. ✅ Auto scroll atas

### Test 3: PaymentsPage
1. Payments → F12 (Console)
2. Click filters
3. ✅ Console log changes

---

## 📁 FILE PATHS

```
src/components/Dropdown.jsx
src/pages/CustomerPage.jsx
src/pages/ReservationPage.jsx
src/pages/PaymentsPage.jsx
```

---

## 📚 DOKUMENTASI LENGKAP

| File | Untuk Apa |
|------|-----------|
| **DAFTAR-ISI-HOOKS.md** | Index semua dokumentasi |
| **README-HOOKS-COMPLETE.md** | Dokumentasi lengkap |
| **HOOKS-LOCATION.md** | Quick reference lokasi |
| **HOOKS-5W1H-SIMPLE.md** | Penjelasan simple |
| **QUICK-REFERENCE.md** | File ini - super cepat |

---

## ✅ BUILD STATUS

```
npm run build
✓ dist/assets/index-YC7_ZA6f.css  100.96 kB
✓ dist/assets/index-CXCumr6h.js   320.26 kB
✓ built in 1.08s
```

---

**Quick Reference untuk Tugas!** ⚡

