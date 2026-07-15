// ========================================
// 📌 TUGAS REACT HOOKS - useEffect & useRef di PaymentsPage
// ========================================
// Halaman Pembayaran - Statistik dan daftar pembayaran dari reservasi
import { useData } from '../context/DataContext';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Loading } from '../components';
import '../payment-report-pages.css';

const PaymentsPage = () => {
  const { payments, loading } = useData();
  const [selectedStatus, setSelectedStatus] = useState('All');

  // ========================================
  // 📌 TUGAS REACT HOOKS - LOKASI 4 (useRef)
  // ========================================
  // HOOK: useRef
  // FILE: src/pages/PaymentsPage.jsx
  // LINE: 26-31
  // FUNGSI: Menyimpan previous value dari selectedStatus
  // MENGAPA useRef: Butuh store value yang persist tanpa trigger re-render
  // ========================================
  const previousStatusRef = useRef('All');

  // ========================================
  // 📌 TUGAS REACT HOOKS - LOKASI 9 (useEffect + useRef)
  // ========================================
  // HOOK: useEffect
  // FILE: src/pages/PaymentsPage.jsx
  // LINE: 50-63
  // FUNGSI: Track perubahan filter status dan console log
  // DEPENDENCY: [selectedStatus]
  // KAPAN JALAN: Setiap kali selectedStatus berubah
  // ========================================
  useEffect(() => {
    // Log perubahan status filter dengan previous & current value
    if (previousStatusRef.current !== selectedStatus) {
      console.log(`Filter changed: ${previousStatusRef.current} → ${selectedStatus}`);
      
      // Update ref dengan value baru (tidak trigger re-render)
      previousStatusRef.current = selectedStatus;
    }
  }, [selectedStatus]); // Dependency: jalan setiap selectedStatus berubah

  // Hitung statistik pembayaran dari data payments Supabase
  const paymentStats = useMemo(() => {
    const stats = {
      Success: { count: 0, total: 0 },
      Pending: { count: 0, total: 0 },
      Failed: { count: 0, total: 0 },
      Refunded: { count: 0, total: 0 },
    };

    payments.forEach(pay => {
      if (stats[pay.paymentStatus]) {
        stats[pay.paymentStatus].count++;
        stats[pay.paymentStatus].total += Number(pay.amount || 0);
      }
    });

    return stats;
  }, [payments]);

  const totalRevenue = Object.values(paymentStats).reduce((sum, stat) => sum + stat.total, 0);
  const totalTransactions = payments.length;
  const successRevenue = paymentStats.Success.total;
  const pendingRevenue = paymentStats.Pending.total + paymentStats.Failed.total;

  // Filter payments berdasarkan status
  const filteredPayments = useMemo(() => {
    if (selectedStatus === 'All') return payments;
    return payments.filter(p => p.paymentStatus === selectedStatus);
  }, [payments, selectedStatus]);

  // Tampilkan Loading component jika sedang fetch data
  if (loading) {
    return (
      <div className="payments-page modern-page">
        <div className="page-header-modern">
          <div className="header-content">
            <div className="header-icon-wrapper">
              <div className="header-icon">💳</div>
            </div>
            <div>
              <h2>Pembayaran</h2>
              <p className="page-subtitle">Kelola dan monitor pembayaran reservasi hotel</p>
            </div>
          </div>
        </div>
        {/* 🔵 COMPONENT: Loading - Fullscreen saat fetch data payment */}
        <Loading size="large" text="Memuat data pembayaran..." />
      </div>
    );
  }

  return (
    <div className="payments-page modern-page">
      {/* Header with gradient */}
      <div className="page-header-modern">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <div className="header-icon">💳</div>
          </div>
          <div>
            <h2>Pembayaran</h2>
            <p className="page-subtitle">Kelola dan monitor pembayaran reservasi hotel</p>
          </div>
        </div>
        <div className="header-stats-mini">
          <div className="mini-stat">
            <span className="mini-stat-value">{totalTransactions}</span>
            <span className="mini-stat-label">Total Transaksi</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value">{totalTransactions > 0 ? ((paymentStats.Success.count / totalTransactions) * 100).toFixed(0) : 0}%</span>
            <span className="mini-stat-label">Success Rate</span>
          </div>
        </div>
      </div>

      {/* Payment Summary Cards - Enhanced */}
      <div className="payment-summary-grid-modern">
        <div className="payment-card-modern total-revenue">
          <div className="card-glow"></div>
          <div className="card-content-modern">
            <div className="card-header-modern">
              <div className="card-icon-modern">💰</div>
              <span className="card-badge">Total</span>
            </div>
            <div className="card-body-modern">
              <div className="card-label-modern">Total Revenue</div>
              <div className="card-value-modern">Rp {totalRevenue.toLocaleString('id-ID')}</div>
              <div className="card-footer-modern">
                <span className="card-count">{totalTransactions} transaksi</span>
                <span className="card-trend up">↗ 100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-card-modern paid-revenue">
          <div className="card-glow"></div>
          <div className="card-content-modern">
            <div className="card-header-modern">
              <div className="card-icon-modern">✅</div>
              <span className="card-badge success">Success</span>
            </div>
            <div className="card-body-modern">
              <div className="card-label-modern">Pembayaran Sukses</div>
              <div className="card-value-modern">Rp {successRevenue.toLocaleString('id-ID')}</div>
              <div className="card-footer-modern">
                <span className="card-count">{paymentStats.Success.count} transaksi</span>
                <span className="card-trend up">↗ {((paymentStats.Success.count / totalTransactions) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-card-modern pending-revenue">
          <div className="card-glow"></div>
          <div className="card-content-modern">
            <div className="card-header-modern">
              <div className="card-icon-modern">⏳</div>
              <span className="card-badge warning">Pending</span>
            </div>
            <div className="card-body-modern">
              <div className="card-label-modern">Pending & Failed</div>
              <div className="card-value-modern">Rp {pendingRevenue.toLocaleString('id-ID')}</div>
              <div className="card-footer-modern">
                <span className="card-count">{paymentStats.Pending.count + paymentStats.Failed.count} transaksi</span>
                <span className="card-trend down">↘ {(((paymentStats.Pending.count + paymentStats.Failed.count) / totalTransactions) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Stats - Enhanced */}
      <div className="section-card-modern">
        <div className="section-header-modern">
          <h3 className="section-title-modern">
            <span className="title-icon">📊</span>
            Status Pembayaran
          </h3>
          <div className="section-subtitle">Distribusi status pembayaran</div>
        </div>
        <div className="payment-status-grid-modern">
          <div className="status-card-modern lunas">
            <div className="status-card-bg"></div>
            <div className="status-card-content">
              <div className="status-icon-modern">✅</div>
              <div className="status-info-modern">
                <h4>Success</h4>
                <div className="status-count-modern">{paymentStats.Success.count} transaksi</div>
                <div className="status-amount-modern">Rp {paymentStats.Success.total.toLocaleString('id-ID')}</div>
                <div className="status-progress">
                  <div className="progress-bar-modern">
                    <div className="progress-fill-modern" style={{ width: `${(paymentStats.Success.count / totalTransactions) * 100}%` }}></div>
                  </div>
                  <span className="progress-label">{((paymentStats.Success.count / totalTransactions) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="status-card-modern pending">
            <div className="status-card-bg"></div>
            <div className="status-card-content">
              <div className="status-icon-modern">⏳</div>
              <div className="status-info-modern">
                <h4>Pending</h4>
                <div className="status-count-modern">{paymentStats.Pending.count} transaksi</div>
                <div className="status-amount-modern">Rp {paymentStats.Pending.total.toLocaleString('id-ID')}</div>
                <div className="status-progress">
                  <div className="progress-bar-modern">
                    <div className="progress-fill-modern" style={{ width: `${(paymentStats.Pending.count / totalTransactions) * 100}%` }}></div>
                  </div>
                  <span className="progress-label">{((paymentStats.Pending.count / totalTransactions) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="status-card-modern unpaid">
            <div className="status-card-bg"></div>
            <div className="status-card-content">
              <div className="status-icon-modern">❌</div>
              <div className="status-info-modern">
                <h4>Failed</h4>
                <div className="status-count-modern">{paymentStats.Failed.count} transaksi</div>
                <div className="status-amount-modern">Rp {paymentStats.Failed.total.toLocaleString('id-ID')}</div>
                <div className="status-progress">
                  <div className="progress-bar-modern">
                    <div className="progress-fill-modern" style={{ width: `${(paymentStats.Failed.count / totalTransactions) * 100}%` }}></div>
                  </div>
                  <span className="progress-label">{((paymentStats.Failed.count / totalTransactions) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment List - Enhanced */}
      <div className="section-card-modern">
        <div className="section-header-modern">
          <h3 className="section-title-modern">
            <span className="title-icon">📋</span>
            Daftar Pembayaran
          </h3>
          <div className="filter-buttons-modern">
            <button 
              className={`filter-btn-modern ${selectedStatus === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('All')}
            >
              <span className="filter-icon">📊</span>
              Semua <span className="filter-count">{payments.length}</span>
            </button>
            <button 
              className={`filter-btn-modern success ${selectedStatus === 'Success' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('Success')}
            >
              <span className="filter-icon">✅</span>
              Success <span className="filter-count">{paymentStats.Success.count}</span>
            </button>
            <button 
              className={`filter-btn-modern warning ${selectedStatus === 'Pending' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('Pending')}
            >
              <span className="filter-icon">⏳</span>
              Pending <span className="filter-count">{paymentStats.Pending.count}</span>
            </button>
            <button 
              className={`filter-btn-modern danger ${selectedStatus === 'Failed' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('Failed')}
            >
              <span className="filter-icon">❌</span>
              Failed <span className="filter-count">{paymentStats.Failed.count}</span>
            </button>
          </div>
        </div>

        <div className="payments-table-container-modern">
          <table className="payments-table-modern">
            <thead>
              <tr>
                <th>ID Payment</th>
                <th>Booking ID</th>
                <th>Nama Customer</th>
                <th>Tipe Kamar</th>
                <th>Metode</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.slice(0, 50).map((payment, index) => (
                <tr key={payment.id} style={{ animationDelay: `${index * 0.02}s` }}>
                  <td className="booking-id-modern">{payment.id}</td>
                  <td className="booking-id-modern">{payment.reservationNo || '-'}</td>
                  <td className="customer-name-modern">{payment.customerName}</td>
                  <td>
                    <span className={`room-type-badge ${(payment.roomType || 'standard').toLowerCase()}`}>
                      {payment.roomType || '-'}
                    </span>
                  </td>
                  <td>{payment.paymentMethod}</td>
                  <td className="payment-amount-modern">Rp {Number(payment.amount).toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`payment-status-badge-modern ${payment.paymentStatus.toLowerCase()}`}>
                      {payment.paymentStatus === 'Success' ? '✓' : 
                       payment.paymentStatus === 'Pending' ? '⏳' : 
                       payment.paymentStatus === 'Failed' ? '✗' : '↩'} {payment.paymentStatus}
                    </span>
                  </td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length > 50 && (
            <div className="table-footer-modern">
              <span className="footer-icon">📄</span>
              <p>Menampilkan 50 dari {filteredPayments.length} pembayaran</p>
              <button className="btn-load-more">Muat Lebih Banyak</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
