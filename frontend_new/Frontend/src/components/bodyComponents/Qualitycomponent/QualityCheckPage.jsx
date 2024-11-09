import React, { useState, useEffect } from "react";
import SideBarComponent from "../../SideBarComponent";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Box, AppBar, Toolbar, IconButton, Drawer, Grid, useMediaQuery } from "@mui/material";
import QualityCheckComponent from "./QualityCheckComponent"; // Ensure the import is correct

const QualityCheck = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  // Sample quality check data (this should be fetched from your API)
  const [qualityCheckData, setQualityCheckData] = useState([]);

  useEffect(() => {
    // Fetch quality check data from your API
    const fetchQualityCheckData = () => {
      const sampleQualityChecks = [
        {
          id: "1",
          grnId: "GRN-001",
          status: "OK",
          remarks: "Quality is acceptable",
        },
        // Add more sample quality check data as needed
      ];
      setQualityCheckData(sampleQualityChecks);
    };

    fetchQualityCheckData();
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
              <QualityCheckComponent qualityCheckData={qualityCheckData} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QualityCheck;
