import React, { useState, useEffect } from 'react';
import { FaUser, FaQuoteRight } from "react-icons/fa";
import { IoMdCloudDownload } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";

import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Modal, Dropdown } from 'react-bootstrap';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './CSS/UserDashContent.css';

// Register necessary components for Chart.js
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const DashboardContent = () => {
  const navigate = useNavigate();
  const [downloads, setDownloads] = useState(0);
  const [citations, setCitations] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalResearches, setTotalResearches] = useState(0);
  const [dailyDownloads, setDailyDownloads] = useState([]);
  const [dailyCitations, setDailyCitations] = useState([]);
  const [dailyViews, setDailyViews] = useState([]);
  const [weeklyDownloads, setWeeklyDownloads] = useState([]);
  const [weeklyCitations, setWeeklyCitations] = useState([]);
  const [weeklyViews, setWeeklyViews] = useState([]);
  const [monthlyDownloads, setMonthlyDownloads] = useState([]);
  const [monthlyCitations, setMonthlyCitations] = useState([]);
  const [monthlyViews, setMonthlyViews] = useState([]);
  const [timeRange, setTimeRange] = useState('daily');
  const [year, setYear] = useState(new Date().getFullYear()); // Track the selected year
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [modalData, setModalData] = useState({
    title: '',
    type: '',
    show: false,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch general stats
        const downloadsResponse = await fetch(`https://ccsrepo.onrender.com/total/downloads?year=${year}`);
        const downloadsData = await downloadsResponse.json();
        setDownloads(downloadsData.total_downloads || 0);

        const citationsResponse = await fetch(`https://ccsrepo.onrender.com/total/citations?year=${year}`);
        const citationsData = await citationsResponse.json();
        setCitations(citationsData.total_citations || 0);

        const usersResponse = await fetch(`https://ccsrepo.onrender.com/all/users?year=${year}`);
        const usersData = await usersResponse.json();
        setTotalUsers(usersData.total_users || 0);

        const researchesResponse = await fetch(`https://ccsrepo.onrender.com/total/researches?year=${year}`);
        const researchesData = await researchesResponse.json();
        setTotalResearches(researchesData.total_researches || 0);

        // Fetch daily, weekly, and monthly data
        const dailyDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/daily/downloads`);
const dailyDownloadsData = await dailyDownloadsResponse.json();
console.log("Daily Downloads API Response:", dailyDownloadsData);
setDailyDownloads(dailyDownloadsData);

        const dailyCitationsResponse = await fetch(`https://ccsrepo.onrender.com/daily/citations`);
        const dailyCitationsData = await dailyCitationsResponse.json();
        setDailyCitations(dailyCitationsData);

        const dailyViewsResponse = await fetch(`https://ccsrepo.onrender.com/daily/views`);
        const dailyViewsData = await dailyViewsResponse.json();
        setDailyViews(dailyViewsData);

        const weeklyDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/weekly/downloads`);
        const weeklyDownloadsData = await weeklyDownloadsResponse.json();
        setWeeklyDownloads(weeklyDownloadsData);

        const weeklyCitationsResponse = await fetch(`https://ccsrepo.onrender.com/weekly/citations`);
        const weeklyCitationsData = await weeklyCitationsResponse.json();
        setWeeklyCitations(weeklyCitationsData);

        const weeklyViewsResponse = await fetch(`https://ccsrepo.onrender.com/weekly/views`);
        const weeklyViewsData = await weeklyViewsResponse.json();
        setWeeklyViews(weeklyViewsData);

        const monthlyDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/monthly/downloads`);
        const monthlyDownloadsData = await monthlyDownloadsResponse.json();
        setMonthlyDownloads(monthlyDownloadsData);

        const monthlyCitationsResponse = await fetch(`https://ccsrepo.onrender.com/monthly/citations`);
        const monthlyCitationsData = await monthlyCitationsResponse.json();
        setMonthlyCitations(monthlyCitationsData);

        const monthlyViewsResponse = await fetch(`https://ccsrepo.onrender.com/monthly/views`);
        const monthlyViewsData = await monthlyViewsResponse.json();
        setMonthlyViews(monthlyViewsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [year]); // Re-fetch data when the year changes

  useEffect(() => {
    if (modalData.show) {
      const updatedChartData = aggregateData(
        modalData.type === 'downloads' ? dailyDownloads : modalData.type === 'citations' ? dailyCitations : dailyViews,
        modalData.type === 'downloads' ? weeklyDownloads : modalData.type === 'citations' ? weeklyCitations : weeklyViews,
        modalData.type === 'downloads' ? monthlyDownloads : modalData.type === 'citations' ? monthlyCitations : monthlyViews,
        timeRange,
        modalData.type
      );
      setChartData(updatedChartData);
    }
  }, [timeRange, dailyDownloads, weeklyDownloads, monthlyDownloads, dailyCitations, weeklyCitations, monthlyCitations, dailyViews, weeklyViews, monthlyViews, modalData]);

  const aggregateData = (dailyData, weeklyData, monthlyData, range, type) => {
    let labels = [];
    let data = [];

    if (range === 'daily') {
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      labels = daysOfWeek;
      const weeklyDataMap = new Map();
      daysOfWeek.forEach(day => weeklyDataMap.set(day, 0));

      dailyData.forEach(item => {
        const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(item.date));
        if (weeklyDataMap.has(dayOfWeek)) {
          weeklyDataMap.set(dayOfWeek, weeklyDataMap.get(dayOfWeek) + item[type]);
        }
      });

      data = daysOfWeek.map(day => weeklyDataMap.get(day));

    } else if (range === 'weekly') {
      labels = weeklyData.map((item) => `Week ${item.week}`);
      data = weeklyData.map((item) => item[type]);
    } else if (range === 'monthly') {
      const allMonths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const monthlyDataMap = new Map();
      monthlyData.forEach(item => {
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(`${item.year}-${item.month}-01`));
        monthlyDataMap.set(monthName, item[type]);
      });

      labels = allMonths;
      data = allMonths.map(month => monthlyDataMap.get(month) || 0);
    }

    return { labels, data };
  };

  const openModal = (type) => {
    setModalData({
      title: type === 'downloads' ? 'Total Downloads' : type === 'citations' ? 'Total Citations' : 'Total Views',
      type,
      show: true,
    });
  };

  const closeModal = () => {
    setModalData({ ...modalData, show: false });
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
  };

  return (
    <div className="dashboard-content">
      <div className="info-cards">
        <div className="info-card blue" onClick={() => openModal('downloads')}>
          <IoMdCloudDownload className="icon" />
          <p>Downloads</p>
          <h3>{downloads}</h3>
        </div>
        <div className="info-card green" onClick={() => openModal('citations')}>
          <FaQuoteRight className="icon" />
          <p>Citations</p>
          <h3>{citations}</h3>
        </div>
        <div className="info-card purple" onClick={() => navigate('/researchList')}>
          <FaFileAlt className="icon" />
          <p>Researches</p>
          <h3>{totalResearches}</h3>
        </div>

        <div className="info-card yellow" onClick={() => navigate('/admin/users')}>
          <FaUser className="icon" />
          <p> Users</p>
          <h3>{totalUsers}</h3>
        </div>
      </div>

      <Modal show={modalData.show} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-custom-components">
              {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Data
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleTimeRangeChange('daily')}>Daily</Dropdown.Item>
              <Dropdown.Item onClick={() => handleTimeRangeChange('weekly')}>Weekly</Dropdown.Item>
              <Dropdown.Item onClick={() => handleTimeRangeChange('monthly')}>Monthly</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Line
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: modalData.title,
                  data: chartData.data,
                  borderColor: '#ff7300',
                  backgroundColor: 'rgba(255, 115, 0, 0.3)',
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: modalData.title,
                },
              },
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardContent;
