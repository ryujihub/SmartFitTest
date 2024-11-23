import { jwtDecode } from "jwt-decode"; // Corrected import

// Save token to local storage

export const saveToken = (token) => {
    localStorage.setItem("adminToken", token); // Save the token in localStorage
  };
  

// Get token from local storage
export const getToken = () => {
  return localStorage.getItem("authToken");
};

// Remove token from local storage
export const removeToken = () => {
  localStorage.removeItem("authToken");
};

// Decode the JWT token
export const decodeToken = (token) => {
  return jwtDecode(token); // Updated to use jwtDecode
};

// Check if the token is expired
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  return decoded.exp * 1000 < Date.now();
};
