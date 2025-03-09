import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    state: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const states = ["VIC", "QLD", "NT", "ACT", "TAS", "WA", "NSW", "SA"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile || !formData.dateOfBirth || !formData.state || !formData.password) {
      setError("All fields are required.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8008/api/register", formData, {
        withCredentials: true,
      });
      localStorage.setItem("userProfile", JSON.stringify(response.data));
      setSuccess(true);
      navigate("/profile");
    } catch (error) {
      setError("Error signing up. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <h1>📝 Sign Up</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Signup successful! Redirecting...</p>}
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
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
