import React, { useEffect, useState } from 'react';
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import axios from 'axios';
import './CSS/Author.css';

export default function Authors() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Add search query state

    useEffect(() => {
        axios.get('http://localhost:9000/authors')
            .then(response => {
                setAuthors(response.data.authors || response.data); // Adjust based on response structure
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading authors: {error.message}</p>;
    if (!authors.length) return <p>No authors found.</p>; // Handle case where no authors are found

    // Filter authors based on search query
    const filteredAuthors = authors.filter(author => 
        (author.authors_name || 'Unknown Author').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group authors by first letter after filtering
    const groupedAuthors = filteredAuthors.reduce((groups, author) => {
        const name = author.authors_name || ''; // Default to empty string if undefined
        const firstLetter = name.charAt(0).toUpperCase();
        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push(author);
        return groups;
    }, {});

    return (
        <section id="authors" className="block authors-block">
            <Container fluid className="authors-container">
                <div className="title-bar">
                    <h1 className="title">Authors</h1>
                </div>
            </Container>

            <Container>
                <h2 className="author-list-title">Browse by Author</h2>

                {/* Search Bar */}
                <div className="search-bar" style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search authors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
                        className="search-input"
                    />
                </div>

                {/* Alphabetical links */}
                <div className="alphabet-bar" style={{ marginBottom: '20px', textAlign: 'center' }}>
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                        <a href={`#letter-${letter}`} key={letter} style={{ margin: '0 10px', color: '#007bff' }}>
                            {letter}
                        </a>
                    ))}
                </div>

                {/* Authors grouped by first letter */}
                {Object.keys(groupedAuthors).sort().map(letter => (
                    <div key={letter} id={`letter-${letter}`} style={{ marginBottom: '20px' }}>
                        <h3>{letter}</h3>
                        <ul className="author-list">
                            {groupedAuthors[letter].sort((a, b) => (a.authors_name || '').localeCompare(b.authors_name || '')).map(author => (
                                <li key={author.author_id} className="author-list-item">
                                    <Link to={`/authors/${author.author_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="author-item" style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            <h3 style={{ fontSize: '1.2em' }}>{author.authors_name || 'Unknown Author'}</h3>
                                            <p>Research Papers: {author.documentCount || 0}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </Container>
        </section>
    );
}
