import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUser({ ...data.user, token });
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (error) {
        console.error('Fetch profile failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.user.token);
        setToken(data.user.token);
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true };
      } else {
        showToast(data.message || 'Login failed', 'error');
        return { success: false, message: data.message };
      }
    } catch (error) {
      showToast('Server connection failed', 'error');
      return { success: false, message: 'Server connection failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.user.token);
        setToken(data.user.token);
        setUser(data.user);
        showToast(`Account created! Welcome, ${data.user.name}`, 'success');
        return { success: true };
      } else {
        showToast(data.message || 'Registration failed', 'error');
        return { success: false, message: data.message };
      }
    } catch (error) {
      showToast('Server connection failed', 'error');
      return { success: false, message: 'Server connection failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
