// ========================================
// 🪟 MODAL COMPONENT
// ========================================
// Komponen modal reusable untuk popup/dialog
//
// PROPS:
// - isOpen: boolean (required)
// - onClose: function (required)
// - title: string
// - children: ReactNode
// - footer: ReactNode
// - size: 'small' | 'medium' | 'large' | 'full'
// - closeOnOverlayClick: boolean
//
// CONTOH PENGGUNAAN:
// import { Modal } from './components';
// <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Edit Data">
//   <p>Modal content here</p>
// </Modal>
// ========================================

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  className = '',
  closeOnOverlayClick = true,
  ...props
}) => {
  // Jika modal tidak open, return null
  if (!isOpen) return null;

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size classes: small, medium, large, full
  const sizeClass = `modal-${size}`;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content ${sizeClass} ${className}`.trim()} {...props}>
        {/* Modal Header */}
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button 
              className="modal-close-btn" 
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Modal Body */}
        <div className="modal-body">
          {children}
        </div>
        
        {/* Modal Footer (opsional) */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

// Contoh penggunaan:
// <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Edit Data">
//   <p>Modal content here</p>
// </Modal>
