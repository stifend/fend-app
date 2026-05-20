// Import gambar logo hotel
import hotelLogo from '../assets/Hotel.jpg';

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
            <div className="auth-logo-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="8" fill="#3b82f6"/>
                <path d="M12 18L24 12L36 18V30L24 36L12 30V18Z" fill="white"/>
                <path d="M24 12V24M24 24L36 18M24 24L12 18" stroke="#3b82f6" strokeWidth="2"/>
              </svg>
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
