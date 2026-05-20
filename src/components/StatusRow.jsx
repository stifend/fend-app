// ========================================
// 📋 STATUS ROW COMPONENT
// ========================================
// Komponen untuk menampilkan baris status dengan label dan nilai
//
// Props:
// - label: string - Label status (contoh: "Occupied rooms", "Clean")
// - value: number - Nilai status
//
// Contoh Penggunaan:
// <StatusRow label="Occupied rooms" value={104} />
// <StatusRow label="Clean" value={90} />
// ========================================

const StatusRow = ({ label, value }) => {
  return (
    <div className="status-row-clean">
      <span className="status-label-clean">{label}</span>
      <span className="status-value-clean">{value}</span>
    </div>
  );
};

export default StatusRow;
