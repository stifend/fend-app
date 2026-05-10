import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ReservationDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { reservations, updateReservationPayment, updateReservation } = useData();

  // Ambil data reservasi dari state atau dari context berdasarkan ID
  const [reservationData, setReservationData] = useState(
    location.state || reservations.find(r => r.id === id)
  );

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  if (!reservationData) {
    return (
      <div className="reservation-page">
        <h2>Data reservasi tidak ditemukan</h2>
        <button className="btn-back" onClick={() => navigate('/reservations')}>
          ← Kembali ke Daftar
        </button>
      </div>
    );
  }

  const handleConfirmPayment = (status) => {
    updateReservationPayment(reservationData.id, status);
    setReservationData({ ...reservationData, payment: status });
    setShowPaymentModal(false);
  };

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
      <div className="reservation-header">
        <button type="button" className="btn-back" onClick={() => navigate('/reservations')}>
          ← Kembali ke Daftar
        </button>
        <h2>Detail Reservasi</h2>
      </div>

      <div className="reservation-content">
        <div className="reservation-card">
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
              <span className={`detail-status ${reservationData.payment === 'Lunas' ? 'paid' : 'unpaid'}`}>
                {reservationData.payment}
              </span>
            </div>
          </div>

          <div className="reservation-actions">
            <button type="button" className="btn-primary" onClick={() => setShowPaymentModal(true)}>
              Konfirmasi Pembayaran
            </button>
            <button type="button" className="btn-secondary" onClick={handleEditClick}>
              Edit Reservasi
            </button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Pembayaran */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Konfirmasi Pembayaran</h3>
            <p>Pilih status pembayaran untuk reservasi <strong>{reservationData.reservation}</strong></p>
            <div className="modal-actions">
              <button className="btn-success" onClick={() => handleConfirmPayment('Lunas')}>
                ✓ Lunas
              </button>
              <button className="btn-warning" onClick={() => handleConfirmPayment('Pending')}>
                ⏳ Pending
              </button>
              <button className="btn-danger" onClick={() => handleConfirmPayment('Belum Bayar')}>
                ✗ Belum Bayar
              </button>
              <button className="btn-cancel" onClick={() => setShowPaymentModal(false)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Reservasi */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content modal-edit" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Reservasi</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-row">
                <label>Nomor Reservasi</label>
                <input
                  type="text"
                  name="reservation"
                  value={editForm.reservation || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Nama</label>
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
                <label>Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Alamat</label>
                <textarea
                  name="address"
                  value={editForm.address || ''}
                  onChange={handleEditChange}
                  rows="3"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Simpan Perubahan</button>
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
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

export default ReservationDetail;
