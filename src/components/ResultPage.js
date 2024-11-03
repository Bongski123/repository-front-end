import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { FaDownload, FaEye } from 'react-icons/fa';
import '../components/CSS/ResultsPage.css';
function ResultsPage() {
  const [results, setResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Get the search results from the state or fetch again if needed
    const searchResults = location.state?.results || [];
    setResults(searchResults);
  }, [location]);

  return (
    <Container fluid className="results-container">
      <Row>
        <Col>
          <h1>Search Results</h1>
          {results.length > 0 ? (
            results.map((result) => (
              <Card key={result.research_id} className="mb-3">
                <Card.Body>
                  <Card.Title>{result.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Authors: {result.authors}
                  </Card.Subtitle>
                  <Card.Text>
                    {result.abstract}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <a href={`/downloads/${result.filename}`} className="btn btn-primary">
                      <FaDownload /> Download
                    </a>
                    <span>
                      <FaEye /> Views: {result.viewCount} | Downloads: {result.downloadCount}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No results found</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export { ResultsPage };
