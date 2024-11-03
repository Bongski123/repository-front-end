// Pagination.js
import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <BootstrapPagination>
      {[...Array(totalPages)].map((_, index) => (
        <BootstrapPagination.Item
          key={index + 1}
          active={index + 1 === currentPage}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </BootstrapPagination.Item>
      ))}
    </BootstrapPagination>
  );
};

export { Pagination };
