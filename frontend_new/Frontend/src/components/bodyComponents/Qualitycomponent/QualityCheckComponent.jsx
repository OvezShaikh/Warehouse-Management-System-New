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
} from "@mui/material";
import axios from "axios";

const QualityCheckComponent = () => {
  const [grnData, setGrnData] = useState([]);
  const [loadingGrnId, setLoadingGrnId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch GRN data on component mount
    const fetchGrnData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
        setGrnData(response.data.grns || []); // Assuming 'grns' key holds the data
      } catch (error) {
        console.error("Error fetching GRN data:", error);
        setErrorMessage("Failed to fetch GRN data.");
      }
    };

    fetchGrnData();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleStatusChange = async (grnId, newStatus) => {
    setLoadingGrnId(grnId);

    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/grn/${grnId}/status`, {
        grnId,
        status: newStatus,
      });

      if (response.status === 200) {
        setGrnData((prevGrns) =>
          prevGrns.map((grn) =>
            grn._id === grnId ? { ...grn, status: newStatus } : grn
          )
        );
        setSnackbarMessage("Status updated successfully!");
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating GRN status:", error);
      setSnackbarMessage("Failed to update status.");
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
              <TableCell align="center"><strong>Po No.</strong></TableCell>
              <TableCell align="center"><strong>Receiving No.</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grnData.length > 0 ? (
              grnData.map((grn) => (
                <TableRow key={grn._id}>
                  <TableCell align="center">{grn.poNumber}</TableCell>
                  <TableCell align="center">{grn.receivingNo}</TableCell>
                  <TableCell align="center">
                    <Select
                      value={grn.status || "Pending"} // Default to "Pending" if status is not set
                      onChange={(e) => handleStatusChange(grn._id, e.target.value)}
                      displayEmpty
                      disabled={loadingGrnId === grn._id}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>  {/* Added "Pending" */}
                      <MenuItem value="OK">OK</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No GRN data available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={errorMessage ? "error" : "success"}>
          {errorMessage || snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QualityCheckComponent;
