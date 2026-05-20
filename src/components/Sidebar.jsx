// Import library React Router untuk navigasi
import { useNavigate, useLocation } from 'react-router-dom';
// Import gambar logo dan profile picture
import hotelLogo from '../assets/Hotel.jpg';
import pp from '../assets/pp.jpg';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';

const Sidebar = ({ onLogout }) => {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  
  // Hook untuk mendapatkan URL saat ini (tidak dipakai tapi bisa untuk highlight menu aktif)
  const location = useLocation();
  
  // Ambil data reservasi dan customer dari Context API
  const { reservations, customers } = useData();

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
        {/* Klik menu ini akan navigasi ke halaman /dashboard */}
        <div className="sidebar-dashboard">
          <div 
            className="sidebar-dashboard-header" 
            onClick={() => navigate('/dashboard')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="sidebar-dashboard-title">Dashboard</p>
            {/* Badge menampilkan angka 1 (fixed, tidak dinamis) */}
            <span className="dashboard-count">1</span>
          </div>
        </div>

        {/* ========== MENU RESERVASI ========== */}
        {/* Klik menu ini akan navigasi ke halaman /reservations */}
        <div className="sidebar-reservasi">
          <div 
            className="reservasi-header" 
            onClick={() => navigate('/reservations')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="reservasi-title">Reservasi</p>
            {/* Badge menampilkan jumlah reservasi secara dinamis dari Context */}
            <span className="reservasi-count">{reservations.length}</span>
          </div>
        </div>

        {/* ========== MENU PROFIL PELANGGAN ========== */}
        {/* Klik menu ini akan navigasi ke halaman /customers */}
        <div className="sidebar-customers">
          <div 
            className="customers-header" 
            onClick={() => navigate('/customers')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="customers-title">Profil Pelanggan</p>
            {/* Badge menampilkan jumlah customer secara dinamis dari Context */}
            <span className="customers-count">{customers.length}</span>
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
