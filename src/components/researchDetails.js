import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';
import { ClipLoader } from 'react-spinners'; // Spinner component
import { maxHeight } from '@mui/system';

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
    width: '70%',  // Set width for the modal content
    maxWidth: '90%',  // Make sure it doesn't exceed the screen width on larger screens
    margin: 'auto',  // Center the modal horizontally
    textAlign: 'center', // Center the text inside
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',  // Vertically center content inside the modal
    alignItems: 'center',  // Horizontally center the content inside the modal
    position: 'relative',  // To control position of the modal content
    top: '50%',
    transform: 'translateY(-50%)',  // Vertically center the modal
  
   
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
  const [isOpen, setIsOpen] = useState(true); // Sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


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
    setIsOpen(true); // Show sidebar when PDF modal is closed
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl); // Release object URL to avoid memory leak
      setPdfBlobUrl(null);
    }
  };

  const openPdfModal = () => {
    if (!pdfBlobUrl) fetchPDF(research.research_id); // Fetch PDF only if not already loaded
    setPdfModalVisible(true);
    setIsOpen(false); // Hide sidebar when PDF modal is opened
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
    return <p style={styles.loading}>Loading...</p>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p>Error: {error}</p>
        <button onClick={() => fetchPDF(research.research_id)}>Try again</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
         <Sidebar toggleSidebar={toggleSidebar} isOpen={isOpen} /> {/* Pass toggleSidebar and isOpen as props */}
      <div>
        <h2 style={styles.header}>{research.title}</h2>
        <div style={styles.section}>
          <h3>Authors:</h3>
          <p>{research.authors}</p>
        </div>
       <div style={styles.section}>
    <h3>Abstract:</h3>
    <div
        dangerouslySetInnerHTML={{
            __html: research.abstract,
        }}
    />
</div>


        <div style={styles.section}>
          <h3>Published Date</h3>
          <p>{research.publish_date}</p>
        </div>

        <div style={styles.section}>
          <h3>Category:</h3>
          <p>{research.categories}</p>
        </div>

        <div style={styles.section}>
          <h3>Keywords:</h3>
          <p>{research.keywords}</p>
        </div>

        
        <div style={styles.section}>
          
          
          <button onClick={openPdfModal} style={styles.button}>
            Open PDF
          </button>
          <button onClick={handleApprove} style={{ ...styles.button, ...styles.approveButton }}>Approve</button>
          <button onClick={handleRejectOpen} style={{ ...styles.button, ...styles.rejectButton }}>Reject</button>
          <button onClick={handleDelete} style={{ ...styles.button, ...styles.deleteButton }}>Delete</button>
        </div>
        
        <Modal
      isOpen={pdfModalVisible}
      onRequestClose={handlePdfModalClose}
      style={styles.modalContent}
    >
    
      <button onClick={handlePdfModalClose}>Close</button>
      {pdfBlobUrl && (
          <object
            data={pdfBlobUrl}
            type="application/pdf"
            width="70%"
            height="1000px"
          >
            <p>Sorry, your browser does not support embedded PDFs.</p>
          </object>
        )}
      </Modal>
        <Modal
          isOpen={rejectionModalVisible}
          onRequestClose={handleModalClose}
          style={styles.rejectionModalContent}
        >
          <h3>Select Reason for Rejection:</h3>
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
          <button onClick={handleReject}>Reject</button>
          <button onClick={handleModalClose}>Cancel</button>
        </Modal>
      </div>
    </div>
  );
}

export default ResearchDetail;
