import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { Box } from '@mui/material';

import { auth, db } from '@src/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function FillUpCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [upi, setUpi] = React.useState(0);
  const [cash, setCash] = React.useState(0);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUpi(data.upi || 0);
        setCash(data.cash || 0);
      }
    };

    fetchUserData();
  }, []);

  const total = upi + cash;
  const upiPercent = total ? (upi / total) * 100 : 0;
  const cashPercent = total ? (cash / total) * 100 : 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
  <Box>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1,
      }}
    >
      <AccountBalanceWalletRoundedIcon sx={{ fontSize: 26 }} />
      <Typography
        component="h2"
        variant="subtitle2"
        sx={{ fontWeight: 700 }}
      >
        Wallet Breakdown
      </Typography>
    </Box>

    <Box sx={{ mb: 2 }}>
      <Typography variant="body2">
        <strong>UPI:</strong> ₹{upi}
      </Typography>
      <Typography variant="body2">
        <strong>Cash:</strong> ₹{cash}
      </Typography>
    </Box>
  </Box>

  {/* Centered thin stacked bar */}
  <Box sx={{ textAlign: 'center' }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 8,
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: theme.palette.grey[300],
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          width: `${upiPercent}%`,
          height: '100%',
          backgroundColor: theme.palette.success.main,
        }}
      />
      <Box
        sx={{
          width: `${cashPercent}%`,
          height: '100%',
          backgroundColor: theme.palette.warning.main,
        }}
      />
    </Box>

    <Box
      sx={{
        mt: 0.5,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'text.secondary',
      }}
    >
      <span>UPI {upiPercent.toFixed(0)}%</span>
      <span>Cash {cashPercent.toFixed(0)}%</span>
    </Box>
  </Box>
</CardContent>

    </Card>
  );
}
