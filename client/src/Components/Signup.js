import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Snackbar,
  Container,
  CircularProgress,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Person, Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [userType, setUserType] = useState(""); 
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== rePassword) {
      setMessage("Passwords do not match!");
      setOpen(true);
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address!");
      setOpen(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4005/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation Signup($fullName: String!, $email: String!, $password: String!, $userType: String!) {
              signup(fullName: $fullName, email: $email, password: $password, userType: $userType) {
                id
                fullName
                email
                userType
              }
            }`,
          variables: {
            fullName,
            email,
            password,
            userType,
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        setMessage(`Error: ${data.errors[0].message}`);
        setOpen(true);
      } else {
        setFullName("");
        setEmail("");
        setPassword("");
        setRePassword("");
        setUserType("");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Signup failed. Please try again.");
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
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: 'url("https://t3.ftcdn.net/jpg/09/61/27/48/360_F_961274808_fX06eKzHJDCX9LO1Uew8YsL8Gk7RDZBu.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '0 10px',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              padding: "30px",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              borderRadius: "8px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{ marginBottom: 2, color: "rgb(1, 92, 166)" }}
            >
              Sign Up
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{
                  backgroundColor: "white",
                  marginBottom: 2,
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#ccc",
                  },
                }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{
                  backgroundColor: "white",
                  marginBottom: 2,
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#ccc",
                  },
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{
                  backgroundColor: "white",
                  marginBottom: 2,
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#ccc",
                  },
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
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
                }}
              />
              <TextField
                label="Re-password"
                type={showRePassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{
                  backgroundColor: "white",
                  marginBottom: 2,
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#ccc",
                  },
                }}
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowRePassword(!showRePassword)}
                        edge="end"
                      >
                        {showRePassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  label="Account Type"
                >
                  <MenuItem value="jobSeeker">Job Seeker</MenuItem>
                  <MenuItem value="employer">Employer</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  padding: "10px",
                  marginTop: 2,
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "rgb(1, 92, 166)",
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign Up"}
              </Button>
            </form>
            <Box textAlign="center" color="red" sx={{ marginTop: 2 }}>
              <Typography variant="body2" align="center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  sx={{
                    textDecoration: "underline",
                    color: "rgb(1, 92, 166)",
                    fontWeight: "bold",
                    "&:hover": {
                      color: "rgb(0, 70, 130)",
                    },
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
      />

      
    </Box>
  );
}
