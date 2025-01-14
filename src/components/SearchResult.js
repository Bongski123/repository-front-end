import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchResult({ result }) {
  const [selectedFormat, setSelectedFormat] = useState("APA");
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch PDF when the component mounts or result changes
  useEffect(() => {
    if (!result?.research_id) return;

    const fetchPDF = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://ccsrepo.onrender.com/pdf/${result.research_id}`,
          { responseType: "blob" }
        );
        const pdfBlob = response.data;
        setFileData(URL.createObjectURL(pdfBlob));
        setError(null);
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Unable to fetch PDF. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, [result]);

  // Function to log a search when a result is clicked
  const logSearch = async (researchId) => {
    try {
      const response = await axios.post('https://ccsrepo.onrender.com/log-search', {
        researchId,
      });
      console.log(response.data.message); // Logs: 'Search logged successfully'
    } catch (error) {
      console.error('Error logging search:', error);
    }
  };

 

  // Handle navigation to the details page
  const handleNavigate = () => {
    // Log the search before navigating to details
    logSearch(result.research_id);
    navigate("/details", { state: { result } });
  };

  // Return null if there's no valid result
  if (!result) return null;

  return (
    <div
      className="search-result"
      style={{ marginBottom: "5px", cursor: "pointer" }}
      onClick={handleNavigate}
    >
      <h3 style={{ fontSize: "16px", fontWeight: "500", margin: "0" }}>
        {result.title}
      </h3>
      <p style={{ fontSize: "12px", margin: "0" }}>Authors: {result.authors}</p>
    </div>
  );
}

export { SearchResult };
