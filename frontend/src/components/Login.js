import React, { useState } from "react";
import { login } from "../services/api";
import { saveToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";  // Replace useHistory with useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();  // Replace useHistory with useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      saveToken(response.data.token);  // Save the token
      navigate("/dashboard");  // Redirect to the dashboard
    } catch (err) {
      setError(err.response ? err.response.data.error : "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
