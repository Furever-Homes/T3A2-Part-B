import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [pets, setPets] = useState([]);
  const [addingPet, setAddingPet] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPet, setNewPet] = useState({
    name: "",
    age: "",
    animalType: "", // Default option
    activityLevel: "", // Default option
    status: "",
    description: "",
    location: "", // Default option
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

        const applicationsResponse = await axios.get(
          "http://localhost:5001/api/admin/applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(applicationsResponse.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
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

  // Handle new pet submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingPet(true);

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

      setPets([...pets, response.data]);
      alert("Pet added successfully!");

      // Reset form
      setNewPet({
        name: "",
        age: "",
        animalType: "Cat",
        activityLevel: "Medium",
        status: "Available",
        description: "",
        location: "Melbourne",
      });
      setImage(null);
      document.getElementById("imageUploadDash").value = ""; // Reset file input field
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Failed to add pet.");
    } finally {
      setAddingPet(false);
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
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
