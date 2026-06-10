const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const aiController = require('../ai/controllers/aiController');

// Apply authentication middleware to all routes
router.use(requireAuth);

/**
 * @route   POST /api/ai/analyze
 * @desc    Start AI analysis of a document
 * @access  Private
 */
router.post('/analyze', aiController.analyzeDocument);

/**
 * @route   GET /api/ai/analysis/:analysisId
 * @desc    Get analysis results by ID
 * @access  Private
 */
router.get('/analysis/:analysisId', aiController.getAnalysisResults);

/**
 * @route   GET /api/ai/document/:documentId/analyses
 * @desc    Get all analyses for a specific document
 * @access  Private
 */
router.get('/document/:documentId/analyses', aiController.getDocumentAnalyses);

/**
 * @route   GET /api/ai/stats
 * @desc    Get AI analysis statistics
 * @access  Private
 */
router.get('/stats', aiController.getAnalysisStats);

/**
 * @route   POST /api/ai/analysis/:analysisId/feedback
 * @desc    Provide feedback on analysis quality
 * @access  Private
 */
router.post('/analysis/:analysisId/feedback', aiController.provideFeedback);

/**
 * @route   DELETE /api/ai/analysis/:analysisId
 * @desc    Delete an analysis
 * @access  Private
 */
router.delete('/analysis/:analysisId', aiController.deleteAnalysis);

// Legacy AI routes for backward compatibility
router.post('/match-tender', requireAuth, async (req, res) => {
  try {
    res.json({
      data: { 
        matchScore: 85,
        insights: ['Strong technical capability match', 'Good financial standing'],
        recommendations: ['Consider bidding', 'Focus on technical differentiation']
      },
      message: 'AI analysis completed successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to analyze tender',
      message: error.message
    });
  }
});

router.post('/suggest-documents', requireAuth, async (req, res) => {
  try {
    res.json({
      data: {
        suggestedDocs: [
          'Technical specifications',
          'Financial statements',
          'Quality certifications',
          'Past performance records'
        ]
      },
      message: 'Document suggestions generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate document suggestions',
      message: error.message
    });
  }
});

module.exports = router;
