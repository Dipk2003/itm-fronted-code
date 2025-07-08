import axiosInstance from '../config/axios';
import API_CONFIG from '../config/api';

// Vendor service functions
export const vendorService = {
  // Get vendor ranking
  getVendorRanking: async (vendorId) => {
    const url = API_CONFIG.ENDPOINTS.VENDOR.RANKING.replace('{vendorId}', vendorId);
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // Verify PAN and GST
  verifyPanAndGst: async (vendorId, panData) => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.TAX.VERIFY_PAN, null, {
      params: {
        vendorId,
        pan: panData.pan,
        gst: panData.gst,
        legalName: panData.legalName
      }
    });
    return response.data;
  },

  // Get vendor products
  getVendorProducts: async (vendorId) => {
    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.PRODUCTS.BY_VENDOR}/${vendorId}`);
    return response.data;
  },

  // Add dummy vendor for testing
  addDummyVendor: async () => {
    const dummyVendorData = {
      firstName: 'Test',
      lastName: 'Vendor',
      email: 'test.vendor@example.com',
      phone: '1234567890',
      companyName: 'Test Vendor Ltd',
      businessType: 'Manufacturer',
      address: '123 Test Street',
      city: 'Testville',
      state: 'Teststate',
      pincode: '123456',
      password: 'TestPassword123',
      role: 'ROLE_VENDOR',
      userType: 'vendor',
      verified: false,
      approvalStatus: 'pending'
    };
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, dummyVendorData);
    return response.data;
  },

  // Add new product
  addProduct: async (productData) => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.PRODUCTS.ADD, productData);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  },

  // Add new category (admin only)
  addCategory: async (categoryName) => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.CATEGORIES.ADD, null, {
      params: { name: categoryName }
    });
    return response.data;
  },

  // Mock PAN verification service (since you mentioned API integration)
  mockPanVerification: async (panNumber) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock GST numbers based on PAN
    const mockGstData = {
      pan: panNumber,
      gstNumbers: [
        {
          gstin: `${panNumber.substring(0, 2)}${panNumber}001Z1`,
          businessName: 'Main Business Unit',
          address: 'Delhi, India',
          status: 'Active'
        },
        {
          gstin: `${panNumber.substring(0, 2)}${panNumber}002Z2`,
          businessName: 'Branch Office',
          address: 'Mumbai, India', 
          status: 'Active'
        },
        {
          gstin: `${panNumber.substring(0, 2)}${panNumber}003Z3`,
          businessName: 'Manufacturing Unit',
          address: 'Bangalore, India',
          status: 'Active'
        }
      ],
      legalName: 'Sample Business Pvt Ltd',
      businessType: 'Private Limited Company'
    };
    
    return mockGstData;
  },

  // Lead Management APIs
  getVendorLeads: async (vendorId) => {
    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.LEADS.BASE}/vendor/${vendorId}`);
    return response.data;
  },

  getLeadById: async (leadId) => {
    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.LEADS.BASE}/${leadId}`);
    return response.data;
  },

  createLead: async (leadData) => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.LEADS.BASE, leadData);
    return response.data;
  },

  updateLead: async (leadId, leadData) => {
    const response = await axiosInstance.put(`${API_CONFIG.ENDPOINTS.LEADS.BASE}/${leadId}`, leadData);
    return response.data;
  },

  updateLeadStatus: async (leadId, status) => {
    const response = await axiosInstance.patch(`${API_CONFIG.ENDPOINTS.LEADS.BASE}/${leadId}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  getLeadsByStatus: async (vendorId, status) => {
    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.LEADS.BASE}/vendor/${vendorId}/status/${status}`);
    return response.data;
  },

  getLeadsByPriority: async (vendorId, priority) => {
    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.LEADS.BASE}/vendor/${vendorId}/priority/${priority}`);
    return response.data;
  },

  getLeadStats: async (vendorId) => {
    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.LEADS.BASE}/vendor/${vendorId}/stats`);
    return response.data;
  },

  // Get vendor dashboard stats
  getDashboardStats: async (vendorId) => {
    try {
      const [ranking, products, leadStats] = await Promise.all([
        vendorService.getVendorRanking(vendorId),
        vendorService.getVendorProducts(vendorId),
        vendorService.getLeadStats(vendorId).catch(() => ({ totalLeads: 0, convertedLeads: 0, conversionRate: 0 }))
      ]);

      return {
        totalProducts: products.length,
        totalLeads: leadStats.totalLeads || ranking.totalLeadsGenerated || 0,
        performanceScore: ranking.performanceScore || 0,
        activeListings: products.filter(p => p.stock > 0).length,
        soldProducts: products.reduce((sum, p) => sum + (p.initialStock - p.stock || 0), 0),
        convertedLeads: leadStats.convertedLeads || 0,
        conversionRate: leadStats.conversionRate || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalProducts: 0,
        totalLeads: 0,
        performanceScore: 0,
        activeListings: 0,
        soldProducts: 0,
        convertedLeads: 0,
        conversionRate: 0
      };
    }
  }
};

export default vendorService;
