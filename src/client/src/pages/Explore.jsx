import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Explore.css";

const allPets = [
  { id: 1, name: "Bella", age: 3, breed: "Golden Retriever", description: "A friendly and playful companion.", photo: "https://via.placeholder.com/150" },
  { id: 2, name: "Charlie", age: 2, breed: "Beagle", description: "Loves to explore and sniff around!", photo: "https://via.placeholder.com/150" },
  { id: 3, name: "Lucy", age: 5, breed: "Tabby Cat", description: "Loves to cuddle and nap in the sun.", photo: "https://via.placeholder.com/150" },
  { id: 4, name: "Duke", age: 4, breed: "Husky", description: "Energetic and loyal, loves the snow!", photo: "https://via.placeholder.com/150" },
  { id: 5, name: "Max", age: 1, breed: "Labrador Retriever", description: "Loves playing fetch and swimming.", photo: "https://via.placeholder.com/150" },
  { id: 6, name: "Mittens", age: 2, breed: "Persian Cat", description: "Fluffy and affectionate, enjoys naps.", photo: "https://via.placeholder.com/150" },
  { id: 7, name: "Rocky", age: 4, breed: "Bulldog", description: "Strong and gentle, great with kids.", photo: "https://via.placeholder.com/150" },
  { id: 8, name: "Luna", age: 3, breed: "Siamese Cat", description: "Curious and vocal, loves attention.", photo: "https://via.placeholder.com/150" },
];

const Explore = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
    const isFavourited = favourites.some((fav) => fav.id === pet.id);
    const updatedFavourites = isFavourited
      ? favourites.filter((fav) => fav.id !== pet.id)
      : [...favourites, pet];
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  return (
    <div className="explore-page">
      <h1>🐾 Explore Pets</h1>

      <h2>📌 Recently Added Pets</h2>
      <div className="pet-grid">
        {allPets.slice(-4).map((pet) => (
          <div key={pet.id} className="pet-card" onClick={() => openPopup(pet)}>
            <img src={pet.photo} alt={pet.name} className="pet-image" />
            <h3>{pet.name}</h3>
            <p>{pet.age} years old</p>
            <p>Breed: {pet.breed}</p>
            <button 
              className={`favourite-btn ${favourites.some((fav) => fav.id === pet.id) ? "favourited" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavourite(pet);
              }}
            >
              {favourites.some((fav) => fav.id === pet.id) ? "❤️ Favourited" : "🤍 Favourite"}
            </button>
          </div>
        ))}
      </div>

      <h2>🐶🐱 All Pets</h2>
      <div className="pet-grid">
        {allPets.map((pet) => (
          <div key={pet.id} className="pet-card" onClick={() => openPopup(pet)}>
            <img src={pet.photo} alt={pet.name} className="pet-image" />
            <h3>{pet.name}</h3>
            <p>{pet.age} years old</p>
            <p>Breed: {pet.breed}</p>
            <button 
              className={`favourite-btn ${favourites.some((fav) => fav.id === pet.id) ? "favourited" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavourite(pet);
              }}
            >
              {favourites.some((fav) => fav.id === pet.id) ? "❤️ Favourited" : "🤍 Favourite"}
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