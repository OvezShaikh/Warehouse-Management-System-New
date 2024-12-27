import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Box,
  Typography,
  Button,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  FormControl,
  Input,
  TextField,
} from "@mui/material";
import SideBarComponent from "../../SideBarComponent";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../AuthContext";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mui/material";

const MasterListUpload = () => {
  const { token, userRole } = useAuth();
  const [file, setFile] = useState(null);
  const [itemNos, setItemNos] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [manualItem, setManualItem] = useState("");
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  if (userRole !== "admin") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          bgcolor: "#f8d7da", // Light red background (error type)
          color: "#721c24", // Dark red text color (error type)
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          You do not have permission to access this page.
        </Typography>
      </Box>
    );
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/masterlist/upload-master-list`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Master list uploaded successfully!");
      fetchItemNos();
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload master list.");
    }
  };

  const fetchItemNos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/masterlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItemNos(response.data.itemNos || []);
    } catch (error) {
      console.error("Failed to fetch itemNos", error);
      toast.error("Failed to load item numbers from master list.");
    }
  };

  const handleManualAdd = async () => {
    if (!manualItem.trim()) {
      toast.error("Please enter a valid item number.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/masterlist/add-item`,
        { itemNo: manualItem },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Item added successfully!");
      setManualItem("");
      fetchItemNos();
    } catch (error) {
      console.error("Failed to add item", error);
      toast.error("Failed to add item.");
    }
  };

  useEffect(() => {
    fetchItemNos();
  }, []);

  return (
    <Box sx={{ p: 6  }}>
      {/* AppBar for mobile */}
      {isSmallScreen && (
        <AppBar position="fixed">
          <Toolbar sx={{ height: "64px" }}>
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginLeft: 2 }}>
              Master List Upload
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
          <SideBarComponent />
        </Box>
      </Drawer>

      {/* Main Layout */}
      <Grid container spacing={2} sx={{ mx: 3, p: 3 }}>
        {/* Sidebar Section for Desktop */}
        {!isSmallScreen && (
          <Grid item md={2} sx={{ flexShrink: 0 }}>
            <SideBarComponent />
          </Grid>
        )}

        {/* Main Content */}
        <Grid item md={10} xs={12} container spacing={2}>
          {/* Left Side: Upload and Add Item */}
          <Grid item md={8} xs={12} container direction="column" spacing={2}>
            {/* Upload Section */}
            <Grid item>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  padding: 3,
                  boxShadow: 3,
                   maxHeight: "200px",
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                  Upload Master List
                </Typography>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    inputProps={{ accept: ".xls,.xlsx" }}
                  />
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleUpload}>
                  Upload
                </Button>
              </Box>
            </Grid>

            {/* Manual Add Section */}
            <Grid item>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  padding: 3,
                  boxShadow: 3,
                   maxHeight: "200px",
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                  Add Item Manually
                </Typography>
                <TextField
                  label="Item Number"
                  variant="outlined"
                  fullWidth
                  value={manualItem}
                  onChange={(e) => setManualItem(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <Button variant="contained" color="secondary" onClick={handleManualAdd}>
                  Add Item
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Right Side: Item Numbers */}
          <Grid item md={4} xs={12}>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                padding: 3,
                boxShadow: 3,
                maxHeight: "580px",
                overflowY: "auto",
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                Item Numbers
              </Typography>
              {itemNos.length > 0 ? (
                <Box>
                  {itemNos.map((itemNo, index) => (
                    <Typography key={index} sx={{ marginBottom: 1 }}>
                      {itemNo}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography>No item numbers available.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MasterListUpload;
