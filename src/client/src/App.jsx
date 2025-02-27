import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";

import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Profile from "./pages/Profile.jsx";
import Adopt from "./pages/Adopt.jsx";
import Favourites from "./pages/Favourites.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <Router>
      {/* make the Navbar appear on all pages */}
      <Navbar />

      {/* Routes for the pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="*" element={<NotFound />} /> {/* for 404 */}
      </Routes>
    </Router>
  );
}

export default App;