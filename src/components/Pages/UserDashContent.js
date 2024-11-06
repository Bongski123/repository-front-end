import React, { useState, useEffect } from 'react';
import { FaUser, FaQuoteRight, FaEye } from "react-icons/fa"; // Importing necessary icons
import { IoMdCloudDownload } from "react-icons/io";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom'; // Import Link
import '../CSS/UserDashContent.css';

// Register necessary components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const UserDashContent = () => {
  const [userId, setUserId] = useState(null);
  const [userDownloads, setUserDownloads] = useState(0);
  const [userCitations, setUserCitations] = useState(0);
  const [userActivity, setUserActivity] = useState(0);
  const [userViews, setUserViews] = useState(0); // New state for total views
  const [dailyUserDownloads, setDailyUserDownloads] = useState({ labels: [], data: [] });
  const [dailyUserCitations, setDailyUserCitations] = useState({ labels: [], data: [] });

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserDashboardData = async () => {
        try {
          // Fetch user dashboard data
          const dashboardResponse = await fetch(`https://ccsrepo.onrender.com/user/dashboard?user_id=${userId}`);
          if (!dashboardResponse.ok) {
            throw new Error(`HTTP error! status: ${dashboardResponse.status}`);
          }

          const dashboardData = await dashboardResponse.json();
          setUserDownloads(dashboardData.total_downloads);
          setUserCitations(dashboardData.total_citations);
          setUserActivity(dashboardData.total_researches);
          setUserViews(dashboardData.total_views); // Set total views

          // Fetch daily downloads and citations for the individual uploader
          const dailyDownloadsResponse = await fetch(`https://ccsrepo.onrender.com/user/daily/downloads?userId=${userId}`);
          const dailyDownloadsData = await dailyDownloadsResponse.json();

          const dailyCitationsResponse = await fetch(`https://ccsrepo.onrender.com/user/daily/citations?userId=${userId}`);
          const dailyCitationsData = await dailyCitationsResponse.json();

          const downloadsByDay = Array(7).fill(0);
          dailyDownloadsData.forEach(({ date, downloads }) => {
            const dayOfWeek = new Date(date).getDay();
            downloadsByDay[dayOfWeek] += downloads;
          });

          const citationsByDay = Array(7).fill(0);
          dailyCitationsData.forEach(({ date, citations }) => {
            const dayOfWeek = new Date(date).getDay();
            citationsByDay[dayOfWeek] += citations;
          });

          const daysLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

          setDailyUserDownloads({
            labels: daysLabels,
            data: downloadsByDay,
          });
          setDailyUserCitations({
            labels: daysLabels,
            data: citationsByDay,
          });
        } catch (error) {
          console.error('Error fetching user dashboard data:', error);
        }
      };

      fetchUserDashboardData();
    }
  }, [userId]);

  const downloadsChartData = {
    labels: dailyUserDownloads.labels,
    datasets: [
      {
        label: 'Your Daily Downloads',
        data: dailyUserDownloads.data,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const citationsChartData = {
    labels: dailyUserCitations.labels,
    datasets: [
      {
        label: 'Your Daily Citations',
        data: dailyUserCitations.data,
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Day of the Week',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="user-dashboard-content">
      <div className="info-cards">
        <div className="info-card blue">
          <IoMdCloudDownload className="icon" />
          <p>Total Downloads</p>
          <h3>{userDownloads}</h3>
        </div>
        <div className="info-card green">
          <FaQuoteRight className="icon" />
          <p>Total Citations</p>
          <h3>{userCitations}</h3>
        </div>
        <Link to={`/user/researches/${userId}`} className="info-card yellow">
          <FaUser className="icon" />
          <p>Total Researches</p>
          <h3>{userActivity}</h3>
        </Link>
        <div className="info-card purple"> {/* New card for Total Views */}
          <FaEye className="icon" />
          <p>Total Views</p>
          <h3>{userViews}</h3>
        </div>
      </div>
      <div className="charts">
        <div className="chart">
          <h3>Your Daily Downloads</h3>
          <Line data={downloadsChartData} options={options} />
        </div>
        <div className="chart">
          <h3>Your Daily Citations</h3>
          <Line data={citationsChartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default UserDashContent;
