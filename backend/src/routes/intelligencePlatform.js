const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const controller = require('../controllers/intelligencePlatformController');
const emailTenderController = require('../controllers/emailTenderScanningController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const managerRoles = ['TENDER MANAGER', 'SYSTEM ADMINISTRATOR', 'REVIEWER', 'APPROVER'];

router.get('/dashboard', requireAuth, controller.getIntelligenceDashboard);
router.get('/ai/providers', requireAuth, controller.getAiProviders);

router.get('/discovery/dashboard', requireAuth, controller.getDiscoveryDashboard);
router.get('/discovery/jobs', requireAuth, controller.getDiscoveryJobs);
router.post('/discovery/jobs', requireAuth, requireRoles(...managerRoles), controller.createDiscoveryJob);
router.get('/discovery/jobs/:jobId/logs', requireAuth, controller.getDiscoveryLogs);
router.get('/discovery/import-queue', requireAuth, controller.getImportQueue);
router.get('/discovery/prospecting-rtm', requireAuth, controller.getDiscoveryProspectingRtm);
router.get('/email-tender-scanning/rtm', requireAuth, emailTenderController.getEmailTenderRtm);
router.get('/email-tender-scanning/feed', requireAuth, emailTenderController.getEmailTenderFeed);
router.post(
  '/email-tender-scanning/seed-demo',
  requireAuth,
  requireRoles('SYSTEM ADMINISTRATOR'),
  emailTenderController.seedEmailTenderDemo
);
router.post(
  '/email-tender-scanning/scan',
  requireAuth,
  requireRoles(...managerRoles),
  emailTenderController.scanEmailTenders
);
router.post(
  '/email-tender-scanning/run-discovery',
  requireAuth,
  requireRoles(...managerRoles),
  emailTenderController.runEmailDiscovery
);
router.get('/email-tender-scanning/failures', requireAuth, emailTenderController.getEmailTenderFailures);
router.post(
  '/email-tender-scanning/simulate-failure-demo',
  requireAuth,
  requireRoles('SYSTEM ADMINISTRATOR'),
  emailTenderController.simulateEmailFailureDemo
);
router.get('/discovery/metadata', requireAuth, controller.getDiscoveryMetadataFeed);
router.get('/tender-intelligence/rtm', requireAuth, controller.getTenderIntelligenceRtm);
router.get('/tender-intelligence/feed', requireAuth, controller.getTenderIntelligenceFeed);
router.post(
  '/tender-intelligence/:tenderId/run',
  requireAuth,
  requireRoles(...managerRoles),
  controller.runTenderIntelligence
);

router.get('/crm-account/rtm', requireAuth, controller.getCrmAccountRtm);
router.get('/crm-account/feed', requireAuth, controller.getCrmValidationFeed);
router.post('/crm-account/seed-demo', requireAuth, requireRoles('SYSTEM ADMINISTRATOR'), controller.seedCrmDemo);
router.post('/crm-account/lookup', requireAuth, requireRoles(...managerRoles), controller.lookupCrmAccount);
router.post(
  '/crm-account/:tenderId/validate',
  requireAuth,
  requireRoles(...managerRoles),
  controller.validateTenderCrm
);
router.post(
  '/crm-account/validate-all',
  requireAuth,
  requireRoles(...managerRoles),
  controller.validateAllCrm
);

router.get('/workspace/opportunities', requireAuth, controller.listWorkspaceOpportunities);
router.get('/workspace/:tenderId', requireAuth, controller.getOpportunityWorkspace);

router.get('/scoring/opportunities', requireAuth, controller.listOpportunityScores);
router.post('/scoring/opportunities/:tenderId/run', requireAuth, requireRoles(...managerRoles), controller.scoreOpportunity);
router.get('/scoring/profiles', requireAuth, controller.listScoringProfiles);
router.post('/scoring/profiles', requireAuth, requireRoles(...managerRoles), controller.createScoringProfile);
router.get('/scoring/profiles/:profileId/rules', requireAuth, controller.listScoringRules);
router.post('/scoring/profiles/:profileId/rules', requireAuth, requireRoles(...managerRoles), controller.createScoringRule);

router.post('/documents/:documentId/extractions', requireAuth, requireRoles(...managerRoles), controller.runDocumentExtraction);
router.get('/extractions/:extractionId', requireAuth, controller.getDocumentExtraction);

router.get('/go-no-go/reviews', requireAuth, controller.listGoNoGoReviews);
router.post('/go-no-go/reviews', requireAuth, requireRoles(...managerRoles), controller.upsertGoNoGoReview);

router.get('/automation/console', requireAuth, controller.getAutomationConsole);
router.post('/automation/jobs', requireAuth, requireRoles(...managerRoles), controller.enqueueAutomationJob);

router.get('/integrations/hub', requireAuth, controller.getIntegrationHub);
router.post('/integrations/connectors', requireAuth, requireRoles('SYSTEM ADMINISTRATOR'), controller.upsertIntegrationConnector);
router.get('/integrations/webhooks', requireAuth, controller.listWebhookSubscriptions);
router.post('/integrations/webhooks', requireAuth, requireRoles('SYSTEM ADMINISTRATOR'), controller.createWebhookSubscription);
router.put('/integrations/webhooks/:id', requireAuth, requireRoles('SYSTEM ADMINISTRATOR'), controller.updateWebhookSubscription);
router.delete('/integrations/webhooks/:id', requireAuth, requireRoles('SYSTEM ADMINISTRATOR'), controller.deleteWebhookSubscription);
router.post('/integrations/webhooks/:id/test', requireAuth, requireRoles('SYSTEM ADMINISTRATOR'), controller.testWebhookSubscription);
router.get('/integrations/webhooks/:id/deliveries', requireAuth, controller.listWebhookDeliveries);

router.get('/governance/dashboard', requireAuth, controller.getGovernanceDashboard);
router.get('/documents/intelligence', requireAuth, controller.listDocumentIntelligence);
router.get('/platform/config', requireAuth, controller.getPlatformConfig);

router.get('/platform/global-keywords', requireAuth, requireRoles('SYSTEM ADMINISTRATOR'), controller.getGlobalKeywords);

router.post(
  '/platform/global-keywords/upload',
  requireAuth,
  requireRoles('SYSTEM ADMINISTRATOR'),
  upload.single('file'),
  controller.uploadGlobalKeywords
);

router.delete(
  '/platform/global-keywords',
  requireAuth,
  requireRoles('SYSTEM ADMINISTRATOR'),
  controller.deleteGlobalKeywords
);

module.exports = router;
