import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./CSS/Searchbar.css";
import Footer from "./Footer";

// Manual fuzzy search function

const fuzzySearch = (query, target) => {
  if (!query || !target) return 0; // Return 0 if no query or target
  let i = 0;
  let j = 0;
  let score = 0;

  while (i < query.length && j < target.length) {
    if (query[i].toLowerCase() === target[j].toLowerCase()) {
      score++; // Increment score for each match
      i++;
    }
    j++;
  }
  return score; 
};

// Function to highlight matching text, including in long abstracts
const highlightText = (text, query) => {
  if (!text || !query) return text; 
  const regex = new RegExp(`(${query})`, "gi"); 
  return text.replace(regex, "<strong>$1</strong>"); 
};


function SearchBar({ small = false }) {
  const [input, setInput] = useState("");
  const [filteredResearches, setFilteredResearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState("Listening...");
  const [researchData, setResearchData] = useState([]);
  const navigate = useNavigate();
  let debounceTimer;
  let recognition;

  useEffect(() => {
    // Fetch research data
    fetch("https://ccsrepo.onrender.com/researches")
      .then((response) => response.json())
      .then((data) => {
        setResearchData(data);
      })
      .catch((error) => {
        console.error("Error fetching research data:", error);
      });

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
      if (value.trim().length > 0) {
        const startTime = performance.now();

        const filtered = researchData.map((research) => {
          const titleScore = fuzzySearch(value, research.title ?? "") * 2; // Double weight for title
          const authorsScore = fuzzySearch(value, research.authors ?? "");
          const keywordsScore = fuzzySearch(value, research.keywords ?? "");
          const abstractScore = fuzzySearch(value, research.abstract ?? "") * 1.6; // 1.5x weight for abstract
          const categoryScore = fuzzySearch(value, research.category ?? "");

          const totalScore = titleScore + authorsScore + keywordsScore + abstractScore + categoryScore;

          const matchIndex = (research.abstract ?? "").toLowerCase().indexOf(value.toLowerCase());
          const snippet = matchIndex >= 0
            ? research.abstract.substring(Math.max(matchIndex - 30, 0), Math.min(matchIndex + 30, research.abstract.length))
            : "";

          return {
            ...research,
            score: totalScore,
            snippet,
          };
        });

        const sortedFiltered = filtered
          .filter((research) => research.score > 0)
          .sort((a, b) => b.score - a.score);

        const endTime = performance.now();
        console.log(`Search time: ${endTime - startTime} ms`);

        setFilteredResearches(sortedFiltered);
      } else {
        setFilteredResearches([]);
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
  
    const startTime = performance.now();
  
    const filteredResults = researchData.map((research) => {
      const titleScore = fuzzySearch(value, research.title ?? "") * 2;
      const authorsScore = fuzzySearch(value, research.authors ?? "");
      const keywordsScore = fuzzySearch(value, research.keywords ?? "");
      const abstractScore = fuzzySearch(value, research.abstract ?? "") * 1.5; // Enhance the weight for abstract
      const categoryScore = fuzzySearch(value, research.category ?? "");
  
      const totalScore = titleScore + authorsScore + keywordsScore + abstractScore + categoryScore;
  
      // Update snippet generation to handle long abstracts better
      const matchIndex = (research.abstract ?? "").toLowerCase().indexOf(value.toLowerCase());
      let snippet = "";
      if (matchIndex >= 0) {
        const snippetStart = Math.max(matchIndex - 30, 0); // 30 characters before the match
        const snippetEnd = Math.min(matchIndex + 30 + value.length, research.abstract.length); // 30 characters after the match
        snippet = research.abstract.substring(snippetStart, snippetEnd);
      }
  
      return {
        ...research,
        score: totalScore,
        snippet,
      };
    });
  
    const sortedFilteredResults = filteredResults
      .filter((research) => research.score > 0)
      .sort((a, b) => b.score - a.score);
  
    const endTime = performance.now();
    console.log(`Search time: ${endTime - startTime} ms`);
  
    setLoading(false);
    if (sortedFilteredResults.length > 0) {
      navigate(`/results?query=${encodeURIComponent(value)}`, {
        state: { results: sortedFilteredResults },
      });
    } else {
      console.error("No results found");
    }
  };
  

  const handleSearchSubmit = () => {
    if (input.trim()) {
      performSearch(input);
    }
  };

  const handleSuggestionClick = (research) => {
    setInput(research.title);
    setFilteredResearches([]);
    performSearch(research.title);
  };

  const handleRecentSearchClick = (search) => {
    setInput(search);
    setFilteredResearches([]);
    performSearch(search);
    setShowRecentSearches(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setShowRecentSearches(false);
  };

  const handleClearInput = () => {
    setInput("");
    setFilteredResearches([]);
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
          {loading ? "Searching..." : "Search"}
        </button>
        <button onClick={handleVoiceSearch} disabled={loading}>
          <FaMicrophone />
        </button>
      </div>

      
      {filteredResearches.length > 0 && (
        <ul className="suggestions-list">
          {filteredResearches.slice(0, 5).map((research, index) => (
            <li key={index} onClick={() => handleSuggestionClick(research)}>
              <div
                className="highlighted-text"
                dangerouslySetInnerHTML={{
                  __html: `${highlightText(research.title, input)} by ${highlightText(research.authors, input)}`,
                }}
              />
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
