import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

export default function GrnItems() {
  const [grnItems, setGrnItems] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [newItem, setNewItem] = useState({
    grnId: '', // You might need to select a GRN first
    itemNo: '',
    status: 'Pending', // Default status value
    dockLocation: '',
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [openItemModal, setOpenItemModal] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const columns = [
    {
      field: 'checkbox',
      headerName: 'Select',
      width: 90,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(params.row._id)}
          onChange={(e) => handleCheckboxChange(e, params.row._id)}
        />
      ),
    },
    {
      field: 'itemNo',
      headerName: 'Item No',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <TextField
          select
          value={params.row.status}
          onChange={(e) => handleStatusChange(e, params.row._id)}
          fullWidth
          SelectProps={{
            native: true,
          }}
        >
          <option value="Pending">Pending</option>
          <option value="Received">Received</option>
          <option value="Rejected">Rejected</option>
        </TextField>
      ),
    },
    {
      field: 'dockLocation',
      headerName: 'Dock Location',
      width: 200,
      renderCell: (params) => (
        <TextField
          select
          value={params.row.dockLocation}
          onChange={(e) => handleLocationChange(e, params.row._id)}
          fullWidth
          SelectProps={{
            native: true,
          }}
        >
          <option value="">Select Location</option>
          {locationList.map((location) => (
            <option key={location._id} value={location._id}>
              {location.locationCode}
            </option>
          ))}
        </TextField>
      ),
    },
  ];

  const fetchGrnItems = async (grnId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn/${grnId}/item`);
      setGrnItems(response.data);
      console.log("this is respose of items",response.data);
    } catch (err) {
      setError('Error fetching GRN items');
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/locations`);
      setLocationList(response.data);
    } catch (err) {
      setError('Error fetching locations');
    }
  };

  const handleCheckboxChange = (e, id) => {
    setSelectedItems((prevSelectedItems) =>
      e.target.checked ? [...prevSelectedItems, id] : prevSelectedItems.filter((itemId) => itemId !== id)
    );
  };

  const handleStatusChange = async (e, itemId) => {
    const newStatus = e.target.value;
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/grn/items/${itemId}/status`, { status: newStatus });
      setGrnItems((prevItems) =>
        prevItems.map((item) => (item._id === itemId ? { ...item, status: newStatus } : item))
      );
      setSuccess('Status updated successfully');
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Error updating status');
      setSuccess(null); // Clear any previous success messages
    }
  };

  const handleLocationChange = async (e, itemId) => {
    const newLocation = e.target.value;
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/grn/items/${itemId}/location`, { dockLocation: newLocation });
      setGrnItems((prevItems) =>
        prevItems.map((item) => (item._id === itemId ? { ...item, dockLocation: newLocation } : item))
      );
      setSuccess('Location updated successfully');
      setError(null);
    } catch (err) {
      setError('Error updating location');
      setSuccess(null);
    }
  };

  const addItemToGrn = async () => {
    const { grnId, itemNo, status, dockLocation } = newItem;
    if (!grnId || !itemNo || !status || !dockLocation) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/grn/${grnId}/items`, newItem);
      setGrnItems([...grnItems, response.data]);
      setNewItem({ grnId: '', itemNo: '', status: 'Pending', dockLocation: '' });
      setOpenItemModal(false);
      setSuccess('Item added successfully');
    } catch (err) {
      setError('Error adding item to GRN');
    }
  };

  const deleteSelectedItems = async () => {
    try {
      if (selectedItems.length === 0) {
        setError('No items selected for deletion.');
        return;
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/grn/items`, {
        data: { itemIds: selectedItems },
      });

      setGrnItems((prevItems) => prevItems.filter((item) => !selectedItems.includes(item._id)));
      setSelectedItems([]);
      setSuccess('Items deleted successfully');
    } catch (err) {
      setError('Error deleting selected items');
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenItemModal(true)} sx={{ mr: 2 }}>
          Add New Item
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={deleteSelectedItems}
          disabled={selectedItems.length === 0}
        >
          Delete Selected Items
        </Button>
      </Box>

      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={grnItems}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row._id}
      />

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}

      {success && (
        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
          <Alert severity="success">{success}</Alert>
        </Snackbar>
      )}

      <Dialog open={openItemModal} onClose={() => setOpenItemModal(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            label="GRN ID"
            value={newItem.grnId}
            onChange={(e) => setNewItem({ ...newItem, grnId: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Item No"
            value={newItem.itemNo}
            onChange={(e) => setNewItem({ ...newItem, itemNo: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Status"
            value={newItem.status}
            onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Dock Location"
            value={newItem.dockLocation}
            onChange={(e) => setNewItem({ ...newItem, dockLocation: e.target.value })}
            fullWidth
          >
            {locationList.map((location) => (
              <option key={location._id} value={location._id}>
                {location.locationCode}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenItemModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={addItemToGrn} color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
