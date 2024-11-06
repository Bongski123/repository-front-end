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
  modalContent: {
    padding: '20px',
    width: '100%',
    maxWidth: '900px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
  },
  error: {
    color: 'red',
  },
};

const rejectionReasons = [
  // ... your rejection reasons array
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
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const researchResponse = await axios.get(`http://localhost:9000/research/${research_id}`);
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
      const response = await axios.get(`http://localhost:9000/pdf/${id}`, {
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
      await axios.patch(`http://localhost:10121/research/approve/${research_id}`);
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
    try {
      await axios.patch(`http://localhost:9000/research/reject/${research_id}`, { reason: rejectionReason });
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

  if (loading) {
    return <p style={styles.loading}>Loading...</p>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p>Error: {error}</p>
        <button onClick={() => fetchPDF(research.research_id)}>Retry</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Research Detail</h1>
      {isSidebarVisible && <Sidebar />}

      {research ? (
        <div>
          <section style={styles.section}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Field</th>
                  <th style={styles.th}>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}><strong>Title:</strong></td>
                  <td style={styles.td}>{research.title || 'No title available'}</td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>Status:</strong></td>
                  <td style={styles.td}>{research.status || 'No status available'}</td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>Abstract:</strong></td>
                  <td style={{ ...styles.td, maxWidth: '800px', whiteSpace: 'normal' }}>
                    {research.abstract || 'No abstract available'}
                  </td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>Keywords:</strong></td>
                  <td style={styles.td}>{(research.keywords || '').split(', ').join(', ') || 'No keywords available'}</td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>Authors:</strong></td>
                  <td style={styles.td}>
                    {Array.isArray(research.authors) ? 
                      research.authors.join(', ') : 
                      (typeof research.authors === 'string' ? research.authors : 'No authors available')}
                  </td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>Category:</strong></td>
                  <td style={styles.td}>{research.categories || 'No category available'}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <div style={styles.buttonContainer}>
            <button style={{ ...styles.button, ...styles.approveButton }} onClick={handleApprove}>
              Approve
            </button>
            <button style={{ ...styles.button, ...styles.rejectButton }} onClick={handleRejectOpen}>
              Reject
            </button>
            <button style={styles.button} onClick={openPdfModal}>
              View PDF
            </button>
          </div>

          <Modal isOpen={pdfModalVisible} onRequestClose={handlePdfModalClose}>
            <div style={styles.modalContent}>
              <h2>PDF Preview</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button onClick={goToPreviousPage} disabled={currentPage <= 1}>Previous</button>
                <span>Page {currentPage} of {numPages}</span>
                <button onClick={goToNextPage} disabled={currentPage >= numPages}>Next</button>
              </div>
              {pdfBlobUrl && (
                <Document file={pdfBlobUrl} onLoadSuccess={handleDocumentLoadSuccess}>
                  <Page pageNumber={currentPage} />
                </Document>
              )}
              <button onClick={handlePdfModalClose}>Close</button>
            </div>
          </Modal>

          <Modal isOpen={rejectionModalVisible} onRequestClose={handleModalClose}>
            <h2>Select a reason for rejection</h2>
            <select value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}>
              <option value="">Select a reason</option>
              {rejectionReasons.map((reason, index) => (
                <option key={index} value={reason}>{reason}</option>
              ))}
            </select>
            <button onClick={handleReject} disabled={!rejectionReason}>Reject</button>
            <button onClick={handleModalClose}>Cancel</button>
          </Modal>
        </div>
      ) : (
        <p>No research found</p>
      )}
    </div>
  );
}

export default ResearchDetail;
