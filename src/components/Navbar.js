import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { SearchBar } from "./SearchBar";
import { FaGlobe } from 'react-icons/fa'; // Import the globe icon
import axios from 'axios';
import './CSS/Navbar.css';

function NavigationBar({ activeTab }) {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(0);

    const redirectToNCF = () => {
        window.open('https://www.ncf.edu.ph/');
    };

    // Check if user is logged in
    const isLoggedIn = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            return !!decodedToken; // Return true if token is decoded successfully
        }
        return false;
    };

    // Fetch notifications for the authenticated user
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const userId = localStorage.getItem('userId'); // Get user ID from local storage
            
            const response = await axios.get(`http://localhost:9000/notifications/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token if necessary
                },
            });

            const notifications = response.data; // Adjust based on your API response
            // Count unread notifications
            const unreadCount = notifications.filter(notification => !notification.read).length;
            setNotificationCount(unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Fetch notifications when the component mounts
    useEffect(() => {
        if (isLoggedIn()) {
            fetchNotifications();
        }
    }, []);

    // Check if user is admin
    const isAdmin = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.roleId === '1' || decodedToken.roleId === 1; // Ensure both string and number comparison
        }
        return false;
    };

    // Handle redirect for "My Account"
    const handleMyAccountClick = () => {
        if (isAdmin()) {
            navigate('/admin/dashboard'); // Redirect to admin dashboard
        } else {
            navigate('/user/dashboard'); // Redirect to user dashboard
        }
    };

    const handleLogout = () => {
        try {
            localStorage.clear(); // Clear all items from localStorage
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const getUserFirstName = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.name;
        }
        return '';
    };

    // Handle notification click
    const handleNotificationClick = async () => {
        // If there are unread notifications, reset count
        if (notificationCount > 0) {
            // Here you might want to mark notifications as read
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            
            // Optional: API call to mark notifications as read
            await axios.post(`http://localhost:9000/notifications/opened`, { userId }, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token if necessary
                },
            });
            
            // Reset notification count
            setNotificationCount(0);
        }

        // Fetch notifications to ensure latest data
        await fetchNotifications();
        navigate(`/notification/${localStorage.getItem('userId')}`); // Navigate to the notifications page
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
            <Container>
                <Navbar.Brand href="#home">
                    <Image
                        src={require('../assets/ncf-logo-green.png')}
                        alt="NCF Logo"
                        className="ncf-logo-navbar"
                        onClick={redirectToNCF}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-3" variant="underline">
                        <Nav.Link as={Link} to="/">Search</Nav.Link>
                        <Nav.Link as={Link} to="/authors">Authors</Nav.Link>
                        <Nav.Link as={Link} to="/categories">Categories</Nav.Link>

                        {isLoggedIn() && (
                            <Nav.Link onClick={handleMyAccountClick}>Dashboard</Nav.Link>
                        )}
                    </Nav>
                    <Nav className="ms-auto d-flex align-items-center">
                        {/* Notification Icon with Badge only if user is not admin */}
                        {isLoggedIn() && !isAdmin() && (
                            <Link 
                                to="#" // Prevent default navigation
                                className="notification-link" 
                                style={{ position: 'relative', marginRight: '17px' }} 
                                onClick={handleNotificationClick} // Clear notifications on click
                            >
                                <FaGlobe size={24} color="black" />
                                {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
                            </Link>
                        )}
                        {isLoggedIn() ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="success" className="me-3 button-navbar">
                                    {getUserFirstName()}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Settings</Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Button variant="success" className="me-3 button-navbar" as={Link} to="/login">
                                Sign In
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            {activeTab === 'search' && <SearchBar />}
        </Navbar>
    );
}

export default NavigationBar;
