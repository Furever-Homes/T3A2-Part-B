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

  // Handle profile update
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  // Handle profile picture upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    setNewProfileImage(file);

    const formData = new FormData();
    formData.append("profileImage", file);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/users/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload profile image");
      }

      const data = await response.json();
      setUser((prevUser) => ({ ...prevUser, profileImage: data.imageUrl }));
    } catch (error) {
      console.error("Error uploading profile image:", error.message);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/api/users/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      alert("Account deleted successfully!");
      localStorage.removeItem("token"); // Log user out
      window.location.href = "/"; // Redirect to home
    } catch (error) {
      console.error("Error deleting account:", error.message);
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
