import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CSS/sidebar.css'; // Assuming you have a CSS file for styling
import { FaHome, FaRegClock, FaHistory, FaUserCircle, FaList, FaBars,Faupload } from 'react-icons/fa'; // Using react-icons
import { BsFillCloudUploadFill } from "react-icons/bs";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaTags } from 'react-icons/fa'; // Importing the Tags icon
import { FaFolder } from 'react-icons/fa'; // Importing the Folder icon
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="burger-menu" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/admin/dashboard">
              <FaHome />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/upload">
            <BsFillCloudUploadFill />
              <span>Upload</span>
            </Link>
          </li>
          <li>
    <Link to="/category-list">
        <FaFolder /> {/* Using the Folder icon */}
        <span>Category Settings</span>
    </Link>
</li>
          <li>
          <Link to="/keyword-list">
    <FaTags /> {/* Using the Tags icon */}
    <span>Keywords Settings</span>
</Link>
          </li>
          <hr />
          <li>
            <Link to="/admin/users">
              <FaUserCircle />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link to="/researchList">
            <IoDocumentTextSharp />
              <span>Researches</span>
            </Link>
          </li>
    
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
