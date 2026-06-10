const mongoose = require('mongoose');
const DocumentAnalysis = require('../models/documentAnalysis');
const documentAIService = require('../services/documentAI');
const aiConfig = require('../config/aiConfig');
const path = require('path');
const fs = require('fs').promises;

const resolveCompanyId = (req) => req.companyId || req.user?.companyId;

const isValidObjectId = (id) =>
  id && id !== 'null' && id !== 'undefined' && mongoose.Types.ObjectId.isValid(id);

/**
 * Analyze a document using AI
 */
const analyzeDocument = async (req, res) => {
  try {
    const { documentId, analysisType = 'full' } = req.body;
    const { companyId, _id: userId } = req.user;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Document ID is required',
        message: 'Please provide a valid document ID'
      });
    }

    // Check if analysis already exists
    const existingAnalysis = await DocumentAnalysis.findOne({
      documentId,
      companyId,
      analysisType,
      status: 'completed'
    }).sort({ createdAt: -1 });

    if (existingAnalysis) {
      return res.json({
        success: true,
        data: existingAnalysis,
        message: 'Analysis already exists'
      });
    }

    // Create new analysis record
    const analysis = new DocumentAnalysis({
      documentId,
      companyId,
      createdBy: userId,
      analysisType,
      status: 'processing'
    });

    await analysis.save();

    // Start AI processing (async)
    processDocumentAnalysis(analysis._id, documentId, analysisType)
      .catch(error => {
        console.error('Background AI processing error:', error);
        // Update analysis status to failed
        DocumentAnalysis.findByIdAndUpdate(analysis._id, {
          status: 'failed',
          error: {
            message: error.message,
            code: 'AI_PROCESSING_ERROR',
            timestamp: new Date()
          }
        }).catch(updateError => {
          console.error('Error updating failed analysis:', updateError);
        });
      });

    res.json({
      success: true,
      data: {
        analysisId: analysis._id,
        status: 'processing',
        message: 'AI analysis started. Results will be available shortly.'
      }
    });

  } catch (error) {
    console.error('Error starting document analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start analysis',
      message: error.message
    });
  }
};

/**
 * Get analysis results
 */
const getAnalysisResults = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { companyId } = req.user;

    const analysis = await DocumentAnalysis.findOne({
      _id: analysisId,
      companyId
    }).populate('documentId', 'name originalName filePath fileType');

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
        message: 'The requested analysis does not exist or you do not have access to it'
      });
    }

    res.json({
      success: true,
      data: analysis,
      message: 'Analysis results retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting analysis results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analysis',
      message: error.message
    });
  }
};

/**
 * Get all analyses for a document
 */
const getDocumentAnalyses = async (req, res) => {
  try {
    const { documentId } = req.params;
    const companyId = resolveCompanyId(req);
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(documentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid document ID',
        message: 'Please provide a valid document identifier'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const analyses = await DocumentAnalysis.find({
      documentId: new mongoose.Types.ObjectId(documentId),
      companyId
    })
    .populate('createdBy', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await DocumentAnalysis.countDocuments({
      documentId: new mongoose.Types.ObjectId(documentId),
      companyId
    });

    res.json({
      success: true,
      data: {
        analyses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      },
      message: 'Document analyses retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting document analyses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analyses',
      message: error.message
    });
  }
};

/**
 * Get analysis statistics
 */
const getAnalysisStats = async (req, res) => {
  try {
    const companyId = resolveCompanyId(req);
    const { startDate, endDate } = req.query;

    let dateRange = null;
    if (startDate && endDate) {
      dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      };
    }

    const stats = await DocumentAnalysis.getAnalysisStats(companyId, dateRange);

    // Get recent analyses
    const recentAnalyses = await DocumentAnalysis.find({
      companyId,
      status: 'completed'
    })
    .populate('documentId', 'name originalName')
    .sort({ createdAt: -1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        statistics: stats,
        recentAnalyses: recentAnalyses.map(analysis => analysis.getAnalysisSummary())
      },
      message: 'Analysis statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting analysis stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics',
      message: error.message
    });
  }
};

/**
 * Provide feedback on analysis
 */
const provideFeedback = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { helpful, accuracy, comments } = req.body;
    const { companyId } = req.user;

    const analysis = await DocumentAnalysis.findOne({
      _id: analysisId,
      companyId
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
        message: 'The requested analysis does not exist'
      });
    }

    analysis.userFeedback = {
      helpful,
      accuracy,
      comments,
      feedbackDate: new Date()
    };

    await analysis.save();

    res.json({
      success: true,
      data: analysis,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback',
      message: error.message
    });
  }
};

/**
 * Delete analysis
 */
const deleteAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { companyId } = req.user;

    const analysis = await DocumentAnalysis.findOneAndDelete({
      _id: analysisId,
      companyId
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
        message: 'The requested analysis does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete analysis',
      message: error.message
    });
  }
};

/**
 * Background processing function
 */
const processDocumentAnalysis = async (analysisId, documentId, analysisType) => {
  const startTime = Date.now();
  
  try {
    // Get document information (you'll need to implement this based on your Document model)
    const Document = require('../../models/Document');
    const document = await Document.findById(documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }

    // Construct file path
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', document.filePath);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error('Document file not found on server');
    }

    // Perform AI analysis
    const analysisResult = await documentAIService.analyzeDocument(filePath, document.fileType);
    
    const processingTime = Date.now() - startTime;

    // Update analysis with results
    await DocumentAnalysis.findByIdAndUpdate(analysisId, {
      status: 'completed',
      documentInfo: analysisResult.document_info,
      requirements: analysisResult.requirements,
      risks: analysisResult.risks,
      summary: analysisResult.summary,
      dates: analysisResult.dates,
      confidenceScore: analysisResult.confidence_score,
      processingTime,
      aiModel: aiConfig.gemini.model
    });

    console.log(`AI analysis completed for document ${documentId} in ${processingTime}ms`);

  } catch (error) {
    console.error('Error in background AI processing:', error);
    
    // Update analysis with error
    await DocumentAnalysis.findByIdAndUpdate(analysisId, {
      status: 'failed',
      error: {
        message: error.message,
        code: 'AI_PROCESSING_ERROR',
        timestamp: new Date()
      },
      processingTime: Date.now() - startTime
    });

    throw error;
  }
};

module.exports = {
  analyzeDocument,
  getAnalysisResults,
  getDocumentAnalyses,
  getAnalysisStats,
  provideFeedback,
  deleteAnalysis
};
