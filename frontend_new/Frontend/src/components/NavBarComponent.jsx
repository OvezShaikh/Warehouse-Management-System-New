import React from "react";
import {
  Box,
  Grid,
  AppBar,
  Container,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import {
  NotificationsOutlined,
  Settings,
  Logout,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { Link } from 'react-router-dom';
import images from "../constants/images";


export default function NavBarComponent() {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

  const handleAvatarClicked = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClicked = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notificationHandleClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogin = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token in local storage
      // You can set user data in state if needed
    } else {
      // Handle error
      alert('Login failed');
    }
  };
  
  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    localStorage.removeItem('token'); // Remove token on logout
    // Optionally, redirect to login page or update state
  };

  return (
    <Grid container sx={{ width: '100%' }}>
      <Grid item xs={12}>
        <Paper elevation={4}>
          <AppBar sx={{ padding: 1 }} position="static"> {/* Reduced padding for smaller screens */}
            <Container maxWidth="xxl">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img
                    src={images.UnostarLogo}
                    alt="Unostar Logo"
                    style={{
                      height: 'auto',
                      width: '100%', // Makes it responsive in terms of width
                      maxWidth: '250px', // Sets a maximum width for larger screens
                      maxHeight: '60px', // Maximum height for larger screens
                      objectFit: 'contain',
                    }}
                  />
                </Link>

                {/* Icons Section */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: { xs: 0, md: 2 }, // Add gap between icons
                    mt: { xs: 0, md: 0 }, // No margin on mobile
                  }}
                >
                  <IconButton color="inherit" onClick={handleNotificationClicked}>
                    <Badge variant="dot" color="error" invisible={false}>
                      <NotificationsOutlined
                        sx={{ width: { xs: 20, md: 32 }, height: { xs: 20, md: 32 } }} // Reduce size for extra small screens
                      />
                    </Badge>
                  </IconButton>

                  {/* Notification Menu */}
                  <Menu
                    open={notificationOpen}
                    anchorEl={notificationAnchorEl}
                    onClose={notificationHandleClose}
                  >
                    <MenuItem>Notification number 1</MenuItem>
                    <Divider />
                    <MenuItem>Notification number 2</MenuItem>
                    <MenuItem>Notification number 3</MenuItem>
                  </Menu>

                  <IconButton
                    onClick={handleAvatarClicked}
                    size="small"
                    aria-haspopup="true"
                  >
                    <Tooltip title="account settings">
                      <Avatar sx={{ width: { xs: 20, md: 32 }, height: { xs: 25, md: 32 } }}>Z</Avatar>
                    </Tooltip>
                  </IconButton>

                  {/* Username for larger screens */}
                  <Typography
                    sx={{
                      display: { xs: 'none', md: 'block' }, // Hide username on extra small screens
                    }}
                    fontFamily={"Inter"}
                  >
                    ADMI ZAKARYAE
                  </Typography>
                </Box>

                {/* Avatar Menu */}
                <Menu
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <AccountCircleOutlined fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Container>
          </AppBar>
        </Paper>
      </Grid>
    </Grid>
  );
}
