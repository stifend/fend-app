// Halaman Booking - Member bisa melakukan pemesanan kamar
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getTierBySpending, getDiscount, TIER_ICONS } from '../utils/membership';
import '../guest-page.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addReservation, customers, getMemberSpending, upsertCustomerMembership } = useData();
  
  // Room types dengan harga
  const roomTypes = [
    { type: 'Standard', price: 800000, icon: '🛏️' },
    { type: 'Deluxe', price: 1200000, icon: '🏨' },
    { type: 'Suite', price: 2500000, icon: '👑' },
    { type: 'Executive', price: 4000000, icon: '💎' }
  ];

  // State untuk member data
  const [memberData, setMemberData] = useState(null);
  const [customer, setCustomer] = useState(null);

  // State untuk form booking
  const [bookingData, setBookingData] = useState({
    roomType: location.state?.roomType || 'Standard',
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequest: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Cek login dan ambil data member
  useEffect(() => {
    const token = localStorage.getItem("memberToken");
    const member = localStorage.getItem("member");

    if (!token || !member) {
      // Jika belum login, redirect ke login
      navigate("/login", { replace: true });
      return;
    }

    const memberObj = JSON.parse(member);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- disengaja: inisialisasi state dari localStorage
    setMemberData(memberObj);

    // Cari customer berdasarkan email
    const foundCustomer = customers.find(c => c.email === memberObj.email);
    setCustomer(foundCustomer);
  }, [navigate, customers]);

  // ========== MEMBERSHIP ==========
  // Tier member SAAT INI = berdasarkan total pengeluaran sebelum booking ini.
  // Diskon mengikuti tier saat ini (member baru/None = 0%).
  const currentTier = memberData
    ? getTierBySpending(getMemberSpending(memberData.email))
    : 'None';
  const discountRate = getDiscount(currentTier);

  // Hitung subtotal harga kamar (harga x malam), sebelum diskon
  const calculateSubtotal = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) return 0;

    const room = roomTypes.find(r => r.type === bookingData.roomType);
    return room.price * nights;
  };

  // Nominal diskon (Rp) berdasarkan tier member saat ini
  const calculateDiscount = () => Math.round(calculateSubtotal() * discountRate);

  // Total harga setelah diskon membership
  const calculateTotal = () => calculateSubtotal() - calculateDiscount();

  // Hitung jumlah malam
  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights : 0;
  };

  // Handle change input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Handle submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError('Tanggal check-in dan check-out harus diisi');
      setLoading(false);
      return;
    }

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      setError('Tanggal check-in tidak boleh di masa lalu');
      setLoading(false);
      return;
    }

    if (checkOut <= checkIn) {
      setError('Tanggal check-out harus setelah check-in');
      setLoading(false);
      return;
    }

    const nights = calculateNights();
    if (nights <= 0) {
      setError('Durasi menginap minimal 1 malam');
      setLoading(false);
      return;
    }

        try {
      // Kirim booking ke server (Supabase RPC create_reservation).
      // Server menghitung subtotal, diskon, tier, total, lalu upsert customer.
      await addReservation({
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone || '-',
        address: memberData.address || '-',
        roomType: bookingData.roomType,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(bookingData.guests),
        specialRequest: bookingData.specialRequest,
      });

      // Hitung tier terbaru (setelah booking ini) untuk sinkron ke localStorage
      // 'member' supaya MemberDashboard langsung menampilkan tier terbaru.
      const newTier = upsertCustomerMembership(memberData.email);
      if (newTier) {
        const updatedMember = { ...memberData, membership: newTier };
        localStorage.setItem('member', JSON.stringify(updatedMember));
      }

      setLoading(false);
      setSuccess(true);

      // Redirect ke member dashboard setelah 2 detik
      setTimeout(() => {
        navigate('/member-dashboard', { state: { tab: 'transactions' } });
      }, 2000);
    } catch {
      setError('Gagal membuat reservasi. Silakan coba lagi.');
      setLoading(false);
    }
  };

  if (!memberData) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="booking-page">
        <div className="booking-success">
          <div className="success-icon">✅</div>
          <h2>Booking Berhasil!</h2>
          <p>Reservasi Anda telah dibuat</p>
          <p className="success-note">Mengarahkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Navbar */}
      <nav className="member-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-logo">🏨</div>
            <h1>Booking Kamar</h1>
          </div>
          <div className="navbar-menu">
            <button 
              className="nav-btn-login"
              onClick={() => navigate('/member-dashboard')}
            >
              ← Kembali
            </button>
          </div>
        </div>
      </nav>

      {/* Booking Content */}
      <div className="booking-content">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="booking-header">
            <h2>Form Pemesanan Kamar</h2>
            <p>Lengkapi data pemesanan Anda</p>
          </div>

          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

          <div className="booking-layout">
            {/* Form */}
            <div className="booking-form-section">
              <form onSubmit={handleSubmit} className="booking-form">
                {/* Member Info (Read Only) */}
                <div className="form-section">
                  <h3>Informasi Pemesan</h3>
                  <div className="form-row">
                    <label>Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={memberData.name} 
                      disabled 
                      className="input-disabled"
                    />
                  </div>
                  <div className="form-row">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={memberData.email} 
                      disabled 
                      className="input-disabled"
                    />
                  </div>
                  <div className="form-row">
                    <label>Telepon</label>
                    <input 
                      type="text" 
                      value={memberData.phone || 'Belum diisi'} 
                      disabled 
                      className="input-disabled"
                    />
                  </div>
                </div>

                {/* Room Selection */}
                <div className="form-section">
                  <h3>Detail Pemesanan</h3>
                  <div className="form-row">
                    <label htmlFor="roomType">Tipe Kamar *</label>
                    <select 
                      id="roomType"
                      name="roomType"
                      value={bookingData.roomType}
                      onChange={handleChange}
                      required
                    >
                      {roomTypes.map((room, index) => (
                        <option key={index} value={room.type}>
                          {room.icon} {room.type} - Rp {room.price.toLocaleString('id-ID')}/malam
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row-group">
                    <div className="form-row">
                      <label htmlFor="checkIn">Check-in *</label>
                      <input 
                        type="date" 
                        id="checkIn"
                        name="checkIn"
                        value={bookingData.checkIn}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="checkOut">Check-out *</label>
                      <input 
                        type="date" 
                        id="checkOut"
                        name="checkOut"
                        value={bookingData.checkOut}
                        onChange={handleChange}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <label htmlFor="guests">Jumlah Tamu *</label>
                    <select 
                      id="guests"
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">1 Tamu</option>
                      <option value="2">2 Tamu</option>
                      <option value="3">3 Tamu</option>
                      <option value="4">4 Tamu</option>
                      <option value="5">5+ Tamu</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label htmlFor="specialRequest">Permintaan Khusus (Opsional)</label>
                    <textarea 
                      id="specialRequest"
                      name="specialRequest"
                      value={bookingData.specialRequest}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Contoh: kamar lantai atas, extra bed, dll."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn-submit-booking"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Konfirmasi Booking'}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div className="booking-summary">
              <h3>Ringkasan Pemesanan</h3>
              
              <div className="summary-item">
                <span className="summary-label">Tipe Kamar:</span>
                <span className="summary-value">{bookingData.roomType}</span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Check-in:</span>
                <span className="summary-value">
                  {bookingData.checkIn 
                    ? new Date(bookingData.checkIn).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '-'
                  }
                </span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Check-out:</span>
                <span className="summary-value">
                  {bookingData.checkOut 
                    ? new Date(bookingData.checkOut).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '-'
                  }
                </span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Durasi:</span>
                <span className="summary-value">{calculateNights()} malam</span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Jumlah Tamu:</span>
                <span className="summary-value">{bookingData.guests} orang</span>
              </div>

              <div className="summary-divider"></div>

              {/* Status membership member saat ini */}
              <div className="summary-item">
                <span className="summary-label">Tier Member:</span>
                <span className="summary-value">
                  {TIER_ICONS[currentTier]} {currentTier === 'None' ? 'Belum ada' : currentTier}
                </span>
              </div>

              {/* Subtotal sebelum diskon */}
              <div className="summary-item">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">
                  Rp {calculateSubtotal().toLocaleString('id-ID')}
                </span>
              </div>

              {/* Diskon membership (tampil hanya jika ada) */}
              {discountRate > 0 && (
                <div className="summary-item">
                  <span className="summary-label">
                    Diskon {currentTier} ({(discountRate * 100).toFixed(0)}%):
                  </span>
                  <span className="summary-value" style={{ color: '#16a34a' }}>
                    − Rp {calculateDiscount().toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div className="summary-item summary-total">
                <span className="summary-label">Total Harga:</span>
                <span className="summary-value">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </span>
              </div>

              <div className="summary-note">
                <p>💡 Status pembayaran: <strong>Pending</strong></p>
                {currentTier === 'None' ? (
                  <p>🎉 Booking pertama Anda akan membuka tier <strong>Silver</strong> (diskon 5% untuk booking berikutnya)!</p>
                ) : (
                  <p>Anda menikmati benefit tier <strong>{currentTier}</strong>. Terus menginap untuk naik tier!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
