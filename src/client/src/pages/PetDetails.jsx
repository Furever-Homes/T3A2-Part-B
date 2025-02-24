import React from "react";
import "../styles/PetDetails.css";
import { useParams } from "react-router-dom";

const PetDetails = () => {
  const { id } = useParams();
  return (
    <div className="pet-details">
      <h1>🐶 Pet Details - ID: {id}</h1>
      <p>More details coming soon...</p>
    </div>
  );
};

export default PetDetails;