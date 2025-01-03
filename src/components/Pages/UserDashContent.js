import React, { useState, useEffect } from 'react';
import { FaUser, FaQuoteRight, FaEye } from "react-icons/fa";
import { IoMdCloudDownload } from "react-icons/io";
import { Line } from 'react-chartjs-2';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap'; // Import Spinner
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import '../CSS/UserDashContent.css';
import '../CSS/TopContent.Module.css'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const UserDashContent = () => {
  const [userId, setUserId] = useState(null);
  const [userDownloads, setUserDownloads] = useState(0);
  const [userCitations, setUserCitations] = useState(0);
  const [userActivity, setUserActivity] = useState(0);
  const [userViews, setUserViews] = useState(0);

  const [dailyDownloads, setDailyDownloads] = useState([]);
  const [weeklyDownloads, setWeeklyDownloads] = useState([]);
  const [monthlyDownloads, setMonthlyDownloads] = useState([]);

  const [dailyCitations, setDailyCitations] = useState([]);
  const [weeklyCitations, setWeeklyCitations] = useState([]);
  const [monthlyCitations, setMonthlyCitations] = useState([]);

  const [dailyViews, setDailyViews] = useState([]);
  const [weeklyViews, setWeeklyViews] = useState([]);
  const [monthlyViews, setMonthlyViews] = useState([]);

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [timeRange, setTimeRange] = useState('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state management
  const [modalData, setModalData] = useState({ title: '', type: '', show: false });

  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          setError(null);

          const dashboardResponse = await fetch(`https://ccsrepo.onrender.com/user/dashboard?user_id=${userId}`);
          const dashboardData = await dashboardResponse.json();
          setUserDownloads(dashboardData.total_downloads);
          setUserCitations(dashboardData.total_citations);
          setUserActivity(dashboardData.total_researches);
          setUserViews(dashboardData.total_views);

          const dailyDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/user/daily/downloads?userId=${userId}`);
          setDailyDownloads(await dailyDownloadsResponse.json());

          const weeklyDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/user/weekly/downloads?userId=${userId}`);
          setWeeklyDownloads(await weeklyDownloadsResponse.json());

          const monthlyDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/user/monthly/downloads?userId=${userId}`);
          setMonthlyDownloads(await monthlyDownloadsResponse.json());

          const dailyCitationsResponse = await fetch(`https://ccsrepo.onrender.com/user/daily/citations?userId=${userId}`);
          setDailyCitations(await dailyCitationsResponse.json());

          const weeklyCitationsResponse = await fetch(`https://ccsrepo.onrender.com/user/weekly/citations?userId=${userId}`);
          setWeeklyCitations(await weeklyCitationsResponse.json());

          const monthlyCitationsResponse = await fetch(`https://ccsrepo.onrender.com/user/monthly/citations?userId=${userId}`);
          setMonthlyCitations(await monthlyCitationsResponse.json());

          const dailyViewsResponse = await fetch(`https://ccsrepo.onrender.com/user/daily/views?userId=${userId}`);
          setDailyViews(await dailyViewsResponse.json());

          const weeklyViewsResponse = await fetch(`https://ccsrepo.onrender.com/user/weekly/views?userId=${userId}`);
          setWeeklyViews(await weeklyViewsResponse.json());

          const monthlyViewsResponse = await fetch(`https://ccsrepo.onrender.com/user/monthly/views?userId=${userId}`);
          setMonthlyViews(await monthlyViewsResponse.json());

        } catch (error) {
          setError('Failed to fetch data. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [userId]);

  
  const formatChartData = (data, title) => {
    let labels = [];
    let values = [];
  
    if (timeRange === 'daily') {
      labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      values = data.map((item) => item.views || item.downloads || item.citations);
    } else if (timeRange === 'weekly') {
      labels = data.map((item) => `Week ${item.week}`);
      values = data.map((item) => item.views || item.downloads || item.citations);
    } else if (timeRange === 'monthly') {
      // Map numeric month (1-12) to month names
      labels = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      // Map the data to values for the respective months
      values = labels.map((month, index) => {
        const monthData = data.find(item => item.month === index + 1); // +1 to match month (1-12)
        return monthData ? monthData.views : 0; // Default to 0 if no data
      });
    }
  
    return {
      labels,
      datasets: [
        {
          label: title,
          data: values,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          fill: true,
        },
      ],
    };
  };
  

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);  // Change time range when dropdown value is selected
  };
  
  useEffect(() => {
    // Check if modalData.type is set and timeRange has been changed
    if (modalData.type && timeRange) {
      updateChartData(timeRange, modalData.type);  // Update the chart data when timeRange or type changes
    }
  }, [timeRange, modalData.type]);  // This effect runs when either timeRange or modalData.type changes
  
  const openModal = (type) => {
    setModalData({ title: `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} ${type}`, type, show: true });
    // Update chart immediately when modal opens
    updateChartData(timeRange, type);
  };
  
  const updateChartData = (range, type) => {
    let data = [];
    let title = `${range.charAt(0).toUpperCase() + range.slice(1)} ${type}`;
  
    if (range === 'daily') {
      data = type === 'downloads' ? dailyDownloads : type === 'citations' ? dailyCitations : dailyViews;
    } else if (range === 'weekly') {
      data = type === 'downloads' ? weeklyDownloads : type === 'citations' ? weeklyCitations : weeklyViews;
    } else if (range === 'monthly') {
      data = type === 'downloads' ? monthlyDownloads : type === 'citations' ? monthlyCitations : monthlyViews;
    }
  
    setChartData(formatChartData(data, title));  // Update chart data with the selected range and type
  };
  
  

  const closeModal = () => {
    setModalData({ ...modalData, show: false });
  };

  // Navigate to the research page using the userId
  const handleResearchPageNavigation = () => {
    navigate(`/user/researches/${userId}`);  // Replace with the actual route of your research page
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-content">
      <div className="info-cards">
        <div className="info-card blue" onClick={() => openModal('downloads')}>
          <IoMdCloudDownload className="icon" />
          <p>Downloads</p>
          <h3>{userDownloads}</h3>
        </div>
        <div className="info-card green" onClick={() => openModal('citations')}>
          <FaQuoteRight className="icon" />
          <p>Citations</p>
          <h3>{userCitations}</h3>
        </div>
        <div className="info-card yellow" onClick={handleResearchPageNavigation}>
          <FaEye className="icon" />
          <p> Researches</p>
          <h3>{userActivity}</h3>
        </div>
        <div className="info-card red" onClick={() => openModal('views')}>
          <FaUser className="icon" />
          <p>Views</p>
          <h3>{userViews}</h3>
        </div>
      </div>

      <Modal show={modalData.show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropdown onSelect={handleTimeRangeChange}>
            <Dropdown.Toggle variant="success" id="dropdown-custom-components">
              {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="daily">Daily</Dropdown.Item>
              <Dropdown.Item eventKey="weekly">Weekly</Dropdown.Item>
              <Dropdown.Item eventKey="monthly">Monthly</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Line data={chartData} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserDashContent;
