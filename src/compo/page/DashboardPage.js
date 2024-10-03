// DashboardPage.js

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Swal from 'sweetalert2';
import img1 from '../img/p1.jpg';
import img2 from '../img/p2.jpeg';
import img3 from '../img/p3.jpg';
import img4 from '../img/shaml.JPG';
import img5 from '../img/how-to-find-a-business-partner.png';
import PromotionDialog from './PromotionDialog';
import CarouselSection from './CarouselSection';
import FeaturesAndUsers from './FeaturesAndUsers';
import PromotionsSection from './PromotionsSection';
import { themeColor } from './theme';
import APIConnection from '../../config.js';
import axios from 'axios';

// Keyframes for animations
const blink = keyframes``;

// Define styled components
const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: themeColor.primary,
  fontSize: '18px',
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  background: themeColor.premiumBackground,
  width: '50%',
  padding: '16px',
  borderRadius: '8px',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  position: 'sticky',
  top: 0,
  zIndex: 3,
  animation: `${blink} 2s infinite`,
}));

const Fullname = localStorage.getItem("Fullname");



const DashboardPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [specialPromotions, setSpecialPromotions] = useState([]); // State for promotions with promotiontype_id = 1

  const getpromotiondetailsapi = APIConnection.getpromotiondetailsapi;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(getpromotiondetailsapi, { withCredentials: true });
        const allPromotions = response.data;

        // Filter promotions based on promotiontype_id
        const special = allPromotions.filter(promo => promo.promotiontype_id === 1);

        setSpecialPromotions(special);
      } catch (error) {
        console.error('Failed to Load Promotions:', error);
      }
    };


    fetchPromotions();
  }, []);

  // const carouselImages = [
  //   {
  //     src: img1,
  //     alt: 'Promotion 1',
  //     description: 'Check out our exclusive offers for Promotion 1!',
  //     details: 'This promotion offers a 20% discount on all items in category 1. Valid until 31st August 2024.',
  //   },
  //   {
  //     src: img2,
  //     alt: 'Promotion 2',
  //     description: 'Discover the latest deals with Promotion 2!',
  //     details: 'Get a free shipping voucher with every purchase above $50. Limited time offer.',
  //   },
  //   {
  //     src: img3,
  //     alt: 'Promotion 3',
  //     description: 'Explore the amazing discounts on Promotion 3!',
  //     details: 'Buy one get one free on selected items. Offer ends on 15th September 2024.',
  //   },
  // ];

  const handleRequestClick = (index) => {
    // setSelectedPromotion(carouselImages[index]);
    setOpen(true);
  };


  const handleCheckClick = (index) => {
    navigate('/promotion');
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedPromotion(null);
  };

  return (
    <Container sx={{ padding: 1, overflowY: 'hidden', backgroundColor: '#f8f8f8',alignContent:'center', }}>
      
      <CarouselSection
        specialPromotions={specialPromotions}
        handleRequestClick={handleRequestClick}
        handleCheckClick={handleCheckClick}
      />
           <PromotionDialog
        open={open}
        onClose={handleCloseDialog}
        promotion={selectedPromotion}
      />
     <TitleTypography variant="h6">
      Hello, {Fullname}! We're Excited to Work Together for Success!
      </TitleTypography>
      <FeaturesAndUsers />
     
    </Container>
  );
};

export default DashboardPage;
