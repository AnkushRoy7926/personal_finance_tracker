'use client';

import React from 'react';
import { Box, Typography, CircularProgress, Backdrop, useTheme } from '@mui/material';

const LoadingScreen = () => {
  const theme = useTheme();

  return (
    <Backdrop
      open
      sx={{
        color: '#fff',
        zIndex: (t) => t.zIndex.drawer + 1,
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
          boxShadow: 4,
          display: 'flex',
          backdropFilter: 'blur(10px)',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 220,
          minHeight:220,
          aspectRatio: '1 / 1',
        }}
      >
        <CircularProgress
          thickness={5}
          size={60}
          sx={{
            color: theme.palette.primary.main,
            mb: 2,
            animation: 'pulse 1.2s infinite ease-in-out',
          }}
        />
        <Typography variant="h6" fontWeight={500}>
          Loading<span className="dots">...</span>
        </Typography>
      </Box>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .dots::after {
          content: '';
          display: inline-block;
          width: 1em;
          text-align: left;
          animation: dots 1.5s steps(3, end) infinite;
        }

        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
      `}</style>
    </Backdrop>
  );
};

export default LoadingScreen;
