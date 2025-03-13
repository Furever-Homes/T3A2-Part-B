import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [uploading, setUploading] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const navigate = useNavigate(); 
  const hasPrompted = useRef(false); 

  const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/ddjbhfzgf/image/upload/v1741613254/default_user_gwqxsa.jpg";

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && !hasPrompted.current) {
      hasPrompted.current = true;
      const confirmLogin = window.confirm("Only logged-in users can view their profile. Would you like to log in?");
      if (confirmLogin) {
        navigate("/login"); // Redirect to login page
      } else {
        navigate("/"); // Redirect to homepage if they refuse
      }
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setUpdatedUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle input changes for updating profile
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.put("http://localhost:5001/api/user/profile", updatedUser, {
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

      await axios.delete("http://localhost:5001/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Account deleted successfully.");
      localStorage.removeItem("token");
      navigate("/"); 
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("favourites");
    localStorage.removeItem("admin");
    navigate("/login"); 
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.put("http://localhost:5001/api/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((prevUser) => ({ ...prevUser, image: response.data.image }));
      alert("Profile image updated successfully!");
      setShowFileInput(false);
    } catch (error) {
      console.error("Error uploading profile image:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handle profile image removal (sets image to null)
  const handleRemoveImage = async () => {
    if (!window.confirm("Are you sure you want to remove your profile image?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.put(
        "http://localhost:5001/api/user/profile",
        { image: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile image removed successfully!");
      setUser((prevUser) => ({ ...prevUser, image: response.data.image }));
    } catch (error) {
      console.error("Error removing profile image:", error);
    }
  };

  // Navigate to admin dashboard
  const handleAdminDashboard = () => {
    navigate("/admin/dashboard");
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  const isDefaultImage = user.image === DEFAULT_IMAGE_URL;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Image */}
        <div className="profile-image-container">
          <img src={user.image || DEFAULT_IMAGE_URL} alt="Profile" className="profile-image" />

          <div className="profile-button-container">
            {/* Add/Update Photo Button */}
            <button className="photo-btn" onClick={() => setShowFileInput(!showFileInput)}>
              {isDefaultImage ? "Add Photo" : "Update Photo"}
            </button>

            {/* Hidden File Input (Shows Only When Button is Clicked) */}
            {showFileInput && <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />}

            {/* Remove Photo Button (Only Shows if NOT Default Image) */}
            {!isDefaultImage && (
              <button className="remove-photo-btn" onClick={handleRemoveImage}>
                Remove Photo
              </button>
            )}
          </div>

          {uploading && <p>Uploading...</p>}
        </div>

        {/* Profile Info */}
        <div className="profile-details">
          <h1>{user.name || "Adopter Profile"}</h1>
          <p><strong>Email:</strong> {user.email || "Not set"}</p>
        </div>

        {editing ? (
          <section className="edit-section">
            <input type="text" name="name" value={updatedUser.name} onChange={handleChange} />
            <div className="edit-buttons">
              <button className="save-edit-btn" onClick={handleUpdateProfile}>Save Changes</button>
              <button className="cancel-edit-btn" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </section>
        ) : (
          <section className="profile-buttons">
            <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
            <button className="prof-delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </section>
        )}

        {/* Admin Dashboard Button (Only for Admins) */}
        {user.admin && (
          <button className="admin-btn" onClick={handleAdminDashboard}>Go to Admin Dashboard</button>
        )}
  
      </div>
    </div>
  );
};

export default Profile;
