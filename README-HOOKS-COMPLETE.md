# 📚 DOKUMENTASI LENGKAP REACT HOOKS - HOTEL CRM APP

## 🎯 TOTAL HOOKS DI PROJECT

| Hook | Total Lokasi |
|------|--------------|
| **useState** | 15 lokasi |
| **useEffect** | 9 lokasi |
| **useRef** | 4 lokasi |
| **TOTAL** | **28 hooks** ✅ |

---

## 📍 A. LOKASI useState (15 LOKASI)

| No | File | Line | State Variable | Fungsi |
|----|------|------|----------------|--------|
| 1 | `App.jsx` | 32-36 | `isLoggedIn` | Status login user |
| 2 | `Login.jsx` | 17-28 | `loading, error, dataForm, showPassword` | Form login |
| 3 | `DataContext.jsx` | 24-27 | `reservations, customers` | Global state 800 data |
| 4 | `ReservationDetail.jsx` | 17-23 | `reservationData, modals, editForm` | Detail reservasi |
| 5 | `PaymentsPage.jsx` | 9 | `selectedStatus` | Filter status |
| 6 | `ReportsPage.jsx` | 7 | `selectedMonth` | Filter bulan |
| 7 | `MembershipPage.jsx` | 9 | `selectedLevel` | Filter level |
| 8 | `HotelDataPage.jsx` | 5 | `hotelInfo` | Static data |
| 9 | `Dropdown.jsx` | 37 | `isOpen` | Toggle dropdown |
| 10 | `Tabs.jsx` | 31 | `internalActiveTab` | Active tab |
| 11 | `Loading.jsx` | 27 | `isVisible` | Fade animation |
| 12 | `CustomerPage.jsx` | 25-28 | `isLoading, displayData, searchTerm` | Loading & search |
| 13 | `ReservationPage.jsx` | 25-26 | `isLoading, displayData` | Loading state |
| 14 | `PaymentsPage.jsx` | 16-17 | `isLoading, paymentData` | Loading state |
| 15 | `CustomerPage.jsx` | 28 | `searchTerm` | Search filter |

---

## 📍 B. LOKASI useEffect (9 LOKASI)

| No | File | Line | Fungsi | Dependency |
|----|------|------|--------|------------|
| 1 | `Login.jsx` | 32-36 | Auto redirect jika sudah login | `[navigate]` |
| 2 | `Dropdown.jsx` | 41-56 | Click outside detection | `[isOpen]` |
| 3 | `Loading.jsx` | 32-40 | Fade-in animation | `[]` |
| 4 | `CustomerPage.jsx` | 38-51 | Fetch customer data (1s) | `[customers]` |
| 5 | `CustomerPage.jsx` | 54-64 | Auto focus search input | `[isLoading]` |
| 6 | `ReservationPage.jsx` | 44-57 | Fetch reservation data (1.5s) | `[reservations]` |
| 7 | `ReservationPage.jsx` | 60-70 | Scroll to top container | `[isLoading]` |
| 8 | `PaymentsPage.jsx` | 34-47 | Fetch payment data (800ms) | `[reservations]` |
| 9 | `PaymentsPage.jsx` | 50-63 | Track filter changes | `[selectedStatus]` |

---

## 📍 C. LOKASI useRef (4 LOKASI)

| No | File | Line | Fungsi | Use Case |
|----|------|------|--------|----------|
| 1 | `Dropdown.jsx` | 38 | Click outside detection | DOM Reference |
| 2 | `CustomerPage.jsx` | 35 | Auto focus search | DOM Reference |
| 3 | `ReservationPage.jsx` | 36 | Scroll to top | DOM Reference |
| 4 | `PaymentsPage.jsx` | 31 | Track previous value | Value Storage |

---

## 🎓 PENJELASAN 5W+1H - USEREF

### 1️⃣ Dropdown.jsx

**What:** Reference ke container dropdown  
**Why:** Untuk deteksi klik di luar dropdown  
**Who:** User yang buka dropdown  
**When:** Setiap kali dropdown dibuka  
**Where:** Component Dropdown (reusable)  
**How:** `dropdownRef.current.contains(event.target)` → Check inside/outside

---

### 2️⃣ CustomerPage.jsx

**What:** Reference ke input search  
**Why:** Auto focus setelah loading selesai  
**Who:** User yang buka halaman Customer  
**When:** Setelah loading 1 detik  
**Where:** Halaman Customer List  
**How:** `searchInputRef.current.focus()` → Focus otomatis

---

### 3️⃣ ReservationPage.jsx

**What:** Reference ke container halaman  
**Why:** Scroll ke atas setelah loading  
**Who:** User yang refresh halaman  
**When:** Setelah loading 1.5 detik  
**Where:** Halaman Reservation List  
**How:** `containerRef.current.scrollIntoView({ behavior: 'smooth' })` → Smooth scroll

---

### 4️⃣ PaymentsPage.jsx

**What:** Store previous filter value  
**Why:** Track perubahan filter  
**Who:** Developer (debugging)  
**When:** Setiap filter berubah  
**Where:** Halaman Payments  
**How:** Compare `previousStatusRef.current` vs `selectedStatus` → Console log

---

## 💡 KENAPA PAKAI USEREF?

### ✅ Keuntungan useRef:
1. **Tidak trigger re-render** (performance lebih baik)
2. **Value persist** antar renders (tidak hilang)
3. **Akses DOM langsung** (focus, scroll, measure)
4. **Store mutable values** (timer IDs, previous values)

### ❌ Kapan TIDAK pakai useRef?
1. Data yang harus tampil di UI → Pakai `useState`
2. Perubahan harus trigger render → Pakai `useState`
3. Form inputs (controlled) → Pakai `useState`

---

## 📊 PATTERN YANG DIGUNAKAN

### Pattern 1: DOM Reference + Auto Focus
```javascript
const inputRef = useRef(null);

useEffect(() => {
  if (inputRef.current) {
    inputRef.current.focus();
  }
}, []);

<Input ref={inputRef} />
```

---

### Pattern 2: Scroll Control
```javascript
const containerRef = useRef(null);

useEffect(() => {
  if (containerRef.current) {
    containerRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [trigger]);

<div ref={containerRef}>...</div>
```

---

### Pattern 3: Previous Value Tracking
```javascript
const previousValueRef = useRef(initialValue);

useEffect(() => {
  if (previousValueRef.current !== currentValue) {
    console.log(`Changed: ${previousValueRef.current} → ${currentValue}`);
    previousValueRef.current = currentValue;
  }
}, [currentValue]);
```

---

### Pattern 4: Click Outside Detection
```javascript
const elementRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (elementRef.current && !elementRef.current.contains(e.target)) {
      // Click outside
      setIsOpen(false);
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

---

## 🚀 CARA TEST

### Test 1: Auto Focus (CustomerPage)
```bash
npm run dev
```
1. Login
2. Klik menu **Customer**
3. Tunggu loading 1 detik
4. ✅ Input search auto focus
5. Langsung bisa ketik

---

### Test 2: Scroll to Top (ReservationPage)
1. Buka menu **Reservation**
2. Scroll ke bawah
3. Refresh (F5)
4. ✅ Auto scroll ke atas smooth

---

### Test 3: Filter Tracking (PaymentsPage)
1. Buka menu **Payments**
2. Open Console (F12)
3. Click filter buttons
4. ✅ Console log perubahan

---

## 📁 FILE YANG DIMODIFIKASI

### Components:
- ✅ `src/components/Loading.jsx` (created)
- ✅ `src/components/Dropdown.jsx` (already has useRef)
- ✅ `src/components/index.js` (export Loading)

### Pages:
- ✅ `src/pages/CustomerPage.jsx` (+ useRef + search)
- ✅ `src/pages/ReservationPage.jsx` (+ useRef + scroll)
- ✅ `src/pages/PaymentsPage.jsx` (+ useRef + tracking)

---

## ✅ BUILD STATUS

```bash
npm run build
```

**Result:** ✅ SUCCESS
```
✓ dist/assets/index-YC7_ZA6f.css  100.96 kB
✓ dist/assets/index-CXCumr6h.js   320.26 kB
✓ built in 1.08s
```

---

## 🎯 KESIMPULAN

### ✅ Yang Sudah Dikerjakan:
1. **Loading.jsx** component dengan useState + useEffect
2. **useRef** diterapkan di 3 pages (Customer, Reservation, Payments)
3. **Total 28 hooks** di seluruh project
4. **Dokumentasi lengkap** dengan 5W+1H

### 📊 Summary:
- **useState**: 15 lokasi (state management)
- **useEffect**: 9 lokasi (side effects)
- **useRef**: 4 lokasi (DOM & values)

### 🎓 Key Learning:
- useRef untuk DOM manipulation tanpa re-render
- useEffect untuk side effects dengan cleanup
- useState untuk reactive data yang perlu di UI

---

**Dokumentasi:** 7 Juni 2026  
**Project:** Hotel CRM App (React + Vite)  
**Status:** ✅ COMPLETE

