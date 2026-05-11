// Import React hooks
import { useState, useEffect } from "react";
// Import library React Router untuk navigasi
import { useNavigate } from "react-router-dom";
// Import icon dari react-icons
import { ImSpinner2 } from "react-icons/im"; // Icon loading spinner
import { BsFillExclamationDiamondFill } from "react-icons/bs"; // Icon error

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
    <div className="login-page">
      {/* Background decorative element */}
      <div className="login-background">
        {/* Hanging lamp illustration */}
        <svg className="lamp-illustration" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
          <line x1="50" y1="10" x2="50" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          <circle cx="50" cy="45" r="15" fill="rgba(255,255,255,0.2)"/>
          <path d="M 40 50 Q 50 70 60 50" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
        </svg>

        {/* Wave shape decoration */}
        <svg className="wave-decoration" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M 0,150 Q 100,100 200,150 T 400,150 L 400,300 L 0,300 Z" 
                fill="rgba(59, 130, 246, 0.3)" opacity="0.8"/>
          <path d="M 0,180 Q 100,130 200,180 T 400,180 L 400,300 L 0,300 Z" 
                fill="rgba(59, 130, 246, 0.2)" opacity="0.6"/>
        </svg>
      </div>

      {/* Person illustration */}
      <div className="person-illustration">
        <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="100" cy="60" r="25" fill="#f5a962"/>
          {/* Hair */}
          <path d="M 75 50 Q 100 30 125 50" fill="#8b6f47"/>
          {/* Face */}
          <circle cx="90" cy="55" r="4" fill="#333"/>
          <circle cx="110" cy="55" r="4" fill="#333"/>
          {/* Smile */}
          <path d="M 90 70 Q 100 75 110 70" stroke="#333" strokeWidth="2" fill="none"/>
          
          {/* Body */}
          <rect x="75" y="90" width="50" height="50" rx="10" fill="#f0f0f0"/>
          {/* Arm left */}
          <rect x="50" y="95" width="25" height="15" rx="7" fill="#f5a962" transform="rotate(-20 62 102)"/>
          {/* Arm right */}
          <rect x="125" y="95" width="25" height="15" rx="7" fill="#f5a962" transform="rotate(20 138 102)"/>
          
          {/* Legs */}
          <rect x="80" y="145" width="12" height="45" rx="6" fill="#666"/>
          <rect x="108" y="145" width="12" height="45" rx="6" fill="#666"/>
          {/* Shoes */}
          <ellipse cx="86" cy="195" rx="10" ry="8" fill="#333"/>
          <ellipse cx="114" cy="195" rx="10" ry="8" fill="#333"/>
        </svg>
      </div>

      {/* Form Container */}
      <div className="login-container">
        {/* Welcome Text */}
        <div className="login-welcome">
          <h1>Welcome Dashboard Hotel</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-alert login-alert-error">
            <BsFillExclamationDiamondFill /> {/* Icon error */}
            <span>{error}</span>
          </div>
        )}

        {/* Loading Alert */}
        {loading && (
          <div className="login-alert login-alert-info">
            <ImSpinner2 className="login-spin" />
            <span>Mohon tunggu...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Username Field */}
          <div className="login-form-group">
            <label htmlFor="email">Username</label>
            <input
              id="email"
              type="text"
              name="email"
              placeholder="Masukkan username"
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          {/* Password Field */}
          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Masukkan password"
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="login-form-forgot">
            <a href="/forgot">Forgot Password?</a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-btn-submit" disabled={loading}>
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </form>

        {/* Register Link */}
        <div className="login-register-link">
          <p>Click here <a href="/register">Registration</a></p>
        </div>
      </div>
    </div>
  );
}

// CATATAN PENTING:
// - Kredensial login: username = "admin", password = "123" (hardcoded)
// - Token disimpan di localStorage (tidak aman untuk production)
// - Untuk production, gunakan backend API untuk validasi dan JWT token
// - Password harus di-hash, jangan simpan plain text
