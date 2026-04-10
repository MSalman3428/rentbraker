import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // FIXED: Use the API_URL variable instead of hardcoded localhost
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      console.log("LOGIN ERROR:", error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Server connection failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};