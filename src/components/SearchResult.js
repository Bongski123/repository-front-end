import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import "./SearchResult.css";
function SearchResult({ result }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("APA"); // Default selected format

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

  return (
    <>
      <div className="search-result" onClick={handleShowModal} >
    <p style={{ fontSize: '20px', fontWeight: '1000' }}>{result.title}</p>
    <p>Author: {result.author}</p>
    <p>Department: {result.department_name}</p>
</div>

      <Modal show={showModal} onHide={handleCloseModal}>
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
          {/* Add additional information here */}
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
