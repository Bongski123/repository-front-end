import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import '../CSS/sidebar.css'; // Import your CSS file for styling

const Sidebar = ({ toggleSidebar }) => { // Receive toggleSidebar as a prop
  const [isOpen, setIsOpen] = useState(false); // State for sidebar visibility

  const handleToggle = () => {
    setIsOpen(!isOpen);
    toggleSidebar(); // Call toggleSidebar function received from props
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul>
        <li>
          <Link to="/user/dashboard">Dashboard</Link> {/* Use Link for routing */}
        </li>
     
    
        <li>
          <Link to="/upload">Upload</Link> {/* Use Link for routing */}
          
        </li>
         
        <li>
          <Link to="/user/notification/:userId">Notification</Link> {/* Use Link for routing */}
        </li>
    
        <li>
          <Link to="/admin/settings">Settings</Link> {/* Use Link for routing */}
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
