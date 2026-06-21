// Halaman Guest - Landing Page untuk pengunjung yang belum login
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../guest-page.css';

const GuestPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect untuk navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Data dummy untuk room types
  const roomTypes = [
    {
      type: 'Standard',
      price: 800000,
      image: '🛏️',
      features: ['Single/Twin Bed', 'AC', 'TV', 'WiFi', '20m²'],
      description: 'Kamar nyaman dengan fasilitas standar untuk pengalaman menginap yang menyenangkan'
    },
    {
      type: 'Deluxe',
      price: 1200000,
      image: '🏨',
      features: ['Queen Bed', 'City View', 'Mini Bar', 'Bathtub', '30m²'],
      description: 'Kamar luas dengan pemandangan kota dan fasilitas premium'
    },
    {
      type: 'Suite',
      price: 2500000,
      image: '👑',
      features: ['King Bed', 'Living Room', 'Balcony', 'Jacuzzi', '50m²'],
      description: 'Suite mewah dengan ruang tamu terpisah dan fasilitas eksklusif'
    },
    {
      type: 'Executive',
      price: 4000000,
      image: '💎',
      features: ['King Bed', 'Ocean View', 'Butler Service', 'Private Pool', '80m²'],
      description: 'Kamar super premium dengan layanan butler pribadi dan kolam renang privat'
    }
  ];

  // Data fasilitas hotel
  const facilities = [
    { icon: '🏊', name: 'Swimming Pool', desc: 'Kolam renang outdoor 24 jam' },
    { icon: '🍽️', name: 'Restaurant', desc: '3 restoran dengan berbagai menu' },
    { icon: '💪', name: 'Fitness Center', desc: 'Gym dengan peralatan modern' },
    { icon: '🧖', name: 'Spa & Wellness', desc: 'Spa dan pusat kesehatan' },
    { icon: '🅿️', name: 'Free Parking', desc: 'Parkir gratis 300 kendaraan' },
    { icon: '📶', name: 'Free WiFi', desc: 'WiFi berkecepatan tinggi' }
  ];

  return (
    <div className="guest-page">
      {/* Navbar */}
      <nav className={`guest-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-logo">🏨</div>
            <h1>Novotel Hotel</h1>
          </div>
          <div className="navbar-menu">
            <button 
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
            <button 
              className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              Kamar
            </button>
            <button 
              className={`nav-link ${activeTab === 'facilities' ? 'active' : ''}`}
              onClick={() => setActiveTab('facilities')}
            >
              Fasilitas
            </button>
            <button 
              className="nav-btn-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {activeTab === 'home' && (
        <>
          <section className="hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-pattern"></div>
            <div className="hero-content">
              <div className="hero-badge">✨ Hotel Bintang 5 Terbaik di Jakarta</div>
              <h1 className="hero-title">
                Pengalaman Menginap <span className="gradient-text">Tak Terlupakan</span>
              </h1>
              <p className="hero-subtitle">
                Nikmati kemewahan, kenyamanan, dan pelayanan kelas dunia di jantung kota Jakarta.<br/>
                Dilengkapi fasilitas modern dan pemandangan spektakuler.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-icon-box">🏨</div>
                  <div className="stat-value">250</div>
                  <div className="stat-label">Kamar Premium</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-icon-box">⭐</div>
                  <div className="stat-value">4.9</div>
                  <div className="stat-label">Rating Tamu</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-icon-box">👥</div>
                  <div className="stat-value">15K+</div>
                  <div className="stat-label">Tamu Puas</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-icon-box">🏆</div>
                  <div className="stat-value">20+</div>
                  <div className="stat-label">Penghargaan</div>
                </div>
              </div>
              <div className="hero-buttons">
                <button 
                  className="btn-hero-primary"
                  onClick={() => setActiveTab('rooms')}
                >
                  <span>🔍</span>
                  Jelajahi Kamar
                </button>
                <button 
                  className="btn-hero-secondary"
                  onClick={() => navigate('/login')}
                >
                  <span>👤</span>
                  Login
                </button>
              </div>
              <div className="hero-features">
                <div className="feature-chip">✓ Check-in 24 Jam</div>
                <div className="feature-chip">✓ Free WiFi</div>
                <div className="feature-chip">✓ Parkir Gratis</div>
                <div className="feature-chip">✓ Breakfast Included</div>
              </div>
            </div>
          </section>

          {/* Quick Info */}
          <section className="quick-info-section">
            <div className="container">
              <div className="section-title">
                <h2>Mengapa Memilih Kami?</h2>
                <p>Pengalaman menginap terbaik dengan berbagai keunggulan</p>
              </div>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <div className="info-icon">📍</div>
                  </div>
                  <h3>Lokasi Strategis</h3>
                  <p>Terletak di Jl. Sudirman, pusat bisnis Jakarta dengan akses mudah ke berbagai destinasi</p>
                  <div className="info-stats">15 menit ke Bandara</div>
                </div>
                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <div className="info-icon">🕐</div>
                  </div>
                  <h3>Layanan 24/7</h3>
                  <p>Tim front desk profesional siap melayani Anda kapan saja dengan ramah dan responsif</p>
                  <div className="info-stats">Always Available</div>
                </div>
                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <div className="info-icon">✨</div>
                  </div>
                  <h3>Member Eksklusif</h3>
                  <p>Dapatkan benefit spesial, diskon hingga 15%, dan rewards point setiap pemesanan</p>
                  <div className="info-stats">Save up to 15%</div>
                </div>
                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <div className="info-icon">🍽️</div>
                  </div>
                  <h3>Kuliner Premium</h3>
                  <p>3 restoran dengan chef berpengalaman menyajikan masakan lokal dan internasional</p>
                  <div className="info-stats">Michelin Rated</div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="testimonials-section">
            <div className="container">
              <div className="section-title-white">
                <h2>Kata Mereka Tentang Kami</h2>
                <p>Testimoni nyata dari para tamu yang puas</p>
              </div>
              <div className="testimonials-grid">
                <div className="testimonial-card">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <p className="testimonial-text">
                    "Pengalaman menginap yang luar biasa! Kamar sangat bersih, pelayanan ramah, dan lokasi strategis."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">BW</div>
                    <div>
                      <div className="author-name">Budi Wijaya</div>
                      <div className="author-role">Business Traveler</div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <p className="testimonial-text">
                    "Sangat merekomendasikan! Fasilitas lengkap, makanan enak, dan view kamar yang menakjubkan."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">SP</div>
                    <div>
                      <div className="author-name">Sarah Putri</div>
                      <div className="author-role">Family Vacation</div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <p className="testimonial-text">
                    "Hotel terbaik di Jakarta! Staff profesional, kamar luas dan nyaman. Pasti akan kembali lagi."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">AF</div>
                    <div>
                      <div className="author-name">Ahmad Fauzi</div>
                      <div className="author-role">Conference Guest</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Rooms Section */}
      {activeTab === 'rooms' && (
        <section className="rooms-section">
          <div className="container">
            <div className="section-header-center">
              <h2>Tipe Kamar Kami</h2>
              <p>Pilih kamar yang sesuai dengan kebutuhan Anda</p>
            </div>
            <div className="rooms-grid">
              {roomTypes.map((room, index) => (
                <div key={index} className="room-card-guest">
                  <div className="room-card-image">{room.image}</div>
                  <div className="room-card-content">
                    <h3>{room.type}</h3>
                    <p className="room-description">{room.description}</p>
                    <div className="room-price">
                      <span className="price-label">Mulai dari</span>
                      <span className="price-value">Rp {room.price.toLocaleString('id-ID')}</span>
                      <span className="price-period">/malam</span>
                    </div>
                    <div className="room-features">
                      {room.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">✓ {feature}</span>
                      ))}
                    </div>
                    <button 
                      className="btn-book"
                      onClick={() => {
                        // Cek apakah member sudah login
                        const memberToken = localStorage.getItem('memberToken');
                        if (memberToken) {
                          // Jika sudah login, redirect ke booking dengan room type
                          navigate('/booking', { state: { roomType: room.type } });
                        } else {
                          // Jika belum login, redirect ke login
                          navigate('/login', { state: { returnTo: '/booking', roomType: room.type } });
                        }
                      }}
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Facilities Section */}
      {activeTab === 'facilities' && (
        <section className="facilities-section">
          <div className="container">
            <div className="section-header-center">
              <h2>Fasilitas Hotel</h2>
              <p>Nikmati berbagai fasilitas premium kami</p>
            </div>
            <div className="facilities-grid">
              {facilities.map((facility, index) => (
                <div key={index} className="facility-card-guest">
                  <div className="facility-icon-large">{facility.icon}</div>
                  <h3>{facility.name}</h3>
                  <p>{facility.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="guest-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Novotel Hotel</h3>
              <p>Hotel bintang 5 dengan pelayanan terbaik di Jakarta</p>
            </div>
            <div className="footer-section">
              <h4>Kontak</h4>
              <p>📞 +62 21 1234 5678</p>
              <p>✉️ info@novotelhotel.com</p>
            </div>
            <div className="footer-section">
              <h4>Alamat</h4>
              <p>Jl. Sudirman No. 123</p>
              <p>Jakarta Pusat 10220</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Novotel Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestPage;
