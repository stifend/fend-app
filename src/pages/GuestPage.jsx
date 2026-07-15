// Halaman Guest Portal - Landing Page Hotel Bintang 5
// Desain: Profesional, Mewah, Bersih, dan Modern
// Warna: Putih/Krem + Navy + Emas
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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

  // Scroll to top saat ganti tab
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Data ulasan dari Supabase
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    supabase.rpc('get_all_feedback').then(({ data, error }) => {
      if (!error && data) {
        // Ambil ulasan dengan rating 4 atau 5, urutkan dari yang terbaru, batasi 3
        const goodFeedbacks = data
          .filter(f => f.rating >= 4)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        
        if (goodFeedbacks.length > 0) {
          setTestimonials(goodFeedbacks);
        }
      }
    });
  }, []);

  // Data dummy fallback jika belum ada ulasan di database
  const defaultTestimonials = [
    {
      rating: 5,
      message: "Pengalaman menginap yang luar biasa! Kamar sangat bersih dengan pemandangan kota yang memukau, pelayanan ramah dan profesional.",
      customerName: "Budi Wijaya",
      type: "Business Traveler"
    },
    {
      rating: 5,
      message: "Sangat merekomendasikan! Fasilitas spa-nya luar biasa, makanan restoran sangat enak, dan view kamar yang menakjubkan.",
      customerName: "Sarah Putri",
      type: "Family Vacation"
    },
    {
      rating: 5,
      message: "Hotel terbaik di Jakarta! Staff yang profesional dan penuh perhatian, kamar luas dan nyaman. Pasti akan kembali lagi.",
      customerName: "Ahmad Fauzi",
      type: "Conference Guest"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

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
    { icon: '🏊', name: 'Swimming Pool', desc: 'Kolam renang outdoor infinity dengan pemandangan spektakuler' },
    { icon: '🍽️', name: 'Restaurant', desc: '3 restoran fine dining dengan chef internasional berpengalaman' },
    { icon: '💪', name: 'Fitness Center', desc: 'Gym 24 jam dengan peralatan modern dan personal trainer' },
    { icon: '🧖', name: 'Spa & Wellness', desc: 'Spa premium dengan terapi tradisional dan modern' },
    { icon: '🅿️', name: 'Valet Parking', desc: 'Layanan valet parking dan area parkir luas 300 kendaraan' },
    { icon: '📶', name: 'High-Speed WiFi', desc: 'Koneksi WiFi fiber optic berkecepatan tinggi di seluruh area' }
  ];

  return (
    <div className="guest-page">
      {/* ═══ Navbar ═══ */}
      <nav className={`guest-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-logo">
              <img src="/images/hotel-logo.jpg" alt="Novotel Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <h1>Novotel Hotel</h1>
          </div>
          <div className="navbar-menu">
            <button 
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Beranda
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
              className="nav-btn-outline"
              onClick={() => navigate('/login-member')}
              style={{ marginRight: '8px' }}
            >
              Login Member
            </button>
            <button 
              className="nav-btn-primary"
              onClick={() => navigate('/login')}
            >
              Login Admin
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HOME TAB ═══ */}
      {activeTab === 'home' && (
        <>
          {/* Hero Section dengan Background Image */}
          <section className="hero-section">
            <div className="hero-bg-image"></div>
            <div className="hero-overlay"></div>
            <div className="hero-pattern"></div>
            <div className="hero-content">
              <div className="hero-badge">✦ Hotel Bintang 5 Terbaik di Jakarta</div>
              <h1 className="hero-title">
                Selamat Datang di{' '}
                <span className="gradient-text">Novotel Hotel</span>
              </h1>
              <p className="hero-subtitle">
                Rasakan keanggunan dan kemewahan sejati di jantung kota Jakarta.<br/>
                Pelayanan kelas dunia, fasilitas premium, dan pengalaman tak terlupakan menanti Anda.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-icon-box">🏨</div>
                  <div className="stat-value">250+</div>
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
                  onClick={() => navigate('/login-member')}
                >
                  <span>👤</span>
                  Login Member
                </button>
                <button 
                  className="btn-hero-secondary"
                  onClick={() => navigate('/login')}
                  style={{ border: '1px solid rgba(198,163,85,0.3)' }}
                >
                  <span>🔑</span>
                  Login Admin
                </button>
              </div>
              <div className="hero-features">
                <div className="feature-chip">✓ Check-in 24 Jam</div>
                <div className="feature-chip">✓ Free WiFi</div>
                <div className="feature-chip">✓ Valet Parking</div>
                <div className="feature-chip">✓ Breakfast Included</div>
              </div>
            </div>
          </section>

          {/* ═══ Quick Info - Menu Grid Layanan ═══ */}
          <section className="quick-info-section">
            <div className="container">
              <div className="section-title">
                <h2>Layanan Tamu Kami</h2>
                <p>Nikmati berbagai layanan premium yang kami sediakan untuk kenyamanan Anda</p>
              </div>
              <div className="info-grid">
                {/* Layanan Kamar */}
                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <div className="info-icon">🛎️</div>
                  </div>
                  <h3>Layanan Kamar</h3>
                  <p>Room service 24 jam dengan menu pilihan dari chef kami. Pesan makanan, minuman, atau keperluan lainnya langsung ke kamar Anda.</p>
                  <div className="info-stats">24/7 Available</div>
                </div>

                {/* Info Wi-Fi */}
                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <div className="info-icon">📶</div>
                  </div>
                  <h3>Info Wi-Fi</h3>
                  <p>Koneksi WiFi fiber optic berkecepatan tinggi tersedia di seluruh area hotel. Gratis untuk semua tamu tanpa batas.</p>
                  <div className="info-stats">Up to 500 Mbps</div>
                </div>

                {/* Fasilitas Spa & Gym */}
                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <div className="info-icon">🧖</div>
                  </div>
                  <h3>Spa & Gym</h3>
                  <p>Pusat kebugaran modern dan spa premium dengan terapi tradisional Bali. Relaksasi tubuh dan pikiran Anda.</p>
                  <div className="info-stats">Open 06:00 - 22:00</div>
                </div>

                {/* Panduan Wisata */}
                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <div className="info-icon">🗺️</div>
                  </div>
                  <h3>Panduan Wisata</h3>
                  <p>Tim concierge kami siap membantu merencanakan wisata terbaik di Jakarta. Tur kota, kuliner, dan budaya tersedia.</p>
                  <div className="info-stats">10+ Destinations</div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ Testimonials ═══ */}
          <section className="testimonials-section">
            <div className="container">
              <div className="section-title-white">
                <h2>Kata Mereka Tentang Kami</h2>
                <p>Testimoni nyata dari para tamu yang puas dengan layanan kami</p>
              </div>
              <div className="testimonials-grid">
                {displayTestimonials.map((testi, idx) => (
                  <div className="testimonial-card" key={idx}>
                    <div className="stars">
                      {'★ '.repeat(testi.rating).trim()}
                    </div>
                    <p className="testimonial-text">
                      "{testi.message}"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">{testi.customerName.substring(0, 2).toUpperCase()}</div>
                      <div>
                        <div className="author-name">{testi.customerName}</div>
                        <div className="author-role">{testi.type === 'Review' ? 'Tamu Hotel' : testi.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══ ROOMS TAB ═══ */}
      {activeTab === 'rooms' && (
        <section className="rooms-section">
          <div className="container">
            <div className="section-header-center">
              <h2>Tipe Kamar Kami</h2>
              <p>Pilih kamar yang sesuai dengan kebutuhan dan preferensi Anda</p>
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
                          navigate('/booking-kamar', { state: { roomType: room.type } });
                        } else {
                          // Jika belum login, redirect ke login member
                          navigate('/login-member', { state: { returnTo: '/booking-kamar', roomType: room.type } });
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

      {/* ═══ FACILITIES TAB ═══ */}
      {activeTab === 'facilities' && (
        <section className="facilities-section">
          <div className="container">
            <div className="section-header-center">
              <h2>Fasilitas Hotel</h2>
              <p>Nikmati berbagai fasilitas premium kelas dunia kami</p>
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

      {/* ═══ Footer ═══ */}
      <footer className="guest-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Novotel Hotel</h3>
              <p>Hotel bintang 5 dengan pelayanan terbaik dan fasilitas kelas dunia di Jakarta. Pengalaman menginap mewah yang tak terlupakan.</p>
            </div>
            <div className="footer-section">
              <h4>Kontak</h4>
              <p>📞 +62 21 1234 5678</p>
              <p>✉️ info@novotelhotel.com</p>
              <p>🌐 www.novotelhotel.com</p>
            </div>
            <div className="footer-section">
              <h4>Alamat</h4>
              <p>Jl. Sudirman No. 123</p>
              <p>Jakarta Pusat 10220</p>
              <p>Indonesia</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Novotel Hotel. All rights reserved. | Luxury & Elegance Since 2010</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestPage;
