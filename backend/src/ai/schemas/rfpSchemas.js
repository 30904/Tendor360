const { z } = require('zod');

// Schema for a single extracted requirement
const RequirementSchema = z.object({
  requirement: z.string().min(5, 'Requirement text too short'),
  category: z.enum(['TECHNICAL', 'COMMERCIAL', 'COMPLIANCE', 'TIMELINE', 'GENERAL']),
  mandatory: z.boolean(),
  description: z.string().optional().default('')
});

// Schema for the full extraction response
const ExtractedRequirementsSchema = z.object({
  requirements: z.array(RequirementSchema).min(1, 'At least one requirement must be extracted'),
  summary: z.string().min(10, 'Summary too short')
});

// Schema for a single generated section
const GeneratedSectionSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(50, 'Generated content is too short to be useful'),
  keyPoints: z.array(z.string()).min(1, 'Must include at least one key point'),
  addressedRequirements: z.array(z.string()).optional().default([]),
  wordCount: z.number().int().positive(),
  selfConfidence: z.number().min(0).max(100).optional().default(70)
});

// Schema for fact-check verification
const FactCheckResultSchema = z.object({
  requirementsCovered: z.array(z.object({
    requirement: z.string(),
    isCovered: z.boolean(),
    evidence: z.string().optional().default('')
  })),
  fabricatedClaims: z.array(z.object({
    claim: z.string(),
    reason: z.string()
  })).optional().default([]),
  overallScore: z.number().min(0).max(100),
  summary: z.string()
});

/**
 * Validate LLM output against a Zod schema.
 * Returns { success: true, data } or { success: false, error, raw }.
 * On failure, returns the Zod error message for prompt retry injection.
 */
function validateLLMOutput(rawText, schema) {
  try {
    // Strip markdown code fences if present
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);
    const validated = schema.parse(parsed);
    return { success: true, data: validated };
  } catch (err) {
    const errorMessage = err instanceof z.ZodError
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      : err.message;
    
    return {
      success: false,
      error: errorMessage,
      raw: rawText
    };
  }
}

module.exports = {
  RequirementSchema,
  ExtractedRequirementsSchema,
  GeneratedSectionSchema,
  FactCheckResultSchema,
  validateLLMOutput
};
