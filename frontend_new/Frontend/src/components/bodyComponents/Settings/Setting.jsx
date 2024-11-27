import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, TextField, Button, CircularProgress, useMediaQuery, Drawer, IconButton, AppBar, Toolbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from "../../../AuthContext";
import SideBarComponent from '../../SideBarComponent';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../utils/cropImage'; // Import the cropping utility

export default function SettingsPage() {
  const { login, isLoggedIn, loading } = useAuth();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newProfilePicture: null, // New state for the profile picture
  });
  const [tokenData, setTokenData] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [file, setFile] = useState(null); // File for the profile picture
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [openCropDialog, setOpenCropDialog] = useState(false);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  // Fetch user profile data once when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        navigate('/login');
        return;
      }
      try {
        const decoded = jwtDecode(token);
        setTokenData(decoded);

        // Fetch user profile information from the server
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData((prevData) => ({
          ...prevData,
          username: response.data.username || '',
          email: response.data.email || '',
          bio: response.data.bio || '',
          profilePicture: response.data.profilePicture || '',
        }));

      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          logout();
          navigate('/login');
        }
      }
    };
    fetchUserProfile();
  }, []); // Empty dependency array means this runs only once when the component mounts

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
      setOpenCropDialog(true);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImageUrl = await getCroppedImg(file, croppedAreaPixels);
      setCroppedImage(croppedImageUrl);

      // Close the crop dialog after the image is cropped
      setOpenCropDialog(false);
    } catch (e) {
      console.error('Error cropping image:', e);
      toast.error('Failed to crop the image.');
    }
  }, [file, croppedAreaPixels]);

  // Handle password change logic separately
  const handlePasswordChange = async () => {
    // Validate that new passwords match
    if (userData.newPassword && userData.newPassword !== userData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
  
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token found
      return;
    }
  
    try {
      // Send the PUT request to the backend API
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`, // Backend endpoint
        {
          currentPassword: userData.currentPassword, // Data sent in the body
          newPassword: userData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token for authentication
          },
        }
      );
  
      // Show success message and reset password fields
      toast.success(response.data.message || 'Password updated successfully!');
      setUserData((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  
      // Optional: Re-login if required by backend
      // await login(userData.email, userData.newPassword);
      // navigate('/home'); // Redirect after successful update if required
    } catch (error) {
      console.error('Error updating password:', error);
  
      // Show appropriate error messages
      const errorMessage = error.response?.data?.message || 'Error updating password. Please try again.';
      toast.error(errorMessage);
    }
  };
  

  const togglePasswordVisibility = (field) => {
    if (field === 'current') setShowCurrentPassword((prev) => !prev);
    if (field === 'new') setShowNewPassword((prev) => !prev);
    if (field === 'confirm') setShowConfirmPassword((prev) => !prev);
  };

  if (loading || !isLoggedIn) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#DEE3E9', padding: 6, margin: 4, display: 'flex' }}>
      {/* Sidebar and layout */}
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
      {!isSmallScreen && <SideBarComponent />}

      <Grid container spacing={0}>
        <Grid item md={12} sm={12}>
          <Box sx={{ padding: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <Typography variant="h6" gutterBottom>Profile Information</Typography>
            <div className="flex justify-center flex-col items-center m-10">
              <Typography variant="h6" gutterBottom>
                {userData.username}'s Profile
              </Typography>
              {croppedImage ? ( // Show cropped image preview if available
                <img
                  src={croppedImage}
                  alt="Cropped Profile"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : userData.profilePicture ? ( // Fallback to current profile picture from backend
                <img
                  src={`${import.meta.env.VITE_API_URL}/${userData.profilePicture.replace('\\', '/')}`}
                  alt="Profile"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Typography>No profile picture</Typography>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginTop: '20px' }}
              />
            </div>

            {/* Cropping dialog */}
            {openCropDialog && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '500px',
                  height: '500px',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                <Cropper
                  image={file}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
                <Button onClick={showCroppedImage}>Crop Image</Button>
              </Box>
            )}

            <Box sx={{ marginTop: 3 }}>
              <TextField
                label="Username"
                fullWidth
                variant="outlined"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Email"
                fullWidth
                variant="outlined"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                sx={{ marginBottom: 2 }}
              />
              {/* <TextField
                label="Bio"
                fullWidth
                variant="outlined"
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                sx={{ marginBottom: 2 }}
              /> */}

              {/* Password Change Section */}
              <Typography variant="h6" gutterBottom>Change Password (Functionality Remaining)</Typography>
              <TextField
                label="Current Password"
                fullWidth
                variant="outlined"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={userData.currentPassword}
                onChange={handleInputChange}
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => togglePasswordVisibility('current')}>
                      {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                label="New Password"
                fullWidth
                variant="outlined"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={userData.newPassword}
                onChange={handleInputChange}
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => togglePasswordVisibility('new')}>
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                fullWidth
                variant="outlined"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={userData.confirmPassword}
                onChange={handleInputChange}
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
              <Button variant="contained" color="primary" onClick={handlePasswordChange}>
                Update Password
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
