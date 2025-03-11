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
      const token = localStorage.getItem("token"); // Get auth token from storage
      if (!token) {
        setError("You must be logged in to view applications.");
        setLoading(false);
        return;
      }

      const response = await axios.get("https://fureverhomes.onrender.com/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(response.data);
    } catch (error) {
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
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
            <h2>{app.petName}</h2>
            <p><strong>Status:</strong> {app.status}</p>
            <p><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;