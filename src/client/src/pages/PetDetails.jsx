import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link
import axios from "axios";
import "../styles/PetDetails.css";

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pet details when the component mounts
  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`https://fureverhomes.onrender.com/api/pets/${id}`);
        setPet(response.data);
      } catch (error) {
        setError("Failed to load pet details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [id]);

  if (loading) {
    return <p className="loading-message">Loading pet details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="pet-details">
      {pet ? (
        <>
          <h1>{pet.name}</h1>
          <img src={pet.photo || "https://via.placeholder.com/300"} alt={pet.name} className="pet-image" />
          <p><strong>Age:</strong> {pet.age} years</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Description:</strong> {pet.description}</p>

          {/* Correctly Link Apply to Adopt Button */}
          <Link to={`/apply-to-adopt/${id}`} className="apply-btn">
            Apply to Adopt
          </Link>
        </>
      ) : (
        <p>Pet details not found.</p>
      )}
    </div>
  );
};

export default PetDetails;
  }, [id]);

  if (loading) {
    return <p className="loading-message">Loading pet details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="pet-details">
      {pet ? (
        <>
          <h1>{pet.name}</h1>
          <img src={pet.photo || "https://via.placeholder.com/300"} alt={pet.name} className="pet-image" />
          <p><strong>Age:</strong> {pet.age} years</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Description:</strong> {pet.description}</p>
          <button className="apply-btn">Apply to Adopt</button>
        </>
      ) : (
        <p>Pet details not found.</p>
      )}
    </div>
  );
};

export default PetDetails;