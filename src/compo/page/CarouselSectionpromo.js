// components/CarouselSection.js

import React from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { themeColor } from './theme';
import APIConnection from "../../config";


const backendUrl = APIConnection.backendUrl;

const CarouselSectionpromo = ({ specialPromotions, handleRequestClick, handleCheckClick }) => {
  return (
    <CarouselContainer>
      <Carousel
        autoPlay
        infiniteLoop
        interval={3000}
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
      >

        {specialPromotions.map((sppromo, index) => (
          <div key={index}>

<img src={`${backendUrl}${sppromo.proimage}`} alt={sppromo.title}/>
            
            <ButtonContainer>
              <ActionButton variant="contained" onClick={() => handleRequestClick(sppromo)}>
                Request
              </ActionButton>
            </ButtonContainer>
          </div>
        ))}
      </Carousel>
    </CarouselContainer>
  );
};

const CarouselContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  position: 'relative',
  '& .carousel .slide img': {
    borderRadius: '12px',
    height: '250px',
    objectFit: 'cover',
  },
  '& .carousel .slide': {
    position: 'relative',
  },
  '& .carousel .control-dots': {
    bottom: '15px',
  },
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  bottom: '20px',
  left: '20px',
  gap: theme.spacing(2),
  zIndex: 2,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '14px 28px',
  fontWeight: 'bold',
  textTransform: 'none',
  backgroundColor: themeColor.primary,
  color: theme.palette.common.white,
  boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    backgroundColor: themeColor.headerBg,
    transform: 'scale(1.05)',
  },
  cursor: 'pointer',
}));

export default CarouselSectionpromo;
