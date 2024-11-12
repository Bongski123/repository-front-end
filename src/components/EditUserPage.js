import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'; // Import SweetAlert
import './CSS/EditUserPage.css'; // Add your custom styling

const EditUserPage = ({ show, handleClose }) => {
  const { userId } = useParams(); // Get the userId from URL parameter
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    role_id: '',
    institution_id: '',
    program_id: '',
    institution: '',
    program: ''
  });

  const [roles, setRoles] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    if (show) {
      fetchUserData();
      fetchRoles();
      fetchPrograms();
      fetchInstitutions();
    }
  }, [userId, show]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://ccsrepo.onrender.com/users/${userId}`);
      const data = await response.json();
      if (data.user) {
        setUser({
          firstName: data.user.first_name,
          middleName: data.user.middle_name,
          lastName: data.user.last_name,
          suffix: data.user.suffix,
          email: data.user.email,
          role_id: data.user.role_id,
          institution_id: data.user.institution_id,
          program_id: data.user.program_id,
          institution: data.user.institution_name,
          program: data.user.program_name
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('https://ccsrepo.onrender.com/roles/all');
      const data = await response.json();
      setRoles(data.roles || []);
    } catch (error) {
      console.error('Error fetching roles:', error.message);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch('https://ccsrepo.onrender.com/programs/all');
      const data = await response.json();
      setPrograms(data.programs || []);
    } catch (error) {
      console.error('Error fetching programs:', error.message);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('https://ccsrepo.onrender.com/institutions/all');
      const data = await response.json();
      setInstitutions(data.institutions || []);
    } catch (error) {
      console.error('Error fetching institutions:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      first_name: user.firstName,
      middle_name: user.middleName,
      last_name: user.lastName,
      suffix: user.suffix,
      email: user.email,
      role_id: user.role_id,
      institution_id: user.institution_id,
      program_id: user.program_id
    };
  
    try {
      const response = await fetch(`https://ccsrepo.onrender.com/users/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: responseData.message || 'User updated successfully.',
        }).then(() => {
          handleClose(); // Close the modal after success
          navigate('/users');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: responseData.message || 'Failed to update user.',
        });
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Error updating user.',
      });
    }
  };
  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Middle Name:</label>
            <input
              type="text"
              name="middleName"
              value={user.middleName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Suffix:</label>
            <input
              type="text"
              name="suffix"
              value={user.suffix}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div>
            <label>Role:</label>
            <select
              name="role_id"
              value={user.role_id}
              onChange={handleChange}
              required
            >
              {roles.map(role => (
                <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Institution:</label>
            <select
              name="institution_id"
              value={user.institution_id}
              onChange={handleChange}
              required
            >
              {institutions.map(institution => (
                <option key={institution.institution_id} value={institution.institution_id}>
                  {institution.institution_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Program:</label>
            <select
              name="program_id"
              value={user.program_id}
              onChange={handleChange}
              required
            >
              {programs.map(program => (
                <option key={program.program_id} value={program.program_id}>
                  {program.program_name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="primary">Update User</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserPage;
