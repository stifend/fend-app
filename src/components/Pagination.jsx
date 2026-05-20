// ========================================
// 📄 PAGINATION COMPONENT
// ========================================
// Komponen pagination reusable untuk navigasi halaman
//
// PROPS:
// - currentPage: number
// - totalPages: number
// - onPageChange: function
// - className: string
//
// CONTOH PENGGUNAAN:
// import { Pagination } from './components';
// <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
// ========================================

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
  ...props
}) => {
  // Generate array of page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Maksimal tombol yang ditampilkan

    if (totalPages <= maxVisible) {
      // Jika total halaman sedikit, tampilkan semua
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Jika banyak, tampilkan dengan ellipsis
      if (currentPage <= 3) {
        // Di awal
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Di akhir
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Di tengah
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  // Handle page click
  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Handle previous
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle next
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`pagination-component ${className}`.trim()} {...props}>
      {/* Previous Button */}
      <button
        className={`pagination-btn pagination-prev ${currentPage === 1 ? 'pagination-disabled' : ''}`.trim()}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      <div className="pagination-pages">
        {pages.map((page, index) => (
          <button
            key={index}
            className={`pagination-page ${page === currentPage ? 'pagination-active' : ''} ${page === '...' ? 'pagination-ellipsis' : ''}`.trim()}
            onClick={() => handlePageClick(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        className={`pagination-btn pagination-next ${currentPage === totalPages ? 'pagination-disabled' : ''}`.trim()}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;

// Contoh penggunaan:
// <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
