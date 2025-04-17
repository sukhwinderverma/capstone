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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountCircle, Lock, Visibility, VisibilityOff, Email } from "@mui/icons-material";

const ForgotPasswordDialog = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleVerify = async () => {
    if (!fullName || !email) {
      setMessage("Please fill in all fields");
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4005/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query VerifyUser($fullName: String!, $email: String!) {
              verifyUser(fullName: $fullName, email: $email) {
                success
                message
              }
            }
          `,
          variables: { fullName, email },
        }),
      });

      const data = await response.json();
      if (data.errors) throw new Error(data.errors[0].message);

      if (data.data.verifyUser.success) {
        setStep(2);
        setMessage("");
      } else {
        setMessage(data.data.verifyUser.message);
        setError(true);
      }
    } catch (err) {
      setMessage(err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== rePassword) {
      setMessage("Passwords do not match!");
      setError(true);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4005/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation ResetPassword($email: String!, $newPassword: String!) {
              resetPassword(email: $email, newPassword: $newPassword) {
                success
                message
              }
            }
          `,
          variables: { email, newPassword },
        }),
      });

      const data = await response.json();
      if (data.errors) throw new Error(data.errors[0].message);

      if (data.data.resetPassword.success) {
        setMessage(data.data.resetPassword.message);
        setError(false);
        setTimeout(() => {
          onClose();
          setStep(1);
          setFullName("");
          setEmail("");
          setNewPassword("");
          setRePassword("");
        }, 2000);
      } else {
        setMessage(data.data.resetPassword.message);
        setError(true);
      }
    } catch (err) {
      setMessage(err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", color: "#0277bd" }}>
        {step === 1 ? "Forgot Password" : "Reset Password"}
      </DialogTitle>
      <DialogContent>
        {message && (
          <Typography color={error ? "error" : "primary"} sx={{ mb: 2, textAlign: "center" }}>
            {message}
          </Typography>
        )}
        {step === 1 ? (
          <>
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </>
        ) : (
          <>
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Re-enter New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: "16px 24px" }}>
        {step === 1 ? (
          <>
            <Button onClick={onClose} color="secondary">Cancel</Button>
            <Button onClick={handleVerify} color="primary" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Verify"}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setStep(1)} color="secondary">Back</Button>
            <Button onClick={handleResetPassword} color="primary" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Reset Password"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    // ✅ Admin check
    if (trimmedEmail === "admin@admin.com" && trimmedPassword === "admin123") {
      const adminUser = {
        userType: "admin",
        fullName: "Admin",
        email: "admin@admin.com",
        id: "admin",
      };
      localStorage.setItem("user", JSON.stringify(adminUser));
      navigate("/admin", { replace: true });
      window.location.reload();
      return;
    }
  
    try {
      const response = await fetch("http://localhost:4005/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation {
            login(email: "${trimmedEmail}", password: "${trimmedPassword}") {
              message
              user {
                userType
                id
                fullName
                email
                blocked
              }
            }
          }`,
        }),
      });
  
      const data = await response.json();
      setLoading(false);
  
      if (data.errors) {
        setMessage(data.errors[0].message);
        setError(true);
      } else {
        const user = data.data.login.user;
  
        // Check if the user is blocked
        if (user.blocked) {
          setMessage("Your account has been blocked. Please email on support@jobportal.com.");
          setError(true);
          setOpen(true);
          return; // Stop the login process if blocked
        }
  
        setMessage(data.data.login.message);
        setError(false);
  
        localStorage.setItem("user", JSON.stringify(user));
  
        const userType = user.userType;
        if (userType === "jobSeeker") {
          navigate("/job-seeker-dashboard", { replace: true });
        } else if (userType === "employer") {
          navigate("/employer-dashboard", { replace: true });
        }
  
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      setMessage("Error: " + error.message);
      setError(true);
      setOpen(true);
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
        backgroundImage:
          'url("https://images.unsplash.com/uploads/141103282695035fa1380/95cdfeef?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8am9iJTIwcG9ydGFsfGVufDB8fDB8fHww")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "0 10px",
      }}
    >
      <Container maxWidth="sm" sx={{ marginTop: "100px", paddingBottom: "50px" }}>
        <Box
          sx={{
            padding: "40px",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: "12px",
            boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: 2, color: "#0277bd", fontWeight: 700, fontSize: "32px" }}>
            Job Portal Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{ marginBottom: 3 }}
              InputProps={{
                startAdornment: <AccountCircle sx={{ color: "#0277bd" }} />,
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{ marginBottom: 3 }}
              InputProps={{
                startAdornment: <Lock sx={{ color: "#0277bd" }} />,
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                padding: "12px",
                marginTop: 3,
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#01579b",
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>

          <Box sx={{ marginTop: 3, display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2" sx={{ color: "#555", fontWeight: 600 }}>
              Don't have an account?{" "}
              <Link href="/signup" sx={{ color: "#0277bd", fontWeight: "bold", textDecoration: "underline" }}>
                Sign Up
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", fontWeight: 600 }}>
              Forgot your password?{" "}
              <Link
                component="button"
                onClick={() => setForgotPasswordOpen(true)}
                sx={{ color: "#0277bd", fontWeight: "bold", textDecoration: "underline" }}
              >
                Reset Password
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} message={message} />

      <ForgotPasswordDialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
    </Box>
  );
}
