import React, { useState } from 'react';
import axios from 'axios';

const AddAffiliationForm = () => {
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming the user_id is stored in localStorage after login
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      setError('User is not logged in.');
      return;
    }

    try {
      // Send the affiliation data to the backend
      const response = await axios.post('/api/add-affiliation', {
        user_id: userId,
        institution,
        department,
        position,
      });

      if (response.status === 200) {
        // Handle success (e.g., display success message, clear form, etc.)
        alert('Affiliation added successfully!');
      }
    } catch (error) {
      setError('Error adding affiliation.');
    }
  };

  return (
    <div>
      <h3>Add Your Affiliation</h3>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Institution</label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Position</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Affiliation</button>
      </form>
    </div>
  );
};

export default AddAffiliationForm;
