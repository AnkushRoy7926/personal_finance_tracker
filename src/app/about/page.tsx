'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

import AppNavbar from '@src/components/dashboard/components/AppNavbar';
import Header from '@src/components/dashboard/components/Header';
import SideMenu from '@src/components/dashboard/components/SideMenu';
import AppTheme from '@src/components/shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '@src/components/dashboard/theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const techStack = [
  'Next.js', 'React', 'TypeScript', 'Material UI',
  'Firebase', 'Firestore', 'Vercel',
];

const highlights = [
  {
    icon: <AccountBalanceRoundedIcon />,
    title: 'Transaction Tracking',
    description: 'Log income and expenses with category, payment mode, and description. Supports UPI and Cash breakdowns.',
  },
  {
    icon: <InsightsRoundedIcon />,
    title: 'AI Financial Insights',
    description: 'Get a health score, detect spending anomalies, identify recurring payments, and receive personalized recommendations.',
  },
  {
    icon: <ShieldRoundedIcon />,
    title: 'Your Data, Your Device',
    description: 'All data lives in your personal Firebase project. No third-party servers, no data sharing, no tracking.',
  },
  {
    icon: <CodeRoundedIcon />,
    title: 'Open & Extensible',
    description: 'Built with modern web technologies. Clean architecture that\'s easy to understand, modify, and deploy.',
  },
];

function AboutContent(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar page="About" />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={4}
            sx={{
              mx: { xs: 1.5, sm: 3 },
              pb: 5,
              mt: { xs: 8, md: 0 },
              maxWidth: 900,
              width: '100%',
            }}
          >
            <Header page="About" />

            {/* Hero */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h1"
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(2rem, 6vw, 3rem)',
                  mb: 2,
                }}
              >
                Project&nbsp;
                <Typography
                  component="span"
                  variant="h1"
                  sx={(theme) => ({
                    fontSize: 'inherit',
                    color: 'primary.main',
                    ...theme.applyStyles('dark', { color: 'primary.light' }),
                  })}
                >
                  Pluto
                </Typography>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}>
                A personal finance tracker built for one person: you. Log transactions,
                see where your money goes, and stay in control without the bloat of
                enterprise software.
              </Typography>
            </Box>

            <Divider />

            {/* Highlights */}
            <Box>
              <Typography variant="h2" sx={{ mb: 3, fontSize: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                What it does
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                {highlights.map((item) => (
                  <Card key={item.title} variant="outlined" sx={{ height: '100%' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ color: 'primary.main', display: 'flex' }}>
                        {item.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            <Divider />

            {/* Tech Stack */}
            <Box>
              <Typography variant="h2" sx={{ mb: 2, fontSize: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                Built with
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {techStack.map((tech) => (
                  <Chip key={tech} label={tech} variant="outlined" />
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* Contact */}
            <Box>
              <Typography variant="h2" sx={{ mb: 2, fontSize: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                Get in touch
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65 }}>
                Have feedback, found a bug, or want to contribute? Reach out on GitHub or drop an email.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  component={Link}
                  href="https://github.com/AnkushRoy7926/personal_finance_tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                  color="primary"
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  href="mailto:ankushroy7926@outlook.com"
                  aria-label="Send email"
                  color="primary"
                >
                  <EmailIcon />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}

export default AboutContent;
