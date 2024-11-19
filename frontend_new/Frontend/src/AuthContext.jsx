import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Fixing import (remove curly braces)

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(""); 
  const [userRole, setUserRole] = useState(""); 
  const [profilePicture, setProfilePicture] = useState(""); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); // Loading state for initialization

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); 
        console.log('Original token', token);
        console.log('Decoded Token:', decodedToken);

        if (decodedToken.exp * 1000 < Date.now()) {
          logout(); 
        } else {
          setIsLoggedIn(true);
          setUsername(decodedToken.username || ''); 
          setUserRole(decodedToken.role || 'user'); 
          setProfilePicture(decodedToken.profilePicture || '');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false); // Set loading to false after the token check
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      localStorage.setItem('token', token); 

      setUsername(decodedToken.username || ''); 
      setUserRole(decodedToken.role || 'user'); 
      setProfilePicture(decodedToken.profilePicture || '');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Token decoding failed:', error);
      setError('Failed to decode token.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername("");
    setUserRole("");
    setProfilePicture("");
  };

  // Return loading state to handle UI rendering
  if (loading) {
    return null; // or a loading spinner component
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, userRole, profilePicture, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
