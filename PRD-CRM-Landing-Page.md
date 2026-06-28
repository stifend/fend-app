# Product Requirements Document (PRD)
## Landing Page CRM — NovaCRM

> Dokumen ini berisi 3 iterasi PRD (v1 → v2 → v3) yang menggambarkan
> evolusi landing page dari versi dasar hingga komplit untuk produk CRM.
> Setiap versi dilengkapi bagian **Hasil** (screenshot) dan **Bukti Commit**
> yang perlu diisi dari hasil eksekusi dan riwayat Git Anda.

| Info | Detail |
|---|---|
| Nama Produk | NovaCRM — Landing Page |
| Penyusun | _(nama Anda)_ |
| Tanggal | _(tanggal pengerjaan)_ |
| Versi Dokumen | v1, v2, v3 |
| Route Halaman | `/crm` |
| Teknologi | React 19, Vite, Supabase |

---

# 📄 PRD v1 — Versi Dasar

## 1. Latar Belakang
Tim sales membutuhkan satu halaman pengenalan produk CRM yang menjelaskan
nilai utama produk dan mengajak pengunjung untuk mencoba. Versi pertama ini
fokus pada kerangka paling esensial: pengunjung tahu *apa* produknya dan
*apa* langkah selanjutnya.

## 2. Tujuan
- Menyampaikan value proposition produk CRM dalam satu layar pertama (hero).
- Menampilkan fitur inti secara ringkas.
- Menyediakan satu Call To Action (CTA) yang jelas.

## 3. Target Pengguna
- Pemilik bisnis kecil yang mencari solusi pengelolaan pelanggan.
- Tim sales yang mengevaluasi tools CRM.

## 4. Pernyataan Masalah
Pengunjung yang baru pertama kali datang tidak memiliki gambaran cepat
tentang manfaat produk, sehingga langsung meninggalkan halaman (bounce).

## 5. Kebutuhan / Fitur (Scope v1)
| ID | Fitur | Prioritas |
|---|---|---|
| F1 | Navbar dengan logo & nama brand | Wajib |
| F2 | Hero section: judul, sub-judul, 1 tombol CTA | Wajib |
| F3 | Daftar fitur inti (minimal 3 kartu) | Wajib |
| F4 | Footer sederhana (kontak) | Wajib |

## 6. Di Luar Lingkup (Out of Scope v1)
- Pricing, testimoni, form lead, integrasi database.
- Responsivitas mobile penuh (cukup desktop dulu).

## 7. Kriteria Keberhasilan
- Halaman dapat diakses di route `/crm`.
- Hero, fitur, dan footer tampil tanpa error.
- Build produksi berhasil (`npm run build`).

## 8. Hasil (Screenshot) — 2 halaman
> Cukup 2 screenshot dari `/crm`:
> 1. **Hero section** (judul + tombol CTA)
> 2. **Section Features** (6 kartu fitur)

```
[ SCREENSHOT 1 PRD v1 — Hero ]
[ SCREENSHOT 2 PRD v1 — Features ]
```

## 9. Bukti Commit
> _Tempel screenshot `git log` atau halaman commit GitHub untuk versi ini._

```
[ BUKTI COMMIT PRD v1 — contoh: "feat: landing page CRM dasar (hero, fitur, footer)" ]
```

---

# 📄 PRD v2 — Versi Menengah

## 1. Latar Belakang
Setelah versi dasar tampil, evaluasi menunjukkan pengunjung butuh lebih banyak
alasan untuk percaya dan bertindak: informasi harga, bukti sosial, dan cara
mudah meninggalkan kontak. Versi ini memperkaya konten untuk meningkatkan
konversi.

## 2. Tujuan
- Menambah kepercayaan lewat testimoni pelanggan.
- Memberi transparansi harga (pricing tiers).
- Menyediakan lead form untuk menangkap calon pelanggan.
- Membuat halaman responsif di perangkat mobile.

## 3. Perubahan dari v1
| Aspek | v1 | v2 |
|---|---|---|
| Konten | Hero + fitur + footer | + Pricing, Testimoni, Lead Form |
| CTA | 1 tombol statis | CTA mengarah ke lead form (smooth scroll) |
| Layout | Desktop saja | Responsif (mobile & desktop) |

## 4. Kebutuhan / Fitur (Scope v2)
| ID | Fitur | Prioritas |
|---|---|---|
| F5 | Section Pricing (3 tier: Starter/Growth/Enterprise) | Wajib |
| F6 | Section Testimoni (minimal 3) | Wajib |
| F7 | Lead form (nama, email, perusahaan) | Wajib |
| F8 | Navigasi anchor + smooth scroll antar section | Sebaiknya |
| F9 | Layout responsif (breakpoint mobile) | Wajib |

## 5. Di Luar Lingkup (Out of Scope v2)
- Penyimpanan lead ke database (masih validasi front-end saja).
- Dashboard admin untuk melihat lead.

## 6. Kriteria Keberhasilan
- Semua section baru tampil dan tertata rapi.
- Lead form memvalidasi input (nama & email wajib).
- Halaman tampil baik di layar mobile (≤ 900px).

## 7. Hasil (Screenshot) — 2 halaman
> Cukup 2 screenshot dari `/crm`:
> 1. **Section Pricing** (3 tier harga)
> 2. **Lead Form** (form nama, email, perusahaan)

```
[ SCREENSHOT 1 PRD v2 — Pricing ]
[ SCREENSHOT 2 PRD v2 — Lead Form ]
```

## 8. Bukti Commit
> _Tempel screenshot commit untuk penambahan fitur v2._

```
[ BUKTI COMMIT PRD v2 — contoh: "feat: tambah pricing, testimoni, lead form & responsif" ]
```

---

# 📄 PRD v3 — Versi Komplit (Landing Page untuk CRM)

## 1. Latar Belakang
Versi final menjadikan landing page sebagai pintu masuk fungsional ekosistem
CRM: lead yang masuk benar-benar tersimpan ke database (Supabase) sehingga
tim sales dapat menindaklanjutinya. Landing page kini terhubung end-to-end
dengan backend CRM.

## 2. Tujuan
- Menyimpan setiap lead dari form ke database secara persisten.
- Menyiapkan struktur status lead (sales pipeline) untuk ditindaklanjuti.
- Memberikan umpan balik sukses/gagal yang jelas kepada pengunjung.
- Menjadi fondasi untuk dashboard admin CRM (melihat & mengelola lead).

## 3. Perubahan dari v2
| Aspek | v2 | v3 |
|---|---|---|
| Lead form | Validasi front-end saja | Tersimpan ke Supabase (RPC `create_lead`) |
| Data lead | Hilang setelah submit | Persisten di tabel `leads` |
| Pipeline | Tidak ada | Status lead: New → Contacted → Qualified → Won/Lost |
| Admin | Tidak ada | RPC `get_all_leads` untuk dashboard admin |

## 4. Kebutuhan / Fitur (Scope v3)
| ID | Fitur | Prioritas |
|---|---|---|
| F10 | Tabel `leads` di Supabase (id, name, email, company, status, created_at) | Wajib |
| F11 | RPC `create_lead` — simpan lead dari form | Wajib |
| F12 | Penanganan state: loading, sukses, error pada form | Wajib |
| F13 | RPC `get_all_leads` — dasar dashboard admin CRM | Sebaiknya |
| F14 | RLS + grant akses agar aman dipanggil dari frontend | Wajib |

## 5. Arsitektur Data
```
Pengunjung → Lead Form (CrmLanding.jsx)
           → supabase.rpc('create_lead', { name, email, company })
           → INSERT ke tabel public.leads (status awal: 'New')
           → Tim sales melihat via get_all_leads (dashboard admin)
```

### Skema tabel `leads`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid | Primary key, auto-generate |
| name | text | Nama lead (wajib) |
| email | text | Email lead (wajib) |
| company | text | Nama perusahaan (opsional) |
| status | text | New / Contacted / Qualified / Won / Lost |
| created_at | timestamptz | Waktu lead masuk |

## 6. Kriteria Keberhasilan
- Submit form berhasil menyimpan baris baru di tabel `leads`.
- Pesan sukses tampil setelah submit; pesan error tampil bila gagal.
- Lead dapat diambil kembali lewat RPC `get_all_leads`.
- Build produksi berhasil tanpa error.

## 7. Metrik Produk (Success Metrics)
- Conversion rate: % pengunjung yang mengisi lead form.
- Jumlah lead masuk per minggu.
- Lead quality: % lead yang berlanjut ke status Qualified/Won.

## 8. Hasil (Screenshot) — 2 halaman
> Cukup 2 screenshot:
> 1. **Pesan sukses** setelah submit lead form (di `/crm`)
> 2. **Data lead di tabel Supabase** (Table Editor → `leads`)

```
[ SCREENSHOT 1 PRD v3 — Pesan sukses submit ]
[ SCREENSHOT 2 PRD v3 — Data lead di Supabase ]
```

## 9. Bukti Commit
> _Tempel screenshot commit untuk integrasi database v3._

```
[ BUKTI COMMIT PRD v3 — contoh: "feat: integrasi lead form ke Supabase (tabel leads + RPC)" ]
```

---

# 📊 Ringkasan Evolusi PRD

| Versi | Fokus | Fitur Utama | Status Data |
|---|---|---|---|
| v1 | Kerangka dasar | Hero, fitur, footer | Tidak ada |
| v2 | Konversi | Pricing, testimoni, lead form, responsif | Front-end saja |
| v3 | Integrasi CRM | Lead tersimpan ke Supabase + pipeline | Persisten (database) |

---

# 📸 Checklist Screenshot (2 per versi = 6 total)

Semua screenshot diambil dari halaman `/crm`.
Jalankan `npm run dev` lalu buka `http://localhost:5173/crm`.

| Versi | # | Yang di-screenshot | Cara/Lokasi | Status |
|---|---|---|---|---|
| v1 | 1 | Hero section (judul + tombol CTA) | `/crm` layar pertama | ☐ |
| v1 | 2 | Section Features (6 kartu fitur) | `/crm` scroll ke "Fitur" | ☐ |
| v2 | 3 | Section Pricing (3 tier) | `/crm` scroll ke "Harga" | ☐ |
| v2 | 4 | Lead Form (kosong) | `/crm` section CTA bawah | ☐ |
| v3 | 5 | Pesan sukses setelah submit | `/crm` setelah klik "Coba Gratis" | ☐ |
| v3 | 6 | Data lead di tabel Supabase | Supabase → Table Editor → `leads` | ☐ |

> ⚠️ Sebelum screenshot v3 (#5–6), jalankan dulu `supabase_setup.sql` di SQL
> Editor Supabase agar tabel `leads` dan RPC `create_lead` tersedia. Tanpa itu,
> form akan menampilkan error, bukan pesan sukses.

---

# 📌 Catatan Pengisian

1. **Hasil**: jalankan `npm run dev`, buka `http://localhost:5173/crm`,
   lalu ambil screenshot tiap tahap sesuai versi.
2. **Bukti commit**: kerjakan secara bertahap dan commit per versi, contoh:
   ```bash
   git add .
   git commit -m "feat: landing page CRM dasar (PRD v1)"
   # ... lanjutkan fitur v2 ...
   git commit -m "feat: pricing, testimoni, lead form (PRD v2)"
   # ... lanjutkan integrasi v3 ...
   git commit -m "feat: integrasi lead form ke Supabase (PRD v3)"
   ```
   Lalu `git log --oneline` dan screenshot hasilnya untuk tiap bagian.
3. **Export ke PDF**: buka file ini di VS Code dengan ekstensi
   "Markdown PDF", atau paste ke Google Docs / Word lalu Save as PDF.