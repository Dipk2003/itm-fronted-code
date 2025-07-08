// API Configuration
const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  
  // API endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      VERIFY: '/auth/verify',
      LOGOUT: '/auth/logout'
    },
    
    // Admin endpoints
    ADMIN: {
      USERS: '/admin/users',
      USER: '/admin/user',
      ADD_ADMIN: '/admin/add-admin',
      ADMINS: '/admin/admins',
      ADMIN: '/admin/admin'
    },
    
    // Product endpoints
    PRODUCTS: {
      BASE: '/products',
      BY_VENDOR: '/products/vendor',
      ADD: '/products'
    },
    
    // Category endpoints
    CATEGORIES: {
      BASE: '/categories',
      ADD: '/categories'
    },
    
    // Contact endpoints
    CONTACT: '/contact',
    
    // Vendor endpoints
    VENDOR: {
      BASE: '/vendor',
      RANKING: '/vendor/{vendorId}/ranking'
    },
    
    // Lead management endpoints
    LEADS: {
      BASE: '/leads',
      BY_VENDOR: '/leads/vendor',
      STATS: '/leads/stats',
      SEARCH: '/leads/search',
      BY_STATUS: '/leads/status',
      BY_PRIORITY: '/leads/priority',
      OVERDUE: '/leads/overdue'
    },
    
    // Tax/PAN verification endpoints
    TAX: {
      VERIFY_PAN: '/tax/verify-pan',
      VERIFY_GST: '/tax/verify-gst',
      VERIFY_VENDOR_TAX: '/tax/verify-vendor-tax',
      VENDOR_PROFILE: '/tax/vendor/{vendorId}/profile'
    },
    
    // Chatbot endpoints
    CHATBOT: {
      BASE: '/api/chatbot',
      CHAT: '/api/chatbot/chat',
      START_SESSION: '/api/chatbot/start-session',
      HISTORY: '/api/chatbot/history',
      HEALTH: '/api/chatbot/health'
    }
  },
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Get authorization header
  getAuthHeaders: () => {
    const token = localStorage.getItem('vendorToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  
  // Helper to get user data from token
  getUserData: () => {
    const token = localStorage.getItem('vendorToken');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.sub,
        role: payload.role,
        exp: payload.exp
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const userData = API_CONFIG.getUserData();
    if (!userData) return false;
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return userData.exp > currentTime;
  }
};

export default API_CONFIG;
