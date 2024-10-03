import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordResetRequest = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://yourbackenddomain/api/request-reset', { email });
            Swal.fire('Success!', 'Check your email for the reset link.', 'success');
        } catch (error) {
            Swal.fire('Error!', 'Failed to send reset link. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Reset Your Password</Typography>
            <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ my: 2 }}
            />
            <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={handlePasswordResetRequest}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
        </Box>
    );
};

export default PasswordResetRequest;
