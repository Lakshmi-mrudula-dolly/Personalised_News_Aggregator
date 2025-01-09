import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css"; // Import the CSS file

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
        onLogin(true,"",email); // Successful login
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
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="register-link">
          Don't have an account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

