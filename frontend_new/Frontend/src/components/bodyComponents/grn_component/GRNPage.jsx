import React, { useState, useEffect } from "react";
import SideBarComponent from "../../SideBarComponent";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Box, AppBar, Toolbar, IconButton, Drawer, Grid, useMediaQuery, Typography } from "@mui/material";
import GRNComponent from "./grn_component"; // Ensure the import is correct

const GRN = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  // Sample order data (this should be fetched from your API)
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    // Fetch order data from your API
    const fetchOrderData = () => {
      const sampleOrders = [
        {
          id: "1",
          poNumber: "PO-001",
          itemNo: "123",
          description: "Sample Item",
          quantity: 10,
          supplier: "Sample Supplier",
          serialNumber: "SN-123456",
        },
        // Add more sample orders as needed
      ];
      setOrderData(sampleOrders);
    };

    fetchOrderData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {isSmallScreen && (
        <AppBar position="fixed">
          <Toolbar sx={{ height: '80px' }}>
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
          <SideBarComponent />
        </Box>
      </Drawer>

      <Grid container sx={{ mx: 3, p: 3 }}>
        {!isSmallScreen && (
          <Grid item md={2} sx={{ flexShrink: 0 }}>
            <SideBarComponent />
          </Grid>
        )}
        <Grid item xs={isSmallScreen ? 12 : 10}>
          <Grid container sx={{ mx: 3 }}>
            <Grid item xs={12}>
              <GRNComponent orderData={orderData} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GRN;
