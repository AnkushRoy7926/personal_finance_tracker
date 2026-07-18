'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import Link from 'next/link';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';

const features = [
  { icon: <AccountBalanceRoundedIcon />, label: 'Track every dollar' },
  { icon: <InsightsRoundedIcon />, label: 'Visualize spending' },
  { icon: <ShieldRoundedIcon />, label: 'Your data, your device' },
];

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={3}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
            }}
          >
            Project&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              Pluto
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
              fontSize: 'clamp(0.95rem, 2vw, 1.125rem)',
              lineHeight: 1.6,
            }}
          >
            A personal finance tracker built for one person: you. Log transactions,
            see where your money goes, and stay in control without the bloat of
            enterprise software.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            useFlexGap
            sx={{ pt: 1 }}
          >
            <Button
              variant="contained"
              color="primary"
              size="medium"
              component={Link}
              href="/signup"
              sx={{ minWidth: 'fit-content' }}
            >
              Get started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              component={Link}
              href="/dashboard"
              sx={{ minWidth: 'fit-content' }}
            >
              View dashboard
            </Button>
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 3 }}
            useFlexGap
            sx={{ pt: 2 }}
          >
            {features.map((f) => (
              <Stack
                key={f.label}
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ alignItems: 'center', color: 'text.secondary' }}
              >
                <Box sx={{ display: 'flex', color: 'primary.main' }}>{f.icon}</Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {f.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
