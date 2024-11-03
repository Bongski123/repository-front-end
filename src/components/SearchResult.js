import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SearchResult.css";

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
          `http://localhost:9000/pdf/${result.research_id}`,
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

  // Handle citation generation based on the selected format
  const generateCitation = () => {
    const currentYear = new Date().getFullYear();
    switch (selectedFormat) {
      case "APA":
        return `${result.authors}. (${currentYear}). "${result.title}".`;
      case "MLA":
        return `${result.authors}. "${result.title}." ${currentYear}.`;
      case "Chicago":
        return `${result.authors}. "${result.title}." ${currentYear}.`;
      default:
        return "Unknown citation format";
    }
  };

  // Handle navigation to the details page
  const handleNavigate = () => {
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
      
      {/* PDF download link or loading/error message */}
      {loading ? (
        <p>Loading PDF...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        fileData && (
          <a
            href={fileData}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "12px" }}
          >
            Download PDF
          </a>
        )
      )}

      {/* Citation Format Selection */}
    
    </div>
  );
}

export { SearchResult };
