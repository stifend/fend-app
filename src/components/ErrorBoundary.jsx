// Error Boundary Component
// Menangkap error React dan menampilkan fallback UI yang user-friendly
// Mencegah crash seluruh aplikasi ketika ada error di salah satu component

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // State untuk tracking error
    this.state = {
      hasError: false,     // Apakah terjadi error?
      error: null,         // Object error
      errorInfo: null      // Info tambahan dari error
    };
  }

  // Method lifecycle: dipanggil ketika ada error di child component
  static getDerivedStateFromError() {
    // Update state agar render berikutnya menampilkan fallback UI
    return { hasError: true };
  }

  // Method lifecycle: dipanggil setelah error ditangkap
  // Digunakan untuk logging error ke service monitoring (Sentry, LogRocket, dll)
  componentDidCatch(error, errorInfo) {
    // Log error untuk debugging
    console.error('🔴 Error Boundary caught an error:', error, errorInfo);
    
    // Update state dengan detail error
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // TODO: Send error to logging service
    // Example: logErrorToService(error, errorInfo);
  }

  // Fungsi untuk reset error state (retry)
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Reload page untuk fresh start
    window.location.href = '/';
  };

  render() {
    // Jika ada error, tampilkan fallback UI
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          padding: '2rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '1.5rem',
            padding: '3rem',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.1)',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            textAlign: 'center'
          }}>
            {/* Icon Error */}
            <div style={{
              width: '80px',
              height: '80px',
              background: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem'
            }}>
              ⚠️
            </div>

            {/* Error Title */}
            <h2 style={{
              margin: '0 0 1rem',
              fontSize: '1.75rem',
              color: '#0f172a',
              fontWeight: '700'
            }}>
              Oops! Terjadi Kesalahan
            </h2>

            {/* Error Description */}
            <p style={{
              margin: '0 0 1.5rem',
              color: '#64748b',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              Maaf, terjadi kesalahan tak terduga. Tim kami telah diberi tahu dan akan memperbaikinya segera.
            </p>

            {/* Error Details (Development Mode) */}
            {import.meta.env.DEV && this.state.error && (
              <details style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
                border: '1px solid #e2e8f0'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#475569',
                  marginBottom: '0.75rem'
                }}>
                  📋 Detail Error (Development Mode)
                </summary>
                <pre style={{
                  margin: '0',
                  fontSize: '0.85rem',
                  color: '#dc2626',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {/* Button: Kembali ke Beranda */}
              <button
                onClick={this.handleReset}
                style={{
                  border: 'none',
                  background: '#3b82f6',
                  color: '#fff',
                  padding: '0.95rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#2563eb';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#3b82f6';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🏠 Kembali ke Beranda
              </button>

              {/* Button: Reload Halaman */}
              <button
                onClick={() => window.location.reload()}
                style={{
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  color: '#334155',
                  padding: '0.95rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fff';
                }}
              >
                🔄 Muat Ulang
              </button>
            </div>

            {/* Help Text */}
            <p style={{
              marginTop: '2rem',
              fontSize: '0.85rem',
              color: '#94a3b8'
            }}>
              Jika masalah berlanjut, hubungi{' '}
              <a
                href="mailto:support@novotelhotel.com"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                support@novotelhotel.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    // Jika tidak ada error, render children seperti biasa
    return this.props.children;
  }
}

export default ErrorBoundary;
