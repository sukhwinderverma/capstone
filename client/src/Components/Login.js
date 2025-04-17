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

const GRAPHQL_URL = "https://capstone-server2-2qh1.onrender.com/graphql";

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
    setTimeout(() => {
      if (loading) setMessage("Waking up server, please wait...");
    }, 10000);

    try {
      const response = await fetch(GRAPHQL_URL, {
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
      const response = await fetch(GRAPHQL_URL, {
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

    setTimeout(() => {
      if (loading) setMessage("Server might be waking up. Please wait...");
    }, 10000);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

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
      const response = await fetch(GRAPHQL_URL, {
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
        setOpen(true);
      } else {
        const user = data.data.login.user;

        if (user.blocked) {
          setMessage("Your account has been blocked. Please email on support@jobportal.com.");
          setError(true);
          setOpen(true);
          return;
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
          'url("https://images.unsplash.com/uploads/141103282695035fa1380/95cdfeef?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 3,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h3" color="primary">
            Login
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
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
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link href="#" variant="body2" onClick={() => setForgotPasswordOpen(true)}>
            Forgot Password?
          </Link>
        </Box>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} message={message} />
      </Container>

      <ForgotPasswordDialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
    </Box>
  );
}
