import axios from 'axios';

// API Base URL - can be changed based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
  },
  
  // Products
  PRODUCTS: {
    BASE: '/products',
    BY_VENDOR: (vendorId) => `/products/vendor/${vendorId}`,
  },
  
  // Categories
  CATEGORIES: {
    BASE: '/categories',
  },
  
  // Leads
  LEADS: {
    BASE: '/api/leads',
    BY_VENDOR: (vendorId) => `/api/leads/vendor/${vendorId}`,
    BY_STATUS: (vendorId, status) => `/api/leads/vendor/${vendorId}/status/${status}`,
    BY_PRIORITY: (vendorId, priority) => `/api/leads/vendor/${vendorId}/priority/${priority}`,
    STATS: (vendorId) => `/api/leads/vendor/${vendorId}/stats`,
    OVERDUE: (vendorId) => `/api/leads/vendor/${vendorId}/overdue`,
    RECENT: (vendorId) => `/api/leads/vendor/${vendorId}/recent`,
    SEARCH: (vendorId) => `/api/leads/vendor/${vendorId}/search`,
    UPDATE_STATUS: (leadId) => `/api/leads/${leadId}/status`,
    UPDATE_PRIORITY: (leadId) => `/api/leads/${leadId}/priority`,
    ADD_NOTES: (leadId) => `/api/leads/${leadId}/notes`,
    STATUSES: '/api/leads/statuses',
    PRIORITIES: '/api/leads/priorities',
  },
  
  // Vendor Dashboard
  VENDOR: {
    RANKING: (vendorId) => `/vendor/${vendorId}/ranking`,
    GST_DETAILS: (vendorId, gstNumber) => `/vendor/${vendorId}/gst/${gstNumber}/details`,
    TDS_DETAILS: (vendorId, panNumber) => `/vendor/${vendorId}/tds/${panNumber}/details`,
    TAX_SELECTIONS: (vendorId) => `/vendor/${vendorId}/tax-selections`,
    GST_SELECTIONS: (vendorId, gstNumber) => `/vendor/${vendorId}/gst/${gstNumber}/selections`,
    TDS_SELECTIONS: (vendorId, panNumber) => `/vendor/${vendorId}/tds/${panNumber}/selections`,
    SELECTED_GST_RATES: (vendorId, gstNumber) => `/vendor/${vendorId}/gst/${gstNumber}/selected-rates`,
    SELECTED_TDS_RATES: (vendorId, panNumber) => `/vendor/${vendorId}/tds/${panNumber}/selected-rates`,
    TAX_DASHBOARD: (vendorId) => `/vendor/${vendorId}/tax-dashboard`,
  },
  
  // Admin
  ADMIN: {
    VENDORS: '/admin/vendors',
    UPDATE_VENDOR_TYPE: (userId) => `/admin/vendor/${userId}/type`,
  },
  
  // Tax/PAN Verification
  TAX: {
    VERIFY_PAN: '/tax/verify-pan',
  },
  
  // Contact
  CONTACT: '/contact',
};

// API Service functions
export const apiService = {
  // Authentication services
  auth: {
    login: (emailOrPhone) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { emailOrPhone }),
    register: (userData) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
    verify: (emailOrPhone, otp) => apiClient.post(API_ENDPOINTS.AUTH.VERIFY, { emailOrPhone, otp }),
  },
  
  // Product services
  products: {
    getAll: () => apiClient.get(API_ENDPOINTS.PRODUCTS.BASE),
    getById: (id) => apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`),
    getByVendor: (vendorId) => apiClient.get(API_ENDPOINTS.PRODUCTS.BY_VENDOR(vendorId)),
    create: (productData) => apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, productData),
    update: (id, productData) => apiClient.put(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`, productData),
    delete: (id) => apiClient.delete(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`),
  },
  
  // Category services
  categories: {
    getAll: () => apiClient.get(API_ENDPOINTS.CATEGORIES.BASE),
    create: (name) => apiClient.post(API_ENDPOINTS.CATEGORIES.BASE, { name }),
  },
  
  // Lead services
  leads: {
    getByVendor: (vendorId) => apiClient.get(API_ENDPOINTS.LEADS.BY_VENDOR(vendorId)),
    getById: (leadId) => apiClient.get(`${API_ENDPOINTS.LEADS.BASE}/${leadId}`),
    create: (leadData) => apiClient.post(API_ENDPOINTS.LEADS.BASE, leadData),
    update: (leadId, leadData) => apiClient.put(`${API_ENDPOINTS.LEADS.BASE}/${leadId}`, leadData),
    delete: (leadId) => apiClient.delete(`${API_ENDPOINTS.LEADS.BASE}/${leadId}`),
    updateStatus: (leadId, status) => apiClient.patch(API_ENDPOINTS.LEADS.UPDATE_STATUS(leadId), null, { params: { status } }),
    updatePriority: (leadId, priority) => apiClient.patch(API_ENDPOINTS.LEADS.UPDATE_PRIORITY(leadId), null, { params: { priority } }),
    addNotes: (leadId, notes) => apiClient.patch(API_ENDPOINTS.LEADS.ADD_NOTES(leadId), null, { params: { notes } }),
    getByStatus: (vendorId, status) => apiClient.get(API_ENDPOINTS.LEADS.BY_STATUS(vendorId, status)),
    getByPriority: (vendorId, priority) => apiClient.get(API_ENDPOINTS.LEADS.BY_PRIORITY(vendorId, priority)),
    getStats: (vendorId) => apiClient.get(API_ENDPOINTS.LEADS.STATS(vendorId)),
    getOverdue: (vendorId) => apiClient.get(API_ENDPOINTS.LEADS.OVERDUE(vendorId)),
    getRecent: (vendorId) => apiClient.get(API_ENDPOINTS.LEADS.RECENT(vendorId)),
    search: (vendorId, customerName) => apiClient.get(API_ENDPOINTS.LEADS.SEARCH(vendorId), { params: { customerName } }),
    getStatuses: () => apiClient.get(API_ENDPOINTS.LEADS.STATUSES),
    getPriorities: () => apiClient.get(API_ENDPOINTS.LEADS.PRIORITIES),
  },
  
  // Vendor services
  vendor: {
    getRanking: (vendorId) => apiClient.get(API_ENDPOINTS.VENDOR.RANKING(vendorId)),
    getGstDetails: (vendorId, gstNumber) => apiClient.get(API_ENDPOINTS.VENDOR.GST_DETAILS(vendorId, gstNumber)),
    getTdsDetails: (vendorId, panNumber) => apiClient.get(API_ENDPOINTS.VENDOR.TDS_DETAILS(vendorId, panNumber)),
    saveTaxSelections: (vendorId, selectionData) => apiClient.post(API_ENDPOINTS.VENDOR.TAX_SELECTIONS(vendorId), selectionData),
    getGstSelections: (vendorId, gstNumber) => apiClient.get(API_ENDPOINTS.VENDOR.GST_SELECTIONS(vendorId, gstNumber)),
    getTdsSelections: (vendorId, panNumber) => apiClient.get(API_ENDPOINTS.VENDOR.TDS_SELECTIONS(vendorId, panNumber)),
    getSelectedGstRates: (vendorId, gstNumber) => apiClient.get(API_ENDPOINTS.VENDOR.SELECTED_GST_RATES(vendorId, gstNumber)),
    getSelectedTdsRates: (vendorId, panNumber) => apiClient.get(API_ENDPOINTS.VENDOR.SELECTED_TDS_RATES(vendorId, panNumber)),
    getTaxDashboard: (vendorId, gstNumber, panNumber) => {
      const params = {};
      if (gstNumber) params.gstNumber = gstNumber;
      if (panNumber) params.panNumber = panNumber;
      return apiClient.get(API_ENDPOINTS.VENDOR.TAX_DASHBOARD(vendorId), { params });
    },
  },
  
  // Admin services
  admin: {
    getAllVendors: () => apiClient.get(API_ENDPOINTS.ADMIN.VENDORS),
    updateVendorType: (userId, vendorType) => apiClient.put(API_ENDPOINTS.ADMIN.UPDATE_VENDOR_TYPE(userId), null, { params: { vendorType } }),
  },
  
  // Tax services
  tax: {
    verifyPan: (vendorId, pan, gst, legalName) => apiClient.post(API_ENDPOINTS.TAX.VERIFY_PAN, null, { 
      params: { vendorId, pan, gst, legalName } 
    }),
  },
  
  // Contact services
  contact: {
    sendMessage: (messageData) => apiClient.post(API_ENDPOINTS.CONTACT, messageData),
  },
};

export default apiClient;
