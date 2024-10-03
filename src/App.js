import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './compo/Sidebar';
import DashboardPage from './compo/page/DashboardPage';
import LoginPage from './compo/page/LoginPage';
import DealRegistration from './compo/page/DealRegistration';
import ConnexTubePage from './compo/page/ConnexTubePage';
import OurSellingProductsPage from './compo/page/OurSellingProductsPage';
import Promotion from './compo/page/Promotion';
import BecomeAPartner from './compo/BecomePartner/BecomeAPartner';
// import ChatPopup from './compo/page/ChatPopup';
import ChangePasswordPage from './compo/page/ChangePasswordPage';
import VendorProductsPage from './compo/page/VendorProductsPage';
import {
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  InputAdornment,
  Grid,
  CssBaseline,
  useMediaQuery,
  useTheme,
  Zoom,
} from '@mui/material';
import { Edit, Person, Visibility, VisibilityOff, Chat, Logout } from '@mui/icons-material';
import ChatPopup from '../src/compo/page/ChatPopup';
import axios from 'axios';
import logo from './compo/img/userimage.jpg';
import APIConnect from './config';
import ComingSoonPage from './compo/page/ComingSoon';
import TechImage from './compo/img/coming soon/4.webp';
import MDFImage from './compo/img/coming soon/5.webp';
import ConnexCircleImage from './compo/img/coming soon/2.webp';
import SettingsImage from './compo/img/coming soon/3.webp';

const themeColors = {
  primary: '#333333',
  primaryDark: '#222222',
  secondary: '#25D366',
  textPrimary: '#ffffff',
  textSecondary: '#666666',
  background: '#f4f4f4',
  border: '#e0e0e0',
  cardBg: '#fafafa',
};

const styles = {
  header: {
    padding: '10px 20px',
    backgroundColor: '#03163c',
    color: themeColors.textPrimary,
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: "'Roboto', sans-serif",
    borderBottom: `1px solid ${themeColors.border}`,
    margin: 0,
    position: 'fixed',
    top: 0,
    right: 0,
    width: '100%',
    zIndex: 1200,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBox: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '20px',
  },
  footer: {
    padding: '10px 20px',
    backgroundColor: '#03163c',
    textAlign: 'center',
    borderTop: `1px solid ${themeColors.border}`,
    fontSize: '12px',
    color: themeColors.textSecondary,
    fontFamily: "'Roboto', sans-serif",
    margin: 0,
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
  },
  dialogContent: {
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  profileField: {
    marginBottom: '10px',
  },
  fieldLabel: {
    fontWeight: 'bold',
    color: themeColors.primary,
    fontSize: '14px',
  },
  fieldValue: {
    color: themeColors.textSecondary,
    fontSize: '14px',
  },
  iconButton: {
    color: themeColors.textPrimary,
    fontSize: '2rem',
    background: 'rgba(255, 255, 255, 0.3)',
    marginBottom: '5px',
    marginLeft: '10px',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.1)',
      background: 'rgba(255, 255, 255, 0.5)',
    },
  },
  profileDialogTitle: {
    fontWeight: 'bold',
    color: themeColors.primary,
    fontSize: '18px',
    textAlign: 'left',
    marginBottom: '10px',
    paddingLeft: '20px',
  },
  dialogPaper: {
    borderRadius: '12px',
    boxShadow: '0px 6px 12px rgba(0,0,0,0.15)',
    backgroundColor: themeColors.cardBg,
    width: '600px',
  },
  textFieldRoot: {
    '& .MuiInput-underline:before': {
      borderBottomColor: themeColors.primary,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: themeColors.secondary,
    },
  },
  passwordDialogTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: themeColors.primary,
  },
  chatIconButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: themeColors.secondary,
    color: '#fff',
    '&:hover': {
      backgroundColor: '#20c65a',
    },
  },
};

export const AuthContext = createContext();

// Import the ComingSoonPage from where it is defined


const TechAlliance = () => <ComingSoonPage imagePath={TechImage} title="Tech Alliance Page Coming Soon!" />;
const MDFOrders = () => <ComingSoonPage imagePath={MDFImage} title="MDF Orders Page Coming Soon!" />;
const ConnexCircle = () => <ComingSoonPage imagePath={ConnexCircleImage} title="Connex Circle Page Coming Soon!" />;
// const SettingsPage = () => <ComingSoonPage imagePath={SettingsImage} title="Settings Page Coming Soon!" />;


const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  empId: 'EMP123',
  phone: '+1234567890',
  image: logo,
};

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openChatPopup, setOpenChatPopup] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const navigate = useNavigate();
  const [userdetails, setUserdetails] = useState([]);

  const getUserDetailsapi = APIConnect.getUserDetailsapi;

  // Handle mobile responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getUserDetails = async () => {
    try {
      // Check authentication status by calling an API that verifies the JWT token stored in the HttpOnly cookie
      await axios.get(getUserDetailsapi, { withCredentials: true }).then((res) => {
        setUserdetails(res.data.rows[0][0]);
        localStorage.setItem("Fullname", res.data.rows[0][0].name);
      })

    } catch (error) {
      console.log("error--", error);

    };

  }

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenProfileDialog(true);
    getUserDetails();

  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    setOpenEditProfileDialog(true);
    setOpenProfileDialog(false);
  };

  const handleChangePassword = () => {
    setOpenPasswordDialog(true);
    setOpenProfileDialog(false);
  };

  const handlePasswordChange = () => {
    // Handle password change logic here
    console.log('New password:', newPassword);
    setOpenPasswordDialog(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleProfileFieldChange = (field, value) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handleProfileUpdate = () => {
    // Handle profile update logic here
    console.log('Updated user profile:', editedUser);
    setOpenEditProfileDialog(false);
  };

  const logoutapi = APIConnect.logoutapi;

  const handleLogout = async () => {
    try {
      // Call the logout API to clear the cookie on the server side
      await axios.post(logoutapi, {}, { withCredentials: true }).then((res) => {
        setIsAuthenticated(false);
        localStorage.clear();
        setAnchorEl(null);
        navigate('/');
      }
      )
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const verifyToken = APIConnect.verifytoken;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check authentication status by calling an API that verifies the JWT token stored in the HttpOnly cookie
        await axios.get(verifyToken, { withCredentials: true }).then((res) => {
          setIsAuthenticated(true);
          // console.log("fadgg---------", res);
        })

      } catch (error) {

        if (error?.response?.request?.status === 401) {
          setIsAuthenticated(false);
          console.log("Unauthorized User", error.response.request.status);
        }
      }
    };

    checkAuthStatus();
    getUserDetails();
  }, []);

  return (
    <>
      {isAuthenticated && (
        <>
          <header style={styles.header}>
            <Box style={styles.titleBox}>
              <Typography variant="h6" color="inherit">
                CONNEX Partner Portal
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" marginRight="20px">
              <IconButton
                onClick={handleProfileClick}
                style={styles.iconButton}
                aria-label="Profile"
              >
                <Person />
              </IconButton>
              <IconButton
                onClick={handleLogout}
                style={styles.iconButton}
                aria-label="Logout"
              >
                <Logout />
              </IconButton>
            </Box>
          </header>
          <Sidebar />
        </>
      )}
      <div style={{ display: 'flex', flex: 1, marginTop: isAuthenticated ? '60px' : '0' }}>
        <main style={{ flex: 1, marginLeft: isAuthenticated ? '200px' : 0, padding: isMobile ? '10px' : '20px' }}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/deal-registration" element={<PrivateRoute><DealRegistration /></PrivateRoute>} />
            <Route path="/ctb" element={<PrivateRoute><ConnexTubePage /></PrivateRoute>} />
            <Route path="/product" element={<PrivateRoute><OurSellingProductsPage /></PrivateRoute>} />
            <Route path="/promotion" element={<PrivateRoute><Promotion /></PrivateRoute>} />
            <Route path="/become_a_partner" element={<BecomeAPartner />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/vendor-products/:vendorId" element={<PrivateRoute><VendorProductsPage /></PrivateRoute>} />
            <Route path="/techalliance" element={<PrivateRoute><TechAlliance /></PrivateRoute>} />
            <Route path="/mdf" element={<PrivateRoute><MDFOrders /></PrivateRoute>} />
            <Route path="/connexcircle" element={<PrivateRoute><ConnexCircle /></PrivateRoute>} />
            {/* <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} /> */}
            {/* Add other routes here */}
          </Routes>
        </main>
      </div>
      {isAuthenticated && (
        <footer style={styles.footer}>
          <Typography variant="body2" style={{ margin: '0', fontWeight: '300' }}>
            Designed and Developed by <strong>CODE-WORKS Software Engineer Team</strong> © 2024 Connex Information Technologies (PVT) LTD
          </Typography>
          <ChatPopup open={openChatPopup} onClose={() => setOpenChatPopup(false)} />
        </footer>
      )}

      {/* Profile Dialog */}
      <Dialog
        open={openProfileDialog}
        onClose={() => setOpenProfileDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: styles.dialogPaper,
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent style={styles.dialogContent}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6" style={styles.profileDialogTitle}>
                User Profile
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={user.image} alt="User" style={styles.profileImage} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} style={styles.profileField}>
                  <Typography variant="body1" style={styles.fieldLabel}>
                    Full Name:
                  </Typography>
                  <Typography variant="body1" style={styles.fieldValue}>
                    {userdetails && userdetails.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} style={styles.profileField}>
                  <Typography variant="body1" style={styles.fieldLabel}>
                    Employee ID:
                  </Typography>
                  <Typography variant="body1" style={styles.fieldValue}>
                    {user.empId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} style={styles.profileField}>
                  <Typography variant="body1" style={styles.fieldLabel}>
                    Email:
                  </Typography>
                  <Typography variant="body1" style={styles.fieldValue}>
                    {userdetails && userdetails.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} style={styles.profileField}>
                  <Typography variant="body1" style={styles.fieldLabel}>
                    Phone No:
                  </Typography>
                  <Typography variant="body1" style={styles.fieldValue}>
                    {userdetails && userdetails.mobileno}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {/* <Button
            onClick={handleEditProfile}
            color="primary"
            startIcon={<Edit />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: themeColors.primaryDark,
                color: themeColors.textPrimary,
                transform: 'scale(1.05)',
              },
            }}
          >
            Edit Profile
          </Button>
          <Button
            onClick={handleChangePassword}
            color="primary"
            startIcon={<Edit />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: themeColors.primaryDark,
                color: themeColors.textPrimary,
                transform: 'scale(1.05)',
              },
            }}
          >
            Change Password
          </Button> */}
          <Button
            onClick={() => setOpenProfileDialog(false)}
            color="secondary"
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: themeColors.primaryDark,
                color: themeColors.textPrimary,
                transform: 'scale(1.05)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog
        open={openEditProfileDialog}
        onClose={() => setOpenEditProfileDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: styles.dialogPaper,
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent style={styles.dialogContent}>
          <Typography variant="h6" style={styles.passwordDialogTitle}>
            Edit Profile
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            variant="standard"
            value={editedUser.name}
            onChange={(e) => handleProfileFieldChange('name', e.target.value)}
            sx={styles.textFieldRoot}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleProfileUpdate}
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: themeColors.primaryDark,
                color: themeColors.textPrimary,
                transform: 'scale(1.05)',
              },
            }}
          >
            Update Profile
          </Button>
          <Button
            onClick={() => setOpenEditProfileDialog(false)}
            color="secondary"
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: themeColors.primaryDark,
                color: themeColors.textPrimary,
                transform: 'scale(1.05)',
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: styles.dialogPaper,
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent style={styles.dialogContent}>
          <Typography variant="h6" style={styles.passwordDialogTitle}>
            Change Password
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="standard"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={styles.textFieldRoot}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handlePasswordChange}
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: themeColors.primaryDark,
                color: themeColors.textPrimary,
                transform: 'scale(1.05)',
              },
            }}
          >
            Update Password
          </Button>
          <Button
            onClick={() => setOpenPasswordDialog(false)}
            color="secondary"
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: themeColors.primaryDark,
                color: themeColors.textPrimary,
                transform: 'scale(1.05)',
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <CssBaseline /> {/* Normalize CSS across browsers */}
        <AppContent />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
