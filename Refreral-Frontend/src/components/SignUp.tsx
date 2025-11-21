import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  GitHub,
  Visibility,
  VisibilityOff,
  PersonAdd,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { toast } from "react-toastify";

interface ErrorState {
  username?: string;
  email?: string;
  password?: string;
}

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [errors, setErrors] = useState<ErrorState>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#90caf9" : "#1976d2" },
    },
  });

  const validateUsername = (u: string): string => {
    if (!u) return "Username is required";
    if (u.length < 3) return "Minimum 3 characters required";
    if (u.length > 20) return "Maximum 20 characters allowed";
    if (!/^[a-zA-Z0-9_]+$/.test(u))
      return "Only letters, numbers and _ allowed";
    return "";
  };

  const validateEmail = (e: string): string => {
    if (!e) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(e)) return "Invalid email format";
    return "";
  };

  const validatePassword = (p: string): string => {
    if (!p) return "Password is required";
    if (p.length < 8) return "Min 8 characters required";
    if (!/[a-z]/.test(p)) return "At least 1 lowercase letter";
    if (!/[A-Z]/.test(p)) return "At least 1 uppercase letter";
    if (!/\d/.test(p)) return "At least 1 number";
    if (!/[@$!%*?&]/.test(p)) return "At least 1 special character (@$!%*?&)";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: ErrorState = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);
    setTouched({ username: true, email: true, password: true });

    if (newErrors.username || newErrors.email || newErrors.password) {
      toast.error("Fix the validation errors");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://referral-project.onrender.com/auth/signup",
        { username, email, password, auth_type: "Credentials" },
        { withCredentials: true }
      );

      toast.success(res.data?.message || "Signup successful");

      setTimeout(() => navigate("/signin"), 1200);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      window.location.href =
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=44992330024-6ru43vbhi3agflros0lbi6ar3g1c7nce.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=profile email`;
    } else {
      window.location.href =
        "https://referral-project.onrender.com/auth/github";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Fade in timeout={400}>
          <Paper sx={{ p: 4, maxWidth: 430 }} elevation={10}>
            <Typography variant="h4" fontWeight="bold" align="center">
              Create an account
            </Typography>

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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={isLoading}
                startIcon={!isLoading && <PersonAdd />}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Paper>
        </Fade>
      </Box>
    </ThemeProvider>
  );
};

export default SignUp;
