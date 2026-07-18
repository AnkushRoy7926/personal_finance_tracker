import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import PhonelinkRoundedIcon from '@mui/icons-material/PhonelinkRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import OfflineBoltRoundedIcon from '@mui/icons-material/OfflineBoltRounded';
import PrivacyTipRoundedIcon from '@mui/icons-material/PrivacyTipRounded';

const items = [
  {
    icon: <StorageRoundedIcon />,
    title: 'Firebase backend',
    description:
      'Authentication and data storage handled by Firebase. Your information lives in your own project, not on someone else\'s server.',
  },
  {
    icon: <PhonelinkRoundedIcon />,
    title: 'Works on any device',
    description:
      'Responsive layout adapts from phone to ultrawide. Log a transaction on your commute, check your chart on your laptop.',
  },
  {
    icon: <CodeRoundedIcon />,
    title: 'Open to read',
    description:
      'Built with Next.js, MUI, and TypeScript. Every component is something you can learn from, modify, or extend.',
  },
  {
    icon: <DarkModeRoundedIcon />,
    title: 'Dark mode',
    description:
      'System-aware color scheme toggle. Use it at night without burning your retinas, or switch manually.',
  },
  {
    icon: <OfflineBoltRoundedIcon />,
    title: 'Fast by default',
    description:
      'Server-side rendering and optimized bundling keep the interface snappy even on modest hardware.',
  },
  {
    icon: <PrivacyTipRoundedIcon />,
    title: 'No tracking',
    description:
      'No analytics scripts, no ad pixels, no third-party trackers. Just a tool that does its job and nothing else.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Under the hood
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            The decisions that make Project Pluto what it is: a small, honest stack
            with no unnecessary dependencies.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
