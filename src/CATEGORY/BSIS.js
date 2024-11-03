import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { SearchResult } from "../components/SearchResult"; // Import the SearchResult component

export default function BSIS() {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const itemsPerPage = 5; // Change this number to adjust the number of items per page

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:9000/arts/all`);
        setResearches(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchResearches();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter researches based on search query
  const filteredResearches = researches.filter(research =>
    research.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination variables for filtered researches
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResearches = filteredResearches.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Arts and Entertainment</h2>
      {/* Search bar */}
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {currentResearches.map((research) => (
          <li key={research.research_id}>
            {/* Render the SearchResult component for each research */}
            <SearchResult result={research} />
          </li>
        ))}
      </ul>
      {/* Pagination */}
      <div>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastItem >= filteredResearches.length}>
          Next
        </button>
      </div>
    </div>
  );
}
