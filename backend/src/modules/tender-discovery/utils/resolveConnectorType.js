/**
 * Resolve which registered connector implementation to use for a TenderSource.
 */
function resolveConnectorType(source = {}) {
  if (source.connectorTemplate) {
    return source.connectorTemplate;
  }

  const legacyMap = {
    Government: 'sam_gov',
    Industry: 'govwin',
    Direct: 'email',
    Private: 'manual',
    News: 'web_scrape',
    Consortium: 'generic_api'
  };

  if (source.integrationMode === 'web_scraping') {
    return 'web_scrape';
  }
  if (source.integrationMode === 'email') {
    return 'email';
  }
  if (source.integrationMode === 'manual') {
    return 'manual';
  }

  return legacyMap[source.type] || 'generic_api';
}

module.exports = { resolveConnectorType };
