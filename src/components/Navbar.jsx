// ========================================
// 🧭 NAVBAR COMPONENT
// ========================================
// Komponen navbar reusable untuk navigation bar horizontal
//
// PROPS:
// - brand: ReactNode
// - links: array of { label, path, icon, badge, disabled }
// - actions: ReactNode
// - className: string
//
// CONTOH PENGGUNAAN:
// import { Navbar } from './components';
// const links = [
//   { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
//   { label: 'Reservasi', path: '/reservations', badge: '5' }
// ];
// <Navbar brand={<Logo />} links={links} actions={<Button>Logout</Button>} />
// ========================================

import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({
  brand,
  links = [],
  actions,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar-component ${className}`.trim()} {...props}>
      {/* Brand / Logo */}
      {brand && (
        <div className="navbar-brand" onClick={() => navigate('/')}>
          {brand}
        </div>
      )}

      {/* Navigation Links */}
      <div className="navbar-links">
        {links.map((link, index) => (
          <button
            key={index}
            className={`navbar-link ${isActive(link.path) ? 'navbar-link-active' : ''}`.trim()}
            onClick={() => navigate(link.path)}
            disabled={link.disabled}
          >
            {link.icon && <span className="navbar-link-icon">{link.icon}</span>}
            <span className="navbar-link-label">{link.label}</span>
            {link.badge && <span className="navbar-link-badge">{link.badge}</span>}
          </button>
        ))}
      </div>

      {/* Actions (right side) */}
      {actions && (
        <div className="navbar-actions">
          {actions}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// Contoh penggunaan:
// const links = [
//   { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
//   { label: 'Reservasi', path: '/reservations', badge: '5' },
//   { label: 'Customer', path: '/customers' }
// ];
// <Navbar 
//   brand={<Logo />} 
//   links={links} 
//   actions={<Button onClick={logout}>Logout</Button>}
// />
