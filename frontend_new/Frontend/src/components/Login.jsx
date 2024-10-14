import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';
import { useAuth } from '../AuthContext'; // Import the useAuth hook

export default function Login() {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from context

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        username,
        password,
      });

      const data = response.data;
      login(data.token, username); // Call the login function from context
      navigate('/'); // Redirect to the home page after successful login
      
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        setError('An error occurred during login.');
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
          label="Username"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
