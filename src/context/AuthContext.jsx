import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../data/mockUser';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('apimart_auth');
    if (storedAuth === 'true') {
      setIsLoggedIn(true);
      setUser(mockUser);
    }
  }, []);

  const login = (email, password) => {
    // Mock login - accept any credentials
    setIsLoggedIn(true);
    setUser(mockUser);
    localStorage.setItem('apimart_auth', 'true');
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('apimart_auth');
  };

  const generateNewAPIKey = () => {
    const newKey = `sk-apimart-${Math.random().toString(36).substring(2, 15)}`;
    setUser({ ...user, apiKey: newKey });
    return newKey;
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    generateNewAPIKey,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
