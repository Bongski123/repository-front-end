import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CSS/Searchbar.css"; // Add a CSS file for styling
import Footer from "./Footer";

function SearchBar({ suggestions = [], small = false }) {
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (value) => {
    setInput(value);
    if (value.length > 0) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleInputFocus = () => {
    setShowRecentSearches(true); // Show recent searches when input is focused
  };

  const performSearch = (value) => {
    const searchAlgorithm = "fuse";
    setLoading(true);

    // Add the search term to recent searches if not already present
    if (value && !recentSearches.includes(value)) {
      setRecentSearches((prevSearches) => [value, ...prevSearches].slice(0, 5)); // Keep only the last 5 searches
    }

    fetch(`http://localhost:9000/search/${searchAlgorithm}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: value }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        setLoading(false);
        if (Array.isArray(json.results)) {
          navigate(`/results?query=${encodeURIComponent(value)}`, {
            state: { results: json.results },
          });
        } else {
          console.error("JSON data is not an array");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data:", error);
      });
  };

  const handleSearchSubmit = () => {
    performSearch(input);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setFilteredSuggestions([]);
    performSearch(suggestion);
  };

  const handleRecentSearchClick = (search) => {
    setInput(search);
    setFilteredSuggestions([]);
    performSearch(search);
    setShowRecentSearches(false); // Hide recent searches after selection
  };

  return (
    <Container fluid className={`search-container ${small ? 'small' : ''}`}>
      <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input
          placeholder="Title, Author, Keyword, etc.."
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus} // Show recent searches on focus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit();
            }
          }}
        />
        <button onClick={handleSearchSubmit} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Suggestions List */}
      {filteredSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {filteredSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* Recent Searches List */}
      {showRecentSearches && recentSearches.length > 0 && (
        <ul className="suggestions-list recent-searches">
          {recentSearches.map((search, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => handleRecentSearchClick(search)}
            >
              {search}
            </li>
          ))}
        </ul>
      )}
    </Container>
   
  );
}

export { SearchBar };
