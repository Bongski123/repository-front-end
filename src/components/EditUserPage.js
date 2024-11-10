import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './CSS/EditUserPage.css'; // Add your custom styling

const EditUserPage = () => {
  const { userId } = useParams(); // Get the userId from URL parameter
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    role_id: '', // Correct the name to match the backend
    institution_id: '', // Match backend property name
    program_id: '', // Match backend property name
    institution: '',  // To store the institution name for display
    program: ''       // To store the program name for display
  });

  const [roles, setRoles] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchRoles();
    fetchPrograms();
    fetchInstitutions();
  }, [userId]);

  // Fetch user data to pre-fill form
  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://ccsrepo.onrender.com/users/${userId}`);
      const data = await response.json();
      if (data.user) {
        setUser({
          name: data.user.name,
          email: data.user.email,
          role_id: data.user.role_id, // Match backend property name
          institution_id: data.user.institution_id, // Match backend property name
          program_id: data.user.program_id, // Match backend property name
          institution: data.user.institution_name,  // For display in the dropdown
          program: data.user.program_name         // For display in the dropdown
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  // Fetch roles for the role dropdown
  const fetchRoles = async () => {
    try {
      const response = await fetch('https://ccsrepo.onrender.com/roles/all');
      const data = await response.json();
      setRoles(data.roles || []);
    } catch (error) {
      console.error('Error fetching roles:', error.message);
    }
  };

  // Fetch programs for the program dropdown
  const fetchPrograms = async () => {
    try {
      const response = await fetch('https://ccsrepo.onrender.com/programs/all');
      const data = await response.json();
      setPrograms(data.programs || []);
    } catch (error) {
      console.error('Error fetching programs:', error.message);
    }
  };

  // Fetch institutions for the institution dropdown
  const fetchInstitutions = async () => {
    try {
      const response = await fetch('https://ccsrepo.onrender.com/institutions/all');
      const data = await response.json();
      setInstitutions(data.institutions || []);
    } catch (error) {
      console.error('Error fetching institutions:', error.message);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission to update user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      name: user.name,
      email: user.email,
      role_id: user.role_id, // Correct the name to match the backend
      institution_id: user.institution_id, // Correct the name to match the backend
      program_id: user.program_id // Correct the name to match the backend
    };

    try {
      const response = await fetch(`https://ccsrepo.onrender.com/users/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        // Log the response error for debugging
        const errorData = await response.text(); // Use text to capture non-JSON response
        console.error('Error response:', errorData);
        alert('Failed to update user');
      } else {
        navigate('/users');
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
      alert('Error updating user');
    }
  };

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
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
            name="role_id" // Corrected name to match the backend
            value={user.role_id}
            onChange={handleChange}
            required
          >
            {roles.map(role => (
              <option key={role.role_id} value={role.role_id}>{role.role_name}</option> // Corrected to match role_id
            ))}
          </select>
        </div>
        <div>
          <label>Institution:</label>
          <select
            name="institution_id" // Corrected name to match the backend
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
            name="program_id" // Corrected name to match the backend
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
    </div>
  );
};

export default EditUserPage;
