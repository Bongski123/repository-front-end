import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Notification.css'; // Import CSS file for styling

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const userId = localStorage.getItem('userId'); // Get userId from local storage
            if (!userId) {
                throw new Error('User ID not found in local storage.');
            }

            // Fetch notifications for the specific userId
            const response = await axios.get(`https://ccsrepo.onrender.com/notifications/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use token for authentication if needed
                },
            });

            setNotifications(response.data); // Set notifications from API response
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError(err.response?.data?.message || 'Failed to load notifications.'); // More detailed error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) {
        return <div className="loading-spinner">Loading notifications...</div>; // Use a spinner
    }

    if (error) {
        return <p className="error-message">{error}</p>; // Apply error styling
    }

    return (
        <div className="notifications-container">
            <h1>Notifications</h1>
            {notifications.length === 0 ? (
                <p className="empty-state">No notifications available.</p> // Add an empty state message
            ) : (
                <ul className="notifications-list">
                    {notifications.map((notification) => (
                        <li key={`${notification.id}-${notification.createdAt}`} className="notification-item"> {/* Ensure uniqueness */}
                            <p>{notification.message}</p>
                            <span className="notification-date">
                                {new Date(notification.created_at).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationsPage;
