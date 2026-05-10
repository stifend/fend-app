import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ReservationPage = () => {
  const navigate = useNavigate();
  const { reservations } = useData();

  const handleViewDetail = (item) => {
    navigate(`/reservation-detail/${item.id}`, { state: item });
  };

  return (
    <div className="reservation-page">
      <div className="reservation-header">
        <h2>Daftar Reservasi</h2>
      </div>
      <div className="reservation-content">
        <div className="reservasi-list-card">
          {reservations.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#64748b',
              fontSize: '16px'
            }}>
              <p>📋 Tidak ada data reservasi</p>
            </div>
          ) : (
            <div className="reservasi-table">
              <div className="table-header-reservasi">
                <span>ID</span>
                <span>Nama</span>
                <span>No. Reservasi</span>
                <span>Status</span>
                <span>Aksi</span>
              </div>
              {reservations.map((item) => (
                <div key={item.id} className="table-row-reservasi">
                  <span className="table-cell">{item.id}</span>
                  <span className="table-cell">{item.name}</span>
                  <span className="table-cell">{item.reservation}</span>
                  <span className={`table-cell status ${item.payment === 'Lunas' ? 'paid' : 'unpaid'}`}>
                    {item.payment}
                  </span>
                  <span className="table-cell">
                    <button type="button" className="btn-view" onClick={() => handleViewDetail(item)}>
                      Lihat Detail
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
