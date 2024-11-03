import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const styles = {
  // ... your existing styles
};

const rejectionReasons = [
  "Insufficient Originality: The paper may lack original contributions or ideas, failing to present new findings or insights.",
  "Poor Quality of Research: The methodology may be flawed, the data insufficient, or the analysis inadequate, leading to questionable results.",
  "Lack of Relevance: The topic might not align with the focus areas or scope of the repository, making it less suitable for their audience.",
  "Inadequate Literature Review: The paper may not sufficiently review or reference existing literature, which is crucial for establishing context and significance.",
  "Formatting Issues: Non-compliance with the repository's formatting guidelines or submission requirements can lead to rejection.",
  "Ethical Concerns: If the research does not adhere to ethical standards, such as issues related to consent, data privacy, or conflicts of interest, it may be rejected.",
  "Language and Clarity: Poorly written papers that are difficult to read or understand may be rejected due to language barriers or lack of clarity in presenting ideas.",
  "Incomplete Data or Findings: Submitting preliminary data without robust findings can result in rejection, especially if the repository seeks comprehensive studies.",
  "Duplicate Submission: If the research paper is submitted to multiple repositories or journals simultaneously, it can be rejected based on policies against duplicate submissions.",
  "Insufficient Contribution to Field: The paper may not demonstrate a significant enough contribution to the academic field or practical application."
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const researchResponse = await axios.get(`http://localhost:9000/research/${research_id}`);
        setResearch(researchResponse.data.research || {});
        await fetchPDF(researchResponse.data.research.research_id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPDF = async (id) => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error("Research ID is missing");
        }
        const response = await axios.get(`http://localhost:9000/pdf/${id}`, {
          responseType: "blob",
        });
        const pdfBlob = response.data;
        const url = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(url);
        setError(null);
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Error fetching PDF. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [research_id]);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleApprove = async () => {
    try {
      await axios.patch(`http://localhost:9000/research/approve/${research_id}`);
      alert('Research approved successfully');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRejectOpen = () => {
    setRejectionModalVisible(true);
  };

  const handleReject = async () => {
    try {
      await axios.patch(`http://localhost:9000/research/reject/${research_id}`, { reason: rejectionReason });
      alert('Research rejected successfully');
      setRejectionModalVisible(false);
      setRejectionReason('');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleModalClose = () => {
    setRejectionModalVisible(false);
    setRejectionReason('');
  };

  const handlePdfModalClose = () => {
    setPdfModalVisible(false);
  };

  if (loading) {
    return <p style={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p style={styles.error}>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Research Detail</h1>

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
                  <td style={{ ...styles.td, width: '100%', maxWidth: '800px', whiteSpace: 'normal' }}>
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
            <button style={{ ...styles.button }} onClick={() => setPdfModalVisible(true)}>
              Preview Document
            </button>
          </div>

          {/* PDF Preview Modal */}
          <Modal
            isOpen={pdfModalVisible}
            onRequestClose={handlePdfModalClose}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              content: { ...styles.modalContent, maxWidth: '100%', width: 'auto' },
            }}
          >
            <h3>PDF Preview</h3>
            {pdfBlobUrl && (
              <div className="pdf-container" style={{ width: '100%', height: '600px', overflow: 'auto' }}>
                <Document
                  file={pdfBlobUrl}
                  onLoadSuccess={handleDocumentLoadSuccess}
                  className="pdf-document"
                  style={{ width: '100%' }}
                >
                  {Array.from({ length: numPages }, (_, pageNumber) => (
                    <Page
                      key={pageNumber + 1}
                      pageNumber={pageNumber + 1}
                      renderTextLayer={false}
                      width={1000}
                      height={500}
                      className={`pdf-page ${pageNumber + 1 === numPages ? 'last-page' : ''}`}
                      style={{ display: 'block', margin: '0 auto' }} 
                    />
                  ))}
                </Document>
              </div>
            )}
            <button style={styles.rejectButton} onClick={handlePdfModalClose}>Close</button>
          </Modal>

          {/* Rejection Reason Modal */}
          <Modal
            isOpen={rejectionModalVisible}
            onRequestClose={handleModalClose}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              content: styles.modalContent,
            }}
          >
            <h3>Reason for Rejection</h3>
            <select
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            >
              <option value="">Select a reason...</option>
              {rejectionReasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            <div style={styles.modalButtons}>
              <button style={styles.approveButton} onClick={handleReject}>Submit</button>
              <button style={styles.rejectButton} onClick={handleModalClose}>Cancel</button>
            </div>
          </Modal>
        </div>
      ) : (
        <p>No research details available</p>
      )}
    </div>
  );
}

export default ResearchDetail;
