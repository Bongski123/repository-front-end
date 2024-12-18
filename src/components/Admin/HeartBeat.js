import React, { useEffect } from 'react';
import axios from 'axios';

const Heartbeat = ({ userId }) => {
  useEffect(() => {
    // Set an interval to send the heartbeat every 30 seconds (or adjust as needed)
    const heartbeatInterval = setInterval(() => {
      sendHeartbeat(userId);
    }, 30000); // 30 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(heartbeatInterval);
  }, [userId]);

  const sendHeartbeat = async (userId) => {
    try {
      const response = await axios.post(`https://ccsrepo.onrender.com/admin/heartbeat/${userId}`);
      console.log('Heartbeat updated:', response.data);
    } catch (error) {
      console.error('Error updating heartbeat:', error.response ? error.response.data : error.message);
    }
  };

  return null; // This component doesn't render anything visible
};

export default Heartbeat;
