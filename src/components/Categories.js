import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup'; // Import ListGroup for the list format
import Pagination from 'react-bootstrap/Pagination'; // Import Pagination component
import './CSS/Categories.css';
export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://ccsrepo.onrender.com/categories/all'); // Update with your API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response:", data);

            if (data.category && Array.isArray(data.category)) {
                const transformedCategories = data.category.map(cat => ({
                    title: cat.category_name,
                    link: `/category/${cat.category_id}`
                }));
                // Sort categories alphabetically
                transformedCategories.sort((a, b) => a.title.localeCompare(b.title));
                setCategories(transformedCategories);
            } else {
                throw new Error("Expected an array but got something else");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const currentItems = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return (
        <div className="spinner-container">
            <div className="spinner"></div>
        </div>
    );
    
    if (error) return <p>Error: {error}</p>;

    return (
        <section id="categories" className="block categories-block">
            <Container fluid className="categories-container">
                <div className="title-bar">
                    <h1 className="title">Categories</h1>
                </div>
            </Container>

            <Container>
                <h2 className="category-card-title">Browse by Category</h2>
             
                <Form.Control
                
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />

                {/* ListGroup for displaying categories as a list */}
                <ListGroup>
                    {currentItems.map((category, idx) => (
                        <ListGroup.Item key={idx}>
                            <Link to={category.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {category.title}
                            </Link>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

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
        </section>
    );
}
