import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import UserSidebar from '../UserSidebar';
import '../CSS/userdash.css'; // Ensure the path to the CSS file is correct

const UserDashboard = () => {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(null); // Store role_id
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token'); // Adjust the key as needed

    if (token) {
      try {
        // Decode the token
        const decodedToken = jwtDecode(token);

        // Assuming the email and role_id are stored in the token payload
        setEmail(decodedToken.email); // Adjust according to the token structure
        setRoleId(decodedToken.role_id); // Set the role_id from token

        // Redirect to user dashboard if the user is not an admin (role_id 1 for admin)
        if (decodedToken.role_id !== 1) {
          navigate('/user/dashboard'); // Redirect non-admin users to the user dashboard
        }

      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.warn('No token found in local storage.');
      navigate('/login'); // Redirect to login page if no token is found
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <UserSidebar className="sidebar"/>
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome, {email || 'User'}!</h1>
        </header>
        <section className="dashboard-overview">
          <p>Here, you can view and manage your account, updates, and research activities.</p>
          {/* Add more content and features as needed */}
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
