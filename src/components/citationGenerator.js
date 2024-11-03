import React, { useState, useEffect } from "react";

function CitationGeneratorDropdown({ result }) {
  const [selectedFormat, setSelectedFormat] = useState("APA"); // State to store the selected citation format
  const [generatedCitation, setGeneratedCitation] = useState(""); // State to store the generated citation

  // Function to generate citation based on selected format
  const generateCitation = () => {
    let citation;
    switch (selectedFormat) {
      case "APA":
        citation = `${result.authors}. (${new Date().getFullYear()}). "${result.title}".`;
        break;
      case "MLA":
        citation = `${result.authors}. "${result.title}." ${result.category_name}, ${new Date().getFullYear()}.`;
        break;
 
      case "Harvard":
        citation = `${result.authors}. (${new Date().getFullYear()}). ${result.title}. ${result.category_name}. Available at: ${result.url}. [Accessed: ${new Date().toLocaleDateString()}].`;
        break;
      // Add more citation formats here as needed
      default:
        citation = "Unknown citation format";
    }
    return citation;
  };

  // Function to handle citation format change
  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  // Function to handle citation generation
  const handleCopyCitation = () => {
    const citation = generateCitation();
    setGeneratedCitation(citation);
    // Implement copy to clipboard logic here
    navigator.clipboard.writeText(citation);
    alert("Citation copied to clipboard!");
  };

  // Generate initial citation when the component mounts
  useEffect(() => {
    const initialCitation = generateCitation();
    setGeneratedCitation(initialCitation);
  }, [result, selectedFormat]); // Re-generate citation if the result or selected format changes

  return (
    <div className="citation-generator-dropdown">
      <select value={selectedFormat} onChange={handleFormatChange}>
        <option value="APA">APA</option>
        <option value="MLA">MLA</option>
        <option value="Harvard">Harvard</option>
        {/* Add more options for additional citation formats */}
      </select>
      <button onClick={handleCopyCitation}>Copy</button>
      {generatedCitation && <p className="generated-citation">{generatedCitation}</p>}
    </div>
  );
}

export default CitationGeneratorDropdown;
