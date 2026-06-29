// Import library React Router untuk navigasi
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';
// Import koneksi Supabase (untuk ambil feedback nyata)
import { supabase } from '../lib/supabase';
// Import komponen reusable
import { Button, MetricCard, RoomCard, StatusRow, FeedbackItem, Card } from '../components';

const Dashboard = () => {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();

  // Ambil data reservasi dan customer dari Context API
  const { reservations } = useData();

  // ===== Feedback nyata dari Supabase (tabel feedback) =====
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    supabase.rpc('get_all_feedback').then(({ data, error }) => {
      if (!error && data) {
        // Ambil 3 feedback terbaru, sesuaikan dengan props FeedbackItem
        setFeedbacks(
          data.slice(0, 3).map((f) => ({
            name: f.customerName,
            text: f.message,
            room: f.type,
          }))
        );
      }
    });
  }, []);

  // Konfigurasi tipe & kapasitas kamar (sesuai data hotel)
  const ROOM_CONFIG = [
    { type: 'Standard', price: 800000, total: 100 },
    { type: 'Deluxe', price: 1200000, total: 80 },
    { type: 'Suite', price: 2500000, total: 50 },
    { type: 'Executive', price: 4000000, total: 20 },
  ];

  // Jumlah booking per tipe kamar (dari data reservasi nyata)
  const bookedByType = reservations.reduce((acc, r) => {
    if (r.roomType) acc[r.roomType] = (acc[r.roomType] || 0) + 1;
    return acc;
  }, {});

  // ===== Statistik overview (dari reservasi nyata) =====
  const totalCheckIn = reservations.filter(r => r.payment === 'Lunas').length;
  const totalCheckOut = reservations.filter(r => r.payment === 'Pending').length;
  const totalInHotel = reservations.length;
  const totalRooms = ROOM_CONFIG.reduce((sum, r) => sum + r.total, 0);
  const totalOccupiedRoom = reservations.length;
  const totalAvailableRoom = Math.max(totalRooms - totalOccupiedRoom, 0);
  const occupancyRate = totalRooms ? Math.round((totalOccupiedRoom / totalRooms) * 100) : 0;

  // Status pembayaran (untuk kartu Status Pembayaran)
  const paidCount = totalCheckIn;
  const pendingCount = totalCheckOut;
  const unpaidCount = reservations.filter(r => r.payment === 'Belum Bayar').length;

  // Data kamar untuk RoomCard (ketersediaan dihitung dari booking nyata)
  const rooms = ROOM_CONFIG.map((r) => {
    const booked = bookedByType[r.type] || 0;
    return {
      title: r.type,
      availability: `${Math.max(r.total - booked, 0)}/${r.total}`,
      price: r.price,
      badge: booked > 0 ? `${booked} Booked` : undefined,
    };
  });

  // Booking per bulan (untuk Occupancy Statistics) dari tanggal check-in
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const bookingsByMonth = monthNames.map((m, idx) => ({
    month: m,
    count: reservations.filter(r => {
      const d = new Date(r.checkIn);
      return !isNaN(d) && d.getMonth() === idx;
    }).length,
  }));
  const maxMonthly = Math.max(...bookingsByMonth.map(b => b.count), 1);

  // Tanggal hari ini
  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="dashboard-page-clean">
      {/* ========== HEADER ========== */}
      <div className="dashboard-header-clean">
        <div className="dashboard-date-clean">{todayStr}</div>
        {/* 🔵 COMPONENT: Button */}
        <Button
          variant="primary"
          onClick={() => navigate('/reservations')}
        >
          Create booking
        </Button>
      </div>

      {/* ========== OVERVIEW SECTION ========== */}
      {/* 🔵 COMPONENT: Card */}
      <Card className="dashboard-section">
        <h2 className="section-title-clean">Overview</h2>
        <div className="overview-grid-clean">
          {/* 🔵 COMPONENT: MetricCard (x5) */}
          <MetricCard label="Today's" title="Check-in" value={totalCheckIn} />
          <MetricCard label="Today's" title="Check-out" value={totalCheckOut} />
          <MetricCard label="Total" title="In hotel" value={totalInHotel} />
          <MetricCard label="Total" title="Available room" value={totalAvailableRoom} />
          <MetricCard label="Total" title="Occupied room" value={totalOccupiedRoom} />
        </div>
      </Card>

      {/* ========== ROOMS SECTION ========== */}
      {/* 🔵 COMPONENT: Card */}
      <Card className="dashboard-section">
        <h2 className="section-title-clean">Rooms</h2>
        <div className="rooms-grid-clean">
          {/* 🔵 COMPONENT: RoomCard (x4) */}
          {rooms.map((room, index) => (
            <RoomCard
              key={index}
              title={room.title}
              availability={room.availability}
              price={room.price}
              badge={room.badge}
              onMenuClick={() => console.log('Menu clicked')}
            />
          ))}
        </div>
      </Card>

      {/* ========== ROOM STATUS + FLOOR STATUS ========== */}
      <div className="dashboard-row-clean">

        {/* 🔵 COMPONENT: Card */}
        <Card className="dashboard-section flex-1">
                    <h2 className="section-title-clean">Status Pembayaran</h2>
          <div className="status-grid-clean">
            <div className="status-column-clean">
              <div className="status-column-header">Reservasi</div>
              <StatusRow label="Lunas" value={paidCount} />
              <StatusRow label="Pending" value={pendingCount} />
              <StatusRow label="Belum Bayar" value={unpaidCount} />
            </div>
            <div className="status-column-clean">
              <div className="status-column-header">Kamar</div>
              <StatusRow label="Terisi" value={totalOccupiedRoom} />
              <StatusRow label="Tersedia" value={totalAvailableRoom} />
            </div>
          </div>
        </Card>

        {/* Floor Status */}
        {/* 🔵 COMPONENT: Card */}
        <Card className="dashboard-section floor-status-card">
                    <h2 className="section-title-clean">Tingkat Hunian</h2>
          <div className="floor-chart-clean">
            <svg viewBox="0 0 200 200" className="donut-chart-clean">
              <circle cx="100" cy="100" r="70" fill="none" stroke="#e5e7eb" strokeWidth="20" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="440" strokeDashoffset={440 - (440 * occupancyRate) / 100} transform="rotate(-90 100 100)" />
            </svg>
            <div className="chart-center-clean">
              <div className="chart-percentage-clean">{occupancyRate}%</div>
            </div>
          </div>
          <div className="floor-legend-clean">
            <div className="legend-item-clean">
              <span className="legend-dot-clean blue"></span>
              <span>Terisi</span>
            </div>
            <div className="legend-item-clean">
              <span className="legend-dot-clean gray"></span>
              <span>Tersedia</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ========== OCCUPANCY + FEEDBACK ========== */}
      <div className="dashboard-row-clean">
        {/* Occupancy Statistics */}
        {/* 🔵 COMPONENT: Card */}
        <Card className="dashboard-section flex-2">
          <div className="section-header-clean">
            <h2 className="section-title-clean">Occupancy Statistics</h2>
            <button className="btn-filter-clean">📅 Monthly</button>
          </div>
                    <div className="bar-chart-clean">
            {bookingsByMonth.map((item) => (
              <div key={item.month} className="bar-item-clean">
                <div className="bar-column-clean">
                  <div className="bar-fill-clean" style={{ height: `${(item.count / maxMonthly) * 100}%` }}></div>
                </div>
                <div className="bar-label-clean">{item.month}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer Feedback */}
        {/* 🔵 COMPONENT: Card */}
        <Card className="dashboard-section flex-1">
          <div className="section-header-clean">
            <h2 className="section-title-clean">Customers feedback</h2>
            <button className="btn-menu-clean">⋮</button>
          </div>
          <div className="feedback-list-clean">
            {/* 🔵 COMPONENT: FeedbackItem (x3) */}
            {feedbacks.map((feedback, index) => (
              <FeedbackItem
                key={index}
                name={feedback.name}
                text={feedback.text}
                room={feedback.room}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
