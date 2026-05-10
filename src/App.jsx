import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Forgot from './pages/auth/Forgot';
import Dashboard from './pages/Dashboard';
import ReservationPage from './pages/ReservationPage';
import ReservationDetail from './pages/ReservationDetail';
import CustomerPage from './pages/CustomerPage';
import CustomerDetail from './pages/CustomerDetail';
import MainLayout from './layouts/MainLayout';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
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

      {/* Protected routes with MainLayout */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <Dashboard />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/reservations"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <ReservationPage />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/reservation-detail/:id"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <ReservationDetail />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/customers"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <CustomerPage />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/customer-detail/:id"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <CustomerDetail />
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
