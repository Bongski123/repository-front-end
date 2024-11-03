import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchResultList } from "./SearchResultList"; // Ensure this path is correct
import Container from "react-bootstrap/Container";
import { SearchBar } from "./SearchBar"; // Ensure this path is correct
import "./CSS/SearchResultsPage.css"; // Import your CSS file for styling

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const query = useQuery().get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultCount, setResultCount] = useState(0); // New state for result count

  useEffect(() => {
    const fetchResults = async () => {
      const searchAlgorithm = "fuse";

      try {
        const response = await fetch(`http://localhost:9000/search/${searchAlgorithm}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const json = await response.json();
        if (Array.isArray(json.results)) {
          const sortedResults = json.results.sort((a, b) => b.relevance - a.relevance);
          setResults(sortedResults);
          setResultCount(json.results.length); // Set result count
        } else {
          console.error("JSON data is not an array");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container fluid className="search-results-page">
      <h2>Search Results for "{query}"</h2>
      <p>About {resultCount} results</p> {/* Display result count */}
      <div className="search-results-layout">
        <SearchBar suggestions={results.map(result => result.title)} small />
        <SearchResultList results={results} />
      </div>
    </Container>
  );
}

export default SearchResultsPage;
