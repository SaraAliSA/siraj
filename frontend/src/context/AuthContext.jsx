import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate session on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('siraj_token');
      if (token) {
        try {
          const response = await client.get('/auth/me');
          setUser(response.data);
        } catch (err) {
          console.error("Session verification failed:", err);
          localStorage.removeItem('siraj_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('siraj_token', access_token);
      setUser(userData);
      setLoading(false);
      return userData;
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.detail || "فشل تسجيل الدخول. يرجى التحقق من بياناتك.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (email, fullName, password, currency = "SAR") => {
    setLoading(true);
    setError(null);
    try {
      await client.post('/auth/register', {
        email,
        full_name: fullName,
        password,
        currency
      });
      // After registration, auto login
      return await login(email, password);
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.detail || "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('siraj_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
