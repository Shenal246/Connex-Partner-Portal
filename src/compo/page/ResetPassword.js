import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
    const query = useQuery();
    const token = query.get('token');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            await axios.post('http://yourbackenddomain/api/reset-password', { token, password });
            Swal.fire('Success!', 'Your password has been reset.', 'success');
        } catch (error) {
            Swal.fire('Error!', 'Failed to reset password. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Set New Password</Typography>
            <TextField
                fullWidth
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ my: 2 }}
            />
            <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={handleResetPassword}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
        </Box>
    );
};

export default ResetPassword;
