import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../UserSidebar';
import '../CSS/userdash.css';
import UserDashContent from './UserDashContent';

const UserDashboard = () => {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email);
        setRoleId(decodedToken.roleId);

        // Redirect based on roleId: if admin, go to admin dashboard
        if (decodedToken.roleId === 1) {
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        navigate('/login'); // Redirect to login if token decoding fails
      }
    } else {
      console.warn('No token found in local storage.');
      navigate('/login'); // Redirect to login if no token
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="dashboard-container">
      <UserSidebar isOpen={isSidebarVisible} toggleSidebar={toggleSidebar} />
      <main className={`main-content ${isSidebarVisible ? 'with-sidebar' : 'full-width'}`}>
        <header className="dashboard-header">
          <h1>Welcome, {email || 'User'}!</h1>
        </header>
        <UserDashContent />
      </main>
    </div>
  );
};

export default UserDashboard;
