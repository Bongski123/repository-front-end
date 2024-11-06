import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { Button, Modal, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CSS/details.css";
import CitationGeneratorDropdown from './citationGenerator';
import Swal from 'sweetalert2';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Details() {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result;

    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCitationModal, setShowCitationModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [downloadCount, setDownloadCount] = useState(0);
    const [citationCount, setCitationCount] = useState(0);

    // Using useRef to track if view count has been incremented
    const hasIncremented = useRef(false);

    useEffect(() => {
        const fetchPDF = async () => {
            setLoading(true);
            try {
                if (!result?.research_id) {
                    throw new Error("Result or research ID is missing");
                }
                const response = await axios.get(`https://ccsrepo.onrender.com/pdf/${result.research_id}`, {
                    responseType: "blob",
                });
                const pdfBlob = response.data;
                const url = URL.createObjectURL(pdfBlob);
                setPdfBlobUrl(url);
                setError(null);
            } catch (error) {
                console.error("Error fetching PDF:", error);
                setError("Error fetching PDF. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        const fetchResearchData = async () => {
            try {
                const response = await axios.get(`https://ccsrepo.onrender.com/research/${result.research_id}`);
                setDownloadCount(response.data.downloadCount);
                setCitationCount(response.data.citeCount);
            } catch (error) {
                console.error('Error fetching research data:', error);
            }
        };

        fetchPDF();
        fetchResearchData();
    }, [result]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // Increment view count on page load if it hasn't been incremented in this session
        const viewedKey = `viewed_${result?.research_id}`;
        if (result?.research_id && !hasIncremented.current && !sessionStorage.getItem(viewedKey)) {
            incrementViewCount(viewedKey);
            hasIncremented.current = true;  // Mark as incremented to prevent re-increments
        }
    }, [result]);

    const incrementViewCount = async (viewedKey) => {
        try {
            await axios.post(`https://ccsrepo.onrender.com/research/view/${result.research_id}`);
            sessionStorage.setItem(viewedKey, "true");  // Store view status in session storage
        } catch (error) {
            console.error("Error incrementing view count:", error);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleShowCitationModal = () => setShowCitationModal(true);
    const handleCloseCitationModal = () => setShowCitationModal(false);

    const updateCount = async (type) => {
        const endpoint = type === 'download' 
            ? `https://ccsrepo.onrender.com/research/download/${result.research_id}`
            : `https://ccsrepo.onrender.com/research/cite/${result.research_id}`;

        try {
            await axios.post(endpoint);
            if (type === 'download') {
                setDownloadCount(prevCount => prevCount + 1);
            } else {
                setCitationCount(prevCount => prevCount + 1);
                handleShowCitationModal();
            }
        } catch (error) {
            console.error(`Error updating ${type} count:`, error);
        }
    };

    const handleDownload = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (pdfBlobUrl) {
            const link = document.createElement('a');
            link.href = pdfBlobUrl;
            link.setAttribute('download', `${result.title}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            await updateCount('download');
        }
    };

    const handleCite = async () => {
        await updateCount('cite');
    };

    const handleAddToCollection = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const token = localStorage.getItem('token');
        const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

        try {
            await axios.post(`https://ccsrepo.onrender.com/collection/add`, {
                user_id: userId,
                research_id: result.research_id,
            });

            Swal.fire({
                title: 'Success!',
                text: 'Added to your collection!',
                icon: 'success',
                confirmButtonText: 'Okay',
            });
        } catch (error) {
            console.error('Error adding to collection:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Could not add to collection. Please try again.',
                icon: 'error',
                confirmButtonText: 'Okay',
            });
        }
    };

    return (
        <Container className="details-container">
            <Row>
                <Col md={6}>
                    <div className="details-section">
                        <h3>{result.title}</h3>
                        <div className="research-info">
                            <p className="label">
                                <strong>Authors:</strong> <span>{result.authors}</span>
                            </p>
                            <p className="label">
                                <strong>Abstract:</strong> <span>{result.abstract}</span>
                            </p>
                            <p className="label">
                                <strong>Category:</strong> <span>{result.category}</span>
                            </p>
                            <p className="label">
                                <strong>Keywords:</strong> <span>{result.keywords}</span>
                            </p>
                        </div>
                        <div className="button-group">
                            <Button variant="info" onClick={handleCite} className="cite-button">
                                Cite
                            </Button>
                            <Button variant="success" onClick={handleAddToCollection} className="add-to-collection-button">
                                Add to Collection
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="pdf-section">
                        <Button variant="primary" onClick={handleDownload} className="download-button mb-2">
                            Download 
                        </Button>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <div className="pdf-container" style={{ height: '500px', overflowY: 'auto' }}>
                                <Document
                                    file={pdfBlobUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    className="pdf-document"
                                >
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <Page
                                            key={`page_${index + 1}`}
                                            pageNumber={index + 1}
                                            renderTextLayer={false}
                                            width={500}
                                        />
                                    ))}
                                </Document>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Modal for citation */}
            <Modal show={showCitationModal} onHide={handleCloseCitationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Citation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Use the following format for citing:</p>
                    <CitationGeneratorDropdown result={result} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCitationModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Details;