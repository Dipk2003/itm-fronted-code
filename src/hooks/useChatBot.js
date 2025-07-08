import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const useChatBot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api/chatbot`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
  });

  // Add request interceptor for auth token if needed
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        // You might want to redirect to login page here
      }
      return Promise.reject(error);
    }
  );

  const startSession = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/start-session');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to start chat session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const payload = {
        message: messageData.message,
        sessionId: messageData.sessionId,
        userId: messageData.userId || null,
        userIp: null, // Will be set by backend
      };

      const response = await apiClient.post('/chat', payload);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getChatHistory = async (sessionId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(`/history/${sessionId}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch chat history';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (err) {
      console.error('Chatbot service health check failed:', err);
      return null;
    }
  };

  return {
    startSession,
    sendMessage,
    getChatHistory,
    checkHealth,
    isLoading,
    error,
  };
};
