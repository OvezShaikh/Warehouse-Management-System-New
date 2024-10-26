import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");  // Store the username
  const [userRole, setUserRole] = useState("");  // Store the role
  const [profilePicture, setProfilePicture] = useState(""); 
  const [error, setError] = useState(null);  // State for handling errors

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);  // Decode the JWT token
        console.log('Decoded Token:', decodedToken);

        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();  // Logout if the token is expired
        } else {
          setIsLoggedIn(true);
          setUsername(decodedToken.username || '');  // Use correct token structure
          setUserRole(decodedToken.role || 'user');  // Save role
          setProfilePicture(decodedToken.profilePicture || '');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      localStorage.setItem('token', token);  // Save token in localStorage
      console.log("Token", token);
      console.log("Token content", decodedToken);
      setUsername(decodedToken.username || '');  // Use correct token structure
      setUserRole(decodedToken.role || 'user');  // Save role
      setProfilePicture(decodedToken.profilePicture || '');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Token decoding failed:', error);
      setError('Failed to decode token.'); // Handle error
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername("");
    setUserRole("");
    setProfilePicture("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, userRole, profilePicture, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
