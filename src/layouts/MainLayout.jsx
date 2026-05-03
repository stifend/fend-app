import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = ({ children, onLogout, onViewReservations, onViewCustomers, selectedCustomer }) => {
  return (
    <div className="dashboard-shell">
      <Sidebar onLogout={onLogout} onViewReservations={onViewReservations} onViewCustomers={onViewCustomers} selectedCustomer={selectedCustomer} />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
