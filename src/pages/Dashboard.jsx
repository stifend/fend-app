// Import library React Router untuk navigasi
import { useNavigate } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';

const Dashboard = () => {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  
  // Ambil data reservasi dan customer dari Context API
  const { reservations, customers } = useData();

  // Hitung total revenue berdasarkan jumlah reservasi
  const totalRevenue = reservations.length * 1.5;
  const lumasCount = reservations.filter(r => r.payment === 'Lunas').length;
  const revenueIncrease = 2.1;

  // Data untuk Order Time Chart (hari dari 1-7 December 2020)
  const orderTimeData = [
    { day: '1', value: 45 },
    { day: '2', value: 52 },
    { day: '3', value: 48 },
    { day: '4', value: 65 },
    { day: '5', value: 58 },
    { day: '6', value: 70 }
  ];

  // Data untuk Rating
  const ratingData = [
    { label: 'Hygiene', value: 65 },
    { label: 'Food Taste', value: 85 },
    { label: 'Packaging', value: 92 }
  ];

  // Data untuk Most Ordered (Top booking properties)
  const mostOrdered = [
    { name: 'Suite Room', price: 'IDR 450.000', count: 1 },
    { name: 'Double Room', price: 'IDR 375.000', count: 1 },
    { name: 'Standard Room', price: 'IDR 300.000', count: 1 },
    { name: 'Deluxe Room', price: 'IDR 525.000', count: 1 }
  ];

  return (
    <div className="dashboard-page">
      {/* ========== SECTION 1: Revenue + Order Time ========== */}
      <section className="dashboard-top">
        {/* LEFT: Revenue Card */}
        <div className="dashboard-revenue-section">
          <article className="dashboard-card dashboard-revenue-card">
            <p className="card-label">Revenue</p>
            <div className="revenue-header">
              <h3 className="card-value">IDR {(totalRevenue * 1000000).toLocaleString('id-ID')}</h3>
              <span className={`revenue-change ${revenueIncrease > 0 ? 'positive' : 'negative'}`}>
                <span className="change-icon">↑</span> {revenueIncrease}% vs last week
              </span>
            </div>
            <p className="revenue-period">Sales from 1-8 Dec, 2020</p>
          </article>

          {/* Order Time Card */}
          <article className="dashboard-card dashboard-order-time-card">
            <div className="card-heading">
              <h3>Order Time</h3>
              <span className="order-count">{reservations.length} orders</span>
            </div>
            <div className="order-time-chart">
              {orderTimeData.map((data, idx) => (
                <div key={idx} className="order-bar-wrapper">
                  <div className="order-bar" style={{ height: `${data.value}%` }} />
                  <span className="order-day">{data.day}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* RIGHT: Order Stats */}
        <article className="dashboard-card dashboard-order-stats-card">
          <div className="order-stats-header">
            <h3>Order</h3>
            <div className="order-stat-circle" style={{ 
              background: `conic-gradient(#5b5dd7 0deg ${(reservations.length / 10) * 360}deg, #e5e7eb ${(reservations.length / 10) * 360}deg)`
            }}>
              <div className="order-stat-inner">
                <span className="order-stat-value">{reservations.length * 500}</span>
              </div>
            </div>
          </div>
          <div className="order-time-period">
            <span className="period-label">Last 6 days</span>
            <span className="period-date">Last Week</span>
          </div>
          <div className="chart-line-simple">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none">
              <polyline points="0,30 20,15 40,25 60,10 80,20 100,5" fill="none" stroke="#5b5dd7" strokeWidth="2" />
            </svg>
          </div>
        </article>
      </section>

      {/* ========== SECTION 2: Ratings + Most Ordered ========== */}
      <section className="dashboard-middle">
        {/* LEFT: Your Rating */}
        <article className="dashboard-card dashboard-rating-card">
          <div className="card-heading">
            <h3>Rating</h3>
          </div>
          <p className="rating-description">Rating Hotel saya</p>
          <div className="rating-circles">
            {ratingData.map((item, idx) => (
              <div key={idx} className="rating-item">
                <div className="rating-circle" style={{
                  background: `conic-gradient(#5b5dd7 0deg ${(item.value / 100) * 360}deg, #e5e7eb ${(item.value / 100) * 360}deg)`
                }}>
                  <div className="rating-circle-inner">
                    <span className="rating-percentage">{item.value}%</span>
                  </div>
                </div>
                <p className="rating-label">{item.label}</p>
              </div>
            ))}
          </div>
        </article>

        {/* RIGHT: Most Ordered */}
        <article className="dashboard-card dashboard-most-ordered-card">
          <div className="card-heading">
            <h3>Kamar Hotel</h3>
          </div>
          <p className="most-ordered-description">Kamar yang paling sering dipesan</p>
          <div className="most-ordered-list">
            {mostOrdered.map((item, idx) => (
              <div key={idx} className="most-ordered-item">
                <div className="most-ordered-avatar">👤</div>
                <div className="most-ordered-info">
                  <p className="most-ordered-name">{item.name}</p>
                  <p className="most-ordered-price">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* ========== SECTION 3: Recent Booking ========== */}
      <section className="dashboard-lower">
        <article className="dashboard-table-card">
          <div className="card-heading">
            <h3>Recent Booking</h3>
            <button type="button" onClick={() => navigate('/reservations')}>View All</button>
          </div>
          
          <div className="table-list">
            {/* Header Table */}
            <div className="table-header">
              <span>Booking ID</span>
              <span>Guest</span>
              <span>Property</span>
            </div>
            
            {/* Body Table: Loop reservasi */}
            {reservations.slice(0, 4).map((item) => (
              <div key={item.id} className="table-row">
                <div>{item.reservation}</div>
                <div>{item.name}</div>
                <div>Hotel Room</div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default Dashboard;
