'use client';

import React from 'react';
import { Container, Box, Typography, Avatar, Link, IconButton, Chip, Divider, Paper } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useTheme } from '@mui/material/styles';

// Firebase imports
import { auth, db } from '@src/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function AboutPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{
      bgcolor: isDark ? '#0c0e15' : theme.palette.background.default,
      color: theme.palette.text.primary,
      minHeight: '100vh',
      py: 8,
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Avatar
            alt="Your Name"
            src="/images/profile.jpg"
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 2,
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.primary.main }}>
            About Me
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: 600, mx: 'auto', color: theme.palette.text.secondary }}
          >
            Hello! I'm <strong>Your Name</strong>, a passionate programmer and tech enthusiast specializing in web development, machine learning, and physics simulations. I love crafting clean, performant code and learning new technologies.
          </Typography>
        </Box>

        <Divider sx={{ mb: 6, borderColor: theme.palette.divider }} />

        {/* Content Sections */}
        <Grid2 container spacing={4}>
          {/* Background */}
          <Grid2 xs={12} md={6}>
            {/* <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: isDark ? '#161b2d' : theme.palette.background.paper,
                borderColor: theme.palette.divider,
              }}
            > */}
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Background
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                I started coding in high school and have explored languages like Python, C++, Rust, and JavaScript. My academic journey includes projects on neural networks, real-time physics simulations, and full-stack web apps. I'm currently diving deeper into generative AI and building interactive user interfaces with modern frameworks.
              </Typography>
            {/* </Paper> */}
          </Grid2>

          {/* Skills */}
          <Grid2 xs={12} md={6}>
            {/* <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: isDark ? '#161b2d' : theme.palette.background.paper,
                borderColor: theme.palette.divider,
              }}
            > */}
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Skills & Tools
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['React', 'Next.js', 'Material UI', 'Python', 'C++', 'Rust', 'Firebase', 'Docker', 'TensorFlow'].map(skill => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{
                      bgcolor: isDark ? theme.palette.grey[800] : theme.palette.grey[200],
                      color: theme.palette.text.primary,
                    }}
                  />
                ))}
              </Box>
            {/* </Paper> */}
          </Grid2>

          {/* Hobbies */}
          <Grid2 xs={12} md={6}>
            {/* <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: isDark ? '#161b2d' : theme.palette.background.paper,
                borderColor: theme.palette.divider,
              }}
            > */}
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Hobbies
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Apart from coding, I enjoy reading about astrophysics, solving math puzzles, and participating in hackathons. I'm also an avid photo editor and love creating digital art in my free time.
              </Typography>
            {/* </Paper> */}
          </Grid2>

          {/* Contact */}
          <Grid2 xs={12} md={6}>
            {/* <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: isDark ? '#161b2d' : theme.palette.background.paper,
                borderColor: theme.palette.divider,
              }}
            > */}
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Connect with me
              </Typography>
              <Box>
                <IconButton component={Link} href="mailto:youremail@example.com" color="primary">
                  <EmailIcon />
                </IconButton>
                <IconButton component={Link} href="https://github.com/yourusername" target="_blank" color="primary">
                  <GitHubIcon />
                </IconButton>
                <IconButton component={Link} href="https://linkedin.com/in/yourprofile" target="_blank" color="primary">
                  <LinkedInIcon />
                </IconButton>
              </Box>
            {/* </Paper> */}
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
