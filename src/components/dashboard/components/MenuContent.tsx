'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded'; // News icon

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, path: '/dashboard' },
  { text: 'Transactions', icon: <AnalyticsRoundedIcon />, path: '/transactions' },
  { text: 'Tasks', icon: <AssignmentRoundedIcon />, path: '/tasks' },
  { text: 'AI Feedback', icon: <PeopleRoundedIcon />, path: '/feedback' },
  { text: 'News', icon: <ArticleRoundedIcon />, path: '/news' },
];

const secondaryListItems = [
  { text: 'About', icon: <InfoRoundedIcon />, path: '/about' },
];

export default function MenuContent() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense sx={{ py: 0 }}>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
