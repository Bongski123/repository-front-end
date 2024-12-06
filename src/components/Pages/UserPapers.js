import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserSidebar from '../UserSidebar';
import '../CSS/UserPaper.css';

const getCurrentUserId = () => localStorage.getItem('userId');

const UserPaper = () => {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [modalState, setModalState] = useState({
    show: false,
    selectedResearch: null,
    abstract: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  // Fetch user research papers
  const fetchResearches = async () => {
    setLoading(true);
    const userId = getCurrentUserId();
  
    if (!userId) {
      setError(''); // Empty message for no user ID
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.get(`https://ccsrepo.onrender.com/user/researches/${userId}`);
      if (response.status === 200) {
        setResearches(response.data.data || []);
        setError(''); // Clear any previous errors
      } else if (response.status === 404) {
        setResearches([]);
        setError(''); // Clear any error message
      }
    } catch (err) {
      setResearches([]); // Clear data on error
      setError(''); // Ensure error message is empty
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchResearches();
  }, []);

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  const handleReuploadFile = async (researchId) => {
    if (!selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        `https://ccsrepo.onrender.com/research/${researchId}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'File Uploaded',
          text: 'Your file has been successfully reuploaded.',
          confirmButtonText: 'OK',
        });
        setSelectedFile(null);
        fetchResearches();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: `Failed to upload file: ${err.message}`,
        confirmButtonText: 'OK',
      });
    }
  };

  const handleSaveAbstract = async () => {
    const { selectedResearch, abstract } = modalState;

    try {
      const response = await axios.put(
        `https://ccsrepo.onrender.com/research/${selectedResearch.research_id}/abstract`,
        { abstract }
      );

      if (response.status === 202) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Abstract updated successfully!',
          confirmButtonText: 'OK',
        });
        setModalState({ ...modalState, show: false });
        fetchResearches();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to update abstract: ${err.message}`,
        confirmButtonText: 'OK',
      });
    }
  };

  const openModal = (research) => {
    setModalState({
      show: true,
      selectedResearch: research,
      abstract: research.abstract || '',
    });
  };

  const closeModal = () => setModalState({ ...modalState, show: false });

  return (
    <div className="containers">
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
        ) : (
          <>
            {researches.length > 0 ? (
              <table className="research-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Published On</th>
        
                  </tr>
                </thead>
                <tbody>
                  {researches.map((research) => (
                    <tr key={research.research_id}>
                      <td>{research.title}</td>
                      <td>{research.status}</td>
                      <td>{new Date(research.publish_date).toLocaleDateString()}</td>
                      
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

      
    </div>
  );
};

export default UserPaper;
