// Import library React Router untuk navigasi
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// Import gambar profile picture
import pp from '../assets/pp.jpg';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';
// Import koneksi Supabase (untuk jumlah feedback nyata)
import { supabase } from '../lib/supabase';

const Sidebar = ({ onLogout }) => {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil data reservasi dan customer dari Context API
  const { reservations, customers } = useData();

  // Ambil data user yang sedang login (untuk profile card)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // ========== HITUNG DATA DUMMY UNTUK BADGE ========== 
  // Hitung jumlah transaksi yang lunas
  const paidCount = reservations.filter(r => r.payment === 'Lunas').length;

  // Hitung jumlah laporan (bulan unik dari check-in)
  const uniqueMonths = [...new Set(reservations.map(r => {
    const date = new Date(r.checkIn);
    return `${date.getMonth()}-${date.getFullYear()}`;
  }))].length;

  // Hitung member (customer dengan membership)
  const memberCount = customers.filter(c => c.membership && c.membership !== 'None').length;

    // Total kamar hotel (konfigurasi: 100 Standard + 80 Deluxe + 50 Suite + 20 Executive)
  const totalRooms = 250;

  // Jumlah feedback NYATA dari Supabase (tabel feedback)
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    supabase.rpc('get_all_feedback').then(({ data, error }) => {
      if (!error && data) setFeedbackCount(data.length);
    });
  }, []);

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-menu-wrapper">
        {/* ========== BRAND / LOGO ========== */}
        <div className="sidebar-brand">
          <div className="logo-icon" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
            <img src="/images/hotel-logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h1 className="sidebar-title">Novotel</h1>
          </div>
        </div>

        {/* ========== SIDEBAR MENUS ========== */}
        {[
          { path: '/dashboard', icon: '📊', label: 'Dashboard', badge: 1 },
          { path: '/reservations', icon: '📋', label: 'Reservasi', badge: reservations.length },
          { path: '/customers', icon: '👥', label: 'Profil Pelanggan', badge: customers.length },
          { path: '/payments', icon: '💳', label: 'Pembayaran', badge: paidCount },
          { path: '/reports', icon: '📊', label: 'Laporan', badge: uniqueMonths },
          { path: '/membership', icon: '⭐', label: 'Membership', badge: memberCount },
          { path: '/rooms', icon: '🏨', label: 'Kamar', badge: totalRooms },
          { path: '/feedback', icon: '💬', label: 'Feedback', badge: feedbackCount },
          { path: '/admin/vouchers', icon: '🎟️', label: 'Kelola Voucher' },
          { path: '/users', icon: '🔑', label: 'Manajemen User' }
        ].map((item, index) => (
          <div key={index} className={`sidebar-menu-item ${location.pathname === item.path ? 'active' : ''}`}>
            <div
              className="menu-item-header"
              onClick={() => navigate(item.path)}
              style={{ cursor: 'pointer' }}
            >
              <p className="menu-item-title">{item.icon} {item.label}</p>
              {item.badge !== undefined && <span className="menu-item-badge">{item.badge}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ========== FOOTER SIDEBAR (Profile + Logout) ========== */}
      <div className="sidebar-footer">
        {/* Card profile user yang sedang login */}
        <div className="profile-card">
          <img src={pp} alt="Profile Picture" className="logo" />
          <div>
            <p className="profile-name">{currentUser.name || 'Pengguna'}</p>
            <p className="profile-subtitle">{currentUser.role || 'user'}</p>
          </div>
        </div>

        {/* Tombol logout: panggil fungsi onLogout dari props */}
        {/* onLogout akan hapus token dan redirect ke halaman login */}
        <button type="button" className="btn btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
