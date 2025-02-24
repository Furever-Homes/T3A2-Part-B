import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Adopt.css";

const Adopt = () => {
  const [pets, setPets] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get("/api/pets");
      setPets(response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const filteredPets = pets.filter(pet => filter === "all" || pet.type === filter);

  return (
    <div className="adopt-page">
      <h1>🐾 Adopt a Pet</h1>
      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("dog")}>Dogs</button>
        <button onClick={() => setFilter("cat")}>Cats</button>
        <button onClick={() => setFilter("other")}>Others</button>
      </div>
      
      <div className="pet-grid">
        {filteredPets.map((pet) => (
          <div key={pet.id} className="pet-card">
            <img src={pet.photo} alt={pet.name} />
            <h3>{pet.name}</h3>
            <p>Age: {pet.age} years</p>
            <p>Breed: {pet.breed}</p>
            <Link to={`/pet/${pet.id}`} className="details-btn">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Adopt;