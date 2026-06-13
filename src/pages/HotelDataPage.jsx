// Halaman Data Hotel - Informasi lengkap tentang hotel
import { useState } from 'react';

const HotelDataPage = () => {
  const [hotelInfo] = useState({
    name: 'Novotel Hotel & Resort',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat 10220',
    phone: '+62 21 1234 5678',
    email: 'info@novotelhotel.com',
    website: 'www.novotelhotel.com',
    rating: 4.8,
    totalRooms: 250,
    facilities: [
      { icon: '🏊', name: 'Swimming Pool', description: 'Kolam renang outdoor dengan pemandangan kota' },
      { icon: '🍽️', name: 'Restaurant', description: '3 restoran dengan berbagai pilihan menu' },
      { icon: '💪', name: 'Fitness Center', description: 'Gym 24 jam dengan peralatan modern' },
      { icon: '🅿️', name: 'Parking', description: 'Parkir gratis untuk 300 kendaraan' },
      { icon: '📶', name: 'Free WiFi', description: 'WiFi berkecepatan tinggi di seluruh area' },
      { icon: '🛎️', name: 'Room Service', description: 'Layanan kamar 24 jam' },
      { icon: '🧖', name: 'Spa & Wellness', description: 'Spa dan pusat kesehatan lengkap' },
      { icon: '🎯', name: 'Meeting Rooms', description: '10 ruang meeting dengan kapasitas hingga 500 orang' }
    ],
    roomTypes: [
      { type: 'Standard', count: 100, price: 'Rp 800.000', features: ['Single/Twin Bed', 'AC', 'TV', 'WiFi'] },
      { type: 'Deluxe', count: 80, price: 'Rp 1.200.000', features: ['Queen Bed', 'City View', 'Mini Bar', 'Bathtub'] },
      { type: 'Suite', count: 50, price: 'Rp 2.500.000', features: ['King Bed', 'Living Room', 'Balcony', 'Jacuzzi'] },
      { type: 'Executive', count: 20, price: 'Rp 4.000.000', features: ['King Bed', 'Ocean View', 'Butler Service', 'Private Pool'] }
    ]
  });

  return (
    <div className="hotel-data-page">
      {/* Header */}
      <div className="page-header">
        <h2>🏨 Data Hotel</h2>
        <p className="page-subtitle">Informasi lengkap tentang hotel dan fasilitas</p>
      </div>

      {/* Hotel Info Card */}
      <div className="hotel-info-card">
        <div className="hotel-info-header">
          <div className="hotel-logo">🏨</div>
          <div className="hotel-main-info">
            <h3>{hotelInfo.name}</h3>
            <div className="hotel-rating">
              <span className="rating-stars">⭐⭐⭐⭐⭐</span>
              <span className="rating-value">{hotelInfo.rating}/5.0</span>
            </div>
          </div>
        </div>

        <div className="hotel-contact-grid">
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <div>
              <div className="contact-label">Alamat</div>
              <div className="contact-value">{hotelInfo.address}</div>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div>
              <div className="contact-label">Telepon</div>
              <div className="contact-value">{hotelInfo.phone}</div>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <div>
              <div className="contact-label">Email</div>
              <div className="contact-value">{hotelInfo.email}</div>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🌐</span>
            <div>
              <div className="contact-label">Website</div>
              <div className="contact-value">{hotelInfo.website}</div>
            </div>
          </div>
        </div>

        <div className="hotel-stats">
          <div className="stat-box">
            <div className="stat-value">{hotelInfo.totalRooms}</div>
            <div className="stat-label">Total Kamar</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{hotelInfo.facilities.length}</div>
            <div className="stat-label">Fasilitas</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{hotelInfo.roomTypes.length}</div>
            <div className="stat-label">Tipe Kamar</div>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="section-card">
        <h3 className="section-title">🎯 Fasilitas Hotel</h3>
        <div className="facilities-grid">
          {hotelInfo.facilities.map((facility, index) => (
            <div key={index} className="facility-card">
              <div className="facility-icon">{facility.icon}</div>
              <div className="facility-info">
                <h4>{facility.name}</h4>
                <p>{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Types Section */}
      <div className="section-card">
        <h3 className="section-title">🛏️ Tipe Kamar</h3>
        <div className="room-types-grid">
          {hotelInfo.roomTypes.map((room, index) => (
            <div key={index} className="room-type-card">
              <div className="room-type-header">
                <h4>{room.type}</h4>
                <span className="room-count">{room.count} kamar</span>
              </div>
              <div className="room-price">{room.price}<span>/malam</span></div>
              <div className="room-features">
                {room.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">✓ {feature}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDataPage;
