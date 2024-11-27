import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';
import { useAuth } from '../AuthContext'; // Import the useAuth hook

export default function Login() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from context
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    setError(null);  // Clear any previous errors
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });
  
      const { token, username, bio, profilePicture } = response.data;
  
      console.log('Login token:', token);
      console.log('User data:', { username, bio, profilePicture });
      console.log('Login successful, now navigating to /home');
      setIsLoggedIn(true);
  
      // Use the login method from AuthContext to set token and auth state
      login(token,  { username, profilePicture });
  
      navigate('/home');  // Redirect to home page after successful login
    } catch (error) {
      if (error.response) {
        // Server error - likely an issue with credentials
        setError(error.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        // Client-side or network error
        setError('An error occurred during login. Please try again.');
      }
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Login
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          label="Email"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          fullWidth
          variant="outlined"
          type="password"
          sx={{ mb: 3 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </Container>
  );
}
