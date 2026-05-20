// Import library React Router untuk navigasi
import { useNavigate } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';
// Import komponen reusable
import { Button, Table, EmptyState } from '../components';

// Halaman List Customer
const CustomerPage = () => {
  // Hook untuk navigasi
  const navigate = useNavigate();
  
  // Ambil data customer dari Context API
  const { customers } = useData();

  // Fungsi untuk navigasi ke detail
  const handleDetail = (customer) => {
    navigate(`/customer-detail/${customer.id}`, { state: customer });
  };

  // Definisi kolom table
  const columns = [
    { 
      header: 'No', 
      key: 'id',
      width: '80px',
      render: (value, row, index) => index + 1
    },
    { header: 'Nama', key: 'name', width: '200px' },
    { header: 'Email', key: 'email', width: '250px' },
    { header: 'Telepon', key: 'phone', width: '180px' },
    {
      header: 'Aksi',
      key: 'id',
      width: '150px',
      render: (value, row) => (
        /* 🔵 COMPONENT: Button */
        <Button 
          variant="primary" 
          size="small"
          onClick={() => handleDetail(row)}
        >
          Lihat Detail
        </Button>
      )
    }
  ];

  return (
    <div className="customer-page">
      {/* Header */}
      <div className="customer-page-header">
        <h2>Daftar Pelanggan</h2>
      </div>

      {/* Content */}
      <div className="customer-page-content">
        <div className="customer-list-card">
          {customers.length === 0 ? (
            // 🔵 COMPONENT: EmptyState
            <EmptyState 
              icon={<span style={{fontSize: '48px'}}>👥</span>}
              title="Tidak ada data pelanggan" 
              message="Belum ada pelanggan yang terdaftar"
            />
          ) : (
            // 🔵 COMPONENT: Table
            <Table 
              columns={columns} 
              data={customers}
              className="customer-table"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
