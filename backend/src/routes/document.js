const express = require('express');
const multer = require('multer');
const path = require('path');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const documentController = require('../controllers/documentController');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, Excel, text, and image files are allowed.'), false);
    }
  }
});

// Apply authentication to all routes
router.use(requireAuth);

// Get document statistics
router.get('/stats', documentController.getDocumentStats);

// Get all documents with filters and pagination
router.get('/', documentController.getDocuments);

// Upload document
router.post('/upload', 
  requireRoles('TENDER_MANAGER', 'ADMIN'),
  upload.single('document'),
  documentController.uploadDocument
);

// Process document with AI
router.post('/:id/process-ai', 
  requireRoles('TENDER_MANAGER', 'ADMIN'),
  documentController.processDocumentAI
);

// Create tender record from extracted document
router.post('/:id/create-tender', 
  requireRoles('TENDER_MANAGER', 'ADMIN'),
  documentController.createTenderRecord
);

// Get document by ID
router.get('/:id', documentController.getDocument);

// Update document metadata
router.put('/:id', 
  requireRoles('TENDER_MANAGER', 'ADMIN'),
  documentController.updateDocument
);

// Add comment to document
router.post('/:id/comments', documentController.addComment);

// Delete document (soft delete)
router.delete('/:id', 
  requireRoles('ADMIN'),
  documentController.deleteDocument
);

module.exports = router;
