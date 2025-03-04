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
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      } else {
        fetchUserData();
      }
    }
  }, [isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/user/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: sessionStorage.getItem("userEmail") })
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
      sessionStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={isLoggedIn ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
