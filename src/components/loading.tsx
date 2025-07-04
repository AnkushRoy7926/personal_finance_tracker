'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Backdrop,
  useTheme,
} from '@mui/material';

const LoadingScreen: React.FC = () => {
  const theme = useTheme();
  const [dots, setDots] = useState('');

  // cycle between '', '.', '..', '...' every 400ms
  useEffect(() => {
    const id = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <Backdrop
      open
      sx={{
        color: '#fff',
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(255,255,255,0.3)',
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 200,
          minHeight: 200,
          backdropFilter: 'blur(10px)',
        }}
      >
        <CircularProgress
          thickness={5}
          size={60}
          sx={{ color: theme.palette.primary.main, mb: 2 }}
        />
        <Typography variant="h6" fontWeight={500}>
          Loading {dots}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingScreen;
