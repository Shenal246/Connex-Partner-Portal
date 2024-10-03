import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import DealRegImage from '../img/how-to-find-a-business-partner.png';
import DealRegistrationForm from './DealRegistrationForm';
import axios from 'axios';
import APIConnect from '../../config';
import dayjs from "dayjs";

// Helper function to calculate the aging
// function calculateAging(dealDate) {
//   const currentDate = new Date();
//   const dateFromDB = new Date(dealDate);
//   const differenceInTime = currentDate.getTime() - dateFromDB.getTime();
//   const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
//   return `${differenceInDays} days`;
// }

const calculateAging = (dealDate) => {
  const currentDate = dayjs();
  const uploaded = dayjs(dealDate);
  return currentDate.diff(uploaded, "day");
};

function getStatusColor(status) {
  switch (status) {
    case 'Approved':
      return '#4caf50'; // Green
    case 'Pending':
      return '#ff9800'; // Orange
    case 'Rejected':
      return '#f44336'; // Red
    default:
      return '#000'; // Default color
  }
}

function getDealStatusColor(dealStatus) {
  switch (dealStatus) {
    case 'Win':
      return '#2196f3'; // Blue
    case 'Pending':
      return '#ff9800'; // Orange
    case 'Lost':
      return '#f44336'; // Red
    default:
      return '#000'; // Default color
  }
}

function DealRegistration() {
  const [approvedPendingPercentage, setApprovedPendingPercentage] = useState(0);
  const [winLostPercentage, setWinLostPercentage] = useState(0);
  const [completedDealsCount, setCompletedDealsCount] = useState(0);
  const [deals, setDeals] = useState([]);
  const [open, setOpen] = useState(false);
  const getdealregistrationdetailsapi = APIConnect.getdealregistrationdetailsapi;
  const getapprovedpercentagesapi = APIConnect.getapprovedpercentagesapi;
  const getwinpercentagesapi = APIConnect.getwinpercentagesapi;
  const getcompletedpercentagesapi = APIConnect.getcompletedpercentagesapi;

  // Fetch data from your backend API
  const fetchpendingPercentage = async () => {
    try {
      const response = await axios.get(getapprovedpercentagesapi, { withCredentials: true });
      const pendingpercentage = Number(response.data.pendingPercentage);
      setApprovedPendingPercentage(pendingpercentage);

    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  const fetchWinLostPercentage = async () => {
    try {
      const response = await axios.get(getwinpercentagesapi, { withCredentials: true });
      setWinLostPercentage(response.data.winLostPercentage);
    } catch (error) {
      console.error('Error fetching win/lost percentage:', error);
    }
  };

  const fetchCompletedDealsCount = async () => {
    try {
      const response = await axios.get(getcompletedpercentagesapi, { withCredentials: true });
      setCompletedDealsCount(response.data.completedDealsCount);
    } catch (error) {
      console.error('Error fetching completed deals count:', error);
    }
  };

  // Fetch data from your backend API
  const fetchDeals = async () => {
    try {
      const response = await axios.get(getdealregistrationdetailsapi, { withCredentials: true });
      setDeals(response.data);
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
    fetchpendingPercentage();
    fetchWinLostPercentage();
    fetchCompletedDealsCount();
  };

  useEffect(() => {
    const animatePercentage = (setPercentage, targetValue) => {
      let startValue = 0;
      const increment = targetValue / 100;
      const interval = setInterval(() => {
        if (startValue >= targetValue) {
          clearInterval(interval);
        } else {
          startValue += increment;
          setPercentage(Math.min(Math.round(startValue), targetValue));
        }
      }, 1);
    };

    animatePercentage(setApprovedPendingPercentage, approvedPendingPercentage);
    animatePercentage(setWinLostPercentage, winLostPercentage);
  }, []);

  useEffect(() => {
    // const targetCount = 3298;
    // const animateCount = () => {
    //   let startValue = 0;
    //   const increment = targetCount / 100;
    //   const interval = setInterval(() => {
    //     if (startValue >= targetCount) {
    //       clearInterval(interval);
    //     } else {
    //       startValue += increment;
    //       setCompletedDealsCount(Math.min(Math.round(startValue), targetCount));
    //     }
    //   }, 1);
    // };

    // animateCount();
    fetchDeals();
  }, []);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5, marginTop: '-20px' }}>
      {/* Top Section */}
      <Grid container spacing={2}>
        {/* Left Side */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" gutterBottom>
                Deal Registration
              </Typography>
              <Typography variant="body2" gutterBottom>
                Register new deals and track progress with analytics and statistics.
              </Typography>
              <CardMedia
                component="img"
                image={DealRegImage}
                alt="Deal Registration"
                sx={{ maxWidth: '100%', height: 'auto', mt: 1 }}
              />
              {/* Deal Registration Button */}
              <Box sx={{ mt: 'auto', textAlign: 'center', marginTop: '10px' }}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                  Deal Registration
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" align="center" gutterBottom>
                Completed Deals
              </Typography>
              <Typography variant="h4" align="center" gutterBottom>
                {completedDealsCount}
              </Typography>

              <Grid container spacing={1} justifyContent="center">
                {/* Approved vs Pending Deals Chart */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <CircularProgressbar
                      value={approvedPendingPercentage}
                      text={`${approvedPendingPercentage.toFixed(0)}%`}
                      strokeWidth={8}
                      styles={buildStyles({
                        pathColor: approvedPendingPercentage > 50 ? '#4caf50' : '#f44336',
                        trailColor: '#d6d6d6',
                        textColor: '#000',
                      })}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Approved / Pending
                    </Typography>
                  </Box>
                </Grid>

                {/* Win vs Lost Deals Chart */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <CircularProgressbar
                      value={winLostPercentage}
                      text={`${winLostPercentage.toFixed(0)}%`}
                      strokeWidth={8}
                      styles={buildStyles({
                        pathColor: winLostPercentage > 50 ? '#2196f3' : '#ff9800',
                        trailColor: '#d6d6d6',
                        textColor: '#000',
                      })}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Win / Lost
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Legend */}
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 10, height: 10, bgcolor: '#ffffff', borderRadius: '50%', mr: 1 }} />
                      <Typography variant="body2">* Colored Parts are showing Approved and Win</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Deal List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#2196f3' }}>
                <TableCell sx={{ color: '#fff' }}>ID</TableCell>
                <TableCell sx={{ color: '#fff' }}>Project Name</TableCell>
                <TableCell sx={{ color: '#fff' }}>Company Name</TableCell>
                <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                <TableCell sx={{ color: '#fff' }}>Aging</TableCell>
                <TableCell sx={{ color: '#fff' }}>Amount</TableCell>
                <TableCell sx={{ color: '#fff' }}>Deal Status</TableCell>
                <TableCell sx={{ color: '#fff' }}>Action By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.map((deal, index) => (
                <TableRow key={deal.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' } }}>
                  <TableCell>{deals.length - index}</TableCell>
                  <TableCell>{deal.projectName}</TableCell>
                  <TableCell>{deal.companyName}</TableCell>
                  <TableCell sx={{ color: getStatusColor(deal.dealStatus) }}>{deal.dealStatus}</TableCell>
                  <TableCell>{calculateAging(deal.date)} days</TableCell>
                  <TableCell>{`${deal.amount} ${deal.currencyUnit}`}</TableCell>
                  <TableCell sx={{ color: getDealStatusColor(deal.winLostStatus) }}>{deal.winLostStatus}</TableCell>
                  <TableCell>{deal.approvedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Deal Registration Form Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Deal Registration Form</DialogTitle>
        <DialogContent>
          <DealRegistrationForm handleCloseModal={handleClose} refreshTable={fetchDeals} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default DealRegistration;