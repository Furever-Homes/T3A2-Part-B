import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Explore.css";
import axios from "axios";

const Explore = () => {
  const [pets, setPets] = useState([]); // Stores fetched pets
  const [selectedPet, setSelectedPet] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("https://localhost:5001/api/pets"); // Fetch pets from backend
        setPets(response.data);
      } catch (error) {
        setError("Failed to load pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();

    const savedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(savedFavourites);

    const storedUser = JSON.parse(localStorage.getItem("userProfile"));
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const openPopup = (pet) => {
    setSelectedPet(pet);
  };

  const closePopup = () => {
    setSelectedPet(null);
  };

  const toggleFavourite = (pet) => {
    const isFavourited = favourites.some((fav) => fav._id === pet._id);
    const updatedFavourites = isFavourited
      ? favourites.filter((fav) => fav._id !== pet._id)
      : [...favourites, pet];

    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  if (loading) {
    return <p>Loading pets...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="explore-page">
      <h1>🐾 Explore Pets</h1>

      <h2> Recently Added Pets</h2>
      <div className="pet-grid">
        {pets.slice(-4).map((pet) => (
          <div key={pet._id} className="pet-card" onClick={() => openPopup(pet)}>
            <img src={pet.photo} alt={pet.name} className="pet-image" />
            <h3>{pet.name}</h3>
            <p>{pet.age} years old</p>
            <p>Breed: {pet.breed}</p>
            <button 
              className={`favourite-btn ${favourites.some((fav) => fav._id === pet._id) ? "favourited" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavourite(pet);
              }}
            >
              {favourites.some((fav) => fav._id === pet._id) ? "❤️ Favourited" : "🤍 Favourite"}
            </button>
          </div>
        ))}
      </div>

      <h2> All Pets</h2>
      <div className="pet-grid">
        {pets.map((pet) => (
          <div key={pet._id} className="pet-card" onClick={() => openPopup(pet)}>
            <img src={pet.photo} alt={pet.name} className="pet-image" />
            <h3>{pet.name}</h3>
            <p>{pet.age} years old</p>
            <p>Breed: {pet.breed}</p>
            <button 
              className={`favourite-btn ${favourites.some((fav) => fav._id === pet._id) ? "favourited" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavourite(pet);
              }}
            >
              {favourites.some((fav) => fav._id === pet._id) ? "❤️ Favourited" : "🤍 Favourite"}
            </button>
          </div>
        ))}
      </div>

      {selectedPet && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={closePopup}>✖</button>
            <img src={selectedPet.photo} alt={selectedPet.name} className="popup-image" />
            <h2>{selectedPet.name}</h2>
            <p>Age: {selectedPet.age} years</p>
            <p>Breed: {selectedPet.breed}</p>
            <p>{selectedPet.description}</p>
            <button className="apply-btn">Apply to Adopt</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;