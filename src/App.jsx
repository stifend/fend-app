import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Forgot from './pages/auth/Forgot';
import Dashboard from './pages/Dashboard';
import ReservationPage from './pages/ReservationPage';
import CustomerPage from './pages/CustomerPage';
import MainLayout from './layouts/MainLayout';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    setSelectedCustomer(null);
  };

  const handleViewReservations = () => setCurrentPage('reservation');
  const handleViewCustomers = () => setCurrentPage('customers');
  const handleSelectCustomer = (customer) => setSelectedCustomer(customer);
  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedCustomer(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'reservation':
        return <ReservationPage onBack={handleBackToDashboard} onSelectCustomer={handleSelectCustomer} />;
      case 'customers':
        return <CustomerPage onBack={handleBackToDashboard} />;
      default:
        return <Dashboard onViewReservations={handleViewReservations} />;
    }
  };

  return (
    <Routes>
      {/* Auth routes */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
      />
      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route
        path="/forgot"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Forgot />}
      />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <MainLayout
              onLogout={handleLogout}
              onViewReservations={handleViewReservations}
              onViewCustomers={handleViewCustomers}
              selectedCustomer={selectedCustomer}
            >
              {renderCurrentPage()}
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
