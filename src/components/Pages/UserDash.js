import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserSidebar from '../UserSidebar';
import '../CSS/userdash.css';
import UserDashContent from './UserDashContent';

const TopContent = () => {
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

    const fetchTrendingSearches = async (researchId) => {
      try {
        const response = await axios.get(`https://ccsrepo.onrender.com/trending-searches`, {
          params: { researchId } // Pass researchId as a query parameter
        });
        setTrendingSearches(response.data);
      } catch (error) {
        console.error('Error fetching trending searches:', error);
      }
    };
    fetchTopDownloads();
    fetchTrendingSearches();
  }, []);

  return (
    <div className="top-content">
      <section className="top-downloads">
        <h2>Top 10 Most Downloaded Papers</h2>
        <ul>
          {topDownloads.map((item, index) => (
            <li key={item.research_id}>
              {index + 1}. 
              <Link to={`/details`} state={{ result: item }} style={{ textDecoration: 'none', color: 'green' }}>
                {item.title}
              </Link> 
              - {item.downloadCount} downloads
              <br />
              <strong>authors:</strong> {item.authors}
            </li>
          ))}
        </ul>
        </section>
      <section className="trending-searches">
        <h2>Top 10 Most Search</h2>
        <ul>
          {trendingSearches.map((item, index) => (
            <li key={index}>
              {index + 1}. 
              <Link to={`/details`} state={{ result: item }} style={{ textDecoration: 'none', color: 'green' }}>
                {item.title}
              </Link>
       
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};


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

  // Define allowed roles for NCF dashboard content
  const allowedRoles = [1, 2, 3, 5];

  return (
    <div className="dashboard-container">
      <UserSidebar 
        isOpen={isSidebarVisible} 
        toggleSidebar={toggleSidebar} 
        roleId={roleId} 
      />
      <main className={`main-content ${isSidebarVisible ? 'with-sidebar' : 'full-width'}`}>
        <header className="dashboard-header">
          <h1>Welcome, {email || 'User'}!</h1>
        </header>
        {/* Render dashboard content based on role */}
        {allowedRoles.includes(roleId) ? (
          <UserDashContent />
        ) : (
          <TopContent />
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
