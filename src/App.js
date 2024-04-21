import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link,Navigate  } from 'react-router-dom';
import Navbar from "./components/Navbar";
import PageTitle from "./components/PageTitle";
import Categories from "./components/Categories";
import Upload from "./components/Upload";
import Footer from "./components/Footer";
import { SearchBar } from "./components/SearchBar";
import { SearchResultList } from "./components/SearchResultList";
import ComputerStudies from "./departments/ccs";
import CHS from "./departments/chs";
import CAS from "./departments/cas";
import CTED from "./departments/cted";
import COE from "./departments/coe";
import Admin from "./components/AdminDash";
import UserFiles from "./components/UserFiles";
function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('search');

  const resetRoutes = () => {
    window.location.href = '/';
  };

  const changeTab = (tabName) => {
    // Toggle active tab if it's already 'categories'
    if (tabName === 'categories' && activeTab === 'categories') {
      // Reset routes
      resetRoutes();
    } else {
      setActiveTab(tabName);
    }
  };

  return (
    <div className="App" id="body">
      <header id="header">
        <Navbar changeTab={changeTab} />
      </header>
      <main>
        {activeTab === 'search' && (
          <>
            <PageTitle />
            <div className="search-bar-container">
              <SearchBar setResults={setSearchResults} />
              {searchResults && searchResults.length > 0 && <SearchResultList results={searchResults} />}
            </div>
          </>
        )}
        {activeTab === 'categories' && (
          <Router>
            <Routes>
              <Route path="/" element={<Categories />} />
              <Route path="/CCS" element={<ComputerStudies />} />
              <Route path="/CHS" element={<CHS />} />
              <Route path="/CAS" element={<CAS />} />
              <Route path="/CTED" element={<CTED />} />
              <Route path="/COE" element={<COE />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/Files" element={<UserFiles />} />
             
            
              
              {/* Add more routes as needed */}
            </Routes>
          </Router>
        )}
        {activeTab === 'upload' && <Upload />}
        {activeTab === 'admin' && <Admin />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
