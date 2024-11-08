import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to get the notification_id from URL

const NotificationDetailsPage = () => {
    const { notificationId } = useParams();  // Get notificationId from URL
    const [researches, setResearches] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchNotificationDetails = async () => {
        try {
            const response = await axios.get(`https://ccsrepo.onrender.com/notifications/${notificationId}/researches`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use token for authentication if needed
                },
            });

            setResearches(response.data); // Set researches related to the notification
        } catch (err) {
            console.error('Error fetching notification details:', err);
            setError(err.response?.data?.message || 'Failed to load notification details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotificationDetails();
    }, [notificationId]);

    if (loading) {
        return <div className="loading-spinner">Loading details...</div>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="notification-details-container">
            <h1>Notification Details</h1>
            <h3>Researches Linked to this Notification</h3>
            {researches.length === 0 ? (
                <p>No researches linked to this notification.</p>
            ) : (
                <ul>
                    {researches.map((research) => (
                        <li key={research.id}>
                            <a href={research.url} target="_blank" rel="noopener noreferrer">{research.title}</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationDetailsPage;
