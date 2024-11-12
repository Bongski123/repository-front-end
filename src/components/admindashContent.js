import React, { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";
import { IoMdCloudDownload } from "react-icons/io";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './CSS/UserDashContent.css';

// Register necessary components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const DashboardContent = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [downloads, setDownloads] = useState(0);
  const [citations, setCitations] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalResearches, setTotalResearches] = useState(0);
  const [dailyDownloads, setDailyDownloads] = useState([]);
  const [dailyCitations, setDailyCitations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const downloadsResponse = await fetch('https://ccsrepo.onrender.com/total/downloads');
        const downloadsData = await downloadsResponse.json();
        setDownloads(downloadsData.total_downloads);

        const citationsResponse = await fetch('https://ccsrepo.onrender.com/total/citations');
        const citationsData = await citationsResponse.json();
        setCitations(citationsData.total_citations);

        const usersResponse = await fetch('https://ccsrepo.onrender.com/all/users');
        const usersData = await usersResponse.json();
        setTotalUsers(usersData.total_users);

        const researchesResponse = await fetch('https://ccsrepo.onrender.com/total/researches');
        const researchesData = await researchesResponse.json();
        setTotalResearches(researchesData.total_researches);

        const dailyDownloadsResponse = await fetch('https://ccsrepo.onrender.com/daily/downloads');
        const dailyDownloadsData = await dailyDownloadsResponse.json();

        const dailyCitationsResponse = await fetch('https://ccsrepo.onrender.com/daily/citations');
        const dailyCitationsData = await dailyCitationsResponse.json();

        const downloadsByDay = Array(7).fill(0);
        dailyDownloadsData.forEach(({ date, downloads }) => {
          const dayOfWeek = new Date(date).getDay();
          const adjustedDay = (dayOfWeek + 6) % 7;
          downloadsByDay[adjustedDay] += downloads;
        });

        const citationsByDay = Array(7).fill(0);
        dailyCitationsData.forEach(({ date, citations }) => {
          const dayOfWeek = new Date(date).getDay();
          const adjustedDay = (dayOfWeek + 6) % 7;
          citationsByDay[adjustedDay] += citations;
        });

        const daysLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        setDailyDownloads({
          labels: daysLabels,
          data: downloadsByDay,
        });
        setDailyCitations({
          labels: daysLabels,
          data: citationsByDay,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const downloadsChartData = {
    labels: dailyDownloads.labels || [],
    datasets: [
      {
        label: 'Peak Downloads Daily',
        data: dailyDownloads.data || [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const citationsChartData = {
    labels: dailyCitations.labels || [],
    datasets: [
      {
        label: 'Daily Citations',
        data: dailyCitations.data || [],
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
          text: 'Number',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard-content">
      <div className="info-cards">
        <div className="info-card blue">
          <IoMdCloudDownload className="download-icon" />
          <p>Total Downloads</p>
          <h3>{downloads}</h3>
        </div>
        <div className="info-card green">
          <FaQuoteRight className="cite-icon" />
          <p>Total Citations</p>
          <h3>{citations}</h3>
        </div>
        <div className="info-card yellow" onClick={() => navigate('/admin/users')}>
          <FaUser className="user-icon" />
          <div className="info-text">
            <p>Total Users</p>
            <h3>{totalUsers}</h3>
          </div>
        </div>
        <div className="info-card purple" onClick={() => navigate('/researchList')}>
          <FaUser className="research-icon" />
          <p>Total Researches</p>
          <h3>{totalResearches}</h3>
        </div>
      </div>

      <div className="charts1">
        <div className="peak-downloads-chart">
          <h3>Peak Downloads Daily</h3>
          <Line data={downloadsChartData} options={options} />
        </div>
        <div className="daily-citations-chart">
          <h3>Daily Citations</h3>
          <Line data={citationsChartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
