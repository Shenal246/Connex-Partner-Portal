// components/FeaturesAndUsers.js

import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { themeColor } from './theme';
import img4 from '../img/shaml.JPG';
import img5 from '../img/how-to-find-a-business-partner.png';
import { styled, keyframes } from '@mui/system';
import APIConnection from '../../config.js';
import axios from 'axios';
const fadeIn = keyframes``;

// Utility function to convert Buffer to base64
const bufferToBase64 = (buffer) => {
  if (buffer && buffer.data) {
    const binary = String.fromCharCode(...buffer.data);
    return `data:image/jpeg;base64,${btoa(binary)}`;
  }
  return "";
};

const FeaturesAndUsers = () => {

  const [companyMembers, setCompanyMembers] = useState([]);
  const getcompanymembersapi = APIConnection.getcompanymembersapi;

  useEffect(() => {

    const fetchCompanyMembers = async () => {
      try {
        const response = await axios.get(getcompanymembersapi, { withCredentials: true });
        setCompanyMembers(response.data.companymembers);

      } catch (error) {
        console.error('Failed to Load Company Members:', error);
      }
    };

    fetchCompanyMembers();
  }, []);

  return (
    <FeaturesAndUsersContainer>
      <FeatureBox>
        <SectionTypography variant="h6">Upcoming Features</SectionTypography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          - Enhanced user interface for better navigation.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          - Integration with new payment gateways.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          - New analytics dashboard for tracking performance.
        </Typography>
      </FeatureBox>

      <UserBox>
        <SectionTypography variant="h6">Users You May Know</SectionTypography>
        {companyMembers.map((user, index) => (
          <UserCard key={index}>
            <UserImage src={bufferToBase64(user.photo)} alt={user.name} />
            <Typography variant="body1">{user.name}</Typography>
          </UserCard>
        ))}
      </UserBox>

      <PremiumSection>
        <PremiumImage src={img5} alt="Premium Content" />
        <PremiumText variant="body1">
          Discover exclusive content and stay updated with the latest trends!
        </PremiumText>
      </PremiumSection>
    </FeaturesAndUsersContainer>
  );
};

const FeaturesAndUsersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  flex: 1.2,
  padding: theme.spacing(3),
  backgroundColor: themeColor.rowAlternateColor,
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
  marginRight: theme.spacing(2),
  width: '100px'
}));

const UserBox = styled(Box)(({ theme }) => ({
  flex: 0.6,
  padding: theme.spacing(3),
  backgroundColor: themeColor.rowAlternateColor,
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  maxHeight: '250px',
  overflowY: 'scroll',
  height: '250px',
  cursor: 'pointer',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f0f0f0',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#fff',
    borderRadius: '10px',
    '&:hover': {
      background: '#bbb',
    },
  },
}));

const UserCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(0.54),
  padding: theme.spacing(1.5),
  width: '100%',
  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  borderRadius: '6px',
  height: '40px',
  background: '#ffffff',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const UserImage = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  marginRight: theme.spacing(2),
}));

const PremiumSection = styled(Box)(({ theme }) => ({
  flex: 0.8,
  padding: theme.spacing(3),
  backgroundColor: themeColor.premiumBackground,
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  animation: `${fadeIn} 0.5s ease`,
  textAlign: 'center',
  overflow: 'hidden',
}));

const PremiumImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  marginBottom: theme.spacing(2),
  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
}));

const PremiumText = styled(Typography)(({ theme }) => ({
  color: themeColor.color,
  fontSize: '16px',
  marginTop: theme.spacing(1),
  fontWeight: '500',
}));

const SectionTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#000000',
  fontSize: '20px',
  margin: theme.spacing(3, 0),
  textAlign: 'center',
  marginRight: '10px',
}));

export default FeaturesAndUsers;
