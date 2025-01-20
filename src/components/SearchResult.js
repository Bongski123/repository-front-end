import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Function to highlight matching text
const highlightText = (text, query) => {
  if (!query || !text) return text; // Return text as is if no query or text
  const regex = new RegExp(`(${query})`, "gi"); // Match query as substring (case-insensitive)
  return text.replace(regex, "<strong>$1</strong>"); // Wrap matched text in <strong> tag to bold it
};

// Function to truncate text to a specified number of words
const truncateText = (text, wordLimit = 20) => {
  if (!text) return "";
  const words = text.split(/\s+/); // Split text into words
  const truncated = words.slice(0, wordLimit).join(" "); // Take the first 'wordLimit' words
  return truncated + (words.length > wordLimit ? "..." : ""); // Add ellipsis if text is truncated
};

function SearchResult({ result, query }) {
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
      const response = await axios.post("https://ccsrepo.onrender.com/log-search", {
        researchId,
      });
      console.log(response.data.message); // Logs: 'Search logged successfully'
    } catch (error) {
      console.error("Error logging search:", error);
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

  // Highlight and truncate abstract
  const truncatedAbstract = truncateText(result.abstract, 20);
  const highlightedAbstract = highlightText(truncatedAbstract, query);

  // Debugging logs
  console.log("Original Abstract:", result.abstract);
  console.log("Query:", query);
  console.log("Processed Abstract:", highlightedAbstract);

  return (
    <div
      className="search-result"
      style={{ marginBottom: "15px", cursor: "pointer" }}
      onClick={handleNavigate}
    >
      <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0", color: "#036d11" }}>
        {result.title}
      </h3>
      <p
        style={{
          fontSize: "14px",
          margin: "0",
          fontFamily: "sans-serif",
          fontStyle: "italic",
        }}
      >
        Authors: {result.authors}
      </p>
      <p
        style={{ fontSize: "15px", margin: "0", color: "#333" }}
        dangerouslySetInnerHTML={{
          __html: highlightedAbstract, // Render truncated abstract with highlighted query letters
        }}
        
      />
    </div>
  );
}

export { SearchResult };
