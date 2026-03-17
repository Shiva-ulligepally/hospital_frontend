import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h3" color="error" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="h6" gutterBottom>
        You do not have permission to view this page.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/login')} sx={{ mt: 3 }}>
        Go back to Login
      </Button>
    </Box>
  );
};
export default Unauthorized;
