import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ApplicationAdmin.css";

const ApplicationAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ location: "", animalType: "", status: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          const confirmLogin = window.confirm("Only admins can access this page. Would you like to log in?");
          if (confirmLogin) {
            navigate("/login");
          } else {
            navigate("/");
          }
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data.admin) {
          alert("Access denied. You must be an admin to view this page.");
          navigate("/");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Error verifying admin status:", error);
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchApplications();
    }
  }, [isAdmin, filters]);

  const fetchApplications = async () => {
    try {
      let query = "";
      if (filters.location) query += `location=${filters.location}&`;
      if (filters.animalType) query += `animalType=${filters.animalType}&`;
      if (filters.status) query += `status=${filters.status}&`;

      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/applications?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApprove = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/applications/${applicationId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Application approved!");
      fetchApplications();
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application. Please try again.");
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/applications/${applicationId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Application rejected!");
      fetchApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application. Please try again.");
    }
  };

  const handleDelete = async (applicationId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this application?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Application deleted!");
      fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application. Please try again.");
    }
  };

  if (!isAdmin) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="applications-admin-page">
      <h1>📂 Admin: All Applications</h1>

      {/* Filter Options */}
      <div className="admin-app-filters">
        <select name="location" onChange={handleFilterChange} value={filters.location}>
          <option value="">All Locations</option>
          <option value="Melbourne">Melbourne</option>
          <option value="Sydney">Sydney</option>
          <option value="Brisbane">Brisbane</option>
          <option value="Perth">Perth</option>
          <option value="Canberra">Canberra</option>
        </select>

        <select name="animalType" onChange={handleFilterChange} value={filters.animalType}>
          <option value="">All Animal Types</option>
          <option value="Cat">Cat</option>
          <option value="Dog">Dog</option>
          <option value="Other">Other</option>
        </select>

        <select name="status" onChange={handleFilterChange} value={filters.status}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="admin-applications-list">
          {applications.map((app) => (
            <div key={app._id} className="admin-application-card">
              <div className="applicant-info">
                <img src={app.user.image} alt={app.user.name} className="user-image" />
                <p><strong>User:</strong> {app.user.name}</p>
                <p><strong>Email:</strong> {app.user.email}</p>
              </div>

              <div className="pet-info">
                <img src={app.pet.image} alt={app.pet.name} className="admin-app-pet-image" />
                <p><strong>Pet:</strong> {app.pet.name} ({app.pet.animalType})</p>
                <p><strong>Age:</strong> {app.pet.age} years</p>
                <p><strong>Activity Level:</strong> {app.pet.activityLevel}</p>
                <p><strong>Location:</strong> {app.pet.location}</p>
                <p><strong>Status:</strong> {app.pet.status}</p>
              </div>

              <p><strong>Message:</strong> {app.message}</p>
              <p><strong>Application Status:</strong> {app.status}</p>

              <div className="application-actions">
                {app.status === "Pending" && (
                  <div className="action-buttons">
                    <button className="app-approve-btn" onClick={() => handleApprove(app._id)}>Approve</button>
                    <button className="app-reject-btn" onClick={() => handleReject(app._id)}>Reject</button>
                  </div>
                )}
                <button className="app-delete-btn" onClick={() => handleDelete(app._id)}>Delete Application</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationAdmin;
