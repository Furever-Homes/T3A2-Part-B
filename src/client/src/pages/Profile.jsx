import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userProfile"));
    setUser(storedUser);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
          <div className="profile-dropdown">
            <button className="dropdown-btn" onClick={toggleDropdown}>
              {user ? "Manage Account" : "Login / Signup"} ▼
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {user ? (
                  <Link to="/profile">Manage Account</Link>
                ) : (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
