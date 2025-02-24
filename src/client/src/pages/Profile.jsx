import React, { useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    preferredPet: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>👤 Profile</h1>
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={user.name}
        onChange={handleChange}
      />

      <label>Preferred Pet Type:</label>
      <input
        type="text"
        name="preferredPet"
        value={user.preferredPet}
        onChange={handleChange}
      />

      <p><strong>Name:</strong> {user.name || "Not set"}</p>
      <p><strong>Preferred Pet:</strong> {user.preferredPet || "Not set"}</p>
    </div>
  );
};

export default Profile;