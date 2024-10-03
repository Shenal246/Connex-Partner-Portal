// components/PromotionsSection.js

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { themeColor } from './theme';
import APIConnection from "../../config";

const backendUrl = APIConnection.backendUrl;
// Utility function to convert Buffer to base64


const PromotionsSection = ({ promotions, onPromotionClick }) => {
  const scrollContainerRef = React.useRef(null);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <PromotionsContainer>
      <SectionHeader>
        <Typography variant="h6">Latest Promotions</Typography>
        <Box>
          <IconButton onClick={scrollLeft} aria-label="scroll left">
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton onClick={scrollRight} aria-label="scroll right">
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </SectionHeader>
      <CardsContainer ref={scrollContainerRef}>
        {promotions.map((promotion, index) => (
          <Card key={index} onClick={() => onPromotionClick(promotion)}>
            {/* <CardImage src={bufferToBase64(promotion.proimage)} alt={promotion.alt} /> */}
            <CardImage src={`${backendUrl}${promotion.proimage}`} alt={promotion.title}/>
            <CardContent>
              <Typography variant="body1">{promotion.title}</Typography>
            </CardContent>
          </Card>
        ))}
      </CardsContainer>
    </PromotionsContainer>
  ); 
};

const PromotionsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: themeColor.rowAlternateColor,
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
  marginTop: theme.spacing(2),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const CardsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  gap: theme.spacing(2),
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none',
}));

const Card = styled(Box)(({ theme }) => ({
  minWidth: '200px',
  flex: '0 0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const CardImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '150px',
  objectFit: 'cover',
}));

const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export default PromotionsSection;
