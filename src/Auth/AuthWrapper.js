import React, { createContext, useContext, useState } from "react";



// Create the authentication context
const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

// Authentication wrapper component
export const AuthWrapper = () => {
     // State to hold user authentication information
     const [user, setUser] = useState(() => {
         // Check if user details are stored in local storage
         const storedUser = JSON.parse(localStorage.getItem('user'));
         return storedUser || { name: "", isAuthenticated: false, roleName: "", token: "", role_id: "" };
     });
     const [isAdmin, setIsAdmin] = useState(false);

     // Function to set admin status
     const setAdminStatus = (status) => {
         setIsAdmin(status);
     };

     // Function to perform login
     const login = (email, password, role_id) => {
      return fetch("https://ccsrepo.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role_id }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const { token, roleName, role_id } = data;
          const newUser = { name: email, isAuthenticated: true, token, roleName, role_id }; // Include role_id in user object
          setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));
          return "success";
        })
        .catch((error) => {
          setUser(null); // Reset user state on authentication failure
          throw new Error("Authentication failed");
        });
    };

     // Function to perform logout
     const logout = () => {
          // Clear user state and local storage
          setUser({ name: "", isAuthenticated: false, roleName: "", token: "", role_id: "" });
          localStorage.removeItem('user');
     };

     // Provide authentication context to children components
     return (
          <AuthContext.Provider value={{ user, login, logout, isAdmin, setAdminStatus }}>
               <>
                
           
               
               </>
          </AuthContext.Provider>
     );
};

export const useAuth = () => useContext(AuthContext);