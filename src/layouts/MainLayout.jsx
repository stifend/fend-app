// Import component Sidebar dan Header
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Layout wrapper untuk semua halaman dashboard
// Layout ini menampilkan Sidebar (kiri) + Header (atas) + Content (tengah)
const MainLayout = ({ children, onLogout }) => {
  return (
    <div className="dashboard-shell">
      {/* Sidebar: Menu navigasi di sebelah kiri */}
      {/* onLogout diteruskan ke Sidebar untuk tombol logout */}
      <Sidebar onLogout={onLogout} />
      
      {/* Area utama: Header + Content */}
      <div className="dashboard-main">
        {/* Header: Bar di bagian atas (bisa berisi judul, notifikasi, dll) */}
        <Header />
        
        {/* Content: Konten halaman yang dinamis */}
        {/* {children} akan diganti dengan component halaman (Dashboard, ReservationPage, dll) */}
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
