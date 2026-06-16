const express = require('express');

// Import route modules
const authRoutes = require('../routes/auth');
const tenderRoutes = require('../routes/tenderRoutes');
const documentRoutes = require('../routes/document');
const evaluationRoutes = require('../routes/evaluation');
const pricingRoutes = require('../routes/pricing');
const calendarRoutes = require('../routes/calendar');
const userRoutes = require('../routes/user');
const aiRoutes = require('../routes/ai');
const supportRoutes = require('../routes/support');
const adminRoutes = require('../routes/admin');
const dashboardRoutes = require('../routes/dashboard');
const preQualificationRoutes = require('../routes/preQualification');
const roleRoutes = require('../routes/role');
const sourcesWatchlistsRoutes = require('../routes/sourcesWatchlists');
const competitorRoutes = require('../routes/competitor');
const marketDeclarationRoutes = require('../routes/marketDeclaration');
const regulatoryComplianceRoutes = require('../routes/regulatoryCompliance');
const issuedRfpRoutes = require('../routes/issuedRfpRoutes');
const respondRoutes = require('../routes/respondRoutes');
const intelligencePlatformRoutes = require('../routes/intelligencePlatform');
const discoveryConnectorsRoutes = require('../routes/discoveryConnectors');

const setupRoutes = (app) => {
  console.log('🛣️ Setting up API routes...');
  
  // API routes
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes mounted at /api/auth');
  
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/tenders', tenderRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/evaluations', evaluationRoutes);
  app.use('/api/pricing', pricingRoutes);
  app.use('/api/calendar', calendarRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/support', supportRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/pre-qualification', preQualificationRoutes);
  app.use('/api/roles', roleRoutes);
  app.use('/api/sources-watchlists', sourcesWatchlistsRoutes);
  app.use('/api/competitors', competitorRoutes);
  app.use('/api/market-declarations', marketDeclarationRoutes);
  app.use('/api/regulatory-compliance', regulatoryComplianceRoutes);
  app.use('/api/issued-rfps', issuedRfpRoutes);
  app.use('/api/respond', respondRoutes);
  app.use('/api/intelligence', intelligencePlatformRoutes);
  app.use('/api/discovery-connectors', discoveryConnectorsRoutes);
  app.use('/api/rfp-responses', require('../routes/rfpResponse'));
  
  console.log('✅ All API routes mounted successfully');

  // 404 handler for undefined routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      error: 'Route not found',
      message: `The requested route ${req.originalUrl} does not exist`
    });
  });

  // Root route
  app.get('/', (req, res) => {
    res.json({
      message: 'Tender360 API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString()
    });
  });
};

module.exports = { setupRoutes };
