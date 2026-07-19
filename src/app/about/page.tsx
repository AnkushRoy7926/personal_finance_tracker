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
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import ArticleIcon from '@mui/icons-material/Article';
import LanguageIcon from '@mui/icons-material/Language';

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

const languages = ['Python', 'C++', 'JavaScript', 'TypeScript', 'Dart', 'HTML', 'CSS'];

const frameworks = [
  'Next.js', 'React', 'TensorFlow', 'Flask', 'Flutter',
  'Firebase', 'Material UI', 'Git', 'Linux',
];

const highlights = [
  {
    title: 'AI & Machine Learning',
    description: 'Building neural networks, logistic regression, and recommendation systems from scratch to truly understand how they work.',
  },
  {
    title: 'Systems Programming',
    description: 'From custom shells in C++ to low-level implementations, diving deep into how computers really work.',
  },
  {
    title: 'Web Development',
    description: 'Full-stack projects with modern frameworks like Next.js and Flask, turning ideas into real applications.',
  },
  {
    title: 'Open Source',
    description: 'Actively contributing to projects and collaborating with the developer community. Pull Shark on GitHub.',
  },
];

const projects = [
  {
    name: 'Neural Network from Scratch',
    description: 'Python implementation of a neural network for educational purposes — forward/backpropagation, activation functions, and gradient descent, all without ML libraries.',
    tech: ['Python', 'NumPy'],
  },
  {
    name: 'Linear & Logistic Regression from Scratch',
    description: 'Custom implementations of core ML algorithms in both Python and C++, with gradient descent optimization.',
    tech: ['Python', 'C++'],
  },
  {
    name: 'Movie Recommendation System',
    description: 'KNN-based movie recommendation engine built on the MovieLens dataset.',
    tech: ['Python', 'KNN'],
  },
  {
    name: 'Custom Shell in C++',
    description: 'A terminal emulator built from scratch — builtins, piping, scripting support, and more.',
    tech: ['C++', 'Linux'],
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar
                src="https://avatars.githubusercontent.com/u/97963983?v=4"
                alt="Ankush Roy"
                sx={{ width: 120, height: 120, mb: 2, border: '3px solid', borderColor: 'primary.main' }}
              />
              <Typography variant="h1" sx={{ fontSize: 'clamp(2rem, 6vw, 3rem)', mb: 1 }}>
                Ankush{' '}
                <Typography
                  component="span"
                  variant="h1"
                  sx={(theme) => ({
                    fontSize: 'inherit',
                    color: 'primary.main',
                    ...theme.applyStyles('dark', { color: 'primary.light' }),
                  })}
                >
                  Roy
                </Typography>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, lineHeight: 1.7 }}>
                Software developer from India passionate about AI, systems programming, and building
                things with code. Currently exploring machine learning and implementing algorithms from
                scratch.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <IconButton
                  component={Link}
                  href="https://github.com/AnkushRoy7926"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  color="primary"
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://www.linkedin.com/in/ankush-roy-7926ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  color="primary"
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://medium.com/@ankushroy7"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Medium blog"
                  color="primary"
                >
                  <ArticleIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://ankushroy.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Personal website"
                  color="primary"
                >
                  <LanguageIcon />
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

            <Divider />

            {/* What I Do */}
            <Box>
              <Typography variant="h2" sx={{ mb: 3, fontSize: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                What I do
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
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
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

            {/* Featured Projects */}
            <Box>
              <Typography variant="h2" sx={{ mb: 3, fontSize: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                Featured projects
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {projects.map((project) => (
                  <Card key={project.name} variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.65 }}>
                        {project.description}
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {project.tech.map((t) => (
                          <Chip key={t} label={t} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            <Divider />

            {/* Tech Stack */}
            <Box>
              <Typography variant="h2" sx={{ mb: 2, fontSize: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                Languages
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                {languages.map((lang) => (
                  <Chip key={lang} label={lang} variant="outlined" />
                ))}
              </Stack>

              <Typography variant="h2" sx={{ mb: 2, fontSize: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                Frameworks &amp; tools
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {frameworks.map((fw) => (
                  <Chip key={fw} label={fw} variant="outlined" />
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* This Project */}
            <Box>
              <Typography variant="h2" sx={{ mb: 2, fontSize: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                About this project
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                <strong>Project Pluto</strong> is a personal finance tracker built to keep things simple.
                No enterprise bloat — just a clean way to log transactions, track spending by category
                and payment mode, and get AI-powered insights on where your money goes. Built with
                Next.js, Material UI, and Firebase.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  component={Link}
                  href="https://github.com/AnkushRoy7926/personal_finance_tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Project source code"
                  color="primary"
                >
                  <GitHubIcon />
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
