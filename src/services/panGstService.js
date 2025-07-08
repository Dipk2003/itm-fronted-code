import api from '../config/api';

class PanGstService {
  
  /**
   * Verify PAN number format and validity
   * @param {string} panNumber - PAN number to verify
   * @returns {Promise} - API response
   */
  async verifyPan(panNumber) {
    try {
      const response = await api.post('/tax/verify-pan', {
        panNumber: panNumber.toUpperCase()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'PAN verification failed');
    }
  }

  /**
   * Verify GST number format and validity
   * @param {string} gstNumber - GST number to verify
   * @returns {Promise} - API response
   */
  async verifyGst(gstNumber) {
    try {
      const response = await api.post('/tax/verify-gst', {
        gstNumber: gstNumber.toUpperCase()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'GST verification failed');
    }
  }

  /**
   * Verify both PAN and GST for a vendor
   * @param {Object} taxData - Object containing vendorId, pan, gst, legalName
   * @returns {Promise} - API response
   */
  async verifyVendorTaxData(taxData) {
    try {
      const response = await api.post('/tax/verify-vendor-tax', {
        vendorId: taxData.vendorId,
        panNumber: taxData.panNumber?.toUpperCase(),
        gstNumber: taxData.gstNumber?.toUpperCase(),
        legalName: taxData.legalName
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Tax verification failed');
    }
  }

  /**
   * Get vendor tax profile
   * @param {number} vendorId - Vendor ID
   * @returns {Promise} - API response
   */
  async getVendorTaxProfile(vendorId) {
    try {
      const response = await api.get(`/tax/vendor/${vendorId}/profile`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tax profile');
    }
  }

  /**
   * Update vendor tax profile
   * @param {number} vendorId - Vendor ID
   * @param {Object} taxData - Tax data to update
   * @returns {Promise} - API response
   */
  async updateVendorTaxProfile(vendorId, taxData) {
    try {
      const response = await api.put(`/tax/vendor/${vendorId}/profile`, {
        panNumber: taxData.panNumber?.toUpperCase(),
        gstNumber: taxData.gstNumber?.toUpperCase(),
        legalName: taxData.legalName,
        businessType: taxData.businessType
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update tax profile');
    }
  }

  /**
   * Validate PAN format
   * @param {string} pan - PAN number
   * @returns {boolean} - Is valid format
   */
  validatePanFormat(pan) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  }

  /**
   * Validate GST format
   * @param {string} gst - GST number
   * @returns {boolean} - Is valid format
   */
  validateGstFormat(gst) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  }

  /**
   * Extract PAN from GST number
   * @param {string} gst - GST number
   * @returns {string} - Extracted PAN
   */
  extractPanFromGst(gst) {
    if (gst && gst.length >= 12) {
      return gst.substring(2, 12).toUpperCase();
    }
    return '';
  }

  /**
   * Check if PAN and GST are matching
   * @param {string} pan - PAN number
   * @param {string} gst - GST number
   * @returns {boolean} - Are they matching
   */
  isPanGstMatching(pan, gst) {
    const extractedPan = this.extractPanFromGst(gst);
    return pan.toUpperCase() === extractedPan;
  }
}

export default new PanGstService();
