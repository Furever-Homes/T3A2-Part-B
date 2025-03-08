import React, { useState, useEffect } from "react";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    preferredPet: "",
    profileImage: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token"); // Ensure JWT token is stored in localStorage
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle input changes for editing profile
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
      <div className="profile-card">
        {/* Display profile picture */}
        <div className="profile-image-container">
          {user.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="profile-image" />
          ) : (
            <p>No profile image</p>
          )}
          <input type="file" onChange={handleProfileImageUpload} accept="image/*" />
        </div>

        {/* Display user information */}
        <h1>{user.name || "Adopter Profile"}</h1>
        <p><strong>Email:</strong> {user.email || "Not set"}</p>
        <p><strong>Preferred Pet:</strong> {user.preferredPet || "Not set"}</p>

        {/* Edit profile fields */}
        {isEditing && (
          <div className="edit-form">
            <input type="text" name="name" value={user.name} onChange={handleChange} placeholder="Name" />
            <input type="text" name="preferredPet" value={user.preferredPet} onChange={handleChange} placeholder="Preferred Pet" />
            <button onClick={handleUpdateProfile}>Save Changes</button>
          </div>
        )}

        {/* Buttons for editing and deleting */}
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        ) : (
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        )}

        <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;