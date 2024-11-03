import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function AuthorPapers() {
  const { authorId } = useParams();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:9000/authors/${authorId}/papers`)
      .then(response => {
        setPapers(response.data.papers || []); // Adjust based on response structure
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [authorId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading papers: {error.message}</p>;
  if (!papers.length) return <p>No papers found for this author.</p>;

  return (
    <Container>
      <h1>Research Papers</h1>
      <Row xs={1} md={2} lg={3} className="g-2">
        {papers.map(paper => (
          <Col key={paper.research_id}>
            <div className="paper-item" style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <h3 style={{ fontSize: '1.2em' }}>{paper.title}</h3>
              <p>Published on: {paper.publish_date}</p>
              <p>Abstract: {paper.abstract}</p>
              {/* Add more details as needed */}
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
