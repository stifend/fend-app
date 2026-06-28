// ========================================
// 📌 TUGAS REACT HOOKS - useEffect & useRef di PaymentsPage
// ========================================
// Halaman Pembayaran - Statistik dan daftar pembayaran dari reservasi
import { useData } from '../context/DataContext';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components';

const PaymentsPage = () => {
  const { reservations } = useData();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('All');

  // ========================================
  // 📌 TUGAS REACT HOOKS - LOKASI 10 (useState)
  // ========================================
  // HOOK: useState
  // FILE: src/pages/PaymentsPage.jsx
  // LINE: 16-17
  // FUNGSI: Loading state untuk simulasi fetch payment data
  // ========================================
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);

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
  // 📌 TUGAS REACT HOOKS - LOKASI 5 (useEffect)
  // ========================================
  // HOOK: useEffect
  // FILE: src/pages/PaymentsPage.jsx
  // LINE: 34-47
  // FUNGSI: Simulasi fetch payment data dengan loading 800ms
  // DEPENDENCY: [reservations]
  // KAPAN JALAN: Saat component mount & saat reservations berubah
  // PENJELASAN: Effect ini mensimulasikan proses fetch data payment
  //             dari API/database dengan delay 800ms
  // ========================================
  useEffect(() => {
    // Set loading true saat mulai fetch data
    // eslint-disable-next-line react-hooks/set-state-in-effect -- disengaja: simulasi fetch async
    setIsLoading(true);

    // Simulasi fetch data pembayaran dari server (800ms)
    const fetchTimer = setTimeout(() => {
      setPaymentData(reservations); // Set data setelah "fetch"
      setIsLoading(false);           // Matikan loading
    }, 800); // Delay 800ms (lebih cepat karena data finansial)

    // Cleanup: hapus timer jika component unmount sebelum selesai
    return () => clearTimeout(fetchTimer);
  }, [reservations]); // Re-run jika reservations data berubah

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

  // Hitung statistik pembayaran
  const paymentStats = useMemo(() => {
    const stats = {
      Lunas: { count: 0, total: 0 },
      Pending: { count: 0, total: 0 },
      'Belum Bayar': { count: 0, total: 0 }
    };

    paymentData.forEach(res => {
      if (stats[res.payment]) {
        stats[res.payment].count++;
        stats[res.payment].total += res.totalPayment;
      }
    });

    return stats;
  }, [paymentData]);

  const totalRevenue = Object.values(paymentStats).reduce((sum, stat) => sum + stat.total, 0);
  const totalTransactions = paymentData.length;
  const paidRevenue = paymentStats.Lunas.total;
  const pendingRevenue = paymentStats.Pending.total + paymentStats['Belum Bayar'].total;

  // Filter reservations berdasarkan status
  const filteredReservations = useMemo(() => {
    if (selectedStatus === 'All') return paymentData;
    return paymentData.filter(r => r.payment === selectedStatus);
  }, [paymentData, selectedStatus]);

  // Tampilkan Loading component jika sedang fetch data
  if (isLoading) {
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
            <span className="mini-stat-value">{((paymentStats.Lunas.count / totalTransactions) * 100).toFixed(0)}%</span>
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
              <span className="card-badge success">Lunas</span>
            </div>
            <div className="card-body-modern">
              <div className="card-label-modern">Pembayaran Lunas</div>
              <div className="card-value-modern">Rp {paidRevenue.toLocaleString('id-ID')}</div>
              <div className="card-footer-modern">
                <span className="card-count">{paymentStats.Lunas.count} transaksi</span>
                <span className="card-trend up">↗ {((paymentStats.Lunas.count / totalTransactions) * 100).toFixed(0)}%</span>
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
              <div className="card-label-modern">Pending & Belum Bayar</div>
              <div className="card-value-modern">Rp {pendingRevenue.toLocaleString('id-ID')}</div>
              <div className="card-footer-modern">
                <span className="card-count">{paymentStats.Pending.count + paymentStats['Belum Bayar'].count} transaksi</span>
                <span className="card-trend down">↘ {(((paymentStats.Pending.count + paymentStats['Belum Bayar'].count) / totalTransactions) * 100).toFixed(0)}%</span>
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
                <h4>Lunas</h4>
                <div className="status-count-modern">{paymentStats.Lunas.count} transaksi</div>
                <div className="status-amount-modern">Rp {paymentStats.Lunas.total.toLocaleString('id-ID')}</div>
                <div className="status-progress">
                  <div className="progress-bar-modern">
                    <div className="progress-fill-modern" style={{ width: `${(paymentStats.Lunas.count / totalTransactions) * 100}%` }}></div>
                  </div>
                  <span className="progress-label">{((paymentStats.Lunas.count / totalTransactions) * 100).toFixed(1)}%</span>
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
                <h4>Belum Bayar</h4>
                <div className="status-count-modern">{paymentStats['Belum Bayar'].count} transaksi</div>
                <div className="status-amount-modern">Rp {paymentStats['Belum Bayar'].total.toLocaleString('id-ID')}</div>
                <div className="status-progress">
                  <div className="progress-bar-modern">
                    <div className="progress-fill-modern" style={{ width: `${(paymentStats['Belum Bayar'].count / totalTransactions) * 100}%` }}></div>
                  </div>
                  <span className="progress-label">{((paymentStats['Belum Bayar'].count / totalTransactions) * 100).toFixed(1)}%</span>
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
              Semua <span className="filter-count">{reservations.length}</span>
            </button>
            <button 
              className={`filter-btn-modern success ${selectedStatus === 'Lunas' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('Lunas')}
            >
              <span className="filter-icon">✅</span>
              Lunas <span className="filter-count">{paymentStats.Lunas.count}</span>
            </button>
            <button 
              className={`filter-btn-modern warning ${selectedStatus === 'Pending' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('Pending')}
            >
              <span className="filter-icon">⏳</span>
              Pending <span className="filter-count">{paymentStats.Pending.count}</span>
            </button>
            <button 
              className={`filter-btn-modern danger ${selectedStatus === 'Belum Bayar' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('Belum Bayar')}
            >
              <span className="filter-icon">❌</span>
              Belum Bayar <span className="filter-count">{paymentStats['Belum Bayar'].count}</span>
            </button>
          </div>
        </div>

        <div className="payments-table-container-modern">
          <table className="payments-table-modern">
            <thead>
              <tr>
                <th>ID Booking</th>
                <th>Nama Customer</th>
                <th>Tipe Kamar</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.slice(0, 50).map((reservation, index) => (
                <tr key={reservation.id} style={{ animationDelay: `${index * 0.02}s` }}>
                  <td className="booking-id-modern">{reservation.reservation}</td>
                  <td className="customer-name-modern">{reservation.name}</td>
                  <td>
                    <span className={`room-type-badge ${reservation.roomType.toLowerCase()}`}>
                      {reservation.roomType}
                    </span>
                  </td>
                  <td>{new Date(reservation.checkIn).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</td>
                  <td>{new Date(reservation.checkOut).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</td>
                  <td className="payment-amount-modern">Rp {reservation.totalPayment.toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`payment-status-badge-modern ${reservation.payment.toLowerCase().replace(' ', '-')}`}>
                      {reservation.payment === 'Lunas' ? '✓' : reservation.payment === 'Pending' ? '⏳' : '✗'} {reservation.payment}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-view-modern"
                      onClick={() => navigate(`/reservation-detail/${reservation.id}`)}
                    >
                      <span>Detail</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredReservations.length > 50 && (
            <div className="table-footer-modern">
              <span className="footer-icon">📄</span>
              <p>Menampilkan 50 dari {filteredReservations.length} pembayaran</p>
              <button className="btn-load-more">Muat Lebih Banyak</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
