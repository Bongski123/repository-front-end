import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CSS/CategoryTable.css';
import Sidebar from './Sidebar';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items per page
  const [isOpen, setIsOpen] = useState(true); // Sidebar state
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://ccsrepo.onrender.com/categories/all');
        const sortedCategories = response.data.category || [];
        sortedCategories.sort((a, b) => a.category_name.localeCompare(b.category_name)); // Sort alphabetically
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const openModal = () => {
    setCurrentCategory({ id: null, name: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const addCategory = async () => {
    if (!currentCategory.name) return;
    try {
      const response = await axios.post('https://ccsrepo.onrender.com/categories/add', {
        category_name: currentCategory.name,
      });
      setCategories((prev) => [...prev, response.data]);
      setShowModal(false);
      Swal.fire({ title: 'Success!', text: 'Category added successfully.', icon: 'success', confirmButtonText: 'OK' });
    } catch (error) {
      console.error('Error adding category:', error);
      Swal.fire({ title: 'Error!', text: 'There was an error adding the category.', icon: 'error', confirmButtonText: 'OK' });
    }
  };

  const editCategory = (id) => {
    const categoryToEdit = categories.find((category) => category.category_id === id);
    setCurrentCategory({ id: categoryToEdit.category_id, name: categoryToEdit.category_name });
    setIsEditing(true);
    setShowModal(true);
  };

  const updateCategory = async () => {
    try {
      const response = await axios.put(`https://ccsrepo.onrender.com/categories/${currentCategory.id}`, {
        category_name: currentCategory.name,
      });
      setCategories((prev) =>
        prev.map((category) => (category.category_id === response.data.category_id ? response.data : category))
      );
      setShowModal(false);
      Swal.fire({ title: 'Success!', text: 'Category updated successfully.', icon: 'success', confirmButtonText: 'OK' });
    } catch (error) {
      console.error('Error updating category:', error);
      Swal.fire({ title: 'Error!', text: 'There was an error updating the category.', icon: 'error', confirmButtonText: 'OK' });
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`https://ccsrepo.onrender.com/categories/${id}`);
      setCategories((prev) => prev.filter((category) => category.category_id !== id));
      Swal.fire({ title: 'Deleted!', text: 'Category has been deleted.', icon: 'success', confirmButtonText: 'OK' });
    } catch (error) {
      console.error('Error deleting category:', error);
      Swal.fire({ title: 'Error!', text: 'There was an error deleting the category.', icon: 'error', confirmButtonText: 'OK' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isEditing ? updateCategory() : addCategory();
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const currentItems = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="category-table">
      <Sidebar toggleSidebar={toggleSidebar} isOpen={isOpen} />
      <div className={`main-content ${isOpen ? 'with-sidebar' : 'no-sidebar'}`}>
        <h2>Categories</h2>
        <input
          type="text"
          placeholder="Search categories"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button onClick={openModal}>Add Category</button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((category) => (
                <tr key={category.category_id}>
                  <td>{category.category_name}</td>
                  <td>
                    <button onClick={() => editCategory(category.category_id)}>Edit</button>
                    <button onClick={() => deleteCategory(category.category_id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No categories found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Modal for adding/editing categories */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <h3>{isEditing ? 'Edit Category' : 'Add Category'}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleInputChange}
                  placeholder="Category Name"
                  required
                />
                <button type="submit">{isEditing ? 'Update' : 'Add'} Category</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTable;
