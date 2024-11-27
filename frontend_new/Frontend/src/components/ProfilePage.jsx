import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Avatar,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout, userRole } = useAuth(); // Use AuthContext for authentication
  const [user, setUser] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to handle any errors

  // Fetch user profile from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in request
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setUser(data); // Set user data from response
      } catch (err) {
        setError(err.message); // Set error message if any
      } finally {
        setLoading(false); // Stop loading, regardless of success or failure
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logout(); // Use the logout function from context
      localStorage.removeItem('token'); // Remove token from local storage
      navigate('/login'); // Redirect to the login page after logout
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h6" align="center">Loading profile...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h6" align="center" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" height="full" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={user.profilePicture ? `${import.meta.env.VITE_API_URL}/${user.profilePicture.replace('\\', '/')}` : 'https://via.placeholder.com/150'}
              alt={user.username}
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {user.username || 'Unknown User'}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {user.email || 'No email available'}
            </Typography>
            <Typography variant="bold" gutterBottom>
            {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase() : 'No role available'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="contained" color="primary" onClick={() => navigate('/settings')}>
                Edit Profile
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
