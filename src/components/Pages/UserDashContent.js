import React, { useState, useEffect } from 'react';
import { FaUser, FaQuoteRight, FaEye, FaFileAlt } from 'react-icons/fa';
import { IoMdCloudDownload } from 'react-icons/io';
import { Line } from 'react-chartjs-2';
import { Dropdown, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../CSS/UserDashContent.css';
import '../CSS/TopContent.Module.css';
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
  const [userViews, setUserViews] = useState(0);
  const [totalResearches, setTotalResearches] = useState(0); // Added state for total researches

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
  const [dataType, setDataType] = useState('downloads');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalData, setModalData] = useState({ title: '', type: '', show: false });

  const navigate = useNavigate();

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

          // Fetching total data for user
          const totalDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/total/downloads/${userId}`);
          const totalDownloadsData = await totalDownloadsResponse.json();
          setUserDownloads(totalDownloadsData.total_downloads || 0);

          const totalCitationsResponse = await fetch(`https://ccsrepo.onrender.com/total/citations/${userId}`);
          const totalCitationsData = await totalCitationsResponse.json();
          setUserCitations(totalCitationsData.total_citations || 0);

          const totalViewsResponse = await fetch(`https://ccsrepo.onrender.com/total/views/${userId}`);
          const totalViewsData = await totalViewsResponse.json();
          setUserViews(totalViewsData.total_views || 0);

          // Fetch total researches data
          const totalResearchesResponse = await fetch(`https://ccsrepo.onrender.com/total/researches/${userId}`);
          const totalResearchesData = await totalResearchesResponse.json();
          setTotalResearches(totalResearchesData.total_researches || 0);

          // Fetching data for daily, weekly, monthly stats
          const dailyDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/user/daily/downloads/${userId}`);
          const dailyDownloadsData = await dailyDownloadsResponse.json();
          setDailyDownloads(dailyDownloadsData.length > 0 ? dailyDownloadsData : [{ downloads: 0 }]);

          const weeklyDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/user/weekly/downloads/${userId}`);
          const weeklyDownloadsData = await weeklyDownloadsResponse.json();
          setWeeklyDownloads(weeklyDownloadsData.length > 0 ? weeklyDownloadsData : [{ week: 1, downloads: 0 }]);

          const monthlyDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/user/monthly/downloads/${userId}`);
          const monthlyDownloadsData = await monthlyDownloadsResponse.json();
          setMonthlyDownloads(monthlyDownloadsData.length > 0 ? monthlyDownloadsData : [{ month: 1, downloads: 0 }]);

          const dailyCitationsResponse = await fetch(`https://ccsrepo.onrender.com/user/daily/citations/${userId}`);
          const dailyCitationsData = await dailyCitationsResponse.json();
          setDailyCitations(dailyCitationsData.length > 0 ? dailyCitationsData : [{ citations: 0 }]);

          const weeklyCitationsResponse = await fetch(`https://ccsrepo.onrender.com/user/weekly/citations/${userId}`);
          const weeklyCitationsData = await weeklyCitationsResponse.json();
          setWeeklyCitations(weeklyCitationsData.length > 0 ? weeklyCitationsData : [{ week: 1, citations: 0 }]);

          const monthlyCitationsResponse = await fetch(`https://ccsrepo.onrender.com/user/monthly/citations/${userId}`);
          const monthlyCitationsData = await monthlyCitationsResponse.json();
          setMonthlyCitations(monthlyCitationsData.length > 0 ? monthlyCitationsData : [{ month: 1, citations: 0 }]);

          const dailyViewsResponse = await fetch(`https://ccsrepo.onrender.com/user/daily/views/${userId}`);
          const dailyViewsData = await dailyViewsResponse.json();
          setDailyViews(dailyViewsData.length > 0 ? dailyViewsData : [{ views: 0 }]);

          const weeklyViewsResponse = await fetch(`https://ccsrepo.onrender.com/user/weekly/views/${userId}`);
          const weeklyViewsData = await weeklyViewsResponse.json();
          setWeeklyViews(weeklyViewsData.length > 0 ? weeklyViewsData : [{ week: 1, views: 0 }]);

          const monthlyViewsResponse = await fetch(`https://ccsrepo.onrender.com/user/monthly/views/${userId}`);
          const monthlyViewsData = await monthlyViewsResponse.json();
          setMonthlyViews(monthlyViewsData.length > 0 ? monthlyViewsData : [{ month: 1, views: 0 }]);

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
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      return date;
    });

    labels = last7Days.map((date) => dayNames[date.getDay()]);
    values = last7Days.map((date) => {
      const dataForDate = data.find((item) => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === date.toDateString();
      });
      return dataForDate ? Math.round(dataForDate[title.toLowerCase()]) : 0;
    });
  } else if (timeRange === 'weekly') {
    labels = data.map((item) => `Week ${item.week}`);
    values = data.map((item) => Math.round(item[title.toLowerCase()] || 0));
  } else if (timeRange === 'monthly') {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    labels = monthNames;
    values = labels.map((month, index) => {
      const monthData = data.find((item) => item.month === index + 1);
      return monthData ? Math.round(monthData[title.toLowerCase()]) : 0;
    });
  }

  return {
    labels,
    datasets: [
      {
        label: `${title.charAt(0).toUpperCase() + title.slice(1)}`,
        data: values,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: {
            stepSize: 1,
            beginAtZero: true,
            callback: (value) => Math.floor(value), // Ensure whole numbers
          },
        },
      },
    },
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
    updateChartData(timeRange, type);  // Fetch and update the data when the modal is opened
  };
  
  const updateChartData = (range, type) => {
    let data = [];
    let title = type.charAt(0).toUpperCase() + type.slice(1);
  
    if (range === 'daily') {
      data = 
        type === 'downloads' ? dailyDownloads : 
        type === 'citations' ? dailyCitations : 
        dailyViews;
    } else if (range === 'weekly') {
      data = 
        type === 'downloads' ? weeklyDownloads : 
        type === 'citations' ? weeklyCitations : 
        weeklyViews;
    } else if (range === 'monthly') {
      data = 
        type === 'downloads' ? monthlyDownloads : 
        type === 'citations' ? monthlyCitations : 
        monthlyViews;
    }
  
    setChartData(formatChartData(data, title)); // Update chart data with the selected range and type
  };
  
  
  const closeModal = () => {
    setModalData({ ...modalData, show: false });
  };

  // Display cards first while loading
  return (
    <div className="dashboard-content">
      <div className="info-cards">
        <div className="info-card blue" onClick={() => openModal('downloads')}>
          <IoMdCloudDownload className="icon" />
          <p>Downloads</p>
          <h3 className={isLoading ? 'loading-text' : ''}>
    {userDownloads}
  </h3>
        </div>
        <div className="info-card green" onClick={() => openModal('citations')}>
          <FaQuoteRight className="icon" />
          <p>Citations</p>
          <h3>{userCitations}</h3>
        </div>
        <div className="info-card yellow" onClick={() => openModal('views')}>
          <FaEye className="icon" />
          <p>Views</p>
          <h3>{ userViews}</h3>
        </div>
        <div className="info-card purple" onClick={() => navigate('/user/researches/:userId')}>
          <FaFileAlt className="icon" />
          <p>Researches</p>
          <h3>{totalResearches}</h3>
        </div>
      </div>

      <Modal show={modalData.show} onHide={closeModal} centered size="lg">
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

          <Line data={chartData} options={chartData.options} />

        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserDashContent;
