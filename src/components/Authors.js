import React, { useEffect, useState } from 'react';
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import axios from 'axios';
import './CSS/Author.css';
import { Form } from 'react-bootstrap';

export default function Authors() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.get('https://ccsrepo.onrender.com/authors')
            .then(response => {
                setAuthors(response.data.authors || response.data); // Adjust based on response structure
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="spinner-container">
            <div className="spinner"></div>
        </div>
    );
    

    if (error) return <p>Error loading authors: {error.message}</p>;
    if (!authors.length) return <p>No authors found.</p>;

    const filteredAuthors = authors.filter(author => 
        (author.authors_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedAuthors = filteredAuthors.reduce((groups, author) => {
        const name = author.authors_name || '';
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
                <div className="author-title-bar">
                    <h1 className="title">Authors</h1>
                </div>
            </Container>

            <Container>
            <h2 className="category-card-title">Browse by Author</h2>
                <div className="search-bar" style={{ marginBottom: '20px' }}>
  <Form.Control
    type="text"
    placeholder="Search authors..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="search-input"
  />
</div>

                <div className="alphabet-bar" style={{ marginBottom: '20px', textAlign: 'center' }}>
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                        <a href={`#letter-${letter}`} key={letter} style={{ margin: '0 10px', color: '#008000' }}>
                            {letter}
                        </a>
                    ))}
                </div>

                {Object.keys(groupedAuthors).sort().map(letter => (
                    <div key={letter} id={`letter-${letter}`} style={{ marginBottom: '20px' }}>
                        <h3>{letter}</h3>
                        <ul className="author-list">
                            {groupedAuthors[letter].sort((a, b) => (a.authors_name || '').localeCompare(b.authors_name || '')).map(author => (
                                <li key={author.author_id} className="author-list-item">
                                    <Link to={`/authors/${author.author_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="author-item" style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            <h3 style={{ fontSize: '1.2em' }}>{author.authors_name || 'N/A'}</h3>
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
