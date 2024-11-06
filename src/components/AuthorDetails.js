import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from "react-bootstrap/Container";

export default function AuthorDetail() {
    const { authorId } = useParams();
    const [author, setAuthor] = useState(null);
    const [researches, setResearches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`https://ccsrepo.onrender.com/authors/${authorId}/researches`)
            .then(response => {
                setAuthor(response.data.author);
                setResearches(response.data.researches);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [authorId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading author details: {error.message}</p>;

    return (
        <Container>
            <h1>{author.author_name}</h1>
            <h3>Research Papers:</h3>
            <ul>
                {researches.map((research) => (
                    <li key={research.research_id}>
                        <h4>{research.title}</h4>
                        <p>{research.abstract}</p>
                        {/* Corrected PDF link */}
                        <a href={`http://localhost:9000/uploads/documents${research.filename}`} target="_blank" rel="noopener noreferrer">
                            Download PDF
                        </a>
                    </li>
                ))}
            </ul>
        </Container>
    );
}
