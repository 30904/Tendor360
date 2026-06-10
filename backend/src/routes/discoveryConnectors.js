const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const {
  getCatalog,
  testConnection,
  runDiscoveryNow,
  seedDemoPlatform,
  uploadExcelKeywords
} = require('../controllers/discoveryConnectorsController');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

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

router.post(
  '/sources/:id/upload-keywords',
  requireAuth,
  requireRoles(['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'ADMIN']),
  upload.single('file'),
  uploadExcelKeywords
);

module.exports = router;
