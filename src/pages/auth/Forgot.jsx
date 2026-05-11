export default function Forgot() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          Forgot Your Password?
        </h2>

        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <form>
          <div className="form-row">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="login-button"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Send Reset Link
          </button>

          <p style={{ textAlign: "center", fontSize: "0.875rem", marginTop: "1rem" }}>
            <a href="/login" style={{ color: "#94a3b8" }}>
              Kembali ke Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
