/**
 * E2E environment — override for production/staging via env vars.
 */
module.exports = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
  apiURL: process.env.PLAYWRIGHT_API_URL || 'http://localhost:5026/api',
  adminEmail: process.env.E2E_ADMIN_EMAIL || 'admin@medicare.com',
  adminPassword: process.env.E2E_ADMIN_PASSWORD || 'Admin@123',
  managerEmail: process.env.E2E_MANAGER_EMAIL || 'manager@medicare.com',
  managerPassword: process.env.E2E_MANAGER_PASSWORD || 'Manager@123'
};
