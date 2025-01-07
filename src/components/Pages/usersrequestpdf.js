import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaInfoCircle } from 'react-icons/fa';
import UserSidebar from '../UserSidebar';
import { jwtDecode } from 'jwt-decode';
import '../CSS/pdfRequests.css';

const getCurrentUserId = () => localStorage.getItem('userId');
const getToken = () => localStorage.getItem('token');

const PdfRequests = () => {
  const [pdfRequests, setPdfRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [privacyModal, setPrivacyModal] = useState({
    show: false,
    selectedRequest: null,
  });
  const [isPlaneFlying, setIsPlaneFlying] = useState(false);

  const userId = getCurrentUserId();
  const token = getToken();

  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRoleId(decodedToken.roleId);
      } catch (err) {
        console.error('Failed to decode token', err);
      }
    }
  }, [token]);

  useEffect(() => {
    if (roleId !== 1 && roleId !== 2) {
      setError('You do not have permission to access PDF requests.');
      setLoading(false);
    } else {
      fetchPdfRequests();
    }
  }, [userId, roleId]);

  const fetchPdfRequests = async () => {
    setLoading(true);
    if (!userId) {
      setError('User ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://ccsrepo.onrender.com/user/pdf-requests/${userId}`);
      if (response.status === 200) {
        setPdfRequests(response.data);
        setError(null);
      } else {
        setPdfRequests([]);
        setError('No PDF requests found.');
      }
    } catch (err) {
      setPdfRequests([]);
      setError(err.response?.data?.message || 'Failed to fetch PDF requests.');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (request) => {
    setPrivacyModal({
      show: true,
      selectedRequest: request,
    });
  };

  const closeModal = () => {
    setPrivacyModal({
      show: false,
      selectedRequest: null,
    });
  };

  const sendEmail = async (request) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to send the PDF to this requester?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, send it!',
      cancelButtonText: 'Cancel',
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await axios.post(`https://ccsrepo.onrender.com/send-pdf/${request.research_id}`, {
          requester_email: request.requester_email,
          researchTitle: request.research_title,
          researchId: request.research_id,
        });

        if (response.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: 'Email sent successfully.',
            icon: 'success',
            confirmButtonText: 'Okay',
          });
          fetchPdfRequests();
          closeModal();
        } else {
          throw new Error('Email sending failed');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to send email.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    }
  };

  const rejectRequest = async (request) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reject this request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'Cancel',
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await axios.post(`https://ccsrepo.onrender.com/reject-pdf-request/${request.request_id}`);
        if (response.status === 200) {
          Swal.fire({
            title: 'Rejected!',
            text: 'The request has been rejected successfully.',
            icon: 'success',
            confirmButtonText: 'Okay',
          });
          fetchPdfRequests();
          closeModal();
        } else {
          throw new Error('Rejection failed');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to reject the request.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    }
  };

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  if (roleId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pdf-requests-container">
      <UserSidebar isOpen={isSidebarVisible} toggleSidebar={toggleSidebar} roleId={roleId} />

      <main className={`pdf-requests-content ${isSidebarVisible ? 'pdf-requests-with-sidebar' : 'pdf-requests-full-width'}`}>
        <header className="pdf-requests-header">
          <div className="pdf-requests-title">Document Requests</div>
        </header>

        {loading ? (
          <div className="pdf-requests-spinner-container">
            <div className="pdf-requests-spinner"></div>
          </div>
        ) : error ? (
          <p className="pdf-requests-error">{error}</p>
        ) : (
          <>
            {pdfRequests.length > 0 ? (
              <table className="pdf-requests-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Requester's Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pdfRequests.map((request) => (
                    <tr key={request.request_id}>
                      <td>{request.research_title}</td>
                      <td>{request.requester_name}</td>
                      <td>
                        <Button variant="info" onClick={() => showModal(request)}>
                          <FaInfoCircle /> View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <p>No PDF requests found.</p>
              </div>
            )}
          </>
        )}

        <Modal show={privacyModal.show} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="modal-title">Request Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }} className="modal-body">
            {privacyModal.selectedRequest && (
              <div>
                <p><strong>Name:</strong> {privacyModal.selectedRequest.requester_name}</p>
                <p><strong>Email:</strong> {privacyModal.selectedRequest.requester_email}</p>
                <p><strong>Title:</strong> {privacyModal.selectedRequest.research_title}</p>
                <p><strong>Purpose:</strong> {privacyModal.selectedRequest.purpose}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="success" 
              onClick={() => sendEmail(privacyModal.selectedRequest)} 
              disabled={isPlaneFlying} 
              className="modal-btn"
            >
              Send PDF
            </Button>
            <Button 
              variant="danger" 
              onClick={() => rejectRequest(privacyModal.selectedRequest)} 
              disabled={isPlaneFlying} 
              className="modal-btn"
            >
              Reject
            </Button>
          </Modal.Footer>
        </Modal>

        {isPlaneFlying && (
          <div className="plane-animation">
            <div className="plane"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PdfRequests;
