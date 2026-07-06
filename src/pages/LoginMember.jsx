// Halaman Login Member - Untuk customer/tamu hotel
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { supabase } from "../lib/supabase";
import '../guest-page.css';

export default function LoginMember() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  // Cek apakah sudah login
  useEffect(() => {
    const token = localStorage.getItem("memberToken");
    if (token) navigate("/member-dashboard", { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Panggil function login_member di Supabase
      // Asumsi: Anda punya function ini atau bisa pakai login_user dengan modifikasi
      const { data, error: rpcError } = await supabase.rpc("login_user", {
        p_email: dataForm.email,
        p_password: dataForm.password,
      });

      if (rpcError) {
        setError("Terjadi kesalahan saat login. Coba lagi.");
        return;
      }

      if (!data || data.length === 0) {
        setError("Email atau password salah");
        return;
      }

      const member = data[0];

      // Cek apakah user adalah role 'member' or 'user'
      if (member.role === 'admin') {
        setError("Akun admin tidak bisa login di halaman member. Silakan login di halaman admin.");
        return;
      }

      // Simpan token member
      localStorage.setItem("memberToken", `member-token-${member.id}`);
      localStorage.setItem("member", JSON.stringify(member));

      // Redirect: jika datang dari tombol "Pesan Sekarang" (GuestPage),
      // lanjutkan ke halaman booking dengan tipe kamar yang dipilih.
      // Jika tidak, ke member dashboard seperti biasa.
      const returnTo = location.state?.returnTo;
      const roomType = location.state?.roomType;
      if (returnTo) {
        navigate(returnTo, { replace: true, state: { roomType } });
      } else {
        navigate("/member-dashboard", { replace: true });
      }
    } catch (err) {
      console.error('Login member error:', err);
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-member-page">
      {/* Navbar */}
      <nav className="guest-navbar">
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="brand-logo">
              <img src="/images/hotel-logo.jpg" alt="Novotel Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <h1>Novotel Hotel</h1>
          </div>
          <div className="navbar-menu">
            <button className="nav-btn-outline" onClick={() => navigate('/')}>
              ← Kembali ke Home
            </button>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="login-member-container">
        <div className="login-member-card">
          <div className="login-member-header">
            <div className="login-icon">👤</div>
            <h2>Login Member</h2>
            <p>Masuk untuk melihat riwayat transaksi Anda</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <BsFillExclamationDiamondFill />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="auth-alert auth-alert-info">
              <ImSpinner2 className="auth-spin" />
              <span>Mohon tunggu...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-member-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="member@example.com"
                value={dataForm.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Masukkan password"
                value={dataForm.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-submit-member" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <div className="login-member-footer">
            <p>
              Belum punya akun member? 
              <a href="/register" className="link-register"> Daftar di sini</a>
            </p>
            <p>
              <a href="/forgot" className="link-forgot">Lupa password?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
