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
      const fallback = PROVIDERS.heuristic;
      const result = await fallback.summarize(payload);
      return { ...result, provider: fallback.key, fallbackReason: error.message };
    }
  }
}

module.exports = new AiOrchestrator();
