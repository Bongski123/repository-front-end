import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Route, useLocation } from 'react-router-dom'; // Import BrowserRouter and NavLink
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import

import { Helmet } from "react-helmet";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function Admin() {
    const { collapseSidebar } = useProSidebar();
    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState(null);
    const [emails, setEmails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const themeStyles = {
        light: { backgroundColor: 'white', color: 'black' },
        dark: { backgroundColor: '#2A2A2A', color: 'white' }
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const decodedToken = jwtDecode(token);
                setUser(decodedToken);

                if (decodedToken.role !== 'Reviewer' && decodedToken.role_id !== 2 &&
                    (decodedToken.role !== 'Guest' && decodedToken.role_id !== 3)) {
                    navigate('/admin/dashboard'); 
                }

            } catch (error) {
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate, location.pathname]);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div id="app" style={{ height: "100vh", display: "flex", ...themeStyles[theme] }}>
            <Helmet>
                <title>NCF Research Nexus</title>
                <meta name="description" content="Web site created using create-react-app" />
            </Helmet>
            <Sidebar style={{ height: "100vh", ...themeStyles[theme] }}>
                <Menu iconShape="square">
                    <MenuItem icon={<MenuOutlinedIcon />} onClick={() => { collapseSidebar(); }} style={{ textAlign: "center" }}>
                        <p>Admin Dashboard</p>
                    </MenuItem>
                    <MenuItem icon={theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />} onClick={toggleTheme}>
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </MenuItem>
                    <MenuItem icon={<HomeOutlinedIcon />}>
                        <NavLink to="/home">Home</NavLink>
                    </MenuItem>
                    <MenuItem icon={<PeopleOutlinedIcon />}>Team</MenuItem>
                    <MenuItem icon={<ContactsOutlinedIcon />}>Contacts</MenuItem>
                    <MenuItem icon={<NotificationsIcon />} onClick={() => setIsModalOpen(true)}> Notifications </MenuItem>
                    <MenuItem icon={<HelpOutlineOutlinedIcon />}>FAQ</MenuItem>
                    <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem>
                    <MenuItem icon={<ExitToAppIcon />} onClick={handleLogout}> Logout </MenuItem>
                </Menu>
            </Sidebar>
            <main style={{ marginLeft: "5rem", color: themeStyles[theme].color }}>
                <h1 style={{ fontSize: '50px', textDecoration: 'none' }}>MY PAPERS</h1>
             
                <Dialog open={isModalOpen} onClose={closeModal}>
                    <DialogTitle>Email Notifications</DialogTitle>
                    <DialogContent>
                        {emails.length > 0 ? (
                            <p>{emails.join(', ')}</p> 
                        ) : (
                            <p>Email is empty</p>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal}>Close</Button>
                    </DialogActions>
                </Dialog>
             
            </main>
        </div>
    );
}

function App() {
    return (
        <Router> {/* Wrap the Admin component within Router */}
            <Admin />
        </Router>
    );
}

export default App;
