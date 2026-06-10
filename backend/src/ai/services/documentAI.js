const axios = require('axios');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

class DocumentAIService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.geminiBaseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
    this.maxTokens = 4000;
    this.model = 'gemini-1.5-pro';
  }

  /**
   * Extract text from various document formats
   */
  async extractTextFromDocument(filePath, fileType) {
    try {
      const buffer = await fs.readFile(filePath);
      
      switch (fileType.toLowerCase()) {
        case 'pdf':
          const pdfData = await pdfParse(buffer);
          return pdfData.text;
        
        case 'docx':
          const docxResult = await mammoth.extractRawText({ buffer });
          return docxResult.value;
        
        case 'doc':
          // For .doc files, we'd need additional library like antiword
          throw new Error('DOC files not supported yet. Please convert to DOCX.');
        
        case 'txt':
          return buffer.toString('utf-8');
        
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error('Error extracting text from document:', error);
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  /**
   * Call Google Gemini API for AI processing
   */
  async callGemini(prompt, systemPrompt = null) {
    try {
      if (!this.geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      // Combine system prompt and user prompt
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

      const response = await axios.post(
        `${this.geminiBaseUrl}/models/${this.model}:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: this.maxTokens,
            topP: 0.8,
            topK: 10
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API error:', error.response?.data || error.message);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  /**
   * Extract key requirements from tender document
   */
  async extractRequirements(documentText) {
    const systemPrompt = `You are an expert tender analyst. Extract key requirements from tender documents and return them in a structured JSON format.`;

    const prompt = `
    Analyze the following tender document and extract key requirements. Return the result as a JSON object with the following structure:
    
    {
      "technical_requirements": [
        {
          "requirement": "string",
          "category": "string",
          "mandatory": boolean,
          "description": "string"
        }
      ],
      "commercial_requirements": [
        {
          "requirement": "string",
          "category": "string",
          "mandatory": boolean,
          "description": "string"
        }
      ],
      "compliance_requirements": [
        {
          "requirement": "string",
          "category": "string",
          "mandatory": boolean,
          "description": "string"
        }
      ],
      "timeline_requirements": [
        {
          "requirement": "string",
          "deadline": "string",
          "mandatory": boolean,
          "description": "string"
        }
      ],
      "summary": "Brief summary of key requirements"
    }
    
    Document text:
    ${documentText.substring(0, 8000)} // Limit to avoid token limits
    `;

    try {
      const aiResponse = await this.callGemini(prompt, systemPrompt);
      return JSON.parse(aiResponse);
    } catch (error) {
      console.error('Error extracting requirements:', error);
      return {
        technical_requirements: [],
        commercial_requirements: [],
        compliance_requirements: [],
        timeline_requirements: [],
        summary: "Failed to extract requirements",
        error: error.message
      };
    }
  }

  /**
   * Assess risks in tender document
   */
  async assessRisks(documentText) {
    const systemPrompt = `You are a risk assessment expert specializing in tender and contract analysis. Identify potential risks and return them in a structured format.`;

    const prompt = `
    Analyze the following tender document for potential risks. Return the result as a JSON object with the following structure:
    
    {
      "high_risks": [
        {
          "risk": "string",
          "category": "string",
          "description": "string",
          "mitigation": "string",
          "impact": "string"
        }
      ],
      "medium_risks": [
        {
          "risk": "string",
          "category": "string",
          "description": "string",
          "mitigation": "string",
          "impact": "string"
        }
      ],
      "low_risks": [
        {
          "risk": "string",
          "category": "string",
          "description": "string",
          "mitigation": "string",
          "impact": "string"
        }
      ],
      "overall_risk_score": "number (1-10)",
      "risk_summary": "Brief summary of key risks"
    }
    
    Document text:
    ${documentText.substring(0, 8000)}
    `;

    try {
      const aiResponse = await this.callGemini(prompt, systemPrompt);
      return JSON.parse(aiResponse);
    } catch (error) {
      console.error('Error assessing risks:', error);
      return {
        high_risks: [],
        medium_risks: [],
        low_risks: [],
        overall_risk_score: 5,
        risk_summary: "Failed to assess risks",
        error: error.message
      };
    }
  }

  /**
   * Generate executive summary of tender document
   */
  async generateSummary(documentText) {
    const systemPrompt = `You are an executive assistant creating concise, actionable summaries of tender documents for business leaders.`;

    const prompt = `
    Create an executive summary of the following tender document. The summary should be:
    - Concise (2-3 paragraphs)
    - Focus on key business opportunities and risks
    - Highlight critical deadlines and requirements
    - Include estimated effort and resource requirements
    
    Document text:
    ${documentText.substring(0, 8000)}
    `;

    try {
      const summary = await this.callGemini(prompt, systemPrompt);
      return {
        summary: summary,
        generated_at: new Date().toISOString(),
        word_count: documentText.length
      };
    } catch (error) {
      console.error('Error generating summary:', error);
      return {
        summary: "Failed to generate summary",
        generated_at: new Date().toISOString(),
        word_count: documentText.length,
        error: error.message
      };
    }
  }

  /**
   * Extract key dates and deadlines
   */
  async extractKeyDates(documentText) {
    const systemPrompt = `You are a project manager extracting key dates and deadlines from tender documents.`;

    const prompt = `
    Extract all important dates and deadlines from the following tender document. Return as JSON:
    
    {
      "key_dates": [
        {
          "date": "YYYY-MM-DD",
          "description": "string",
          "type": "deadline|milestone|meeting|other",
          "importance": "high|medium|low"
        }
      ],
      "timeline_summary": "Brief summary of timeline"
    }
    
    Document text:
    ${documentText.substring(0, 6000)}
    `;

    try {
      const aiResponse = await this.callGemini(prompt, systemPrompt);
      return JSON.parse(aiResponse);
    } catch (error) {
      console.error('Error extracting dates:', error);
      return {
        key_dates: [],
        timeline_summary: "Failed to extract dates",
        error: error.message
      };
    }
  }

  /**
   * Comprehensive document analysis
   */
  async analyzeDocument(filePath, fileType) {
    try {
      console.log(`Starting AI analysis for ${fileType} document: ${filePath}`);
      
      // Extract text from document
      const documentText = await this.extractTextFromDocument(filePath, fileType);
      
      if (!documentText || documentText.trim().length < 100) {
        throw new Error('Document appears to be empty or too short for analysis');
      }

      console.log(`Extracted ${documentText.length} characters from document`);

      // Run all AI analyses in parallel for efficiency
      const [requirements, risks, summary, dates] = await Promise.all([
        this.extractRequirements(documentText),
        this.assessRisks(documentText),
        this.generateSummary(documentText),
        this.extractKeyDates(documentText)
      ]);

      const analysisResult = {
        document_info: {
          file_path: filePath,
          file_type: fileType,
          text_length: documentText.length,
          analyzed_at: new Date().toISOString()
        },
        requirements,
        risks,
        summary,
        dates,
        confidence_score: this.calculateConfidenceScore(documentText)
      };

      console.log('AI analysis completed successfully');
      return analysisResult;

    } catch (error) {
      console.error('Error in document analysis:', error);
      throw error;
    }
  }

  /**
   * Calculate confidence score based on document quality
   */
  calculateConfidenceScore(documentText) {
    let score = 0.5; // Base score

    // Length factor
    if (documentText.length > 5000) score += 0.2;
    else if (documentText.length > 2000) score += 0.1;

    // Structure indicators
    if (documentText.includes('requirements') || documentText.includes('specifications')) score += 0.1;
    if (documentText.includes('deadline') || documentText.includes('submission')) score += 0.1;
    if (documentText.includes('evaluation') || documentText.includes('criteria')) score += 0.1;

    return Math.min(1.0, Math.max(0.0, score));
  }
}

module.exports = new DocumentAIService();
