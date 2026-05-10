import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CustomerDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { customers, updateCustomer } = useData();

  // Ambil data customer dari state atau dari context berdasarkan ID
  const [customerData, setCustomerData] = useState(
    location.state || customers.find(c => c.id === id)
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

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
      <div className="customer-detail-header-btn">
        <button className="btn-back-detail" onClick={() => navigate('/customers')}>
          ← Kembali
        </button>
      </div>

      <h2>Detail Pelanggan</h2>

      <div className="customer-detail-card-wrapper">
        <div className="customer-detail-profile">
          <div className="customer-detail-name">
            <h3>{customerData.name}</h3>
            <p>ID: {customerData.id}</p>
          </div>
        </div>

        <div className="customer-detail-content">
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

          <div className="detail-section">
            <h4>Alamat & Lokasi</h4>
            <div className="detail-row">
              <div className="detail-row-label">Alamat</div>
              <div className="detail-row-value">{customerData.address}</div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Tanggal Bergabung</h4>
            <div className="detail-row">
              <div className="detail-row-label">Join Date</div>
              <div className="detail-row-value">{customerData.joinDate}</div>
            </div>
          </div>
        </div>

        <div className="customer-detail-actions">
          <button className="btn-edit" onClick={handleEditClick}>
            Edit Data
          </button>
        </div>
      </div>

      {/* Modal Edit Customer */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content modal-edit" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Data Pelanggan</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-row">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Nomor Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Alamat Lengkap</label>
                <textarea
                  name="address"
                  value={editForm.address || ''}
                  onChange={handleEditChange}
                  rows="3"
                  required
                />
              </div>
              <div className="form-row">
                <label>Tanggal Bergabung</label>
                <input
                  type="date"
                  name="joinDate"
                  value={editForm.joinDate || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Simpan Perubahan
                </button>
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
