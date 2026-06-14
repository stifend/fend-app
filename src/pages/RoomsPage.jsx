// Halaman Data Kamar - Menampilkan statistik kamar berdasarkan data reservasi
import { useData } from '../context/DataContext';
import { useMemo } from 'react';
import '../modern-pages.css';

const RoomsPage = () => {
  const { reservations } = useData();

  // Hitung statistik kamar dari data reservasi
  const roomStats = useMemo(() => {
    const stats = {
      Standard: { total: 100, booked: 0, available: 100, revenue: 0 },
      Deluxe: { total: 80, booked: 0, available: 80, revenue: 0 },
      Suite: { total: 50, booked: 0, available: 50, revenue: 0 },
      Executive: { total: 20, booked: 0, available: 20, revenue: 0 }
    };

    reservations.forEach(res => {
      if (stats[res.roomType]) {
        stats[res.roomType].booked++;
        stats[res.roomType].available--;
        if (res.payment === 'Lunas') {
          stats[res.roomType].revenue += res.totalPayment;
        }
      }
    });

    return stats;
  }, [reservations]);

  const totalRooms = Object.values(roomStats).reduce((sum, stat) => sum + stat.total, 0);
  const totalBooked = Object.values(roomStats).reduce((sum, stat) => sum + stat.booked, 0);
  const totalAvailable = Object.values(roomStats).reduce((sum, stat) => sum + stat.available, 0);
  const totalRevenue = Object.values(roomStats).reduce((sum, stat) => sum + stat.revenue, 0);
  const occupancyRate = ((totalBooked / totalRooms) * 100).toFixed(1);

  const roomDetails = {
    Standard: { price: 800000, icon: '🛏️', color: '#3b82f6' },
    Deluxe: { price: 1200000, icon: '🏨', color: '#8b5cf6' },
    Suite: { price: 2500000, icon: '👑', color: '#f59e0b' },
    Executive: { price: 4000000, icon: '💎', color: '#ef4444' }
  };

  return (
    <div className="rooms-page">
      {/* Header */}
      <div className="page-header">
        <h2>🛏️ Data Kamar</h2>
        <p className="page-subtitle">Statistik dan ketersediaan kamar hotel</p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>🏨</div>
          <div className="stat-content">
            <div className="stat-value">{totalRooms}</div>
            <div className="stat-label">Total Kamar</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>✅</div>
          <div className="stat-content">
            <div className="stat-value">{totalBooked}</div>
            <div className="stat-label">Kamar Terisi</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>🔓</div>
          <div className="stat-content">
            <div className="stat-value">{totalAvailable}</div>
            <div className="stat-label">Kamar Tersedia</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce7f3' }}>📊</div>
          <div className="stat-content">
            <div className="stat-value">{occupancyRate}%</div>
            <div className="stat-label">Tingkat Hunian</div>
          </div>
        </div>
      </div>

      {/* Room Types Detail */}
      <div className="section-card">
        <h3 className="section-title">📋 Detail Tipe Kamar</h3>
        <div className="room-cards-grid">
          {Object.entries(roomStats).map(([type, stat]) => {
            const detail = roomDetails[type];
            const occupancy = ((stat.booked / stat.total) * 100).toFixed(1);
            
            return (
              <div key={type} className="room-detail-card">
                <div className="room-card-header">
                  <div className="room-icon" style={{ background: detail.color + '20', color: detail.color }}>
                    {detail.icon}
                  </div>
                  <div>
                    <h4>{type}</h4>
                    <p className="room-price">Rp {detail.price.toLocaleString('id-ID')}/malam</p>
                  </div>
                </div>

                <div className="room-stats-row">
                  <div className="room-stat-item">
                    <span className="room-stat-label">Total</span>
                    <span className="room-stat-value">{stat.total}</span>
                  </div>
                  <div className="room-stat-item">
                    <span className="room-stat-label">Terisi</span>
                    <span className="room-stat-value" style={{ color: '#16a34a' }}>{stat.booked}</span>
                  </div>
                  <div className="room-stat-item">
                    <span className="room-stat-label">Tersedia</span>
                    <span className="room-stat-value" style={{ color: '#f59e0b' }}>{stat.available}</span>
                  </div>
                </div>

                <div className="occupancy-bar">
                  <div className="occupancy-label">
                    <span>Tingkat Hunian</span>
                    <span className="occupancy-percent">{occupancy}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${occupancy}%`,
                        background: detail.color
                      }}
                    ></div>
                  </div>
                </div>

                <div className="room-revenue">
                  <span className="revenue-label">Revenue (Lunas)</span>
                  <span className="revenue-value">Rp {stat.revenue.toLocaleString('id-ID')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Revenue */}
      <div className="revenue-summary-card">
        <div className="revenue-icon">💰</div>
        <div className="revenue-content">
          <h3>Total Revenue (Pembayaran Lunas)</h3>
          <div className="revenue-amount">Rp {totalRevenue.toLocaleString('id-ID')}</div>
          <p className="revenue-note">Dari {totalBooked} kamar yang terisi</p>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
