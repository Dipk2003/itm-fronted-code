import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { buildGoogleAuthUrl } from '../config/googleAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Helper function to extract user data from JWT token
  const extractUserFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT Payload:', payload); // Debug log
      console.log('Role in payload:', payload.role); // Debug log
      return {
        id: payload.sub, // JWT subject is usually the user ID or email
        email: payload.sub,
        role: payload.role || 'ROLE_USER', // Keep original default for now
        exp: payload.exp,
        iat: payload.iat
      };
    } catch (error) {
      console.error('Error extracting user from token:', error);
      return null;
    }
  };

  // Set up axios interceptor for authentication
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.info('You have been logged out');
  };

  // Check if user is logged in on app start
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          const userData = extractUserFromToken(storedToken);
          if (userData && userData.exp > Date.now() / 1000) {
            setToken(storedToken);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // Token expired
            logout();
          }
        } catch (error) {
          console.error('Error parsing stored token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (emailOrPhone, password, userRole = null, adminCode = null) => {
    try {
      setLoading(true);
      
      // Direct login with password (not OTP-based)
      const loginResponse = await axios.post('http://localhost:8080/auth/login', {
        emailOrPhone: emailOrPhone,
        password: password,
        adminCode: adminCode // Add admin code for admin login
      });

      const { token: newToken, user: userData } = loginResponse.data;
      
      // Store token and user data
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      
      toast.success('Login successful!');
      return { success: true, user: userData, redirectTo: getDashboardRoute(userData.role) };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const vendorLogin = async (email, password) => {
    try {
      setLoading(true);
      
      const result = await requestOTP(email, password, 'ROLE_VENDOR');
      if (result.success) {
        return { success: true, message: 'OTP sent successfully', requiresOTP: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Vendor login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (emailOrPhone, password, userRole = null, adminCode = null) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:8080/auth/login', {
        emailOrPhone: emailOrPhone,
        password: password,
        adminCode: adminCode // Add admin code support
      });
      
      toast.success('OTP sent to your email/phone!');
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('OTP request error:', error);
      const message = error.response?.data?.message || error.response?.data || 'Failed to send OTP';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (emailOrPhone, otp) => {
    try {
      setLoading(true);
      
      const verifyResponse = await axios.post('http://localhost:8080/auth/verify', {
        emailOrPhone: emailOrPhone,
        otp: otp
      });

      const { token: newToken, message } = verifyResponse.data;
      
      if (!newToken) {
        throw new Error('No token received from server');
      }
      
      // Extract user data from JWT token
      const userData = extractUserFromToken(newToken);
      
      // Store token and user data
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      
      toast.success('OTP verification successful!');
      return { success: true, user: userData, redirectTo: getDashboardRoute(userData.role) };
    } catch (error) {
      console.error('OTP verification error:', error);
      const message = error.response?.data?.message || error.response?.data || 'Invalid or expired OTP';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (emailOrPhone) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:8080/auth/login', {
        emailOrPhone: emailOrPhone
      });
      
      toast.success('OTP sent successfully!');
      return { success: true, message: 'OTP sent to your email/phone' };
    } catch (error) {
      console.error('Send OTP error:', error);
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/auth/register', userData);
      
      toast.success('Registration successful! Please verify your account.');
      return { success: true, message: 'Registration successful! Please check your email/phone for verification.' };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const registerVendor = async (vendorData) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/auth/vendor/register', {
        ...vendorData,
        name: `${vendorData.firstName} ${vendorData.lastName}`,
        role: 'ROLE_VENDOR',
        userType: 'vendor'
      });
      
      toast.success('Vendor registration successful! Please verify your account.');
      return { success: true, message: 'Vendor registration successful! Please check your email/phone for verification.' };
    } catch (error) {
      console.error('Vendor registration error:', error);
      const message = error.response?.data?.message || 'Vendor registration failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const loginWithGoogle = () => {
    try {
      // Redirect to Google OAuth
      const googleAuthUrl = buildGoogleAuthUrl();
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to initiate Google login');
    }
  };

  const handleGoogleCallback = async (code) => {
    try {
      setLoading(true);
      
      // Send the authorization code to backend
      const response = await axios.post('http://localhost:8080/auth/google', {
        code: code
      });

      const { token: newToken, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      
      toast.success('Google login successful!');
      return { success: true, user: userData, redirectTo: getDashboardRoute(userData.role) };
    } catch (error) {
      console.error('Google login callback error:', error);
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get dashboard route based on user role
  const getDashboardRoute = (role) => {
    switch (role) {
      case 'ROLE_USER':
        return '/user-dashboard';
      case 'ROLE_VENDOR':
        return '/vendor-dashboard';
      case 'ROLE_ADMIN':
        return '/admin-dashboard';
      default:
        return '/';
    }
  };

  // Helper functions
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return hasRole('ROLE_ADMIN');
  };

  const isVendor = () => {
    return hasRole('ROLE_VENDOR');
  };

  const getUserId = () => {
    return user?.id;
  };

  const value = {
    user,
    token,
    loading,
    login,
    vendorLogin,
    register,
    registerVendor,
    logout,
    sendOTP,
    requestOTP,
    verifyOTP,
    updateUser,
    loginWithGoogle,
    handleGoogleCallback,
    isAuthenticated,
    hasRole,
    isAdmin,
    isVendor,
    getUserId,
    getDashboardRoute
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
