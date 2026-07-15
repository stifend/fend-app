// Halaman Laporan Transaksi - Laporan lengkap transaksi hotel
import { useData } from '../context/DataContext';
import { useMemo, useState } from 'react';
import '../payment-report-pages.css';

const ReportsPage = () => {
  const { reservations, customers } = useData();
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Hitung statistik transaksi
  const transactionStats = useMemo(() => {
    const totalRevenue = reservations.reduce((sum, res) => sum + res.totalPayment, 0);
    const paidRevenue = reservations.filter(r => r.payment === 'Lunas').reduce((sum, res) => sum + res.totalPayment, 0);
    const pendingRevenue = reservations.filter(r => r.payment === 'Pending').reduce((sum, res) => sum + res.totalPayment, 0);
    const unpaidRevenue = reservations.filter(r => r.payment === 'Belum Bayar').reduce((sum, res) => sum + res.totalPayment, 0);

    // Revenue per room type
    const revenueByRoomType = {};
    reservations.forEach(res => {
      if (!revenueByRoomType[res.roomType]) {
        revenueByRoomType[res.roomType] = 0;
      }
      if (res.payment === 'Lunas') {
        revenueByRoomType[res.roomType] += res.totalPayment;
      }
    });

    // Revenue per month
    const revenueByMonth = {};
    reservations.forEach(res => {
      const month = new Date(res.checkIn).toLocaleString('id-ID', { month: 'long' });
      if (!revenueByMonth[month]) {
        revenueByMonth[month] = { total: 0, count: 0 };
      }
      if (res.payment === 'Lunas') {
        revenueByMonth[month].total += res.totalPayment;
        revenueByMonth[month].count++;
      }
    });

    return {
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      unpaidRevenue,
      totalTransactions: reservations.length,
      paidTransactions: reservations.filter(r => r.payment === 'Lunas').length,
      revenueByRoomType,
      revenueByMonth
    };
  }, [reservations]);

  // Filter reservations by month
  const filteredReservations = useMemo(() => {
    if (selectedMonth === 'All') return reservations;
    return reservations.filter(r => {
      const month = new Date(r.checkIn).toLocaleString('id-ID', { month: 'long' });
      return month === selectedMonth;
    });
  }, [reservations, selectedMonth]);

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <div className="reports-page modern-page">
      {/* Header with gradient */}
      <div className="page-header-modern">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <div className="header-icon">📈</div>
          </div>
          <div>
            <h2>Laporan Transaksi</h2>
            <p className="page-subtitle">Analisis lengkap transaksi dan performa hotel</p>
          </div>
        </div>
        <div className="header-stats-mini">
          <div className="mini-stat">
            <span className="mini-stat-value">Rp {(transactionStats.paidRevenue / 1000000).toFixed(1)}M</span>
            <span className="mini-stat-label">Revenue Lunas</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value">{((transactionStats.paidTransactions / transactionStats.totalTransactions) * 100).toFixed(0)}%</span>
            <span className="mini-stat-label">Success Rate</span>
          </div>
        </div>
      </div>

      {/* Revenue Summary Cards - Enhanced */}
      <div className="revenue-summary-grid-modern">
        <div className="revenue-card-modern total">
          <div className="card-glow"></div>
          <div className="card-content-modern">
            <div className="card-header-modern">
              <div className="card-icon-modern">💰</div>
              <span className="card-badge">Total</span>
            </div>
            <div className="card-body-modern">
              <div className="card-label-modern">Total Revenue</div>
              <div className="card-value-modern">Rp {transactionStats.totalRevenue.toLocaleString('id-ID')}</div>
              <div className="card-footer-modern">
                <span className="card-count">{transactionStats.totalTransactions} transaksi</span>
                <span className="card-trend up">↗ 100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="revenue-card-modern paid">
          <div className="card-glow"></div>
          <div className="card-content-modern">
            <div className="card-header-modern">
              <div className="card-icon-modern">✅</div>
              <span className="card-badge success">Lunas</span>
            </div>
            <div className="card-body-modern">
              <div className="card-label-modern">Revenue Lunas</div>
              <div className="card-value-modern">Rp {transactionStats.paidRevenue.toLocaleString('id-ID')}</div>
              <div className="card-footer-modern">
                <span className="card-count">{transactionStats.paidTransactions} transaksi</span>
                <span className="card-trend up">↗ {((transactionStats.paidTransactions / transactionStats.totalTransactions) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="revenue-card-modern pending">
          <div className="card-glow"></div>
          <div className="card-content-modern">
            <div className="card-header-modern">
              <div className="card-icon-modern">⏳</div>
              <span className="card-badge warning">Pending</span>
            </div>
            <div className="card-body-modern">
              <div className="card-label-modern">Revenue Pending</div>
              <div className="card-value-modern">Rp {transactionStats.pendingRevenue.toLocaleString('id-ID')}</div>
              <div className="card-footer-modern">
                <span className="card-count">Menunggu konfirmasi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="revenue-card-modern unpaid">
          <div className="card-glow"></div>
          <div className="card-content-modern">
            <div className="card-header-modern">
              <div className="card-icon-modern">❌</div>
              <span className="card-badge danger">Belum Bayar</span>
            </div>
            <div className="card-body-modern">
              <div className="card-label-modern">Revenue Belum Bayar</div>
              <div className="card-value-modern">Rp {transactionStats.unpaidRevenue.toLocaleString('id-ID')}</div>
              <div className="card-footer-modern">
                <span className="card-count">Perlu tindak lanjut</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Room Type - Enhanced */}
      <div className="section-card-modern">
        <div className="section-header-modern">
          <h3 className="section-title-modern">
            <span className="title-icon">🛏️</span>
            Revenue per Tipe Kamar
          </h3>
          <div className="section-subtitle">Pendapatan dari pembayaran lunas</div>
        </div>
        <div className="room-revenue-grid-modern">
          {Object.entries(transactionStats.revenueByRoomType).map(([type, revenue]) => {
            const percentage = ((revenue / transactionStats.paidRevenue) * 100).toFixed(1);
            const colors = {
              Standard: { bg: '#f1f5f9', color: '#64748b', icon: '🛏️' },
              Deluxe: { bg: '#dbeafe', color: '#3b82f6', icon: '🏨' },
              Suite: { bg: '#f3e8ff', color: '#8b5cf6', icon: '👑' },
              Executive: { bg: '#fee2e2', color: '#ef4444', icon: '💎' }
            };
            const style = colors[type] || colors.Standard;
            
            return (
              <div key={type} className="room-revenue-card-modern">
                <div className="room-card-bg" style={{ background: style.bg }}></div>
                <div className="room-card-content">
                  <div className="room-icon-modern" style={{ color: style.color }}>
                    {style.icon}
                  </div>
                  <div className="room-info-modern">
                    <h4>{type}</h4>
                    <div className="room-revenue-amount-modern">Rp {revenue.toLocaleString('id-ID')}</div>
                    <div className="room-revenue-progress">
                      <div className="progress-bar-modern">
                        <div className="progress-fill-modern" style={{ width: `${percentage}%`, background: style.color }}></div>
                      </div>
                      <span className="progress-label">{percentage}% dari total</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue by Month - Enhanced */}
      <div className="section-card-modern">
        <div className="section-header-modern">
          <h3 className="section-title-modern">
            <span className="title-icon">📅</span>
            Revenue per Bulan
          </h3>
          <div className="section-subtitle">Tren pendapatan bulanan (Lunas)</div>
        </div>
        <div className="month-revenue-list-modern">
          {Object.entries(transactionStats.revenueByMonth)
            .sort((a, b) => months.indexOf(a[0]) - months.indexOf(b[0]))
            .map(([month, data], index) => {
              const maxRevenue = Math.max(...Object.values(transactionStats.revenueByMonth).map(m => m.total));
              const percentage = (data.total / maxRevenue) * 100;
              
              return (
                <div key={month} className="month-revenue-item-modern" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="month-info">
                    <div className="month-name-modern">{month}</div>
                    <div className="month-count-modern">{data.count} transaksi</div>
                  </div>
                  <div className="month-revenue-bar">
                    <div className="revenue-bar-bg">
                      <div className="revenue-bar-fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="month-revenue-modern">Rp {data.total.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Transaction List - Enhanced */}
      <div className="section-card-modern">
        <div className="section-header-modern">
          <h3 className="section-title-modern">
            <span className="title-icon">📋</span>
            Detail Transaksi
          </h3>
          <div className="filter-dropdown-modern">
            <span className="filter-icon">📅</span>
            <select 
              className="select-filter-modern"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="All">Semua Bulan</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="transactions-table-container-modern">
          <table className="transactions-table-modern">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>ID Booking</th>
                <th>Customer</th>
                <th>Tipe Kamar</th>
                <th>Durasi</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.slice(0, 50).map((reservation, index) => {
                const checkIn = new Date(reservation.checkIn);
                const checkOut = new Date(reservation.checkOut);
                const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                
                return (
                  <tr key={reservation.id} style={{ animationDelay: `${index * 0.02}s` }}>
                    <td>{checkIn.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="booking-id-modern">{reservation.reservation}</td>
                    <td className="customer-name-modern">{reservation.name}</td>
                    <td>
                      <span className={`room-type-badge ${reservation.roomType.toLowerCase()}`}>
                        {reservation.roomType}
                      </span>
                    </td>
                    <td>{duration} hari</td>
                    <td className="transaction-amount-modern">Rp {reservation.totalPayment.toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`transaction-status-badge-modern ${reservation.payment.toLowerCase().replace(' ', '-')}`}>
                        {reservation.payment === 'Lunas' ? '✓' : reservation.payment === 'Pending' ? '⏳' : '✗'} {reservation.payment}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredReservations.length > 50 && (
            <div className="table-footer-modern">
              <span className="footer-icon">📄</span>
              <p>Menampilkan 50 dari {filteredReservations.length} transaksi</p>
              <button className="btn-load-more">Muat Lebih Banyak</button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats - Enhanced */}
      <div className="summary-stats-grid-modern">
        <div className="summary-stat-card-modern">
          <div className="stat-icon-wrapper">
            <span className="stat-icon-modern">👥</span>
          </div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{customers.length}</div>
            <div className="stat-label-modern">Total Customer</div>
          </div>
        </div>
        <div className="summary-stat-card-modern">
          <div className="stat-icon-wrapper">
            <span className="stat-icon-modern">📅</span>
          </div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{reservations.length}</div>
            <div className="stat-label-modern">Total Reservasi</div>
          </div>
        </div>
        <div className="summary-stat-card-modern">
          <div className="stat-icon-wrapper">
            <span className="stat-icon-modern">💵</span>
          </div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">Rp {Math.round(transactionStats.totalRevenue / transactionStats.totalTransactions).toLocaleString('id-ID')}</div>
            <div className="stat-label-modern">Rata-rata Transaksi</div>
          </div>
        </div>
        <div className="summary-stat-card-modern">
          <div className="stat-icon-wrapper">
            <span className="stat-icon-modern">📊</span>
          </div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{((transactionStats.paidTransactions / transactionStats.totalTransactions) * 100).toFixed(1)}%</div>
            <div className="stat-label-modern">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
