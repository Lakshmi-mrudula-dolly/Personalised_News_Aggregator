import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import News from "./components/News";
import Login from "./components/Login";
import Signup from "./components/Signup";
import axios from "axios";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default language
  const [userEmail, setUserEmail] = useState(""); // Store user email after login

  // Save preferences in MongoDB when language/category changes
  const savePreferences = useCallback(async () => {
    try {
      await axios.post("http://localhost:9000/api/save-preferences", {
        email: userEmail,
        language: selectedLanguage,
        category: selectedCategory,
      });
    } catch (err) {
      console.error("Failed to save preferences:", err);
    }
  }, [userEmail, selectedLanguage, selectedCategory]); // Dependencies

  useEffect(() => {
    sessionStorage.setItem("selectedCategory", selectedCategory);
    sessionStorage.setItem("selectedLanguage", selectedLanguage);
    if (isLoggedIn) savePreferences(); // Call savePreferences when logged in
  }, [selectedCategory, selectedLanguage, isLoggedIn, savePreferences]);

  // Handle user login
  const handleLogin = (success, errorMessage, email) => {
    if (success) {
      setIsLoggedIn(true);
      setError("");
      setUserEmail(email); // Store email after successful login
    } else {
      setError(errorMessage || "Invalid credentials");
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  // Clear the selected category to navigate back to the home view
  const handleBackToHome = () => {
    setSelectedCategory("");
  };

  return (
    <Router>
      <div className="app-container">
        <h1 className="app-title">📰 News Aggregator</h1>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <div>
                  {/* Language Selection */}
                  <div className="dropdown-container">
                    <label>Select Language:</label>
                    <select value={selectedLanguage} onChange={handleLanguageChange}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ru">Russian</option>
                      <option value="zh-CN">Chinese (Simplified)</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="hi">Hindi</option>
                      <option value="ar">Arabic</option>
                      <option value="bn">Bengali</option>
                      <option value="nl">Dutch</option>
                      <option value="el">Greek</option>
                      <option value="iw">Hebrew</option>
                      <option value="id">Indonesian</option>
                      <option value="ms">Malay</option>
                      <option value="tr">Turkish</option>
                      <option value="vi">Vietnamese</option>
                      <option value="ta">Tamil</option>
                      <option value="kn">Kannada</option>
                      <option value="mr">Marathi</option>
                      <option value="pa">Punjabi</option>
                      <option value="te">Telugu</option>
                    </select>
                  </div>

                  {/* Category Selection */}
                  <div className="category-container">
                    <h2>Select a News Category:</h2>
                    <div className="category-buttons">
                      {["sports", "technology", "cinema", "politics"].map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          className={`category-button ${
                            selectedCategory === category ? "active" : ""
                          }`}
                        >
                          {category.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    {selectedCategory ? (
                      <div>
                        <News category={selectedCategory} language={selectedLanguage} />
                        <button className="back-button" onClick={handleBackToHome}>
                          Back to Home
                        </button>
                      </div>
                    ) : (
                      <p>Please select a category to see news.</p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Login onLogin={(success, error, email) => handleLogin(success, error, email)} />
                  {error && <p className="error-message">{error}</p>}
                </>
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
