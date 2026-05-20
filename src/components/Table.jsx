// ========================================
// 📊 TABLE COMPONENT
// ========================================
// Komponen table reusable untuk menampilkan data tabular
//
// PROPS:
// - columns: array of { header, key, width, render }
// - data: array of objects
// - onRowClick: function
// - className: string
//
// CONTOH PENGGUNAAN:
// import { Table } from './components';
// const columns = [
//   { header: 'Nama', key: 'name', width: '200px' },
//   { header: 'Email', key: 'email' },
//   { header: 'Status', key: 'status', render: (value) => <Badge>{value}</Badge> }
// ];
// <Table columns={columns} data={customers} onRowClick={handleRowClick} />
// ========================================

const Table = ({
  columns = [],
  data = [],
  onRowClick,
  className = '',
  ...props
}) => {
  return (
    <div className={`table-component ${className}`.trim()} {...props}>
      <table className="table">
        {/* Table Header */}
        <thead className="table-thead">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="table-th"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody className="table-tbody">
          {data.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={columns.length} className="table-empty">
                Tidak ada data
              </td>
            </tr>
          ) : (
            // Data rows
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`table-tr ${onRowClick ? 'table-tr-clickable' : ''}`.trim()}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="table-td">
                    {/* Jika ada custom render function, gunakan itu */}
                    {column.render 
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

// Contoh penggunaan:
// const columns = [
//   { header: 'Nama', key: 'name', width: '200px' },
//   { header: 'Email', key: 'email' },
//   { header: 'Status', key: 'status', render: (value) => <Badge>{value}</Badge> }
// ];
// <Table columns={columns} data={customers} onRowClick={handleRowClick} />
