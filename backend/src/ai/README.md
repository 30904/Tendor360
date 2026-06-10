# AI Document Intelligence

This module provides AI-powered document analysis capabilities for the Tender Management System using Google Gemini API.

## Features

### 🤖 AI-Powered Document Analysis
- **Requirements Extraction**: Automatically extract technical, commercial, compliance, and timeline requirements from tender documents
- **Risk Assessment**: Identify and categorize risks (high, medium, low) with mitigation strategies
- **Executive Summary**: Generate concise, actionable summaries for business leaders
- **Key Dates Extraction**: Identify important deadlines, milestones, and meetings

### 📊 Analytics Dashboard
- Analysis statistics and performance metrics
- Risk distribution and confidence scores
- Recent analysis history
- User feedback collection

### 🔧 Technical Features
- Support for PDF, DOCX, and TXT files
- Background processing with real-time status updates
- Confidence scoring based on document quality
- Comprehensive error handling and logging

## API Endpoints

### Document Analysis
- `POST /api/ai/analyze` - Start AI analysis of a document
- `GET /api/ai/analysis/:analysisId` - Get analysis results
- `GET /api/ai/document/:documentId/analyses` - Get all analyses for a document
- `GET /api/ai/stats` - Get AI analysis statistics
- `POST /api/ai/analysis/:analysisId/feedback` - Provide feedback on analysis
- `DELETE /api/ai/analysis/:analysisId` - Delete an analysis

## Configuration

### Environment Variables
```env
# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
GEMINI_MAX_TOKENS=4000
GEMINI_TEMPERATURE=0.3
GEMINI_TIMEOUT=30000

# Document Processing
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# AI Rate Limiting
AI_RATE_LIMIT=10
AI_RATE_LIMIT_HOUR=100
```

## Usage

### Starting Document Analysis
```javascript
const response = await aiService.analyzeDocument(documentId, 'full');
```

### Getting Analysis Results
```javascript
const analysis = await aiService.getAnalysisResults(analysisId);
```

### Providing Feedback
```javascript
await aiService.provideFeedback(analysisId, {
  helpful: true,
  accuracy: 5,
  comments: 'Very accurate analysis!'
});
```

## Data Models

### DocumentAnalysis Schema
```javascript
{
  documentId: ObjectId,
  companyId: ObjectId,
  createdBy: ObjectId,
  analysisType: String, // 'full', 'requirements', 'risks', 'summary', 'dates'
  status: String, // 'processing', 'completed', 'failed'
  
  // Analysis Results
  requirements: {
    technical_requirements: Array,
    commercial_requirements: Array,
    compliance_requirements: Array,
    timeline_requirements: Array,
    summary: String
  },
  
  risks: {
    high_risks: Array,
    medium_risks: Array,
    low_risks: Array,
    overall_risk_score: Number,
    risk_summary: String
  },
  
  summary: {
    summary: String,
    generated_at: Date,
    word_count: Number
  },
  
  dates: {
    key_dates: Array,
    timeline_summary: String
  },
  
  confidenceScore: Number,
  processingTime: Number,
  aiModel: String,
  userFeedback: Object
}
```

## Frontend Components

### DocumentAnalysis Modal
- Comprehensive analysis results display
- Interactive tabs for different analysis types
- Real-time processing status
- User feedback collection

### AI Dashboard
- Analytics and statistics
- Recent analyses overview
- Performance metrics
- Risk distribution charts

### AI Analysis Page
- Document listing with AI analysis capabilities
- Search and filter functionality
- Analysis history tracking
- Integration with existing document management

## Error Handling

The system includes comprehensive error handling for:
- API failures and timeouts
- Invalid document formats
- Processing errors
- Authentication issues
- Rate limiting

## Performance Considerations

- Background processing to avoid blocking UI
- Polling mechanism for real-time updates
- Efficient text extraction and preprocessing
- Optimized API calls with proper error handling
- Caching of analysis results

## Security

- Authentication required for all endpoints
- Company-based data isolation
- Secure file handling and processing
- API key protection and validation

## Future Enhancements

- Support for additional file formats (PPTX, XLSX)
- Batch document processing
- Custom AI model training
- Advanced analytics and reporting
- Integration with external AI services
- Multi-language support
