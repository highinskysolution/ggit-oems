import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('oems_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('oems_token');
      const storedUser = localStorage.getItem('oems_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('oems_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Auth token validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('oems_token', res.data.token);
        localStorage.setItem('oems_user', JSON.stringify(res.data.user));
        return res.data;
      }
      throw new Error(res.data.message || 'Login failed');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Invalid email or password.';
      throw new Error(errorMsg);
    }
  };

  const adminLogin = async (email, password, admin_key) => {
    try {
      const res = await api.post('/auth/admin-login', { email, password, admin_key });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('oems_token', res.data.token);
        localStorage.setItem('oems_user', JSON.stringify(res.data.user));
        return res.data;
      }
      throw new Error(res.data.message || 'Admin authentication failed');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Admin authentication failed. Please check your credentials and key.';
      throw new Error(errorMsg);
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('oems_token', res.data.token);
        localStorage.setItem('oems_user', JSON.stringify(res.data.user));
        return res.data;
      }
      throw new Error(res.data.message || 'Registration failed');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed. Please check your details.';
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('oems_token');
    localStorage.removeItem('oems_user');
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('oems_user', JSON.stringify(res.data.user));
        return res.data;
      }
      throw new Error(res.data.message || 'Failed to update profile');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update profile';
      throw new Error(errorMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        adminLogin,
        register,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isTeacher: user?.role === 'teacher',
        isAdmin: user?.role === 'admin',
        isFacultyOrAdmin: user?.role === 'teacher' || user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
