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
} from '@mui/material';
import axios from 'axios';
import SideBarComponent from '../../SideBarComponent';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LocationManager = ({ grnItems }) => {
  const [locations, setLocations] = useState([]);
  const [openAddLocationDialog, setOpenAddLocationDialog] = useState(false);
  const [locationCode, setLocationCode] = useState('');
  const [capacity, setCapacity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/location`, {
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
    <div className="p-8 space-y-1 flex">
      <ToastContainer />
      <SideBarComponent />
      <div className="w-full bg-slate-100">
        <h1 className="text-2xl font-semibold">Manage Locations</h1>

        <Button variant="outlined" color="primary" onClick={() => setOpenAddLocationDialog(true)}>
          Add New Location
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateStockWithGRN}
          className="ml-4"
        >
          Update Stock from GRN
        </Button>

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

        {loading ? (
          <CircularProgress />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <Card key={location._id} className="shadow-lg">
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
                  <div className="mt-4">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setSelectedLocation(location)}
                    >
                      Manage Stock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedLocation && (
          <Dialog open={true} onClose={() => setSelectedLocation(null)}>
            <DialogTitle>Manage Stock for {selectedLocation.locationCode}</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Current Stock: {selectedLocation.stock}</Typography>
              <div className="flex justify-between mt-4">
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
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedLocation(null)} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default LocationManager;
