import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const highlightText = (text, query) => {
  if (!query || !text) return text; 
  const regex = new RegExp(`(${query})`, "gi"); 
  return text.replace(regex, "<strong>$1</strong>"); 
};

const truncateText = (text, wordLimit = 20) => {
  if (!text) return "";
  const words = text.split(/\s+/); 
  const truncated = words.slice(0, wordLimit).join(" ");
  return truncated + (words.length > wordLimit ? "..." : ""); 
};

function SearchResult({ result, query }) {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleNavigate = () => {
    logSearch(result.research_id);
    navigate("/details", { state: { result } });
  };

  if (!result) return null;

  const truncatedAbstract = truncateText(result.abstract, 20);
  const highlightedAbstract = highlightText(truncatedAbstract, query);
  const formattedAuthors = result.authors.split(",").join(", ");
  const formattedKeywords = result.keywords.split(",").join(", ");

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
        Authors: {formattedAuthors}
      </p>
      <p
        style={{
          fontSize: "14px",
          margin: "0",
          fontFamily: "sans-serif",
          fontStyle: "italic",
        }}
      >
        Keywords: {formattedKeywords}
      </p>
      <p
        style={{ fontSize: "15px", margin: "0", color: "#333" }}
        dangerouslySetInnerHTML={{
          __html: highlightedAbstract,
        }}
      />
    </div>
  );
}

export { SearchResult };
