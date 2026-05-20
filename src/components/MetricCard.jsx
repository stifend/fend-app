// ========================================
// 📊 METRIC CARD COMPONENT
// ========================================
// Komponen untuk menampilkan kartu metrik di dashboard
//
// Props:
// - label: string - Label atas (contoh: "Today's", "Total")
// - title: string - Judul metrik (contoh: "Check-in", "Available room")
// - value: number - Nilai metrik yang ditampilkan
//
// Contoh Penggunaan:
// <MetricCard label="Today's" title="Check-in" value={5} />
// <MetricCard label="Total" title="Available room" value={20} />
// ========================================

const MetricCard = ({ label, title, value }) => {
  return (
    <div className="metric-card-clean">
      <div className="metric-label-clean">{label}</div>
      <div className="metric-title-clean">{title}</div>
      <div className="metric-value-clean">{value}</div>
    </div>
  );
};

export default MetricCard;
