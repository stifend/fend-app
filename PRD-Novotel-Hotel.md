# Product Requirements Document (PRD)
## Novotel Hotel Management System

> Dokumen ini mendeskripsikan kebutuhan produk aplikasi manajemen hotel
> Novotel: sisi tamu/member (landing, booking, membership) dan sisi admin
> (dashboard, reservasi, pembayaran, laporan, manajemen user).
> Aplikasi dibangun dengan React + Vite dan terhubung ke Supabase.

| Info | Detail |
|---|---|
| Nama Produk | Novotel Hotel Management System |
| Penyusun | _(nama Anda)_ |
| Tanggal | _(tanggal pengerjaan)_ |
| Versi Dokumen | 1.0 |
| Teknologi | React 19, React Router 7, Vite, Supabase (PostgreSQL) |
| Repositori | _(link repo Anda)_ |

---

## 1. Latar Belakang

Pengelolaan hotel secara manual menyulitkan staf dalam memantau reservasi,
status pembayaran, dan data pelanggan. Di sisi lain, tamu membutuhkan cara
mudah untuk melihat kamar dan melakukan pemesanan secara online.

Novotel Hotel Management System menyatukan kedua kebutuhan tersebut dalam satu
aplikasi web: tamu dapat menjelajahi kamar dan memesan, sementara admin dapat
mengelola seluruh operasional dari satu dashboard.

## 2. Tujuan Produk

- Menyediakan landing page untuk menarik dan menginformasikan calon tamu.
- Memungkinkan member melakukan pemesanan kamar secara mandiri (self-service).
- Memberi admin kontrol penuh atas reservasi, pembayaran, dan data pelanggan.
- Menerapkan program membership berbasis total pengeluaran untuk retensi.
- Menyimpan seluruh data secara persisten di database (Supabase).

## 3. Target Pengguna

| Peran | Deskripsi | Akses |
|---|---|---|
| Tamu (Guest) | Pengunjung yang belum login | Landing page, lihat kamar |
| Member | Tamu terdaftar yang login | Booking, dashboard member, riwayat |
| Admin | Staf/pengelola hotel | CRUD penuh: reservasi, pembayaran, user, dll |

## 4. Pernyataan Masalah

- Tamu tidak punya kanal online untuk melihat kamar dan memesan.
- Admin kesulitan memantau status pembayaran dan rekap pendapatan.
- Data pelanggan dan loyalitas tidak terkelola secara terstruktur.

## 5. Lingkup Produk (Scope)

### 5.1 Modul Autentikasi
| ID | Fitur | Peran | Prioritas |
|---|---|---|---|
| A1 | Login (email + password) | Semua | Wajib |
| A2 | Register akun member baru | Tamu | Wajib |
| A3 | Lupa password | Semua | Sebaiknya |
| A4 | Redirect sesuai peran (admin/member) | Sistem | Wajib |

### 5.2 Modul Tamu & Member
| ID | Fitur | Peran | Prioritas |
|---|---|---|---|
| G1 | Landing page (hero, kamar, fasilitas, testimoni) | Tamu | Wajib |
| G2 | Lihat tipe kamar & harga | Tamu | Wajib |
| G3 | Booking kamar (pilih tanggal, hitung total + diskon) | Member | Wajib |
| G4 | Dashboard member (profil, riwayat, statistik) | Member | Wajib |
| G5 | Status & progress membership | Member | Wajib |

### 5.3 Modul Admin
| ID | Fitur | Peran | Prioritas |
|---|---|---|---|
| M1 | Dashboard ringkasan operasional | Admin | Wajib |
| M2 | Daftar & detail reservasi | Admin | Wajib |
| M3 | Update status pembayaran (Lunas/Pending/Belum Bayar) | Admin | Wajib |
| M4 | Daftar & detail customer | Admin | Wajib |
| M5 | Halaman pembayaran (statistik transaksi) | Admin | Wajib |
| M6 | Laporan & analitik (revenue per kamar/bulan) | Admin | Wajib |
| M7 | Manajemen membership | Admin | Sebaiknya |
| M8 | Data kamar (statistik hunian) | Admin | Sebaiknya |
| M9 | Feedback pelanggan | Admin | Sebaiknya |
| M10 | Manajemen user (CRUD, khusus admin) | Admin | Wajib |
| M11 | Data hotel (profil & fasilitas) | Admin | Opsional |

## 6. Aturan Membership

Tier ditentukan dari total pengeluaran akumulasi seluruh reservasi member.

| Tier | Ambang Total Pengeluaran | Diskon |
|---|---|---|
| None | Rp 0 (belum booking) | 0% |
| Silver | ≥ Rp 1 | 5% |
| Gold | ≥ Rp 5.000.000 | 10% |
| Platinum | ≥ Rp 15.000.000 | 15% |

Diskon otomatis diterapkan pada booking berikutnya sesuai tier saat itu.

## 7. Arsitektur Data (Supabase)

| Tabel | Fungsi |
|---|---|
| `users` | Akun login (admin & member), password di-hash bcrypt |
| `customers` | Profil pelanggan + tier membership |
| `reservations` | Data booking kamar + status pembayaran |
| `feedback` | Ulasan & keluhan pelanggan |
| `leads` | Calon pelanggan dari landing CRM (opsional) |

Fungsi RPC utama: `login_user`, `register_user`, `create_reservation`,
`get_all_reservations`, `get_member_reservations`, `update_payment_status`,
`get_all_customers`, `update_customer`, `get_all_feedback`, `get_member_summary`.

## 8. Alur Utama (User Flow)

### 8.1 Alur Booking Member
```
Landing page → pilih kamar → (login jika belum) → form booking
→ pilih tanggal & tamu → sistem hitung subtotal + diskon tier
→ simpan reservasi (status Pending) → tier member diperbarui otomatis
→ tampil di dashboard member & halaman admin
```

### 8.2 Alur Konfirmasi Pembayaran (Admin)
```
Admin buka daftar reservasi → pilih reservasi → ubah status pembayaran
→ (Lunas/Pending/Belum Bayar) → tersimpan ke database
→ statistik pembayaran & laporan ter-update
```

## 9. Kebutuhan Non-Fungsional

- **Keamanan**: password di-hash (bcrypt), tidak disimpan plaintext.
- **Persistensi**: seluruh data tersimpan di Supabase, bukan hanya memori.
- **Responsif**: tampilan menyesuaikan desktop dan mobile.
- **Ketersediaan**: aplikasi dapat di-deploy (Vercel).

## 10. Kriteria Keberhasilan

- Member dapat mendaftar, login, dan memesan kamar end-to-end.
- Diskon membership dihitung otomatis sesuai tier.
- Admin dapat mengubah status pembayaran dan melihat rekap pendapatan.
- Data tetap ada setelah refresh / login ulang (persisten di Supabase).
- Build produksi berhasil tanpa error (`npm run build`).

## 11. Di Luar Lingkup (Out of Scope)

- Pembayaran online / payment gateway nyata.
- Notifikasi email otomatis.
- Multi-bahasa dan multi-cabang hotel.
- Aplikasi mobile native.

## 12. Akun Demo

| Peran | Email | Password |
|---|---|---|
| Admin | admin@novotel.com | admin123 |
| Member | member@novotel.com | member123 |

---

# 📸 Checklist Screenshot per Versi PRD (2 per versi = 6 total)

PRD dievaluasi dalam 3 iterasi, mengikuti evolusi sistem dari sisi tamu →
member → admin. Tiap versi cukup 2 screenshot.

Jalankan `npm run dev`. Login memakai akun demo:
- Admin  : admin@novotel.com / admin123
- Member : member@novotel.com / member123

## PRD v1 — Versi Dasar (akses publik & autentikasi)
Fokus: pengunjung bisa melihat hotel dan masuk ke sistem.

| # | Halaman | Cara Akses | Status |
|---|---|---|---|
| 1 | Landing page (Hero) | buka `/` | ☐ |
| 2 | Halaman Login | `/login` | ☐ |

## PRD v2 — Versi Menengah (fitur member)
Fokus: member dapat memesan kamar dan melihat status keanggotaannya.

| # | Halaman | Cara Akses | Status |
|---|---|---|---|
| 3 | Form Booking (terisi tanggal + ringkasan harga) | login member → `/booking` | ☐ |
| 4 | Member Dashboard (profil & membership) | `/member-dashboard` | ☐ |

## PRD v3 — Versi Komplit (sisi admin & data persisten)
Fokus: admin mengelola operasional, data tersimpan di Supabase.

| # | Halaman | Cara Akses | Status |
|---|---|---|---|
| 5 | Dashboard Admin | login admin → `/dashboard` | ☐ |
| 6 | Halaman Pembayaran (statistik transaksi) | `/payments` | ☐ |

> ⚠️ Sebelum mengambil screenshot, pastikan `supabase_setup.sql` sudah
> dijalankan di SQL Editor Supabase agar tabel & data demo tersedia.

---

# 📌 Catatan

- **Evolusi PRD**: v1 (fondasi: landing + login) → v2 (fitur member: booking +
  dashboard) → v3 (sisi admin + data: dashboard admin + pembayaran).
- **Bukti commit**: kerjakan & commit bertahap per versi, lalu `git log --oneline`
  dan screenshot untuk tiap bagian. Contoh:
  ```bash
  git commit -m "feat: landing & login Novotel (PRD v1)"
  git commit -m "feat: booking & member dashboard (PRD v2)"
  git commit -m "feat: dashboard admin & pembayaran via Supabase (PRD v3)"
  ```
- **Export PDF**: buka file ini di VS Code dengan ekstensi "Markdown PDF",
  atau paste ke Google Docs / Word lalu Save as PDF.