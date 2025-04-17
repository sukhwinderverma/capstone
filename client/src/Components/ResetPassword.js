import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      setError(true);
      setOpen(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4005/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ResetPassword($email: String!, $newPassword: String!) {
              resetPassword(email: $email, newPassword: $newPassword) {
                success
                message
              }
            }
          `,
          variables: {
            email,
            newPassword,
          },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setMessage(data.data.resetPassword.message);
      setError(!data.data.resetPassword.success);
      setOpen(true);

      if (data.data.resetPassword.success) {
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setMessage(err.message);
      setError(true);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'url("https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
      }}
    >
      <Container maxWidth="sm" sx={{ marginTop: '100px' }}>
        <Box
          sx={{
            padding: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: 3, color: '#0277bd' }}>
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 3, padding: '12px' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </form>
        </Box>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
      />
    </Box>
  );
}

export default ResetPassword;