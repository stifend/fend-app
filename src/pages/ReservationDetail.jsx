// Import React hooks dan Router hooks
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';
// Import komponen reusable
import { Button, Modal, Input, Badge, Card } from '../components';

// Halaman Detail Reservasi
const ReservationDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { reservations, updateReservationPayment, updateReservation } = useData();

  // State untuk menyimpan data reservasi
  const [reservationData, setReservationData] = useState(
    location.state || reservations.find(r => r.id === id)
  );

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Jika data tidak ditemukan
  if (!reservationData) {
    return (
      <div className="reservation-page">
        <h2>Data reservasi tidak ditemukan</h2>
        <Button variant="outline" onClick={() => navigate('/reservations')}>
          ← Kembali ke Daftar
        </Button>
      </div>
    );
  }

  // Handle konfirmasi pembayaran
  const handleConfirmPayment = (status) => {
    updateReservationPayment(reservationData.id, status);
    setReservationData({ ...reservationData, payment: status });
    setShowPaymentModal(false);
  };

  // Handle edit
  const handleEditClick = () => {
    setEditForm({ ...reservationData });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateReservation(reservationData.id, editForm);
    setReservationData(editForm);
    setShowEditModal(false);
  };

  return (
    <div className="reservation-page">
      {/* Header */}
      <div className="reservation-header">
        {/* 🔵 COMPONENT: Button */}
        <Button variant="outline" onClick={() => navigate('/reservations')}>
          ← Kembali ke Daftar
        </Button>
        <h2>Detail Reservasi</h2>
      </div>

      {/* Content menggunakan Card component */}
      <div className="reservation-content">
        {/* 🔵 COMPONENT: Card */}
        <Card className="reservation-card">
          <div className="reservation-detail">
            <div className="detail-row">
              <span className="detail-label">ID Pelanggan:</span>
              <span className="detail-value">{reservationData.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Nama:</span>
              <span className="detail-value">{reservationData.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{reservationData.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Telepon:</span>
              <span className="detail-value">{reservationData.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Alamat:</span>
              <span className="detail-value">{reservationData.address}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Nomor Reservasi:</span>
              <span className="detail-value">{reservationData.reservation}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status Pembayaran:</span>
              {/* 🔵 COMPONENT: Badge */}
              <Badge variant={reservationData.payment === 'Lunas' ? 'success' : reservationData.payment === 'Pending' ? 'warning' : 'danger'}>
                {reservationData.payment}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="reservation-actions">
            {/* 🔵 COMPONENT: Button (x2) */}
            <Button variant="primary" onClick={() => setShowPaymentModal(true)}>
              Konfirmasi Pembayaran
            </Button>
            <Button variant="secondary" onClick={handleEditClick}>
              Edit Reservasi
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal Konfirmasi Pembayaran */}
      {/* 🔵 COMPONENT: Modal */}
      <Modal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        title="Konfirmasi Pembayaran"
      >
        <p>Pilih status pembayaran untuk reservasi <strong>{reservationData.reservation}</strong></p>
        <div className="modal-actions" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          {/* 🔵 COMPONENT: Button (x4) */}
          <Button variant="success" onClick={() => handleConfirmPayment('Lunas')}>
            ✓ Lunas
          </Button>
          <Button className="btn-warning" onClick={() => handleConfirmPayment('Pending')}>
            ⏳ Pending
          </Button>
          <Button variant="danger" onClick={() => handleConfirmPayment('Belum Bayar')}>
            ✗ Belum Bayar
          </Button>
          <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
            Batal
          </Button>
        </div>
      </Modal>

      {/* Modal Edit Reservasi */}
      {/* 🔵 COMPONENT: Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Reservasi"
      >
        <form onSubmit={handleEditSubmit}>
          {/* 🔵 COMPONENT: Input (x4) */}
          <Input
            label="Nomor Reservasi"
            name="reservation"
            value={editForm.reservation || ''}
            onChange={handleEditChange}
            required
          />
          <Input
            label="Nama"
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
            label="Telepon"
            type="tel"
            name="phone"
            value={editForm.phone || ''}
            onChange={handleEditChange}
            required
          />
          <div className="form-row">
            <label>Alamat</label>
            <textarea
              name="address"
              value={editForm.address || ''}
              onChange={handleEditChange}
              rows="3"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>
          <div className="modal-actions" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            {/* 🔵 COMPONENT: Button (x2) */}
            <Button type="submit" variant="primary">Simpan Perubahan</Button>
            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReservationDetail;
