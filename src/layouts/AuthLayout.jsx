import React from 'react';
import hotelLogo from '../assets/Hotel.jpg';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-layout">
      {/* Sidebar Kiri - Info & Branding */}
      <aside className="auth-sidebar-left">
        <div className="auth-sidebar-content">
          <div className="auth-brand">
            <img src={hotelLogo} alt="Logo Hotel" className="auth-brand-logo" />
            <div>
              <span className="auth-brand-label">Awakening</span>
              <h1 className="auth-brand-title">Dashboard Hotel</h1>
            </div>
          </div>

          <div className="auth-info">
            <h2 className="auth-info-heading">Selamat Datang</h2>
            <p className="auth-info-text">
              Sistem manajemen hotel yang memudahkan Anda mengelola reservasi, 
              pelanggan, dan operasional hotel dengan efisien.
            </p>
          </div>

          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">📊</div>
              <div className="auth-feature-content">
                <h3>Dashboard Analytics</h3>
                <p>Monitor performa hotel secara real-time</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🏨</div>
              <div className="auth-feature-content">
                <h3>Manajemen Reservasi</h3>
                <p>Kelola booking dengan mudah dan cepat</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">👥</div>
              <div className="auth-feature-content">
                <h3>Data Pelanggan</h3>
                <p>Simpan dan kelola informasi tamu hotel</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-sidebar-footer">
          <p>© 2025 Awakening Hotel Dashboard</p>
        </div>
      </aside>

      {/* Panel Kanan - Form */}
      <main className="auth-main-right">
        <div className="auth-form-container">
          {title && <h2 className="auth-form-title">{title}</h2>}
          {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
