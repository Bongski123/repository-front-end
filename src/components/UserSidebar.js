import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CSS/sidebar.css'; // Assuming you have a CSS file for styling
import { FaHome, FaRegClock, FaBars, FaBook, FaBell, FaBookmark } from 'react-icons/fa'; // Using react-icons
import { BsFillCloudUploadFill } from "react-icons/bs";

const UserSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle

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
            <Link to="/">
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
            <Link to="/user/researches/:userId">
              <FaBook />
              <span>My Papers</span>
            </Link>
          </li>
          <li>
            <Link to="/collections/:userId">
              <FaBookmark />
              <span>My Collections</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default UserSidebar;
