import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SideBarComponent from '../../SideBarComponent';
import NavBarComponent from '../../NavBarComponent';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../../AuthContext";

const LocationManager = ({ grnItems }) => {
  const [locations, setLocations] = useState([]);
  const [openAddLocationDialog, setOpenAddLocationDialog] = useState(false);
  const [locationCode, setLocationCode] = useState('');
  const [capacity, setCapacity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { userRole } = useAuth();


  // Fetch locations from API
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchLocations();
  }, []);

  // Add new location
  const handleAddLocation = async () => {
    if (!locationCode || !capacity) {
      toast.error('Both fields are required!');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/locations`, {
        locationCode,
        capacity,
      });
      setLocations((prevLocations) => [...prevLocations, response.data]);
      setLocationCode('');
      setCapacity('');
      setOpenAddLocationDialog(false);
      toast.success('Location added successfully!', { autoClose: 3000 });
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Failed to add location.');
    }
  };


  const handleUpdateCapacity = async (increment) => {
    if (!selectedLocation) return;

    const updatedCapacity = increment
      ? selectedLocation.capacity + 1
      : selectedLocation.capacity - 1;

    if (updatedCapacity < 0) {
      toast.error("Capacity cannot be less than zero!");
      return;
    }

    // Optimistic update
    setSelectedLocation((prev) => ({ ...prev, capacity: updatedCapacity }));
    setLocations((prevLocations) =>
      prevLocations.map((loc) =>
        loc._id === selectedLocation._id ? { ...loc, capacity: updatedCapacity } : loc
      )
    );

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/locations/${selectedLocation._id}/capacity`,
        { capacity: updatedCapacity }
      );
      toast.success("Capacity updated successfully!", { autoClose: 2000 });
    } catch (error) {
      console.error("Error updating capacity:", error);
      toast.error("Failed to update capacity.");
      fetchLocations(); // Revert optimistic update
    }
  };



  // Update stock for the selected location manually
  const handleUpdateStock = async (increment) => {
    console.log('Selected Location ID:', selectedLocation._id);
    if (!selectedLocation) return;

    const updatedStock = increment
      ? selectedLocation.stock + 1
      : selectedLocation.stock - 1;

    // Optimistic update
    setSelectedLocation((prev) => ({ ...prev, stock: updatedStock }));
    setLocations((prevLocations) =>
      prevLocations.map((loc) =>
        loc._id === selectedLocation._id ? { ...loc, stock: updatedStock } : loc
      )
    );

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/locations/${selectedLocation._id}/stock`,
        { stock: updatedStock }
      );

      // toast.success('Stock updated successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock.');
      fetchLocations(); // Revert optimistic update
    }
  };

  // Update stock from GRN items
  const handleUpdateStockWithGRN = async () => {
    try {
      const updates = grnItems.map(async (item) => {
        const location = locations.find((loc) => loc.locationCode === item.dockCode);
        if (location) {
          const newStock = location.stock + item.quantity;

          // Optimistic update
          setLocations((prevLocations) =>
            prevLocations.map((loc) =>
              loc._id === location._id ? { ...loc, stock: newStock } : loc
            )
          );

          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/locations/${location._id}/stock`,
            { stock: newStock }
          );
        }
      });

      await Promise.all(updates);
      toast.success('Stock updated from GRNs successfully.');
      fetchLocations();
    } catch (error) {
      console.error('Error updating stock from GRNs:', error);
      toast.error('Failed to update stock from GRNs.');
      fetchLocations();
    }
  };

  return (
    <Box sx={{ display: 'flex', margin: 6, padding: 3, height: '100vh' }}>

      {/* AppBar for small screens */}
      {isSmallScreen && (
        <AppBar position="fixed">
          <Toolbar sx={{ height: '80px' }}>
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer for small screens */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
          <SideBarComponent />
        </Box>
      </Drawer>

      {/* Sidebar for larger screens */}
      {!isSmallScreen && (
        <Grid item md={2} sm={2} xs={1} sx={{ flexShrink: 0 }}>
          <SideBarComponent />
        </Grid>
      )}

      {/* Main Content */}
      <Grid item md={10} sm={9} xs={11} sx={{ width: '90%' }}>
        <h1 className="text-2xl font-semibold m-2">Manage Locations</h1>

        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenAddLocationDialog(true)}
            >
              Add New Location
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateStockWithGRN}
            >
              Update Stock from GRN
            </Button>
          </Grid>
        </Grid>

        {userRole === 'admin' ? (
          <Dialog open={openAddLocationDialog} onClose={() => setOpenAddLocationDialog(false)}>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogContent>
              <TextField
                label="Location Code"
                variant="outlined"
                fullWidth
                value={locationCode}
                onChange={(e) => setLocationCode(e.target.value)}
                className="mb-4"
              />
              <TextField
                label="Capacity"
                variant="outlined"
                fullWidth
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="mb-4"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddLocationDialog(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleAddLocation} color="primary">
                Add Location
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Typography variant="h6" color="error" align="center" sx={{ mt: 2 }}>
            You are a user and do not have permission to add locations.
          </Typography>
        )}


        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {locations.map((location) => (
              <Grid item md={4} sm={6} xs={12} key={location._id} onClick={() => setSelectedLocation(location)}>
                <Card className="shadow-lg">
                  <CardContent>
                    <Typography variant="h6">{location.locationCode}</Typography>
                    <Typography>Capacity: {location.capacity}</Typography>
                    <Typography
                      style={{
                        fontWeight: location.stock > location.capacity ? 'bold' : 'normal',
                        color: location.stock > location.capacity ? 'red' : 'black',
                      }}
                    >
                      Stock: {location.stock}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {userRole === 'admin' && selectedLocation && (
          <Dialog open={true} onClose={() => setSelectedLocation(null)}>
            <DialogTitle>Manage Stock for {selectedLocation.locationCode}</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Current Stock: {selectedLocation.stock}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdateStock(true)}
                >
                  Increase Stock
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUpdateStock(false)}
                >
                  Decrease Stock
                </Button>

                  
              </Box>
              <Typography variant="h6">Current Capacity: {selectedLocation.capacity}</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: 2 }}>
                
                <Button
                sx={{p:1.5 , margin: 2}}
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdateCapacity(true)}
                >
                  Increase Capacity
                </Button>
                <Button
                sx={{p:1.5, margin: 2}}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUpdateCapacity(false)}
                >
                  Decrease Capacity
                </Button>
                </Box>
              {/* Buttons for capacity management */}
              {/*  */}

            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedLocation(null)} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}

      </Grid>
    </Box>
  );
};

export default LocationManager;
