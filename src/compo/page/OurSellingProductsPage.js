import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import APIConnection from '../../config.js';
import axios from 'axios';
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
  fontSize: '24px',
  marginBottom: theme.spacing(3),
  textAlign: 'left',
}));

const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  width: '800px',
  zIndex: 1000,
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  width: '60%',
  borderRadius: '20px',
  backgroundColor: '#fff',
  marginRight: theme.spacing(1),
}));

const VendorCard = styled(Card)(({ theme }) => ({
  
  height: '180px',
  alignItems: 'center',
  margin: theme.spacing(2),
  width: '250px', // Slightly larger width for better presentation
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.5s ease',
  '&:hover': {
    transform: 'translateY(-5px)', // Lift effect on hover
    boxShadow: '0px 12px 24px rgba(0,0,0,0.12)', // Softer and broader shadow for premium feel
  },
  padding: theme.spacing(2),
  borderRadius: '16px', // Larger border radius for softer edges
  backgroundColor: '#ffffff', // Clean white background
  boxShadow: '0px 6px 12px rgba(0,0,0,0.08)', // Softer initial shadow
}));


const VendorLogo = styled(CardMedia)(({ theme }) => ({
  height: '50%', // Adjusted for better visibility
  width: '100%', // Use the full width of the card
   // Ensures the logo maintains aspect ratio
  margin: theme.spacing(1, 0), // Margin for better spacing from card edges
  borderRadius: '8px', // Soft rounded corners for the image
}));


const VendorInfo = styled(CardContent)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(1),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: '16px', // Larger font size for better legibility
  fontWeight: '500', // Medium weight for text
  color: '#333', // Darker text for contrast
}));



const ProductCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: theme.spacing(2),
  // height: '160px',
  cursor: 'pointer',
  padding: '10px',
  borderRadius: '12px',
  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
}));

const ScrollBox = styled(Box)({
  maxHeight: '600px',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 5px grey',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: themeColor.primary,
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#0a1f6b',
  },
});


const OurVendorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [popupOpen, setPopupOpen] = useState(false);
  const [productPopupOpen, setProductPopupOpen] = useState(false);
  const [currentVendorProducts, setCurrentVendorProducts] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [myproducts, setMyproducts] = useState([]);
  const [myProductVendors, setMyProductVendors] = useState([]);

  const navigate = useNavigate();

  const getvendorsapi = APIConnection.getvendorsapi;
  const getcategoriesapi = APIConnection.getcategoriesapi;
  const getallproducts_requestedapi = APIConnection.getallproducts_requestedapi;

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(getvendorsapi, { withCredentials: true });
        setVendors(response.data);
      } catch (error) {
        console.error('Failed to Load Vendors:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(getcategoriesapi, { withCredentials: true });
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to Load Categories:', error);
      }
    };

    fetchVendors();
    fetchCategories();
  }, []);

  const handleMyProductsClick = async () => {
    try {
      const response = await axios.get(getallproducts_requestedapi, { withCredentials: true });
      setMyproducts(response.data);

      // Extract unique vendors related to the products
      const vendorIds = [...new Set(response.data.map((product) => product.vendor_id))];
      const filteredVendors = vendors.filter((vendor) => vendorIds?.includes(vendor.id));
      setMyProductVendors(filteredVendors);

      setPopupOpen(true);
    } catch (error) {
      console.error('Failed to Load My Products:', error);
    }
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      (selectedCategory === 'all' || vendor?.categories?.includes(selectedCategory)) &&
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    setCurrentVendorProducts(myproducts.filter((product) => product.vendor_id === vendor.id));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setProductPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setSelectedVendor(null);
    setCurrentVendorProducts([]);
    setSelectedProduct(null);
  };

  const handleProductPopupClose = () => {
    setProductPopupOpen(false);
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
      <PageTitle variant="h4">Our Vendors</PageTitle>

      <SearchBarContainer>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          sx={{ marginRight: 1, backgroundColor: '#fff', borderRadius: '20px' }}
        >
          <MenuItem value="all">All</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>

        <SearchBar
          variant="outlined"
          placeholder="Search by vendor name"
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

        <Button
          variant="contained"
          color="primary"
          sx={{ marginLeft: 1, borderRadius: '20px' }}
          onClick={handleMyProductsClick}
        >
          My Products
        </Button>
      </SearchBarContainer>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: 4,
        }}
      >
        {filteredVendors.map((vendor) => (
          <VendorCard key={vendor.id} onClick={() => navigate(`/vendor-products/${vendor.id}`)}>
            <VendorLogo image={`${backendUrl}${vendor.vendorlogo}`} title={vendor.name} />

            <VendorInfo>
              <Typography variant="h6" component="div" >
                {vendor.name}
              </Typography>
            </VendorInfo>
          </VendorCard>
        ))}
      </Box>

      <Dialog open={popupOpen} onClose={handlePopupClose} fullWidth maxWidth="md">
        <DialogTitle>Selected Vendors and Products</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <ScrollBox>
                <Typography variant="h6">Vendor List</Typography>
                {myProductVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    onClick={() => handleVendorClick(vendor)}
                    sx={{ width: '150px', float: 'left' }}
                  >
                    <VendorLogo image={`${backendUrl}${vendor.vendorlogo}`} title={vendor.name} />
                    {/* image={`${backendUrl}${vendor.logo}`} */}
                    <VendorInfo>
                      <Typography variant="h6" component="div">
                        {vendor.name}
                      </Typography>
                    </VendorInfo>
                  </VendorCard>
                ))}
              </ScrollBox>
            </Grid>
            <Grid item xs={6}>
              <ScrollBox>
                <Typography variant="h6">Vendor Products</Typography>
                {selectedVendor &&
                  currentVendorProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      sx={{ width: '150px', float: 'left' }}
                    >

                      <CardMedia component="img" image={`${backendUrl}${product.image}`} alt={product.name} />
                      {/* <CardImage src={`${backendUrl}${product.proimage}`} alt={product.name}/> */}
                      <Typography variant="h6" component="div">
                        {product.name}
                      </Typography>
                      <Typography variant="p" component="div">
                        <span style={{ color: 'blue' }}>Request Status:</span>
                        <span style={{
                          color: product.prodrequeststatus_name === 'Pending' ? 'orange' :
                            product.prodrequeststatus_name === 'Approved' ? 'green' :
                              product.prodrequeststatus_name === 'Rejected' ? 'red' : 'inherit'
                        }}>
                          {product.prodrequeststatus_name}
                        </span>
                      </Typography>

                    </ProductCard>
                  ))}
              </ScrollBox>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopupClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={productPopupOpen} onClose={handleProductPopupClose} fullWidth maxWidth="sm">
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">{selectedProduct.name}</Typography>

              {/* <CardMedia component="img" image={`${backendUrl}${selectedProduct.image}`} alt={selectedProduct.name} /> */}
              <CardMedia
                component="img"
                image={`${backendUrl}${selectedProduct.image}`} alt={selectedProduct.name}
                sx={{ marginBottom: 2, width: '50%', textAlign: 'center' }}

              />
              <Typography variant="body1"><strong>Model No :</strong> {selectedProduct.modelno}</Typography>
              <Typography variant="body2">
                {Object.entries(selectedProduct.features).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </Typography>
              <Typography variant="p" component="div">
                <span style={{ color: 'blue' }}>Request Status:</span>
                <span style={{
                  color: selectedProduct.prodrequeststatus_name === 'Pending' ? 'orange' :
                    selectedProduct.prodrequeststatus_name === 'Approved' ? 'green' :
                      selectedProduct.prodrequeststatus_name === 'Rejected' ? 'red' : 'inherit'
                }}>
                  {selectedProduct.prodrequeststatus_name}
                </span>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProductPopupClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OurVendorsPage;