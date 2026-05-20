// ========================================
// 🏷️ BADGE COMPONENT
// ========================================
// Komponen badge reusable untuk label/tag
//
// PROPS:
// - children: ReactNode
// - variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
// - size: 'small' | 'medium' | 'large'
// - className: string
//
// CONTOH PENGGUNAAN:
// import { Badge } from './components';
// <Badge variant="success">Lunas</Badge>
// <Badge variant="warning" size="small">Pending</Badge>
// <Badge variant="danger">Belum Bayar</Badge>
// ========================================

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
  ...props
}) => {
  // Base class
  const baseClass = 'badge-component';
  
  // Variant classes: default, primary, success, warning, danger, info
  const variantClass = `badge-${variant}`;
  
  // Size classes: small, medium, large
  const sizeClass = `badge-${size}`;
  
  // Gabungkan semua classes
  const badgeClass = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
};

export default Badge;

// Contoh penggunaan:
// <Badge variant="success">Lunas</Badge>
// <Badge variant="warning" size="small">Pending</Badge>
// <Badge variant="danger">Belum Bayar</Badge>
