import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import "./SearchResult.css";

function SearchResult({ result }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("APA"); // Default selected format
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const documentID = result.document_id; // Extract documentID from result

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const generateCitation = () => {
    let citation;
    switch (selectedFormat) {
      case "APA":
        citation = `${result.author}. (${new Date().getFullYear()}). "${result.title}". ${result.department_name}.`;
        break;
      case "MLA":
        citation = `${result.author}. "${result.title}." ${result.department_name}, ${new Date().getFullYear()}.`;
        break;
      case "Chicago":
        citation = `${result.author}. "${result.title}." ${result.department_name}. ${new Date().getFullYear()}.`;
        break;
      default:
        citation = "Unknown citation format";
    }
    return citation;
  };

  useEffect(() => {
    const fetchPDF = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:9000/pdf/${documentID}`, {
          responseType: "arraybuffer",
        });
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        setFileData(url);
        setError(null);
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Error fetching PDF. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (showModal) {
      fetchPDF();
    }
  }, [documentID, showModal, selectedFormat]);

  return (
    <>
      <div className="search-result" onClick={handleShowModal}>
        <p style={{ fontSize: '20px', fontWeight: '1000' }}>{result.title}</p>
        <p>Author: {result.author}</p>
        <p>Department: {result.department_name}</p>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{result.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Author: {result.author}</p>
          <p>Department: {result.department_name}</p>
          <p>Course: {result.course_name}</p>
          <p>Abstract: {result.abstract}</p>
          {/* Dropdown for selecting citation format */}
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              {selectedFormat}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedFormat("APA")}>APA</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFormat("MLA")}>MLA</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFormat("Chicago")}>Chicago</Dropdown.Item>
              {/* Add more citation formats as needed */}
            </Dropdown.Menu>
          </Dropdown>
          {/* Auto-generated citation */}
          <p>Citation: {generateCitation()}</p>
          {/* Display file content or loading/error message */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <iframe src={fileData} title="PDF Viewer" width="100%" height="600px" ></iframe>




          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export { SearchResult };
