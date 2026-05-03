import React, { useState } from 'react';

const ReservationPage = ({ onBack, onSelectCustomer }) => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const reservations = [
    { 
      id: 'P001', 
      name: 'Rina Amelia', 
      reservation: 'RSV-7684', 
      payment: 'Lunas',
      email: 'rina.amelia@email.com',
      phone: '+62 812-3456-7890',
      address: 'Jl. Merdeka No. 123, Jakarta',
      photo: '👩‍💼'
    },
    { 
      id: 'P002', 
      name: 'Andi Putra', 
      reservation: 'RSV-7685', 
      payment: 'Pending',
      email: 'andi.putra@email.com',
      phone: '+62 812-3456-7891',
      address: 'Jl. Sudirman No. 456, Surabaya',
      photo: '👨‍💼'
    },
    { 
      id: 'P003', 
      name: 'Siti Rahma', 
      reservation: 'RSV-7686', 
      payment: 'Lunas',
      email: 'siti.rahma@email.com',
      phone: '+62 812-3456-7892',
      address: 'Jl. Ahmad Yani No. 789, Bandung',
      photo: '👩‍💼'
    },
    { 
      id: 'P004', 
      name: 'Budi Santoso', 
      reservation: 'RSV-7687', 
      payment: 'Belum Bayar',
      email: 'budi.santoso@email.com',
      phone: '+62 812-3456-7893',
      address: 'Jl. Gatot Subroto No. 321, Medan',
      photo: '👨‍💼'
    },
  ];

  const handleSelectReservation = (item) => {
    setSelectedReservation(item);
    onSelectCustomer && onSelectCustomer(item);
    window.scrollTo(0, 0);
  };

  if (!selectedReservation) {
    return (
      <div className="reservation-page">
        <div className="reservation-header">
          <button type="button" className="btn-back" onClick={onBack}>
            ← Kembali
          </button>
          <h2>Daftar Reservasi</h2>
        </div>
        <div className="reservation-content">
          <div className="reservasi-list-card">
            <div className="reservasi-table">
              <div className="table-header-reservasi">
                <span>ID Pelanggan</span>
                <span>Nama</span>
                <span>Nomor Reservasi</span>
                <span>Status Pembayaran</span>
                <span>Aksi</span>
              </div>
              {reservations.map((item) => (
                <div key={item.id} className="table-row-reservasi">
                  <span className="table-cell">{item.id}</span>
                  <span className="table-cell">{item.name}</span>
                  <span className="table-cell">{item.reservation}</span>
                  <span className={`table-cell status ${item.payment === 'Lunas' ? 'paid' : 'unpaid'}`}>
                    {item.payment}
                  </span>
                  <span className="table-cell">
                    <button type="button" className="btn-view" onClick={() => handleSelectReservation(item)}>
                      Lihat Detail
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-page">
      <div className="reservation-header">
        <button type="button" className="btn-back" onClick={() => setSelectedReservation(null)}>
          ← Kembali ke Daftar
        </button>
        <h2>Detail Reservasi</h2>
      </div>

      <div className="reservation-content">
        <div className="reservation-card">
          <div className="reservation-detail">
            <div className="detail-row">
              <span className="detail-label">ID Pelanggan:</span>
              <span className="detail-value">{selectedReservation.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Nama:</span>
              <span className="detail-value">{selectedReservation.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Nomor Reservasi:</span>
              <span className="detail-value">{selectedReservation.reservation}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status Pembayaran:</span>
              <span className={`detail-status ${selectedReservation.payment === 'Lunas' ? 'paid' : 'unpaid'}`}>
                {selectedReservation.payment}
              </span>
            </div>
          </div>

          <div className="reservation-actions">
            <button type="button" className="btn-primary">
              Konfirmasi Pembayaran
            </button>
            <button type="button" className="btn-secondary">
              Edit Reservasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;