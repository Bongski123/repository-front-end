import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios if you're using it

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:9000/categories/all');
        console.log('Fetched categories:', response.data); // Log the response data
        // Check if response data contains categories in the expected structure
        setCategories(Array.isArray(response.data) ? response.data : []); // Adjust if necessary
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]); // Set to empty array in case of error
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const addCategory = async () => {
    if (!currentCategory.name) return;
    try {
      const response = await axios.post('http://localhost:5000/api/categories', {
        name: currentCategory.name,
      });
      setCategories([...categories, response.data]); // Add the newly created category to the list
      setCurrentCategory({ id: null, name: '' });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const editCategory = (id) => {
    const categoryToEdit = categories.find((category) => category.id === id);
    setCurrentCategory(categoryToEdit);
    setIsEditing(true);
  };

  const updateCategory = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/categories/${currentCategory.id}`, {
        name: currentCategory.name,
      });
      setCategories(categories.map((category) => (category.id === response.data.id ? response.data : category)));
      setCurrentCategory({ id: null, name: '' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isEditing ? updateCategory() : addCategory();
  };

  return (
    <div>
      <h2>Categories</h2>
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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td> {/* Ensure this is correct */}
              <td>
                <button onClick={() => editCategory(category.id)}>Edit</button>
                <button onClick={() => deleteCategory(category.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
