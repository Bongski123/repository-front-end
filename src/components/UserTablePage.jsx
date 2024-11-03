import React, { useState, useEffect } from 'react';
import './CSS/UserTable.css';
import Sidebar from './Sidebar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2'; // Import Swal for alerts
import { useNavigate } from 'react-router-dom';

const UserTablePage = () => {
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    program_id: '',
    role_id: '',
    institution:''
  });
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchUsers();
    fetchPrograms();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:9000/users/all');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://localhost:9000/programs/all');
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      const data = await response.json();
      setPrograms(data.programs || []);
    } catch (error) {
      console.error('Error fetching programs:', error.message);
      setPrograms([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:9000/roles/all');
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      const data = await response.json();
      setRoles(data.roles || []);
    } catch (error) {
      console.error('Error fetching roles:', error.message);
      setRoles([]);
    }
  };

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:9000/users/delete/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error.message);
      }
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    // Reset newUser state on modal close
    setNewUser({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      program_id: '',
      role_id: '',
      institution: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please make sure your passwords match.',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:9000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          program_id: newUser.program_id,
          role_id: newUser.role_id || 3 ,// Default role_id if not provided
          institution:newUser.institution
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'User Added Successfully',
          text: 'The new user has been registered.',
        });

        // Reset form fields
        handleCloseModal(); // Close modal resets state
        fetchUsers(); // Refresh user list
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: data.error || 'An error occurred during registration.',
        });
      }
    } catch (error) {
      console.error('Error adding user:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  return (
    <div className="user-table-container">
      <Sidebar toggleSidebar={toggleSidebar} />
      <h2>User Management</h2>
      <Button variant="success" onClick={handleShowModal}>Add User</Button>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Institution</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role_name}</td>
              <td>{user.institution}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(user.user_id)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(user.user_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
                value={newUser.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formProgram">
              <Form.Label>Program</Form.Label>
              <Form.Control
                as="select"
                name="program_id"
                value={newUser.program_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Program</option>
                {programs.length > 0 ? (
                  programs.map(program => (
                    <option key={program.program_id} value={program.program_id}>
                      {program.program_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No programs available</option>
                )}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role_id"
                value={newUser.role_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Role</option>
                {roles.length > 0 ? (
                  roles.map(role => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No roles available</option>
                )}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formInstitution">
  <Form.Label>Institution</Form.Label>
  <Form.Control
    type="text" // Corrected type to "text"
    placeholder="Institution"
    name="institution" // Corrected name to match state property
    value={newUser.institution}
    onChange={handleInputChange}
    required
  />
</Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleAddUser}>Add User</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTablePage;
