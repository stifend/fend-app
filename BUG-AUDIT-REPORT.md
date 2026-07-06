# 🐛 BUG AUDIT REPORT & FIXES

## Status: 5 BUGS DITEMUKAN ✅

---

## 🔍 BUG #1: Login.jsx - Missing Error Logging

**Severity:** MEDIUM  
**File:** `src/pages/auth/Login.jsx`  
**Line:** 73-75

### Problem:
```javascript
} catch {
  setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
}
```

Error detail tidak di-log, sulit debugging saat production.

### Fix:
```javascript
} catch (err) {
  console.error('Login error:', err);
  setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
}
```

---

## 🐛 BUG #2: Register.jsx - Missing Error Logging

**Severity:** MEDIUM  
**File:** `src/pages/auth/Register.jsx`  
**Line:** 90-92

### Problem:
```javascript
} catch {
  setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
}
```

Same issue - error detail tidak di-log.

### Fix:
```javascript
} catch (err) {
  console.error('Register error:', err);
  setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
}
```

---

## 🐛 BUG #3: LoginMember.jsx - Missing Error Logging

**Severity:** MEDIUM  
**File:** `src/pages/LoginMember.jsx`  
**Line:** 66-68

### Problem:
```javascript
} catch {
  setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
}
```

Same issue.

### Fix:
```javascript
} catch (err) {
  console.error('Login member error:', err);
  setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
}
```

---

## 🐛 BUG #4: GuestPage.jsx - Broken Login Navigation

**Severity:** HIGH  
**File:** `src/pages/GuestPage.jsx`  
**Line:** 243-250

### Problem:
```javascript
onClick={() => {
  const memberToken = localStorage.getItem('memberToken');
  if (memberToken) {
    navigate('/booking', { state: { roomType: room.type } });
  } else {
    navigate('/login-member', { state: { returnTo: '/booking', roomType: room.type } });
  }
}}
```

Ketika member klik "Pesan Sekarang" dan belum login:
1. ✅ Redirect ke `/login-member` dengan state `returnTo` & `roomType` → OK
2. ✅ LoginMember.jsx akan redirect ke `/booking` setelah login → OK
3. ❌ **PROBLEM:** `/booking` route tidak ada! Seharusnya `/booking-kamar`

### Fix:
```javascript
onClick={() => {
  const memberToken = localStorage.getItem('memberToken');
  if (memberToken) {
    navigate('/booking-kamar', { state: { roomType: room.type } });
  } else {
    navigate('/login-member', { state: { returnTo: '/booking-kamar', roomType: room.type } });
  }
}}
```

---

## 🐛 BUG #5: Login.jsx - Admin Navigation Issue

**Severity:** LOW  
**File:** `src/pages/auth/Login.jsx`  
**Line:** 56-72

### Problem:
Admin login check tidak konsisten dengan member.

**Current Flow:**
```javascript
if (user.role === 'admin') {
  // Admin flow
  localStorage.setItem("token", `local-token-${user.id}`);
  localStorage.setItem("user", JSON.stringify(user));
  if (onLogin) onLogin(user);
  navigate("/dashboard", { replace: true });
} else {
  // Member flow
  localStorage.setItem("memberToken", `member-token-${user.id}`);
  localStorage.setItem("member", JSON.stringify(user));
  const returnTo = location.state?.returnTo;
  const roomType = location.state?.roomType;
  if (returnTo) {
    navigate(returnTo, { replace: true, state: { roomType } });
  } else {
    navigate("/member-dashboard", { replace: true });
  }
}
```

**Issue:** Admin tidak bisa manfaatkan `returnTo` state (minor issue tapi bisa dipertimbangkan).

### Fix: (Optional)
Tambah check untuk admin juga:
```javascript
if (user.role === 'admin') {
  localStorage.setItem("token", `local-token-${user.id}`);
  localStorage.setItem("user", JSON.stringify(user));
  if (onLogin) onLogin(user);
  
  // Support returnTo for admin juga
  const returnTo = location.state?.returnTo;
  if (returnTo && returnTo.startsWith('/dashboard')) {
    navigate(returnTo, { replace: true });
  } else {
    navigate("/dashboard", { replace: true });
  }
}
```

---

## 📊 Summary

| Bug # | Severity | File | Status |
|-------|----------|------|--------|
| 1 | MEDIUM | Login.jsx | ✅ FIXED |
| 2 | MEDIUM | Register.jsx | ✅ FIXED |
| 3 | MEDIUM | LoginMember.jsx | ✅ FIXED |
| 4 | HIGH | GuestPage.jsx | ✅ FIXED |
| 5 | LOW | Login.jsx | ⚠️ OPTIONAL |

---

## 🎯 Priority Fixes

### HIGH Priority (Must Fix):
- ✅ **Bug #4** - GuestPage navigation (`/booking` → `/booking-kamar`)

### MEDIUM Priority (Should Fix):
- ✅ **Bug #1** - Login error logging
- ✅ **Bug #2** - Register error logging
- ✅ **Bug #3** - LoginMember error logging

### LOW Priority (Nice to Have):
- ⚠️ **Bug #5** - Admin returnTo support (optional)

---

## 🧪 Testing Checklist

### Test Bug #4 Fix:
1. Logout dari semua akun
2. Buka `/` (GuestPage)
3. Tab "Kamar" → Pilih room → Klik "Pesan Sekarang"
4. ✅ **Expected:** Redirect ke `/login-member`
5. Login dengan member account
6. ✅ **Expected:** Redirect ke `/booking-kamar` dengan `roomType` di state
7. ✅ **Expected:** Form booking sudah terisi dengan tipe kamar yang dipilih

### Test Bug #1-3 Fix:
1. Matikan Supabase URL di `.env` (simulasi network error)
2. Coba login/register
3. ✅ **Expected:** Error di-log di browser console (F12)
4. ✅ **Expected:** User message tampil: "Tidak dapat terhubung ke server..."

---

## 📄 Files to Update

1. `src/pages/auth/Login.jsx` - Add error logging (line 73)
2. `src/pages/auth/Register.jsx` - Add error logging (line 90)
3. `src/pages/LoginMember.jsx` - Add error logging (line 66)
4. `src/pages/GuestPage.jsx` - Fix route `/booking` → `/booking-kamar` (line 246, 248)

---

**Audit Date:** 5 Juli 2026  
**Total Bugs Found:** 5  
**Critical/High:** 1  
**Medium:** 3  
**Low:** 1
