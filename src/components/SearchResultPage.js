// SearchResultsPage.js
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

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`https://ccsrepo.onrender.com/search/fuse`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const json = await response.json();
        setResults(json.results || []);
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
    return (
      <Container className="loading-container">
        <div className="spinner"></div>
      </Container>
    );
  }

  return (
    <Container fluid className="search-results-page">
      <h2>Search Results for "{query}"</h2>
      <div className="search-results-layout">
        <SearchBar suggestions={results.map((result) => result.title)} small />
        <SearchResultList results={results} query={query} />
      </div>
    </Container>
  );
}

export default SearchResultsPage;
