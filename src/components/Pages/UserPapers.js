import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserSidebar from '../UserSidebar';
import '../CSS/UserPaper.css';  // Import the CSS file

const getCurrentUserId = () => {
  return localStorage.getItem('userId');
};

const UserPaper = () => {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedResearch, setExpandedResearch] = useState(null);

  useEffect(() => {
    const fetchResearches = async () => {
      setLoading(true);
      const userId = getCurrentUserId();
      if (!userId) {
        setError('No user ID found in local storage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:9000/user/researches/${userId}`);
        setResearches(response.data.data);
      } catch (err) {
        setError(`Error fetching research papers: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchResearches();
  }, []);

  const toggleDetails = (researchId) => {
    setExpandedResearch(expandedResearch === researchId ? null : researchId);
  };

  return (
    <div className="container">
      <UserSidebar />
      <h1 className="header">My Research Papers</h1>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : researches.length > 0 ? (
        <ul className="research-list">
          {researches.map((research) => (
            <li
              key={research.research_id}
              className="research-item"
              onClick={() => toggleDetails(research.research_id)}
            >
              <h2>{research.title}</h2>
              {expandedResearch === research.research_id && (
                <div className="research-details">
                  <p><strong>Status:</strong> {research.status}</p>
                  <p><strong>Published on:</strong> {new Date(research.publish_date).toLocaleDateString()}</p>
                  <p><strong>Abstract:</strong> {research.abstract}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No research papers available.</p>
      )}
    </div>
  );
};

export default UserPaper;
