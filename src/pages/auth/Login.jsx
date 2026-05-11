// Import React hooks
import { useState, useEffect } from "react";
// Import library React Router untuk navigasi
import { useNavigate } from "react-router-dom";
// Import icon dari react-icons
import { ImSpinner2 } from "react-icons/im"; // Icon loading spinner
import { BsFillExclamationDiamondFill } from "react-icons/bs"; // Icon error
// Import layout wrapper untuk halaman auth
import AuthLayout from "../../layouts/AuthLayout";

// Halaman Login: Form login dengan validasi hardcoded
// Props: onLogin = fungsi callback dari App.jsx untuk set status login
export default function Login({ onLogin }) {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  
  // State untuk kontrol loading (true saat proses login)
  const [loading, setLoading] = useState(false);
  
  // State untuk menyimpan pesan error (tampil jika login gagal)
  const [error, setError] = useState("");
  
  // State untuk menyimpan data form (email/username dan password)
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  // useEffect: Cek apakah user sudah login saat component mount
  // Jika ada token di localStorage, langsung redirect ke dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]); // Dependency: navigate (jalankan sekali saat mount)

  // Fungsi untuk handle perubahan input form
  // Setiap kali user ketik, update state dataForm
  const handleChange = (e) => {
    const { name, value } = e.target; // Ambil name dan value dari input
    setDataForm({ ...dataForm, [name]: value }); // Update field yang berubah
  };

  // Fungsi untuk handle submit form login
  const handleSubmit = (e) => {
    e.preventDefault(); // Cegah reload halaman
    setLoading(true);   // Set loading true (tampilkan spinner)
    setError("");       // Reset pesan error

    // Simulasi delay login (600ms) untuk UX yang lebih baik
    setTimeout(() => {
      // Validasi hardcoded: username = "admin", password = "123"
      if (dataForm.email === "admin" && dataForm.password === "123") {
        // ========== LOGIN BERHASIL ==========
        // 1. Simpan token ke localStorage (untuk persistent login)
        localStorage.setItem("token", "local-token-admin");
        
        // 2. Simpan data user ke localStorage (opsional, untuk info user)
        localStorage.setItem("user", JSON.stringify({ username: "admin" }));
        
        // 3. Panggil callback onLogin dari props (set isLoggedIn = true di App.jsx)
        if (onLogin) onLogin();
        
        // 4. Redirect ke dashboard
        navigate("/dashboard", { replace: true });
      } else {
        // ========== LOGIN GAGAL ==========
        // Tampilkan pesan error
        setError("Username atau password salah");
      }
      
      // Set loading false (sembunyikan spinner)
      setLoading(false);
    }, 600); // Delay 600ms
  };

  return (
    // Wrapper AuthLayout: Sidebar (kiri) + Form Panel (kanan)
    <AuthLayout 
      title="Login ke Dashboard" 
      subtitle="Masuk untuk mengelola hotel Anda"
    >
      {/* ========== ALERT ERROR ========== */}
      {/* Tampil jika ada error (login gagal) */}
      {error && (
        <div className="auth-alert auth-alert-error">
          <BsFillExclamationDiamondFill /> {/* Icon error */}
          <span>{error}</span> {/* Pesan error */}
        </div>
      )}

      {/* ========== ALERT LOADING ========== */}
      {/* Tampil saat proses login (loading = true) */}
      {loading && (
        <div className="auth-alert auth-alert-info">
          <ImSpinner2 className="auth-spin" /> {/* Icon spinner (berputar) */}
          <span>Mohon tunggu...</span>
        </div>
      )}

      {/* ========== FORM LOGIN ========== */}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Field 1: Username */}
        <div className="form-row">
          <label htmlFor="email">Username</label>
          <input
            id="email"
            type="text"
            name="email" // name="email" tapi sebenarnya untuk username (legacy naming)
            placeholder="contoh: admin"
            onChange={handleChange} // Update state saat user ketik
            required // Field wajib diisi
            autoComplete="username" // Browser autocomplete untuk username
          />
        </div>

        {/* Field 2: Password */}
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password" // Type password = input tersembunyi (*****)
            name="password"
            placeholder="contoh: 123"
            onChange={handleChange} // Update state saat user ketik
            required // Field wajib diisi
            autoComplete="current-password" // Browser autocomplete untuk password
          />
        </div>

        {/* Tombol Submit */}
        {/* disabled={loading} = tombol tidak bisa diklik saat loading */}
        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? "Loading..." : "Login"} {/* Text berubah saat loading */}
        </button>
      </form>

      {/* ========== LINKS BAWAH ========== */}
      {/* Link ke halaman Register dan Forgot Password */}
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

// CATATAN PENTING:
// - Kredensial login: username = "admin", password = "123" (hardcoded)
// - Token disimpan di localStorage (tidak aman untuk production)
// - Untuk production, gunakan backend API untuk validasi dan JWT token
// - Password harus di-hash, jangan simpan plain text
