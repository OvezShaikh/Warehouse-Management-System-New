import React, { useState, useEffect } from "react";
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
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);
  const navigate = useNavigate();

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

                      <IconButton onClick={handleAvatarClicked} size="small" aria-haspopup="true">
                        <Tooltip title="account settings">
                          <Avatar sx={{ width: { xs: 20, md: 32 }, height: { xs: 25, md: 32 } }}>{userName[0]}</Avatar>
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
