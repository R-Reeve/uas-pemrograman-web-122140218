// auth.js - Authentication utilities and context

import { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI } from './api'; // Assuming your API utilities are in api.js
import { useAuth } from './auth';

// Create Authentication Context
const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth methods to child components
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state from localStorage
   */
  const initializeAuth = () => {
    try {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('loggedUser');
      
      if (token && savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('User authenticated from localStorage:', userData);
      } else {
        console.log('No saved authentication found');
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear corrupted data
      localStorage.removeItem('authToken');
      localStorage.removeItem('loggedUser');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login function
   * @param {object} credentials - { username, password }
   * @returns {Promise<boolean>} - Success status
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('Attempting login...');
      
      const response = await AuthAPI.login(credentials);
      
      // Handle different response structures
      const token = response.token || response.access_token || response.authToken;
      const userData = response.user || response.data || response;
      
      if (!token) {
        throw new Error('No authentication token received from server');
      }

      // Save authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('loggedUser', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('Login successful:', userData);
      return true;
      
    } catch (error) {
      console.error('Login failed:', error);
      
      // Clear any partial auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('loggedUser');
      setUser(null);
      setIsAuthenticated(false);
      
      throw error; // Re-throw for component handling
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register function
   * @param {object} userData - Registration data
   * @returns {Promise<boolean>} - Success status
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Attempting registration...');
      
      const response = await AuthAPI.signup(userData);
      
      // Some APIs auto-login after registration, others require separate login
      const token = response.token || response.access_token || response.authToken;
      
      if (token) {
        // Auto-login after registration
        const userInfo = response.user || response.data || response;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('loggedUser', JSON.stringify(userInfo));
        
        setUser(userInfo);
        setIsAuthenticated(true);
        
        console.log('Registration and auto-login successful:', userInfo);
      } else {
        console.log('Registration successful, manual login required');
      }
      
      return true;
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw error; // Re-throw for component handling
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    console.log('Logging out user...');
    
    // Clear authentication data
    AuthAPI.logout(); // This clears localStorage
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('Logout successful');
  };

  /**
   * Check if user has specific role or permission
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role || user.roles?.includes(role);
  };

  /**
   * Get current user data
   * @returns {object|null} - Current user data
   */
  const getCurrentUser = () => {
    return user;
  };

  /**
   * Get authentication token
   * @returns {string|null} - Current auth token
   */
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  /**
   * Refresh user data (if needed)
   */
  const refreshUser = async () => {
    try {
      if (!isAuthenticated) return;
      
      // If your API has a user profile endpoint, use it here
      // const userData = await AuthAPI.getProfile();
      // setUser(userData);
      // localStorage.setItem('loggedUser', JSON.stringify(userData));
      
      console.log('User data refreshed');
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, logout user
      logout();
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    hasRole,
    getCurrentUser,
    getToken,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 * @returns {object} - Authentication context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Higher-order component for protecting routes
 * @param {Component} Component - Component to protect
 * @returns {Component} - Protected component
 */
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>; // Or your loading component
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return <Component {...props} />;
  };
}

/**
 * Component for protecting routes (alternative to HOC)
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

/**
 * Utility functions for checking authentication status
 */
export const authUtils = {
  /**
   * Check if user is currently authenticated (static check)
   * @returns {boolean}
   */
  isLoggedIn: () => {
    return AuthAPI.isAuthenticated();
  },
  
  /**
   * Get stored user data (static check)
   * @returns {object|null}
   */
  getStoredUser: () => {
    try {
      const userData = localStorage.getItem('loggedUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },
  
  /**
   * Clear all authentication data
   */
  clearAuthData: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedUser');
  }
};

export default {
  AuthProvider,
  useAuth,
  withAuth,
  ProtectedRoute,
  authUtils
};