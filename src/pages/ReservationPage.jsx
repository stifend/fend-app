// Import library React Router untuk navigasi
import { useNavigate } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';

// Halaman List Reservasi: Menampilkan tabel semua reservasi
const ReservationPage = () => {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  
  // Ambil data reservasi dari Context API
  const { reservations } = useData();

  // Fungsi untuk navigasi ke halaman detail reservasi
  // Parameter: item = object data reservasi yang diklik
  const handleViewDetail = (item) => {
    // Navigate ke /reservation-detail/P001 (contoh)
    // state: item = kirim data reservasi ke halaman detail (agar tidak perlu fetch ulang)
    navigate(`/reservation-detail/${item.id}`, { state: item });
  };

  return (
    <div className="reservation-page">
      {/* ========== HEADER HALAMAN ========== */}
      <div className="reservation-header">
        <h2>Daftar Reservasi</h2>
      </div>
      
      {/* ========== CONTENT: Table Reservasi ========== */}
      <div className="reservation-content">
        <div className="reservasi-list-card">
          {/* Conditional Rendering: Jika data kosong tampilkan pesan, jika ada tampilkan table */}
          {reservations.length === 0 ? (
            // ========== TAMPILAN JIKA DATA KOSONG ==========
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#64748b',
              fontSize: '16px'
            }}>
              <p>📋 Tidak ada data reservasi</p>
            </div>
          ) : (
            // ========== TAMPILAN TABLE JIKA ADA DATA ==========
            <div className="reservasi-table">
              {/* Header Table: Kolom ID, Nama, No. Reservasi, Status, Aksi */}
              <div className="table-header-reservasi">
                <span>ID</span>
                <span>Nama</span>
                <span>No. Reservasi</span>
                <span>Status</span>
                <span>Aksi</span>
              </div>
              
              {/* Body Table: Loop semua data reservasi */}
              {reservations.map((item) => (
                <div key={item.id} className="table-row-reservasi">
                  {/* Kolom 1: ID Pelanggan */}
                  <span className="table-cell">{item.id}</span>
                  
                  {/* Kolom 2: Nama Pelanggan */}
                  <span className="table-cell">{item.name}</span>
                  
                  {/* Kolom 3: Nomor Reservasi */}
                  <span className="table-cell">{item.reservation}</span>
                  
                  {/* Kolom 4: Status Pembayaran (Lunas = hijau, lainnya = merah) */}
                  <span className={`table-cell status ${item.payment === 'Lunas' ? 'paid' : 'unpaid'}`}>
                    {item.payment}
                  </span>
                  
                  {/* Kolom 5: Tombol Aksi - Lihat Detail */}
                  <span className="table-cell">
                    <button 
                      type="button" 
                      className="btn-view" 
                      onClick={() => handleViewDetail(item)} // Klik → navigasi ke detail
                    >
                      Lihat Detail
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
