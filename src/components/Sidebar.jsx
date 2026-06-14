// Import library React Router untuk navigasi
import { useNavigate } from 'react-router-dom';
// Import gambar profile picture
import pp from '../assets/pp.jpg';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';

const Sidebar = ({ onLogout }) => {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  
  // Ambil data reservasi dan customer dari Context API
  const { reservations, customers } = useData();

  // ========== HITUNG DATA DUMMY UNTUK BADGE ========== 
  // Hitung jumlah transaksi yang lunas
  const paidCount = reservations.filter(r => r.payment === 'Lunas').length;
  
  // Hitung jumlah laporan (bulan unik dari check-in)
  const uniqueMonths = [...new Set(reservations.map(r => {
    const date = new Date(r.checkIn);
    return `${date.getMonth()}-${date.getFullYear()}`;
  }))].length;
  
  // Hitung member (customer dengan membership)
  const memberCount = customers.filter(c => c.membershipLevel && c.membershipLevel !== 'None').length;
  
  // Hitung total kamar (dari tipe kamar yang ada)
  const roomTypes = [...new Set(reservations.map(r => r.roomType))];
  const totalRooms = 250; // Total kamar hotel (dummy)
  
  // Hitung feedback (30% dari total reservasi)
  const feedbackCount = Math.floor(reservations.length * 0.3);

  return (
    <aside className="dashboard-sidebar">
      <div>
        {/* ========== BRAND / LOGO ========== */}
        <div className="sidebar-brand">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#3b82f6"/>
              <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" fill="white"/>
              <path d="M16 8V16M16 16L24 12M16 16L8 12" stroke="#3b82f6" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <h1 className="sidebar-title">Novotel</h1>
          </div>
        </div>

        {/* ========== MENU DASHBOARD ========== */}
        <div className="sidebar-menu-item">
          <div 
            className="menu-item-header" 
            onClick={() => navigate('/dashboard')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="menu-item-title">📊 Dashboard</p>
            <span className="menu-item-badge">1</span>
          </div>
        </div>

        {/* ========== MENU RESERVASI ========== */}
        <div className="sidebar-menu-item">
          <div 
            className="menu-item-header" 
            onClick={() => navigate('/reservations')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="menu-item-title">📋 Reservasi</p>
            <span className="menu-item-badge">{reservations.length}</span>
          </div>
        </div>

        {/* ========== MENU PROFIL PELANGGAN ========== */}
        <div className="sidebar-menu-item">
          <div 
            className="menu-item-header" 
            onClick={() => navigate('/customers')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="menu-item-title">👥 Profil Pelanggan</p>
            <span className="menu-item-badge">{customers.length}</span>
          </div>
        </div>

        {/* ========== MENU PEMBAYARAN ========== */}
        <div className="sidebar-menu-item">
          <div 
            className="menu-item-header" 
            onClick={() => navigate('/payments')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="menu-item-title">💳 Pembayaran</p>
            <span className="menu-item-badge">{paidCount}</span>
          </div>
        </div>

        {/* ========== MENU LAPORAN ========== */}
        <div className="sidebar-menu-item">
          <div 
            className="menu-item-header" 
            onClick={() => navigate('/reports')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="menu-item-title">📊 Laporan</p>
            <span className="menu-item-badge">{uniqueMonths}</span>
          </div>
        </div>

        {/* ========== MENU MEMBERSHIP ========== */}
        <div className="sidebar-menu-item">
          <div 
            className="menu-item-header" 
            onClick={() => navigate('/membership')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="menu-item-title">⭐ Membership</p>
            <span className="menu-item-badge">{memberCount}</span>
          </div>
        </div>

        {/* ========== MENU KAMAR ========== */}
        <div className="sidebar-menu-item">
          <div 
            className="menu-item-header" 
            onClick={() => navigate('/rooms')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="menu-item-title">🏨 Kamar</p>
            <span className="menu-item-badge">{totalRooms}</span>
          </div>
        </div>

        {/* ========== MENU DATA HOTEL ========== */}
        <div className="sidebar-menu-item">
          <div 
            className="menu-item-header" 
            onClick={() => navigate('/hotel-data')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="menu-item-title">🏢 Data Hotel</p>
            <span className="menu-item-badge">5</span>
          </div>
        </div>

        {/* ========== MENU FEEDBACK ========== */}
        <div className="sidebar-menu-item">
          <div 
            className="menu-item-header" 
            onClick={() => navigate('/feedback')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="menu-item-title">💬 Feedback</p>
            <span className="menu-item-badge">{feedbackCount}</span>
          </div>
        </div>
      </div>

      {/* ========== FOOTER SIDEBAR (Profile + Logout) ========== */}
      <div className="sidebar-footer">
        {/* Card profile user yang sedang login */}
        <div className="profile-card">
          <img src={pp} alt="Profile Picture" className="logo" />
          <div>
            <p className="profile-name">Stifend</p>
            <p className="profile-subtitle">View profile</p>
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
