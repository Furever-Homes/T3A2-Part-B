import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <h1>🐾 Welcome to Furever Homes</h1>
      <p>Find your perfect pet today!</p>
      <Link to="/explore" className="explore-btn">Explore Pets</Link>
    </div>
  );
};

export default Home;