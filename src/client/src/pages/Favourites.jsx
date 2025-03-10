import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Favourites.css";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const savedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
      setFavourites(savedFavourites);
    } catch (error) {
      setError("Failed to load favourites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async (petId) => {
    try {
      const updatedFavourites = favourites.filter((pet) => pet._id !== petId);
      setFavourites(updatedFavourites);
      localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    } catch (error) {
      console.error("Error removing pet from favourites:", error);
    }
  };

  return (
    <div className="favourites-page">
      <h1>⭐ Your Favourited Pets</h1>

      {loading ? (
        <p>Loading favourites...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : favourites.length === 0 ? (
        <p>You haven't favourited any pets yet.</p>
      ) : (
        <div className="pet-grid">
          {favourites.map((pet) => (
            <div key={pet._id} className="pet-card">
              <img src={pet.photo} alt={pet.name} className="pet-image" />
              <h3>{pet.name}</h3>
              <p>{pet.age} years old</p>
              <p>Breed: {pet.breed}</p>
              <button className="remove-btn" onClick={() => removeFavourite(pet._id)}>❌ Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;