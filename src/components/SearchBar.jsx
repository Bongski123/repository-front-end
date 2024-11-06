import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./CSS/Searchbar.css";
import Footer from "./Footer";

function SearchBar({ suggestions = [], small = false }) {
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState("Listening...");
  const navigate = useNavigate();
  let debounceTimer;
  let recognition;

  useEffect(() => {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setModalText(transcript);
      setTimeout(() => setModalShow(false), 2000);
      simulateTyping(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setModalShow(false);
    };

    return () => {
      if (recognition) recognition.abort();
      clearTimeout(debounceTimer);
    };
  }, []);

  const simulateTyping = (text) => {
    let index = 0;
    const typeCharacter = () => {
      if (index < text.length) {
        setInput((prevInput) => prevInput + text[index]);
        index++;
        setTimeout(typeCharacter, 100);
      } else {
        performSearch(text);
      }
    };
    typeCharacter();
  };

  const handleInputChange = (value) => {
    setInput(value);
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      if (value.length > 0) {
        const filtered = suggestions.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions([]);
      }
    }, 300);
  };

  const handleInputFocus = () => {
    setShowRecentSearches(true);
  };

  const performSearch = (value) => {
    setLoading(true);
    if (value && !recentSearches.includes(value)) {
      setRecentSearches((prevSearches) => [value, ...prevSearches].slice(0, 5));
    }

    fetch(`https://ccsrepo.onrender.com/search/fuse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: value }),
    })
      .then((response) => response.json())
      .then((json) => {
        setLoading(false);
        if (Array.isArray(json.results)) {
          navigate(`/results?query=${encodeURIComponent(value)}`, {
            state: { results: json.results },
          });
        } else {
          console.error("Invalid results format");
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
    setShowRecentSearches(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setShowRecentSearches(false);
  };

  const handleClearInput = () => {
    setInput("");
    setFilteredSuggestions([]);
    setShowRecentSearches(false);
  };

  const handleVoiceSearch = () => {
    setModalText("Listening...");
    setModalShow(true);
    recognition.start();
  };

  return (
    <Container fluid className={`search-container ${small ? "small" : ""}`}>
      <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input
          placeholder="Title, Author, Keyword, etc.."
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit();
          }}
        />
        {input && (
          <button className="clear-button" onClick={handleClearInput}>
            &times;
          </button>
        )}
        <button onClick={handleSearchSubmit} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
        <button onClick={handleVoiceSearch} disabled={loading}>
          <FaMicrophone />
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

      {/* Voice Recognition Modal */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <div className="voice-recognition-modal">
          <FaMicrophone className="microphone-icon" />
          <div className="voice-recognition-text">{modalText}</div>
        </div>
      </Modal>
    </Container>
  );
}

export { SearchBar };
