// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api'; // We'll create this api service next

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user'); // Store user object as string
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ _id: data._id, username: data.username })); // Store user object
    setUser({ _id: data._id, username: data.username });
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const register = async (username, password) => {
    const { data } = await api.post('/auth/register', { username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ _id: data._id, username: data.username }));
    setUser({ _id: data._id, username: data.username });
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);