import React from 'react';
import { useAuth } from './AuthContext'; // Import useAuth hook

function Account() {
  const { user, logout } = useAuth(); // Use useAuth hook to access user data and logout function

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Account;