// ========================================
// 📋 LOADING COMPONENT
// ========================================
// Komponen loading reusable dengan animasi spinner
//
// PROPS:
// - size: 'small' | 'medium' | 'large' (default: 'medium')
// - text: string (default: 'Loading...')
// - fullscreen: boolean (default: false)
// - color: string (default: '#3b82f6')
//
// CONTOH PENGGUNAAN:
// import { Loading } from './components';
// <Loading size="large" text="Memuat data..." />
// ========================================

import { useEffect, useState } from 'react';

const Loading = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullscreen = false,
  color = '#3b82f6'
}) => {
  // ========================================
  // 📌 TUGAS REACT HOOKS - useState
  // ========================================
  // HOOK: useState
  // FILE: src/components/Loading.jsx
  // LINE: 27
  // FUNGSI: Menyimpan status animasi loading (fade in effect)
  // ========================================
  const [isVisible, setIsVisible] = useState(false);

  // ========================================
  // 📌 TUGAS REACT HOOKS - useEffect
  // ========================================
  // HOOK: useEffect
  // FILE: src/components/Loading.jsx
  // LINE: 32-40
  // FUNGSI: Fade in animation saat component mount
  // DEPENDENCY: [] (empty array = run sekali saat mount)
  // KAPAN JALAN: Sekali saat Loading component pertama kali render
  // ========================================
  useEffect(() => {
    // Set timeout untuk smooth fade in animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50); // Delay 50ms untuk smooth transition

    // Cleanup function: clear timeout saat component unmount
    return () => clearTimeout(timer);
  }, []); // Empty dependency array = run once on mount

  // Size mapping untuk spinner
  const sizeClasses = {
    small: 'loading-small',
    medium: 'loading-medium',
    large: 'loading-large'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div 
      className={`loading-container ${fullscreen ? 'loading-fullscreen' : ''} ${isVisible ? 'loading-visible' : ''}`.trim()}
      style={{ '--loading-color': color }}
    >
      <div className="loading-content">
        {/* Spinner Animation */}
        <div className={`loading-spinner ${sizeClass}`.trim()}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        
        {/* Loading Text */}
        {text && <p className="loading-text">{text}</p>}
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        /* Container */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }

        .loading-container.loading-visible {
          opacity: 1;
        }

        .loading-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          z-index: 9999;
          padding: 0;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        /* Spinner */
        .loading-spinner {
          position: relative;
          display: inline-block;
        }

        .loading-small {
          width: 40px;
          height: 40px;
        }

        .loading-medium {
          width: 64px;
          height: 64px;
        }

        .loading-large {
          width: 80px;
          height: 80px;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: var(--loading-color, #3b82f6);
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }

        .spinner-ring:nth-child(1) {
          animation-delay: -0.45s;
        }

        .spinner-ring:nth-child(2) {
          animation-delay: -0.3s;
        }

        .spinner-ring:nth-child(3) {
          animation-delay: -0.15s;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Loading Text */
        .loading-text {
          margin: 0;
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 500;
          text-align: center;
        }

        .loading-small + .loading-text {
          font-size: 0.85rem;
        }

        .loading-large + .loading-text {
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
};

export default Loading;

// ========================================
// CONTOH PENGGUNAAN DI PAGES:
// ========================================
//
// 1. Simple loading:
//    <Loading />
//
// 2. Custom text & size:
//    <Loading size="large" text="Memuat data customer..." />
//
// 3. Fullscreen loading:
//    {isLoading && <Loading fullscreen text="Sedang memuat..." />}
//
// 4. Custom color:
//    <Loading color="#10b981" text="Berhasil!" />
//
// ========================================
