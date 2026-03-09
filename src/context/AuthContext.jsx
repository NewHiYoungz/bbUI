import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedAuth = localStorage.getItem('apimart_auth');
    return storedAuth === 'true';
  });

  const [user, setUser] = useState(() => {
    const storedAuth = localStorage.getItem('apimart_auth');
    return storedAuth === 'true' ? mockUser : null;
  });

  const login = useCallback(() => {
    // Mock login - accept any credentials
    setIsLoggedIn(true);
    setUser(mockUser);
    localStorage.setItem('apimart_auth', 'true');
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('apimart_auth');
  }, []);

  const generateNewAPIKey = useCallback(() => {
    const newKey = `sk-apimart-${Math.random().toString(36).substring(2, 15)}`;
    setUser({ ...user, apiKey: newKey });
    return newKey;
  }, [user]);

  const value = useMemo(() => ({
    isLoggedIn,
    user,
    login,
    logout,
    generateNewAPIKey,
  }), [isLoggedIn, user, login, logout, generateNewAPIKey]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
