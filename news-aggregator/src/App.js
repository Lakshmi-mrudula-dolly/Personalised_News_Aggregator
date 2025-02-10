import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", isLoggedIn);

    if (isLoggedIn) {
      const storedUser = JSON.parse(sessionStorage.getItem("user")); // Retrieve user from sessionStorage
      if (storedUser) {
        setUser(storedUser);
      } else {
        fetchUserData(); // Fetch from backend if not in sessionStorage
      }
    }
  }, [isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/user/account", {
        method: "POST",  // Change from GET to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: sessionStorage.getItem("userEmail") }) // Include user email
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched user data:", data);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  

  const handleLogin = (success, userData) => {
    if (success) {
      setIsLoggedIn(true);
      sessionStorage.setItem("user", JSON.stringify(userData)); // Store user in sessionStorage
      setUser(userData);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={isLoggedIn ? <Home user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
