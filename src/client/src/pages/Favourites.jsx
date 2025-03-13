import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Favourites.css";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null); // Track selected pet
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

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

      // Fetch favourites from the backend
      const response = await axios.get("http://localhost:5001/api/user/favourites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavourites(response.data.favourites);
      localStorage.setItem("favourites", JSON.stringify(response.data.favourites));
    } catch (error) {
      console.error("Error fetching favourites:", error);
      setError("Failed to load favourites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async (petId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to remove favourites.");
        return;
      }

      // Update UI
      const updatedFavourites = favourites.filter((pet) => pet._id !== petId);
      setFavourites(updatedFavourites);
      localStorage.setItem("favourites", JSON.stringify(updatedFavourites));

      // Call backend to remove favourite
      await axios.delete(`http://localhost:5001/api/user/favourites/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

    } catch (error) {
      console.error("Error removing pet from favourites:", error);
      setError("Failed to remove favourite. Please try again.");
    }
  };

  const openPopup = (pet) => {
    setSelectedPet(pet);
    setComment("");
  };

  const closePopup = () => {
    setSelectedPet(null);
    setComment(""); 
  };

  // Apply to adopt pet
  const handleApplyToAdopt = async (petId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to apply.");
      navigate("/login");
      return;
    }

    setApplying(true);

    try {
      await axios.post(
        `http://localhost:5001/api/user/applications/${petId}`,
        { message: "I would like to adopt this pet." },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Application submitted successfully!");
      navigate("/applications");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
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
            <div key={pet._id} className="pet-card" onClick={() => openPopup(pet)}>
              <img src={pet.image} alt={pet.name} className="pet-image" />
              <h3>{pet.name}</h3>
              <p>{pet.age} years old</p>
              <p>Type: {pet.animalType}</p>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavourite(pet._id);
                }}
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {selectedPet && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={closePopup}>✖</button>
            <img src={selectedPet.image} alt={selectedPet.name} className="popup-image" />
            <h2>{selectedPet.name}</h2>
            <p>Age: {selectedPet.age} years</p>
            <p>Type: {selectedPet.animalType}</p>
            <p>{selectedPet.description}</p>

            {/* Comment Input Field */}
            <textarea
              className="comment-box"
              placeholder="Add a message for your application..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <button
              className="apply-btn"
              onClick={() => handleApplyToAdopt(selectedPet._id)}
              disabled={applying}
            >
              {applying ? "Applying..." : "Apply to Adopt"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;
