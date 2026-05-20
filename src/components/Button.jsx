// ========================================
// 🔘 BUTTON COMPONENT
// ========================================
// Komponen button reusable dengan berbagai variant dan size
// 
// PROPS:
// - variant: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
// - size: 'small' | 'medium' | 'large'
// - onClick: function
// - disabled: boolean
// - type: 'button' | 'submit' | 'reset'
// - className: string
//
// CONTOH PENGGUNAAN:
// import { Button } from './components';
// <Button variant="primary" size="medium" onClick={handleClick}>Click Me</Button>
// <Button variant="danger" size="small">Delete</Button>
// ========================================

const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  // Base class untuk button
  const baseClass = 'btn-component';
  
  // Variant classes: primary, secondary, danger, success, outline
  const variantClass = `btn-${variant}`;
  
  // Size classes: small, medium, large
  const sizeClass = `btn-${size}`;
  
  // Disabled class
  const disabledClass = disabled ? 'btn-disabled' : '';
  
  // Gabungkan semua classes
  const buttonClass = `${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

// Contoh penggunaan:
// <Button variant="primary" size="medium" onClick={handleClick}>Click Me</Button>
// <Button variant="danger" size="small">Delete</Button>
// <Button variant="outline" disabled>Disabled</Button>
