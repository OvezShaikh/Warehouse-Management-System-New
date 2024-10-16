import React, { useState } from "react";
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
  Button,
} from "@mui/material";
import {
  NotificationsOutlined,
  Settings,
  Logout,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from 'react-router-dom';
import images from "../constants/images";
import { useAuth } from '../AuthContext'; // Import the useAuth hook

export default function NavBarComponent() {
  const { isLoggedIn, userName, logout } = useAuth(); // Use context
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // State for notification dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [servicesAnchorEl, setServicesAnchorEl] = useState(null); // State for the Services dropdown
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl); // State for notification menu open
  const servicesOpen = Boolean(servicesAnchorEl); // State to track dropdown state
  const navigate = useNavigate();

  const handleAvatarClicked = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClicked = (event) => {
    setNotificationAnchorEl(event.currentTarget); // Open notification menu
  };

  const handleServicesClicked = (event) => {
    setServicesAnchorEl(event.currentTarget); // Open services dropdown
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notificationHandleClose = () => {
    setNotificationAnchorEl(null); // Close notification menu
  };

  const servicesHandleClose = () => {
    setServicesAnchorEl(null); // Close services dropdown
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    logout(); // Use the logout function from context
    navigate('/'); // Redirect after logout
  };

  const handleSettingsClick = () => {
    navigate('/settings'); // Adjust the path based on your routing setup
  };

  return (
    <Grid container sx={{ width: '100%' }}>
      <Grid item xs={12}>
        <Paper elevation={4}>
          <AppBar sx={{ padding: 1 }} position="static">
            <Container maxWidth="xxl">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img
                    src={images.UnostarLogo}
                    alt="Unostar Logo"
                    style={{
                      height: 'auto',
                      width: '100%',
                      maxWidth: '250px',
                      maxHeight: '60px',
                      objectFit: 'contain',
                    }}
                  />
                </Link>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: { xs: 0, md: 2 },
                    mt: { xs: 0, md: 0 },
                  }}
                >
                  {isLoggedIn ? (
                    <>
                      <IconButton color="inherit" onClick={handleNotificationClicked}>
                        <Badge variant="dot" color="error" invisible={false}>
                          <NotificationsOutlined
                            sx={{ width: { xs: 20, md: 32 }, height: { xs: 20, md: 32 } }}
                          />
                        </Badge>
                      </IconButton>

                      {/* Notification Dropdown Menu */}
                      <Menu
                        open={notificationOpen}
                        anchorEl={notificationAnchorEl}
                        onClose={notificationHandleClose}
                        PaperProps={{
                          sx: {
                            backgroundColor: '#f0f4ff', // Light blue background
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
                            borderRadius: '8px',
                          },
                        }}
                        MenuListProps={{
                          sx: { padding: 0 },
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            notificationHandleClose();
                            // navigate("/notification-1");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          Notification number 1
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={() => {
                            notificationHandleClose();
                            // navigate("/notification-2");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          Notification number 2
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={() => {
                            notificationHandleClose();
                            // navigate("/notification-3");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          Notification number 3
                        </MenuItem>
                      </Menu>

                      {/* Services Dropdown */}
                      <Button
                        onClick={handleServicesClicked}
                        sx={{
                          fontSize: { xs: '0.875rem', md: '1.0rem' },
                          color: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        Services
                      </Button>

                      <Menu
                        open={servicesOpen}
                        anchorEl={servicesAnchorEl}
                        onClose={servicesHandleClose}
                        PaperProps={{
                          sx: {
                            backgroundColor: '#f0f4ff', // Light blue background
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
                            borderRadius: '8px',
                          },
                        }}
                        MenuListProps={{
                          sx: { padding: 0 },
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            servicesHandleClose();
                            navigate("/in-plant-logistics");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          In-plant Logistics
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            servicesHandleClose();
                            navigate("/transportations");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          Transportations
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            servicesHandleClose();
                            navigate("/vmi");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          Vendor Managed Inventory (VMI)
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            servicesHandleClose();
                            navigate("/after-market-warehouse");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          AFTER MARKET WAREHOUSE (SPARE PART)
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            servicesHandleClose();
                            navigate("/value-added-services");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          VALUE ADDED SERVICES
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            servicesHandleClose();
                            navigate("/supply-chain-design");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          SUPPLY CHAIN DESIGN & RE-ENGINEERING
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            servicesHandleClose();
                            navigate("/invest-and-operate");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          INVEST AND OPERATE
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            servicesHandleClose();
                            navigate("/people-management");
                          }}
                          sx={{
                            color: '#0a2e5c',
                            padding: '12px 24px',
                            '&:hover': { backgroundColor: '#d9e4ff' },
                            '&:focus': { backgroundColor: '#a3c4ff', color: '#fff' },
                          }}
                        >
                          PEOPLE MANAGEMENT(EXECUTIVE)
                        </MenuItem>
                      </Menu>

                      <IconButton onClick={handleAvatarClicked} size="small" aria-haspopup="true">
                        <Tooltip title="account settings">
                          <Avatar sx={{ width: { xs: 20, md: 32 }, height: { xs: 25, md: 32 } }}>
                            {userName[0]}
                          </Avatar>
                        </Tooltip>
                      </IconButton>

                      <Typography
                        sx={{
                          display: { xs: 'none', md: 'block' },
                        }}
                        fontFamily={"Inter"}
                      >
                        {userName}
                      </Typography>

                      <Menu
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                      >
                        <MenuItem component={Link} to="/profile">
                          <ListItemIcon>
                            <AccountCircleOutlined fontSize="small" />
                          </ListItemIcon>
                          Profile
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleSettingsClick}>
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
                    </>
                  ) : (
                    <>
                      <Button color="inherit" component={Link} to="/login">
                        Login
                      </Button>
                      <Button color="inherit" component={Link} to="/register">
                        Register
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Container>
          </AppBar>
        </Paper>
      </Grid>
    </Grid>
  );
}
