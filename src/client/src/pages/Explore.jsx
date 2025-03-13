import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Explore.css";
import axios from "axios";

const Explore = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [comment, setComment] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/pets");
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

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const openPopup = (pet) => {
    setSelectedPet(pet);
    setComment("");
  };

  const closePopup = () => {
    setSelectedPet(null);
    setComment(""); 
  };

  const toggleFavourite = async (pet) => {
    const token = localStorage.getItem("token");
    if (!token) {
      const confirmLogin = window.confirm("You need to log in to favourite a pet. Would you like to log in now?");
      if (confirmLogin) {
        navigate("/login"); // Redirect to login page
      }
      return; // Stop function execution
    }
  
    const isFavourited = favourites.some((fav) => fav._id === pet._id);
    let updatedFavourites = isFavourited
      ? favourites.filter((fav) => fav._id !== pet._id) // Remove pet from favourites
      : [...favourites, pet]; // Add pet to favourites
  
    setFavourites(updatedFavourites);
  
    try {
      if (isFavourited) {
        await axios.delete(`http://localhost:5001/api/user/favourites/${pet._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5001/api/user/favourites/${pet._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Error updating favourites:", error);
    }
  };  

  const handleApplyToAdopt = async (petId) => {
    if (!isLoggedIn) {
      alert("You must be logged in to apply.");
      navigate("/login");
      return;
    }

    setApplying(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to apply.");
        navigate("/login");
        return;
      }

      await axios.post(
        `http://localhost:5001/api/user/applications/${petId}`,
        { message: comment || "I would like to adopt this pet."},
        { headers: { Authorization: `Bearer ${token}` },}
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
            <img src={pet.image} alt={pet.name} className="pet-image" />
            <h3>{pet.name}</h3>
            <p>{pet.age} years old</p>
            <p>Type: {pet.animalType}</p>
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
            <img src={pet.image} alt={pet.name} className="pet-image" />
            <h3>{pet.name}</h3>
            <p>{pet.age} years old</p>
            <p>Type: {pet.animalType}</p>
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

export default Explore;
