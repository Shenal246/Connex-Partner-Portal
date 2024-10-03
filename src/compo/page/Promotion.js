import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Swal from 'sweetalert2';
import img1 from '../img/p1.jpg';
import img2 from '../img/p2.jpeg';
import img3 from '../img/p3.jpg';
import PromotionDialog from './PromotionDialog';
import CarouselSection from './CarouselSectionpromo';
import PromotionsSection from './PromotionsSection';
import FeaturesAndUsers from './FeaturesAndUsers';
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


const DashboardPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [specialPromotions, setSpecialPromotions] = useState([]); // State for promotions with promotiontype_id = 1
  const [normalPromotions, setNormalPromotions] = useState([]); // State for promotions with promotiontype_id = 2

  const getpromotiondetailsapi = APIConnection.getpromotiondetailsapi;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(getpromotiondetailsapi, { withCredentials: true });
        const allPromotions = response.data;

        // Filter promotions based on promotiontype_id
        const special = allPromotions.filter(promo => promo.promotiontype_id === 1);
        const normal = allPromotions.filter(promo => promo.promotiontype_id === 2);

        setPromotions(allPromotions);
        setSpecialPromotions(special);
        setNormalPromotions(normal);
      } catch (error) {
        console.error('Failed to Load Promotions:', error);
      }
    };

    fetchPromotions();
  }, []);

  const handleRequestClick = (promsp) => {
    setSelectedPromotion(promsp);
    setOpen(true);
  };

  const handleCheckClick = (index) => {
    navigate('/promotion');
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedPromotion(null);
  };

  const handlePromotionClick = (promotion) => {
    setSelectedPromotion(promotion);
    setOpen(true);
  };

  return (
    <Container sx={{ padding: 1, overflowY: 'hidden', backgroundColor: '#f8f8f8' }}>
      <CarouselSection
        specialPromotions={specialPromotions}
        handleRequestClick={handleRequestClick}
        handleCheckClick={handleCheckClick}
      />
      <PromotionsSection promotions={normalPromotions} onPromotionClick={handlePromotionClick} />
      <PromotionDialog
        open={open}
        onClose={handleCloseDialog}
        promotion={selectedPromotion}
      />
    </Container>
  );
};

export default DashboardPage;
