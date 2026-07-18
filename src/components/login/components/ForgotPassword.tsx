'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@src/firebaseConfig';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setStatus('sending');
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('sent');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setStatus('error');
    }
  };

  const handleDialogClose = () => {
    setEmail('');
    setStatus('idle');
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>
        {status === 'sent' ? (
          <DialogContentText color="success.main">
            Reset email sent. Check your inbox.
          </DialogContentText>
        ) : (
          <>
            <OutlinedInput
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              label="Email address"
              placeholder="Email address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'sending'}
            />
            {status === 'error' && (
              <DialogContentText color="error">
                Failed to send reset email. Check the address and try again.
              </DialogContentText>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleDialogClose}>
          {status === 'sent' ? 'Close' : 'Cancel'}
        </Button>
        {status !== 'sent' && (
          <Button variant="contained" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send reset link'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
