// components/PromotionDialog.js

import React from 'react';
import { Dialog, DialogContent, Slide, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';
import { themeColor } from './theme';
import axios from 'axios';
import APIConnection from '../../config.js';


const backendUrl = APIConnection.backendUrl;

const addpromotionrequestsapi = APIConnection.addpromotionrequestsapi;

const PromotionDialog = ({ open, onClose, promotion }) => {
  const handlePromotionRequest = async () => {

    const clickedpromotion = { prmotionid: promotion.id };

    try {
      const response = await axios.post(addpromotionrequestsapi, clickedpromotion, { withCredentials: true });
     
      if (response.status === 200) {
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully requested this promotion.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: themeColor.primary,
        });
        onClose();
      } else if (response.status === 409) {
        Swal.fire({
          title: 'Error!',
          text: 'This promotion has already been requested.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: themeColor.primary,
        });
        onClose();
      }
    } catch (err) {
      // Accessing the server response from the error object
      const message = err.response && err.response.data ? err.response.data.message : 'Error in sending request. Please contact us.';

      Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: themeColor.primary,
      });
      onClose();
    }

  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Slide}
      keepMounted
    >
      {promotion && (
        <DialogContent>
          {/* <PromotionImage src={bufferToBase64(promotion.proimage)} alt={promotion.alt} /> */}
          <PromotionImage src={`${backendUrl}${promotion.proimage}`} alt={promotion.alt}/>

          <PromotionContent>
            <Typography variant="h5">{promotion.title}</Typography>
            <Typography variant="body2" className="details">
              {promotion.details}
            </Typography>
          </PromotionContent>
          <PromotionButtonContainer>
            <ActionButton variant="contained" onClick={handlePromotionRequest}>
              Request
            </ActionButton>
          </PromotionButtonContainer>
        </DialogContent>
      )}
    </Dialog>
  );
};

const PromotionImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxHeight: '300px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: theme.spacing(2),
}));

const PromotionContent = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  '& h5': {
    color: themeColor.headerBg,
    marginBottom: theme.spacing(1),
  },
  '& p': {
    color: themeColor.color,
    marginBottom: theme.spacing(2),
  },
  '& .details': {
    color: '#555',
    fontStyle: 'italic',
  },
}));

const PromotionButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
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

export default PromotionDialog;
