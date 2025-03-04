import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, Typography, Select, MenuItem, CircularProgress, Container } from "@mui/material";
import axios from "axios";

const MyFeed = () => {
  const [news, setNews] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  // Retrieve email from sessionStorage
  const email = sessionStorage.getItem("email");

  // Fetch user preferences from backend
  useEffect(() => {
    if (email) {
      axios
        .post("http://localhost:9000/api/user/account", { email })
        .then((response) => {
          setPreferences(response.data.preferences || []);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [email]);

  // Fetch news based on user preferences
  const fetchNews = useCallback(async () => {
    if (preferences.length === 0) {
      console.warn("No categories selected.");
      return;
    }

    try {
      setLoading(true);
      const categoryQuery = preferences.join(",");
      const response = await fetch(
        `http://localhost:9000/api/news/my-feed?categories=${categoryQuery}&language=${language}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setNews(data.news_results || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  }, [preferences, language]);

  useEffect(() => {
    if (preferences.length > 0) {
      fetchNews();
    }
  }, [preferences, language, fetchNews]);

  // Handle news click to store in backend
  const handleNewsClick = async (article) => {
    try {
      if (!email) {
        throw new Error("User email not found in session.");
      }

      if (!article.title) {
        throw new Error("Article has no title.");
      }

      console.log("Sending clicked news to backend:", article.title);

      await axios.post("http://localhost:9000/api/user/clicked-news", {
        email,
        title: article.title,
      });

      console.log("Successfully stored clicked news:", article.title);
    } catch (error) {
      console.error("Error in handleNewsClick:", error.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 3, textAlign: "center" }}>
        My Feed
      </Typography>

      {/* Language Selection */}
      <Select value={language} onChange={(e) => setLanguage(e.target.value)} sx={{ mb: 3, display: "block", margin: "0 auto" }}>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="es">Spanish</MenuItem>
        <MenuItem value="fr">French</MenuItem>
        <MenuItem value="de">German</MenuItem>
        <MenuItem value="it">Italian</MenuItem>
        <MenuItem value="pt">Portuguese</MenuItem>
        <MenuItem value="ru">Russian</MenuItem>
        <MenuItem value="zh-CN">Chinese (Simplified)</MenuItem>
        <MenuItem value="ja">Japanese</MenuItem>
        <MenuItem value="ko">Korean</MenuItem>
        <MenuItem value="hi">Hindi</MenuItem>
        <MenuItem value="ar">Arabic</MenuItem>
        <MenuItem value="bn">Bengali</MenuItem>
        <MenuItem value="nl">Dutch</MenuItem>
        <MenuItem value="el">Greek</MenuItem>
        <MenuItem value="iw">Hebrew</MenuItem>
        <MenuItem value="id">Indonesian</MenuItem>
        <MenuItem value="ms">Malayalam</MenuItem>
        <MenuItem value="tr">Turkish</MenuItem>
        <MenuItem value="vi">Vietnamese</MenuItem>
        <MenuItem value="ta">Tamil</MenuItem>
        <MenuItem value="kn">Kannada</MenuItem>
        <MenuItem value="mr">Marathi</MenuItem>
        <MenuItem value="pa">Punjabi</MenuItem>
        <MenuItem value="te">Telugu</MenuItem>
      </Select>

      {/* Display Loading Indicator */}
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : news.length > 0 ? (
        news.map((article, index) => (
          <Card key={index} sx={{ marginBottom: 2, padding: 2 }}>
            <CardContent>
              <Typography variant="h6">{article.title}</Typography>
              <Typography>{article.snippet || "No description available."}</Typography>
              <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                {article.source?.name}
              </Typography>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue", textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  handleNewsClick(article); // Store click in backend
                  window.open(article.link, "_blank"); // Open link in a new tab
                }}
              >
                Read More
              </a>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No news available.</Typography>
      )}
    </Container>
  );
};

export default MyFeed;
