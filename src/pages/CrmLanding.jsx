// ========================================
// 🚀 CRM LANDING PAGE - NovaCRM
// ========================================
// Halaman pemasaran untuk produk CRM (SaaS).
// Struktur landing page standar:
//   Navbar -> Hero -> Features -> Pricing -> Testimonials
//   -> CTA + Lead Form -> Footer
//
// Lead form menyimpan calon pelanggan (lead) ke Supabase
// lewat RPC create_lead. Bila RPC belum tersedia, error ditangani
// dengan pesan ramah (tidak membuat halaman crash).
// ========================================

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import '../crm-landing.css';

const features = [
  { icon: '👥', title: 'Manajemen Kontak', desc: 'Simpan seluruh data pelanggan, riwayat interaksi, dan catatan dalam satu tempat terpusat.' },
  { icon: '📊', title: 'Sales Pipeline', desc: 'Pantau setiap deal dari prospek hingga closing dengan papan pipeline visual drag-and-drop.' },
  { icon: '⚡', title: 'Automation', desc: 'Otomatiskan follow-up, email, dan tugas berulang agar tim fokus pada penjualan.' },
  { icon: '📈', title: 'Analytics & Laporan', desc: 'Dashboard real-time untuk memantau performa tim, konversi, dan proyeksi pendapatan.' },
  { icon: '📧', title: 'Email Terintegrasi', desc: 'Kirim dan lacak email langsung dari CRM, lengkap dengan template dan notifikasi dibuka.' },
  { icon: '🔒', title: 'Keamanan Data', desc: 'Enkripsi end-to-end, kontrol akses berbasis peran, dan audit log untuk setiap aktivitas.' },
];

const pricing = [
  {
    name: 'Starter',
    price: 'Rp 0',
    period: '/bulan',
    desc: 'Untuk tim kecil yang baru mulai.',
    features: ['1 pengguna', '500 kontak', 'Pipeline dasar', 'Email support'],
    featured: false,
    cta: 'Mulai Gratis',
  },
  {
    name: 'Growth',
    price: 'Rp 299rb',
    period: '/bulan',
    desc: 'Untuk tim yang sedang berkembang.',
    features: ['10 pengguna', 'Kontak tanpa batas', 'Automation', 'Analytics lanjutan', 'Priority support'],
    featured: true,
    cta: 'Coba 14 Hari Gratis',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Untuk perusahaan skala besar.',
    features: ['Pengguna tanpa batas', 'Dedicated manager', 'Custom integrasi', 'SLA 99.9%', 'Onboarding khusus'],
    featured: false,
    cta: 'Hubungi Sales',
  },
];

const testimonials = [
  { quote: 'NovaCRM menaikkan konversi sales kami 40% dalam 3 bulan. Pipeline-nya sangat intuitif.', name: 'Dimas Pratama', role: 'Sales Director, TechnoID', initial: 'DP' },
  { quote: 'Automation-nya menghemat 15 jam kerja tim per minggu. Tidak ada lagi follow-up yang terlewat.', name: 'Laras Wibowo', role: 'CEO, GrowthLab', initial: 'LW' },
  { quote: 'Akhirnya semua data pelanggan terpusat. Laporannya membantu kami ambil keputusan cepat.', name: 'Reza Maulana', role: 'COO, RetailNusa', initial: 'RM' },
];

const CrmLanding = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Simpan lead ke Supabase (RPC create_lead).
      const { error: rpcError } = await supabase.rpc('create_lead', {
        p_name: form.name,
        p_email: form.email,
        p_company: form.company || null,
      });

      if (rpcError) {
        console.error('Gagal menyimpan lead:', rpcError);
        setError('Gagal mengirim. Coba lagi sebentar.');
        return;
      }

      setSuccess(true);
      setForm({ name: '', email: '', company: '' });
    } catch {
      setError('Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="crm-landing">
      {/* ---------- Navbar ---------- */}
      <nav className="crm-navbar">
        <div className="crm-container crm-navbar-inner">
          <div className="crm-brand">
            <span className="crm-brand-logo">N</span>
            NovaCRM
          </div>
          <div className="crm-nav-links">
            <a onClick={() => scrollTo('features')}>Fitur</a>
            <a onClick={() => scrollTo('pricing')}>Harga</a>
            <a onClick={() => scrollTo('testimonials')}>Testimoni</a>
          </div>
          <div className="crm-nav-cta">
            <button className="crm-btn crm-btn-ghost" onClick={() => scrollTo('lead')}>Masuk</button>
            <button className="crm-btn crm-btn-primary" onClick={() => scrollTo('lead')}>Coba Gratis</button>
          </div>
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <header className="crm-hero">
        <div className="crm-container crm-hero-grid">
          <div>
            <span className="crm-hero-badge">✨ CRM #1 untuk bisnis berkembang</span>
            <h1>
              Kelola pelanggan, <span className="accent">tutup lebih banyak deal</span>
            </h1>
            <p className="lead">
              NovaCRM membantu tim sales Anda mengelola kontak, melacak pipeline,
              dan mengotomatiskan follow-up &mdash; semua dalam satu platform.
            </p>
            <div className="crm-hero-actions">
              <button className="crm-btn crm-btn-primary" onClick={() => scrollTo('lead')}>Mulai Gratis</button>
              <button className="crm-btn crm-btn-ghost" onClick={() => scrollTo('features')}>Lihat Fitur</button>
            </div>
            <div className="crm-hero-trust">
              <div className="crm-trust-item"><div className="num">12K+</div><div className="lbl">Tim menggunakan</div></div>
              <div className="crm-trust-item"><div className="num">40%</div><div className="lbl">Rata-rata kenaikan konversi</div></div>
              <div className="crm-trust-item"><div className="num">99.9%</div><div className="lbl">Uptime SLA</div></div>
            </div>
          </div>
          <div className="crm-hero-visual">
            <div className="crm-mock-row"><span className="name">PT Maju Jaya</span><span className="stage">Negosiasi</span></div>
            <div className="crm-mock-row"><span className="name">CV Sukses Mandiri</span><span className="stage">Proposal</span></div>
            <div className="crm-mock-row"><span className="name">Toko Berkah</span><span className="stage">Closing</span></div>
            <div className="crm-mock-row"><span className="name">Startup Nusantara</span><span className="stage">Prospek</span></div>
          </div>
        </div>
      </header>

      {/* ---------- Features ---------- */}
      <section className="crm-section" id="features">
        <div className="crm-container">
          <div className="crm-section-head">
            <h2>Semua yang tim Anda butuhkan</h2>
            <p>Fitur lengkap untuk mengelola hubungan pelanggan dari awal hingga closing.</p>
          </div>
          <div className="crm-features-grid">
            {features.map((f) => (
              <div className="crm-feature-card" key={f.title}>
                <div className="crm-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section className="crm-section crm-muted" id="pricing">
        <div className="crm-container">
          <div className="crm-section-head">
            <h2>Harga transparan</h2>
            <p>Pilih paket sesuai ukuran tim Anda. Tanpa biaya tersembunyi.</p>
          </div>
          <div className="crm-pricing-grid">
            {pricing.map((p) => (
              <div className={`crm-price-card ${p.featured ? 'featured' : ''}`} key={p.name}>
                {p.featured && <span className="crm-price-tag">Paling Populer</span>}
                <h3>{p.name}</h3>
                <div className="price">{p.price}<span>{p.period}</span></div>
                <p className="desc">{p.desc}</p>
                <ul className="crm-price-list">
                  {p.features.map((feat) => <li key={feat}>✓ {feat}</li>)}
                </ul>
                <button
                  className={`crm-btn crm-btn-block ${p.featured ? 'crm-btn-primary' : 'crm-btn-ghost'}`}
                  onClick={() => scrollTo('lead')}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="crm-section" id="testimonials">
        <div className="crm-container">
          <div className="crm-section-head">
            <h2>Dipercaya ribuan tim sales</h2>
            <p>Lihat bagaimana NovaCRM membantu bisnis tumbuh lebih cepat.</p>
          </div>
          <div className="crm-testi-grid">
            {testimonials.map((t) => (
              <div className="crm-testi-card" key={t.name}>
                <p className="quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="crm-testi-author">
                  <div className="crm-testi-avatar">{t.initial}</div>
                  <div>
                    <div className="nm">{t.name}</div>
                    <div className="rl">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA + Lead Form ---------- */}
      <section className="crm-section" id="lead">
        <div className="crm-container">
          <div className="crm-cta">
            <div>
              <h2>Siap menumbuhkan bisnis Anda?</h2>
              <p>Daftar sekarang dan dapatkan uji coba 14 hari gratis. Tanpa kartu kredit, batalkan kapan saja.</p>
            </div>
            <form className="crm-lead-form" onSubmit={handleSubmit}>
              {success && (
                <div className="crm-form-success">
                  ✓ Terima kasih! Tim kami akan menghubungi Anda segera.
                </div>
              )}
              {error && (
                <div className="crm-form-success" style={{ background: '#fee2e2', color: '#991b1b' }}>
                  {error}
                </div>
              )}
              <div className="crm-form-row">
                <label htmlFor="lead-name">Nama Lengkap</label>
                <input id="lead-name" name="name" value={form.name} onChange={handleChange} placeholder="Nama Anda" required />
              </div>
              <div className="crm-form-row">
                <label htmlFor="lead-email">Email Bisnis</label>
                <input id="lead-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
              </div>
              <div className="crm-form-row">
                <label htmlFor="lead-company">Perusahaan</label>
                <input id="lead-company" name="company" value={form.company} onChange={handleChange} placeholder="Nama perusahaan (opsional)" />
              </div>
              <button type="submit" className="crm-btn crm-btn-primary crm-btn-block" disabled={loading}>
                {loading ? 'Mengirim...' : 'Coba Gratis Sekarang'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="crm-footer">
        <div className="crm-container">
          <div className="crm-footer-grid">
            <div>
              <div className="crm-brand" style={{ color: '#fff', marginBottom: 12 }}>
                <span className="crm-brand-logo">N</span> NovaCRM
              </div>
              <p>Platform CRM untuk membantu tim sales menutup lebih banyak deal.</p>
            </div>
            <div>
              <h4>Produk</h4>
              <a onClick={() => scrollTo('features')}>Fitur</a>
              <a onClick={() => scrollTo('pricing')}>Harga</a>
              <a onClick={() => scrollTo('testimonials')}>Testimoni</a>
            </div>
            <div>
              <h4>Perusahaan</h4>
              <a>Tentang Kami</a>
              <a>Karier</a>
              <a>Blog</a>
            </div>
            <div>
              <h4>Kontak</h4>
              <p>📧 hello@novacrm.id</p>
              <p>📞 +62 21 5000 1234</p>
            </div>
          </div>
          <div className="crm-footer-bottom">
            &copy; 2026 NovaCRM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CrmLanding;