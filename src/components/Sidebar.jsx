import React from 'react';
import hotelLogo from '../assets/Hotel.jpg';
import pp from '../assets/pp.jpg';


const navItems = [
  { label: 'Dashboard', active: true },
  { label: 'Booking' },
  { label: 'Property Performance' },
  { label: 'Analysis' },
  { label: 'Settings' },
];

const Sidebar = ({ onLogout, onViewReservations, onViewCustomers, selectedCustomer }) => {
  const reservations = [
    { id: 'P001', name: 'Rina Amelia', reservation: 'RSV-7684', payment: 'Lunas' },
    { id: 'P002', name: 'Andi Putra', reservation: 'RSV-7685', payment: 'Pending' },
    { id: 'P003', name: 'Siti Rahma', reservation: 'RSV-7686', payment: 'Lunas' },
    { id: 'P004', name: 'Budi Santoso', reservation: 'RSV-7687', payment: 'Belum Bayar' },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div>
        <div className="sidebar-brand">
          <img src={hotelLogo} alt="Logo Hotel" className="logo" />
          <div>
            <span className="brand-label">Awakening</span>
            <h1 className="sidebar-title">Dashboard Hotel</h1>
          </div>
        </div>

        <div className="sidebar-reservasi">
          <div className="reservasi-header" onClick={() => onViewReservations && onViewReservations()} style={{ cursor: 'pointer' }}>
            <p className="reservasi-title">Reservasi</p>
            <span className="reservasi-count">{reservations.length}</span>
          </div>
        </div>

        <div className="sidebar-customers">
          <div className="customers-header" onClick={() => onViewCustomers && onViewCustomers()} style={{ cursor: 'pointer' }}>
            <p className="customers-title">Profil Pelanggan</p>
            <span className="customers-count">4</span>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="profile-card">
          <img src={pp} alt="Profile Picture" className="logo" />
          <div>
            <p className="profile-name">Stifend</p>
            <p className="profile-subtitle">View profile</p>
          </div>
        </div>
        <button type="button" className="btn btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
