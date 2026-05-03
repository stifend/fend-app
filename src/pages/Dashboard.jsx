import React from 'react';

const Dashboard = ({ onViewReservations }) => {
  const reservations = [
    { id: 'P001', name: 'Rina Amelia', reservation: 'RSV-7684', payment: 'Lunas' },
    { id: 'P002', name: 'Andi Putra', reservation: 'RSV-7685', payment: 'Pending' },
    { id: 'P003', name: 'Siti Rahma', reservation: 'RSV-7686', payment: 'Lunas' },
    { id: 'P004', name: 'Budi Santoso', reservation: 'RSV-7687', payment: 'Belum Bayar' },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-top">
        <div className="dashboard-metrics">
          <article className="dashboard-card">
            <p className="card-label">Total Bookings</p>
            <h3 className="card-value">3,452</h3>
            <p className="card-note">+12% vs last month</p>
          </article>
          <article className="dashboard-card">
            <p className="card-label">Active Listings</p>
            <h3 className="card-value">1,268</h3>
            <p className="card-note">+5% vs last month</p>
          </article>
          <article className="dashboard-card">
            <p className="card-label">Monthly Revenue</p>
            <h3 className="card-value">$284,521</h3>
            <p className="card-note">+12%</p>
          </article>
          <article className="dashboard-card">
            <p className="card-label">User Signups</p>
            <h3 className="card-value">824</h3>
            <p className="card-note">+12%</p>
          </article>
        </div>

        <article className="dashboard-stat-card">
          <div className="stat-header">
            <div>
              <p className="card-label">Revenue Stat</p>
              <h3 className="stat-title">$250,000.50</h3>
            </div>
            <div className="stat-badge">Monthly</div>
          </div>

          <div className="chart-row">
            <div className="chart-col">
              <div className="chart-bar" style={{ height: '70%' }} />
              <span className="chart-label">Sat</span>
            </div>
            <div className="chart-col">
              <div className="chart-bar tall" style={{ height: '85%' }} />
              <span className="chart-label">Sun</span>
            </div>
            <div className="chart-col">
              <div className="chart-bar tall" style={{ height: '96%' }} />
              <span className="chart-label">Mon</span>
            </div>
            <div className="chart-col">
              <div className="chart-bar tall" style={{ height: '80%' }} />
              <span className="chart-label">Tue</span>
            </div>
            <div className="chart-col">
              <div className="chart-bar" style={{ height: '75%' }} />
              <span className="chart-label">Wed</span>
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-lower">
        <article className="dashboard-reservasi-card">
          <div className="card-heading">
            <h3>Daftar Reservasi</h3>
          </div>
          <div className="reservasi-grid">
            {reservations.map((item) => (
              <div
                key={item.id}
                className="reservasi-grid-item"
                onClick={() => onViewReservations && onViewReservations()}
                style={{ cursor: 'pointer' }}
              >
                <div className="reservasi-grid-header">
                  <span className="reservasi-id">{item.id}</span>
                  <span className={`reservasi-status ${item.payment === 'Lunas' ? 'paid' : 'unpaid'}`}>
                    {item.payment}
                  </span>
                </div>
                <div className="reservasi-grid-detail">
                  <p className="reservasi-name">{item.name}</p>
                  <p className="reservasi-code">{item.reservation}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-table-card">
          <div className="card-heading">
            <h3>Recent Booking</h3>
            <button type="button">View All</button>
          </div>
          <div className="table-list">
            <div className="table-header">
              <span>Booking ID</span>
              <span>Guest</span>
              <span>Property</span>
            </div>
            {[
              ['BK-5782', 'Emma Thompson', 'Oceview Villa'],
              ['BK-5782', 'James Wilson', 'Skyview Hotel'],
              ['BK-5782', 'Sarah Miller', 'Downtown Apartm'],
              ['BK-5782', 'Michael Brown', 'Luxury Penthouse'],
            ].map(([id, guest, property]) => (
              <div key={`${id}-${guest}`} className="table-row">
                <div>{id}</div>
                <div>{guest}</div>
                <div>{property}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-performance-card">
          <div className="card-heading">
            <h3>Property Performance</h3>
            <button type="button">View All</button>
          </div>
          <div className="performance-list">
            {[
              { type: 'Hotels', total: '1,642', revenue: '$184,350' },
              { type: 'Apartments', total: '1,248', revenue: '$92,670' },
              { type: 'Vacation Homes', total: '652', revenue: '$107,501' },
            ].map((row) => (
              <div key={row.type} className="performance-item">
                <div>
                  <p className="performance-title">{row.type}</p>
                  <p className="performance-value">{row.total}</p>
                </div>
                <p className="performance-value">{row.revenue}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};


export default Dashboard;
