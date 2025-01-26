import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import backgroundImage from './Images/img1.jpeg'

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Message for status

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9000/api/login", {
        email,
        password,
      });

      if (response.data.message === "Login successful") {
        onLogin(true, "", email); // Successful login
        setMessage("Login successful");
      } else {
        onLogin(false, "Invalid credentials");
        setMessage("Login failed: Invalid credentials");
      }
    } catch (error) {
      if (error.response) {
        onLogin(false, "Login failed: " + error.response.data.error);
        setMessage("Login failed: " + error.response.data.error);
      } else {
        onLogin(false, "Login failed: " + error.message);
        setMessage("Login failed: " + error.message);
      }
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
          backgroundColor: "rgba(255, 255, 255, 0.83)", // Transparent white background
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
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
          >
            Login
          </Button>
        </form>
        {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t have an account? <Link to="/signup">Register</Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Login;
