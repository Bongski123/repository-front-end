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
import { FaGlobe } from 'react-icons/fa';
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
            return !!decodedToken;
        }
        return false;
    };

    const fetchNotifications = async () => {
        setLoadingNotifications(true);
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!userId || !token) {
                console.error('User ID or token is missing');
                return;
            }

            const response = await axios.get(`https://ccsrepo.onrender.com/notifications/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const notificationsData = response.data;
            const unreadCount = notificationsData.filter(notification => !notification.read).length;

            // Shorten the notification message here
            const shortenedNotifications = notificationsData.map(notification => ({
                ...notification,
                shortMessage: notification.message.length > 30 ? `${notification.message.substring(0, 30)}...` : notification.message,
            }));

            setNotifications(shortenedNotifications);
            setNotificationCount(unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoadingNotifications(false);
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
            return decodedToken.roleId === '1' || decodedToken.roleId === 1;
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

        navigate(`/notification/${userId}`);

        if (notificationCount > 0) {
            try {
                await axios.post(`https://ccsrepo.onrender.com/notifications/opened`, { userId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setNotificationCount(0);
            } catch (error) {
                console.error('Error marking notifications as read:', error);
            }
        }
    };

    const handleDropdownToggle = () => {
        if (notificationCount > 0) {
            setNotificationCount(0);
        }
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" >
            <Container>
                <Navbar.Brand href="#home" onClick={redirectToNCF}>
                    <Image
                        src={require('../assets/ncf-logo-green.png')}
                        alt="NCF Logo"
                        className="ncf-logo-navbar"
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
                            <Dropdown align="end" onToggle={handleDropdownToggle}>
                                <Dropdown.Toggle variant="success" className="me-3 notification-dropdown-toggle">
                                    <FaGlobe size={18} color="black" />
                                    {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="notification-dropdown-menu">
                                    {loadingNotifications ? (
                                        <Dropdown.Item disabled>Loading notifications...</Dropdown.Item>
                                    ) : (
                                        notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <Dropdown.Item key={index} className="notification-item" onClick={handleNotificationClick}>
                                                    {notification.shortMessage} {/* Display shortened message */}
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
                                <Dropdown.Toggle variant="success" className="button">
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
