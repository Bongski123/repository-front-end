import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import Swal from 'sweetalert2'; // Import SweetAlert2

const RequestPdfForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    researchId: '',
    researchTitle: '',
    requesterName: '',
    requesterEmail: '',
    purpose: '',
  });

  const [isAuthorized, setIsAuthorized] = useState(false);

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return !!decoded;
      } catch (err) {
        console.error('Invalid token:', err);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    } else {
      const token = localStorage.getItem('token');
      try {
        const decoded = jwtDecode(token);
        setFormData((prev) => ({
          ...prev,
          requesterEmail: decoded.email, // Assuming email exists in the token
        }));
        setIsAuthorized(true);
      } catch (err) {
        console.error('Error decoding token:', err);
        navigate('/login');
      }
    }

    const { researchId, researchTitle } = location.state || {};
    setFormData((prev) => ({
      ...prev,
      researchId: researchId || '',
      researchTitle: researchTitle || '',
    }));

    // Fetch authors associated with this researchId
    if (researchId) {
      axios
        .get(`https://ccsrepo.onrender.com/all/authors/${researchId}`)
        .then((response) => {
          if (response.data.length > 0) {
            const authorNames = response.data.map((author) => author.author_name);
            setFormData((prev) => ({
              ...prev,
              authorNames: authorNames,
            }));
          } else {
            Swal.fire('No Authors Found', 'No authors found for this research.', 'info');
          }
        })
        .catch((error) => {
          console.error('Error fetching author data:', error);
          Swal.fire('Error!', 'Failed to fetch author details.', 'error');
        });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the request to the backend
      const response = await axios.post('https://ccsrepo.onrender.com/request-pdf', formData);
      
      // Show success message
      Swal.fire('Success!', 'Your request has been sent successfully.', 'success');

      window.history.back();
  
    } catch (err) {
      Swal.fire('Error!', err.response?.data?.error || 'Something went wrong.', 'error');
    }
  };
  
  

  if (!isAuthorized) return null;

  return (
    <div className="container">
      <h1>Request PDF</h1>
      <Form onSubmit={handleSubmit}>
  <Form.Group controlId="researchId">
  
    <Form.Control
      type="text"
      name="researchId"
      value={formData.researchId}
      disabled
      style={{ display: 'none' }}  // Hide the field visually
    />
  </Form.Group>
  <Form.Group controlId="researchTitle">
    <Form.Label>Research Title</Form.Label>
    <Form.Control
      type="text"
      name="researchTitle"
      value={formData.researchTitle}
      disabled
    />
  </Form.Group>

  <Form.Group controlId="requesterName">
    <Form.Label>Your Name</Form.Label>
    <Form.Control
      type="text"
      name="requesterName"
      value={formData.requesterName}
      onChange={handleChange}
      required
    />
  </Form.Group>
  <Form.Group controlId="requesterEmail">

    <Form.Control
      type="email"
      name="requesterEmail"
      value={formData.requesterEmail}
      disabled
      style={{ display: 'none' }}  // Hide the field visually
    />
  </Form.Group>
  <Form.Group controlId="purpose">
    <Form.Label>Purpose</Form.Label>
    <Form.Control
      as="textarea"
      name="purpose"
      value={formData.purpose}
      onChange={handleChange}
      rows={3}
      required
    />
  </Form.Group>
  <Button variant="primary" type="submit">Request PDF</Button>
</Form>

    </div>
  );
};

export default RequestPdfForm;
