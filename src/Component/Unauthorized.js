// // src/Component/Unauthorized.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 10, textAlign: 'center' ,}}>
      <Typography variant="h4" gutterBottom backgroundColor="#31C48D" p={3} color={"#fff"} borderRadius={2}>
      404 Page Not Found
      </Typography>
      <Typography variant="body1" mb={3} >
        You do not have permission to view this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{backgroundColor:"#BF125D",}}
     size="large"
        onClick={() => navigate('/login')}
      >
        Back to Login
      </Button>
    </Box>
  );
};

export default Unauthorized;