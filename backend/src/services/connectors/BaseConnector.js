class BaseConnector {
  constructor(key, displayName) {
    this.key = key;
    this.displayName = displayName;
  }

  validateConfig() {
  }

  async discover() {
    throw new Error(`${this.key} connector must implement discover()`);
  }

  normalizeOpportunity(raw, sourceMeta = {}) {
    const externalId = String(
      raw.externalId || raw.noticeId || raw.solicitationNumber || raw.id || ''
    ).trim();

    return {
      externalId,
      reference: String(raw.reference || externalId || '').trim().toUpperCase(),
      title: String(raw.title || raw.name || 'Untitled opportunity').trim(),
      organization: String(raw.organization || raw.agency || sourceMeta.organization || 'Unknown').trim(),
      location: String(raw.location || raw.placeOfPerformance || 'Unspecified').trim(),
      description: String(raw.description || raw.summary || '').trim(),
      estimatedValue: Number(raw.estimatedValue || raw.awardAmount || 0) || 0,
      currency: raw.currency || 'USD',
      deadline: raw.deadline || raw.responseDeadLine || raw.closeDate || null,
      externalUpdatedAt: raw.externalUpdatedAt || raw.updatedAt || raw.modifiedDate || null,
      programSummary: raw.programSummary || raw.summary || raw.description || '',
      contacts: raw.contacts || [],
      timeline: raw.timeline || {},
      attachments: raw.attachments || [],
      source: sourceMeta.name || this.displayName,
      tenderType: raw.tenderType || 'Government RFP',
      therapeuticArea: raw.therapeuticArea || 'Other',
      metadata: {
        connector: this.key,
        raw
      }
    };
  }
}

module.exports = BaseConnector;
