import React, { useState, useEffect } from 'react';
import './CSS/UserTable.css';
import Sidebar from './Sidebar';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Modal, Form } from 'react-bootstrap';


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
      const response = await fetch('https://ccsrepo.onrender.com/users/all');
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

  // List of known suffixes to check for
  const suffixes = ['Jr.', 'Sr.', 'III', 'II', 'IV'];
  
  // Split full_name into parts
  const nameParts = user.full_name.split(' ');

  // Check if the last part is a suffix
  const possibleSuffix = nameParts[nameParts.length - 1];
  const isSuffix = suffixes.includes(possibleSuffix);

  // If the last part is a suffix, separate it from the last name
  const [first_name, middle_name, ...lastNameParts] = nameParts;
  const last_name = isSuffix ? lastNameParts.slice(0, -1).join(' ') : lastNameParts.join(' ');
  const suffix = isSuffix ? possibleSuffix : '';

  // Set the user data for editing, including the split full name and suffix
  setUserToEdit({
    ...user,
    first_name,
    middle_name: middle_name || '', // Ensure middle_name is set if it's empty
    last_name,
    suffix,
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
    const { first_name,middle_name, last_name, role_id, institution_id, program_id } = userToEdit;
  
    if (!first_name ||!middle_name|| !last_name ||  !role_id || !institution_id || !program_id) {
      Swal.fire('Error', 'Please fill all the required fields', 'error');
      return;
    }
  
    try {
      const response = await fetch(`https://ccsrepo.onrender.com/users/update/${userToEdit.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToEdit),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from backend:', errorData); // Log the backend response
        throw new Error('Failed to update user');
      }
  
      Swal.fire('Success', 'User updated successfully', 'success');
      setModalShow(false); // Close the modal
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user:', error.message);
      Swal.fire('Error', 'Failed to update user data', 'error');
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
        <td>{user.full_name}</td>
        <td>{user.email}</td>
        <td>{user.role_name}</td>
        <td>{user.institution}</td>
        <td>
          <Button variant="primary" onClick={() => handleEdit(user.user_id)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDelete(user.user_id)}>Delete</Button>
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
                  value={userToEdit.first_name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  name="middle_name"
                  value={userToEdit.middle_name || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={userToEdit.last_name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userToEdit.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  name="role_id"
                  value={userToEdit.role_id}
                  onChange={handleInputChange}
                  required
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
                  value={userToEdit.institution_id}
                  onChange={handleInputChange}
                  required
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
                  value={userToEdit.program_id}
                  onChange={handleInputChange}
                  required
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
