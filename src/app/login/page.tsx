'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { loginUser } from '@/src/api/authapi';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  PersonOutlined,
  PersonOutlineOutlined,
} from '@mui/icons-material';


import AppButton from '@/src/components/AppButton';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
const router = useRouter();

 const handleLogin = async () => {
  setLoading(true);
  setError('');

  try {
    const data = await loginUser({
      username,
      password,
      expiresInMins: 30,
    });

    localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('isLoggedIn', 'true');

 router.push('/dashboard');
    console.log('Login successful:', data);

  } catch (error) {
    console.error('Login failed:', error);
    setError('Invalid username or password');
  } finally {
    setLoading(false);
  }
};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #eef7ff 0%, #f8fbff 50%, #e9f9ff 100%)',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
            borderRadius: 4,
            maxWidth: 460,
            mx: 'auto',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              textAlign: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #0072FF, #00C6FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <LockOutlined
                sx={{
                  color: 'white',
                  fontSize: 30,
                }}
              />
            </Box>

            <Typography
              variant="h4"
//fontWeight={700}
              gutterBottom
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Sign in to continue to your account
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {/* Username */}
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            autoComplete="username"
         slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <PersonOutlined color="action" />
        </InputAdornment>
      ),
    },
  }}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            autoComplete="current-password"
            slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <LockOutlined color="action" />
        </InputAdornment>
      ),
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
    },
  }}
          />

          {/* Login Button */}
          <AppButton
            fullWidth
            type="button"
            variant="primary"
            loading={loading}
            loadingText="Signing in..."
            onClick={handleLogin}
            sx={{
              height: 50,
              mt: 3,
              fontSize: 15,
            }}
          >
            Sign In
          </AppButton>

          {/* Demo credentials */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: '#f5f7fa',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
             sx= {{ display: 'block',
              textAlign:'center'}}
            >
              Demo credentials
            </Typography>

            <Typography
              variant="body2"
             
              sx={{ mt: 0.5 ,
                 textAlign: 'center',
              }}
            >
              Username: <strong>emilys</strong>
            </Typography>

            <Typography
              variant="body2"
              sx = {{
                 textAlign: 'center',
              }}
             
            >
              Password: <strong>emilyspass</strong>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}