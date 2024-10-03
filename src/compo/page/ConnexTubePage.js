import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  TextField,
  Button,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

import APIConnect from '../../config';
import axios from 'axios';

// Define theme colors
const themeColor = {
  primary: '#007bff', // Blue
  headerBg: '#444',
  headerTextColor: '#ffffff',
  borderColor: '#777',
  color: '#ffffff',
  rowHoverColor: '#ebebeb',
  rowAlternateColor: '#f5f5f5',
  rowHoverHighlight: '#e0f7fa',
};

// Define styled components
const Header = styled(Box)(({ theme }) => ({
  backgroundColor: themeColor.headerBg,
  color: themeColor.headerTextColor,
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  borderRadius: '16px', // Rounded corners for the header
  marginBottom: theme.spacing(3), // Margin to separate from the rest of the content
  height: '56px', // Reduced height for the header
}));

const SearchBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '400px',
  margin: 'auto',
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  borderRadius: '24px',
  backgroundColor: '#333',
  '& input': {
    color: themeColor.headerTextColor,
    padding: '10px 12px',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    '& fieldset': {
      borderColor: '#555',
    },
    '&:hover fieldset': {
      borderColor: themeColor.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: themeColor.primary,
    },
  },
}));

const SearchIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: '50%',
  transform: 'translateY(-50%)',
  color: themeColor.primary,
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: '100%', // Full width within the main content area
  padding: theme.spacing(2),
  overflowY: 'auto',
}));

const VideoCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px', // Increased radius for a premium feel
  boxShadow: '0px 6px 18px rgba(0,0,0,0.15)', // Enhanced shadow for depth
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  marginBottom: theme.spacing(3),
  backgroundColor: '#2C2C2C', // A darker tone for the card
  color: themeColor.headerTextColor,
  height: '280px', // Adjusted height for a balanced look
  '&:hover': {
    boxShadow: '0px 8px 24px rgba(0,0,0,0.25)', // Stronger shadow on hover
    transform: 'translateY(-5px)', // Elevate on hover
  },
}));

const VideoCardMedia = styled(CardMedia)(({ theme }) => ({
  height: '160px', // Adjusted to match new card size
  borderRadius: '16px 16px 0 0', // Match the card's rounded top
}));

const VideoCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const VideoTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  color: themeColor.headerTextColor,
  fontSize: '16px', // Increased font size for prominence
}));

const VideoDescription = styled(Typography)(({ theme }) => ({
  color: themeColor.color,
  fontSize: '13px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const VideoInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  color: themeColor.color,
}));

const LikeButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#fff',
  color: themeColor.primary,
  marginLeft: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
  transition: 'background-color 0.3s ease',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  color: themeColor.primary,
  zIndex: 1,
}));

const ModalContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '70vh',
  backgroundColor: '#fff', // Set the background color to white
  width: '100%', // Full width
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '56.25%', // 16:9 Aspect Ratio
}));

const VideoPlayer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}));

const CommentsSection = styled(Box)(({ theme }) => ({
  flex: 1, // 25% of the width
  padding: theme.spacing(2),
  backgroundColor: '#fff', // Set the background color to white
  color: '#000', // Change text color to black
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const CommentList = styled(List)(({ theme }) => ({
  maxHeight: '400px',
  overflowY: 'auto',
}));

const CommentItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: theme.spacing(1),
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const CommentText = styled(Typography)(({ theme }) => ({
  color: '#000', // Change text color to black
  fontSize: '14px',
}));

const CommentUser = styled(Typography)(({ theme }) => ({
  color: themeColor.primary,
  fontWeight: 'bold',
  marginRight: theme.spacing(1),
}));

const CommentInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
}));

const CommentInput = styled(TextField)(({ theme }) => ({
  backgroundColor: '#f9f9f9', // Light background for input
  color: '#000', // Change text color to black
  '& input': {
    color: '#000', // Change text color to black
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: themeColor.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: themeColor.primary,
    },
  },
}));

const SendIconButton = styled(IconButton)(({ theme }) => ({
  color: themeColor.primary,
  marginLeft: theme.spacing(1),
}));

const ConnexTubePage = () => {
  const [selectedVideolink, setSelectedVideolink] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideoData, setFilteredVideoData] = useState([]);
  const [comment, setComment] = useState('');

  const fetchVideodataapi = APIConnect.getvideoinforapi;

  useEffect(() => {
    const fetchVideoData = async () => { 
      try {
        // Check authentication status by calling an API that verifies the JWT token stored in the HttpOnly cookie
        await axios.get(fetchVideodataapi, { withCredentials: true }).then((res) => {
          setFilteredVideoData(res.data);
        })

      } catch (error) {
        console.log("fetchVideoData Error--", error);
      }
    };

    fetchVideoData();
  }, []);

  const handleVideoClick = (videolink) => {
    setSelectedVideolink(videolink);
    setOpen(true);
  };

  const handleCloseClick = () => {
    setOpen(false);
    setSelectedVideolink(null);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredData = filteredVideoData.filter(
      (video) =>
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query)
    );
    setFilteredVideoData(filteredData);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSendComment = () => {
    if (comment.trim()) {
      // Handle adding the comment
      setComment('');
    }
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Typography variant="h6">Events & News</Typography>
        <SearchBar>
          <SearchInput
            variant="outlined"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <SearchIconButton>
                  <SearchIcon />
                </SearchIconButton>
              ),
            }}
          />
        </SearchBar>
      </Header>

      {/* Main Content */}
      <Box sx={{ display: 'flex' }}>
        <Sidebar>
          <Grid container spacing={3}>
            {filteredVideoData.map((video) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3} // Changed for more responsiveness
                key={video.link}
                onClick={() => handleVideoClick(video.link)}
              >
                <VideoCard>
                  <VideoCardMedia
                    component="img"
                    image={`https://img.youtube.com/vi/${extractVideoId(video.link)}/0.jpg`} // Thumbnail image link
                    alt={video.title}
                  />
                  <VideoCardContent>
                    <VideoTitle variant="h6">{video.title}</VideoTitle>
                    <VideoDescription variant="body2">
                      {video.description}
                    </VideoDescription>
                  </VideoCardContent>
                </VideoCard>
              </Grid>
            ))}
          </Grid>
        </Sidebar>
      </Box>

      {/* Modal for Video Player */}
      <Dialog open={open} onClose={handleCloseClick} fullWidth maxWidth="md">
        <DialogContent sx={{ padding: 0 }}>
          <CloseButton onClick={handleCloseClick}>
            <Tooltip title="Close">
              <CloseIcon />
            </Tooltip>
          </CloseButton>
          <ModalContainer>
            <VideoPlayer>
              <iframe
                src={selectedVideolink}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
                width="100%"
                height="100%"
              />
            </VideoPlayer>
          </ModalContainer>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

// Helper function to extract the YouTube video ID from the embed link
const extractVideoId = (link) => {
  const regExp = /^.*(youtu.be\/|embed\/|watch\?v=|v\/|\/u\/\w\/|embed\/|watch\?v=&v=)([^#&?]*).*/;
  const match = link.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default ConnexTubePage;
