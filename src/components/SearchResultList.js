import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "./CSS/SearchResultList.css"; // Custom styles for the search results

// Function to highlight matching text
const highlightText = (text, query) => {
  if (!query || !text) return text; // Return original text if no query or text
  const regex = new RegExp(`(${query})`, "gi"); // Match query as substring (case-insensitive)
  return text.replace(
    regex,
    "<span style='background-color: yellow; font-weight: bold;'>$1</span>"
  ); // Wrap matched text in <span> with yellow background
};

// Function to create a snippet around the query
const generateSnippet = (text, query) => {
  if (!text || !query) return "";

  const words = text.split(/\s+/); // Split text into words
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const queryIndex = lowerText.indexOf(lowerQuery);

  if (queryIndex === -1) return words.slice(0, 20).join(" ") + "...";

  const wordsBeforeMatch = text.substring(0, queryIndex).trim().split(/\s+/);
  const wordsAfterMatch = text
    .substring(queryIndex + query.length)
    .trim()
    .split(/\s+/);

  const snippetStart = Math.max(0, wordsBeforeMatch.length - 10);
  const snippetBefore = wordsBeforeMatch.slice(snippetStart).join(" ");
  const snippetMatch = text.substring(queryIndex, queryIndex + query.length);
  const snippetAfter = wordsAfterMatch.slice(0, 10).join(" ");

  return (
    (snippetStart > 0 ? "..." : "") +
    snippetBefore +
    " <span style='background-color: yellow;'>" +
    snippetMatch +
    "</span> " +
    snippetAfter +
    (wordsAfterMatch.length > 10 ? "..." : "")
  );
};

// Function to calculate relevance score
const calculateRelevance = (text, query) => {
  const regex = new RegExp(query, "gi");
  const matches = (text.match(regex) || []).length;
  return matches;
};

function SearchResultList({ results, query }) {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10; // Number of results to display per page
  const navigate = useNavigate();

  // Sort results by relevance (number of matches in title, authors, and abstract)
  const sortedResults = results
    .map((result) => {
      const relevance =
        calculateRelevance(result.title, query) +
        calculateRelevance(result.authors, query) +
        calculateRelevance(result.abstract, query);
      return { ...result, relevance };
    })
    .filter((result) => result.relevance > 0) // Only include results with matches
    .sort((a, b) => b.relevance - a.relevance); // Sort by relevance score in descending order

  // Calculate the index of the first and last results on the current page
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;

  // Get the current results
  const currentResults = sortedResults.slice(indexOfFirstResult, indexOfLastResult);

  // Calculate total pages
  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Navigate to the details page
  const handleNavigate = (result) => {
    navigate("/details", { state: { result } });
  };

  if (!results || results.length === 0 || sortedResults.length === 0) {
    return <Container>No results found</Container>;
  }

  return (
    <Container fluid className="search-results-container">
      <div className="results-list">
        {currentResults.map((result) => {
          const highlightedTitle = highlightText(result.title, query);
          const highlightedAuthors = highlightText(result.authors, query);
          const highlightedSnippet = generateSnippet(result.abstract, query);

          return (
            <div
              key={result.research_id}
              className="search-result"
              onClick={() => handleNavigate(result)}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  margin: "0",
                }}
                dangerouslySetInnerHTML={{
                  __html: highlightedTitle, // Render the highlighted title
                }}
              />
              <p
                style={{
                  fontSize: "14px",
                  margin: "0",
                  fontFamily: "sans-serif",
                  fontStyle: "italic",
                  color: "#333",
                }}
                dangerouslySetInnerHTML={{
                  __html: `Authors: ${highlightedAuthors}`, // Render the highlighted authors
                }}
              />
              <p
                style={{
                  fontSize: "15px",
                  margin: "10px 0 0",
                  color: "#333",
                  fontFamily: "Arial, sans-serif",
                  lineHeight: "1.5",
                }}
                dangerouslySetInnerHTML={{
                  __html: highlightedSnippet, // Render the highlighted snippet
                }}
              />
            </div>
          );
        })}

        {/* Pagination Controls */}
        <div className="pagination" style={{ marginTop: "20px" }}>
  {sortedResults.length >= 10 && (
    <>
      <Button
        className={currentPage === 1 ? "disabled" : ""}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <span
        style={{
          margin: "0 10px",
          fontSize: "14px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Page {currentPage} of {totalPages}
      </span>
      <Button
        className={currentPage === totalPages ? "disabled" : ""}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </Button>
    </>
  )}
</div>

      </div>
    </Container>
  );
}

export { SearchResultList };
