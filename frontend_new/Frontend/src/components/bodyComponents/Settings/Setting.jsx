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
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
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



        const savedCurrentPassword = localStorage.getItem('currentPassword');
        if (savedCurrentPassword) {
          setUserData((prevData) => ({
            ...prevData,
            currentPassword: savedCurrentPassword,
          }));
        }


      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);  // Empty dependency array means this runs only once when the component mounts

  const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  setUserData((prevData) => {
    const updatedData = {
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    };

    // If the 'currentPassword' field is being updated, save it to localStorage
    if (name === 'currentPassword') {
      localStorage.setItem('currentPassword', value);
    }

    return updatedData;
  });
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
      if (!croppedAreaPixels) {
        toast.error('Please select a valid crop area.');
        return;
      }
      const croppedImageUrl = await getCroppedImg(file, croppedAreaPixels);
      setCroppedImage(croppedImageUrl);

      // Close the crop dialog after the image is cropped
      setOpenCropDialog(false);
    } catch (e) {
      console.error('Error cropping image:', e);
      toast.error('Failed to crop the image.');
    }
  }, [file, croppedAreaPixels]);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    if (userData.newPassword && userData.newPassword !== userData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('bio', userData.bio);
      formData.append('currentPassword', userData.currentPassword);
      if (userData.newPassword) {
        formData.append('newPassword', userData.newPassword);
      }
  
      if (croppedImage) {
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        formData.append(
          'profilePicture',
          new File([blob], `${userData.username}_profile.jpg`, { type: 'image/jpeg' })
        );
      }
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/settings/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      toast.success(response.data.message || 'Profile updated successfully!');
      setUserData((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture || prev.profilePicture,
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage =
        error.response?.data?.message || 'Error updating profile. Please try again.';
      toast.error(errorMessage);
    }
  };
  

  const togglePasswordVisibility = (field) => {
    if (field === 'current') {
      setShowCurrentPassword((prev) => !prev);
    } else if (field === 'new') {
      setShowNewPassword((prev) => !prev);
    } else if (field === 'confirm') {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#DEE3E9', padding: 6, margin: 4 , display: 'flex'}}>
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
            <div className='flex justify-center flex-col items-center m-10'>
              <Typography variant="h6" gutterBottom>{userData.username}'s Profile</Typography>
              {userData.profilePicture ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/${userData.profilePicture.replace('\\', '/')}`}
                  alt="Profile"
                  style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : <Typography>No profile picture</Typography>}
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '20px' }} />
            </div>

            {/* Cropping dialog */}
            {openCropDialog && (
              <Box sx={{ position: 'relative', top: '20%', left: '50%', transform: 'translateX(-50%)', zIndex: 999,width: '50vw',maxWidth: '500px',height: '60vh',maxHeight: '500px', }}>
                <Cropper
                  image={file}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
                <Button variant="contained" onClick={showCroppedImage}>Crop</Button>
              </Box>
            )}

            {/* Form fields */}
            <TextField label="Username" name="username" value={userData.username} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Email" name="email" value={userData.email} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Bio" name="bio" value={userData.bio} onChange={handleInputChange} fullWidth margin="normal" multiline rows={4} />

            <Typography variant="h6" gutterBottom>Change Password</Typography>
            <TextField
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={userData.currentPassword}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => togglePasswordVisibility('current')}>
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={userData.newPassword}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => togglePasswordVisibility('new')}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Button
              variant="contained"
              onClick={handleSaveChanges}
              sx={{ mt: 3 }}
            >
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
