import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const QualityCheckComponent = () => {
  const [grnData, setGrnData] = useState([]); // GRN data
  const [liveLocations, setLiveLocations] = useState([]); // Locations from /locations API
  const [loadingGrnId, setLoadingGrnId] = useState(null); // Loading state for each GRN
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [errorMessage, setErrorMessage] = useState(""); // Error message for the snackbar

  // Fetch GRN data and live locations when the component mounts
  useEffect(() => {
    const fetchGrnData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
        setGrnData(response.data.grns || []);
      } catch (error) {
        console.error("Error fetching GRN data:", error);
        setErrorMessage("Failed to fetch GRN data.");
      }
    };

    const fetchLiveLocations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/locations`);
        setLiveLocations(response.data.locations || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setErrorMessage("Failed to fetch live locations.");
      }
    };

    fetchGrnData();
    fetchLiveLocations();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleItemStatusChange = async (grnId, itemId, newStatus) => {
    setLoadingGrnId(grnId);
  
    try {
      // Update the item status
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/grn/${grnId}/item/${itemId}/status`,
        { status: newStatus }
      );
  
      if (response.status === 200) {
        setGrnData((prevGrns) =>
          prevGrns.map((grn) =>
            grn._id === grnId
              ? {
                  ...grn,
                  items: grn.items.map((item) =>
                    item._id === itemId ? { ...item, status: newStatus } : item
                  ),
                }
              : grn
          )
        );
        setSnackbarMessage("Item status updated successfully!");
      } else {
        throw new Error("Failed to update item status");
      }
    } catch (error) {
      console.error("Error updating item status:", error);
      setSnackbarMessage("Failed to update item status.");
    } finally {
      setSnackbarOpen(true);
      setLoadingGrnId(null);
    }
  };

  // Handle changing the dock location for a specific item
  const handleLocationChange = async (grnId, itemId, newLocation, newStatus) => {
    setLoadingGrnId(grnId);
  
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/grn/${grnId}/item/${itemId}/location`,
        { dockLocation: newLocation, status: newStatus }
      );
  
      if (response.status === 200) {
        setGrnData((prevGrns) =>
          prevGrns.map((grn) =>
            grn._id === grnId
              ? {
                  ...grn,
                  items: grn.items.map((item) =>
                    item._id === itemId
                      ? { ...item, dockLocation: newLocation, status: newStatus }
                      : item
                  ),
                }
              : grn
          )
        );
        setSnackbarMessage("Dock location and status updated successfully!");
      } else {
        throw new Error("Failed to update dock location and status");
      }
    } catch (error) {
      console.error("Error updating dock location and status:", error);
      setSnackbarMessage("Failed to update location and status.");
    } finally {
      setSnackbarOpen(true);
      setLoadingGrnId(null);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Quality Check
      </Typography>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table aria-label="Created GRNs">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <strong>Po No.</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Receiving No.</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Item No.</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Item Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grnData.length > 0 ? (
              grnData.map((grn) => (
                <React.Fragment key={grn._id}>
                  {grn.items.map((item) => (
                    <TableRow key={item._id}>
                      {/* PO Number Column */}
                      <TableCell align="center">{grn.poNumber}</TableCell>

                      {/* Receiving No. Column */}
                      <TableCell align="center">{grn.receivingNo}</TableCell>

                      <TableCell align="center">{item.itemNo}</TableCell>

                      {/* Status Select for each GRN */}
                      <TableCell align="center">
                        <Select
                          value={item.status || "Pending"}
                          onChange={(e) => handleItemStatusChange(grn._id, item._id, e.target.value)}
                          disabled={loadingGrnId === grn._id}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="OK">OK</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </TableCell>

                      {/* Location Select for each item */}
                      {/*  */}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No GRN data available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for status and location update feedback */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={errorMessage ? "error" : "success"}>
          {errorMessage || snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QualityCheckComponent;
