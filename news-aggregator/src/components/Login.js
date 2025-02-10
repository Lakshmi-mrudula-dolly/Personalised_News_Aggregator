import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, Alert, CircularProgress } from "@mui/material";
import backgroundImage from "./Images/img1.jpeg";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages
    try {
      const response = await axios.post(
        "http://localhost:9000/api/login",
        { email, password }//,
      );

      if (response.data.message === "Login successful") {
        onLogin(true, "", email);
        setMessage("Login successful");
        sessionStorage.setItem("email", email);
      } else {
        onLogin(false, "Invalid credentials");
        setMessage("Login failed: Invalid credentials");
      }
    } catch (error) {
      if (error.response) {
        setMessage("Login failed: " + error.response.data.error);
      } else {
        setMessage("Login failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.83)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {message && <Alert severity={message.includes("successful") ? "success" : "error"}>{message}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t have an account? <Link to="/signup">Register</Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Login;
