import React, { useState } from "react";
import "../styles/ApplyToAdopt.css";
import { useNavigate } from "react-router-dom";

const ApplyToAdopt = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    navigate("/success"); 
  };

  return (
    <div className="apply-to-adopt">
      <h1>🐾 Apply to Adopt</h1>
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
    </div>
  );
};

export default ApplyToAdopt;
