// Import React hooks dan Router hooks
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';

// Halaman Detail Customer: Menampilkan detail 1 customer + fitur edit
const CustomerDetailPage = () => {
  // Hook untuk mendapatkan data yang dikirim dari halaman sebelumnya
  const location = useLocation();
  
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  
  // Hook untuk mendapatkan parameter ID dari URL (contoh: /customer-detail/P001)
  const { id } = useParams();
  
  // Ambil data dan fungsi update dari Context API
  const { customers, updateCustomer } = useData();

  // State untuk menyimpan data customer yang sedang dilihat
  // Prioritas: 1) Data dari location.state (dikirim dari halaman list)
  //            2) Cari di array customers berdasarkan ID dari URL
  const [customerData, setCustomerData] = useState(
    location.state || customers.find(c => c.id === id)
  );

  // State untuk kontrol tampil/sembunyikan modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  
  // State untuk menyimpan data form edit (sementara sebelum disimpan)
  const [editForm, setEditForm] = useState({});

  // Jika data customer tidak ditemukan, tampilkan pesan error
  if (!customerData) {
    return (
      <div className="customer-detail-page">
        <h2>Data pelanggan tidak ditemukan</h2>
        <button className="btn-back" onClick={() => navigate('/customers')}>
          ← Kembali ke Daftar
        </button>
      </div>
    );
  }

  // Fungsi untuk membuka modal edit
  // Copy data customer ke form edit
  const handleEditClick = () => {
    setEditForm({ ...customerData });
    setShowEditModal(true);
  };

  // Fungsi untuk handle perubahan input di form edit
  // Setiap kali user ketik, update state editForm
  const handleEditChange = (e) => {
    const { name, value } = e.target; // Ambil name dan value dari input
    setEditForm(prev => ({ ...prev, [name]: value })); // Update field yang berubah
  };

  // Fungsi untuk submit form edit
  const handleEditSubmit = (e) => {
    e.preventDefault(); // Cegah reload halaman
    
    // Update data di Context API (sinkron ke semua halaman)
    updateCustomer(customerData.id, editForm);
    
    // Update data lokal di halaman ini
    setCustomerData(editForm);
    
    // Tutup modal
    setShowEditModal(false);
  };

  return (
    <div className="customer-detail-page">
      {/* ========== HEADER: Tombol Kembali ========== */}
      <div className="customer-detail-header-btn">
        <button className="btn-back-detail" onClick={() => navigate('/customers')}>
          ← Kembali
        </button>
      </div>

      {/* ========== JUDUL HALAMAN ========== */}
      <h2>Detail Pelanggan</h2>

      {/* ========== CONTENT: Detail Customer ========== */}
      <div className="customer-detail-card-wrapper">
        {/* Profile Section: Nama + ID */}
        <div className="customer-detail-profile">
          <div className="customer-detail-name">
            <h3>{customerData.name}</h3>
            <p>ID: {customerData.id}</p>
          </div>
        </div>

        {/* Detail Information: 3 Section */}
        <div className="customer-detail-content">
          {/* Section 1: Informasi Kontak */}
          <div className="detail-section">
            <h4>Informasi Kontak</h4>
            
            {/* Row 1: Email */}
            <div className="detail-row">
              <div className="detail-row-label">Email</div>
              <div className="detail-row-value">{customerData.email}</div>
            </div>
            
            {/* Row 2: Telepon */}
            <div className="detail-row">
              <div className="detail-row-label">Telepon</div>
              <div className="detail-row-value">{customerData.phone}</div>
            </div>
          </div>

          {/* Section 2: Alamat & Lokasi */}
          <div className="detail-section">
            <h4>Alamat & Lokasi</h4>
            
            {/* Row 1: Alamat */}
            <div className="detail-row">
              <div className="detail-row-label">Alamat</div>
              <div className="detail-row-value">{customerData.address}</div>
            </div>
          </div>

          {/* Section 3: Tanggal Bergabung */}
          <div className="detail-section">
            <h4>Tanggal Bergabung</h4>
            
            {/* Row 1: Join Date */}
            <div className="detail-row">
              <div className="detail-row-label">Join Date</div>
              <div className="detail-row-value">{customerData.joinDate}</div>
            </div>
          </div>
        </div>

        {/* Action Button: Edit Data */}
        <div className="customer-detail-actions">
          <button className="btn-edit" onClick={handleEditClick}>
            Edit Data
          </button>
        </div>
      </div>

      {/* ========== MODAL EDIT CUSTOMER ========== */}
      {/* Modal hanya tampil jika showEditModal = true */}
      {showEditModal && (
        // Overlay: Background gelap, klik untuk tutup modal
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          {/* Modal Content: Klik tidak akan tutup modal (stopPropagation) */}
          <div className="modal-content modal-edit" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Data Pelanggan</h3>
            
            {/* Form Edit: Submit akan panggil handleEditSubmit */}
            <form onSubmit={handleEditSubmit}>
              {/* Field 1: Nama Lengkap */}
              <div className="form-row">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  name="name" // name harus sama dengan key di object data
                  value={editForm.name || ''} // || '' untuk hindari uncontrolled component
                  onChange={handleEditChange} // Update state saat user ketik
                  required // Field wajib diisi
                />
              </div>
              
              {/* Field 2: Email */}
              <div className="form-row">
                <label>Email</label>
                <input
                  type="email" // Validasi format email otomatis
                  name="email"
                  value={editForm.email || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              {/* Field 3: Nomor Telepon */}
              <div className="form-row">
                <label>Nomor Telepon</label>
                <input
                  type="tel" // Keyboard nomor di mobile
                  name="phone"
                  value={editForm.phone || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              {/* Field 4: Alamat Lengkap (textarea untuk text panjang) */}
              <div className="form-row">
                <label>Alamat Lengkap</label>
                <textarea
                  name="address"
                  value={editForm.address || ''}
                  onChange={handleEditChange}
                  rows="3" // Tinggi textarea 3 baris
                  required
                />
              </div>
              
              {/* Field 5: Tanggal Bergabung (date picker) */}
              <div className="form-row">
                <label>Tanggal Bergabung</label>
                <input
                  type="date" // Date picker otomatis
                  name="joinDate"
                  value={editForm.joinDate || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              {/* Action Buttons: Simpan & Batal */}
              <div className="modal-actions">
                {/* Tombol 1: Submit form (simpan perubahan) */}
                <button type="submit" className="btn-primary">
                  Simpan Perubahan
                </button>
                
                {/* Tombol 2: Batal (tutup modal tanpa simpan) */}
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setShowEditModal(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage;
