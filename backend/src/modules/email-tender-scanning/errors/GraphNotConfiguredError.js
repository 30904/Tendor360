class GraphNotConfiguredError extends Error {
  constructor(message, details = {}) {
    super(
      message ||
        'Microsoft Graph is not configured. Set MS_GRAPH_TENANT_ID, MS_GRAPH_CLIENT_ID, and MS_GRAPH_CLIENT_SECRET.'
    );
    this.name = 'GraphNotConfiguredError';
    this.details = details;
  }
}

module.exports = GraphNotConfiguredError;
