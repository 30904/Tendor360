const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const Document = require('../../../models/Document');
const DocumentExtraction = require('../models/DocumentExtraction');
const ExtractionResult = require('../models/ExtractionResult');
const ClauseExtraction = require('../models/ClauseExtraction');
const aiOrchestrator = require('../../ai-core/AiOrchestrator');

async function readDocumentText(document) {
  const storage = document.storage || {};
  const relativePath = storage.path || storage.filename;
  if (!relativePath) {
    throw new Error('Document storage path is missing');
  }

  let filePath;
  if (path.isAbsolute(relativePath)) {
    filePath = relativePath;
  } else {
    const backendRoot = path.join(__dirname, '../../../../');
    const normalizedPath = relativePath.replace(/\\/g, '/');
    if (normalizedPath.startsWith('uploads/')) {
      filePath = path.join(backendRoot, relativePath);
    } else {
      filePath = path.join(backendRoot, 'uploads', relativePath);
    }
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Document file not found on disk at resolved path: ${filePath}`);
  }

  const buffer = fs.readFileSync(filePath);
  const mime = storage.mimeType || '';

  if (mime.includes('pdf')) {
    const parsed = await pdfParse(buffer);
    return parsed.text || '';
  }

  if (mime.includes('word') || storage.originalName?.endsWith('.docx')) {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value || '';
  }

  return buffer.toString('utf8');
}

function extractTimelineCandidates(text) {
  const matches = text.match(/\b\d{4}-\d{2}-\d{2}\b/g) || [];
  return [...new Set(matches)].slice(0, 10);
}

function extractContacts(text) {
  const emails = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return [...new Set(emails)].slice(0, 10);
}

class ExtractionPipeline {
  async run(companyId, documentId, { tenderId, pipeline = 'metadata' } = {}) {
    const document = await Document.findOne({ _id: documentId, companyId });
    if (!document) {
      throw new Error('Document not found');
    }

    const extraction = await DocumentExtraction.create({
      companyId,
      documentId,
      tenderId,
      pipeline,
      status: 'processing',
      startedAt: new Date()
    });

    try {
      const text = await readDocumentText(document);
      const aiSummary = await aiOrchestrator.summarize({
        title: document.name || document.storage?.originalName || 'Tender Document',
        description: text.slice(0, 4000)
      });

      const results = [
        { fieldKey: 'summary', fieldValue: aiSummary.summary, confidence: 70 },
        { fieldKey: 'contacts', fieldValue: extractContacts(text), confidence: 65 },
        { fieldKey: 'timeline', fieldValue: extractTimelineCandidates(text), confidence: 60 }
      ];

      await ExtractionResult.insertMany(
        results.map((result) => ({
          companyId,
          extractionId: extraction._id,
          ...result
        }))
      );

      const clauseCandidates = text
        .split(/\n{2,}/)
        .map((chunk) => chunk.trim())
        .filter((chunk) => /shall|must|liability|indemn/i.test(chunk))
        .slice(0, 5);

      if (clauseCandidates.length) {
        await ClauseExtraction.insertMany(
          clauseCandidates.map((textValue) => ({
            companyId,
            extractionId: extraction._id,
            clauseType: 'obligation',
            text: textValue,
            riskLevel: /liability|indemn/i.test(textValue) ? 'high' : 'medium',
            confidence: 55
          }))
        );
      }

      // Populate document's aiExtraction fields for UI/metadata uniformity (BE-H12)
      // Clean up title
      let originalName = document.storage?.originalName || document.name || 'Tender Document';
      let cleanTitle = originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      cleanTitle = cleanTitle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      // Extract organization
      let organization = 'Unknown Issuer';
      const orgPatterns = [
        /(?:hospital|clinic|medical center|health|health system)/i,
        /(?:department|ministry|agency|authority|administration|board|commission|council|office)/i,
        /(?:university|college|school)/i,
        /(?:corporation|corp|inc|ltd|plc|limited|company|systems|solutions)/i
      ];
      if (text) {
        const lines = text.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.length > 5 && trimmed.length < 60) {
            if (/(?:hospital|department of|ministry of|university|board of|administration|commission)/i.test(trimmed)) {
              organization = trimmed;
              break;
            }
          }
        }
        if (organization === 'Unknown Issuer') {
          for (const pattern of orgPatterns) {
            const m = text.match(pattern);
            if (m) {
              const idx = m.index;
              const start = Math.max(0, idx - 30);
              const end = Math.min(text.length, idx + 40);
              const context = text.slice(start, end).replace(/\n/g, ' ').trim();
              const words = context.split(' ');
              if (words.length > 2) {
                organization = words.slice(Math.max(0, Math.floor(words.length/2) - 2), Math.min(words.length, Math.floor(words.length/2) + 3)).join(' ');
                break;
              }
            }
          }
        }
      }

      // Extract estimated value
      let amount = 1200000;
      if (text) {
        const valueMatch = text.match(/\$\s*(\d{1,3}(?:,\d{3})+)/);
        if (valueMatch) {
          const parsedAmount = parseInt(valueMatch[1].replace(/,/g, ''));
          if (parsedAmount > 10000) {
            amount = parsedAmount;
          }
        } else {
          const wordMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:million|million dollars|m|k)/i);
          if (wordMatch) {
            let multiplier = 1;
            if (wordMatch[0].toLowerCase().includes('million') || wordMatch[0].toLowerCase().includes('m')) {
              multiplier = 1000000;
            } else if (wordMatch[0].toLowerCase().includes('k')) {
              multiplier = 1000;
            }
            amount = Math.round(parseFloat(wordMatch[1]) * multiplier);
          }
        }
      }

      // Extract deadline
      let deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      if (text) {
        const dateMatch = text.match(/\b(\d{4}-\d{2}-\d{2})\b/) || text.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
        if (dateMatch) {
          const parsedDate = new Date(dateMatch[1]);
          if (!isNaN(parsedDate.getTime()) && parsedDate > new Date()) {
            deadline = parsedDate;
          }
        }
      }

      // Extract location
      let location = 'Remote / Various Locations';
      if (text) {
        const stateZipMatch = text.match(/\b([A-Za-z\s]{3,20}),\s*([A-Z]{2})\b/);
        if (stateZipMatch) {
          location = `${stateZipMatch[1].trim()}, ${stateZipMatch[2]}`;
        }
      }

      // Extract requirements
      let requirements = [];
      if (text) {
        const chunks = text.split(/[.\n]+/);
        for (const chunk of chunks) {
          const trimmed = chunk.trim();
          if (trimmed.length > 20 && trimmed.length < 150) {
            if (/\b(?:shall|must|required|compliance|experience|certification|expert)\b/i.test(trimmed)) {
              requirements.push(trimmed);
              if (requirements.length >= 4) break;
            }
          }
        }
      }
      if (requirements.length === 0) {
        requirements = [
          'Compliance with all technical specifications',
          'Submission of commercial proposal on specified template',
          'Valid certifications and licensing',
          'Standard warranty and service support model'
        ];
      }

      // Extract categories
      let categories = [];
      const categoryKeywords = {
        'Healthcare': /health|hospital|medical|clinic|clinical|patient/i,
        'IT Infrastructure': /infrastructure|server|network|cloud|hardware|datacenter/i,
        'Software Development': /software|application|telemedicine|portal|database|system/i,
        'Life Sciences': /laboratory|instrument|biotech|sequencing|cold-chain|research/i,
        'Construction': /construction|building|renovation|engineering|civil/i
      };
      if (text) {
        for (const [cat, regex] of Object.entries(categoryKeywords)) {
          if (regex.test(text)) {
            categories.push(cat);
          }
        }
      }
      if (categories.length === 0) {
        categories = ['Procurement', 'Services'];
      }

      // Contact info
      let contactName = 'Procurement Officer';
      let contactEmail = 'procurement@agency.gov';
      let contactPhone = '+1-555-0199';
      if (text) {
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
        if (emailMatch) {
          contactEmail = emailMatch[0];
        }
        const phoneMatch = text.match(/(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g);
        if (phoneMatch) {
          contactPhone = phoneMatch[0];
        }
        const nameMatch = text.match(/(?:contact|attention|attn|officer)[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/);
        if (nameMatch) {
          contactName = nameMatch[1];
        }
      }

      // Confidence score
      let confidence = 75;
      if (text) {
        let score = 50;
        if (text.length > 5000) score += 20;
        else if (text.length > 2000) score += 10;
        if (text.includes('requirements') || text.includes('specifications')) score += 10;
        if (text.includes('deadline') || text.includes('submission')) score += 10;
        if (text.includes('evaluation') || text.includes('criteria')) score += 10;
        confidence = Math.min(100, Math.max(50, score));
      }

      const aiResults = {
        isProcessed: true,
        processedAt: new Date(),
        confidence,
        extractedData: {
          tenderTitle: cleanTitle,
          organization,
          estimatedValue: {
            amount,
            currency: 'USD'
          },
          deadline,
          location,
          description: aiSummary.summary ? aiSummary.summary.slice(0, 1000) : 'Document processed successfully.',
          requirements,
          categories,
          contactInfo: {
            name: contactName,
            email: contactEmail,
            phone: contactPhone
          }
        },
        rawText: text ? text.slice(0, 8000) : 'No text content extracted.',
        summary: aiSummary.summary || 'Document processed successfully.',
        keywords: categories.map(c => c.toLowerCase())
      };

      document.aiExtraction = aiResults;
      if (document.status === 'UPLOADED' || document.status === 'PROCESSING') {
        document.status = 'EXTRACTED';
      }
      await document.save();

      extraction.status = 'completed';
      extraction.completedAt = new Date();
      await extraction.save();

      return extraction;
    } catch (error) {
      extraction.status = 'failed';
      extraction.errorMessage = error.message;
      extraction.completedAt = new Date();
      await extraction.save();
      throw error;
    }
  }
}

module.exports = new ExtractionPipeline();
module.exports.readDocumentText = readDocumentText;
