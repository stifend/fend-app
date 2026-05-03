import React, { useState } from 'react';

const CustomerPage = ({ onBack }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const customers = [
    {
      id: 'P001',
      name: 'Rina Amelia',
      email: 'rina.amelia@email.com',
      phone: '+62 812-3456-7890',
      address: 'Jl. Merdeka No. 123, Jakarta',
      photo: '👩‍💼',
      joinDate: '2024-01-15'
    },
    {
      id: 'P002',
      name: 'Andi Putra',
      email: 'andi.putra@email.com',
      phone: '+62 812-3456-7891',
      address: 'Jl. Sudirman No. 456, Surabaya',
      photo: '👨‍💼',
      joinDate: '2024-02-20'
    },
    {
      id: 'P003',
      name: 'Siti Rahma',
      email: 'siti.rahma@email.com',
      phone: '+62 812-3456-7892',
      address: 'Jl. Ahmad Yani No. 789, Bandung',
      photo: '👩‍💼',
      joinDate: '2024-03-10'
    },
    {
      id: 'P004',
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '+62 812-3456-7893',
      address: 'Jl. Gatot Subroto No. 321, Medan',
      photo: '👨‍💼',
      joinDate: '2024-04-05'
    },
  ];

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    window.scrollTo(0, 0);
  };

  if (!selectedCustomer) {
    return (
      <div className="customer-page">
        <div className="customer-page-header">
          <button type="button" className="btn-back" onClick={onBack}>
            ← Kembali
          </button>
          <h2>Daftar Pelanggan</h2>
        </div>
        <div className="customer-page-content">
          <div className="customer-list-card">
            <div className="customer-table">
              <div className="table-header-customer">
                <span>ID</span>
                <span>Nama</span>
                <span>Email</span>
                <span>Telepon</span>
                <span>Aksi</span>
              </div>
              {customers.map((customer) => (
                <div key={customer.id} className="table-row-customer">
                  <span className="table-cell-customer">{customer.id}</span>
                  <span className="table-cell-customer">{customer.name}</span>
                  <span className="table-cell-customer">{customer.email}</span>
                  <span className="table-cell-customer">{customer.phone}</span>
                  <span className="table-cell-customer">
                    <button type="button" className="btn-view" onClick={() => handleSelectCustomer(customer)}>
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
    <div className="customer-page">
      <div className="customer-page-header">
        <button type="button" className="btn-back" onClick={() => setSelectedCustomer(null)}>
          ← Kembali ke Daftar
        </button>
        <h2>Detail Pelanggan</h2>
      </div>

      <div className="customer-page-content">
        <div className="customer-detail-card">
          <div className="customer-detail-header">
            <div className="customer-detail-photo">{selectedCustomer.photo}</div>
            <div className="customer-detail-info">
              <h3>{selectedCustomer.name}</h3>
              <p>ID: {selectedCustomer.id}</p>
              <p>Bergabung sejak: {selectedCustomer.joinDate}</p>
            </div>
          </div>

          <div className="customer-detail-body">
            <div className="detail-section">
              <h4>Informasi Kontak</h4>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedCustomer.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Telepon:</span>
                <span className="detail-value">{selectedCustomer.phone}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Alamat</h4>
              <div className="detail-row">
                <span className="detail-value full-width">{selectedCustomer.address}</span>
              </div>
            </div>
          </div>

          <div className="customer-detail-actions">
            <button type="button" className="btn-primary">
              Edit Profil
            </button>
            <button type="button" className="btn-secondary">
              Lihat Reservasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
