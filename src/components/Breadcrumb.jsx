// ========================================
// 🍞 BREADCRUMB COMPONENT
// ========================================
// Komponen breadcrumb reusable untuk navigasi path
//
// PROPS:
// - items: array of { label, path, icon, disabled }
// - separator: string
// - className: string
//
// CONTOH PENGGUNAAN:
// import { Breadcrumb } from './components';
// const items = [
//   { label: 'Home', path: '/', icon: '🏠' },
//   { label: 'Reservasi', path: '/reservations' },
//   { label: 'Detail', path: '/reservations/1' }
// ];
// <Breadcrumb items={items} separator=">" />
// ========================================

import { useNavigate } from 'react-router-dom';

const Breadcrumb = ({
  items = [],
  separator = '/',
  className = '',
  ...props
}) => {
  const navigate = useNavigate();

  // Handle breadcrumb click
  const handleClick = (item) => {
    if (item.path && !item.disabled) {
      navigate(item.path);
    }
  };

  return (
    <nav className={`breadcrumb-component ${className}`.trim()} {...props}>
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="breadcrumb-item">
              {/* Breadcrumb Link */}
              <button
                className={`breadcrumb-link ${isLast ? 'breadcrumb-current' : ''} ${item.disabled ? 'breadcrumb-disabled' : ''}`.trim()}
                onClick={() => handleClick(item)}
                disabled={isLast || item.disabled}
              >
                {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                <span className="breadcrumb-label">{item.label}</span>
              </button>
              
              {/* Separator (kecuali item terakhir) */}
              {!isLast && (
                <span className="breadcrumb-separator">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

// Contoh penggunaan:
// const items = [
//   { label: 'Home', path: '/', icon: '🏠' },
//   { label: 'Reservasi', path: '/reservations' },
//   { label: 'Detail', path: '/reservations/1' }
// ];
// <Breadcrumb items={items} separator=">" />
