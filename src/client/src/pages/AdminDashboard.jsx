import React from "react";
import "../styles/AdminDashboard.css";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>⚙️ Admin Dashboard</h1>
      <Link to="/admin/manage-pets">Manage Pets</Link>
      <Link to="/admin/applications">View Applications</Link>
    </div>
  );
};

export default AdminDashboard;