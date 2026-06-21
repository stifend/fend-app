# 🔄 UNIFIED LOGIN - Gabung Admin & Member

## ✅ PERUBAHAN

**Before:** 2 halaman login terpisah
- `/login` → Admin only
- `/login-member` → Member only

**After:** 1 halaman login untuk semua
- `/login` → Auto detect role (Admin atau Member)

---

## 🎯 HOW IT WORKS

### Unified Login Logic:

```javascript
// Login.jsx
const handleSubmit = async (e) => {
  // 1. Validate credentials
  const { data } = await supabase.rpc("login_user", {
    p_email: email,
    p_password: password
  });
  
  const user = data[0];
  
  // 2. Check role dan redirect sesuai role
  if (user.role === 'admin') {
    // Admin Login
    localStorage.setItem("token", `local-token-${user.id}`);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard"); // → Admin Dashboard
  } else {
    // Member Login
    localStorage.setItem("memberToken", `member-token-${user.id}`);
    localStorage.setItem("member", JSON.stringify(user));
    navigate("/member-dashboard"); // → Member Dashboard
  }
};
```

---

## 📋 FILES MODIFIED

### 1. **src/pages/auth/Login.jsx**

**Changes:**
- ✅ Update title: "Login" (was: "Login ke Dashboard")
- ✅ Update subtitle: "Masuk dengan akun Admin atau Member"
- ✅ Update placeholder: "admin@novotel.com atau member@novotel.com"
- ✅ Add role detection logic
- ✅ Redirect based on role (admin → /dashboard, member → /member-dashboard)

### 2. **src/App.jsx**

**Changes:**
- ❌ Remove import `LoginMember`
- ❌ Remove route `/login-member`
- ✅ Keep only `/login` route

### 3. **src/pages/GuestPage.jsx**

**Changes:**
- ✅ Change all `/login-member` to `/login`
- ✅ Update button text: "Login Member" → "Login"
- ✅ Update button text: "Login Admin" → (removed, only 1 button "Login")

### 4. **src/pages/BookingPage.jsx**

**Changes:**
- ✅ Change redirect from `/login-member` to `/login`

### 5. **src/pages/MemberDashboard.jsx**

**Changes:**
- ✅ Change redirect from `/login-member` to `/login`

### 6. **src/pages/LoginMember.jsx**

**Status:** ❌ No longer used (can be deleted)

---

## 🔄 USER FLOW

### Flow 1: Member Login

```
1. User buka GuestPage (/)
2. Klik button "Login"
3. Redirect ke /login
4. Input credentials:
   Email: andi.wijaya@gmail.com
   Password: member123
5. Submit form
6. System detect: role = "user"
7. Save memberToken & member data
8. Redirect ke /member-dashboard ✅
```

### Flow 2: Admin Login

```
1. User buka GuestPage (/)
2. Klik button "Login"
3. Redirect ke /login
4. Input credentials:
   Email: admin@novotel.com
   Password: admin123
5. Submit form
6. System detect: role = "admin"
7. Save token & user data
8. Redirect ke /dashboard ✅
```

### Flow 3: Booking without Login

```
1. User di GuestPage
2. Klik "Pesan Sekarang" pada room
3. Check: memberToken exists? NO
4. Redirect ke /login dengan state
5. After login → redirect to /booking ✅
```

---

## 🧪 TESTING

### Test 1: Admin Login

```bash
URL: http://localhost:5174/login

Credentials:
Email: admin@novotel.com
Password: admin123

Expected:
✅ Login berhasil
✅ Token tersimpan di localStorage
✅ Redirect ke /dashboard (Admin Dashboard)
✅ Sidebar admin tampil
✅ Bisa akses semua admin routes
```

### Test 2: Member Login

```bash
URL: http://localhost:5174/login

Credentials:
Email: andi.wijaya@gmail.com
Password: member123

Expected:
✅ Login berhasil
✅ memberToken tersimpan di localStorage
✅ Redirect ke /member-dashboard (Member Dashboard)
✅ 4 tabs tampil (Profile, Booking, Riwayat, Statistik)
✅ Bisa booking kamar
```

### Test 3: Login from GuestPage

```bash
1. Buka http://localhost:5174/
2. Klik button "Login" (hanya 1 button sekarang)
3. Masuk ke /login
4. Login dengan member atau admin
5. Expected: Redirect sesuai role
```

### Test 4: Wrong Credentials

```bash
URL: http://localhost:5174/login

Credentials:
Email: wrong@email.com
Password: wrongpass

Expected:
❌ Error: "Email atau password salah"
❌ Tidak redirect
✅ Form tetap tampil
```

---

## 📊 ROUTING TABLE

| URL | Access | Role | Redirect To |
|-----|--------|------|-------------|
| `/` | Public | - | Guest Page |
| `/login` | Public | Auto | `/dashboard` (admin) or `/member-dashboard` (member) |
| `/dashboard` | Protected | Admin | - |
| `/member-dashboard` | Protected | Member | - |
| `/booking` | Protected | Member | - |
| `/register` | Public | Admin | - |
| `/forgot` | Public | Admin | - |

---

## 🎨 UI CHANGES

### Guest Page Navbar:

**Before:**
```
[Login Member] [Login Admin]
```

**After:**
```
[Login]
```

### Hero Section:

**Before:**
```
[Jelajahi Kamar] [Login Member]
```

**After:**
```
[Jelajahi Kamar] [Login]
```

### Login Page:

**Before (2 pages):**
```
/login        → "Login ke Dashboard" (Admin only)
/login-member → "Login Member" (Member only)
```

**After (1 page):**
```
/login → "Login" (Auto detect role)
```

---

## 🔐 AUTHENTICATION LOGIC

### Token Storage:

```javascript
// Admin
localStorage.setItem("token", `local-token-${userId}`);
localStorage.setItem("user", JSON.stringify(user));

// Member
localStorage.setItem("memberToken", `member-token-${userId}`);
localStorage.setItem("member", JSON.stringify(member));
```

### Protected Routes Check:

```javascript
// Admin routes (App.jsx)
const isLoggedIn = !!localStorage.getItem("token");

// Member routes (component level)
const memberToken = localStorage.getItem("memberToken");
if (!memberToken) navigate("/login");
```

---

## 💡 BENEFITS

### 1. Simpler UX
- ✅ User tidak bingung mana login yang harus dipilih
- ✅ Hanya 1 URL untuk login: `/login`
- ✅ System otomatis redirect sesuai role

### 2. Cleaner Code
- ✅ Remove duplicate login component (LoginMember.jsx)
- ✅ Less routes to manage
- ✅ Single source of truth untuk authentication

### 3. Better Maintenance
- ✅ Update login logic di 1 tempat
- ✅ Easier to add features (e.g., 2FA)
- ✅ Consistent error handling

### 4. Professional Feel
- ✅ Seperti aplikasi enterprise (1 login untuk semua)
- ✅ Role-based auto redirect
- ✅ No confusion untuk end users

---

## 📦 BUILD STATUS

```bash
✓ 139 modules transformed (-1 from 140)
dist/assets/index-Dixhbbl4.css   81.68 kB
dist/assets/index-xd-9AYLW.js   560.18 kB (-3 kB from 563.16 kB)
✓ built in 3.57s
```

**Changes:**
- Modules: 140 → **139** (-1, removed LoginMember)
- JS: 563.16 kB → **560.18 kB** (-2.98 kB)
- CSS: No change (81.68 kB)

---

## 🔮 FUTURE ENHANCEMENTS

### 1. Remember Me
```javascript
<input type="checkbox" name="remember" />
if (remember) {
  localStorage.setItem("rememberMe", "true");
}
```

### 2. Social Login
```javascript
// Login with Google, Facebook
<button onClick={loginWithGoogle}>
  Login with Google
</button>
```

### 3. 2FA (Two-Factor Authentication)
```javascript
// After password, ask for OTP
if (user.twoFactorEnabled) {
  navigate("/verify-otp");
}
```

### 4. Password Strength Indicator
```javascript
<PasswordStrengthBar password={password} />
```

---

## ✅ COMPLETION CHECKLIST

- [x] Update Login.jsx with role detection
- [x] Remove LoginMember.jsx from imports
- [x] Remove /login-member route
- [x] Update GuestPage buttons
- [x] Update BookingPage redirect
- [x] Update MemberDashboard redirect
- [x] Build successful
- [x] Testing guide created
- [x] Documentation complete

---

## 📝 CREDENTIALS REFERENCE

### Admin:
```
Email   : admin@novotel.com
Password: admin123
Role    : admin
Redirect: /dashboard
```

### Member (No History):
```
Email   : member@novotel.com
Password: 123456
Role    : user
Redirect: /member-dashboard
```

### Member (With History):
```
Email   : andi.wijaya@gmail.com
Password: member123
Role    : user
Redirect: /member-dashboard
```

---

## 🎉 RESULT

**Unified Login Ready! ✅**

**Single Login Page:**
- URL: http://localhost:5174/login
- Auto detect role
- Redirect sesuai role
- Cleaner & simpler UX

**Test It:**
1. Buka http://localhost:5174/
2. Klik "Login"
3. Login dengan admin atau member
4. System otomatis redirect ke dashboard yang sesuai!

---

**Updated:** 21 Juni 2026  
**Status:** ✅ COMPLETED  
**Modules:** -1 (cleaner)  
**UX:** Better (1 login untuk semua)
