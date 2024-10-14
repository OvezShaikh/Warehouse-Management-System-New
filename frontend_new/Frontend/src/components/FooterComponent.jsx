import React from 'react';
import {  Box, Typography, Link, Grid } from '@mui/material';

const Footer = ({ companyName = "Your Company", links = [], socialLinks = [] }) => {
  return (
    <Grid container 
      sx={{
        backgroundColor: 'primary.main', 
        padding: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Typography 
        variant="body1" 
        color="primary.contrastText" 
        sx={{ marginBottom: { xs: 2, md: 0 } }}
      >
        &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: { xs: 2, md: 3 }, 
          marginBottom: { xs: 1, md: 0 },
        }}
      >
        {links.map((link, index) => (
          <Link key={index} href={link.href} color="secondary" sx={{ textDecoration: 'none', color: 'white' }}>
            {link.label}
          </Link>
        ))}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 4 }}>
        {socialLinks.map((social, index) => (
          <Link key={index} href={social.href} aria-label={social.label}>
            {React.isValidElement(social.icon) ? (
              React.cloneElement(social.icon, { style: { color: 'white', width: 26, height: 26 } }) // Customize icon styles
            ) : (
              <img src={social.icon} alt={social.label} style={{ width: 26, height: 26 }} />
            )}
          </Link>
        ))}
      </Box>
    </Grid>
  );
};

export default Footer;
