import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page area, and last page with ellipsis
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-8 gap-2">
      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Trước
      </button>

      {generatePageNumbers().map((pageNum, idx) => (
        pageNum === '...' ? (
          <span key={idx} className="px-3 py-1">...</span>
        ) : (
          <button
            key={pageNum}
            className={`px-3 py-1 rounded ${currentPage === pageNum
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        )
      ))}

      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Sau
      </button>
    </div>
  );
};

export default Pagination;
