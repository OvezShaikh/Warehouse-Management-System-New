import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios'; // Import axios

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true); // Start loading

    // Basic validation
    if (!username || !email || !password) {
      setError('All fields are required.');
      setLoading(false); // Reset loading
      return;
    }

    try {
      // Ensure your environment variable is set correctly in .env file
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {        username,
        email,
        password,
      });

      setLoading(false); // Reset loading state

      // Successful registration
      const data = response.data;
      localStorage.setItem('token', data.token);
      console.log('token',data.token),
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setLoading(false); // Reset loading state
      console.error('Registration error:', error);

      // Error handling based on the response
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Registration failed. Please try again.');
      } else {
        setError('An error occurred during registration.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          label="Username"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
          type={showPassword ? 'text' : 'password'}
          sx={{ mb: 3 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
          disabled={loading} // Disable when loading
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Paper>
    </Container>
  );
}
