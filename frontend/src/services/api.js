import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Change if needed

// Signup request
export const signup = (email, password) => {
  return axios.post(`${API_URL}/signup`, { email, password });
};

// Login request
export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

// Admin login request
export const adminLogin = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/admin", {
        username,
        password,
      });
      return response;
    } catch (err) {
      throw err; // Ensure errors are thrown to be caught by the calling component
    }
  };