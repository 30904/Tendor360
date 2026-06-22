const axios = require('axios');
const { validateLLMOutput, ExtractedRequirementsSchema, GeneratedSectionSchema, FactCheckResultSchema } = require('../schemas/rfpSchemas');
const { EXTRACT_REQUIREMENTS, SECTION_PROMPTS, FACT_CHECK } = require('../prompts/rfpPrompts');

const MAX_RETRIES = 3;

class RfpCopilotService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.geminiBaseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
    this.geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiModel = process.env.OPENAI_MODEL || 'gpt-4o';
  }

  // ─── LLM Abstraction Layer ──────────────────────────────────────

  async callGemini(systemPrompt, userPrompt) {
    if (!this.geminiApiKey) throw new Error('Gemini API key not configured');

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    const response = await axios.post(
      `${this.geminiBaseUrl}/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`,
      {
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8000,
          topP: 0.8,
          topK: 10,
          responseMimeType: 'application/json'
        }
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
    );

    if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return {
        text: response.data.candidates[0].content.parts[0].text,
        model: this.geminiModel,
        tokensUsed: response.data.usageMetadata?.totalTokenCount || 0
      };
    }
    throw new Error('Invalid Gemini response structure');
  }

  async callOpenAI(systemPrompt, userPrompt) {
    if (!this.openaiApiKey) throw new Error('OpenAI API key not configured');

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.openaiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        timeout: 60000
      }
    );

    if (response.data.choices?.[0]?.message?.content) {
      return {
        text: response.data.choices[0].message.content,
        model: this.openaiModel,
        tokensUsed: response.data.usage?.total_tokens || 0
      };
    }
    throw new Error('Invalid OpenAI response structure');
  }

  /**
   * Call LLM with automatic failover: Gemini primary → OpenAI fallback.
   * Fails closed when both providers are unavailable — no mock/synthetic output.
   */
  async callLLM(systemPrompt, userPrompt) {
    let geminiError;
    try {
      return await this.callGemini(systemPrompt, userPrompt);
    } catch (error) {
      geminiError = error;
      console.warn(`⚠️ Gemini failed (${error.message}), falling back to OpenAI...`);
    }

    try {
      return await this.callOpenAI(systemPrompt, userPrompt);
    } catch (openaiError) {
      console.error(`❌ OpenAI failed (${openaiError.message}) after Gemini failure`);
      throw new Error(
        `AI generation unavailable: Gemini (${geminiError.message}); OpenAI (${openaiError.message})`
      );
    }
  }

  /**
   * Call LLM with schema validation and retry logic.
   * If validation fails, the error is injected into the retry prompt.
   */
  async callWithValidation(systemPrompt, userPrompt, schema) {
    let lastError = null;
    let retryPrompt = userPrompt;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const llmResponse = await this.callLLM(systemPrompt, retryPrompt);
        const validation = validateLLMOutput(llmResponse.text, schema);

        if (validation.success) {
          return {
            data: validation.data,
            model: llmResponse.model,
            tokensUsed: llmResponse.tokensUsed,
            retryCount: attempt - 1,
            schemaValid: true
          };
        }

        // Inject validation error into retry prompt
        lastError = validation.error;
        retryPrompt = `${userPrompt}\n\nYOUR PREVIOUS RESPONSE WAS INVALID. FIX THESE ERRORS:\n${validation.error}\n\nReturn ONLY valid JSON matching the required schema.`;
        console.warn(`⚠️ Schema validation failed (attempt ${attempt}/${MAX_RETRIES}): ${validation.error}`);
      } catch (err) {
        lastError = err.message;
        console.error(`❌ LLM call failed (attempt ${attempt}/${MAX_RETRIES}):`, err.message);
      }
    }

    throw new Error(`Failed after ${MAX_RETRIES} attempts. Last error: ${lastError}`);
  }

  // ─── Phase 1: Extract Requirements ─────────────────────────────

  async extractRequirements(tenderData) {
    console.log(`🔍 Phase 1: Extracting requirements from tender "${tenderData.title}"...`);

    const result = await this.callWithValidation(
      EXTRACT_REQUIREMENTS.system,
      EXTRACT_REQUIREMENTS.user(tenderData),
      ExtractedRequirementsSchema
    );

    return {
      requirements: result.data.requirements.map((r, i) => ({
        ...r,
        addressed: false,
        addressedBySectionId: null
      })),
      summary: result.data.summary,
      aiMetadata: {
        model: result.model,
        tokensUsed: result.tokensUsed,
        retryCount: result.retryCount,
        promptVersion: EXTRACT_REQUIREMENTS.version
      }
    };
  }

  // ─── Phase 2: Generate Section ─────────────────────────────────

  async generateSection(sectionType, context) {
    const promptConfig = SECTION_PROMPTS[sectionType];
    if (!promptConfig) {
      throw new Error(`Unknown section type: ${sectionType}. Valid types: ${Object.keys(SECTION_PROMPTS).join(', ')}`);
    }

    console.log(`📝 Phase 2: Generating section "${sectionType}"...`);

    const result = await this.callWithValidation(
      promptConfig.system,
      promptConfig.user(context),
      GeneratedSectionSchema
    );

    // Calculate composite confidence score
    const groundingDepth = (context.companyContext && context.companyContext.length > 50) ? 20 : 0;
    const schemaBonus = result.schemaValid ? 10 : 0;
    const selfConf = result.data.selfConfidence || 70;
    const compositeConfidence = Math.min(100, Math.round(
      (selfConf * 0.5) + (groundingDepth) + (schemaBonus) + 20 // base score
    ));

    return {
      title: result.data.title,
      type: sectionType,
      content: result.data.content,
      status: compositeConfidence >= 60 ? 'DRAFT' : 'NEEDS_REVIEW',
      aiMetadata: {
        model: result.model,
        promptVersion: promptConfig.version,
        groundingSources: context.groundingSources || [],
        schemaValid: true,
        factCheckScore: 0, // Will be set in Phase 3
        confidenceScore: compositeConfidence,
        generatedAt: new Date(),
        retryCount: result.retryCount,
        rawTokensUsed: result.tokensUsed
      },
      keyPoints: result.data.keyPoints,
      addressedRequirements: result.data.addressedRequirements || [],
      wordCount: result.data.wordCount || result.data.content.split(/\s+/).length
    };
  }

  // ─── Phase 3: Validate Section ─────────────────────────────────

  async validateSection(sectionContent, requirements, tenderData) {
    console.log(`✅ Phase 3: Running fact-check validation...`);

    try {
      const result = await this.callWithValidation(
        FACT_CHECK.system,
        FACT_CHECK.user(sectionContent, requirements, tenderData),
        FactCheckResultSchema
      );

      return {
        factCheckScore: result.data.overallScore,
        requirementsCovered: result.data.requirementsCovered,
        fabricatedClaims: result.data.fabricatedClaims,
        summary: result.data.summary,
        model: result.model
      };
    } catch (error) {
      console.error('⚠️ Fact-check validation failed:', error.message);
      throw error;
    }
  }

  // ─── Compliance Audit ──────────────────────────────────────────

  runComplianceAudit(sections, requirements) {
    const addressed = new Set();

    for (const section of sections) {
      if (section.status === 'APPROVED' || section.status === 'DRAFT' || section.status === 'MANUALLY_WRITTEN') {
        (section.aiMetadata?.addressedRequirements || []).forEach(r => addressed.add(r));
      }
    }

    const totalMandatory = requirements.filter(r => r.mandatory).length;
    const mandatoryAddressed = requirements.filter(r =>
      r.mandatory && (r.addressed || addressed.has(r.requirement))
    ).length;

    const total = requirements.length;
    const addressedCount = requirements.filter(r =>
      r.addressed || addressed.has(r.requirement)
    ).length;

    const unaddressed = requirements
      .filter(r => !r.addressed && !addressed.has(r.requirement))
      .map(r => r.requirement);

    return {
      totalRequirements: total,
      addressedCount,
      coveragePercentage: total > 0 ? Math.round((addressedCount / total) * 100) : 0,
      mandatoryTotal: totalMandatory,
      mandatoryAddressed: mandatoryAddressed,
      unaddressedRequirements: unaddressed,
      auditedAt: new Date()
    };
  }
}

module.exports = new RfpCopilotService();
