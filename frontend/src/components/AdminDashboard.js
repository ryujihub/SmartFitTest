// AdminDashboard.js (Example for protected route)
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");  // Redirect to login page if no token
    }
  }, [navigate]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {/* Dashboard content */}
    </div>
  );
};

export default AdminDashboard;
