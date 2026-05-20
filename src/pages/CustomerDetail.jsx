// Import React hooks dan Router hooks
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';
// Import komponen reusable
import { Button, Modal, Input, Card } from '../components';

// Halaman Detail Customer
const CustomerDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { customers, updateCustomer } = useData();

  // State untuk menyimpan data customer
  const [customerData, setCustomerData] = useState(
    location.state || customers.find(c => c.id === id)
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Jika data tidak ditemukan
  if (!customerData) {
    return (
      <div className="customer-detail-page">
        <h2>Data pelanggan tidak ditemukan</h2>
        <Button variant="outline" onClick={() => navigate('/customers')}>
          ← Kembali ke Daftar
        </Button>
      </div>
    );
  }

  // Handle edit
  const handleEditClick = () => {
    setEditForm({ ...customerData });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateCustomer(customerData.id, editForm);
    setCustomerData(editForm);
    setShowEditModal(false);
  };

  return (
    <div className="customer-detail-page">
      {/* Header */}
      <div className="customer-detail-header-btn">
        {/* 🔵 COMPONENT: Button */}
        <Button variant="outline" onClick={() => navigate('/customers')}>
          ← Kembali
        </Button>
      </div>

      <h2>Detail Pelanggan</h2>

      {/* Content menggunakan Card component */}
      {/* 🔵 COMPONENT: Card */}
      <Card className="customer-detail-card-wrapper">
        {/* Profile Section */}
        <div className="customer-detail-profile">
          <div className="customer-detail-name">
            <h3>{customerData.name}</h3>
            <p>ID: {customerData.id}</p>
          </div>
        </div>

        {/* Detail Information */}
        <div className="customer-detail-content">
          {/* Section 1: Informasi Kontak */}
          <div className="detail-section">
            <h4>Informasi Kontak</h4>
            <div className="detail-row">
              <div className="detail-row-label">Email</div>
              <div className="detail-row-value">{customerData.email}</div>
            </div>
            <div className="detail-row">
              <div className="detail-row-label">Telepon</div>
              <div className="detail-row-value">{customerData.phone}</div>
            </div>
          </div>

          {/* Section 2: Alamat & Lokasi */}
          <div className="detail-section">
            <h4>Alamat & Lokasi</h4>
            <div className="detail-row">
              <div className="detail-row-label">Alamat</div>
              <div className="detail-row-value">{customerData.address}</div>
            </div>
          </div>

          {/* Section 3: Tanggal Bergabung */}
          <div className="detail-section">
            <h4>Tanggal Bergabung</h4>
            <div className="detail-row">
              <div className="detail-row-label">Join Date</div>
              <div className="detail-row-value">{customerData.joinDate}</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="customer-detail-actions">
          {/* 🔵 COMPONENT: Button */}
          <Button variant="primary" onClick={handleEditClick}>
            Edit Data
          </Button>
        </div>
      </Card>

      {/* Modal Edit Customer */}
      {/* 🔵 COMPONENT: Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Data Pelanggan"
      >
        <form onSubmit={handleEditSubmit}>
          {/* 🔵 COMPONENT: Input (x5) */}
          <Input
            label="Nama Lengkap"
            name="name"
            value={editForm.name || ''}
            onChange={handleEditChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={editForm.email || ''}
            onChange={handleEditChange}
            required
          />
          <Input
            label="Nomor Telepon"
            type="tel"
            name="phone"
            value={editForm.phone || ''}
            onChange={handleEditChange}
            required
          />
          <div className="form-row">
            <label>Alamat Lengkap</label>
            <textarea
              name="address"
              value={editForm.address || ''}
              onChange={handleEditChange}
              rows="3"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>
          <Input
            label="Tanggal Bergabung"
            type="date"
            name="joinDate"
            value={editForm.joinDate || ''}
            onChange={handleEditChange}
            required
          />
          <div className="modal-actions" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            {/* 🔵 COMPONENT: Button (x2) */}
            <Button type="submit" variant="primary">
              Simpan Perubahan
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerDetailPage;
