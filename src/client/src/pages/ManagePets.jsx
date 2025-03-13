import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManagePets.css";

const ManagePets = () => {
  // ----------------------
  // STATE
  // ----------------------
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For the "Add a Pet" form
  const [newPet, setNewPet] = useState({
    name: "",
    age: "",
    animalType: "",     // Start with an empty string -> user must choose
    activityLevel: "",
    status: "",
    description: "",
    location: "",
  });
  const [image, setImage] = useState(null);
  const [addingPet, setAddingPet] = useState(false);

  // For editing in a popup
  const [editPet, setEditPet] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ----------------------
  // FETCH ALL PETS
  // ----------------------
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/pets");
        setPets(response.data);
      } catch (err) {
        setError("Failed to fetch pets.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // ----------------------
  // "ADD PET" HANDLERS
  // ----------------------
  // Handle text input/select changes for newPet
  const handleChange = (e) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Submit new pet
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingPet(true);

    try {
      const token = localStorage.getItem("token");

      // Build form data
      const formData = new FormData();
      Object.keys(newPet).forEach((key) => formData.append(key, newPet[key]));
      if (image) formData.append("image", image);

      const response = await axios.post(
        "http://localhost:5001/api/admin/pets",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Add new pet to our list
      setPets([...pets, response.data]);
      alert("Pet added successfully!");

      // Reset form
      setNewPet({
        name: "",
        age: "",
        animalType: "",
        activityLevel: "",
        status: "",
        description: "",
        location: "",
      });
      setImage(null);
      const fileInput = document.getElementById("imageUploadDash");
      if (fileInput) fileInput.value = ""; // Reset file input field
    } catch (err) {
      alert("Failed to add pet.");
      console.error(err);
    } finally {
      setAddingPet(false);
    }
  };

  // ----------------------
  // "EDIT PET" HANDLERS (POPUP/MODAL)
  // ----------------------
  // Open the edit popup with a selected pet
  const openPopup = (pet) => {
    setIsPopupOpen(true);
    // Copy the pet info to an editable state
    setEditPet({ ...pet });
    // Clear out any old selected image
    setImage(null);
  };

  // Close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setEditPet(null);
    setImage(null);
  };

  // Handle changes for the editing form fields
  const handleEditChange = (e) => {
    setEditPet({ ...editPet, [e.target.name]: e.target.value });
  };

  // Save changes (PUT request)
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editPet) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.keys(editPet).forEach((key) => formData.append(key, editPet[key]));
      if (image) {
        formData.append("image", image);
      }

      // Update pet via PUT
      await axios.put(
        `http://localhost:5001/api/admin/pets/${editPet._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local state
      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet._id === editPet._id ? { ...pet, ...editPet } : pet
        )
      );
      alert("Pet updated successfully!");
      closePopup();
    } catch (err) {
      alert("Failed to update pet.");
      console.error(err);
    }
  };

  // ----------------------
  // "DELETE PET" HANDLER
  // ----------------------
  const handleDeletePet = async (petId) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/admin/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
      alert("Pet deleted successfully!");
    } catch (err) {
      alert("Failed to delete pet.");
      console.error(err);
    }
  };

  return (
    <div className="manage-pets">
      <h1>🐾 Manage Pets</h1>

      {error && <p className="error-message">{error}</p>}

      {/* ADD PET FORM */}
      <h2>➕ Add a New Pet</h2>
      <form onSubmit={handleSubmit} className="add-pet-form">
        <input
          type="text"
          name="name"
          placeholder="Pet Name"
          value={newPet.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newPet.age}
          onChange={handleChange}
          required
        />

        {/* Animal Type Dropdown */}
        <select
          name="animalType"
          value={newPet.animalType}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Animal Type
          </option>
          <option value="Cat">Cat</option>
          <option value="Dog">Dog</option>
          <option value="Other">Other</option>
        </select>

        {/* Activity Level Dropdown */}
        <select
          name="activityLevel"
          value={newPet.activityLevel}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Activity Level
          </option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* Status Dropdown */}
        <select
          name="status"
          value={newPet.status}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Availability
          </option>
          <option value="Available">Available</option>
          <option value="Adopted">Adopted</option>
        </select>

        {/* Location Dropdown */}
        <select
          name="location"
          value={newPet.location}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Location
          </option>
          <option value="Melbourne">Melbourne</option>
          <option value="Sydney">Sydney</option>
          <option value="Brisbane">Brisbane</option>
          <option value="Perth">Perth</option>
          <option value="Canberra">Canberra</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={newPet.description}
          onChange={handleChange}
          required
        ></textarea>

        <input
          id="imageUploadDash"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit" disabled={addingPet}>
          {addingPet ? "Adding Pet..." : "Add Pet"}
        </button>
      </form>

      {/* PETS LIST */}
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

              <button onClick={() => openPopup(pet)}>✏ Edit</button>
              <button
                className="delete-btn"
                onClick={() => handleDeletePet(pet._id)}
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* EDIT PET POPUP (MODAL) */}
      {isPopupOpen && editPet && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Pet</h2>
            <form onSubmit={handleSaveChanges} className="manage-pet-form">
              <input
                type="text"
                name="name"
                placeholder="Pet Name"
                value={editPet.name}
                onChange={handleEditChange}
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={editPet.age}
                onChange={handleEditChange}
                required
              />
              <select
                name="animalType"
                value={editPet.animalType}
                onChange={handleEditChange}
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
              <select
                name="activityLevel"
                value={editPet.activityLevel}
                onChange={handleEditChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                name="location"
                value={editPet.location}
                onChange={handleEditChange}
              >
                <option value="Melbourne">Melbourne</option>
                <option value="Sydney">Sydney</option>
                <option value="Brisbane">Brisbane</option>
                <option value="Perth">Perth</option>
                <option value="Canberra">Canberra</option>
              </select>
              <select
                name="status"
                value={editPet.status}
                onChange={handleEditChange}
              >
                <option value="Available">Available</option>
                <option value="Adopted">Adopted</option>
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={editPet.description}
                onChange={handleEditChange}
                required
              />

              <input type="file" accept="image/*" onChange={handleImageChange} />

              <button type="submit">Save Changes</button>
              <button type="button" onClick={closePopup}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePets;