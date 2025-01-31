import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserSidebar from '../UserSidebar';
import { jwtDecode } from 'jwt-decode';
import { FaTrash, FaLock, FaUnlock } from 'react-icons/fa'; // Importing icons
import '../CSS/UserPaper.css';

const getCurrentUserId = () => localStorage.getItem('userId');
const getToken = () => localStorage.getItem('token');

const PRIVACY_VALUES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

const UserPaper = () => {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [privacyModal, setPrivacyModal] = useState({
    show: false,
    selectedResearch: null,
  });

  const [roleId, setRoleId] = useState(null);

  const userId = getCurrentUserId();
  const token = getToken();

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

  // Fetch researches when component mounts
  useEffect(() => {
    if (roleId === null) {
      return; // Prevent fetching until roleId is decoded
    }
    fetchResearches();
  }, [roleId]);

  const fetchResearches = async () => {
    setLoading(true);

    if (!userId) {
      setError('User ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://ccsrepo.onrender.com/user/researches/${userId}`);
      if (response.status === 200) {
        setResearches(response.data.data || []);
        setError(null);
      } else {
        setResearches([]);
        setError('No research papers found.');
      }
    } catch (err) {
      setResearches([]);
      setError(err.response?.data?.message || 'Failed to fetch research papers.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  const openPrivacyModal = (research) => {
    setPrivacyModal({
      show: true,
      selectedResearch: research,
    });
  };

  const closePrivacyModal = () => {
    setPrivacyModal({
      show: false,
      selectedResearch: null,
    });
  };

  const updatePrivacy = async (privacy) => {
    const { selectedResearch } = privacyModal;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to set this research to ${privacy} privacy?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    });

    if (!result.isConfirmed) {
      return; // Exit if the user cancels the action
    }

    try {
      const response = await axios.put(
        `https://ccsrepo.onrender.com/research/${selectedResearch.research_id}/privacy`,
        { privacy }
      );

      if (response.status === 202) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Privacy updated to ${privacy}.`,
          confirmButtonText: 'OK',
        });
        fetchResearches();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to update privacy: ${err.response?.data?.message || err.message}`,
        confirmButtonText: 'OK',
      });
    } finally {
      closePrivacyModal();
    }
  };

  const deleteResearch = async (researchId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this research and all associated records.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) {
      return; // Exit if the user cancels the action
    }

    try {
      const response = await axios.delete(`https://ccsrepo.onrender.com/delete-research/${researchId}`);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Research has been deleted successfully.',
          confirmButtonText: 'OK',
        });
        fetchResearches(); // Reload the list after deletion
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to delete research: ${err.response?.data?.message || err.message}`,
        confirmButtonText: 'OK',
      });
    }
  };

  // Ensure roleId is valid before rendering content
  if (roleId === null) {
    return <div>Loading...</div>; // Show loading while roleId is decoding
  }

  return (
    <div className="containers">
      <UserSidebar isOpen={isSidebarVisible} toggleSidebar={toggleSidebar} roleId={roleId} />

      <main className={`content ${isSidebarVisible ? 'with-sidebar' : 'full-width'}`}>
        <header className="header">
          <h1>My Research Papers</h1>
        </header>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            {researches.length > 0 ? (
              <table className="research-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Privacy</th>
                    <th>Published On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {researches.map((research) => (
                    <tr key={research.research_id}>
                      <td>
                        {research.title.length > 30
                          ? `${research.title.substring(0, 60)}...`
                          : research.title}
                      </td>
                      <td
                        style={{
                          color:
                            research.status === 'approved'
                              ? 'green'
                              : research.status === 'pending'
                              ? 'blue'
                              : 'red',
                        }}
                      >
                        {research.status}
                      </td>
                      <td>{research.file_privacy || 'Not Set'}</td>
                      <td>{new Date(research.publish_date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="icon-button privacy-btn"
                          onClick={() => openPrivacyModal(research)}
                          title="Set Privacy"
                        >
                          {research.file_privacy === PRIVACY_VALUES.PUBLIC ? <FaUnlock /> : <FaLock />}
                        </button>
                        <button
                          className="icon-button delete-btn"
                          onClick={() => deleteResearch(research.research_id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No research papers found.</p>
            )}
          </>
        )}
      </main>

      <Modal show={privacyModal.show} onHide={closePrivacyModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Privacy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose a privacy setting for this research:</p>
          <div className="d-flex justify-content-around">
          <button
  className="icon-button privacy-btn"
  onClick={() => updatePrivacy(PRIVACY_VALUES.PUBLIC)}
  title="Set to Public"
>
  <FaUnlock />
</button>
<button
  className="icon-button privacy-btn"
  onClick={() => updatePrivacy(PRIVACY_VALUES.PRIVATE)}
  title="Set to Private"
>
  <FaLock />
</button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserPaper;
