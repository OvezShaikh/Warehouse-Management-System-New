import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage'; // Import the cropping utility
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [openCropDialog, setOpenCropDialog] = useState(false);
  const navigate = useNavigate();

  // Handle file change and open crop dialog
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
      setOpenCropDialog(true);
    }
  };

  // Capture the crop area
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Show the cropped image as a blob
  const showCroppedImage = useCallback(async () => {
    try {
      if (!croppedAreaPixels) {
        setError('Please select a valid crop area.');
        return;
      }

      const croppedImageUrl = await getCroppedImg(file, croppedAreaPixels);
      setCroppedImage(croppedImageUrl);

      // Close the crop dialog after the image is cropped
      setOpenCropDialog(false);

    } catch (e) {
      console.error('Error cropping image:', e);
      setError('Failed to crop the image.');
    }
  }, [file, croppedAreaPixels]);

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!username || !email || !password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      // Create FormData to send cropped image along with registration data
      const formData = new FormData();

      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
     

      if (croppedImage) {
        // Convert the cropped image URL to Blob
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const fileName = `${username}_profile.jpg`;
        formData.append('profilePicture', new File([blob], fileName, { type: 'image/jpeg' }));
        
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      localStorage.setItem('token', data.token); // Save the token
      console.log('Token:', data.token);

      setLoading(false);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          label="Username"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          fullWidth
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          sx={{ mb: 3 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />

        {/* Role Selection */}
        <Select
          label="Role"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>

        {/* Profile Picture Upload */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Profile Picture
        </Typography>
        <input style={{margin: '10px'}} type="file" onChange={handleFileChange} />
        {croppedImage && (
          <div>
            <img src={croppedImage} alt="Cropped" style={{ width: '100%', marginTop: '10px' }} />
          </div>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Paper>

      {/* Crop Image Dialog */}
      <Dialog open={openCropDialog} onClose={() => setOpenCropDialog(false)}>
        <DialogTitle>Crop Profile Picture</DialogTitle>
        <DialogContent>
          <div style={{ position: 'relative', width: '100%', height: 400 }}>
            <Cropper
              image={file}
              crop={crop}
              zoom={zoom}
              aspect={1} // Square aspect ratio for profile pictures
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCropDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={showCroppedImage} color="primary">
            Crop & Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}