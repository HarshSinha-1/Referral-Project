import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Fade,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import {
  GitHub,
  Visibility,
  VisibilityOff,
  PersonAdd,
  DarkMode,
  LightMode,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Google Logo
const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Theme for Dark Mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: darkMode ? '#90caf9' : '#1976d2' },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    }
  });

  // Validation Methods
  const validateUsername = (u) => {
    if (!u) return 'Username is required';
    if (u.length < 3) return 'Username must be at least 3 characters';
    if (u.length > 20) return 'Username must be less than 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(u)) return 'Only letters, numbers, and _ allowed';
    return '';
  };

  const validateEmail = (e) => {
    if (!e) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(e)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (p) => {
    if (!p) return 'Password is required';
    if (p.length < 8) return 'Min 8 characters required';
    if (!/[a-z]/.test(p)) return 'At least 1 lowercase letter';
    if (!/[A-Z]/.test(p)) return 'At least 1 uppercase letter';
    if (!/\d/.test(p)) return 'At least 1 number';
    if (!/[@$!%*?&]/.test(p)) return 'At least 1 special character (@$!%*?&)';
    return '';
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    const newErrors = { username: usernameErr, email: emailErr, password: passwordErr };
    setErrors(newErrors);
    setTouched({ username: true, email: true, password: true });

    if (usernameErr || emailErr || passwordErr) {
      toast.error('Fix the validation errors');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        'https://referral-project.onrender.com/auth/signup',
        { username, email, password, auth_type: 'Credentials' },
        { withCredentials: true }
      );

      toast.success(res.data?.message || 'Signup successful');

      // Redirect directly to Signin
      setTimeout(() => navigate('/signin'), 1200);

    } catch (error) {
      toast.error(error?.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === 'Google') {
      window.location.href =
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=44992330024-6ru43vbhi3agflros0lbi6ar3g1c7nce.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=profile email`;
    } else {
      window.location.href ='https://referral-project.onrender.com/auth/github';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: '100vh',
          background: darkMode
            ? 'radial-gradient(circle, #1a1a1a 0%, #0d1117 100%)'
            : 'radial-gradient(circle, #f2f2f2 0%, #dcdcdc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          position: 'relative'
        }}
      >

        {/* Dark Mode Toggle */}
        <IconButton
          onClick={() => setDarkMode(!darkMode)}
          sx={{ position: 'absolute', top: 20, right: 20 }}
        >
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>

        <Fade in timeout={500}>
          <Paper
            elevation={10}
            sx={{
              p: 4,
              maxWidth: 430,
              width: '100%',
              borderRadius: 4,
              backdropFilter: 'blur(20px)'
            }}
          >
            <Typography variant="h4" fontWeight="bold" align="center" mb={1}>
              Create an account
            </Typography>
            <Typography variant="body2" align="center" mb={4} color="text.secondary">
              Join the next generation platform
            </Typography>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                margin="normal"
              />

              {/* Email */}
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                margin="normal"
              />

              {/* Password */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: 2 }}
                disabled={isLoading}
                startIcon={!isLoading && <PersonAdd />}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
            </form>

            <Typography align="center" mb={3}>
              Already have an account?{' '}
              <Link to="/signin" style={{ fontWeight: 'bold', textDecoration: 'none' }}>
                Sign in
              </Link>
            </Typography>

            <Divider>OR</Divider>

            <Stack spacing={2} mt={3}>
              <Button variant="outlined" fullWidth onClick={() => handleSocialLogin('Google')}>
                <GoogleLogo /> Continue with Google
              </Button>

              <Button variant="outlined" fullWidth startIcon={<GitHub />} onClick={() => handleSocialLogin('GitHub')}>
                Continue with GitHub
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Box>
    </ThemeProvider>
  );
};

export default SignUp;
