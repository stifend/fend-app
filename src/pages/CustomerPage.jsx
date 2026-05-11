// Import library React Router untuk navigasi
import { useNavigate } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';

// Halaman List Customer: Menampilkan tabel semua customer
const CustomerPage = () => {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  
  // Ambil data customer dari Context API
  const { customers } = useData();

  // Fungsi untuk navigasi ke halaman detail customer
  // Parameter: customer = object data customer yang diklik
  const handleDetail = (customer) => {
    // Navigate ke /customer-detail/P001 (contoh)
    // state: customer = kirim data customer ke halaman detail (agar tidak perlu fetch ulang)
    navigate(`/customer-detail/${customer.id}`, {
      state: customer
    });
  };

  return (
    <div className="customer-page">
      {/* ========== HEADER HALAMAN ========== */}
      <div className="customer-page-header">
        <h2>Daftar Pelanggan</h2>
      </div>

      {/* ========== CONTENT: Table Customer ========== */}
      <div className="customer-page-content">
        <div className="customer-list-card">
          {/* Table HTML Standard (thead + tbody) */}
          <table className="customer-table">
            {/* Header Table: Kolom No, Nama, Email, Telepon, Aksi */}
            <thead className="table-header-customer">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Aksi</th>
              </tr>
            </thead>
            
            {/* Body Table: Loop semua data customer */}
            <tbody>
              {/* .map() dengan parameter (customer, index) */}
              {/* customer = data customer, index = urutan (0, 1, 2, ...) */}
              {customers.map((customer, index) => (
                <tr key={customer.id} className="table-row-customer">
                  {/* Kolom 1: Nomor urut (index + 1 karena index mulai dari 0) */}
                  <td className="table-cell-customer">{index + 1}</td>
                  
                  {/* Kolom 2: Nama Customer */}
                  <td className="table-cell-customer">{customer.name}</td>
                  
                  {/* Kolom 3: Email Customer */}
                  <td className="table-cell-customer">{customer.email}</td>
                  
                  {/* Kolom 4: Nomor Telepon Customer */}
                  <td className="table-cell-customer">{customer.phone}</td>
                  
                  {/* Kolom 5: Tombol Aksi - Lihat Detail */}
                  <td className="table-cell-customer">
                    <button 
                      className="btn-view-detail"
                      onClick={() => handleDetail(customer)} // Klik → navigasi ke detail
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
