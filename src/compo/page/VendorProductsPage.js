// File path: src/pages/VendorProductsPage.js

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Swal from 'sweetalert2'; // Import SweetAlert2

import axios from 'axios';
import APIConnection from '../../config.js';


const backendUrl = APIConnection.backendUrl;
// Define theme colors
const themeColor = {
  primary: '#0b2d9c',
  background: '#f8f8f8',
};

// Styled components
const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: themeColor.primary,
  fontSize: '24px', // Larger font size for title impact
  marginBottom: theme.spacing(3),
  textAlign: 'center', // Center alignment for better presentation
}));

const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // Center the search bar and select component
  padding: theme.spacing(2),
  width: '100%', // Adjust to full width for better alignment
  zIndex: 1000,
}));



const SearchBar = styled(TextField)(({ theme }) => ({
  width: '70%',
  borderRadius: '20px',
  backgroundColor: '#fff',
  marginRight: theme.spacing(1),
}));

const ProductCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: theme.spacing(2),
  width: '200px',
  cursor: 'pointer',
  // height: '260px', // Increased height for better layout
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 12px 24px rgba(0,0,0,0.15)', // Softer shadow for premium effect
  },
  padding: theme.spacing(2),
  borderRadius: '16px', // Rounded corners for a smoother look
  boxShadow: '0px 6px 12px rgba(0,0,0,0.08)', // Soft shadow for depth
}));


const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: '120px', // Increased height for better image display
  width: '100%', // Full width to utilize card space
  objectFit: 'cover', // Ensure images maintain aspect ratio
  borderRadius: '8px', // Rounded image corners
}));

const ProductInfo = styled(CardContent)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  fontSize: '16px', // Increased font size for better readability
}));


const ProductCategoryList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: theme.spacing(2, 0),
  '& li': {
    padding: theme.spacing(0.5, 0),
    color: '#444',
  },
}));



const ProductDialog = ({ product, open, onClose }) => {

  const requestproductapi = APIConnection.requestproductapi;


  // useEffect(() => {
  //   // Update carousel height based on the video's rendered height
  //   if (videoRef.current) {
  //     const videoHeight = videoRef.current.clientHeight;
  //     setCarouselHeight(videoHeight);
  //   }
  // }, [videoRef.current]);

  const handleRequestProduct = async () => {

    try {
      const productID = { id: product.id };
      const response = await axios.post(requestproductapi, productID, { withCredentials: true });
      if (response.status === 200) {
        onClose();
        Swal.fire({
          title: 'Request Sent!',
          text: `Your request for ${product.name} has been submitted. Our team will get back to you soon.`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Reload the page after the user clicks "OK" on the SweetAlert
          window.location.reload();
        });

      }
    } catch (error) {
      console.error('Failed to Send Requests:', error);
      Swal.fire({
        title: 'Error in Request Sending!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

  };

  const renderVideoPlayer = (videoUrl) => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      return (
        <iframe
          width="100%"
          height="240"
          src={videoUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: '8px', marginBottom: '15px' }}
        ></iframe>
      );
    }
    return (
      <video
        controls
        src={videoUrl}
        style={{
          width: '100%',
          borderRadius: '8px',
          marginBottom: '15px',
        }}
      />
    );
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth >
      <DialogTitle>
        {product.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Media Section: Video and Image */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            {renderVideoPlayer(product.videolink)}
          </Box>
          <Box sx={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', height: '200px', width: '200px', pl: 5 }}>
            {/* Image Carousel */}

            <img src={`${backendUrl}${product.image}`} alt={product.name} style={{ height: '200px', width: '300px' }} />
          </Box>
        </Box>

        {/* Product Description */}
        <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ marginBottom: 1, fontWeight: 'bold' }}>
            <strong>Model No: </strong> {product.modelno}
          </Typography>
        </Box>

        {/* Product Features */}
        <Box sx={{ marginBottom: 1, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 'bold' }}>
            Features:
          </Typography>
          <ProductCategoryList>
            {Object.entries(product.features).map(([featureName, featureValue], index) => (
              <li key={index}>
                <strong>{featureName}:</strong> {featureValue}
              </li>
            ))}
          </ProductCategoryList>
          <Button variant="contained" color="primary" onClick={handleRequestProduct}>
            Request Product
          </Button>
        </Box>



      </DialogContent>
    </Dialog>
  );
};

const VendorProductsPage = () => {
  const { vendorId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // State for selected category
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const getallproductsapi = APIConnection.getallproductsnotrequestedapi;
  const getcategoriesapi = APIConnection.getcategoriesapi;


  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await axios.get(getallproductsapi, { withCredentials: true });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to Load Vendors:', error);
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(getcategoriesapi, { withCredentials: true });
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to Load Categories:', error);
      }
    }

    fetchProducts();
    fetchCategories();
  }, []);

  const vendorProducts = products.filter((product) => product.vendor_id === parseInt(vendorId));

  // Filter hot items
  const hotItems = vendorProducts.filter((product) => product.isHot);

  // Filter products based on category and search query
  const filteredProducts = vendorProducts.filter(
    (product) =>
      (selectedCategory === 'all' || product.category_name === selectedCategory) &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase())
        // product.features.some((feature) =>
        //   feature.toLowerCase().includes(searchQuery.toLowerCase())
        // )
      )
  );

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: themeColor.background,
        position: 'relative',
        marginTop: '-20px',
        zIndex: 0,
      }}
    >
      <PageTitle variant="h4">Vendor Products</PageTitle>

      {/* Search Bar Container with Select Option */}
      <SearchBarContainer>
        {/* Category Selector */}
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          sx={{ marginRight: 1, backgroundColor: '#fff', borderRadius: '20px' }}
        >
          <MenuItem value="all">All</MenuItem>
          {categories.map((category) => (
            <MenuItem value={category.name}>{category.name}</MenuItem>
          ))}
        </Select>

        {/* Search Bar */}
        <SearchBar
          variant="outlined"
          placeholder="Search by product name, model number, or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </SearchBarContainer>

      {/* Hot Items Section */}
      <Box
        sx={{
          marginTop: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'red',
            fontSize: '18px',
            backgroundColor: 'white',
            padding: '1px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          Hot Items
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '0px',
          }}
        >
          {hotItems.length > 0 ? (
            hotItems.map((product) => (
              <ProductCard key={product.id} onClick={() => handleProductClick(product)}>
                <ProductImage image={product.image} title={product.name} />
                <ProductInfo>
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                </ProductInfo>
              </ProductCard>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: '#666' }}>
              No hot items available for this vendor.
            </Typography>
          )}
        </Box>
      </Box>

      {/* All Products Section */}
      <Box
        sx={{
          marginTop: '0px',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: themeColor.primary,
            fontSize: '18px',
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          All Products
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '0px',
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} onClick={() => handleProductClick(product)}>
                <ProductImage image={`${backendUrl}${product.image}`} title={product.name} />
                {/* image={`${backendUrl}${product.image[]}`} */}
                <ProductInfo>
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                </ProductInfo>
              </ProductCard>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: '#666' }}>
              No products found.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Product Dialog */}
      {selectedProduct && (
        <ProductDialog product={selectedProduct} open={dialogOpen} onClose={handleCloseDialog} />
      )}
    </Box>
  );
};

export default VendorProductsPage;