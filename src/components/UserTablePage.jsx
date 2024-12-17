import React, { useState, useEffect } from 'react';
import './CSS/UserTable.css';
import Sidebar from './Sidebar';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Modal, Form } from 'react-bootstrap';
import { FaPen, FaTrashAlt } from 'react-icons/fa';  // Importing icons from react-icons

const UserTablePage = () => {
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [roles, setRoles] = useState([]);
  const [institutions, setInstitutions] = useState([]); // State for institutions
  const [isOpen, setIsOpen] = useState(true); // Sidebar state
  const [modalShow, setModalShow] = useState(false); // Modal visibility state
  const [userToEdit, setUserToEdit] = useState(null); // User data for editing
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchUsers();
    fetchPrograms();
    fetchRoles();
    fetchInstitutions(); // Fetch institutions
  }, []);


  const fetchUsers = async () => {
    try {
      const response = await fetch('https://ccsrepo.onrender.com/admin/users/all');
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
      const response = await fetch('https://ccsrepo.onrender.com/programs/all');
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
      const response = await fetch('https://ccsrepo.onrender.com/roles/all');
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

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('https://ccsrepo.onrender.com/institutions/all');
      if (!response.ok) {
        throw new Error('Failed to fetch institutions');
      }
      const data = await response.json();
      setInstitutions(data.institutions || []);
    } catch (error) {
      console.error('Error fetching institutions:', error.message);
      setInstitutions([]);
    }
  };

  const handleEdit = (userId) => {
    const user = users.find(u => u.user_id === userId); // Find user data by ID
    
    // Set the user data for editing
    setUserToEdit({
      ...user,
      first_name: user.first_name || '',
      middle_name: user.middle_name || '', // Handle middle_name being empty
      last_name: user.last_name || '',
      suffix: user.suffix || '',  // Handle suffix being empty
      email: user.email || '',  // Handle email being empty
      role_id: user.role_id || '',  // Handle role_id being empty
      institution_id: user.institution_id || '',  // Handle institution_id being empty
      program_id: user.program_id || '',  // Handle program_id being empty
    });
    setModalShow(true); // Open modal for editing
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://ccsrepo.onrender.com/users/delete/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error.message);
        Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
      }
    }
  };

  const handleAddUserRedirect = () => {
    navigate('/signup');
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
  
    const { first_name, middle_name, last_name, email, role_id, institution_id, program_id, user_id } = userToEdit;
    const updatedUser = {
      first_name: first_name || null,
      middle_name: middle_name || null,
      last_name: last_name || null,
      email: email || null,
      role_id: role_id || null,
      institution_id: institution_id || null,
      program_id: program_id || null,
      user_id,
    };
  
    try {
      const response = await fetch(`https://ccsrepo.onrender.com/admin/update/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error: ${text}`);
      }
  
      const data = await response.json();
      console.log('User updated successfully:', data);
      Swal.fire('Success', 'User updated successfully', 'success');
      setModalShow(false);
      fetchUsers();  // Refresh the user list after update
    } catch (error) {
      console.error('Error updating user:', error.message);
      Swal.fire('Error', `Failed to update user data: ${error.message}`, 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserToEdit(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={`user-table-wrapper ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar toggleSidebar={toggleSidebar} isOpen={isOpen} /> {/* Pass toggleSidebar and isOpen as props */}
      <div className="user-table-content">
        <h2>User Management</h2>
        <Button variant="success" onClick={handleAddUserRedirect}>Add User</Button>
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
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{`${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.suffix || ''}`.trim()}</td>
                  <td>{user.email}</td>
                  <td>{user.role_name}</td>
                  <td>{user.institution}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(user.user_id)}>
                      <FaPen /> {/* Pen icon for Edit */}
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(user.user_id)}>
                      <FaTrashAlt /> {/* Trash icon for Delete */}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for editing user */}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToEdit && (
            <Form onSubmit={handleUpdateUser}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={userToEdit.first_name || ''}  // Ensure this field is always populated
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  name="middle_name"
                  value={userToEdit.middle_name || ''}  // Handle empty or null middle name
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={userToEdit.last_name || ''}  // Ensure this field is always populated
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Suffix</Form.Label>
                <Form.Control
                  type="text"
                  name="suffix"
                  value={userToEdit.suffix || ''}  // Handle empty or null suffix
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userToEdit.email || ''}  // Ensure this field is always populated
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  name="role_id"
                  value={userToEdit.role_id || ''}  // Ensure this field is always populated
                  onChange={handleInputChange}
                >
                  {roles.map(role => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Institution</Form.Label>
                <Form.Control
                  as="select"
                  name="institution_id"
                  value={userToEdit.institution_id || ''}  // Ensure this field is always populated
                  onChange={handleInputChange}
                >
                  {institutions.map(institution => (
                    <option key={institution.institution_id} value={institution.institution_id}>
                      {institution.institution_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Program</Form.Label>
                <Form.Control
                  as="select"
                  name="program_id"
                  value={userToEdit.program_id || ''}  // Ensure this field is always populated
                  onChange={handleInputChange}
                >
                  {programs.map(program => (
                    <option key={program.program_id} value={program.program_id}>
                      {program.program_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary">Save Changes</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserTablePage;
