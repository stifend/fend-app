// Halaman Member Dashboard - Riwayat Transaksi Member
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getTierBySpending, getNextTier, membershipBenefits, TIER_ICONS } from '../utils/membership';
import '../guest-page.css';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { reservations } = useData();
  const [activeTab, setActiveTab] = useState('profile');
  const [memberData, setMemberData] = useState(null);

  // Ambil data member dari localStorage
  useEffect(() => {
    const token = localStorage.getItem("memberToken");
    const member = localStorage.getItem("member");

    if (!token || !member) {
      // Jika tidak ada token, redirect ke login
      navigate("/login", { replace: true });
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- disengaja: inisialisasi state dari localStorage
    setMemberData(JSON.parse(member));
  }, [navigate]);

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("memberToken");
    localStorage.removeItem("member");
    navigate("/", { replace: true });
  };

  // Filter transaksi berdasarkan email member
  const memberTransactions = useMemo(() => {
    if (!memberData) return [];
    
    // Filter reservasi langsung berdasarkan email member
    // Tidak perlu cari customer dulu karena email bisa langsung di-match
    return reservations.filter(r => r.email === memberData.email);
  }, [memberData, reservations]);

  // Statistik member
  const memberStats = useMemo(() => {
    const stats = {
      totalBooking: memberTransactions.length,
      totalSpent: memberTransactions.reduce((sum, t) => sum + (t.totalPayment || 0), 0),
      paidBooking: memberTransactions.filter(t => t.payment === 'Lunas').length,
      pendingBooking: memberTransactions.filter(t => t.payment === 'Pending').length,
    };
    return stats;
  }, [memberTransactions]);

  // ========== MEMBERSHIP ==========
  // Tier ditentukan dari total pengeluaran (totalSpent) member.
  const tier = useMemo(
    () => getTierBySpending(memberStats.totalSpent),
    [memberStats.totalSpent]
  );
  // Info menuju tier berikutnya (null jika sudah Platinum)
  const nextTier = useMemo(
    () => getNextTier(memberStats.totalSpent),
    [memberStats.totalSpent]
  );
  // Daftar benefit untuk tier saat ini (kosong jika None)
  const benefits = membershipBenefits[tier] || [];

  if (!memberData) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="member-dashboard">
      {/* Navbar Member */}
      <nav className="member-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-logo">
              <img src="/images/hotel-logo.jpg" alt="Novotel Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <h1>Novotel Member</h1>
          </div>
          <div className="navbar-menu">
            <div className="member-info">
              <span className="member-name">👤 {memberData.name}</span>
              <button className="btn-logout-member" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="member-content">
        <div className="container">
          {/* Tabs */}
          <div className="member-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button 
              className={`tab-btn ${activeTab === 'booking' ? 'active' : ''}`}
              onClick={() => setActiveTab('booking')}
            >
              🛏️ Booking Kamar
            </button>
            <button 
              className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              📋 Riwayat Transaksi
            </button>
            <button 
              className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              📊 Statistik
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-card-member">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {memberData.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h2>{memberData.name}</h2>
                    <p className="member-role">
                      <span className="role-badge">{memberData.role || 'Member'}</span>
                    </p>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">📧 Email:</span>
                    <span className="detail-value">{memberData.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📅 Bergabung:</span>
                    <span className="detail-value">
                      {memberData.created_at 
                        ? new Date(memberData.created_at).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })
                        : '-'
                      }
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📱 Telepon:</span>
                    <span className="detail-value">{memberData.phone || 'Belum diisi'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📍 Alamat:</span>
                    <span className="detail-value">{memberData.address || 'Belum diisi'}</span>
                  </div>
                </div>
              </div>

              {/* ========== KARTU STATUS MEMBERSHIP ========== */}
              <div className={`membership-card-member tier-${tier.toLowerCase()}`}>
                <div className="membership-card-header">
                  <div className="membership-tier-badge">
                    <span className="membership-tier-icon">{TIER_ICONS[tier]}</span>
                    <div>
                      <div className="membership-tier-label">Status Membership</div>
                      <div className="membership-tier-name">
                        {tier === 'None' ? 'Belum Ada Tier' : tier}
                      </div>
                    </div>
                  </div>
                  <div className="membership-spent">
                    <div className="membership-spent-label">Total Pengeluaran</div>
                    <div className="membership-spent-value">
                      Rp {memberStats.totalSpent.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Progress menuju tier berikutnya */}
                {nextTier ? (
                  <div className="membership-progress">
                    <p className="membership-progress-text">
                      💡 Kurang <strong>Rp {nextTier.remaining.toLocaleString('id-ID')}</strong> lagi
                      menuju tier <strong>{nextTier.tier}</strong>
                    </p>
                    <div className="membership-progress-bar">
                      <div
                        className="membership-progress-fill"
                        style={{
                          width: `${Math.min(100, (memberStats.totalSpent / nextTier.minSpent) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <p className="membership-progress-text">
                    🎉 Selamat! Anda berada di tier tertinggi (Platinum).
                  </p>
                )}

                {/* Daftar benefit tier saat ini */}
                {benefits.length > 0 ? (
                  <div className="membership-benefits-member">
                    <h4>🎁 Benefit Anda</h4>
                    <ul>
                      {benefits.map((benefit, idx) => (
                        <li key={idx}>✓ {benefit}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="membership-empty-note">
                    Lakukan booking pertama Anda untuk membuka tier <strong>Silver</strong> dan benefitnya!
                  </p>
                )}
              </div>
            </div>
          )}
          {/* Booking Tab */}
          {activeTab === 'booking' && (
            <div className="booking-tab-section">
              <div className="section-header-member">
                <h2>Booking Kamar</h2>
                <p>Pesan kamar sesuai kebutuhan Anda</p>
              </div>

              <div className="rooms-grid-member">
                {[
                  { type: 'Standard', price: 800000, icon: '🛏️', desc: 'Kamar nyaman dengan fasilitas standar' },
                  { type: 'Deluxe', price: 1200000, icon: '🏨', desc: 'Kamar luas dengan pemandangan kota' },
                  { type: 'Suite', price: 2500000, icon: '👑', desc: 'Suite mewah dengan ruang tamu terpisah' },
                  { type: 'Executive', price: 4000000, icon: '💎', desc: 'Kamar super premium dengan layanan butler' }
                ].map((room, index) => (
                  <div key={index} className="room-card-member">
                    <div className="room-icon-member">{room.icon}</div>
                    <h3>{room.type}</h3>
                    <p className="room-desc-member">{room.desc}</p>
                    <div className="room-price-member">
                      <span className="price-amount">Rp {room.price.toLocaleString('id-ID')}</span>
                      <span className="price-per">/malam</span>
                    </div>
                    <button 
                      className="btn-book-member"
                      onClick={() => navigate('/booking', { state: { roomType: room.type } })}
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="transactions-section">
              <div className="section-header-member">
                <h2>Riwayat Transaksi</h2>
                <p>Total {memberTransactions.length} transaksi</p>
              </div>

              {memberTransactions.length === 0 ? (
                <div className="empty-state-member">
                  <div className="empty-icon">📋</div>
                  <h3>Belum Ada Transaksi</h3>
                  <p>Anda belum memiliki riwayat transaksi</p>
                  <button className="btn-primary-member" onClick={() => navigate('/')}>
                    Booking Sekarang
                  </button>
                </div>
              ) : (
                <div className="transactions-list">
                  {memberTransactions.map((transaction, index) => (
                    <div key={index} className="transaction-card">
                      <div className="transaction-header">
                        <div className="transaction-id">
                          <span className="label">Booking ID:</span>
                          <span className="value">{transaction.reservation}</span>
                        </div>
                        <span className={`status-badge ${transaction.payment.toLowerCase().replace(' ', '-')}`}>
                          {transaction.payment}
                        </span>
                      </div>
                      <div className="transaction-body">
                        <div className="transaction-row">
                          <span className="icon">🛏️</span>
                          <span className="label">Tipe Kamar:</span>
                          <span className="value">{transaction.roomType}</span>
                        </div>
                        <div className="transaction-row">
                          <span className="icon">📅</span>
                          <span className="label">Check-in:</span>
                          <span className="value">
                            {new Date(transaction.checkIn).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="transaction-row">
                          <span className="icon">📅</span>
                          <span className="label">Check-out:</span>
                          <span className="value">
                            {new Date(transaction.checkOut).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="transaction-row">
                          <span className="icon">🌙</span>
                          <span className="label">Durasi:</span>
                          <span className="value">{transaction.nights} malam</span>
                        </div>
                        <div className="transaction-row total">
                          <span className="icon">💰</span>
                          <span className="label">Total:</span>
                          <span className="value price">
                            Rp {transaction.totalPayment.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="stats-section">
              <div className="section-header-member">
                <h2>Statistik Anda</h2>
                <p>Ringkasan aktivitas booking Anda</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card-member">
                  <div className="stat-icon">📋</div>
                  <div className="stat-content">
                    <div className="stat-value">{memberStats.totalBooking}</div>
                    <div className="stat-label">Total Booking</div>
                  </div>
                </div>

                <div className="stat-card-member success">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <div className="stat-value">{memberStats.paidBooking}</div>
                    <div className="stat-label">Booking Lunas</div>
                  </div>
                </div>

                <div className="stat-card-member warning">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-content">
                    <div className="stat-value">{memberStats.pendingBooking}</div>
                    <div className="stat-label">Booking Pending</div>
                  </div>
                </div>

                <div className="stat-card-member primary">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-value">
                      Rp {(memberStats.totalSpent / 1000000).toFixed(1)}M
                    </div>
                    <div className="stat-label">Total Pengeluaran</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              {memberTransactions.length > 0 && (
                <div className="recent-activity">
                  <h3>Aktivitas Terakhir</h3>
                  <div className="activity-list">
                    {memberTransactions.slice(0, 5).map((transaction, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">
                          {transaction.payment === 'Lunas' ? '✅' : 
                           transaction.payment === 'Pending' ? '⏳' : '❌'}
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">
                            Booking {transaction.roomType} - {transaction.reservation}
                          </div>
                          <div className="activity-date">
                            {new Date(transaction.checkIn).toLocaleDateString('id-ID')} - 
                            Status: {transaction.payment}
                          </div>
                        </div>
                        <div className="activity-amount">
                          Rp {transaction.totalPayment.toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
