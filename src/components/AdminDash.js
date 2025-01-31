import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar component
import './CSS/admidash.css'; // Import your CSS file for styling
import DashboardContent from './admindashContent';

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true); // Set the initial sidebar state to 'closed' (false)
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Get roleId from localStorage
    const roleId = localStorage.getItem('roleId');
    console.log('Retrieved roleId:', roleId); // Debugging statement
    
    // Check if roleId is '1' (admin)
    if (roleId === '1') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      navigate('/user/dashboard'); // Redirect to /user/dashboard if not admin
    }
  }, [navigate]); // Add navigate to the dependency array

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar visibility
  };

  if (!isAdmin) {
    return null; // Optionally, you can return null or a loading indicator while redirecting
  }

  return (
    <div className="container">
      <header className="header">
        <button className="nav-toggle" onClick={toggleSidebar}>
          <span className="material-icons">menu</span>
        </button>
      </header>
      <Sidebar toggleSidebar={toggleSidebar} isOpen={isOpen} /> {/* Pass toggleSidebar and isOpen as props */}
      <main className={`main-content ${isOpen ? 'with-sidebar' : 'full-width'}`}>
        <DashboardContent />
      </main>
    </div>
  );
};






export default AdminDashboard;
