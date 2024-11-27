import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify"; // Assuming you use react-toastify for notifications

export default function GrnItemsManager() {
  const [grnItems, setGrnItems] = useState([]);
  const [grnList, setGrnList] = useState([]);
  const [locationList, setLocationList] = useState([]); // Store locations here
  const [newItem, setNewItem] = useState({
    itemNo: "",
    description: "",
    quantity: 0,
    serialNumber: "",
    invoiceNo: "",
    dockCode: "",
    receivingDate: "",
    status: "Pending",
  });
  const [selectedGrnId, setSelectedGrnId] = useState("");
  const [addItemModal, setAddItemModal] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "itemNo", headerName: "Item No", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 120 },
    { field: "dockCode", headerName: "Location", width: 120 },
    {
      field: "receivingNo",
      headerName: "Receiving No",
      width: 200,
    },
    {
      field: "receivingDate",
      headerName: "Receiving Date",
      width: 200,
    },
    { field: "status", headerName: "Status", width: 120 },
  ];

  // Fetch GRN items and locations
  const fetchGrnItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
      const allGrns = response.data.grns;
      const items = allGrns.flatMap((grn) =>
        grn.items.map((item) => ({
          ...item,
          grnId: grn._id,
          receivingNo: grn.receivingNo,
        }))
      );
      setGrnItems(items);
      setGrnList(allGrns);
    } catch (err) {
      console.error("Error fetching GRN items:", err);
      setError("Failed to fetch GRN items.");
    }
  };

  // Fetch locations using the approach from your `grn` component
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/docklocations`);
        setLocationList(response.data); // Update location list
      } catch (err) {
        console.error("Error fetching locations:", err);
        toast.error("Error fetching locations."); // Show error notification
      }
    };

    fetchLocations();
  }, []);

  // Add a new item to a GRN
  const addItemToGrn = async () => {
    if (!selectedGrnId || !newItem.itemNo || !newItem.description || !newItem.serialNumber || !newItem.invoiceNo || !newItem.dockCode || !newItem.quantity || !newItem.receivingDate) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const grn = grnList.find((grn) => grn._id === selectedGrnId);
      if (!grn) {
        setError("Selected GRN not found.");
        return;
      }

      const updatedItems = [...grn.items, newItem];
      await axios.put(`${import.meta.env.VITE_API_URL}/api/grn/${selectedGrnId}`, { items: updatedItems });

      setSuccess("Item added successfully.");
      setAddItemModal(false);
      setNewItem({
        itemNo: "",
        description: "",
        quantity: 0,
        serialNumber: "",
        invoiceNo: "",
        dockCode: "",
        receivingDate: "",
        status: "Pending",
      });
      fetchGrnItems();
    } catch (err) {
      console.error("Error adding item to GRN:", err);
      setError("Failed to add item.");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchGrnItems();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" onClick={() => setAddItemModal(true)}>
          Add Item to GRN
        </Button>
      </Box>

      {/* DataGrid to show all GRN items */}
      <DataGrid
        rows={grnItems}
        columns={columns}
        pageSize={10}
        getRowId={(row) => `${row.receivingNo}-${row.itemNo}`}
        autoHeight
      />

      {/* Modal to add new item */}
      <Dialog open={addItemModal} onClose={() => setAddItemModal(false)}>
        <DialogTitle>Add Item to GRN</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="GRN ID"
            select
            value={selectedGrnId}
            onChange={(e) => setSelectedGrnId(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">Select a GRN</option>
            {grnList.map((grn) => (
              <option key={grn._id} value={grn._id}>
                {grn.receivingNo}----{grn._id}
              </option>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label="Item No"
            value={newItem.itemNo}
            onChange={(e) => setNewItem({ ...newItem, itemNo: e.target.value })}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Serial Number"
            value={newItem.serialNumber}
            onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Invoice No"
            value={newItem.invoiceNo}
            onChange={(e) => setNewItem({ ...newItem, invoiceNo: e.target.value })}
          />

          {/* Dock Location Dropdown */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Location</InputLabel>
            <Select
              value={newItem.dockCode}
              onChange={(e) => setNewItem({ ...newItem, dockCode: e.target.value })}
              label="Location"
            >
              {locationList.length === 0 ? (
                <MenuItem disabled>No locations available</MenuItem>
              ) : (
                locationList.map((location) => (
                  <MenuItem key={location._id} value={location.dockCode}>
                    {location.dockCode} - {location.description}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="dense"
            label="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Receiving Date"
            type="date"
            value={newItem.receivingDate}
            onChange={(e) => setNewItem({ ...newItem, receivingDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newItem.status}
              onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="OK">OK</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddItemModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={addItemToGrn}>
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Notifications */}
      {success && (
        <Snackbar open autoHideDuration={6000} onClose={() => setSuccess(null)}>
          <Alert severity="success">{success}</Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar open autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}
