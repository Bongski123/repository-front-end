import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Pagination from 'react-bootstrap/Pagination';

export default function CategoryDetail() {
    const { categoryId } = useParams();
    const [researchItems, setResearchItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [categoryName, setCategoryName] = useState("");

    // Function to fetch research items
    const fetchResearchItems = async () => {
        try {
            const response = await fetch(`http://localhost:10121/category/${categoryId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched Data:", data);
            setResearchItems(data.categoryDocuments || []); // Assuming your API returns this structure
            setCategoryName(data.categoryName || ""); // Assuming the API returns categoryName
        } catch (error) {
            console.error("Error fetching research items:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResearchItems();
    }, [categoryId]);

    // Loading and error handling
    if (loading) return <p>Loading research items...</p>;
    if (error) return <p>Error: {error}</p>;

    // Filtered items based on search input
    const filteredItems = researchItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate the current items to display
    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <Container>
            <h2>Research Items in Category: {categoryName}</h2> {/* Display the category name */}
            {/* Search bar */}
            <Form className="mb-3">
                <Form.Group controlId="search">
                    <Form.Control
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Form.Group>
            </Form>
            <Row>
                {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                        <Col key={item.research_id} xs={12} className="mb-3">
                            {/* Make each item clickable and pass data to /details route */}
                            <Link to={`/details`} state={{ result: item }} style={{ textDecoration: 'none' }}>
                                <div className="p-3 border rounded shadow-sm hover-shadow" style={{ backgroundColor: '#f9f9f9' }}>
                                    <h5 className="mb-1">{item.title}</h5>
                                    <p className="mb-0 text-muted">Authors: {item.authors}</p> {/* Display authors */}
                                </div>
                            </Link>
                        </Col>
                    ))
                ) : (
                    <p>No research items found for this category.</p>
                )}
            </Row>

            {/* Pagination Controls */}
            <Pagination className="justify-content-center" style={{ marginTop: '20px' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    );
}
