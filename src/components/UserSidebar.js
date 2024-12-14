import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/sidebar.css';
import { FaHome, FaBars, FaBook, FaBookmark } from 'react-icons/fa';
import { BsFillCloudUploadFill } from 'react-icons/bs';

const getCurrentUserId = () => localStorage.getItem('userId');
const getCurrentUserEmail = () => localStorage.getItem('userEmail'); // Assuming user email is stored in localStorage

const UserSidebar = ({ isOpen, toggleSidebar, roleId }) => {
  const allowedRoles = [1, 2, 3, 5]; // Roles allowed to see specific features
  const pdfRequestRoles = [1, 2, 3, 5]; // Roles allowed to see PDF Requests
  const userId = getCurrentUserId();
  const userEmail = getCurrentUserEmail(); // Get the user's email
  const isNonNCFUser = userEmail && !userEmail.includes('@ncf.edu'); // Check if the user is not from NCF

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

          {allowedRoles.includes(roleId) && (
            <li>
              <Link to="/upload">
                <BsFillCloudUploadFill />
                <span>Upload</span>
              </Link>
            </li>
          )}

          {allowedRoles.includes(roleId) && userId && (
            <li>
              <Link to={`/user/researches/${userId}`}>
                <FaBook />
                <span>My Papers</span>
              </Link>
            </li>
          )}

          {userId && !isNonNCFUser && ( // Hide for non-NCF users
            <li>
              <Link to={`/collections/${userId}`}>
                <FaBookmark />
                <span>My Collections</span>
              </Link>
            </li>
          )}

          {/* PDF Requests - Visible for roles allowed in pdfRequestRoles */}
          {pdfRequestRoles.includes(roleId) && userId && (
            <li>
              <Link to={`/pdf-requests/${userId}`}>
                <FaBookmark />
                <span>PDF Requests</span>
              </Link>
            </li>
          )}

          {/* Show all content for non-NCF users */}
          {isNonNCFUser && (
            <>
              <li>
                <Link to="/pdf-requests">
                  <FaBookmark />
                  <span>All PDF Requests</span>
                </Link>
              </li>
              <li>
                <Link to="/other-features">
                  <FaBookmark />
                  <span>Other Features</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default UserSidebar;
