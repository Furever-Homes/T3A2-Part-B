import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPet, setNewPet] = useState({
    name: "",
    age: "",
    breed: "",
    description: "",
  });
  const [image, setImage] = useState(null);

  // Fetch pets and applications from backend
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setError("Unauthorized access.");

        const petsResponse = await axios.get("http://localhost:5001/api/pets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const applicationsResponse = await axios.get("http://localhost:5001/api/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPets(petsResponse.data);
        setApplications(applicationsResponse.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Upload Image to Backend
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/api/pets/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.imageUrl; // Return the uploaded image URL
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  // Handle new pet submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadImage(); // Upload image first
    if (!imageUrl) return alert("Image upload failed.");

    const petWithImage = { ...newPet, photo: imageUrl };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/pets", petWithImage, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Pet added successfully!");
      setPets([...pets, petWithImage]); // Update state with new pet
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>⚙️ Admin Dashboard</h1>

      {loading ? (
        <p>Loading admin data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <h2>📋 Manage Pets</h2>
          <Link to="/admin/manage-pets">Go to Pet Management</Link>
          <p>{pets.length} pets currently listed.</p>

          <h2>📄 Adoption Applications</h2>
          <Link to="/admin/applications">View Applications</Link>
          <p>{applications.length} applications pending.</p>

          <h2>➕ Add a New Pet</h2>
          <form onSubmit={handleSubmit} className="add-pet-form">
            <input type="text" name="name" placeholder="Pet Name" onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
            <input type="text" name="breed" placeholder="Breed" onChange={handleChange} required />
            <textarea name="description" placeholder="Description" onChange={handleChange} required></textarea>
            <input type="file" accept="image/*" onChange={handleImageChange} required />
            <button type="submit">Add Pet</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;