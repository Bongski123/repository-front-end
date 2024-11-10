import React, { useState, useEffect } from 'react';
import './CSS/UserTable.css';
import Sidebar from './Sidebar';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Swal from 'sweetalert2'; // Import SweetAlert2

const UserTablePage = () => {
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

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

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDelete = async (userId) => {
    // Show a SweetAlert2 confirmation dialog
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

        // Show success message if user is deleted successfully
        Swal.fire(
          'Deleted!',
          'The user has been deleted.',
          'success'
        );

        // Reload the user list after deletion
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error.message);
        // Show error message if there is a failure in deletion
        Swal.fire(
          'Error!',
          'There was a problem deleting the user.',
          'error'
        );
      }
    }
  };

  // Redirects to the Signup page when "Add User" button is clicked
  const handleAddUserRedirect = () => {
    navigate('/signup'); // Redirect to the signup page
  };

  return (
    <div className="user-table-container">
      <Sidebar toggleSidebar={toggleSidebar} />
      <h2>User Management</h2>
      <Button variant="success" onClick={handleAddUserRedirect}>Add User</Button> {/* Button now redirects to Signup */}
      
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
    </div>
  );
};

export default UserTablePage;
