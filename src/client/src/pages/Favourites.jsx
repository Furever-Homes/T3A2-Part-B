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
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view favourites.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/favourites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavourites(response.data);
    } catch (error) {
      setError("Failed to load favourites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async (petId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`http://localhost:5000/api/favourites/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavourites((prevFavourites) => prevFavourites.filter((pet) => pet._id !== petId));
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