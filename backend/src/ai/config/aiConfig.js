const aiConfig = {
  // Google Gemini Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    baseUrl: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 4000,
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.3,
    timeout: parseInt(process.env.GEMINI_TIMEOUT) || 30000
  },

  // Document Processing Configuration
  document: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    supportedFormats: ['pdf', 'docx', 'txt'],
    textExtractionLimit: 8000, // Characters to send to AI
    confidenceThreshold: 0.6
  },

  // AI Analysis Configuration
  analysis: {
    enableRequirementsExtraction: process.env.ENABLE_REQUIREMENTS_EXTRACTION !== 'false',
    enableRiskAssessment: process.env.ENABLE_RISK_ASSESSMENT !== 'false',
    enableSummaryGeneration: process.env.ENABLE_SUMMARY_GENERATION !== 'false',
    enableDateExtraction: process.env.ENABLE_DATE_EXTRACTION !== 'false',
    parallelProcessing: process.env.ENABLE_PARALLEL_AI_PROCESSING !== 'false'
  },

  // Prompt Templates
  prompts: {
    requirements: {
      system: `You are an expert tender analyst with 10+ years of experience in procurement and contract management. Your task is to extract key requirements from tender documents with high accuracy and attention to detail.`,
      user: `Analyze the following tender document and extract key requirements. Focus on:
1. Technical specifications and capabilities
2. Commercial terms and conditions
3. Compliance and regulatory requirements
4. Timeline and delivery requirements

Return the result as a JSON object with the specified structure.`
    },
    risks: {
      system: `You are a senior risk management consultant specializing in tender and contract risk assessment. You have extensive experience identifying potential risks in procurement documents.`,
      user: `Analyze the following tender document for potential risks. Consider:
1. Technical risks (capability gaps, complexity)
2. Commercial risks (pricing, terms, penalties)
3. Compliance risks (regulatory, legal)
4. Timeline risks (delivery, milestones)
5. Resource risks (capacity, expertise)

Return the result as a JSON object with the specified structure.`
    },
    summary: {
      system: `You are an executive assistant creating concise, actionable summaries of tender documents for C-level executives and business leaders.`,
      user: `Create an executive summary of the following tender document. The summary should be:
- Concise (2-3 paragraphs)
- Focus on key business opportunities and risks
- Highlight critical deadlines and requirements
- Include estimated effort and resource requirements
- Written in clear, business-friendly language`
    },
    dates: {
      system: `You are a project manager with expertise in extracting and organizing timeline information from complex documents.`,
      user: `Extract all important dates and deadlines from the following tender document. Focus on:
1. Submission deadlines
2. Evaluation milestones
3. Contract start/end dates
4. Key meetings or presentations
5. Delivery milestones

Return the result as a JSON object with the specified structure.`
    }
  },

  // Error Messages
  errors: {
    apiKeyMissing: 'Gemini API key not configured. Please set GEMINI_API_KEY environment variable.',
    fileTooLarge: 'Document file is too large for processing.',
    unsupportedFormat: 'Document format is not supported for AI analysis.',
    emptyDocument: 'Document appears to be empty or contains no readable text.',
    aiProcessingFailed: 'AI processing failed. Please try again or contact support.',
    textExtractionFailed: 'Failed to extract text from document. The file may be corrupted or password-protected.'
  },

  // Rate Limiting
  rateLimit: {
    requestsPerMinute: parseInt(process.env.AI_RATE_LIMIT) || 10,
    requestsPerHour: parseInt(process.env.AI_RATE_LIMIT_HOUR) || 100
  }
};

module.exports = aiConfig;
