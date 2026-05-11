// Import library React Router untuk navigasi
import { useNavigate } from 'react-router-dom';
// Import custom hook untuk akses data global
import { useData } from '../context/DataContext';

const Dashboard = () => {
  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();
  
  // Ambil data reservasi dan customer dari Context API
  const { reservations, customers } = useData();

  return (
    <div className="dashboard-page">
      {/* ========== SECTION ATAS: Metrics + Chart ========== */}
      <section className="dashboard-top">
        {/* Card Metrics: Total Bookings & Data Pelanggan */}
        <div className="dashboard-metrics">
          {/* Card 1: Total Bookings (jumlah reservasi) */}
          <article className="dashboard-card">
            <p className="card-label">📊 Total Bookings</p>
            {/* Tampilkan jumlah reservasi secara dinamis dari Context */}
            <h3 className="card-value">{reservations.length}</h3>
          </article>
          
          {/* Card 2: Data Pelanggan (jumlah customer) */}
          <article className="dashboard-card">
            <p className="card-label">👥 Data Pelanggan</p>
            {/* Tampilkan jumlah customer secara dinamis dari Context */}
            <h3 className="card-value">{customers.length}</h3>
          </article>
        </div>

        {/* Card Revenue Stat: Chart pendapatan mingguan */}
        <article className="dashboard-stat-card">
          <div className="stat-header">
            <div>
              <p className="card-label">Revenue Stat</p>
              {/* Total revenue (hardcoded, bisa diganti dengan data real) */}
              <h3 className="stat-title">$250,000.50</h3>
            </div>
            {/* Badge periode: Monthly */}
            <div className="stat-badge">Monthly</div>
          </div>

          {/* Bar Chart: Pendapatan per hari */}
          <div className="chart-row">
            {/* Bar untuk Sabtu (70% tinggi) */}
            <div className="chart-col">
              <div className="chart-bar" style={{ height: '70%' }} />
              <span className="chart-label">Sat</span>
            </div>
            
            {/* Bar untuk Minggu (85% tinggi) */}
            <div className="chart-col">
              <div className="chart-bar tall" style={{ height: '85%' }} />
              <span className="chart-label">Sun</span>
            </div>
            
            {/* Bar untuk Senin (96% tinggi - tertinggi) */}
            <div className="chart-col">
              <div className="chart-bar tall" style={{ height: '96%' }} />
              <span className="chart-label">Mon</span>
            </div>
            
            {/* Bar untuk Selasa (80% tinggi) */}
            <div className="chart-col">
              <div className="chart-bar tall" style={{ height: '80%' }} />
              <span className="chart-label">Tue</span>
            </div>
            
            {/* Bar untuk Rabu (75% tinggi) */}
            <div className="chart-col">
              <div className="chart-bar" style={{ height: '75%' }} />
              <span className="chart-label">Wed</span>
            </div>
          </div>
        </article>
      </section>

      {/* ========== SECTION BAWAH: Daftar Reservasi + Recent Booking + Performance ========== */}
      <section className="dashboard-lower">
        {/* Card 1: Daftar Reservasi (Grid View) */}
        <article className="dashboard-reservasi-card">
          <div className="card-heading">
            <h3>Daftar Reservasi</h3>
          </div>
          
          {/* Grid: Tampilkan 4 reservasi pertama */}
          <div className="reservasi-grid">
            {/* .slice(0, 4) = ambil 4 data pertama dari array reservations */}
            {reservations.slice(0, 4).map((item) => (
              <div
                key={item.id} // Key unik untuk setiap item (wajib di React)
                className="reservasi-grid-item"
                onClick={() => navigate('/reservations')} // Klik card → ke halaman reservasi
                style={{ cursor: 'pointer' }}
              >
                {/* Header: ID + Status Pembayaran */}
                <div className="reservasi-grid-header">
                  <span className="reservasi-id">{item.id}</span>
                  {/* Status: Lunas (hijau) atau lainnya (merah) */}
                  <span className={`reservasi-status ${item.payment === 'Lunas' ? 'paid' : 'unpaid'}`}>
                    {item.payment}
                  </span>
                </div>
                
                {/* Detail: Nama + Nomor Reservasi */}
                <div className="reservasi-grid-detail">
                  <p className="reservasi-name">{item.name}</p>
                  <p className="reservasi-code">{item.reservation}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Card 2: Recent Booking (Table View) */}
        <article className="dashboard-table-card">
          <div className="card-heading">
            <h3>Recent Booking</h3>
            {/* Tombol View All: navigasi ke halaman reservasi */}
            <button type="button" onClick={() => navigate('/reservations')}>View All</button>
          </div>
          
          {/* Table: Tampilkan 4 reservasi pertama */}
          <div className="table-list">
            {/* Header Table */}
            <div className="table-header">
              <span>Booking ID</span>
              <span>Guest</span>
              <span>Property</span>
            </div>
            
            {/* Body Table: Loop 4 reservasi pertama */}
            {reservations.slice(0, 4).map((item) => (
              <div key={item.id} className="table-row">
                <div>{item.reservation}</div> {/* Nomor reservasi */}
                <div>{item.name}</div>         {/* Nama tamu */}
                <div>Hotel Room</div>          {/* Tipe property (hardcoded) */}
              </div>
            ))}
          </div>
        </article>

        {/* Card 3: Property Performance */}
        <article className="dashboard-performance-card">
          <div className="card-heading">
            <h3>Property Performance</h3>
            <button type="button">View All</button>
          </div>
          
          {/* List Performance: Data hardcoded (bisa diganti dengan data real) */}
          <div className="performance-list">
            {/* Loop 3 tipe property */}
            {[
              { type: 'Hotels', total: '1,642', revenue: '$184,350' },
              { type: 'Apartments', total: '1,248', revenue: '$92,670' },
              { type: 'Vacation Homes', total: '652', revenue: '$107,501' },
            ].map((row) => (
              <div key={row.type} className="performance-item">
                <div>
                  <p className="performance-title">{row.type}</p>      {/* Tipe property */}
                  <p className="performance-value">{row.total}</p>     {/* Total unit */}
                </div>
                <p className="performance-value">{row.revenue}</p>     {/* Total revenue */}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default Dashboard;
