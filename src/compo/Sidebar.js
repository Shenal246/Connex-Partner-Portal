// src/compo/Sidebar.js

import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import {
  Dashboard,
  Assignment,
  List as ListIcon,
  AdminPanelSettings,
  AddCircle,
  AccountCircle,
  Logout,
  Home as HomeIcon,
  LocalMall as ProductIcon,
  Campaign as PromotionIcon,
  Description as DealRegistrationIcon,
  Event as EventsIcon,
  VideoLibrary as VideosIcon,
} from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import LogoImage from './img/ConnexIT.png';
import CopyrightLogo from './img/image.png'; // Import your company logo
import axios from 'axios';
import APIConnection from '../config';

// Define theme colors with a modern look
const themeColors = {
  sidebarBg: 'linear-gradient(to bottom, #021040, #444444)', // Updated gradient for a modern look
  buttonBg: '#444444', // Consistent button background
  buttonText: '#ffffff', // Text color for contrast
  hoverBg: '#555555', // Hover effect color
  borderColor: '#222222', // Border color for dividing sections
  logoBg: 'rgba(240, 248, 255, 0.1)', // Background for logo area
  footerBg: '#333333', // Footer background
};

// Define styled components
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '220px', // Fixed width
  height: '100vh', // Full height
  background: themeColors.sidebarBg, // Sidebar background gradient
  color: themeColors.buttonText, // Text color
  display: 'flex', // Flex container
  flexDirection: 'column', // Column layout
  boxShadow: theme.shadows[3], // Box shadow for depth
  borderRight: `1px solid ${themeColors.borderColor}`, // Right border
  overflowY: 'auto', // Scrollable content
  position: 'fixed', // Fixed position
  top: 0, // Align to top
  left: 0, // Align to left
  margin: 0, // No margin
  padding: 0, // No padding
  zIndex: 1200, // High z-index
  transition: 'transform 0.3s ease-in-out', // Transition effect
  [theme.breakpoints.down('sm')]: {
    transform: 'translateX(-100%)', // Off-screen on mobile
    '&.active': {
      transform: 'translateX(0)', // Slide in when active
    },
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2), // Spacing for content
  display: 'flex', // Flexbox
  alignItems: 'center', // Center items
  justifyContent: 'center', // Center content
  backgroundColor: themeColors.logoBg, // Background color
  borderBottom: `1px solid ${themeColors.borderColor}`, // Bottom border
  margin: 0, // No margin
}));

const LogoImageStyled = styled('img')({
  height: '60px', // Adjusted logo height
  width: 'auto', // Maintain aspect ratio
  transition: 'transform 0.2s', // Smooth transition
  '&:hover': {
    transform: 'scale(1.1)', // Scale effect on hover
  },
});

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '4px', // Rounded corners
  width: '90%', // Full width with margin
  margin: '5px auto', // Center with margin
  padding: '5px 12px', // Padding for button
  height: '35px', // Fixed height for buttons
  alignItems: 'center', // Center alignment
  backgroundColor: themeColors.buttonBg, // Background color
  color: themeColors.buttonText, // Text color
  '&:hover': {
    backgroundColor: themeColors.hoverBg, // Hover background
    transform: 'scale(1.03)', // Slight scale on hover
    boxShadow: theme.shadows[2], // Shadow on hover
  },
  '& .MuiListItemIcon-root': {
    minWidth: '35px', // Icon container width
    color: themeColors.buttonText, // Icon color
    marginRight: '8px', // Spacing between icon and text
  },
  '& .MuiListItemText-primary': {
    color: themeColors.buttonText, // Text color
    fontSize: '14px', // Font size for readability
    fontWeight: 400, // Normal font weight
    fontFamily: "'Roboto', sans-serif", // Font family
  },
}));

const CopyrightContainer = styled(Box)(({ theme }) => ({
  marginTop: 'auto', // Push to bottom
  padding: theme.spacing(2), // Padding for content
  textAlign: 'center', // Center alignment
  backgroundColor: themeColors.footerBg, // Background color
  borderTop: `1px solid ${themeColors.borderColor}`, // Top border
  color: themeColors.buttonText, // Text color
  display: 'flex', // Flexbox
  justifyContent: 'center', // Center content
  alignItems: 'center', // Center items
}));

const CopyrightLogoStyled = styled('img')({
  height: '60px', // Adjusted logo height
  width: 'auto', // Maintain aspect ratio
  opacity: '0.75', // Transparency effect
  borderRadius: '10px', // Rounded corners
  transition: 'opacity 0.3s', // Transition effect
  '&:hover': {
    opacity: '1', // Full opacity on hover
  },
});


// Sidebar component
const Sidebar = () => {

  const [privileges, setPrivileges] = useState([]);
  const getPrivilegesApi = APIConnection.getPrivileges;

  useEffect(() => {
    const getPrivilegesFunction = async () => {
      try {
        const response = await axios.get(getPrivilegesApi, { withCredentials: true });
        setPrivileges(response.data.Privileges);
      } catch (error) {
        console.error('Error fetching privileges:', error);
      }
    };

    getPrivilegesFunction();
  }, []);

  const hasPrivilege = (privilege) => privileges.includes(privilege);

  // Navigation items array
  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/dashboard', privilege: 'Partner - Dashboard' },
    { text: 'Product', icon: <ProductIcon />, path: '/product', privilege: 'Partner - Product' },
    { text: 'Promotion', icon: <PromotionIcon />, path: '/promotion', privilege: 'Partner - Promotion' },
    { text: 'Deal Registration', icon: <DealRegistrationIcon />, path: '/deal-registration', privilege: 'Partner - Deal Registration' },
    { text: 'Events & Videos', icon: <EventsIcon />, path: '/ctb', privilege: 'Partner - Events & Videos' },
    { text: 'Tech Alliance', icon: <BuildIcon />, path: '/techalliance', privilege: 'Partner - Tech Alliance' },
    { text: 'MDF Orders', icon: <CurrencyExchangeIcon />, path: '/mdf', privilege: 'Partner - MDF Orders' },
    { text: 'Connex Circle', icon: <TripOriginIcon />, path: '/connexcircle', privilege: 'Partner - Connex Circle' },
    { text: 'Access Control', icon: <VpnKeyIcon />, path: '/partner-access-management', privilege: 'Partner - Access Management' },
    // { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImageStyled src={LogoImage} alt="Logo" sx={{ padding: '10px' }} />
      </LogoContainer>
      <Divider sx={{ bgcolor: themeColors.borderColor }} />
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: 'center',
          fontWeight: 500,
          color: themeColors.buttonText,
          py: 1,
          fontSize: '13px',
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        Partner Services
      </Typography>
      <Divider sx={{ bgcolor: themeColors.borderColor }} />
      <List>
        {navItems.filter(item => hasPrivilege(item.privilege)).map((item, index) => (
          <StyledListItem
            button
            component={item.path ? Link : 'div'}
            to={item.path || undefined}
            key={index}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: themeColors.borderColor }} />
      <CopyrightContainer>
        <CopyrightLogoStyled src={CopyrightLogo} alt="Company Logo" />
      </CopyrightContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
