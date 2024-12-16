import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import './ResearchDetail.css';

Modal.setAppElement('#root');

function ResearchDetail() {
  const { research_id } = useParams();
  const [research, setResearch] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const fetchResearchData = async () => {
    try {
      const response = await axios.get(`/api/research/${research_id}`);
      setResearch(response.data);
      setPdfBlobUrl(response.data.pdfUrl);
      setLoading(false);
    } catch (err) {
      setError('Error loading research details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchData();
  }, [research_id]);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  const handleRejection = () => {
    if (rejectionReason) {
      Swal.fire({
        icon: 'success',
        title: 'Research Rejected',
        text: `Reason: ${rejectionReason}`,
      });
      setRejectionModalVisible(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Rejection Error',
        text: 'Please select a rejection reason.',
      });
    }
  };

  const handleZoomIn = () => setZoom(zoom + 0.2);
  const handleZoomOut = () => setZoom(zoom - 0.2);

  return (
    <div className={`research-detail-container ${isSidebarVisible ? 'with-sidebar' : 'full-width'}`}>
      <div className="research-detail-header">Research Details</div>
      <div className="research-section">
        <h3>Title</h3>
        <p>{research ? research.title : 'Loading...'}</p>
      </div>

      <div className="research-section">
        <h3>Abstract</h3>
        <p>{research ? research.abstract : 'Loading...'}</p>
      </div>

      <div className="research-section">
        <h3>Authors</h3>
        <p>{research ? research.authors : 'Loading...'}</p>
      </div>

      <div className="research-button-container">
        <button className="research-button research-approve-btn">Approve</button>
        <button className="research-button research-reject-btn" onClick={() => setRejectionModalVisible(true)}>Reject</button>
        <button className="research-button research-delete-btn">Delete</button>
      </div>

      <Modal
        isOpen={rejectionModalVisible}
        onRequestClose={() => setRejectionModalVisible(false)}
        contentLabel="Rejection Modal"
        className="research-rejection-modal-content"
      >
        <h3>Rejection Reason</h3>
        <select
          className="research-rejection-select"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        >
          <option value="">Select Reason</option>
          <option value="Plagiarism">Plagiarism</option>
          <option value="Poor Quality">Poor Quality</option>
          <option value="Duplicate Research">Duplicate Research</option>
        </select>
        <button className="research-rejection-button" onClick={handleRejection}>Submit</button>
      </Modal>

      <div className="research-pdf-zoom-buttons">
        <button className="research-pdf-zoom-button" onClick={handleZoomIn}>Zoom In</button>
        <button className="research-pdf-zoom-button" onClick={handleZoomOut}>Zoom Out</button>
      </div>

      {pdfBlobUrl && (
        <Document
          file={pdfBlobUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page pageNumber={currentPage} scale={zoom} />
        </Document>
      )}
    </div>
  );
}

export default ResearchDetail;
