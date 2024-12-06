import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component

const containerStyle = {
  display: 'row', // Use flexbox for layout
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  padingLeft: '200px',
  marginLeft: '250px'
};

const headerStyle = {
  fontSize: '2rem',
  color: '#333',
  borderBottom: '2px solid #ddd',
  paddingBottom: '10px',
  width: '100%', // Ensure header takes full width
};

const tableStyle = {
  width: '80%', // Adjust width to create space for the sidebar
  borderCollapse: 'collapse',
  margin: '20px 0',
  marginLeft: '20px', // Add left margin to move the table to the right
};

const thStyle = {
  backgroundColor: '#f4f4f4',
  padding: '10px',
  borderBottom: '2px solid #ddd',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const linkStyle = {
  color: '#007BFF',
  textDecoration: 'none',
};

const errorStyle = {
  color: 'red',
  fontWeight: 'bold',
};

// Define status styles
const statusStyle = {
  approved: {
    color: 'green',
    fontWeight: 'bold',
  },
  pending: {
    color: 'blue',
    fontWeight: 'bold',
  },
  rejected: {
    color: 'red',
    fontWeight: 'bold',
  },
  archived: {
    color: 'gray',
    fontWeight: 'bold',
  },
};

function ResearchList() {
  const [researches, setResearches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [isOpen, setIsOpen] = useState(false); // Sidebar visibility
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [statusFilter, setStatusFilter] = useState(''); // Status filter
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 10;

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/researches');
        setResearches(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchResearches();
  }, []);

  // Filter and search logic
  const filteredResearches = researches.filter((research) => {
    const matchesSearch = research.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? research.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResearches = filteredResearches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResearches.length / itemsPerPage);

  // Handle pagination click
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={containerStyle}>
      <Sidebar toggleSidebar={toggleSidebar} />
      <div style={{ flex: 1 }}> {/* Allow this div to take remaining space */}
        <h1 style={headerStyle}>Research List</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            margin: '10px 0',
            padding: '5px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />

        {/* Status Filter */}
        <div style={{ margin: '10px 0' }}>
          <label>
            Filter by status:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px', fontSize: '1rem' }}
            >
              <option value="">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>

            </select>
          </label>
        </div>

        {/* Loading and Error Messages */}
        {loading && <p>Loading...</p>}
        {error && <p style={errorStyle}>Error: {error}</p>}

        {/* Research Table */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Authors</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentResearches.map((research) => (
              <tr key={research.research_id}>
                <td style={tdStyle}>{research.title}</td>
                <td style={tdStyle}>
                  <span style={statusStyle[research.status] || {}}>{research.status}</span>
                </td>
                <td style={tdStyle}>
                  {research.authors || 'No authors available'}
                </td>
                <td style={tdStyle}>
                  <a href={`/research/${research.research_id}`} style={linkStyle}>
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handleClick(index + 1)}
              style={{
                margin: '0 5px',
                padding: '5px 10px',
                cursor: 'pointer',
                backgroundColor: currentPage === index + 1 ? '#007BFF' : '#f4f4f4',
                color: currentPage === index + 1 ? '#fff' : '#000',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResearchList;
