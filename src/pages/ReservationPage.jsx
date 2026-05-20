// Import library React Router untuk navigasi
import { useNavigate } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';
// Import komponen reusable
import { Button, Badge, Table, EmptyState } from '../components';

// Halaman List Reservasi: Menampilkan tabel semua reservasi
const ReservationPage = () => {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  
  // Ambil data reservasi dari Context API
  const { reservations } = useData();

  // Fungsi untuk navigasi ke halaman detail reservasi
  const handleViewDetail = (item) => {
    navigate(`/reservation-detail/${item.id}`, { state: item });
  };

  // Definisi kolom table
  const columns = [
    { header: 'ID', key: 'id', width: '100px' },
    { header: 'Nama', key: 'name', width: '200px' },
    { header: 'No. Reservasi', key: 'reservation', width: '150px' },
    { 
      header: 'Status', 
      key: 'payment',
      width: '120px',
      render: (value) => (
        /* 🔵 COMPONENT: Badge */
        <Badge variant={value === 'Lunas' ? 'success' : value === 'Pending' ? 'warning' : 'danger'}>
          {value}
        </Badge>
      )
    },
    {
      header: 'Aksi',
      key: 'id',
      width: '150px',
      render: (value, row) => (
        /* 🔵 COMPONENT: Button */
        <Button 
          variant="primary" 
          size="small"
          onClick={() => handleViewDetail(row)}
        >
          Lihat Detail
        </Button>
      )
    }
  ];

  return (
    <div className="reservation-page">
      {/* Header */}
      <div className="reservation-header">
        <h2>Daftar Reservasi</h2>
      </div>
      
      {/* Content */}
      <div className="reservation-content">
        <div className="reservasi-list-card">
          {reservations.length === 0 ? (
            // 🔵 COMPONENT: EmptyState
            <EmptyState 
              icon={<span style={{fontSize: '48px'}}>📋</span>}
              title="Tidak ada data reservasi" 
              message="Belum ada reservasi yang terdaftar"
            />
          ) : (
            // 🔵 COMPONENT: Table
            <Table 
              columns={columns} 
              data={reservations}
              className="reservasi-table"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
