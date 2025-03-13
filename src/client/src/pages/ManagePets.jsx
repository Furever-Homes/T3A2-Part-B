import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManagePets.css";

const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({
    name: "",
    age: "",
    animalType: "Dog",
    activityLevel: "Medium",
    status: "Available",
    description: "",
    location: "Melbourne",
  });
  const [image, setImage] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/pets");
        setPets(response.data);
      } catch (error) {
        setError("Failed to fetch pets.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Add a new pet
  const handleAddPet = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(newPet).forEach((key) => formData.append(key, newPet[key]));
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5001/api/admin/pets", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setPets([...pets, response.data]);
      alert("Pet added successfully!");
      setNewPet({ name: "", age: "", animalType: "Dog", activityLevel: "Medium", status: "Available", description: "", location: "Melbourne" });
      setImage(null);
    } catch (error) {
      alert("Failed to add pet.");
    }
  };

  // Edit pet
  const handleEditPet = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5001/api/admin/pets/${editingPet._id}`, newPet, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPets(pets.map((pet) => (pet._id === editingPet._id ? { ...editingPet, ...newPet } : pet)));
      alert("Pet updated successfully!");
      setEditingPet(null);
      setNewPet({ name: "", age: "", animalType: "Dog", activityLevel: "Medium", status: "Available", description: "", location: "Melbourne" });
    } catch (error) {
      alert("Failed to update pet.");
    }
  };

  // Delete a pet
  const handleDeletePet = async (petId) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/admin/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPets(pets.filter((pet) => pet._id !== petId));
      alert("Pet deleted successfully!");
    } catch (error) {
      alert("Failed to delete pet.");
    }
  };

  return (
    <div className="manage-pets">
      <h1>🐾 Manage Pets</h1>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Add/Edit Pet Form */}
      <form onSubmit={editingPet ? handleEditPet : handleAddPet} className="manage-pet-form">
        <input type="text" name="name" placeholder="Pet Name" value={newPet.name} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={newPet.age} onChange={handleChange} required />

        <select name="animalType" value={newPet.animalType} onChange={handleChange}>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Other">Other</option>
        </select>

        <select name="activityLevel" value={newPet.activityLevel} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select name="location" value={newPet.location} onChange={handleChange}>
          <option value="Melbourne">Melbourne</option>
          <option value="Sydney">Sydney</option>
          <option value="Brisbane">Brisbane</option>
          <option value="Perth">Perth</option>
          <option value="Canberra">Canberra</option>
        </select>

        <select name="status" value={newPet.status} onChange={handleChange}>
          <option value="Available">Available</option>
          <option value="Adopted">Adopted</option>
        </select>

        <textarea name="description" placeholder="Description" value={newPet.description} onChange={handleChange} required></textarea>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit">{editingPet ? "Update Pet" : "Add Pet"}</button>
      </form>

      {/* Pets List */}
      <h2>📋 Current Pets</h2>
      {loading ? (
        <p>Loading pets...</p>
      ) : (
        <div className="manage-pet-list">
          {pets.map((pet) => (
            <div key={pet._id} className="manage-pet-card">
              <img src={pet.image} alt={pet.name} className="manage-pet-image" />
              <h3>{pet.name}</h3>
              <p>Age: {pet.age} years</p>
              <p>Type: {pet.animalType}</p>
              <p>Activity: {pet.activityLevel}</p>
              <p>Location: {pet.location}</p>
              <p>Status: {pet.status}</p>
              <p>{pet.description}</p>

              <button onClick={() => setEditingPet(pet) || setNewPet(pet)}>✏ Edit</button>
              <button className="delete-btn" onClick={() => handleDeletePet(pet._id)}>🗑 Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePets;