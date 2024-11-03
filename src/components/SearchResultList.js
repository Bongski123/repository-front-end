import React, { useState } from "react";
import { SearchResult } from "./SearchResult"; // Ensure this path is correct
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button"; // Import Bootstrap Button for pagination controls
import "./CSS/SearchResultList.css"; // Custom styles for the search results

function SearchResultList({ results }) {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10; // Number of results to display per page

  // Calculate the index of the first and last results on the current page
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;

  // Get the current results
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  // Calculate total pages
  const totalPages = Math.ceil(results.length / resultsPerPage);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!results || results.length === 0) {
    return <Container>No results found</Container>;
  }

  return (
    <Container fluid className="search-results-container">
      <div className="results-list">
        {currentResults.map((result) => (
          <SearchResult result={result} key={result.research_id} />
        ))}

         {/* Pagination Controls */}
      <div className="pagination">
        <Button
          className={currentPage === 1 ? "disabled" : ""}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span> Page {currentPage} of {totalPages} </span>
        <Button
          className={currentPage === totalPages ? "disabled" : ""}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      </div>

     
    </Container>
  );
}

export { SearchResultList };
