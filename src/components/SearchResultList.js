import React from "react";
import Container from "react-bootstrap/Container";
import { SearchResult } from "./SearchResult";

function SearchResultList({ results }) {
  console.log("Results:", results); // Log results to check its contents

  if (!results || results.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <Container fluid className="search-results-container">
      <div className="results-list">
        {results.map((result, id) => {
          return <SearchResult result={result} key={id} />;
        })}
      </div>
    </Container>
  );
}

export { SearchResultList };
