import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';
import { useAuth } from './AuthContext';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch historical alerts
      const res = await client.get('/alerts/');
      setAlerts(res.data);
      
      // Fetch count of unread
      const countRes = await client.get('/alerts/unread-count');
      setUnreadCount(countRes.data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await client.put(`/alerts/${id}/read`);
      // Update state locally
      setAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, is_read: true } : alert));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark alert as read:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAlerts();
      // Poll every 30 seconds for active alerts
      const interval = setInterval(fetchAlerts, 30000);
      return () => clearInterval(interval);
    } else {
      setAlerts([]);
      setUnreadCount(0);
    }
  }, [user]);

  return (
    <AlertContext.Provider value={{ alerts, unreadCount, loading, fetchAlerts, markAsRead }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
