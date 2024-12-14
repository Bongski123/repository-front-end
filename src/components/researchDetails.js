import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';

Modal.setAppElement('#root');

const styles = {
  container: {
    marginLeft: '250px',
    padding: '20px',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #000',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
  },
  buttonContainer: {
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  approveButton: {
    backgroundColor: 'green',
    color: 'white',
  },
  rejectButton: {
    backgroundColor: 'red',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: 'darkred',
    color: 'white',
  },
  modalContent: {
    padding: '20px',
    width: '100%',
    maxWidth: '900px',
  },

  rejectionModalContent: {
    content: {
      top: '30%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      width: '800px',
      maxWidth: '90%',
    },
  },
  rejectionSelect: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
  },

  loading: {
    textAlign: 'center',
    fontSize: '18px',
  },
  error: {
    color: 'red',
  },
  zoomButtons: {
    marginTop: '10px',
  },
  zoomButton: {
    padding: '5px 10px',
    marginRight: '10px',
  },
};

const rejectionReasons = [
  "Lack of Originality: No new insights or contributions.",
  "Poor Writing Quality: Unclear language or structure.",
  "Methodological Issues: Flawed or weak methodology.",
  "Incomplete Data: Missing or unclear supporting data.",
  "Ethical Compliance: Lacks necessary ethical approval.",
  "Insufficient Literature Review: Lacks context of prior work.",
  "Unsupported Conclusions: Claims not backed by data.",
  "Redundant Publication: Overlaps with existing work.",
  "Unclear Focus: Lacks a clear objective or question.",
  "Off-Topic: Irrelevant to repository's scope.",
  "Conflict of Interest: Undisclosed bias present.",
  "Plagiarism or Copyright Violation.",
  "Speculative Claims: Unsupported assertions.",
  "Improper Formatting: Doesn’t follow guidelines.",
  "Negative Peer Review: Significant concerns raised."
];

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
  const [zoom, setZoom] = useState(1.0); // Initial zoom level
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const researchResponse = await axios.get(`https://ccsrepo.onrender.com/research/${research_id}`);
        setResearch(researchResponse.data.research || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [research_id]);

  const fetchPDF = async (id) => {
    setLoading(true);
    try {
      if (!id) throw new Error("Research ID is missing");
      const response = await axios.get(`https://ccsrepo.onrender.com/pdf/${id}`, {
        responseType: "blob",
      });
      const pdfBlob = response.data;
      setPdfBlobUrl(URL.createObjectURL(pdfBlob));
      setError(null);
    } catch (error) {
      console.error("Error fetching PDF:", error);
      setError("Error fetching PDF. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1); // Reset to first page when document loads
  };

  const handleApprove = async () => {
    try {
      await axios.patch(`https://ccsrepo.onrender.com/research/approve/${research_id}`);
      Swal.fire({
        title: 'Approved!',
        text: 'Research approved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Error: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleRejectOpen = () => {
    setRejectionModalVisible(true);
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a reason for rejection.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await axios.patch(`https://ccsrepo.onrender.com/research/reject/${research_id}`, { reason: rejectionReason });
      Swal.fire({
        title: 'Rejected!',
        text: 'Research rejected successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setRejectionModalVisible(false);
      setRejectionReason('');
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: `Error: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleModalClose = () => {
    setRejectionModalVisible(false);
    setRejectionReason('');
  };

  const handlePdfModalClose = () => {
    setPdfModalVisible(false);
    setCurrentPage(1); // Reset page when modal closes
    setIsSidebarVisible(true); // Show sidebar when PDF modal is closed
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl); // Release object URL to avoid memory leak
      setPdfBlobUrl(null);
    }
  };

  const openPdfModal = () => {
    if (!pdfBlobUrl) fetchPDF(research.research_id); // Fetch PDF only if not already loaded
    setPdfModalVisible(true);
    setIsSidebarVisible(false); // Hide sidebar when PDF modal is opened
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleZoomIn = () => setZoom(zoom + 0.25); // Increase zoom
  const handleZoomOut = () => setZoom(zoom - 0.25); // Decrease zoom

  const handleDelete = async () => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the research and associated records.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`https://ccsrepo.onrender.com/delete-research/${research_id}`);
        // Show success Swal and handle redirect after it is closed
        Swal.fire({
          title: 'Deleted!',
          text: 'Research and associated records deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // After user clicks 'OK', redirect to research list
          window.location.href = '/researchList'; // Replace with your actual URL
        });
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: `Error: ${err.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading research details...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar isVisible={isSidebarVisible} />
      <h2 style={styles.header}>Research Detail</h2>
      {error && <p style={styles.error}>{error}</p>}
      {research && (
        <div>
          <div style={styles.section}>
            <h3>Title: {research.title}</h3>
            <p><strong>Abstract:</strong> {research.abstract}</p>
            <p><strong>Category:</strong> {research.categories}</p>
            <p><strong>Keywords:</strong> {research.keywords}</p>
            <p><strong>Published on:</strong> {research.publish_date}</p>
            <p><strong>Status:</strong> {research.status}</p>
           
          </div>
          <div style={styles.buttonContainer}>
          <button onClick={openPdfModal} style={styles.button}>Open PDF</button>
            <button onClick={handleApprove} style={{ ...styles.button, ...styles.approveButton }}>Approve</button>
            <button onClick={handleRejectOpen} style={{ ...styles.button, ...styles.rejectButton }}>Reject</button>
            <button onClick={handleDelete} style={{ ...styles.button, ...styles.deleteButton }}>Delete</button>
          </div>

          {/* PDF Modal */}
          <Modal isOpen={pdfModalVisible} onRequestClose={handlePdfModalClose}>
            <div style={styles.modalContent}>
            <div>
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} / {numPages}</span>
                <button onClick={goToNextPage} disabled={currentPage === numPages}>Next</button>
              </div>
              <h2>PDF Viewer</h2>
              {pdfBlobUrl && (
                <Document
                  file={pdfBlobUrl}
                  onLoadSuccess={handleDocumentLoadSuccess}
                  onLoadError={(error) => setError(error.message)}
                >
                  <Page pageNumber={currentPage} scale={zoom} />
                </Document>
              )}
            
              <div style={styles.zoomButtons}>
                <button onClick={handleZoomIn} style={styles.zoomButton}>Zoom In</button>
                <button onClick={handleZoomOut} style={styles.zoomButton}>Zoom Out</button>
              </div>
              <button onClick={handlePdfModalClose}>Close</button>
            </div>
          </Modal>

          {/* Rejection Modal */}
          <Modal isOpen={rejectionModalVisible} onRequestClose={handleModalClose} style={styles.rejectionModalContent}>
            <div style={styles.modalContent}>
              <h2>Rejection Reason</h2>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                style={styles.rejectionSelect}
              >
                <option value="">Select a reason</option>
                {rejectionReasons.map((reason, index) => (
                  <option key={index} value={reason}>{reason}</option>
                ))}
              </select>
              <div>
                <button onClick={handleReject}>Reject</button>
                <button onClick={handleModalClose}>Cancel</button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default ResearchDetail;
