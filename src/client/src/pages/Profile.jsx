import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8008/api/user/profile", {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      setError("Could not fetch user profile. Please log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>👤 Profile</h1>
      {loading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="profile-details">
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Mobile: {user.mobile}</p>
          <p>Date of Birth: {user.dateOfBirth}</p>
          <p>State: {user.state}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
