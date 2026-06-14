// Import React hooks
import { useState } from "react";
// Import library React Router untuk navigasi
import { useNavigate } from "react-router-dom";
// Import icon dari react-icons
import { ImSpinner2 } from "react-icons/im"; // Icon loading spinner
import { BsFillExclamationDiamondFill, BsCheckCircleFill } from "react-icons/bs";
// Import layout wrapper untuk halaman auth
import AuthLayout from "../../layouts/AuthLayout";
// Import koneksi Supabase
import { supabase } from "../../lib/supabase";

// Halaman Register: Form pendaftaran akun baru ke database Supabase
// Setelah berhasil, user bisa langsung login dengan akun yang baru dibuat
export default function Register() {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();

  // State untuk kontrol loading (true saat proses register)
  const [loading, setLoading] = useState(false);

  // State untuk menyimpan pesan error
  const [error, setError] = useState("");

  // State untuk pesan sukses
  const [success, setSuccess] = useState("");

  // State untuk menyimpan data form
  const [dataForm, setDataForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Fungsi untuk handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target; // Ambil name dan value dari input
    setDataForm({ ...dataForm, [name]: value }); // Update field yang berubah
  };

  // Fungsi untuk handle submit form register
  const handleSubmit = async (e) => {
    e.preventDefault(); // Cegah reload halaman
    setError(""); // Reset pesan error
    setSuccess(""); // Reset pesan sukses

    // Validasi: password minimal 6 karakter
    if (dataForm.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    // Validasi: password dan konfirmasi harus sama
    if (dataForm.password !== dataForm.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true); // Set loading true (tampilkan spinner)

    try {
      // Panggil fungsi register_user di Supabase (buat akun baru)
      const { error: rpcError } = await supabase.rpc("register_user", {
        p_name: dataForm.name,
        p_email: dataForm.email,
        p_password: dataForm.password,
      });

      // Jika ada error (misal email sudah terdaftar)
      if (rpcError) {
        // Pesan dari fungsi register_user: "Email sudah terdaftar"
        if (rpcError.message && rpcError.message.includes("sudah terdaftar")) {
          setError("Email sudah terdaftar. Gunakan email lain.");
        } else {
          setError("Gagal mendaftar. Coba lagi.");
        }
        return;
      }

      // ========== REGISTER BERHASIL ==========
      setSuccess("Pendaftaran berhasil! Mengarahkan ke halaman login...");

      // Arahkan ke halaman login setelah 1.5 detik
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoading(false); // Set loading false
    }
  };

  return (
    // Wrapper AuthLayout: Sidebar (kiri) + Form Panel (kanan)
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Daftar untuk mulai mengelola hotel Anda"
    >
      {/* ========== ALERT ERROR ========== */}
      {error && (
        <div className="auth-alert auth-alert-error">
          <BsFillExclamationDiamondFill /> {/* Icon error */}
          <span>{error}</span> {/* Pesan error */}
        </div>
      )}

      {/* ========== ALERT SUKSES ========== */}
      {success && (
        <div className="auth-alert auth-alert-info">
          <BsCheckCircleFill /> {/* Icon sukses */}
          <span>{success}</span> {/* Pesan sukses */}
        </div>
      )}

      {/* ========== ALERT LOADING ========== */}
      {loading && (
        <div className="auth-alert auth-alert-info">
          <ImSpinner2 className="auth-spin" /> {/* Icon spinner (berputar) */}
          <span>Mohon tunggu...</span>
        </div>
      )}

      {/* ========== FORM REGISTER ========== */}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Field 1: Nama */}
        <div className="form-row">
          <label htmlFor="name">Nama Lengkap</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="contoh: Budi Santoso"
            value={dataForm.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>

        {/* Field 2: Email */}
        <div className="form-row">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={dataForm.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        {/* Field 3: Password */}
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Minimal 6 karakter"
            value={dataForm.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Field 4: Confirm Password */}
        <div className="form-row">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Ulangi password"
            value={dataForm.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Tombol Submit */}
        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      {/* ========== LINKS BAWAH ========== */}
      <div className="auth-links-bottom">
        <p className="auth-link-row">
          Sudah punya akun?{" "}
          <a href="/login" className="auth-link-accent">Login</a>
        </p>
      </div>
    </AuthLayout>
  );
}
