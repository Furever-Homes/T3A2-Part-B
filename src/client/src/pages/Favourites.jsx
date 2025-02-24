import React, { useState, useEffect } from "react";
import "../styles/Favourites.css";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const savedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(savedFavourites);
  }, []);

  const removeFavourite = (petId) => {
    const updatedFavourites = favourites.filter((pet) => pet.id !== petId);
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  return (
    <div className="favourites-page">
      <h1>⭐ Favourites</h1>
      {favourites.length === 0 ? (
        <p>No favourite pets yet.</p>
      ) : (
        <div className="pet-grid">
          {favourites.map((pet) => (
            <div key={pet.id} className="pet-card">
              <img src={pet.photo} alt={pet.name} className="pet-image" />
              <h3>{pet.name}</h3>
              <p>{pet.age} years old</p>
              <p>Breed: {pet.breed}</p>
              <button className="remove-btn" onClick={() => removeFavourite(pet.id)}>❌ Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;