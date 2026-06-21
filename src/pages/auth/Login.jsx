// Import React hooks
import { useState, useEffect } from "react";
// Import library React Router untuk navigasi
import { useNavigate } from "react-router-dom";
// Import icon dari react-icons
import { ImSpinner2 } from "react-icons/im"; // Icon loading spinner
import { BsFillExclamationDiamondFill } from "react-icons/bs"; // Icon error
// Import layout wrapper untuk halaman auth
import AuthLayout from "../../layouts/AuthLayout";
// Import koneksi Supabase
import { supabase } from "../../lib/supabase";

// Halaman Login: Form login yang divalidasi langsung ke database Supabase
// Props: onLogin = fungsi callback dari App.jsx untuk set status login
export default function Login({ onLogin }) {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();

  // State untuk kontrol loading (true saat proses login)
  const [loading, setLoading] = useState(false);

  // State untuk menyimpan pesan error (tampil jika login gagal)
  const [error, setError] = useState("");

  // State untuk menyimpan data form (email dan password)
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  // useEffect: Cek apakah user sudah login saat component mount
  // Jika ada token di localStorage, langsung redirect ke dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]); // Dependency: navigate (jalankan sekali saat mount)

  // Fungsi untuk handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target; // Ambil name dan value dari input
    setDataForm({ ...dataForm, [name]: value }); // Update field yang berubah
  };

  // Fungsi untuk handle submit form login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Cegah reload halaman
    setLoading(true); // Set loading true (tampilkan spinner)
    setError(""); // Reset pesan error

    try {
      // Panggil fungsi login_user di Supabase (cek email + password di database)
      const { data, error: rpcError } = await supabase.rpc("login_user", {
        p_email: dataForm.email,
        p_password: dataForm.password,
      });

      // Jika ada error dari Supabase
      if (rpcError) {
        setError("Terjadi kesalahan saat login. Coba lagi.");
        return;
      }

      // login_user mengembalikan array. Jika kosong = email/password salah
      if (!data || data.length === 0) {
        setError("Email atau password salah");
        return;
      }

      // ========== LOGIN BERHASIL ==========
      const user = data[0]; // Ambil data user dari hasil query

      // Cek role dan redirect sesuai role
      if (user.role === 'admin') {
        // ========== ADMIN LOGIN ==========
        // 1. Simpan token admin ke localStorage
        localStorage.setItem("token", `local-token-${user.id}`);
        
        // 2. Simpan data user (termasuk role) ke localStorage
        localStorage.setItem("user", JSON.stringify(user));
        
        // 3. Panggil callback onLogin dari props (set isLoggedIn = true di App.jsx)
        if (onLogin) onLogin(user);
        
        // 4. Redirect ke admin dashboard
        navigate("/dashboard", { replace: true });
      } else {
        // ========== MEMBER/USER LOGIN ==========
        // 1. Simpan token member ke localStorage
        localStorage.setItem("memberToken", `member-token-${user.id}`);
        
        // 2. Simpan data member ke localStorage
        localStorage.setItem("member", JSON.stringify(user));
        
        // 3. Redirect ke member dashboard
        navigate("/member-dashboard", { replace: true });
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoading(false); // Set loading false (sembunyikan spinner)
    }
  };

  return (
    // Wrapper AuthLayout: Sidebar (kiri) + Form Panel (kanan)
    <AuthLayout
      title="Login"
      subtitle="Masuk dengan akun Admin atau Member"
    >
      {/* ========== ALERT ERROR ========== */}
      {error && (
        <div className="auth-alert auth-alert-error">
          <BsFillExclamationDiamondFill /> {/* Icon error */}
          <span>{error}</span> {/* Pesan error */}
        </div>
      )}

      {/* ========== ALERT LOADING ========== */}
      {loading && (
        <div className="auth-alert auth-alert-info">
          <ImSpinner2 className="auth-spin" /> {/* Icon spinner (berputar) */}
          <span>Mohon tunggu...</span>
        </div>
      )}

      {/* ========== FORM LOGIN ========== */}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Field 1: Email */}
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="contoh: admin@novotel.com atau member@novotel.com"
            value={dataForm.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        {/* Field 2: Password */}
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password" // Type password = input tersembunyi (*****)
            name="password"
            placeholder="Masukkan password"
            value={dataForm.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        {/* Tombol Submit */}
        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {/* ========== LINKS BAWAH ========== */}
      <div className="auth-links-bottom">
        {/* Link 1: Register */}
        <p className="auth-link-row">
          Belum punya akun?{" "}
          <a href="/register" className="auth-link-accent">Register</a>
        </p>

        {/* Link 2: Forgot Password */}
        <p className="auth-link-row">
          <a href="/forgot" className="auth-link-muted">Lupa password?</a>
        </p>
      </div>
    </AuthLayout>
  );
}
