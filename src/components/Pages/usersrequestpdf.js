import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserSidebar from '../UserSidebar'; // Assuming you have the sidebar component
import { jwtDecode } from 'jwt-decode';
import '../CSS/pdfRequests.css'; // Assuming you have custom styles for the page

const getCurrentUserId = () => localStorage.getItem('userId');
const getToken = () => localStorage.getItem('token'); // Get token from localStorage

const PdfRequests = () => {
  const [pdfRequests, setPdfRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Sidebar state
  const [privacyModal, setPrivacyModal] = useState({
    show: false,
    selectedRequest: null,
  });
  const [isPlaneFlying, setIsPlaneFlying] = useState(false); // For plane animation visibility

  const userId = getCurrentUserId();
  const token = getToken(); // Get the token from localStorage

  const [roleId, setRoleId] = useState(null);

  // Decode the token to get the roleId
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRoleId(decodedToken.roleId); // Extract role_id from the decoded token
      } catch (err) {
        console.error('Failed to decode token', err);
      }
    }
  }, [token]);

  // Fetch PDF requests when the component mounts
  useEffect(() => {
    if (roleId !== 1 && roleId !== 2) {
      // Check if the role is not allowed (assuming 1 and 2 are the allowed roles)
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

  const sendEmail = async (request) => {
    try {
      setIsPlaneFlying(true); // Start the plane animation
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
        setIsPlaneFlying(false); // Stop the plane animation after successful email
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
      setIsPlaneFlying(false); // Stop the plane animation on error
    }
  };

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  // Ensure roleId is valid before rendering sidebar
  if (roleId === null) {
    return <div>Loading...</div>; // You can return a loading state or spinner while roleId is loading
  }

  return (
    <div className="pdf-requests-container">
      <UserSidebar isOpen={isSidebarVisible} toggleSidebar={toggleSidebar} roleId={roleId} /> 

      <main className={`pdf-requests-content ${isSidebarVisible ? 'pdf-requests-with-sidebar' : 'pdf-requests-full-width'}`}>
        <header className="pdf-requests-header">
          <div className="pdf-requests-title">PDF REQUESTS</div>
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
                    <th>Requester</th>
                    <th>Email</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pdfRequests.map((request) => (
                    <tr key={request.request_id}>
                      <td>{request.research_title}</td>
                      <td>{request.requester_name}</td>
                      <td>{request.requester_email}</td>
                      <td>{request.purpose}</td>
                      <td>{request.status}</td>
                      <td>
                        <button onClick={() => sendEmail(request)} title="Send Email">
                          <FaPaperPlane color="blue" size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No PDF requests found.</p>
            )}
          </>
        )}
        
        {/* Flying Plane Animation */}
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
