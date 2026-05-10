import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import hotelLogo from '../assets/Hotel.jpg';
import pp from '../assets/pp.jpg';
import { useData } from '../context/DataContext';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservations, customers } = useData();

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

        {/* Menu Dashboard */}
        <div className="sidebar-dashboard">
          <div 
            className="sidebar-dashboard-header" 
            onClick={() => navigate('/dashboard')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="sidebar-dashboard-title">Dashboard</p>
            <span className="dashboard-count">1</span>
          </div>
        </div>

        <div className="sidebar-reservasi">
          <div 
            className="reservasi-header" 
            onClick={() => navigate('/reservations')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="reservasi-title">Reservasi</p>
            <span className="reservasi-count">{reservations.length}</span>
          </div>
        </div>

        <div className="sidebar-customers">
          <div 
            className="customers-header" 
            onClick={() => navigate('/customers')} 
            style={{ cursor: 'pointer' }}
          >
            <p className="customers-title">Profil Pelanggan</p>
            <span className="customers-count">{customers.length}</span>
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
