import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiAvatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  color: (theme.vars || theme).palette.common.white,
  fontWeight: 600,
  fontSize: 18,
}));

export default function CompanyHeader() {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{
        px: 1,
        pb: 1,
        width: '100%',
      }}
    >
      <Avatar alt="FinTrack Logo">F</Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', pt: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{mb: 0, lineHeight: 1.2, fontSize: '1.2rem'}}>
          FinTrack
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0 }}>
          Track smarter. Save faster.
        </Typography>
      </Box>
    </Box>
  );
}
