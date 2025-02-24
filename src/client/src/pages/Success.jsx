import React from "react";
import "../styles/Success.css";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="success">
      <h1>🎉 Application Submitted!</h1>
      <p>Thank you for applying to adopt. The shelter will review your application soon.</p>
      <Link to="/explore">Explore More Pets</Link>
    </div>
  );
};

export default Success;