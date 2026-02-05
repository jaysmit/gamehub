import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { api } from '../utils/api';
import {
  setTokens,
  clearTokens,
  hasTokens,
  getRefreshToken
} from '../utils/tokenStorage';

// Create auth context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!hasTokens()) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await api.getMe();
        setUser(userData);
        setIsLoggedIn(true);
      } catch (err) {
        // Token invalid or expired
        clearTokens();
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register
  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const response = await api.register(name, email, password);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      setIsLoggedIn(true);
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await api.login(email, password);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      setIsLoggedIn(true);
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await api.logout(refreshToken);
      }
    } catch (err) {
      // Ignore logout errors
    } finally {
      clearTokens();
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  // Handle OAuth callback (tokens from URL)
  const handleOAuthCallback = useCallback(async (accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    try {
      const userData = await api.getMe();
      setUser(userData);
      setIsLoggedIn(true);
      return userData;
    } catch (err) {
      clearTokens();
      throw err;
    }
  }, []);

  // Update user data
  const updateUser = useCallback(async (updates) => {
    try {
      const updatedUser = await api.updateMe(updates);
      setUser(prev => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }, []);

  // Update settings
  const updateSettings = useCallback(async (settings) => {
    try {
      const updatedSettings = await api.updateSettings(settings);
      setUser(prev => ({
        ...prev,
        settings: { ...prev.settings, ...updatedSettings }
      }));
      return updatedSettings;
    } catch (err) {
      throw err;
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const userData = await api.getMe();
      setUser(userData);
      return userData;
    } catch (err) {
      throw err;
    }
  }, [isLoggedIn]);

  const value = {
    user,
    isLoggedIn,
    isLoading,
    error,
    register,
    login,
    logout,
    handleOAuthCallback,
    updateUser,
    updateSettings,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
