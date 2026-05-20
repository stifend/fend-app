// ========================================
// 💬 FEEDBACK ITEM COMPONENT
// ========================================
// Komponen untuk menampilkan item feedback pelanggan
//
// Props:
// - name: string - Nama pelanggan
// - text: string - Isi feedback
// - room: string - Nomor kamar pelanggan
//
// Contoh Penggunaan:
// <FeedbackItem 
//   name="Mark" 
//   text="Food could be better." 
//   room="A201" 
// />
// ========================================

const FeedbackItem = ({ name, text, room }) => {
  return (
    <div className="feedback-item-clean">
      <div className="feedback-header-clean">
        <div className="feedback-name-clean">{name}</div>
        <div className="feedback-room-clean">{room}</div>
      </div>
      <div className="feedback-text-clean">{text}</div>
    </div>
  );
};

export default FeedbackItem;
