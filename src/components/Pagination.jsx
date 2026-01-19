import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // Always show first page
  pages.push(1);

  // Show pages around current page
  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    pages.push(i);
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  // Remove duplicates and sort
  const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>

      {uniquePages.map((page, index) => (
        <React.Fragment key={page}>
          {index > 0 && uniquePages[index - 1] !== page - 1 && (
            <span className="pagination-ellipsis">...</span>
          )}
          <button
            className={`pagination-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        </React.Fragment>
      ))}

      <button
        className="pagination-btn next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
