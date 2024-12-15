import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CSS/KeywordsTable.css';
import Sidebar from './Sidebar';

const KeywordTable = () => {
  const [keywords, setKeywords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentKeyword, setCurrentKeyword] = useState({ id: null, name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const keywordsPerPage = 10; // Number of keywords per page
  const [isOpen, setIsOpen] = useState(true); // Set the initial sidebar state to 'open' (true)

  // Fetch keywords on component mount
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/keywords');
        // Sort keywords alphabetically
        const sortedKeywords = response.data.keywords || [];
        sortedKeywords.sort((a, b) => a.keyword_name.localeCompare(b.keyword_name));
        setKeywords(sortedKeywords);
      } catch (error) {
        console.error('Error fetching keywords:', error);
        setKeywords([]);
      }
    };
    fetchKeywords();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentKeyword({ ...currentKeyword, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const openModal = () => {
    setCurrentKeyword({ id: null, name: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar visibility
    console.log("Sidebar toggled: ", isOpen); // Debugging log
  };

  const addKeyword = async () => {
    if (!currentKeyword.name) return;
    try {
      const response = await axios.post('https://ccsrepo.onrender.com/keywords/add', {
        keyword_name: currentKeyword.name,
      });
      const newKeywords = [...keywords, response.data];
      newKeywords.sort((a, b) => a.keyword_name.localeCompare(b.keyword_name)); // Sort after adding
      setKeywords(newKeywords);
      setShowModal(false);
      Swal.fire({ title: 'Success!', text: 'Keyword added successfully.', icon: 'success', confirmButtonText: 'OK' });
    } catch (error) {
      console.error('Error adding keyword:', error);
      Swal.fire({ title: 'Error!', text: 'There was an error adding the keyword.', icon: 'error', confirmButtonText: 'OK' });
    }
  };

  const editKeyword = (id) => {
    const keywordToEdit = keywords.find((keyword) => keyword.keyword_id === id);
    setCurrentKeyword({ id: keywordToEdit.keyword_id, name: keywordToEdit.keyword_name });
    setIsEditing(true);
    setShowModal(true);
  };

  const updateKeyword = async () => {
    try {
      const response = await axios.put(`https://ccsrepo.onrender.com/keywords/${currentKeyword.id}`, {
        keyword_name: currentKeyword.name,
      });
      const updatedKeywords = keywords.map((keyword) => (keyword.keyword_id === response.data.keyword_id ? response.data : keyword));
      updatedKeywords.sort((a, b) => a.keyword_name.localeCompare(b.keyword_name)); // Sort after updating
      setKeywords(updatedKeywords);
      setShowModal(false);
      Swal.fire({ title: 'Success!', text: 'Keyword updated successfully.', icon: 'success', confirmButtonText: 'OK' });
    } catch (error) {
      console.error('Error updating keyword:', error);
      Swal.fire({ title: 'Error!', text: 'There was an error updating the keyword.', icon: 'error', confirmButtonText: 'OK' });
    }
  };

  const deleteKeyword = async (id) => {
    try {
      await axios.delete(`https://ccsrepo.onrender.com/keywords/${id}`);
      const remainingKeywords = keywords.filter((keyword) => keyword.keyword_id !== id);
      remainingKeywords.sort((a, b) => a.keyword_name.localeCompare(b.keyword_name)); // Sort after deleting
      setKeywords(remainingKeywords);
      Swal.fire({ title: 'Deleted!', text: 'Keyword has been deleted.', icon: 'success', confirmButtonText: 'OK' });
    } catch (error) {
      console.error('Error deleting keyword:', error);
      Swal.fire({ title: 'Error!', text: 'There was an error deleting the keyword.', icon: 'error', confirmButtonText: 'OK' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isEditing ? updateKeyword() : addKeyword();
  };

  // Filter keywords based on search term
  const filteredKeywords = keywords.filter((keyword) =>
    keyword.keyword_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the current keywords to display
  const indexOfLastKeyword = currentPage * keywordsPerPage;
  const indexOfFirstKeyword = indexOfLastKeyword - keywordsPerPage;
  const currentKeywords = filteredKeywords.slice(indexOfFirstKeyword, indexOfLastKeyword);

  // Calculate total pages
  const totalPages = Math.ceil(filteredKeywords.length / keywordsPerPage);

  return (
    <div className={`keyword-table ${isOpen ? 'with-sidebar' : 'full-width'}`}>
      <Sidebar toggleSidebar={toggleSidebar} isOpen={isOpen} />
      <div className="table-container">
        <h2>Keywords</h2>
        <input
          type="text"
          placeholder="Search keywords"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button onClick={openModal}>Add Keyword</button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentKeywords && currentKeywords.length > 0 ? (
              currentKeywords.map((keyword) => (
                <tr key={keyword.keyword_id}>
                  <td>{keyword.keyword_name}</td>
                  <td>
                    <button onClick={() => editKeyword(keyword.keyword_id)}>Edit</button>
                    <button onClick={() => deleteKeyword(keyword.keyword_id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No keywords found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h3>{isEditing ? 'Edit Keyword' : 'Add Keyword'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={currentKeyword.name}
                onChange={handleInputChange}
                placeholder="Keyword Name"
                required
              />
              <button type="submit">{isEditing ? 'Update' : 'Add'} Keyword</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordTable;
