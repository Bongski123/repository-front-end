import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { SearchBar } from "./SearchBar";
import { FaGlobe } from 'react-icons/fa'; // Import the globe icon
import axios from 'axios';
import './CSS/Navbar.css';

function NavigationBar({ activeTab }) {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const redirectToNCF = () => {
        window.open('https://www.ncf.edu.ph/');
    };

    const isLoggedIn = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            return !!decodedToken; // Return true if token is decoded successfully
        }
        return false;
    };

    const fetchNotifications = async () => {
        setLoadingNotifications(true); // Set loading state
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!userId || !token) {
                console.error('User ID or token is missing');
                return;
            }

            const response = await axios.get(`http://localhost:9000/notifications/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const notificationsData = response.data; // Adjust based on your API response
            const unreadCount = notificationsData.filter(notification => !notification.read).length;
            setNotifications(notificationsData);
            setNotificationCount(unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoadingNotifications(false); // Reset loading state
        }
    };

    useEffect(() => {
        if (isLoggedIn()) {
            fetchNotifications();
        }
    }, []);

    const isAdmin = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.roleId === '1' || decodedToken.roleId === 1; // Ensure both string and number comparison
        }
        return false;
    };

    const handleMyAccountClick = () => {
        if (isAdmin()) {
            navigate('/admin/dashboard');
        } else {
            navigate('/user/dashboard');
        }
    };

    const handleLogout = () => {
        try {
            localStorage.clear();
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

    const handleNotificationClick = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        // Navigate to the notifications page
        navigate(`/notification/${userId}`);

        // Mark notifications as opened
        if (notificationCount > 0) {
            try {
                await axios.post(`https://ccsrepo.onrender.com/notifications/opened`, { userId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setNotificationCount(0); // Reset notification count after marking as read
            } catch (error) {
                console.error('Error marking notifications as read:', error);
            }
        }
    };

    const handleDropdownToggle = () => {
        // Reset notification count when dropdown is opened
        if (notificationCount > 0) {
            setNotificationCount(0);
        }
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
                        {isLoggedIn() && !isAdmin() && (
                            <Dropdown align="end" className="notification-dropdown" onToggle={handleDropdownToggle}>
                                <Dropdown.Toggle variant="success" className="me-3 button-navbar">
                                    <FaGlobe size={24} color="black" />
                                    {/* Hide notification count when clicked */}
                                    {notificationCount > 0 && <span className="badge" style={{ display: 'none' }}>{notificationCount}</span>}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="notification-dropdown" style={{ minWidth: '200px' }}>
                                    {loadingNotifications ? (
                                        <Dropdown.Item disabled>Loading notifications...</Dropdown.Item>
                                    ) : (
                                        notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <Dropdown.Item key={index} onClick={handleNotificationClick} style={{ textAlign: 'left', fontSize: '14px' }}>
                                                    {notification.message} {/* Adjust based on your notification structure */}
                                                </Dropdown.Item>
                                            ))
                                        ) : (
                                            <Dropdown.Item disabled>No new notifications</Dropdown.Item>
                                        )
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                        {isLoggedIn() ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="success" className="me-3 button-navbar">
                                    {getUserFirstName()}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="/forgot-password">Reset Password</Dropdown.Item>
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
