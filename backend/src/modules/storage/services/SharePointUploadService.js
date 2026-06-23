const graphMailService = require('../../email-tender-scanning/services/MicrosoftGraphMailService');

class SharePointUploadService {
  /**
   * TB-013: Get or create the bid-specific folder in SharePoint
   * @param {string} bidId 
   * @param {string} companyId 
   */
  async getOrCreateFolder(bidId, companyId) {
    return graphMailService.getOrCreateSiteFolder(companyId, bidId);
  }

  /**
   * TB-012: Upload document to SharePoint
   * @param {string} bidId 
   * @param {string} filename 
   * @param {Buffer} buffer 
   * @param {string} contentType 
   * @param {string} companyId 
   */
  async uploadDocument(bidId, filename, buffer, contentType, companyId) {
    return graphMailService.uploadDocumentToSharePoint(companyId, bidId, filename, buffer, contentType);
  }
}

module.exports = new SharePointUploadService();
