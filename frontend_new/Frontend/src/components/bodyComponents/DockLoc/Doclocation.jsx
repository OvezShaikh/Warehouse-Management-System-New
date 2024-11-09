import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Box, Grid, useMediaQuery, Drawer, IconButton, AppBar, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import SideBarComponent from '../../SideBarComponent';

const AddDockLocation = () => {
  const [dockCode, setDockCode] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [locationCode, setLocationCode] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!dockCode || !capacity || !description || !locationCode) {
      setError(true);
      setSnackbarMessage('All fields are required');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/docklocations`, {
        dockCode,
        capacity,
        description,
        locationCode,
      });

      setSnackbarMessage('Dock location added successfully!');
      setSnackbarOpen(true);
      setDockCode('');
      setCapacity('');
      setDescription('');
      setLocationCode('');
    } catch (err) {
      console.error('Error adding dock location:', err);
      setSnackbarMessage('Failed to add dock location');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar for small screens */}
      {isSmallScreen && (
        <AppBar position="fixed">
          <Toolbar sx={{ height: '80px' }}>
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer for the sidebar, only for small screens */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
          <SideBarComponent />
        </Box>
      </Drawer>

      {/* Static Sidebar for larger screens */}
      {!isSmallScreen && (
        <Grid item md={2} sm={2} xs={1} sx={{ flexShrink: 0 }}>
          <SideBarComponent />
        </Grid>
      )}

      {/* Form Section - Align it to the right */}
      <Grid container direction="column" sx={{ flex: 1, padding: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Dock Code"
            fullWidth
            value={dockCode}
            onChange={(e) => setDockCode(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Capacity"
            fullWidth
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Location Code"
            fullWidth
            value={locationCode}
            onChange={(e) => setLocationCode(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
            Add Dock Location
          </Button>
        </form>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Box>
  );
};

export default AddDockLocation;
