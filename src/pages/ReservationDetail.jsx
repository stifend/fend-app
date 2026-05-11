// Import React hooks dan Router hooks
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';

// Halaman Detail Reservasi: Menampilkan detail 1 reservasi + fitur edit & konfirmasi pembayaran
const ReservationDetail = () => {
  // Hook untuk mendapatkan data yang dikirim dari halaman sebelumnya
  const location = useLocation();
  
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  
  // Hook untuk mendapatkan parameter ID dari URL (contoh: /reservation-detail/P001)
  const { id } = useParams();
  
  // Ambil data dan fungsi update dari Context API
  const { reservations, updateReservationPayment, updateReservation } = useData();

  // State untuk menyimpan data reservasi yang sedang dilihat
  // Prioritas: 1) Data dari location.state (dikirim dari halaman list)
  //            2) Cari di array reservations berdasarkan ID dari URL
  const [reservationData, setReservationData] = useState(
    location.state || reservations.find(r => r.id === id)
  );

  // State untuk kontrol tampil/sembunyikan modal konfirmasi pembayaran
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // State untuk kontrol tampil/sembunyikan modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  
  // State untuk menyimpan data form edit (sementara sebelum disimpan)
  const [editForm, setEditForm] = useState({});

  // Jika data reservasi tidak ditemukan, tampilkan pesan error
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

  // Fungsi untuk konfirmasi pembayaran
  // Parameter: status = "Lunas" / "Pending" / "Belum Bayar"
  const handleConfirmPayment = (status) => {
    // Update status pembayaran di Context API (sinkron ke semua halaman)
    updateReservationPayment(reservationData.id, status);
    
    // Update data lokal di halaman ini
    setReservationData({ ...reservationData, payment: status });
    
    // Tutup modal
    setShowPaymentModal(false);
  };

  // Fungsi untuk membuka modal edit
  // Copy data reservasi ke form edit
  const handleEditClick = () => {
    setEditForm({ ...reservationData });
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
    updateReservation(reservationData.id, editForm);
    
    // Update data lokal di halaman ini
    setReservationData(editForm);
    
    // Tutup modal
    setShowEditModal(false);
  };

  return (
    <div className="reservation-page">
      {/* ========== HEADER: Tombol Kembali + Judul ========== */}
      <div className="reservation-header">
        <button type="button" className="btn-back" onClick={() => navigate('/reservations')}>
          ← Kembali ke Daftar
        </button>
        <h2>Detail Reservasi</h2>
      </div>

      {/* ========== CONTENT: Detail Reservasi ========== */}
      <div className="reservation-content">
        <div className="reservation-card">
          {/* Detail Information: Tampilkan semua data reservasi */}
          <div className="reservation-detail">
            {/* Row 1: ID Pelanggan */}
            <div className="detail-row">
              <span className="detail-label">ID Pelanggan:</span>
              <span className="detail-value">{reservationData.id}</span>
            </div>
            
            {/* Row 2: Nama */}
            <div className="detail-row">
              <span className="detail-label">Nama:</span>
              <span className="detail-value">{reservationData.name}</span>
            </div>
            
            {/* Row 3: Email */}
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{reservationData.email}</span>
            </div>
            
            {/* Row 4: Telepon */}
            <div className="detail-row">
              <span className="detail-label">Telepon:</span>
              <span className="detail-value">{reservationData.phone}</span>
            </div>
            
            {/* Row 5: Alamat */}
            <div className="detail-row">
              <span className="detail-label">Alamat:</span>
              <span className="detail-value">{reservationData.address}</span>
            </div>
            
            {/* Row 6: Nomor Reservasi */}
            <div className="detail-row">
              <span className="detail-label">Nomor Reservasi:</span>
              <span className="detail-value">{reservationData.reservation}</span>
            </div>
            
            {/* Row 7: Status Pembayaran (dengan warna: hijau = Lunas, merah = lainnya) */}
            <div className="detail-row">
              <span className="detail-label">Status Pembayaran:</span>
              <span className={`detail-status ${reservationData.payment === 'Lunas' ? 'paid' : 'unpaid'}`}>
                {reservationData.payment}
              </span>
            </div>
          </div>

          {/* Action Buttons: Konfirmasi Pembayaran & Edit */}
          <div className="reservation-actions">
            {/* Tombol 1: Buka modal konfirmasi pembayaran */}
            <button type="button" className="btn-primary" onClick={() => setShowPaymentModal(true)}>
              Konfirmasi Pembayaran
            </button>
            
            {/* Tombol 2: Buka modal edit */}
            <button type="button" className="btn-secondary" onClick={handleEditClick}>
              Edit Reservasi
            </button>
          </div>
        </div>
      </div>

      {/* ========== MODAL KONFIRMASI PEMBAYARAN ========== */}
      {/* Modal hanya tampil jika showPaymentModal = true */}
      {showPaymentModal && (
        // Overlay: Background gelap, klik untuk tutup modal
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          {/* Modal Content: Klik tidak akan tutup modal (stopPropagation) */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Konfirmasi Pembayaran</h3>
            <p>Pilih status pembayaran untuk reservasi <strong>{reservationData.reservation}</strong></p>
            
            {/* 4 Tombol Pilihan Status */}
            <div className="modal-actions">
              {/* Tombol 1: Lunas (hijau) */}
              <button className="btn-success" onClick={() => handleConfirmPayment('Lunas')}>
                ✓ Lunas
              </button>
              
              {/* Tombol 2: Pending (kuning) */}
              <button className="btn-warning" onClick={() => handleConfirmPayment('Pending')}>
                ⏳ Pending
              </button>
              
              {/* Tombol 3: Belum Bayar (merah) */}
              <button className="btn-danger" onClick={() => handleConfirmPayment('Belum Bayar')}>
                ✗ Belum Bayar
              </button>
              
              {/* Tombol 4: Batal (tutup modal tanpa update) */}
              <button className="btn-cancel" onClick={() => setShowPaymentModal(false)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL EDIT RESERVASI ========== */}
      {/* Modal hanya tampil jika showEditModal = true */}
      {showEditModal && (
        // Overlay: Background gelap, klik untuk tutup modal
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          {/* Modal Content: Klik tidak akan tutup modal (stopPropagation) */}
          <div className="modal-content modal-edit" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Reservasi</h3>
            
            {/* Form Edit: Submit akan panggil handleEditSubmit */}
            <form onSubmit={handleEditSubmit}>
              {/* Field 1: Nomor Reservasi */}
              <div className="form-row">
                <label>Nomor Reservasi</label>
                <input
                  type="text"
                  name="reservation" // name harus sama dengan key di object data
                  value={editForm.reservation || ''} // || '' untuk hindari uncontrolled component
                  onChange={handleEditChange} // Update state saat user ketik
                  required // Field wajib diisi
                />
              </div>
              
              {/* Field 2: Nama */}
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
              
              {/* Field 3: Email */}
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
              
              {/* Field 4: Telepon */}
              <div className="form-row">
                <label>Telepon</label>
                <input
                  type="tel" // Keyboard nomor di mobile
                  name="phone"
                  value={editForm.phone || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              {/* Field 5: Alamat (textarea untuk text panjang) */}
              <div className="form-row">
                <label>Alamat</label>
                <textarea
                  name="address"
                  value={editForm.address || ''}
                  onChange={handleEditChange}
                  rows="3" // Tinggi textarea 3 baris
                  required
                />
              </div>
              
              {/* Action Buttons: Simpan & Batal */}
              <div className="modal-actions">
                {/* Tombol 1: Submit form (simpan perubahan) */}
                <button type="submit" className="btn-primary">Simpan Perubahan</button>
                
                {/* Tombol 2: Batal (tutup modal tanpa simpan) */}
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
