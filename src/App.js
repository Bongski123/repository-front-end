import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from "./components/Navbar";
import PageTitle from "./components/PageTitle";
import Authors from "./components/Authors.js";
import Upload from "./components/Upload";
import Footer from "./components/Footer";
import Login from "./components/login";
import SignUp from "./components/Signup";
import Admin from "./components/AdminDash";
import { AuthWrapper } from "./Auth/AuthWrapper";
import UserDashboard from "./components/Pages/UserDash";
import {SearchResult} from "./components/SearchResult";
import Details from "./components/Details";
import UserTablePage from "./components/UserTablePage.jsx";
import ResearchDetail from "./components/researchDetails.js";
import ResearchList from "./components/researchList.js";
import FullDocumentView from "./components/ViewDocument.js";
import AuthorDetails from "./components/AuthorDetails.js";
import ForgotPassword from "./components/forgot-password.js";
import Categories from "./components/Categories.js";
import { ResultsPage } from "./components/ResultPage.js";
import MyPapers from "./components/Pages/UserPapers.js";
import AuthorPapers from "./components/AuthorPapers.js";
import NotificationsPage from "./components/Pages/Notification.js";
import Collections from "./components/Pages/collections.js";
import { SearchBar } from "./components/SearchBar.jsx";
import SearchResultsPage from "./components/SearchResultPage.js";
import CategoryDetail from "./components/CategoryDetail.js";
import CategoryTable from "./components/CategoryTable.js";
import KeywordTable from "./components/KeywordsTable.js";
import NotificationDetailsPage from "./components/Pages/NotificationDetailPage.js";
import EditUserPage from "./components/EditUserPage.js";
import RequestPDFForm from "./components/Pages/RequestPdfForm.js";
import UserPdfRequests from "./components/Pages/usersrequestpdf.js";
import VerifyEmail from "./components/VerifyEmail.js";
function App() {
  const [activeTab, setActiveTab] = useState('');

  

  const changeTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="App" id="body">
      <Router>
        <header id="header">
          <NavigationBar changeTab={changeTab} activeTab={activeTab} />
        
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PageTitle />} />
         
            <Route path="/upload" element={<Upload />} />
            <Route path="/full-document/:pdfUrl" element={<FullDocumentView />} />
            <Route path="/requestpdf" element={<RequestPDFForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/admin/dashboard" element={<Admin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/searchresult" element={<ResultsPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/authors/:authorId/researches" component={AuthorDetails} />
            <Route path="/user/researches/:userId" element={<MyPapers />} />
            <Route path = "/notification/:userId" element = {<NotificationsPage/>}/>
            <Route path="/collections/:userId" element={<Collections />} />
            <Route path="/pdf-requests/:userId" element={<UserPdfRequests />} />
        <Route path="/authors" exact element={<Authors/>} />
        <Route path="/authors/:authorId" element={<AuthorPapers/>} />
        <Route path="/user/researches/:userId" element={<MyPapers/>} /> 


        <Route path="/results" element={<SearchResultsPage />} />
  
    
            <Route path="/" element={<SearchResult />} />
        <Route path="/details" element={<Details />} />
       
        <Route path="/admin/users" element={<UserTablePage />} />
        <Route path="/researchList" element={<ResearchList />} />
        <Route path="/research/:research_id" element={<ResearchDetail />} /> 
        <Route path="/category-list" element={<CategoryTable/>} />
        <Route path="/keyword-list" element={<KeywordTable/>} />

                <Route path="/" exact component={Categories} />
               <Route path="/category/:categoryId" element={<CategoryDetail />} />
               <Route path="/notification-details/:notificationId" element={<NotificationDetailsPage />} />
               <Route path="/edit-user/:userId" element={<EditUserPage />} /> 
 
          </Routes>
          
     
        </main>
  
      </Router>
    </div>
  );
  
}

export default App;