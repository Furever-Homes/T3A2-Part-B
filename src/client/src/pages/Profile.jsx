import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  // Fetch user data from backend when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/users/profile", {
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

      const response = await axios.put("http://localhost:5000/api/users/update", updatedUser, {
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

      await axios.delete("http://localhost:5000/api/users/delete", {
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
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Image */}
        <div className="profile-image-container">
          {profileImage ? (
            <img src={URL.createObjectURL(profileImage)} alt="Profile" className="profile-image" />
          ) : (
            <p>No profile image</p>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
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