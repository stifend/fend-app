# 📝 PENJELASAN HOOKS - 5W+1H SIMPLE

## 🎯 USEREF - 4 LOKASI

### 1️⃣ Dropdown.jsx (Line 38)

**What:** Reference ke container dropdown  
**Why:** Deteksi klik di dalam atau di luar dropdown  
**Who:** User yang buka dropdown  
**When:** Setiap kali dropdown dibuka  
**Where:** Component Dropdown (reusable)  
**How:** 
```javascript
const dropdownRef = useRef(null);
<div ref={dropdownRef}>...</div>
if (dropdownRef.current.contains(event.target)) {
  // Inside
} else {
  setIsOpen(false); // Outside → Close
}
```

---

### 2️⃣ CustomerPage.jsx (Line 35)

**What:** Reference ke input search  
**Why:** Auto focus setelah loading, user langsung bisa ketik  
**Who:** User yang buka halaman Customer  
**When:** Setelah loading 1 detik selesai  
**Where:** Halaman Customer List  
**How:**
```javascript
const searchInputRef = useRef(null);
<Input ref={searchInputRef} />
useEffect(() => {
  if (!isLoading && searchInputRef.current) {
    searchInputRef.current.focus();
  }
}, [isLoading]);
```

---

### 3️⃣ ReservationPage.jsx (Line 36)

**What:** Reference ke container halaman  
**Why:** Auto scroll ke atas setelah loading  
**Who:** User yang refresh halaman  
**When:** Setelah loading 1.5 detik  
**Where:** Halaman Reservation List  
**How:**
```javascript
const containerRef = useRef(null);
<div ref={containerRef}>...</div>
useEffect(() => {
  if (!isLoading && containerRef.current) {
    containerRef.current.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
}, [isLoading]);
```

---

### 4️⃣ PaymentsPage.jsx (Line 31)

**What:** Store previous filter value  
**Why:** Track perubahan filter (debugging)  
**Who:** Developer untuk debugging  
**When:** Setiap filter berubah  
**Where:** Halaman Payments  
**How:**
```javascript
const previousStatusRef = useRef('All');
useEffect(() => {
  if (previousStatusRef.current !== selectedStatus) {
    console.log(`${previousStatusRef.current} → ${selectedStatus}`);
    previousStatusRef.current = selectedStatus;
  }
}, [selectedStatus]);
```

---

## 🎯 USEEFFECT - 9 LOKASI

### 1️⃣ Login.jsx (Line 32-36)

**What:** Auto redirect ke dashboard  
**Why:** Cegah user yang sudah login akses halaman login lagi  
**Who:** User yang sudah login  
**When:** Saat component mount  
**Where:** Halaman Login  
**How:**
```javascript
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) navigate("/dashboard", { replace: true });
}, [navigate]);
```

---

### 2️⃣ Dropdown.jsx (Line 41-56)

**What:** Detect click outside dropdown  
**Why:** Auto close dropdown kalau user klik di luar  
**Who:** User yang buka dropdown  
**When:** Setiap kali dropdown dibuka  
**Where:** Component Dropdown  
**How:**
```javascript
useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  
  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }
  
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isOpen]);
```

---

### 3️⃣ Loading.jsx (Line 32-40)

**What:** Fade-in animation  
**Why:** Loading muncul dengan smooth transition  
**Who:** Semua user yang lihat loading  
**When:** Saat Loading component mount  
**Where:** Component Loading  
**How:**
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    setIsVisible(true);
  }, 50);
  
  return () => clearTimeout(timer);
}, []);
```

---

### 4️⃣ CustomerPage.jsx (Line 38-51)

**What:** Fetch customer data dengan loading  
**Why:** Simulasi API call yang realistis  
**Who:** User yang buka halaman Customer  
**When:** Saat mount & saat data berubah  
**Where:** Halaman Customer  
**How:**
```javascript
useEffect(() => {
  setIsLoading(true);
  const timer = setTimeout(() => {
    setDisplayData(customers);
    setIsLoading(false);
  }, 1000);
  return () => clearTimeout(timer);
}, [customers]);
```

---

### 5️⃣ CustomerPage.jsx (Line 54-64)

**What:** Auto focus search input  
**Why:** User langsung bisa ketik tanpa click  
**Who:** User yang buka Customer  
**When:** Setelah loading selesai  
**Where:** Halaman Customer  
**How:**
```javascript
useEffect(() => {
  if (!isLoading && searchInputRef.current) {
    searchInputRef.current.focus();
  }
}, [isLoading]);
```

---

### 6️⃣ ReservationPage.jsx (Line 44-57)

**What:** Fetch reservation data  
**Why:** Loading yang realistis (1.5s)  
**Who:** User yang buka Reservation  
**When:** Saat mount & data berubah  
**Where:** Halaman Reservation  
**How:**
```javascript
useEffect(() => {
  setIsLoading(true);
  const timer = setTimeout(() => {
    setDisplayData(reservations);
    setIsLoading(false);
  }, 1500);
  return () => clearTimeout(timer);
}, [reservations]);
```

---

### 7️⃣ ReservationPage.jsx (Line 60-70)

**What:** Scroll to top  
**Why:** User selalu mulai dari atas  
**Who:** User yang refresh halaman  
**When:** Setelah loading selesai  
**Where:** Halaman Reservation  
**How:**
```javascript
useEffect(() => {
  if (!isLoading && containerRef.current) {
    containerRef.current.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
}, [isLoading]);
```

---

### 8️⃣ PaymentsPage.jsx (Line 34-47)

**What:** Fetch payment data  
**Why:** Loading cepat (800ms) untuk data finansial  
**Who:** User yang buka Payments  
**When:** Saat mount & data berubah  
**Where:** Halaman Payments  
**How:**
```javascript
useEffect(() => {
  setIsLoading(true);
  const timer = setTimeout(() => {
    setPaymentData(reservations);
    setIsLoading(false);
  }, 800);
  return () => clearTimeout(timer);
}, [reservations]);
```

---

### 9️⃣ PaymentsPage.jsx (Line 50-63)

**What:** Track filter changes  
**Why:** Debugging & monitoring  
**Who:** Developer  
**When:** Setiap filter berubah  
**Where:** Halaman Payments  
**How:**
```javascript
useEffect(() => {
  if (previousStatusRef.current !== selectedStatus) {
    console.log(`Changed: ${previousStatusRef.current} → ${selectedStatus}`);
    previousStatusRef.current = selectedStatus;
  }
}, [selectedStatus]);
```

---

## 💡 PERBEDAAN useState vs useEffect vs useRef

| Aspek | useState | useEffect | useRef |
|-------|----------|-----------|--------|
| **Re-render** | ✅ Ya | Via state | ❌ Tidak |
| **Purpose** | Reactive data | Side effects | DOM/Values |
| **Update** | `setState()` | Auto run | `ref.current =` |
| **UI Impact** | Langsung | Delayed | Tidak ada |
| **Use Case** | Form, toggle | API, events | Focus, scroll |

---

## 🚀 CARA TEST

### Test useRef - CustomerPage:
```
1. npm run dev
2. Login → Customer
3. Tunggu loading 1s
4. ✅ Input auto focus
5. Langsung ketik
```

### Test useRef - ReservationPage:
```
1. Reservation → Scroll bawah
2. Refresh (F5)
3. Tunggu loading 1.5s
4. ✅ Auto scroll atas
```

### Test useRef - PaymentsPage:
```
1. Payments → Console (F12)
2. Click filter buttons
3. ✅ Console log changes
```

---

**Dokumentasi Simple 5W+1H untuk Tugas! ✅**

