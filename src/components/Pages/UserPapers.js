import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserSidebar from '../UserSidebar';
import '../CSS/UserPaper.css';

const getCurrentUserId = () => {
  return localStorage.getItem('userId');
};

const UserPaper = () => {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [abstract, setAbstract] = useState('');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResearches = async () => {
      setLoading(true);
      const userId = getCurrentUserId();
      if (!userId) {
        setError('No user ID found in local storage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://ccsrepo.onrender.com/user/researches/${userId}`);
        setResearches(response.data.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setResearches([]);
          setError(null);
        } else {
          setError(`Error fetching research papers: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResearches();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleEditPdfClick = (researchId) => {
    navigate(`/edit-pdf/${researchId}`);
  };

  const handleAbstractChange = (event) => {
    setAbstract(event.target.value);
  };

  const handleSaveAbstract = async () => {
    console.log("Attempting to save abstract...");
  
    try {
      const response = await axios.put(
        `https://ccsrepo.onrender.com/research/${selectedResearch.research_id}/abstract`,
        { abstract }
      );
  
      if (response.status === 202) {
        console.log("Abstract updated successfully!");
  
        // Show success alert using SweetAlert2
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Abstract updated successfully!',
          confirmButtonText: 'OK'
        });
  
        // Optionally, trigger a browser notification
        if (Notification.permission === 'granted') {
          new Notification('Abstract Updated', {
            body: 'Your research abstract has been successfully updated.',
            icon: 'https://example.com/success-icon.png', // Optional icon
          });
        }
  
        // Close the modal after showing the alert
        setShowModal(false);
      } else {
        throw new Error('Failed to update abstract');
      }
    } catch (err) {
      console.error("Error updating abstract:", err.message);
      setError(`Error updating abstract: ${err.message}`);
  
      // Show error alert
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to update abstract: ${err.message}`,
        confirmButtonText: 'OK'
      });
    }
  };

  const openModal = (research) => {
    setSelectedResearch(research);
    setAbstract(research.abstract || '');
    setShowModal(true);
  };

  return (
    <div className="container">
      <UserSidebar isOpen={isSidebarVisible} toggleSidebar={toggleSidebar} />
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
        ) : researches.length > 0 ? (
          <table className="research-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Published On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researches.map((research) => (
                <tr key={research.research_id}>
                  <td>{research.title}</td>
                  <td>{research.status}</td>
                  <td>{new Date(research.publish_date).toLocaleDateString()}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditPdfClick(research.research_id)}>
                      Edit PDF
                    </Button>{' '}
                    <Button variant="secondary" onClick={() => openModal(research)}>
                      Edit Abstract
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Research Paper is empty</p>
        )}
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Abstract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            value={abstract}
            onChange={handleAbstractChange}
            rows="5"
            placeholder="Enter the updated abstract here..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveAbstract}>
            Save
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserPaper;
