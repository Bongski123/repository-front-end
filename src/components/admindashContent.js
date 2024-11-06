import React, { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";
import { IoMdCloudDownload } from "react-icons/io";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const DashboardContent = () => {
  const [downloads, setDownloads] = useState(0);
  const [citations, setCitations] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [dailyDownloads, setDailyDownloads] = useState([]);
  const [dailyCitations, setDailyCitations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const downloadsResponse = await fetch('http://localhost:10121/total/downloads');
        const downloadsData = await downloadsResponse.json();
        setDownloads(downloadsData.total_downloads);

        const citationsResponse = await fetch('http://localhost:10121/total/citations');
        const citationsData = await citationsResponse.json();
        setCitations(citationsData.total_citations);

        const usersResponse = await fetch('http://localhost:10121/all/users');
        const usersData = await usersResponse.json();
        setTotalUsers(usersData.total_users);

        const dailyDownloadsResponse = await fetch('http://localhost:10121/daily/downloads');
        const dailyDownloadsData = await dailyDownloadsResponse.json();

        const dailyCitationsResponse = await fetch('http://localhost:10121/daily/citations'); // Fetch daily citations
        const dailyCitationsData = await dailyCitationsResponse.json();

        // Aggregate downloads by day of the week
        const downloadsByDay = Array(7).fill(0);
        dailyDownloadsData.forEach(({ date, downloads }) => {
          const dayOfWeek = new Date(date).getDay();
          const adjustedDay = (dayOfWeek + 6) % 7;
          downloadsByDay[adjustedDay] += downloads;
        });

        // Aggregate citations by day of the week
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

  // Prepare chart data for downloads
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

  // Prepare chart data for citations
  const citationsChartData = {
    labels: dailyCitations.labels || [],
    datasets: [
      {
        label: 'Daily Citations',
        data: dailyCitations.data || [],
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.4)', // Different color for citations
        borderColor: 'rgba(255,99,132,1)',
        tension: 0.1,
      },
    ],
  };

  // Chart options
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
        <div className="info-card yellow">
          <FaUser className="user-icon" />
          <div className="info-text">
            <p>Total Users</p>
            <h3>{totalUsers}</h3>
          </div>
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
