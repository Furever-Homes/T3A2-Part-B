import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <>
      {/* Mobile-Only Logo - Stays at the Top */}
      <div className="mobile-logo">
        <Link to="/" className="logo">
          Furever H<span className="paw">🐾</span>mes
        </Link>
      </div>

      <nav className="navbar">
        {/* Logo inside Navbar for Desktop */}
        <Link to="/" className="logo navbar-logo">
          Furever H<span className="paw">🐾</span>mes
        </Link>

        <div className="nav-links">
          <Link to="/explore">Explore</Link>
          <Link to="/favourites">Favourites</Link>
          <Link to="/applications">Applications</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;