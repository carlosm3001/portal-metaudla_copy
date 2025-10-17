import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Represents initial session loading
  const navigate = useNavigate();

  // Check for existing session on app startup
  useEffect(() => {
    const checkSession = async () => {
      const session = await api.getSession();
      if (session) {
        setUser(session.user);
        setToken(session.token);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = useCallback(async (credentials) => {
    const { user, token } = await api.login(credentials);
    setUser(user);
    setToken(token);
    setIsLoggedIn(true);
    navigate('/'); // Redirect to home after login
  }, [navigate]);

  const register = useCallback(async (userData) => {
    const { user, token } = await api.register(userData);
    setUser(user);
    setToken(token);
    setIsLoggedIn(true);
    navigate('/'); // Redirect to home after registration
  }, [navigate]);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login after logout
  }, [navigate]);

  const value = {
    user,
    token,
    isLoggedIn,
    isLoading,
    login,
    register,
    logout,
    // Keep handleLogout for backward compatibility for now, but alias it to logout
    handleLogout: logout, 
    // Keep userRole for backward compatibility
    userRole: user?.role || null,
  };

  // We don't render anything until the initial session check is complete
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}