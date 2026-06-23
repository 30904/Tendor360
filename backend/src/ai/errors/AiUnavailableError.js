class AiUnavailableError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'AiUnavailableError';
    this.details = details;
  }
}

module.exports = AiUnavailableError;
