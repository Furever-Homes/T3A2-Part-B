import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/Login.css";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile"); // Redirect if already logged in
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/api/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const token = response.data.token;

      // Decode the token to extract `admin` status
      const decodedToken = jwtDecode(token);
      const isAdmin = decodedToken.admin; // Extract `admin` field

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("admin", isAdmin ? "true" : "false"); // Store as string

      // Redirect based on admin status
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>🔑 Login</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* New Sign Up Button */}
      <p className="signup-redirect">Don't have an account?</p>

      <button className="signup-btn" onClick={() => navigate("/signup")}>

        Sign Up Here
      </button>
    </div>
  );
};

export default Login;