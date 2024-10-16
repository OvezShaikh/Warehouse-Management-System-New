import React from 'react';
import {  Box, Typography, Link, Grid } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import images from "../constants/images";

const Footer = ({ companyName = "Unostar Value Chain Pvt Ltd", links = [
  { href: '/', label: 'Home' },
  { href: '/about-Us', label: 'About' },
  { href: '/contact-us', label: 'Contact' },],
  socialLinks = [
    { href: 'https://www.linkedin.com/company/unostarvaluechain?originalSubdomain=in', label: 'LinkedIn', icon: <LinkedInIcon /> },
    { href: '#', label: 'Twitter', icon: <TwitterIcon /> },
    { href: '#', label: 'Facebook', icon: <FacebookIcon /> },]

   }) => {

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
      <img src={images.Isologo} className='mr-0'></img>
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
