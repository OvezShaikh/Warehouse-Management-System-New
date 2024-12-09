import React, { useState, useEffect } from "react";
import { Box, Grid, AppBar, Toolbar, IconButton, Drawer, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import RevenueCard from "../revenue/RevenueCard";
import VisitorsGrowthCharts from "./VisitorsGrowthCharts";
import ProductsGrowthCharts from "./ProductsGrowthCharts";
import CustomersGrowthCharts from "./CustomersGrowthCharts";
import SalesGrowthCharts from "./SalesGrowthCharts";
import SideBarComponent from "../../SideBarComponent";
import axios from "axios";

const Growth = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revenuCardsData, setRevenuCardsData] = useState([]); // State for dynamic revenue cards
  const [totalVisitors, setTotalVisitors] = useState(0); // State for total visitors
  const [grnData, setGrnData] = useState([]); // State to store GRN data
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [userData, setUserData] = useState([]);


  // Function to record visitor status (active or bounce)
  const recordVisitor = async (status) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/visitors`, { status });
      console.log('Visitor recorded:', status);
    } catch (error) {
      console.error('Error recording visitor:', error);
    }
  };

  // Fetch the total visitors count when the component mounts
  useEffect(() => {
    const fetchTotalVisitors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/visitors/active`);
        setTotalVisitors(response.data.activeVisitors); // Set the active visitors count
      } catch (error) {
        console.error("Error fetching total visitors:", error);
      }
    };

    fetchTotalVisitors();
  }, []); // Only run once when the component mounts

  // const revenuCards = [
  //   {
  //     isMoney: false,
  //     number: "330",
  //     percentage: 11,
  //     upOrDown: "down",
  //     color: "red",
  //     title: "Orders Per Month",
  //     subTitle: "vs prev month",
  //   },
  //   {
  //     isMoney: false,
  //     number: "109",
  //     percentage: 35,
  //     upOrDown: "up",
  //     color: "green",
  //     title: "Total Customer",
  //     subTitle: "vs prev year",
  //   },
  //   {
  //     isMoney: false,
  //     number: "607",
  //     percentage: 10,
  //     upOrDown: "up",
  //     color: "green",
  //     title: "Total Product",
  //     subTitle: "vs prev month",
  //   },
  //   {
  //     isMoney: false,
  //     number: totalVisitors, // Dynamic total visitors count
  //     percentage: "30",
  //     title: "Total Visitors",
  //     color: "green",
  //     subTitle: "vs prev week",
  //   },
  // ];

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
      const data = response.data;

      const totalGRNs = data.grns.length; // Total GRNs
      console.log(data.grns.length, "grns length");
      const totalItems = data.grns.reduce((sum, grn) => sum + (Array.isArray(grn.items) ? grn.items.length : 0), 0);
      const pendingGRNs = data.grns.filter(grn => grn.status === "Pending").length; // Pending GRNs
      const uniqueSuppliers = [...new Set(data.grns.map(grn => grn.supplier))].length; // Unique suppliers

      // Map API data to revenue card format
      const dynamicCards = [
        {
          isMoney: false,
          number: totalGRNs,
          percentage: (totalGRNs / (data.total || 1)) * 100, // Example percentage logic
          upOrDown: "up",
          color: "green",
          title: "Total GRNs",
          subTitle: "vs last month",
        },
        {
          isMoney: false,
          number: totalItems,
          percentage: (totalItems / 100) * 10, // Example logic for item growth
          upOrDown: "up",
          color: "green",
          title: "Total Items",
          subTitle: "this month",
        },
        {
          isMoney: false,
          number: pendingGRNs,
          percentage: (pendingGRNs / totalGRNs || 0) * 100, // Pending percentage
          upOrDown: "down",
          color: "red",
          title: "Pending GRNs",
          subTitle: "Awaiting completion",
        },
        {
          isMoney: false,
          number: uniqueSuppliers,
          percentage: uniqueSuppliers * 10, // Example supplier growth logic
          upOrDown: "up",
          color: "green",
          title: "Suppliers",
          subTitle: "Active this month",
        },
      ];

      setRevenuCardsData(dynamicCards);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);



  const fetchGRNData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
      setGrnData(response.data); // Set the fetched GRN data
      console.log(response.data, "This is grn data received in growth component.............")
    } catch (error) {
      console.error("Error fetching GRN data:", error);
    }
  };

  useEffect(() => {
    fetchGRNData(); // Fetch GRN data on component mount
  }, []); // Empty dependency array to run only once

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
  //       setUserData(response.data.users); // Assuming response.data.users contains the user data
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  return (
    <Box sx={{p : 8}}>
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

      <Grid container sx={{ p: 3 }}>
        {!isSmallScreen && (
          <Grid item lg={2} md={3} sx={{ flexShrink: 0 }}>
            <SideBarComponent />
          </Grid>
        )}

        <Grid item xs={12} md={9} lg={10} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* Revenue Cards Section */}
          <Grid item xs={12}>
            <Box sx={{ margin: 3 }}>
              <Grid container spacing={1}>
                {revenuCardsData.map((card, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box m={2}>
                      <RevenueCard card={card} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Growth Charts Section */}
          <Grid item xs={12} sm={12} md={6} sx={{ mb: 3 }}>
            <Box sx={{ margin: 3, bgcolor: "white", borderRadius: 2, padding: 3, height: "100%", boxShadow: 3 }}>
              <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
                Sales Growth
              </Typography>
              <SalesGrowthCharts />
            </Box>
          </Grid>

          {/* <Grid item xs={12} sm={12} md={6} sx={{ mb: 3 }}>
            <Box sx={{ margin: 3, bgcolor: "white", borderRadius: 2, padding: 3, height: "100%", boxShadow: 3 }}>
              <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
                Visitors Growth
              </Typography>
              <VisitorsGrowthCharts recordVisitor={recordVisitor} />
            </Box>
          </Grid> */}

          <Grid item xs={12} sm={12} md={6} sx={{ mb: 3 }}>
            <Box sx={{ margin: 3, bgcolor: "white", borderRadius: 2, padding: 3, height: "100%", boxShadow: 3 }}>
              <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
                Items Growth
              </Typography>
              <ProductsGrowthCharts grnData={grnData}/>
            </Box>
          </Grid>

          {/* <Grid item xs={12} sm={12} md={6} sx={{ mb: 3 }}>
            <Box sx={{ margin: 3, bgcolor: "white", borderRadius: 2, padding: 3, height: "100%", boxShadow: 3 }}>
              <Typography variant="h5" sx={{ marginLeft: "12px", fontWeight: "bold" }}>
                Customers Growth
              </Typography>
              <CustomersGrowthCharts/>
            </Box>
          </Grid> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Growth;
