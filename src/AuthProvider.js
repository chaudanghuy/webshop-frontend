import React, { createContext, useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import apiRequest from './lib/apiRequest';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  const validateToken = async () => {
    try {
      const response = await apiRequest.get("/auth/validate-token", {
        withCredentials: true, // Include cookies with the request
      });
      if (response.data) {
        setIsValidToken(true);
        return true;
      }
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await validateToken();
      if (!isValid) {
        localStorage.removeItem("user");        
      }
    };
    
    checkToken();    
  }, []);

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setIsAuthenticated(true)
  };
  const getUser = () => JSON.parse(localStorage.getItem("user"));
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// PrivateRoute Component
export const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
};