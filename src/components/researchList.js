import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const containerStyle = {
  display: 'flex', // Use flexbox for layout
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  // Dynamically set paddingLeft based on sidebar state
  paddingLeft: '20px', 
  marginLeft: '60px',
  transition: 'margin-left 0.3s ease, padding-left 0.3s ease', // Add transition for sidebar toggle
};
const headerStyle = {
  fontSize: '2rem',
  color: '#333',
  borderBottom: '2px solid #ddd',
  paddingBottom: '10px',
  width: '100%', // Ensure header takes full width
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

// Define styles for title column to apply ellipsis and set width
const titleColumnStyle = {
  whiteSpace: 'nowrap',  // Prevent text from wrapping
  overflow: 'hidden',    // Hide overflowing text
  textOverflow: 'ellipsis', // Add ellipsis for overflowing text
  maxWidth: '200px', // Limit the width of the title column
};

function ResearchList() {
  const [researches, setResearches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [isOpen, setIsOpen] = useState(true); // Sidebar visibility
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
        const response = await axios.get('https://ccsrepo.onrender.com/dash/researches');
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
    <div style={{ ...containerStyle, paddingLeft: isOpen ? '55px' : '20px', marginLeft: isOpen ? '200px' : '60px' }}>
    <Sidebar toggleSidebar={toggleSidebar} isOpen={isOpen} /> {/* Pass toggleSidebar and isOpen as props */}
    <div style={{ flex: 1 }}>
        <h1 style={headerStyle}>Research List</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control" // Bootstrap form control class
          style={{
            margin: '10px 0',
            fontSize: '1rem',
          }}
        />

        {/* Status Filter */}
        <div style={{ margin: '10px 0' }}>
          <label>
            Filter by status:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select" // Bootstrap form select class
              style={{ marginLeft: '10px', fontSize: '1rem' }}
            >
              <option value="">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        {/* Loading and Error Messages */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}

        {/* Research Table */}
        <table className="table table-striped table-bordered"> {/* Bootstrap table classes */}
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Authors</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentResearches.map((research) => (
              <tr key={research.research_id}>
                <td style={titleColumnStyle}>{research.title}</td>
                <td>
                  <span style={statusStyle[research.status] || {}}>{research.status}</span>
                </td>
                <td>{research.authors && research.authors.length > 0 ? research.authors : 'No authors available'}</td>
                <td>
                  <a href={`/research/${research.research_id}`} className="btn btn-primary btn-sm">
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
              className={`btn btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                margin: '0 5px',
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
