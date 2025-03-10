import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch user profile on component load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("https://localhost:5001/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setUpdatedUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes for updating profile
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.put("https://localhost:5001/api/users/update", updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
      setUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete("https://localhost:5001/api/users/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Account deleted successfully.");
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post("https://localhost:5001/api/users/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((prevUser) => ({ ...prevUser, profileImage: response.data.imageUrl }));
      alert("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Image */}
        <div className="profile-image-container">
          {user.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="profile-image" />
          ) : (
            <p>No profile image</p>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p>Uploading...</p>}
        </div>

        {/* Profile Info */}
        <h1>{user.name || "Adopter Profile"}</h1>
        <p><strong>Email:</strong> {user.email || "Not set"}</p>
        <p><strong>Preferred Pet:</strong> {user.preferredPet || "Not set"}</p>

        {editing ? (
          <>
            <input type="text" name="name" value={updatedUser.name} onChange={handleChange} />
            <input type="text" name="preferredPet" value={updatedUser.preferredPet} onChange={handleChange} />
            <button onClick={handleUpdateProfile}>Save Changes</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
            <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;