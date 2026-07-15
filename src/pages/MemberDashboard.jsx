// Halaman Member Dashboard - Riwayat Transaksi Member
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getTierBySpending, getNextTier, membershipBenefits, TIER_ICONS } from '../utils/membership';
import '../guest-page.css';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { reservations, submitFeedback, getAvailableVouchers, getMemberVouchers, claimVoucher } = useData();
  const [activeTab, setActiveTab] = useState('profile');
  const [memberData, setMemberData] = useState(null);

  // State untuk voucher
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [myVouchers, setMyVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  // State untuk ulasan
  const [selectedFeedbackReservation, setSelectedFeedbackReservation] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Fungsi load vouchers
  const loadVouchers = async () => {
    if (!memberData) return;
    setLoadingVouchers(true);
    try {
      const avail = await getAvailableVouchers(memberData.email);
      const my = await getMemberVouchers(memberData.email);
      setAvailableVouchers(avail || []);
      setMyVouchers(my || []);
    } catch (err) {
      console.error("Gagal memuat voucher:", err);
    } finally {
      setLoadingVouchers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'voucher' && memberData) {
      loadVouchers();
    }
  }, [activeTab, memberData]);

  const handleClaimVoucher = async (voucherId) => {
    try {
      await claimVoucher(memberData.email, voucherId);
      alert('Voucher berhasil diklaim!');
      loadVouchers();
    } catch (err) {
      alert('Gagal mengklaim voucher.');
    }
  };

  // Fungsi kirim ulasan
  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim()) return alert('Pesan ulasan tidak boleh kosong');
    setIsSubmitting(true);
    try {
      await submitFeedback(selectedFeedbackReservation.id, memberData.name, memberData.email, rating, feedbackMessage);
      alert('Terima kasih! Ulasan Anda berhasil dikirim.');
      setSelectedFeedbackReservation(null);
      setFeedbackMessage("");
      setRating(5);
    } catch (err) {
      alert('Terjadi kesalahan saat mengirim ulasan. Pastikan Anda telah menjalankan script SQL terbaru.');
    } finally {
      setIsSubmitting(false);
    }
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
            <button 
              className={`tab-btn ${activeTab === 'voucher' ? 'active' : ''}`}
              onClick={() => setActiveTab('voucher')}
            >
              🎟️ Voucher
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
                        <span className={`status-badge ${(transaction.payment || 'pending').toLowerCase().replace(' ', '-')}`}>
                          {transaction.payment || 'Pending'}
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
                            Rp {(transaction.totalPayment || 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                        {transaction.payment === 'Lunas' && (
                          <div className="transaction-action" style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'right' }}>
                            {transaction.has_feedback ? (
                              <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>✓ Ulasan Terkirim</span>
                            ) : (
                              <button 
                                className="btn-primary-member" 
                                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                                onClick={() => setSelectedFeedbackReservation(transaction)}
                              >
                                ⭐ Beri Ulasan
                              </button>
                            )}
                          </div>
                        )}
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
                      Rp {memberStats.totalSpent.toLocaleString('id-ID')}
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

          {/* Voucher Tab */}
          {activeTab === 'voucher' && (
            <div className="voucher-section">
              <div className="section-header-member">
                <h2>Voucher Saya</h2>
                <p>Klaim voucher dan gunakan saat melakukan pemesanan</p>
              </div>

              {loadingVouchers ? (
                <div className="loading-screen" style={{ height: '200px' }}>
                  <div className="spinner"></div>
                  <p>Memuat voucher...</p>
                </div>
              ) : (
                <div className="voucher-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Voucher Tersedia */}
                  <div>
                    <h3 style={{ marginBottom: '15px', color: '#1f2937' }}>Voucher Tersedia untuk Diklaim</h3>
                    {availableVouchers.length === 0 ? (
                      <p style={{ color: '#6b7280' }}>Tidak ada voucher baru saat ini.</p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {availableVouchers.map(v => (
                          <div key={v.id} style={{ border: '2px dashed #3b82f6', borderRadius: '12px', padding: '20px', background: '#eff6ff' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1d4ed8', marginBottom: '5px' }}>{v.name}</div>
                            <div style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '15px' }}>{v.description}</div>
                            <div style={{ background: '#bfdbfe', display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '15px' }}>Kode: {v.code}</div>
                            <button 
                              onClick={() => handleClaimVoucher(v.id)}
                              style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                              onMouseOver={(e) => e.target.style.background = '#2563eb'}
                              onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                            >
                              Klaim Voucher
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Voucher Saya */}
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                    <h3 style={{ marginBottom: '15px', color: '#1f2937' }}>Voucher Saya</h3>
                    {myVouchers.length === 0 ? (
                      <p style={{ color: '#6b7280' }}>Anda belum mengklaim voucher apa pun.</p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {myVouchers.map(mv => (
                          <div key={mv.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', background: mv.status === 'Used' ? '#f3f4f6' : 'white', opacity: mv.status === 'Used' ? 0.7 : 1 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#111827', marginBottom: '5px' }}>{mv.vouchers?.name || 'Voucher'}</div>
                            <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '15px' }}>{mv.vouchers?.description || ''}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ background: '#e5e7eb', display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: '#374151' }}>Kode: {mv.vouchers?.code || '???'}</div>
                              <span style={{ fontWeight: 'bold', color: mv.status === 'Used' ? '#9ca3af' : '#10b981' }}>{mv.status === 'Used' ? 'Sudah Digunakan' : 'Tersedia'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {selectedFeedbackReservation && (
        <div className="modal-overlay" onClick={() => setSelectedFeedbackReservation(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'white', padding: '25px', borderRadius: '15px', width: '90%', maxWidth: '400px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Beri Ulasan Pemesanan</h3>
              <button className="close-button" onClick={() => setSelectedFeedbackReservation(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ margin: '0 0 15px 0' }}>Booking ID: <strong>{selectedFeedbackReservation.reservation}</strong></p>
              
              <div className="rating-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Rating Anda:</p>
                <div className="stars" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span 
                      key={star} 
                      onClick={() => setRating(star)}
                      style={{ cursor: 'pointer', fontSize: '32px', color: rating >= star ? '#FFD700' : '#e2e8f0', transition: 'color 0.2s' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Pesan Ulasan:</label>
                <textarea 
                  value={feedbackMessage}
                  onChange={e => setFeedbackMessage(e.target.value)}
                  placeholder="Ceritakan pengalaman menginap Anda..."
                  rows="4"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary-member" onClick={() => setSelectedFeedbackReservation(null)} disabled={isSubmitting} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>Batal</button>
              <button className="btn-primary-member" onClick={handleFeedbackSubmit} disabled={isSubmitting} style={{ padding: '10px 20px' }}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
