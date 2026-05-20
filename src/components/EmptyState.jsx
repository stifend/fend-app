// ========================================
// 📭 EMPTY STATE COMPONENT
// ========================================
// Komponen empty state reusable untuk tampilan data kosong
//
// PROPS:
// - icon: ReactNode
// - title: string
// - message: string
// - action: ReactNode
// - className: string
//
// CONTOH PENGGUNAAN:
// import { EmptyState } from './components';
// <EmptyState 
//   icon={<span style={{fontSize: '48px'}}>📋</span>}
//   title="Belum ada reservasi" 
//   message="Mulai tambahkan reservasi baru"
//   action={<Button onClick={handleAdd}>Tambah Reservasi</Button>}
// />
// ========================================

const EmptyState = ({
  icon,
  title = 'Tidak ada data',
  message,
  action,
  className = '',
  ...props
}) => {
  // Default icon jika tidak ada
  const defaultIcon = (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#f3f4f6"/>
      <path d="M32 20v24M20 32h24" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className={`empty-state-component ${className}`.trim()} {...props}>
      {/* Icon */}
      <div className="empty-state-icon">
        {icon || defaultIcon}
      </div>

      {/* Title */}
      <h3 className="empty-state-title">{title}</h3>

      {/* Message */}
      {message && (
        <p className="empty-state-message">{message}</p>
      )}

      {/* Action Button */}
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

// Contoh penggunaan:
// <EmptyState 
//   icon={<span style={{fontSize: '48px'}}>📋</span>}
//   title="Belum ada reservasi" 
//   message="Mulai tambahkan reservasi baru"
//   action={<Button onClick={handleAdd}>Tambah Reservasi</Button>}
// />
