import React, { useState, useEffect, useRef } from "react";
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
    const [profilePic, setProfilePic] = useState('/src/assets/person-icon.jpg');
    const logoutTimer = useRef(null);

    useEffect(() => {
        // Load profile picture from the backend if the user is logged in
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchProfilePicture(userId);
        }

        // Setup auto-logout timer
        resetLogoutTimer();
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        const resetActivity = () => resetLogoutTimer();
        events.forEach(event => window.addEventListener(event, resetActivity));

        return () => {
            clearTimeout(logoutTimer.current);
            events.forEach(event => window.removeEventListener(event, resetActivity));
        };
    }, []); // Only run once on mount

    useEffect(() => {
        // Refresh the profile picture when it is updated
        const storedProfilePic = localStorage.getItem('picture');
        if (storedProfilePic) {
            setProfilePic(storedProfilePic);
        }
    }, [localStorage.getItem('picture')]); // Trigger when profile picture changes in localStorage

    const resetLogoutTimer = () => {
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
        }
        logoutTimer.current = setTimeout(() => {
            handleLogout();
        }, 30 * 60 * 1000); // 30 minutes
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
    }, []); // Trigger notifications fetch if logged in

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

    const handleLogout = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
    
            if (userId && token) {
                // Send request to mark user as offline
                await axios.post(`https://ccsrepo.onrender.com/admin/logout/${userId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                // Clear local storage and logout
                localStorage.clear();
    
                // Navigate to login page
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
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

    const fetchProfilePicture = async (userId) => {
        try {
            const response = await axios.get(`https://ccsrepo.onrender.com/profile-picture/${userId}`, {
                responseType: 'blob', // Retrieve the file as a blob
            });

            if (response.status === 200) {
                const imageUrl = URL.createObjectURL(response.data);
                setProfilePic(imageUrl);
                localStorage.setItem('picture', imageUrl); // Store the picture URL in localStorage
            } else {
                console.error('Profile picture not found');
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">
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
                        {isLoggedIn() && (
                            <Dropdown align="end" onToggle={() => setNotificationCount(0)}>
                                <Dropdown.Toggle variant="success" className="me-3 notification-dropdown-toggle">
                                    <FaGlobe size={18} color="white" />
                                    {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="notification-dropdown-menu">
                                    {loadingNotifications ? (
                                        <Dropdown.Item disabled>Loading notifications...</Dropdown.Item>
                                    ) : (
                                        notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <Dropdown.Item key={index} onClick={handleNotificationClick}>
                                                    {notification.shortMessage}
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
                                <Dropdown.Toggle
                                    variant="success"
                                    className="p-0 border-0 bg-transparent d-flex align-items-center"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    <Image
                                        src={profilePic}
                                        alt="Profile"
                                        roundedCircle
                                        width="40"
                                        height="40"
                                    />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    
                                    <Dropdown.Item href="/settings/account">Account Settings</Dropdown.Item>
                                    
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
