import React, { useState } from "react";
import { adminLogin } from "../services/api";  // Ensure this imports correctly
import { saveToken } from "../utils/auth";    // Function to save JWT token
import { useNavigate } from "react-router-dom"; // React Router's useNavigate hook

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Use useNavigate hook for routing

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    console.log("Submitting admin login..."); 

    try {
      const response = await adminLogin(username, password);  // Call the API
      saveToken(response.data.token);  // Save the token to localStorage or cookies
      navigate("/admin-dashboard");  // Navigate to admin dashboard after successful login
    } catch (err) {
      setError(err.response ? err.response.data.error : "Invalid credentials");  // Set error message
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleAdminLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error if any */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
