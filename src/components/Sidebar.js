import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CSS/sidebar.css';
import { FaHome, FaRegClock, FaHistory, FaUserCircle, FaList, FaBars, FaUpload } from 'react-icons/fa';
import { BsFillCloudUploadFill } from 'react-icons/bs';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { FaTags } from 'react-icons/fa';
import { FaFolder } from 'react-icons/fa';
import axios from 'axios'; // Import axios to make API requests

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeLink, setActiveLink] = useState(""); // Track the active link
  const [onlineUsers, setOnlineUsers] = useState([]); // State to store online users

  const handleLinkClick = (link) => {
    setActiveLink(link); // Set the active link immediately
  };

  // Fetch online users when the component mounts
  useEffect(() => {
    // Make an API request to get the online users
    const fetchOnlineUsers = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/admin/online-users');
        setOnlineUsers(response.data.onlineUsers);
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    };

    fetchOnlineUsers(); // Fetch online users when the component mounts

    // Optionally, set an interval to refresh the list of online users
    const intervalId = setInterval(fetchOnlineUsers, 60000); // Refresh every minute

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  

  return (
    <>
      <button className="burger-menu" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link 
              to="/admin/dashboard" 
              className={activeLink === "/admin/dashboard" ? "active" : ""}
              onClick={() => handleLinkClick("/admin/dashboard")}
            >
              <FaHome className="green-icon" />
              <span className="sidebar-text">Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/upload" 
              className={activeLink === "/upload" ? "active" : ""}
              onClick={() => handleLinkClick("/upload")}
            >
              <BsFillCloudUploadFill className="green-icon" />
              <span className="sidebar-text">Upload</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/category-list" 
              className={activeLink === "/category-list" ? "active" : ""}
              onClick={() => handleLinkClick("/category-list")}
            >
              <FaFolder className="green-icon" />
              <span className="sidebar-text">Category Settings</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/keyword-list" 
              className={activeLink === "/keyword-list" ? "active" : ""}
              onClick={() => handleLinkClick("/keyword-list")}
            >
              <FaTags className="green-icon" />
              <span className="sidebar-text">Keywords Settings</span>
            </Link>
          </li>
          <hr />
          <li>
            <Link 
              to="/admin/users" 
              className={activeLink === "/admin/users" ? "active" : ""}
              onClick={() => handleLinkClick("/admin/users")}
            >
              <FaUserCircle className="green-icon" />
              <span className="sidebar-text">Users</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/researchList" 
              className={activeLink === "/researchList" ? "active" : ""}
              onClick={() => handleLinkClick("/researchList")}
            >
              <IoDocumentTextSharp className="green-icon" />
              <span className="sidebar-text">Researches</span>
            </Link>
          </li>
        </ul>

        <hr />
        {/* Display Online Users */}
        <div className="online-users">
          <h5>Online Users</h5>
          <ul>
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user) => (
                <li key={user.user_id} className="online-user-item">
                  <span className="online-dot"></span>
                  {user.first_name} {user.last_name}
                </li>
              ))
            ) : (
              <li>No users are online.</li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
