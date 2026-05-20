// Import library React Router untuk navigasi
import { useNavigate } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';
// Import komponen reusable
import { Button, MetricCard, RoomCard, StatusRow, FeedbackItem, Card } from '../components';

const Dashboard = () => {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();

  // Ambil data reservasi dan customer dari Context API
  const { reservations } = useData();

  // Hitung statistik
  const totalCheckIn = reservations.filter(r => r.payment === 'Lunas').length;
  const totalCheckOut = reservations.filter(r => r.payment === 'Pending').length;
  const totalInHotel = reservations.length;
  const totalAvailableRoom = 10;
  const totalOccupiedRoom = 90;

  // Data rooms
  const rooms = [
    { title: 'Single sharing', availability: '2/30', price: 568, badge: '2 Deals' },
    { title: 'Double sharing', availability: '2/35', price: 1068, badge: '2 Deals' },
    { title: 'Triple sharing', availability: '2/25', price: 1568 },
    { title: 'VIP Suit', availability: '4/10', price: 2568 }
  ];

  // Data feedback
  const feedbacks = [
    { name: 'Mark', text: 'Food could be better.', room: 'A201' },
    { name: 'Christian', text: 'Facilities are not enough for amount paid.', room: 'A101' },
    { name: 'Alexander', text: 'Room cleaning could be better.', room: 'A301' }
  ];

  return (
    <div className="dashboard-page-clean">
      {/* ========== HEADER ========== */}
      <div className="dashboard-header-clean">
        <div className="dashboard-date-clean">Friday, November 18, 2022</div>
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
          <h2 className="section-title-clean">Room status</h2>
          <div className="status-grid-clean">
            <div className="status-column-clean">
              <div className="status-column-header">Occupied rooms</div>
              <StatusRow label="Clean" value={90} />
              <StatusRow label="Dirty" value={4} />
              <StatusRow label="Inspected" value={60} />
            </div>
            <div className="status-column-clean">
              <div className="status-column-header">Available rooms</div>
              <StatusRow label="Clean" value={30} />
              <StatusRow label="Dirty" value={19} />
              <StatusRow label="Inspected" value={30} />
            </div>
          </div>
        </Card>

        {/* Floor Status */}
        {/* 🔵 COMPONENT: Card */}
        <Card className="dashboard-section floor-status-card">
          <h2 className="section-title-clean">Floor status</h2>
          <div className="floor-chart-clean">
            <svg viewBox="0 0 200 200" className="donut-chart-clean">
              <circle cx="100" cy="100" r="70" fill="none" stroke="#e5e7eb" strokeWidth="20" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="440" strokeDashoffset="88" transform="rotate(-90 100 100)" />
            </svg>
            <div className="chart-center-clean">
              <div className="chart-percentage-clean">80%</div>
            </div>
          </div>
          <div className="floor-legend-clean">
            <div className="legend-item-clean">
              <span className="legend-dot-clean blue"></span>
              <span>Completed</span>
            </div>
            <div className="legend-item-clean">
              <span className="legend-dot-clean gray"></span>
              <span>Yet to Complete</span>
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
            {[
              { month: 'May', value: 80 },
              { month: 'Jun', value: 60 },
              { month: 'Jul', value: 75 },
              { month: 'Aug', value: 50 },
              { month: 'Sep', value: 90 },
              { month: 'Oct', value: 85 },
              { month: 'Nov', value: 80 },
              { month: 'Dec', value: 75 },
              { month: 'Jan', value: 95 },
              { month: 'Feb', value: 100 },
            ].map((item) => (
              <div key={item.month} className="bar-item-clean">
                <div className="bar-column-clean">
                  <div className="bar-fill-clean" style={{ height: `${item.value}%` }}></div>
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
