import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { reservations, customers } = useData();

  return (
    <div className="dashboard-page">
      <section className="dashboard-top">
        <div className="dashboard-metrics">
          <article className="dashboard-card">
            <p className="card-label">📊 Total Bookings</p>
            <h3 className="card-value">{reservations.length}</h3>
          </article>
          <article className="dashboard-card">
            <p className="card-label">👥 Data Pelanggan</p>
            <h3 className="card-value">{customers.length}</h3>
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
            {reservations.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="reservasi-grid-item"
                onClick={() => navigate('/reservations')}
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
            <button type="button" onClick={() => navigate('/reservations')}>View All</button>
          </div>
          <div className="table-list">
            <div className="table-header">
              <span>Booking ID</span>
              <span>Guest</span>
              <span>Property</span>
            </div>
            {reservations.slice(0, 4).map((item) => (
              <div key={item.id} className="table-row">
                <div>{item.reservation}</div>
                <div>{item.name}</div>
                <div>Hotel Room</div>
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
