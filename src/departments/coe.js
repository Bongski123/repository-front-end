import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function COE () {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocumentsByDepartment = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:9000/COE/all`);
                setDocuments(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDocumentsByDepartment();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>College of Engineering</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {documents.map(document => (
                    <li key={document.id}>
                        <p>{document.title}</p>
                        {/* Add more details as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};
