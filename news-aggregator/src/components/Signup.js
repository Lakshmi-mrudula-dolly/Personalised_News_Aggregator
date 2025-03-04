import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, Alert, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import backgroundImage from './Images/img4.webp';

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const categories = ["Business", "Technology", "Sports", "Entertainment", "National", "International", "Politics"];

  const handlePreferenceChange = (category) => {
    setSelectedPreferences((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9000/api/signup", {
        username,
        email,
        password,
        preferences: selectedPreferences, // Store preferences instead of categories
      });
      setMessage(response.data.message);
      navigate("/"); // Redirect to login page
    } catch (error) {
      setMessage("Signup failed: " + (error.response ? error.response.data.error : error.message));
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
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>Signup</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth required margin="normal" />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required margin="normal" />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required margin="normal" />
          
          <Typography variant="h6" sx={{ mt: 2 }}>Select Preferences</Typography>
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={<Checkbox checked={selectedPreferences.includes(category)} onChange={() => handlePreferenceChange(category)} />}
                label={category}
              />
            ))}
          </FormGroup>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
        </form>
        {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
      </Container>
    </Box>
  );
}

export default Signup;
