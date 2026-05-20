// ========================================
// ⏳ LOADER COMPONENT
// ========================================
// Komponen loader reusable untuk loading indicator
//
// PROPS:
// - size: 'small' | 'medium' | 'large'
// - type: 'spinner' | 'dots' | 'pulse'
// - text: string
// - fullScreen: boolean
// - className: string
//
// CONTOH PENGGUNAAN:
// import { Loader } from './components';
// <Loader size="large" type="spinner" text="Loading..." />
// <Loader type="dots" />
// <Loader fullScreen text="Mohon tunggu..." />
// ========================================

const Loader = ({
  size = 'medium',
  type = 'spinner',
  text,
  fullScreen = false,
  className = '',
  ...props
}) => {
  // Size classes: small, medium, large
  const sizeClass = `loader-${size}`;
  
  // Type classes: spinner, dots, pulse
  const typeClass = `loader-${type}`;

  // Loader content
  const loaderContent = (
    <div className={`loader-component ${sizeClass} ${typeClass} ${className}`.trim()} {...props}>
      {/* Spinner Type */}
      {type === 'spinner' && (
        <div className="loader-spinner">
          <div className="spinner-circle"></div>
        </div>
      )}

      {/* Dots Type */}
      {type === 'dots' && (
        <div className="loader-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}

      {/* Pulse Type */}
      {type === 'pulse' && (
        <div className="loader-pulse">
          <div className="pulse-circle"></div>
        </div>
      )}

      {/* Loading Text */}
      {text && <div className="loader-text">{text}</div>}
    </div>
  );

  // Jika fullScreen, wrap dengan overlay
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;

// Contoh penggunaan:
// <Loader size="large" type="spinner" text="Loading..." />
// <Loader type="dots" />
// <Loader fullScreen text="Mohon tunggu..." />
