import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Avatar,
  Paper,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userName, logout } = useAuth();
  // Sample user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet lacus ac arcu posuere condimentum.',
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    logout(); // Use the logout function from context
    navigate('/'); // Redirect after logout
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={user.profilePicture}
              alt={user.name}
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {user.email}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {user.bio}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="contained" color="primary">
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
