import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CSS/sidebar.css'; // Assuming you have a CSS file for styling
import { FaHome, FaRegClock, FaHistory, FaUserCircle, FaList, FaBars, FaUpload } from 'react-icons/fa'; // Using react-icons
import { BsFillCloudUploadFill } from 'react-icons/bs';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { FaTags } from 'react-icons/fa'; // Importing the Tags icon
import { FaFolder } from 'react-icons/fa'; // Importing the Folder icon

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeLink, setActiveLink] = useState(""); // Track the active link

  const handleLinkClick = (link) => {
    setActiveLink(link); // Set the active link immediately
  };

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
      </nav>
    </>
  );
};

export default Sidebar;
