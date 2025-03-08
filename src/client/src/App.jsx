import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar"; // Ensure Navbar is in components/

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Adopt from "./pages/Adopt";
import Favourites from "./pages/Favourites";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup"; 

function App() {
  return (
    <Router>
      {/* Navbar appears on all pages */}
      <Navbar />

      {/* Routes for the pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/login" element={<Login />} />  
        <Route path="/signup" element={<Signup />} />  
        <Route path="*" element={<NotFound />} /> {/* 404 page */}
      </Routes>
    </Router>
  );
}

export default App;