import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { addTransactionAndUpdateStats } from '@src/utils/transaction';
import { auth } from '@src/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function TransactionCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [type, setType] = React.useState<'Saving' | 'Spent'>('Saving');
  const [mode, setMode] = React.useState<'UPI' | 'Cash'>('UPI');
  const [amount, setAmount] = React.useState<number | ''>('');
  const [description, setDescription] = React.useState('');

  const handleTransaction = async () => {
    if (amount === '' || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    let validAmount = Math.abs(amount); 
    if (type === 'Spent') {
      validAmount = -validAmount; // Ensure spent amounts are negative
    }
    console.log(`Transaction: ${type}, Mode: ${mode}, Amount: ₹${amount}`);
    await addTransactionAndUpdateStats(auth.currentUser?.uid || '', {
      amount: validAmount,
      type,
      mode,
      description: description.trim() || undefined,
    });
    router.refresh();
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <InsightsRoundedIcon />
        <Typography
          component="h2"
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: '600' }}
        >
          Add a Transaction
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Enter the amount, type, and mode of your transaction.
        </Typography>

        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Amount (₹)"
            variant="outlined"
            size="small"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))
            }
            inputProps={{ min: 0 }}
          />


          <FormControl size="small" fullWidth>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value as 'Saving' | 'Spent')}
            >
              <MenuItem value="Saving">Saving</MenuItem>
              <MenuItem value="Spent">Spent</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="mode-label">Mode</InputLabel>
            <Select
              labelId="mode-label"
              value={mode}
              label="Mode"
              onChange={(e) => setMode(e.target.value as 'UPI' | 'Cash')}
            >
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description (optional)"
            size="small"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 1 }}
          />
        </Stack>

        <Button
          variant="contained"
          size="small"
          color="primary"
          endIcon={<ChevronRightRoundedIcon />}
          fullWidth={isSmallScreen}
          onClick={handleTransaction}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
