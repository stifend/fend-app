# 📍 LOKASI HOOKS - QUICK REFERENCE

## 🔍 CARA MENCARI DI VSCODE

### Method 1: Global Search
1. Tekan `Ctrl + Shift + F`
2. Ketik: `useState` atau `useEffect` atau `useRef`
3. Lihat hasil di sidebar

### Method 2: Go to Line
1. Buka file
2. Tekan `Ctrl + G`
3. Ketik nomor line
4. Enter

---

## ✅ useState - 15 LOKASI

```
1.  src/App.jsx (line 32-36)
    → isLoggedIn

2.  src/pages/auth/Login.jsx (line 17-28)
    → loading, error, dataForm, showPassword

3.  src/context/DataContext.jsx (line 24-27)
    → reservations, customers (800 data)

4.  src/pages/ReservationDetail.jsx (line 17-23)
    → reservationData, modals, editForm

5.  src/pages/PaymentsPage.jsx (line 9)
    → selectedStatus

6.  src/pages/ReportsPage.jsx (line 7)
    → selectedMonth

7.  src/pages/MembershipPage.jsx (line 9)
    → selectedLevel

8.  src/pages/HotelDataPage.jsx (line 5)
    → hotelInfo

9.  src/components/Dropdown.jsx (line 37)
    → isOpen

10. src/components/Tabs.jsx (line 31)
    → internalActiveTab

11. src/components/Loading.jsx (line 27)
    → isVisible

12. src/pages/CustomerPage.jsx (line 25-28)
    → isLoading, displayData, searchTerm

13. src/pages/ReservationPage.jsx (line 25-26)
    → isLoading, displayData

14. src/pages/PaymentsPage.jsx (line 16-17)
    → isLoading, paymentData

15. src/pages/CustomerPage.jsx (line 28)
    → searchTerm
```

---

## ✅ useEffect - 9 LOKASI

```
1.  src/pages/auth/Login.jsx (line 32-36)
    → Auto redirect jika sudah login
    → Dependency: [navigate]

2.  src/components/Dropdown.jsx (line 41-56)
    → Click outside detection
    → Dependency: [isOpen]
    → Cleanup: ✅ Remove event listener

3.  src/components/Loading.jsx (line 32-40)
    → Fade-in animation (50ms delay)
    → Dependency: []
    → Cleanup: ✅ Clear timeout

4.  src/pages/CustomerPage.jsx (line 38-51)
    → Fetch customer data (1 detik)
    → Dependency: [customers]
    → Cleanup: ✅ Clear timeout

5.  src/pages/CustomerPage.jsx (line 54-64)
    → Auto focus search input
    → Dependency: [isLoading]

6.  src/pages/ReservationPage.jsx (line 44-57)
    → Fetch reservation data (1.5 detik)
    → Dependency: [reservations]
    → Cleanup: ✅ Clear timeout

7.  src/pages/ReservationPage.jsx (line 60-70)
    → Scroll to top container
    → Dependency: [isLoading]

8.  src/pages/PaymentsPage.jsx (line 34-47)
    → Fetch payment data (800ms)
    → Dependency: [reservations]
    → Cleanup: ✅ Clear timeout

9.  src/pages/PaymentsPage.jsx (line 50-63)
    → Track filter changes (console log)
    → Dependency: [selectedStatus]
```

---

## ✅ useRef - 4 LOKASI

```
1.  src/components/Dropdown.jsx (line 38)
    → dropdownRef
    → Purpose: Click outside detection
    → Method: .contains(event.target)

2.  src/pages/CustomerPage.jsx (line 35)
    → searchInputRef
    → Purpose: Auto focus search
    → Method: .focus()

3.  src/pages/ReservationPage.jsx (line 36)
    → containerRef
    → Purpose: Scroll to top
    → Method: .scrollIntoView({ behavior: 'smooth' })

4.  src/pages/PaymentsPage.jsx (line 31)
    → previousStatusRef
    → Purpose: Store previous filter value
    → Method: Compare old vs new
```

---

## 📊 CONTOH CODE SETIAP HOOK

### useState Example (Login.jsx)
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [dataForm, setDataForm] = useState({ email: "", password: "" });
const [showPassword, setShowPassword] = useState(false);
```

---

### useEffect Example 1 (Login.jsx)
```javascript
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) navigate("/dashboard", { replace: true });
}, [navigate]);
```

---

### useEffect Example 2 (Dropdown.jsx)
```javascript
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

### useEffect Example 3 (CustomerPage.jsx)
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

### useRef Example 1 (CustomerPage.jsx)
```javascript
const searchInputRef = useRef(null);

useEffect(() => {
  if (!isLoading && searchInputRef.current) {
    searchInputRef.current.focus();
  }
}, [isLoading]);

<Input ref={searchInputRef} />
```

---

### useRef Example 2 (ReservationPage.jsx)
```javascript
const containerRef = useRef(null);

useEffect(() => {
  if (!isLoading && containerRef.current) {
    containerRef.current.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}, [isLoading]);

<div ref={containerRef}>...</div>
```

---

### useRef Example 3 (PaymentsPage.jsx)
```javascript
const previousStatusRef = useRef('All');

useEffect(() => {
  if (previousStatusRef.current !== selectedStatus) {
    console.log(`Filter changed: ${previousStatusRef.current} → ${selectedStatus}`);
    previousStatusRef.current = selectedStatus;
  }
}, [selectedStatus]);
```

---

## 🎯 KATEGORI HOOKS

### useState (15):
- **Auth**: 1 (Login status)
- **Forms**: 1 (Login form)
- **Global**: 1 (Customer + Reservations)
- **Filters**: 3 (Payments, Reports, Membership)
- **Components**: 2 (Dropdown, Tabs)
- **Loading**: 4 (Loading, CustomerPage, ReservationPage, PaymentsPage)
- **Static**: 1 (Hotel info)
- **Search**: 1 (CustomerPage)

### useEffect (9):
- **Navigation**: 1 (Auto redirect)
- **Events**: 1 (Click outside)
- **Animation**: 1 (Fade-in)
- **Data Fetch**: 3 (Customer, Reservation, Payment)
- **DOM**: 2 (Auto focus, Scroll)
- **Tracking**: 1 (Filter changes)

### useRef (4):
- **DOM Reference**: 3 (Dropdown, CustomerPage input, ReservationPage container)
- **Value Storage**: 1 (PaymentsPage previous value)

---

## 📁 FILE PATHS (Copy-Paste Ready)

### Components:
```
src/components/Loading.jsx
src/components/Dropdown.jsx
src/components/Tabs.jsx
src/components/index.js
```

### Pages:
```
src/pages/auth/Login.jsx
src/pages/CustomerPage.jsx
src/pages/ReservationPage.jsx
src/pages/PaymentsPage.jsx
src/pages/ReportsPage.jsx
src/pages/MembershipPage.jsx
src/pages/HotelDataPage.jsx
src/pages/ReservationDetail.jsx
```

### Context:
```
src/context/DataContext.jsx
```

---

## ⚡ QUICK TIPS

### useState:
✅ Untuk data yang berubah dan perlu re-render  
✅ Form inputs, toggle buttons, filter states  
✅ Update dengan setter function

### useEffect:
✅ Untuk side effects (API, events, timers)  
✅ Dependency array kontrol kapan jalan  
✅ Cleanup function untuk remove listeners

### useRef:
✅ Untuk akses DOM tanpa re-render  
✅ Store nilai yang persist tapi tidak trigger render  
✅ Update langsung via `.current`

---

**File ini untuk quick reference lokasi hooks!** 🚀

