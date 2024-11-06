import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import {jwtDecode} from 'jwt-decode'; 
import CitationGeneratorDropdown from '../citationGenerator';
import UserSidebar from '../UserSidebar';
import '../CSS/collection.css';

function Collections() {
    const [researches, setResearches] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCitationModal, setShowCitationModal] = useState(false);
    const [selectedResearch, setSelectedResearch] = useState(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Sidebar state

    const getUserIdFromToken = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');
            
            const decoded = jwtDecode(token);
            return decoded.userId;
        } catch (err) {
            console.error('Error decoding token:', err);
            return null;
        }
    };

    const userId = getUserIdFromToken();

    useEffect(() => {
        if (userId) {
            const fetchCollections = async () => {
                try {
                    const response = await axios.get(`https://ccsrepo.onrender.com/collections/${userId}`);
                    const collectionsData = Array.isArray(response.data) && Array.isArray(response.data[0]) 
                        ? response.data[0] 
                        : response.data;

                    setResearches(collectionsData); 
                } catch (err) {
                    console.error('Error fetching collections:', err);
                    setError('Could not fetch collections. Please try again.');
                } finally {
                    setLoading(false);
                }
            };
            fetchCollections();
        } else {
            setError('User is not logged in or token is invalid.');
            setLoading(false);
        }
    }, [userId]);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const handleRemove = async (researchId) => {
        try {
            await axios.delete(`http://localhost:10121/collection/remove/${userId}/${researchId}`);
            setResearches(researches.filter(research => research.research_id !== researchId));
        } catch (err) {
            console.error('Error removing collection item:', err);
            setError('Could not remove collection item. Please try again.');
        }
    };

    const handleShowCitationModal = (research) => {
        setSelectedResearch(research);
        setShowCitationModal(true);
    };

    const handleCloseCitationModal = () => {
        setShowCitationModal(false);
        setSelectedResearch(null);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="collections-container">
            <UserSidebar isOpen={isSidebarVisible} toggleSidebar={toggleSidebar} />
            <div className={`content ${isSidebarVisible ? 'with-sidebar' : 'full-width'}`}>
                <header className="d-flex justify-content-between align-items-center">
                  
                    <h1>Your Research Collections</h1>
                </header>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {researches.length === 0 && !error ? (
                    <p>No collections found.</p>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {researches.map((research) => (
                                <tr key={research.research_id}>
                                    <td>
                                        <Link to={`/details`} state={{ result: research }} style={{ textDecoration: 'none', color: 'black' }}>
                                            {research.title ? research.title : 'No Title Available'}
                                        </Link>
                                    </td>
                                    <td>
                                        <Button 
                                            variant="danger" 
                                            onClick={() => handleRemove(research.research_id)} 
                                            style={{ marginRight: '10px' }}
                                        >
                                            &times;
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            onClick={() => handleShowCitationModal(research)}
                                        >
                                            Cite
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                {/* Citation Modal */}
                <Modal show={showCitationModal} onHide={handleCloseCitationModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Citation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedResearch && <CitationGeneratorDropdown result={selectedResearch} />}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseCitationModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Collections;
