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
    animalType: "",
    activityLevel: "",
    status: "Available",
    description: "",
    location: "",
  });
  const [image, setImage] = useState(null);

  // Fetch pets and applications from backend
  useEffect(() => {
    const fetchAdminData = async () => {
 
      try {
        const petsResponse = await axios.get("http://localhost:5001/api/pets");
        setPets(petsResponse.data);
  
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized access.");
          return;
        }
  
        const applicationsResponse = await axios.get("http://localhost:5001/api/admin/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });

  
        setApplications(applicationsResponse.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false); // ✅ Ensure UI updates even on error
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

  // Handle new pet submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare FormData to send all pet details and the image
    const formData = new FormData();
    formData.append("name", newPet.name);
    formData.append("age", String(newPet.age));
    formData.append("animalType", newPet.animalType);
    formData.append("activityLevel", newPet.activityLevel);
    formData.append("status", newPet.status);
    formData.append("description", newPet.description);
    formData.append("location", newPet.location);
    if (image) formData.append("image", image);
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.post("http://localhost:5001/api/admin/pets", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert("Pet added successfully!");
      setPets([...pets, response.data]); 
      setNewPet({
        name: "",
        age: "",
        animalType: "",
        activityLevel: "",
        status: "Available",
        description: "",
        location: "",
      });
      setImage(null);
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Failed to add pet.");
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
            <input type="text" name="name" placeholder="Pet Name" value={newPet.name} onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" value={newPet.age} onChange={handleChange} required />
            <input type="text" name="animalType" placeholder="Animal Type" value={newPet.animalType} onChange={handleChange} required />
            <input type="text" name="activityLevel" placeholder="Activity Level" value={newPet.activityLevel} onChange={handleChange} required />
            <select name="status" value={newPet.status} onChange={handleChange} required>
              <option value="Available">Available</option>
              <option value="Adopted">Adopted</option>
            </select>
            <input type="text" name="location" placeholder="Location" value={newPet.location} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" value={newPet.description} onChange={handleChange} required></textarea>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button type="submit">Add Pet</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
