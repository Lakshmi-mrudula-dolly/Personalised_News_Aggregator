import React, { useEffect, useState } from "react"; 
import { Container, Typography, Box, CircularProgress, List, ListItem, ListItemText } from "@mui/material";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const email = sessionStorage.getItem("email"); // Assume email is stored on login
        const response = await fetch("http://localhost:9000/get-bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok) {
          setSubscribed(data.subscribed);
          setBookmarks(data.bookmarks || []);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <Container sx={{ marginTop: "80px", textAlign: "center" }}>
      {loading ? (
        <CircularProgress />
      ) : !subscribed ? (
        <Box sx={{ p: 4, bgcolor: "#ffebee", borderRadius: 2 }}>
          <Typography variant="h6" color="error">Subscribe to bookmark articles</Typography>
        </Box>
      ) : bookmarks.length === 0 ? (
        <Box sx={{ p: 4, bgcolor: "#e3f2fd", borderRadius: 2 }}>
          <Typography variant="h6">No bookmarked articles</Typography>
        </Box>
      ) : (
        <List>
          {bookmarks.map((title, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Bookmarks;
