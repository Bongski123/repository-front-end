import Container from "react-bootstrap/Container";
import  {SearchBar}  from "./SearchBar";
import { SearchResultList } from "./SearchResultList";
import React, { useState } from "react";

function PageTitle() {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <section id="home" className="hero-block">
      <Container fluid className="title-container">
        <div className="title-bar">
          <h1 className="title">Research Nexus</h1>
          <center>
            <p>
            A Research Repository for The College of Computer Studies
            </p>
          </center>
        </div>
      </Container>
      <div className="search-bar-container">
              <SearchBar setResults={setSearchResults} />
              {searchResults && searchResults.length > 0 && <SearchResultList results={searchResults} />}
            </div>
    </section>
  );
}

export default PageTitle;