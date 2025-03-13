import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userProfile"));
    const adminStatus = localStorage.getItem("admin") === "true";
    setUser(storedUser);
    setIsAdmin(adminStatus);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("token");
    localStorage.removeItem("favourites"); // Clear favourites on logout
    localStorage.removeItem("admin");
    setUser(null);
    setIsAdmin(false);
    window.location.href = "/login"; // Redirect to login page after logout
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo inside Navbar for Desktop */}
        <Link to="/" className="logo navbar-logo">
          Furever H<span className="paw">🐾</span>mes
        </Link>

        <div className="nav-links-container">
          <div className="nav-links">
            {!isAdmin && location.pathname !== "/AdminDashboard" && (
              <>
                <Link to="/explore" className={location.pathname === "/explore" ? "active" : ""}>Explore</Link>
                <Link to="/favourites" className={location.pathname === "/favourites" ? "active" : ""}>Favourites</Link>
                <Link to="/applications" className={location.pathname === "/applications" ? "active" : ""}>Applications</Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin/dashboard" className={location.pathname === "/admin/dashboard" ? "active" : ""}>Dashboard</Link>
            )}
            
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
        </div>
      </nav>
    </>
  );
};

export default Navbar;