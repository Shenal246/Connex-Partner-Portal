import React from 'react';
import { Container, Typography, CssBaseline, createTheme, ThemeProvider, Box } from '@mui/material';
import { keyframes } from '@emotion/react';

// Define the theme
const theme = createTheme({
  palette: {
    background: {
      default: '#FFFFFF', // White background
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// Create a keyframe animation for the color shift
const colorShift = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

// Define styles for the animated text
const animatedTextStyle = {
  fontWeight: 700,
  fontSize: '3.8rem', // Set a base font size, adjust as needed
  color: 'transparent', // Make the text color transparent to show the background
  backgroundImage: 'linear-gradient(to right, yellow, green, blue, indigo, violet)', // Rainbow gradient
  backgroundSize: '200% auto',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${colorShift} 5s linear infinite`, // Apply the animation
  whiteSpace: 'nowrap', // Prevents the text from wrapping onto multiple lines
  overflow: 'hidden', // Keeps the text within the container
};

const ComingSoon = ({ imagePath, title }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,

        // Ensure content doesn't overflow
      }}>
        {/* <Box component="img" src={imagePath} sx={{ width: 250, height: 250, marginBottom: 2, borderRadius: '16px' }} alt="Section Icon" /> */}
        <Typography variant="h2" component="h1" gutterBottom sx={animatedTextStyle}>
          {title}
        </Typography>
        <Typography variant="subtitle1" sx={{
          textAlign: 'center',
          fontSize: '1.8rem',
          color: '#6c757d',
        }}>
          We're working hard to finish the development of this section. Check back soon!
        </Typography>
      </Container>
    </ThemeProvider>
  );
}

export default ComingSoon;
