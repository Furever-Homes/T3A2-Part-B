import { Link } from "react-router-dom";
import "../styles/Navbar.css"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>🐾 Furever Homes</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/adopt">Adopt</Link></li>
        <li><Link to="/favourites">Favourites</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;