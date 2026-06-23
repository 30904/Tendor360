const OpenAiProvider = require('./providers/OpenAiProvider');
const HeuristicAiProvider = require('./providers/HeuristicAiProvider');

const PROVIDERS = {
  openai: new OpenAiProvider(),
  heuristic: new HeuristicAiProvider()
};

function normalizeProviderKey(value) {
  return String(value || 'openai')
    .split('#')[0]
    .trim()
    .toLowerCase();
}

function resolveProvider() {
  const preferred = normalizeProviderKey(process.env.AI_PROVIDER);
  const provider = PROVIDERS[preferred];
  if (provider?.isConfigured()) {
    return provider;
  }

  // Log a structured warning so operators can see that real AI is not active.
  console.warn(
    `[AI-WARN] Provider "${preferred}" is not configured or key is invalid. ` +
    `Falling back to heuristic. Set AI_PROVIDER and a valid API key to enable real AI.`
  );
  return PROVIDERS.heuristic;
}

class AiOrchestrator {
  listProviders() {
    return Object.values(PROVIDERS).map((provider) => ({
      key: provider.key,
      displayName: provider.displayName,
      configured: provider.isConfigured()
    }));
  }

  /**
   * Returns true if the currently resolved provider is a real AI provider
   * (not the heuristic fallback). Useful for callers that need to distinguish
   * AI-backed results from heuristic estimates.
   */
  isUsingRealAI() {
    return resolveProvider().key !== 'heuristic';
  }

  async summarize(payload) {
    const forceDeterministic =
      process.env.AI_DEMO_MODE === 'deterministic';

    if (forceDeterministic) {
      const result = await PROVIDERS.heuristic.summarize(payload);
      return { ...result, provider: 'heuristic', mode: 'deterministic' };
    }

    const provider = resolveProvider();
    try {
      const result = await provider.summarize(payload);
      return { ...result, provider: provider.key };
    } catch (error) {
      // Log the actual API error before falling back so it is not swallowed silently.
      console.error(
        `[AI-ERROR] Provider "${provider.key}" summarize() failed: ${error.message}. ` +
        `Falling back to heuristic. Check API key validity and quota.`
      );
      const fallback = PROVIDERS.heuristic;
      const result = await fallback.summarize(payload);
      return { ...result, provider: fallback.key, fallbackReason: error.message };
    }
  }
}

module.exports = new AiOrchestrator();
