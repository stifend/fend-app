// ========================================
// 🃏 CARD COMPONENT
// ========================================
// Komponen card reusable untuk container konten
//
// PROPS:
// - title: string
// - subtitle: string
// - children: ReactNode
// - footer: ReactNode
// - onClick: function
// - className: string
//
// CONTOH PENGGUNAAN:
// import { Card } from './components';
// <Card title="Dashboard" subtitle="Overview">Content here</Card>
// <Card footer={<Button>Action</Button>}>Simple card</Card>
// <Card onClick={handleClick}>Clickable card</Card>
// ========================================

const Card = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <div 
      className={`card-component ${onClick ? 'card-clickable' : ''} ${className}`.trim()}
      onClick={onClick}
      {...props}
    >
      {/* Card Header (jika ada title atau subtitle) */}
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      
      {/* Card Body */}
      <div className="card-body">
        {children}
      </div>
      
      {/* Card Footer (opsional) */}
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

// Contoh penggunaan:
// <Card title="Dashboard" subtitle="Overview">Content here</Card>
// <Card footer={<Button>Action</Button>}>Simple card</Card>
// <Card onClick={handleClick}>Clickable card</Card>
