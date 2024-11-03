import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./CSS/RelatedSearches.css";

function RelatedSearches({ suggestions }) {
  return (
    <div className="related-searches">
      <h4>Related searches</h4>
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index}>
            <Link to={`?query=${encodeURIComponent(suggestion)}`}>
              {suggestion}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RelatedSearches;
