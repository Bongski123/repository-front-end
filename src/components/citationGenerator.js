import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

function CitationGeneratorDropdown({ result }) {
  const [selectedFormat, setSelectedFormat] = useState("APA");
  const [generatedCitation, setGeneratedCitation] = useState("");

  // Memoized function to generate citation based on selected format
  const generateCitation = useCallback(() => {
    const authors = Array.isArray(result?.authors) ? result.authors.join(", ") : result?.authors || "Unknown author";
    const title = result?.title || "Untitled";
    const categoryName = result?.category_name || "Unknown category";
    const url = result?.url || "#";

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

  // Handle citation format change
  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  // Handle citation copy
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
      .catch((err) => {
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

  useEffect(() => {
    if (result) {
      setGeneratedCitation(generateCitation());
    }
  }, [generateCitation, result]);

  return (
    <div className="custom-citation-dropdown">
      <h2 className="dropdown-title">Citation</h2>
      <p className="dropdown-description">Select a citation format and copy the generated citation.</p>
      <select value={selectedFormat} onChange={handleFormatChange} className="dropdown-select">
        <option value="APA">APA</option>
        <option value="MLA">MLA</option>
        <option value="Harvard">Harvard</option>
      </select>
      <button onClick={handleCopyCitation} className="dropdown-copy-btn">
        Copy Citation
      </button>
      {generatedCitation && <p className="dropdown-citation">{generatedCitation}</p>}
    </div>
  );
}

export default CitationGeneratorDropdown;
