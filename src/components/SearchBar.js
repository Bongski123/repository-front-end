import { useState,useEffect  } from "react";
import Container from "react-bootstrap/esm/Container";
import { FaSearch } from "react-icons/fa";
import Fuse from "fuse.js";
function SearchBar({  setResults }) {
  const [input, setInput] = useState("");
  const [documents, setDocuments] = useState([]); 

  useEffect(() => {
    fetch('http://127.0.0.1:9000/documents/all') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((json) => {
        if (Array.isArray(json)) {
          setDocuments(json);
        } else {
          console.error('JSON data is not an array');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array ensures this effect runs only once on component mount


const fuseOptions = {
  keys: ['title', 'abstract','author','category_name','course_name'], // Specify the properties to search within
  includeScore: true, // Include search score for ranking results
  threshold: 0.3, // Set the threshold for fuzzy search 
};

// Initialize Fuse.js with publications data and options
const fuse = new Fuse(documents, fuseOptions);

// Perform fuzzy search and update results
const performSearch = (value) => {
  const results = fuse.search(value).map(result => result.item);
  setResults(results);
};

// Handle input change
const handleChange = (value) => {
  setInput(value);
  performSearch(value); // Perform search on input change
};

// Handle search button click
const handleSearch = () => {
  performSearch(input); // Perform search when search button is clicked
};


  return (
    <Container fluid className="search-container">
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Title, Author, Keyword, etc.."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />

    </div>
    </Container>
  );
}

export {SearchBar};
