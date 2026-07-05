// Import library React untuk state management
import { useState } from 'react';
// Import library React Router untuk navigasi antar halaman
import { Routes, Route, Navigate } from 'react-router-dom';

// Import halaman-halaman autentikasi (login, register, forgot password)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Forgot from './pages/auth/Forgot';

// Import halaman-halaman dashboard (dilindungi, butuh login)
import Dashboard from './pages/Dashboard';
import ReservationPage from './pages/ReservationPage';
import ReservationDetail from './pages/ReservationDetail';
import CustomerPage from './pages/CustomerPage';
import CustomerDetail from './pages/CustomerDetail';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import MembershipPage from './pages/MembershipPage';
import RoomsPage from './pages/RoomsPage';
import FeedbackPage from './pages/FeedbackPage';

// Import halaman Guest & Member
import GuestPage from './pages/GuestPage';
import MemberDashboard from './pages/MemberDashboard';
import BookingPage from './pages/BookingPage';
import UsersPage from './pages/UsersPage';
import LoginMember from './pages/LoginMember';

// Import layout wrapper untuk halaman dashboard (sidebar + header)
import MainLayout from './layouts/MainLayout';

// Import file CSS untuk styling
import './App.css';

function App() {
  // State untuk menyimpan status login user
  // Cek localStorage saat pertama kali load, jika ada token berarti sudah login
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token') // !! mengubah string menjadi boolean
  );

  // Fungsi untuk set status login menjadi true
  const handleLogin = () => setIsLoggedIn(true);

  // Fungsi untuk logout: hapus data dari localStorage dan set status login false
  const handleLogout = () => {
    localStorage.removeItem('token');  // Hapus token
    localStorage.removeItem('user');   // Hapus data user
    setIsLoggedIn(false);              // Set status login false
  };

  return (
    <Routes>
      {/* ========== ROUTE PUBLIK (Tidak perlu login) ========== */}

      {/* Route Guest Page (Landing Page) */}
      <Route path="/" element={<GuestPage />} />
      
      {/* Route Member Dashboard (dilindungi) */}
      <Route path="/member-dashboard" element={<MemberDashboard />} />

      {/* Route Booking (dilindungi untuk member) */}
      <Route path="/booking" element={<BookingPage />} />

      {/* Route Login Member */}
      <Route path="/login-member" element={<LoginMember />} />

      {/* Route Login Unified: Jika sudah login redirect sesuai role */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
      />

      {/* Route Register Admin: Jika sudah login redirect ke dashboard, jika belum tampilkan halaman register */}
      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* Route Forgot Password Admin: Jika sudah login redirect ke dashboard, jika belum tampilkan halaman forgot */}
      <Route
        path="/forgot"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Forgot />}
      />

      {/* ========== ROUTE TERLINDUNGI (Harus login dulu) ========== */}
      {/* Semua route ini dibungkus dengan MainLayout (ada Sidebar + Header) */}

      {/* Route Dashboard: Halaman utama setelah login */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <Dashboard />
            </MainLayout>
          ) : (
            <Navigate to="/" replace /> // Jika belum login, redirect ke Guest Page
          )
        }
      />

      {/* Route Reservations: Halaman list semua reservasi */}
      <Route
        path="/reservations"
        element={
          isLoggedIn ?
           (
            <MainLayout onLogout={handleLogout}>
              <ReservationPage />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Route Reservation Detail: Halaman detail 1 reservasi berdasarkan ID */}
      {/* :id adalah parameter dinamis, contoh: /reservation-detail/P001 */}
      <Route
        path="/reservation-detail/:id"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <ReservationDetail />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Route Customers: Halaman list semua customer */}
      <Route
        path="/customers"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <CustomerPage />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Route Customer Detail: Halaman detail 1 customer berdasarkan ID */}
      {/* :id adalah parameter dinamis, contoh: /customer-detail/P001 */}
      <Route
        path="/customer-detail/:id"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <CustomerDetail />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Route Payments: Halaman pembayaran dan statistik transaksi */}
      <Route
        path="/payments"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <PaymentsPage />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Route Reports: Halaman laporan dan analitik */}
      <Route
        path="/reports"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <ReportsPage />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Route Membership: Halaman membership pelanggan */}
      <Route
        path="/membership"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <MembershipPage />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

            {/* Route Rooms: Halaman manajemen kamar hotel */}
      <Route
        path="/rooms"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <RoomsPage />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Route Feedback: Halaman feedback dan review pelanggan */}
      <Route
        path="/feedback"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <FeedbackPage />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Route Users: Halaman manajemen user (admin CRUD, user view-only) */}
      <Route
        path="/users"
        element={
          isLoggedIn ? (
            <MainLayout onLogout={handleLogout}>
              <UsersPage />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ========== FALLBACK ROUTE ========== */}
      {/* Jika URL tidak cocok dengan route manapun, redirect ke GuestPage */}
      {/* Semua akses dimulai dari Guest Page terlebih dahulu */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
