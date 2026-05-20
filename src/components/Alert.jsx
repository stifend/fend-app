// ========================================
// ⚠️ ALERT COMPONENT
// ========================================
// Komponen alert reusable untuk notifikasi/pesan
//
// PROPS:
// - type: 'success' | 'error' | 'warning' | 'info'
// - title: string
// - message: string
// - children: ReactNode
// - onClose: function
// - closable: boolean
//
// CONTOH PENGGUNAAN:
// import { Alert } from './components';
// <Alert type="success" title="Berhasil" message="Data berhasil disimpan" />
// <Alert type="error" message="Terjadi kesalahan" onClose={() => setShowAlert(false)} />
// ========================================

const Alert = ({
  type = 'info',
  title,
  message,
  children,
  onClose,
  closable = true,
  className = '',
  ...props
}) => {
  // Type classes: success, error, warning, info
  const typeClass = `alert-${type}`;

  // Icons untuk setiap type
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`alert-component ${typeClass} ${className}`.trim()} {...props}>
      {/* Alert Icon */}
      <div className="alert-icon">
        {icons[type]}
      </div>

      {/* Alert Content */}
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        {message && <div className="alert-message">{message}</div>}
        {children && <div className="alert-body">{children}</div>}
      </div>

      {/* Close Button */}
      {closable && onClose && (
        <button 
          className="alert-close" 
          onClick={onClose}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;

// Contoh penggunaan:
// <Alert type="success" title="Berhasil" message="Data berhasil disimpan" />
// <Alert type="error" message="Terjadi kesalahan" onClose={() => setShowAlert(false)} />
// <Alert type="warning">Custom content here</Alert>
