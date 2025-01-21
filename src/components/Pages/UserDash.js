import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import UserSidebar from '../UserSidebar';
import '../CSS/userdash.css';
import UserDashContent from './UserDashContent';

const TopContent = ({ roleId }) => {
  const [topDownloads, setTopDownloads] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);

  useEffect(() => {
    // Fetch Top Downloads from the API
    const fetchTopDownloads = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/top-downloads');
        setTopDownloads(response.data);
      } catch (error) {
        console.error('Error fetching top downloads:', error);
      }
    };

    const fetchTrendingSearches = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/trending-searches');
        setTrendingSearches(response.data);
      } catch (error) {
        console.error('Error fetching trending searches:', error);
      }
    };

    fetchTopDownloads();
    fetchTrendingSearches();
  }, []);

  // Only render content for users who are not admins (roleId !== 1) and not non-NCF users or roleId === 4
  const isVisible = roleId !== 1 ;  // Show for users whose role is neither admin nor non-NCF user (or roleId 4)

  return (
    isVisible && (
      <div className="top-content">
        {/* Top Downloads Section */}
        <section className="top-downloads">
  <h2>Top 3 Most Downloaded Papers</h2>
  <ul>
    {topDownloads.slice(0, 3).map((item, index) => (
      <li key={item.research_id}>
        {index + 1}.{''}
        <Link
          to={`/details`}
          state={{ result: item }}
          style={{ textDecoration: 'none', color: 'green' }}
        >
          {item.title}
        </Link>{' '}
        - {item.downloadCount} downloads
        <br />
        
      </li>
    ))}
  </ul>
</section>

<section className="trending-searches">
  <h2>Top 3 Most Popular Searches</h2>
  <ul>
    {trendingSearches.slice(0, 3).map((item, index) => (
      <li key={index}>
        {index + 1}.{' '}
        <Link
          to={`/details`}
          state={{ result: item }}
          style={{ textDecoration: 'none', color: 'green' }}
        >
          {item.title}
        </Link>
      </li>
    ))}
  </ul>
</section>

      </div>
    )
  );
};

const UserDashboard = () => {
  const [roleId, setRoleId] = useState(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token to get the user info
        setEmail(decodedToken.email);
        setFirstName(decodedToken.firstName || 'User'); // Set firstName if available
        const role = decodedToken.roleId || localStorage.getItem('roleId'); // Get the roleId from localStorage or token
        setRoleId(role);

        // Redirect to admin dashboard if user is an admin
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
      <UserSidebar
        isOpen={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        roleId={roleId}
      />
      <main className={`main-content ${isSidebarVisible ? 'with-sidebar' : 'full-width'}`}>

      
   

        {/* Only render the content for users with specific roleId */}
        {roleId !== 1 && roleId !== 4 && <UserDashContent />}
        
        {/* Show TopContent only for users who are not admin and not non-NCF user */}
        <TopContent roleId={roleId} />
      </main>
    </div>
  );
};

export default UserDashboard;
