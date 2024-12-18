import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/admin/online-users');
        setOnlineUsers(response.data.onlineUsers);
      } catch (error) {
        console.error('Error fetching online users:', error.response ? error.response.data : error.message);
      }
    };

    fetchOnlineUsers();
  }, []);

  return (
    <div>
      <h2>Online Users</h2>
      <ul>
        {onlineUsers.length > 0 ? (
          onlineUsers.map((user) => (
            <li key={user.user_id}>
              {user.first_name} {user.last_name} ({user.email}) - Last Active: {new Date(user.last_active).toLocaleString()}
            </li>
          ))
        ) : (
          <li>No users are currently online</li>
        )}
      </ul>
    </div>
  );
};

export default OnlineUsers;
