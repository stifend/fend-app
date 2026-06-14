// Import React hooks
import { useState } from "react";
// Import icon dari react-icons
import { ImSpinner2 } from "react-icons/im"; // Icon loading spinner
import { BsFillExclamationDiamondFill } from "react-icons/bs"; // Icon error
import { BsCheckCircleFill } from "react-icons/bs"; // Icon sukses
// Import layout wrapper untuk halaman auth
import AuthLayout from "../../layouts/AuthLayout";

// Halaman Forgot Password: Form reset password
// Desain mengikuti halaman Login, hanya berbeda di isi form
export default function Forgot() {
  // State untuk kontrol loading (true saat proses kirim link)
  const [loading, setLoading] = useState(false);

  // State untuk pesan sukses (tampil setelah link terkirim)
  const [success, setSuccess] = useState("");

  // State untuk menyimpan pesan error
  const [error, setError] = useState("");

  // State untuk menyimpan data form (email)
  const [dataForm, setDataForm] = useState({ email: "" });

  // Fungsi untuk handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target; // Ambil name dan value dari input
    setDataForm({ ...dataForm, [name]: value }); // Update field yang berubah
  };

  // Fungsi untuk handle submit form forgot password
  const handleSubmit = (e) => {
    e.preventDefault(); // Cegah reload halaman
    setLoading(true); // Set loading true (tampilkan spinner)
    setError(""); // Reset pesan error
    setSuccess(""); // Reset pesan sukses

    // Simulasi delay kirim link (600ms) untuk UX yang lebih baik
    setTimeout(() => {
      setLoading(false);
      setSuccess(
        "Link reset password telah dikirim ke email Anda. Silakan cek inbox."
      );
    }, 600);
  };

  return (
    // Wrapper AuthLayout: Sidebar (kiri) + Form Panel (kanan)
    <AuthLayout
      title="Lupa Password?"
      subtitle="Masukkan email Anda untuk menerima link reset password"
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

      {/* ========== FORM FORGOT PASSWORD ========== */}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Field: Email */}
        <div className="form-row">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        {/* Tombol Submit */}
        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? "Loading..." : "Send Reset Link"}
        </button>
      </form>

      {/* ========== LINKS BAWAH ========== */}
      <div className="auth-links-bottom">
        <p className="auth-link-row">
          <a href="/login" className="auth-link-muted">Kembali ke Login</a>
        </p>
      </div>
    </AuthLayout>
  );
}
