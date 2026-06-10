class BaseAiProvider {
  constructor(key, displayName) {
    this.key = key;
    this.displayName = displayName;
  }

  isConfigured() {
    return false;
  }

  async summarize() {
    throw new Error(`${this.key} provider must implement summarize()`);
  }

  async classify() {
    throw new Error(`${this.key} provider must implement classify()`);
  }
}

module.exports = BaseAiProvider;
