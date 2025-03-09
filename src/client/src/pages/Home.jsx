import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <h1>🐾 Welcome to Furever Homes</h1>
      <p>Find your perfect pet today!</p>

      <div className="button-group">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Sign Up</Link>
      </div>

      <Link to="/explore" className="explore-btn">🐶 Explore Pets 🐱</Link>
    </div>
  );
};

export default Home;