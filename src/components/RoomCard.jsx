// ========================================
// 🏨 ROOM CARD COMPONENT
// ========================================
// Komponen untuk menampilkan kartu informasi kamar hotel
//
// Props:
// - title: string - Nama tipe kamar (contoh: "Single sharing", "VIP Suit")
// - availability: string - Ketersediaan kamar (contoh: "2/30")
// - price: number - Harga kamar per malam
// - badge: string (optional) - Badge promo (contoh: "2 Deals")
// - onMenuClick: function - Handler ketika tombol menu diklik
//
// Contoh Penggunaan:
// <RoomCard 
//   title="Single sharing" 
//   availability="2/30" 
//   price={568} 
//   badge="2 Deals"
//   onMenuClick={() => console.log('Menu clicked')}
// />
// ========================================

const RoomCard = ({ title, availability, price, badge, onMenuClick }) => {
  return (
    <div className="room-card-clean">
      <div className="room-card-header-clean">
        {badge && <span className="room-badge-clean">{badge}</span>}
        <button className="room-menu-btn-clean" onClick={onMenuClick}>⋮</button>
      </div>
      <h3 className="room-title-clean">{title}</h3>
      <div className="room-availability-clean">{availability}</div>
      <div className="room-price-clean">$ {price}<span className="price-period">/day</span></div>
    </div>
  );
};

export default RoomCard;
