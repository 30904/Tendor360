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

  const uploadsRoot = path.join(__dirname, '../../../../uploads');
  const filePath = path.isAbsolute(relativePath)
    ? relativePath
    : storage.filename
      ? path.join(uploadsRoot, storage.filename)
      : path.join(path.join(__dirname, '../../..'), relativePath.replace(/^uploads[\\/]/, 'uploads/'));

  if (!fs.existsSync(filePath)) {
    throw new Error(`Document file not found on disk: ${filePath}`);
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
        title: document.name || document.storage?.originalName,
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
