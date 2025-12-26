import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user's "digital ID card" exists
  const token = localStorage.getItem('token');

  // If no token, kick them back to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, let them through to the page
  return children;
};

export default ProtectedRoute;