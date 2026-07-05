// Layout wrapper untuk halaman autentikasi (Login, Register, Forgot Password)
// Layout ini membagi layar menjadi 2 kolom: Sidebar (kiri) + Form Panel (kanan)
const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-layout">
      {/* ========== SIDEBAR KIRI (Dark Theme) ========== */}
      {/* Berisi branding, welcome message, dan fitur unggulan */}
      <aside className="auth-sidebar-left">
        <div className="auth-sidebar-content">
          {/* Brand Section: Logo + Nama Aplikasi */}
          <div className="auth-brand">
            <div className="auth-logo-icon" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
              <img src="/images/hotel-logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h1 className="auth-brand-title">Novotel</h1>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="auth-info">
            <h2 className="auth-info-heading">Selamat Datang</h2>
            <p className="auth-info-text">
              Sistem manajemen hotel yang memudahkan Anda mengelola reservasi, 
              pelanggan, dan operasional hotel dengan efisien.
            </p>
          </div>

          {/* Feature Highlights: 3 Fitur Unggulan */}
          <div className="auth-features">
            {/* Fitur 1: Dashboard Analytics */}
            <div className="auth-feature-item">
              <div className="auth-feature-icon">📊</div>
              <div className="auth-feature-content">
                <h3>Dashboard Analytics</h3>
                <p>Monitor performa hotel secara real-time</p>
              </div>
            </div>
            
            {/* Fitur 2: Manajemen Reservasi */}
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🏨</div>
              <div className="auth-feature-content">
                <h3>Manajemen Reservasi</h3>
                <p>Kelola booking dengan mudah dan cepat</p>
              </div>
            </div>
            
            {/* Fitur 3: Data Pelanggan */}
            <div className="auth-feature-item">
              <div className="auth-feature-icon">👥</div>
              <div className="auth-feature-content">
                <h3>Data Pelanggan</h3>
                <p>Simpan dan kelola informasi tamu hotel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Sidebar: Copyright */}
        <div className="auth-sidebar-footer">
          <p>© 2025 Novotel Hotel Dashboard</p>
        </div>
      </aside>

      {/* ========== PANEL KANAN (Light Theme) ========== */}
      {/* Berisi form login/register/forgot password */}
      <main className="auth-main-right">
        <div className="auth-form-container">
          {/* Title: Judul halaman (contoh: "Login ke Dashboard") */}
          {title && <h2 className="auth-form-title">{title}</h2>}
          
          {/* Subtitle: Subjudul halaman (opsional) */}
          {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
          
          {/* Children: Form login/register akan masuk di sini */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
