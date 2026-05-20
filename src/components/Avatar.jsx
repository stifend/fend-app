// ========================================
// 👤 AVATAR COMPONENT
// ========================================
// Komponen avatar reusable untuk profile picture
//
// PROPS:
// - src: string (URL gambar)
// - alt: string
// - name: string (untuk initial)
// - size: 'small' | 'medium' | 'large' | 'xlarge'
// - shape: 'circle' | 'square' | 'rounded'
// - className: string
//
// CONTOH PENGGUNAAN:
// import { Avatar } from './components';
// <Avatar src="/profile.jpg" alt="User" size="large" />
// <Avatar name="John Doe" size="medium" />
// <Avatar size="small" shape="square" />
// ========================================

const Avatar = ({
  src,
  alt = 'Avatar',
  name,
  size = 'medium',
  shape = 'circle',
  className = '',
  ...props
}) => {
  // Size classes: small (32px), medium (40px), large (56px), xlarge (80px)
  const sizeClass = `avatar-${size}`;
  
  // Shape classes: circle, square, rounded
  const shapeClass = `avatar-${shape}`;
  
  // Gabungkan classes
  const avatarClass = `avatar-component ${sizeClass} ${shapeClass} ${className}`.trim();

  // Jika ada src, tampilkan gambar
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={avatarClass}
        {...props}
      />
    );
  }

  // Jika ada name, tampilkan initial (huruf pertama)
  if (name) {
    const initial = name.charAt(0).toUpperCase();
    return (
      <div className={`${avatarClass} avatar-initial`} {...props}>
        {initial}
      </div>
    );
  }

  // Default: tampilkan icon user
  return (
    <div className={`${avatarClass} avatar-default`} {...props}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
  );
};

export default Avatar;

// Contoh penggunaan:
// <Avatar src="/profile.jpg" alt="User" size="large" />
// <Avatar name="John Doe" size="medium" />
// <Avatar size="small" shape="square" />
