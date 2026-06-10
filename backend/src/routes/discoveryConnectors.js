const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const {
  getCatalog,
  testConnection,
  runDiscoveryNow,
  seedDemoPlatform
} = require('../controllers/discoveryConnectorsController');

const router = express.Router();

router.get('/catalog', requireAuth, getCatalog);

router.post(
  '/test',
  requireAuth,
  requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']),
  testConnection
);

router.post(
  '/sources/:id/run',
  requireAuth,
  requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']),
  runDiscoveryNow
);

router.post(
  '/seed-demo',
  requireAuth,
  requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']),
  seedDemoPlatform
);

module.exports = router;
