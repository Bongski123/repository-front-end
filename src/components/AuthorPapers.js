import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from "react-bootstrap/Pagination";
import axios from "axios";
import './CSS/AuthorsPapers.css'; // Import custom styles
import personIcon from '.././assets/icon-person.jpg'; // Default person icon

export default function AuthorPapers() {
  const { authorId } = useParams();
  const [papers, setPapers] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [authorAffiliation, setAuthorAffiliation] = useState(""); // State for author's affiliation
  const [authorPhoto, setAuthorPhoto] = useState(""); // State for author's photo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const papersResponse = await axios.get(`http://localhost:10121/authors/${authorId}/papers`);
        const authorResponse = await axios.get(`http://localhost:10121/authors/${authorId}`);

        // Set the author's photo or default icon if not available
        setAuthorPhoto(authorResponse.data.author.photo || personIcon);
        setPapers(papersResponse.data.papers || []);
        setAuthorName(authorResponse.data.author.author_name || "Unknown Author");
        setAuthorAffiliation(authorResponse.data.author.affiliation || "Unknown Affiliation"); // Assuming there's an affiliation
      } catch (err) {
        console.error("Fetch error:", err.response ? err.response.data : err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorId]);

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const currentItems = filteredPapers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Loading papers...</p>;
  if (error) return <p>Error loading papers: {error.message}</p>;
  if (!filteredPapers.length) return <p>No papers found for this author.</p>;

  return (
    <Container>
      <div className="author-info">
        <div className="author-photo">
          <img src={authorPhoto} alt={`${authorName}'s photo`} />
        </div>
        <div className="author-details">
          <h1>{authorName}</h1>
          <p>{authorAffiliation}</p>
        </div>
      </div>
      <ListGroup>
        {currentItems.map((paper, idx) => (
          <ListGroup.Item key={idx} className="paper-item">
            <Link 
              to={`/details`} 
              state={{ result: paper, author_name: authorName }} 
              className="paper-link"
            >
              {paper.title}
            </Link>
            <div className="download-count">
              Downloads: {paper.downloadCount > 0 ? paper.downloadCount : "No downloads"}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
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
