import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import AuthLayout from "../../layouts/AuthLayout";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (dataForm.email === "admin" && dataForm.password === "123") {
        localStorage.setItem("token", "local-token-admin");
        localStorage.setItem("user", JSON.stringify({ username: "admin" }));
        if (onLogin) onLogin();
        navigate("/dashboard", { replace: true });
      } else {
        setError("Username atau password salah");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <AuthLayout 
      title="Login ke Dashboard" 
      subtitle="Masuk untuk mengelola hotel Anda"
    >
      {/* Alert error */}
      {error && (
        <div className="auth-alert auth-alert-error">
          <BsFillExclamationDiamondFill />
          <span>{error}</span>
        </div>
      )}

      {/* Alert loading */}
      {loading && (
        <div className="auth-alert auth-alert-info">
          <ImSpinner2 className="auth-spin" />
          <span>Mohon tunggu...</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <label htmlFor="email">Username</label>
          <input
            id="email"
            type="text"
            name="email"
            placeholder="contoh: admin"
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="contoh: 123"
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {/* Links */}
      <div className="auth-links-bottom">
        <p className="auth-link-row">
          Belum punya akun?{" "}
          <a href="/register" className="auth-link-accent">Register</a>
        </p>
        <p className="auth-link-row">
          <a href="/forgot" className="auth-link-muted">Lupa password?</a>
        </p>
      </div>
    </AuthLayout>
  );
}
