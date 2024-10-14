import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { FiBatteryCharging, FiWifi } from "react-icons/fi";
import { Box, Button } from "@mui/material"; 
import { useAuth } from '../AuthContext'; // Import the useAuth hook
import { toast } from 'react-toastify'; // Import toast

const Example = () => {
  return (
    <Box sx={{ display: "grid", placeContent: "center", bgcolor: "#171717", p: 5, m: 5 }}>
      <FloatingPhone />
    </Box>
  );
};

const FloatingPhone = () => {
  return (
    <Box
      sx={{
        transformStyle: "preserve-3d",
        transform: "rotateY(-30deg) rotateX(15deg)",
        bgcolor: "#8b5cf6",
        borderRadius: "24px",
      }}
    >
      <motion.div
        initial={{ transform: "translateZ(8px) translateY(-2px)" }}
        animate={{ transform: "translateZ(32px) translateY(-8px)" }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 2, ease: "easeInOut" }}
        style={{
          height: "24rem",
          width: "14rem",
          borderRadius: "24px",
          borderWidth: "2px",
          borderBottomWidth: "4px",
          borderRightWidth: "4px",
          borderColor: "#ffffff",
          backgroundColor: "#0f0f0f",
          padding: "8px",
          position: "relative",
        }}
      >
        <HeaderBar />
        <Screen />
      </motion.div>
    </Box>
  );
};

const HeaderBar = () => {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "10px",
          width: "64px",
          height: "8px",
          bgcolor: "#171717",
          borderRadius: "4px",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      />
      <Box sx={{ position: "absolute", right: "12px", top: "10px", display: "flex", gap: "8px", zIndex: 10 }}>
        <FiWifi style={{ color: "#52525b" }} />
        <FiBatteryCharging style={{ color: "#52525b" }} />
      </Box>
    </>
  );
};

const Screen = () => {
  const { isLoggedIn } = useAuth(); // Use context to get login state
  const navigate = useNavigate(); // Hook for navigation

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      navigate('/home'); // Redirect to home if logged in
    } else {
      toast.error("Please log in to get started!"); // Show toast if not logged in
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        placeContent: "center",
        height: "100%",
        width: "100%",
        bgcolor: "#ffffff",
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        width="50"
        height="39"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fill: "#8b5cf6" }}
      >
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
      </svg>

      <Button
        variant="contained"
        onClick={handleGetStartedClick} // Call the click handler
        sx={{
          position: "absolute",
          bottom: "32px",
          left: "16px",
          right: "16px",
          bgcolor: "#ffffff",
          color: "#8b5cf6",
          textTransform: "none",
          borderRadius: "8px",
          zIndex: 10
        }}
      >
        Get Started
      </Button>

      <Box
        sx={{
          position: "absolute",
          bottom: "-18rem",
          left: "50%",
          width: "24rem",
          height: "24rem",
          borderRadius: "50%",
          bgcolor: "#8b5cf6",
          transform: "translateX(-50%)",
        }}
      />
    </Box>
  );
};

export default Example;
