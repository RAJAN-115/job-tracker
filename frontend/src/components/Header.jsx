// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center">
          <WorkIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Job Application Tracker
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
