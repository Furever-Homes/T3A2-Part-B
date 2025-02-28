import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/explore">Explore</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/adopt">Adopt</Link>
      <Link to="/favourites">Favourites</Link>
    </nav>
  );
};

export default Navbar;