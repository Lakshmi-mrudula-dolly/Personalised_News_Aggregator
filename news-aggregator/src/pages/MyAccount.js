import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Checkbox, FormControlLabel, Button, Paper } from "@mui/material";

const categories = ["Business", "Technology", "Sports", "Entertainment", "National", "International", "Politics"];

const MyAccount = () => {
  const [user, setUser] = useState({ name: "", email: "", preferences: [], isSubscribed: false });
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const email = sessionStorage.getItem("email"); // Retrieve email from sessionStorage

  useEffect(() => {
    if (email) {
      // Fetch user details
      axios
        .post("http://localhost:9000/api/user/account", { email })
        .then((response) => {
          setUser(response.data);
          setSelectedPreferences(response.data.preferences || []);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [email]);

  const handlePreferenceChange = (category) => {
    setSelectedPreferences((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const handleUpdatePreferences = () => {
    axios
      .post("http://localhost:9000/api/user/update", { email, preferences: selectedPreferences })
      .then(() => {
        alert("Preferences updated successfully!");
      })
      .catch((error) => console.error("Error updating preferences:", error));
  };

  const handleSubscribe = () => {
    axios
      .post("http://localhost:9000/api/user/subscribe", { email })
      .then(() => {
        alert("Subscription successful!");
        setUser((prev) => ({ ...prev, isSubscribed: true }));
      })
      .catch((error) => console.error("Error subscribing:", error));
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>
          My Account
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user.email}
        </Typography>

        <Typography variant="h6" style={{ marginTop: 20 }}>
          Preferences
        </Typography>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedPreferences.includes(category)}
                onChange={() => handlePreferenceChange(category)}
              />
            }
            label={category}
          />
        ))}

        <Button variant="contained" color="primary" onClick={handleUpdatePreferences} style={{ marginTop: 20 }}>
          Update Preferences
        </Button>

        {!user.isSubscribed && (
          <>
            <Typography variant="body2" style={{ marginTop: 20, color: "red" }}>
              Subscribe to bookmark news articles
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleSubscribe} style={{ marginTop: 10 }}>
              Subscribe Now
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default MyAccount;
