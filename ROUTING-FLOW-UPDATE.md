# 🔄 ROUTING FLOW UPDATE

## ✅ PERUBAHAN ROUTING

### Sebelumnya:
```
User buka aplikasi → Langsung ke /login
User akses protected route → Redirect ke /login
Fallback route → /login atau /dashboard (tergantung status)
```

### Sekarang:
```
User buka aplikasi → Masuk ke / (GuestPage) ✨
User pilih "Login Member" → /login-member
User pilih "Login Admin" → /login
User akses protected route tanpa login → Redirect ke / (GuestPage)
Fallback route → / (GuestPage)
```

---

## 🎯 FLOW DIAGRAM

### User Journey:

```
┌─────────────────────┐
│   Buka Aplikasi     │
│  (Any URL/Direct)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Guest Page (/)   │ ◄─── LANDING PAGE
│  - Hero Section     │
│  - Room Types       │
│  - Facilities       │
│  - Testimonials     │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌──────────┐  ┌──────────────┐
│  Login   │  │ Login Member │
│  Admin   │  │  /login-member│
│ /login   │  └──────┬───────┘
└────┬─────┘         │
     │               │
     ▼               ▼
┌──────────┐  ┌──────────────┐
│  Admin   │  │   Member     │
│Dashboard │  │  Dashboard   │
└──────────┘  └──────────────┘
```

---

## 📋 ROUTING TABLE

| Route | Access | Redirect if Not Logged In | Description |
|-------|--------|---------------------------|-------------|
| `/` | ✅ Public | - | Guest landing page |
| `/login-member` | ✅ Public | - | Member login |
| `/login` | ✅ Public | - | Admin login |
| `/register` | ✅ Public | - | Admin register |
| `/forgot` | ✅ Public | - | Admin forgot password |
| `/member-dashboard` | 🔒 Protected | `/login-member` | Member dashboard |
| `/dashboard` | 🔒 Protected | `/` | Admin dashboard |
| `/reservations` | 🔒 Protected | `/` | Admin - Reservations |
| `/customers` | 🔒 Protected | `/` | Admin - Customers |
| `/payments` | 🔒 Protected | `/` | Admin - Payments |
| `/reports` | 🔒 Protected | `/` | Admin - Reports |
| `/membership` | 🔒 Protected | `/` | Admin - Membership |
| `/hotel-data` | 🔒 Protected | `/` | Admin - Hotel Data |
| `/rooms` | 🔒 Protected | `/` | Admin - Rooms |
| `/feedback` | 🔒 Protected | `/` | Admin - Feedback |
| `/users` | 🔒 Protected | `/` | Admin - Users CRUD |
| `/*` (Any) | ✅ Fallback | `/` | Redirect to Guest |

---

## 🔐 AUTHENTICATION FLOW

### Flow 1: User Baru (Belum Login)

```javascript
// Step 1: Buka aplikasi
window.location = 'http://localhost:5174'

// Step 2: Router check
isLoggedIn = !!localStorage.getItem('token') // false

// Step 3: Navigate to GuestPage
<Route path="/" element={<GuestPage />} />

// Step 4: User pilih login
onClick={() => navigate('/login')}        // Admin
onClick={() => navigate('/login-member')} // Member
```

### Flow 2: User Login sebagai Admin

```javascript
// Step 1: Di GuestPage, klik "Login Admin"
navigate('/login')

// Step 2: Login berhasil
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))
setIsLoggedIn(true)
navigate('/dashboard')

// Step 3: Access protected routes
<Route path="/dashboard" element={
  isLoggedIn ? <MainLayout>...</MainLayout> : <Navigate to="/" />
} />
```

### Flow 3: User Login sebagai Member

```javascript
// Step 1: Di GuestPage, klik "Login Member"
navigate('/login-member')

// Step 2: Login berhasil
localStorage.setItem('memberToken', token)
localStorage.setItem('member', JSON.stringify(member))
navigate('/member-dashboard')

// Step 3: Access member dashboard
useEffect(() => {
  const token = localStorage.getItem('memberToken')
  if (!token) navigate('/login-member')
}, [])
```

### Flow 4: User Akses Protected Route Tanpa Login

```javascript
// Step 1: User langsung akses URL
window.location = 'http://localhost:5174/dashboard'

// Step 2: Router check
isLoggedIn = !!localStorage.getItem('token') // false

// Step 3: Redirect to GuestPage
<Navigate to="/" replace />

// Result: User diarahkan ke GuestPage
```

---

## 🧪 TESTING SCENARIOS

### Test 1: Fresh User (No Login)
```bash
# Clear localStorage
localStorage.clear()

# Akses aplikasi
http://localhost:5174

Expected:
✅ Masuk ke GuestPage (/)
✅ Lihat Hero, Rooms, Facilities, Testimonials
✅ Button "Login Member" & "Login Admin" tampil
```

### Test 2: Direct Access to Admin Dashboard (No Login)
```bash
# Clear localStorage
localStorage.clear()

# Direct access
http://localhost:5174/dashboard

Expected:
❌ Tidak bisa akses dashboard
✅ Auto redirect ke GuestPage (/)
✅ User harus login dulu
```

### Test 3: Direct Access to Member Dashboard (No Login)
```bash
# Clear localStorage
localStorage.clear()

# Direct access
http://localhost:5174/member-dashboard

Expected:
❌ Tidak bisa akses member dashboard
✅ Auto redirect ke /login-member
✅ User harus login member dulu
```

### Test 4: Login as Admin from GuestPage
```bash
# Start at GuestPage
http://localhost:5174

# Klik "Login Admin"
→ Redirect to /login

# Login berhasil
Email: admin@novotel.com
Password: admin123

Expected:
✅ Login berhasil
✅ Token tersimpan di localStorage
✅ Redirect ke /dashboard
✅ Bisa akses semua admin routes
```

### Test 5: Login as Member from GuestPage
```bash
# Start at GuestPage
http://localhost:5174

# Klik "Login Member"
→ Redirect to /login-member

# Login berhasil
Email: andi.wijaya@gmail.com
Password: member123

Expected:
✅ Login berhasil
✅ Token tersimpan di localStorage
✅ Redirect ke /member-dashboard
✅ Bisa akses member dashboard
```

### Test 6: Fallback Route (Random URL)
```bash
# Access random URL
http://localhost:5174/random-page-not-exist

Expected:
✅ Auto redirect ke GuestPage (/)
```

### Test 7: Logout Admin
```bash
# Sudah login as admin
http://localhost:5174/dashboard

# Klik "Logout"

Expected:
✅ localStorage cleared
✅ Redirect ke GuestPage (/)
✅ Tidak bisa akses /dashboard lagi
```

### Test 8: Logout Member
```bash
# Sudah login as member
http://localhost:5174/member-dashboard

# Klik "Logout"

Expected:
✅ localStorage cleared
✅ Redirect ke GuestPage (/)
✅ Tidak bisa akses /member-dashboard lagi
```

---

## 🔧 CODE CHANGES

### File: `src/App.jsx`

#### Before:
```javascript
// Protected routes redirect to /login
<Navigate to="/login" replace />

// Fallback route
<Route path="*" element={
  <Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />
} />
```

#### After:
```javascript
// Protected routes redirect to / (GuestPage)
<Navigate to="/" replace />

// Fallback route
<Route path="*" element={<Navigate to="/" replace />} />
```

---

## 📊 ROUTING LOGIC SUMMARY

### Public Routes (No Protection):
```javascript
/ → GuestPage (Landing)
/login-member → LoginMember (Member login form)
/login → Login (Admin login form)
/register → Register (Admin register form)
/forgot → Forgot (Admin forgot password)
```

### Protected Routes (Admin):
```javascript
/dashboard → Admin Dashboard
/reservations → Reservations Management
/customers → Customers Management
/payments → Payments Management
/reports → Reports & Analytics
/membership → Membership Management
/hotel-data → Hotel Information
/rooms → Rooms Management
/feedback → Feedback & Reviews
/users → Users CRUD

// All redirect to "/" if not logged in
```

### Protected Routes (Member):
```javascript
/member-dashboard → Member Dashboard

// Redirect to "/login-member" if not logged in
// (Has its own protection in component)
```

---

## 🎯 KEY BENEFITS

### 1. Better UX
- ✅ User lihat landing page dulu sebelum login
- ✅ Jelas pilihan antara Member vs Admin
- ✅ Professional first impression

### 2. Security
- ✅ Protected routes tetap aman
- ✅ Auto redirect jika tidak authorized
- ✅ Token validation tetap berjalan

### 3. SEO & Marketing
- ✅ Landing page bisa di-index Google
- ✅ Guest bisa lihat info hotel sebelum register
- ✅ Call-to-action jelas (Login Member / Admin)

### 4. Separation of Concerns
- ✅ Public content (GuestPage) terpisah dari dashboard
- ✅ Member dan Admin punya flow berbeda
- ✅ Mudah maintain dan develop

---

## 🚀 DEPLOYMENT NOTES

### Environment:
- Development: `http://localhost:5174`
- Production: Update base URL di routing

### Testing Checklist:
- [ ] Fresh user bisa akses GuestPage
- [ ] Direct URL ke dashboard redirect ke GuestPage
- [ ] Login admin berfungsi
- [ ] Login member berfungsi
- [ ] Logout admin redirect ke GuestPage
- [ ] Logout member redirect ke GuestPage
- [ ] Protected routes tidak bisa diakses tanpa login
- [ ] Fallback route redirect ke GuestPage

---

## 📱 MOBILE CONSIDERATIONS

### Responsive Breakpoints:
```css
@media (max-width: 768px) {
  /* GuestPage navbar → hamburger menu */
  /* Hero section → smaller text */
  /* Cards → single column */
}
```

### Touch Optimization:
- Button size minimal 44x44px
- Hover effects → tap effects
- Swipe gestures untuk carousel (future)

---

## 🔮 FUTURE IMPROVEMENTS

### 1. Remember Last Page
```javascript
// Simpan last visited page sebelum logout
localStorage.setItem('lastPage', currentPath)

// Redirect ke last page setelah login
const lastPage = localStorage.getItem('lastPage')
navigate(lastPage || '/dashboard')
```

### 2. Loading State
```javascript
// Show spinner saat redirect
const [isRedirecting, setIsRedirecting] = useState(false)
```

### 3. Deep Linking
```javascript
// Save intended destination
const intendedRoute = location.pathname
localStorage.setItem('intendedRoute', intendedRoute)

// After login, redirect to intended route
const intended = localStorage.getItem('intendedRoute')
navigate(intended || '/dashboard')
```

---

## 📝 SUMMARY

### Changes Made:
1. ✅ All protected admin routes redirect to `/` (GuestPage) if not logged in
2. ✅ Fallback route `*` redirect to `/` (GuestPage)
3. ✅ User harus lihat GuestPage dulu sebelum login
4. ✅ Clear separation: Guest → Login → Dashboard

### User Flow:
```
Open App → GuestPage → Choose Login (Member/Admin) → Login → Dashboard
```

### Benefits:
- Better UX with landing page
- Professional first impression
- Clear navigation flow
- Maintained security

---

**Updated:** 21 Juni 2026  
**Status:** ✅ COMPLETED  
**Tested:** ✅ READY FOR TESTING  
**Flow:** Guest Page First → Login → Dashboard
