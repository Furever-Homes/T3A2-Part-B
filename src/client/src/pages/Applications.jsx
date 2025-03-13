import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Applications.css"; 

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        setError("You must be logged in to view applications.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5001/api/user/applications", {
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

  // Handle deleting an application
  const handleDeleteApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`http://localhost:5001/api/user/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Application deleted successfully.");
      setApplications(applications.filter((app) => app._id !== applicationId));
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application. Please try again.");
    }
  };

  return (
    <div className="applications-page">
      <h1>📄 Adoption Applications</h1>
      <p>Track the status of your applications.</p>

      {loading && <p>Loading applications...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && applications.length === 0 && !error && (
        <p>You haven't submitted any applications yet.</p>
      )}

      <div className="applications-list">
        {applications.map((app) => (
          <div key={app._id} className="application-card">
            {/* Pet Image */}
            {app.pet.image && <img src={app.pet.image} alt={app.pet.name} className="pet-image-app" />}

            <h2>{app.pet.name}</h2>
            <p><strong>Status:</strong> {app.status}</p>
            <p><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
            <p><strong>Message:</strong> {app.message}</p>

            {/* Remove Application Button */}
            <button className="remove-btn" onClick={() => handleDeleteApplication(app._id)}>
              ❌ Remove Application
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
