import React, { useState, useEffect } from "react";
import axios from "axios";
import "./News.css"; 

function News({ category, language }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/news/${category}`,
          {
            params: {
              hl: language, // Pass language to backend
              gl: "in",
              page: 1,
            },
          }
        );
        setArticles(response.data.news_results);
      } catch (err) {
        setError("Error fetching news: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, language]);

  const handleLike = (index) => {
    const updatedArticles = [...articles];
    updatedArticles[index].liked = true;
    updatedArticles[index].disliked = false;
    setArticles(updatedArticles);
  };

  const handleDislike = (index) => {
    const updatedArticles = [...articles];
    updatedArticles[index].liked = false;
    updatedArticles[index].disliked = true;
    setArticles(updatedArticles);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-container">
      {articles.map((article, index) => (
        <div key={index} className="news-item">
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <a href={article.link || "#"} rel="noopener noreferrer">
            Read more
          </a>
          <div className="buttons">
            <button
              onClick={() => handleLike(index)}
              disabled={article.liked}
            >
              Like
            </button>
            <button
              onClick={() => handleDislike(index)}
              disabled={article.disliked}
            >
              Dislike
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default News;





/*import React, { useState, useEffect } from "react";
import axios from "axios";

function News({ category }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null); // State for selected article

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/news/${category}`, {
          params: {
            engine: "google_news",
            q: category,
            api_key: "2fe63d43e1d3df803e7327e6eb1ca6f3ecab2565f3b76daca245331e7e05179",
            hl: "en",
            gl: "us",
            page: 1,
          },
        });
        setArticles(response.data.news_results);
      } catch (err) {
        setError("Error fetching news: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  const handleArticleClick = async (id) => { 
    try {
      const response = await axios.get(`http://localhost:9000/api/news/details/${id}`);
      setSelectedArticle(response.data); 
    } catch (error) {
      console.error("Error fetching article details:", error);
    }
  };  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-container">
      {selectedArticle ? (
        <div className="selected-article">
          <h2>{selectedArticle.title}</h2>
          <p>{selectedArticle.content}</p>
          <button onClick={() => setSelectedArticle(null)}>Back</button>
        </div>
      ) : (
        articles.map((article, index) => (
          <div
            key={index}
            className="news-item"
            onClick={() => handleArticleClick(article.url)}
          >
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default News;*/
