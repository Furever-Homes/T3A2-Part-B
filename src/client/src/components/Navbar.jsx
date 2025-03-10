import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userProfile"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    setUser(null);
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
          <Link to="/explore" className={location.pathname === "/explore" ? "active" : ""}>Explore</Link>
          <Link to="/favourites" className={location.pathname === "/favourites" ? "active" : ""}>Favourites</Link>
          <Link to="/applications" className={location.pathname === "/applications" ? "active" : ""}>Applications</Link>
          
          {/* Profile Dropdown */}
          <div 
            className="profile-dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link to="/profile" className={`dropdown-btn ${location.pathname === "/profile" ? "active" : ""}`}>
              Profile
            </Link>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {!user ? (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile">Manage Profile</Link>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
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