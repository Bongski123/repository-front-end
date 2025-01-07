import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2"; // Import SweetAlert

function CitationGeneratorDropdown({ result }) {
  const [selectedFormat, setSelectedFormat] = useState("APA");
  const [generatedCitation, setGeneratedCitation] = useState("");

  // Memoized function to generate citation based on selected format
  const generateCitation = useCallback(() => {
    // Safely handle missing data in 'result'
    const authors = Array.isArray(result?.authors) ? result.authors.join(", ") : result?.authors || "Unknown author";
    const title = result?.title || "Untitled";
    const categoryName = result?.category_name || "Unknown category";
    const url = result?.url || "#"; // Fallback URL if missing

    let citation;
    switch (selectedFormat) {
      case "APA":
        citation = `${authors}. (${new Date().getFullYear()}). "${title}".`;
        break;
      case "MLA":
        citation = `${authors}. "${title}." ${categoryName}, ${new Date().getFullYear()}.`;
        break;
      case "Harvard":
        citation = `${authors}. (${new Date().getFullYear()}). ${title}. ${categoryName}. Available at: ${url}. [Accessed: ${new Date().toLocaleDateString()}].`;
        break;
      default:
        citation = "Unknown citation format";
    }
    return citation;
  }, [result, selectedFormat]);

  // Function to handle citation format change
  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  // Function to handle citation generation and copy to clipboard
  const handleCopyCitation = () => {
    const citation = generateCitation();
    setGeneratedCitation(citation);
    navigator.clipboard.writeText(citation)
      .then(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Citation copied to clipboard!',
          icon: 'success',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      })
      .catch(err => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to copy citation',
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        console.error('Failed to copy: ', err);
      });
  };

  // Generate initial citation when the component mounts or when `result` changes
  useEffect(() => {
    if (result) {
      setGeneratedCitation(generateCitation());
    }
  }, [generateCitation, result]);

  return (
    <div className="citation-modal" role="dialog" aria-modal="true" aria-labelledby="citation-modal-title" aria-describedby="citation-modal-description">
      <div className="citation-modal-content">
        <h2 id="citation-modal-title">Citation</h2>
        <p id="citation-modal-description">Select a citation format and copy the generated citation.</p>
        <select 
          value={selectedFormat} 
          onChange={handleFormatChange} 
          aria-label="Select citation format"
        >
          <option value="APA">APA</option>
          <option value="MLA">MLA</option>
          <option value="Harvard">Harvard</option>
        </select>
        <button onClick={handleCopyCitation} aria-label="Copy citation">Copy Citation</button>
        {generatedCitation && <p className="generated-citation">{generatedCitation}</p>}
      </div>
    </div>
  );
}

export default CitationGeneratorDropdown;
