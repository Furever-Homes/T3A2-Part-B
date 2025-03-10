import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="admin-dashboard">
      <h1> Admin Dashboard</h1>

      {loading ? (
        <p>Loading admin data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <h2> Manage Pets</h2>
          <Link to="/admin/manage-pets">Go to Pet Management</Link>
          <p>{pets.length} pets currently listed.</p>

          <h2> Adoption Applications</h2>
          <Link to="/admin/applications">View Applications</Link>
          <p>{applications.length} applications pending.</p>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;