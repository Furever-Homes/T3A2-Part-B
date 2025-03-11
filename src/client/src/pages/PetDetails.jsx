import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/PetDetails.css";

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  // Fetch pet details when the component mounts
  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/pets/${id}`);
        setPet(response.data);
      } catch (error) {
        setError("Failed to load pet details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [id]);

  const handleApplyToAdopt = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to apply.");
      navigate("/login");
      return;
    }

    setApplying(true);

    try {
      await axios.post(
        `http://localhost:5001/api/user/applications/${id}`,
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
          <button 
            className="apply-btn"
            onClick={handleApplyToAdopt}
            disabled={applying}
          >
            {applying ? "Applying..." : "Apply to Adopt"}
          </button>

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