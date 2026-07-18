'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import Link from 'next/link';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';

const items = [
  {
    icon: <DashboardRoundedIcon />,
    title: 'Interactive dashboard',
    description:
      'See your income, expenses, and balance at a glance. Charts and summaries update as you log new transactions.',
    color: 'hsl(210, 98%, 48%)',
  },
  {
    icon: <ReceiptLongRoundedIcon />,
    title: 'Transaction tracking',
    description:
      'Log purchases, split recurring charges, and categorize spending so nothing slips through the cracks.',
    color: 'hsl(120, 44%, 53%)',
  },
  {
    icon: <ChatRoundedIcon />,
    title: 'AI-powered insights',
    description:
      'Ask your finances questions in plain language. Get answers about trends, budgets, and upcoming bills.',
    color: 'hsl(260, 60%, 55%)',
  },
];

interface ChipProps {
  selected?: boolean;
}

const Chip = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<ChipProps>(({ theme, selected }) => ({
  background: selected
    ? 'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))'
    : 'inherit',
  color: selected ? 'hsl(0, 0%, 100%)' : 'inherit',
  borderColor: selected
    ? (theme.vars || theme).palette.primary.light
    : 'inherit',
  '& .MuiChip-label': {
    color: selected ? 'hsl(0, 0%, 100%)' : 'inherit',
  },
  ...(selected
    ? theme.applyStyles('dark', {
        borderColor: (theme.vars || theme).palette.primary.dark,
      })
    : {}),
}));

interface MobileLayoutProps {
  selectedItemIndex: number;
  handleItemClick: (index: number) => void;
  selectedFeature: (typeof items)[0];
}

export function MobileLayout({
  selectedItemIndex,
  handleItemClick,
  selectedFeature,
}: MobileLayoutProps) {
  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto', pb: 1 }}>
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            minHeight: 200,
            bgcolor: 'action.hover',
            borderRadius: 'inherit',
          }}
        >
          <Box sx={{ color: selectedFeature.color, display: 'flex' }}>
            {React.cloneElement(selectedFeature.icon, { sx: { fontSize: 64 } })}
          </Box>
        </Box>
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 'medium' }}
          >
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          What it does
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          Three core features that cover the essentials: see the big picture, log
          what you spend, and ask questions about your habits.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
        }}
      >
        <div>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Box
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    height: '100%',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: (theme.vars || theme).palette.action.hover,
                    },
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: 'action.selected',
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      gap: 1,
                      textAlign: 'left',
                      textTransform: 'none',
                      color: 'text.secondary',
                    },
                    selectedItemIndex === index && {
                      color: 'text.primary',
                    },
                  ]}
                >
                  {icon}

                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2">{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        </div>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', md: '70%' },
            height: 'var(--items-image-height)',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                m: 'auto',
                width: 420,
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'action.hover',
                borderRadius: 1,
              }}
            >
              <Box
                sx={{
                  color: items[selectedItemIndex]?.color ?? 'primary.main',
                  display: 'flex',
                  transition: 'color 0.3s',
                }}
              >
                {items[selectedItemIndex] &&
                  React.cloneElement(items[selectedItemIndex].icon, {
                    sx: { fontSize: 96 },
                  })}
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
