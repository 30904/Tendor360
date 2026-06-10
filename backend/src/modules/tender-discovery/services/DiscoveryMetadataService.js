/**
 * TB-006 — Map connector opportunity fields into tender discovery metadata.
 */
function buildGovWinMetadata(raw = {}) {
  const contacts = [];
  if (raw.contactEmail) contacts.push({ type: 'email', value: raw.contactEmail });
  if (raw.contactName) contacts.push({ type: 'name', value: raw.contactName });
  if (raw.contactPhone) contacts.push({ type: 'phone', value: raw.contactPhone });
  if (Array.isArray(raw.contacts)) {
    raw.contacts.forEach((c) => contacts.push(c));
  }

  const timeline = {
    postedDate: raw.postedDate || raw.publishDate || raw.createdDate || null,
    updatedDate: raw.updatedAt || raw.modifiedDate || raw.lastModified || null,
    responseDeadline: raw.responseDeadLine || raw.deadline || raw.closeDate || null,
    awardDate: raw.awardDate || null
  };

  return {
    programSummary:
      raw.programSummary ||
      raw.summary ||
      raw.description ||
      raw.synopsis ||
      '',
    timeline,
    contacts,
    agency: raw.agencyName || raw.agency || raw.organization,
    naics: raw.naics || raw.naicsCode,
    setAside: raw.setAside || raw.typeOfSetAside
  };
}

function applyMetadataToTender(tender, opportunity) {
  const raw = opportunity.metadata?.raw || {};
  const connector = opportunity.metadata?.connector || tender.discovery?.connectorType;
  const extracted =
    connector === 'govwin' || connector === 'sam_gov'
      ? buildGovWinMetadata({ ...raw, ...opportunity })
      : {
          programSummary: opportunity.programSummary || opportunity.description || '',
          timeline: opportunity.timeline || {},
          contacts: opportunity.contacts || []
        };

  tender.discovery = tender.discovery || {};
  tender.discovery.metadata = {
    ...extracted,
    sourceConnector: connector,
    extractedAt: new Date()
  };
  tender.discovery.externalUpdatedAt =
    opportunity.externalUpdatedAt || extracted.timeline?.updatedDate || tender.discovery.externalUpdatedAt;
  tender.discovery.contentHash = opportunity.contentHash || tender.discovery.contentHash;
  tender.discovery.lastSyncedAt = new Date();

  if (extracted.programSummary && !tender.description) {
    tender.description = extracted.programSummary;
  }

  return tender;
}

module.exports = {
  buildGovWinMetadata,
  applyMetadataToTender
};
