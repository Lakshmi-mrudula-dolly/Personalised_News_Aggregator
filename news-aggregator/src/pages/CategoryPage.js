import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Select, MenuItem, Button } from "@mui/material";
import axios from "axios";

const CategoryPage = ({ user }) => {
  const { category } = useParams();
  const [news, setNews] = useState([]);
  const [language, setLanguage] = useState("en");

  // Retrieve email from sessionStorage
  const email = sessionStorage.getItem("email");

  // Fetch news based on category and language
  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:9000/api/news/category/${category}/${language}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data);
      setNews(data.news_results || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }, [category, language]);

  // Call fetchNews when category or language changes
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Store clicked news in backend
  const handleNewsClick = async (article) => {
    try {
      if (!email) throw new Error("User email not found in session.");
      if (!article.title) throw new Error("Article has no title.");

      console.log("Sending clicked news to backend:", article.title);
      await axios.post("http://localhost:9000/api/user/clicked-news", { email, title: article.title });
      console.log("Successfully stored clicked news:", article.title);
    } catch (error) {
      console.error("Error in handleNewsClick:", error.message);
    }
  };

  // Increase category count for Like
  const handleLike = async (article) => {
    try {
      if (!email) throw new Error("User email not found in session.");
      await axios.post("http://localhost:9000/api/user/like", { email, category });
      console.log("Liked article:", article.title);
    } catch (error) {
      console.error("Error in handleLike:", error.message);
    }
  };

  // Decrease category count for Dislike
  const handleDislike = async (article) => {
    try {
      if (!email) throw new Error("User email not found in session.");
      await axios.post("http://localhost:9000/api/user/dislike", { email, category });
      console.log("Disliked article:", article.title);
    } catch (error) {
      console.error("Error in handleDislike:", error.message);
    }
  };

  // Add article title to bookmarks (circular queue of max 20 items)
  const handleBookmark = async (article) => {
    try {
      if (!email) throw new Error("User email not found in session.");
      if (!article.title) throw new Error("Article has no title.");
      await axios.post("http://localhost:9000/api/user/bookmark", { email, title: article.title });
      console.log("Bookmarked article:", article.title);
    } catch (error) {
      console.error("Error in handleBookmark:", error.message);
    }
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {category.charAt(0).toUpperCase() + category.slice(1)} News
      </Typography>

      {/* Language Selection */}
      <Select value={language} onChange={(e) => setLanguage(e.target.value)} sx={{ mb: 3 }}>
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

      {/* Display News */}
      {news.length > 0 ? (
        news.map((article, index) => (
          <Card key={index} sx={{ margin: "20px 0", padding: 2 }}>
            <CardContent>
              <Typography variant="h6">{article.title}</Typography>
              <Typography>{article.snippet}</Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                {article.source?.name}
              </Typography>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNewsClick(article); // Store click in backend
                  window.open(article.link, "_blank"); // Open link in new tab
                }}
              >
                Read More
              </a>
              <div style={{ marginTop: "10px" }}>
                <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => handleLike(article)}>
                  👍 Like
                </Button>
                <Button variant="outlined" color="secondary" sx={{ mr: 1 }} onClick={() => handleDislike(article)}>
                  👎 Dislike
                </Button>
                <Button variant="outlined" onClick={() => handleBookmark(article)}>
                  🔖 Bookmark
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No news available.</Typography>
      )}
    </div>
  );
};

export default CategoryPage;
