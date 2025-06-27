import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  Stack,
  Chip,
} from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { auth, db } from '@src/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function FillUpCard() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const [upi, setUpi] = React.useState(0);
  const [cash, setCash] = React.useState(0);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const { upi = 0, cash = 0 } = snap.data();
        setUpi(upi);
        setCash(cash);
      }
    };
    fetchUserData();
  }, []);

  const total = upi + cash;
  const upiPct = total ? (upi / total) * 100 : 0;
  const cashPct = total ? (cash / total) * 100 : 0;

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 1,
        // original box color & border
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <CardHeader
        avatar={
          <AccountBalanceWalletRoundedIcon
            sx={{ color: theme.palette.primary.main, fontSize: 30 }}
          />
        }
        title={
          <Typography variant="subtitle1" fontWeight={600}>
            Wallet Breakdown
          </Typography>
        }
        sx={{ pb: 0 }}
      />

      <CardContent sx={{ pt: 1 }}>
        <Stack
          direction={isSmall ? 'column' : 'row'}
          justifyContent="space-between"
          spacing={isSmall ? 1 : 2}
          mb={2}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              UPI
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              ₹{upi}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Cash
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              ₹{cash}
            </Typography>
          </Box>
          <Box textAlign={isSmall ? 'left' : 'right'}>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              ₹{total}
            </Typography>
          </Box>
        </Stack>

        {/* Stacked thin bar */}
        <Box sx={{ position: 'relative', mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              height: 8,
              borderRadius: 1,
              overflow: 'hidden',
              backgroundColor: theme.palette.grey[300],
            }}
          >
            <Box
              sx={{
                width: `${upiPct}%`,
                bgcolor: "#00897b",
                transition: 'width 0.8s ease',
              }}
            />
            <Box
              sx={{
                width: `${cashPct}%`,
                // bgcolor: theme.palette.warning.main,
                bgcolor: "#8bc34a",
                transition: 'width 0.8s ease',
              }}
            />
          </Box>

          {/* UPI percentage chip */}
          <Box
            sx={{
              position: 'absolute',
              top: -14,
              left: `calc(${upiPct}% - 20px)`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* <Chip
              label={`${upiPct.toFixed(0)}% UPI`}
              size="small"
              sx={{
                bgcolor: theme.palette.success.light,
                fontWeight: 600,
              }}
            /> */}
          </Box>
        </Box>

        {/* Percent labels */}
        <Box
          display="flex"
          justifyContent="space-between"
          fontSize="0.75rem"
          color="text.secondary"
        >
          <span>UPI: {upiPct.toFixed(0)}%</span>
          <span>Cash: {cashPct.toFixed(0)}%</span>
        </Box>
      </CardContent>
    </Card>
  );
}
