import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Import the Sidebar component
import './CSS/admidash.css'; // Import your CSS file for styling
import DashboardContent from './admindashContent';
const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false); // State for sidebar visibility
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin

  useEffect(() => {
    // Get roleId from localStorage
    const roleId = localStorage.getItem('roleId');
    console.log('Retrieved roleId:', roleId); // Debugging statement
    
    // Check if roleId is '1' or 'admin'
    if (roleId === '1') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []); // Empty dependency array means this runs once on component mount

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (!isAdmin) {
    return <p>You do not have access to this page.</p>; // Message for non-admin users
  }

  return (
    <div className="container">
      <header className="header">
        <button className="nav-toggle" onClick={toggleSidebar}>
          <span className="material-icons">menu</span>
        </button>
      </header>
      <Sidebar toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar as a prop */}
      <main className="content">
    
        <DashboardContent />
      </main>
    </div>
  );
};

export default AdminDashboard;
