'use client';

import * as React from 'react';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import { addTransactionAndUpdateStats } from '@src/utils/transaction';
import { auth } from '@src/firebaseConfig';
import { useRouter } from 'next/navigation';
import { TRANSACTION_CATEGORIES, TransactionCategory } from '@src/utils/fetchDataFB';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function QuickAddFAB() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<'Saving' | 'Spent'>('Spent');
  const [mode, setMode] = React.useState<'UPI' | 'Cash'>('UPI');
  const [amount, setAmount] = React.useState<number | ''>('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<TransactionCategory>('Other');
  const [submitting, setSubmitting] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = async () => {
    if (amount === '' || amount <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid amount.', severity: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      let validAmount = Math.abs(amount);
      if (type === 'Spent') validAmount = -validAmount;

      await addTransactionAndUpdateStats(auth.currentUser?.uid || '', {
        amount: validAmount,
        type,
        mode,
        description: description.trim() || undefined,
        category,
      });

      setSnackbar({
        open: true,
        message: `${type === 'Spent' ? 'Expense' : 'Savings'} of ₹${Math.abs(amount).toLocaleString()} added.`,
        severity: 'success',
      });
      setOpen(false);
      resetForm();
      router.refresh();
    } catch {
      setSnackbar({ open: true, message: 'Failed to add transaction.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setType('Spent');
    setMode('UPI');
    setAmount('');
    setDescription('');
    setCategory('Other');
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add transaction"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 24, sm: 32 },
          right: { xs: 24, sm: 32 },
          zIndex: 1200,
          boxShadow: 4,
        }}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Quick Add Transaction</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Amount (₹)"
              variant="outlined"
              size="small"
              fullWidth
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
              inputProps={{ min: 0 }}
              autoFocus
            />
            <FormControl size="small" fullWidth>
              <InputLabel id="fab-type-label">Type</InputLabel>
              <Select
                labelId="fab-type-label"
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value as 'Saving' | 'Spent')}
              >
                <MenuItem value="Spent">Spent</MenuItem>
                <MenuItem value="Saving">Saving</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel id="fab-mode-label">Mode</InputLabel>
              <Select
                labelId="fab-mode-label"
                value={mode}
                label="Mode"
                onChange={(e) => setMode(e.target.value as 'UPI' | 'Cash')}
              >
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel id="fab-category-label">Category</InputLabel>
              <Select
                labelId="fab-category-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              >
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description (optional)"
              size="small"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
