import React, { useState } from "react";
import "../styles/ApplyToAdopt.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ApplyToAdopt = () => {
  const { petId } = useParams(); // Get pet ID from URL
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to apply.");
        return;
      }

      const applicationData = { ...formData, petId };

      await axios.post("https://fureverhomes.onrender.com/api/applications", applicationData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      setTimeout(() => navigate("/success"), 2000); // Redirect after success
    } catch (error) {
      setError("Failed to submit application. Please try again.");
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
          <button type="submit">Submit Application</button>
        </form>
      )}
    </div>
  );
};

export default ApplyToAdopt;