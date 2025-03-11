import React, { useState } from "react";
import "../styles/ApplyToAdopt.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ApplyToAdopt = () => {
  const { petId } = useParams(); // Get pet ID from URL
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit adoption application
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error message

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to apply.");
        setLoading(false);
        return;
      }

      const applicationData = { ...formData, petId };

      const response = await axios.post("http://localhost:5001/api/applications", applicationData, {

        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate("/success"), 2000); // Redirect after success
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      setError("Failed to submit application. Please try again.");
      console.error("Application error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-to-adopt">
      <h1>🐾 Apply to Adopt</h1>
      {error && <p className="error-message">{error}</p>}
      {success ? (
        <p className="success-message">Application submitted successfully! Redirecting...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Tell us why you'd like to adopt"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ApplyToAdopt;