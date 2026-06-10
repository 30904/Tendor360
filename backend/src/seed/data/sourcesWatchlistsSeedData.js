const TenderSource = require('../../models/TenderSource');
const Watchlist = require('../../models/Watchlist');
const User = require('../../models/User');

function daysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function resolveSeedOwner(companyId) {
  const owner =
    (await User.findOne({ companyId, roles: { $in: ['TENDER MANAGER'] }, isActive: true })) ||
    (await User.findOne({ companyId, roles: { $in: ['SYSTEM ADMINISTRATOR', 'ADMIN'] }, isActive: true })) ||
    (await User.findOne({ companyId, isActive: true }));

  return owner;
}

/** TB-001 discovery connector templates (healthcare / MediCare) */
function buildHealthcareDiscoveryConnectors(companyCode) {
  return [
    {
      name: `${companyCode} SAM.gov — Medical & Hospital Equipment`,
      description:
        'US federal opportunities (NAICS 339112, 621511) for diagnostics, imaging, IVD, and hospital capital equipment.',
      type: 'Government',
      url: 'https://api.sam.gov/opportunities/v2/search',
      integrationMode: 'api',
      connectorTemplate: 'sam_gov',
      priority: 'high',
      reliability: 'high',
      frequency: 'daily',
      requiresAuth: true,
      authCredentials: { apiKey: 'demo-sam-gov-medicare-key' },
      discoveryConfig: {
        baseUrl: 'https://api.sam.gov',
        opportunitiesPath: '/opportunities/v2/search',
        authType: 'api_key',
        lookbackHours: 24,
        pageSize: 25,
        searchQuery: 'medical device OR diagnostics OR hospital equipment OR laboratory',
        scheduleEnabled: true
      },
      keywords: ['medical device', 'diagnostics', 'hospital', 'IVD'],
      categories: ['Medical Devices', 'Diagnostics'],
      lastSync: daysFromNow(-1),
      nextSync: daysFromNow(1),
      totalTenders: 42,
      newTenders: 11,
      successRate: 94,
      aiConfidence: 91
    },
    {
      name: `${companyCode} GovWin — Health Systems Intelligence`,
      description:
        'Curated federal and SLED intelligence for hospital networks, IDNs, and public health agency modernization.',
      type: 'Industry',
      url: 'https://api.iq.govwin.com/neo-ws/opportunities',
      integrationMode: 'api',
      connectorTemplate: 'govwin',
      priority: 'critical',
      reliability: 'high',
      frequency: 'every_4_hours',
      requiresAuth: true,
      authCredentials: { apiKey: 'demo-govwin-medicare-key' },
      discoveryConfig: {
        baseUrl: 'https://api.iq.govwin.com',
        opportunitiesPath: '/neo-ws/opportunities',
        authType: 'bearer',
        lookbackHours: 24,
        pageSize: 50,
        searchQuery: 'hospital OR health system OR laboratory modernization',
        scheduleEnabled: true
      },
      keywords: ['hospital', 'health system', 'public health', 'laboratory'],
      lastSync: daysFromNow(-0.2),
      nextSync: daysFromNow(0.15),
      totalTenders: 28,
      newTenders: 7,
      successRate: 90,
      aiConfidence: 88
    },
    {
      name: `${companyCode} Texas SmartBuy — Healthcare RFP Listings`,
      description:
        'State of Texas electronic state business daily — healthcare and medical supply RFP public listings.',
      type: 'Government',
      url: 'https://www.txsmartbuy.com/esbd',
      integrationMode: 'web_scraping',
      connectorTemplate: 'web_scrape',
      priority: 'medium',
      reliability: 'medium',
      frequency: 'daily',
      requiresAuth: false,
      scrapingConfig: {
        searchUrl: 'https://www.txsmartbuy.com/esbd',
        itemLinkSelector: 'a[href*="solicitation"]',
        loginUrl: ''
      },
      discoveryConfig: {
        lookbackHours: 168,
        scheduleEnabled: true
      },
      keywords: ['medical', 'healthcare', 'hospital supplies', 'Texas'],
      regions: ['TX', 'US'],
      lastSync: daysFromNow(-2),
      nextSync: daysFromNow(1),
      totalTenders: 14,
      newTenders: 3,
      successRate: 82,
      aiConfidence: 79
    },
    {
      name: `${companyCode} Vizient GPO — Category Refresh API`,
      description:
        'Group purchasing organization contract renewals for med-surg, lab, and imaging categories.',
      type: 'Industry',
      url: 'https://api.vizient.example.com/contracts/v1/opportunities',
      integrationMode: 'api',
      connectorTemplate: 'generic_api',
      priority: 'high',
      reliability: 'high',
      frequency: 'weekly',
      requiresAuth: true,
      authCredentials: { apiKey: 'demo-vizient-gpo-key' },
      discoveryConfig: {
        baseUrl: 'https://api.vizient.example.com',
        opportunitiesPath: '/contracts/v1/opportunities',
        authType: 'bearer',
        lookbackHours: 336,
        searchQuery: 'category refresh OR contract renewal',
        scheduleEnabled: true
      },
      keywords: ['GPO', 'med-surg', 'imaging', 'laboratory'],
      lastSync: daysFromNow(-5),
      nextSync: daysFromNow(2),
      totalTenders: 9,
      newTenders: 1,
      successRate: 85,
      aiConfidence: 84
    },
    {
      name: `${companyCode} Hospital RFP Email Inbox`,
      description:
        'Forwarded hospital RFP packages, amendments, and supplier qualification notices from strategic accounts.',
      type: 'Direct',
      url: 'https://inbox.tenders.example.com/healthcare',
      integrationMode: 'email',
      connectorTemplate: 'email',
      priority: 'medium',
      reliability: 'medium',
      frequency: 'hourly',
      requiresAuth: false,
      discoveryConfig: {
        lookbackHours: 24,
        scheduleEnabled: true
      },
      keywords: ['RFP', 'amendment', 'hospital', 'qualification'],
      lastSync: daysFromNow(-0.05),
      nextSync: daysFromNow(0.04),
      totalTenders: 6,
      newTenders: 2,
      successRate: 88,
      aiConfidence: 82
    },
    {
      name: `${companyCode} Manual Opportunity Upload`,
      description: 'Operator-uploaded RFP packages and amendment PDFs from hospital account teams.',
      type: 'Direct',
      url: 'https://upload.tender360.example.com/manual',
      integrationMode: 'manual',
      connectorTemplate: 'manual',
      priority: 'low',
      reliability: 'high',
      frequency: 'monthly',
      status: 'active',
      discoveryConfig: { scheduleEnabled: false, lookbackHours: 720 },
      lastSync: daysFromNow(-7),
      nextSync: null,
      totalTenders: 4,
      newTenders: 0,
      successRate: 100,
      aiConfidence: 95
    },
    {
      name: `${companyCode} CMS Open Data — Provider Supply Signals`,
      description:
        'CMS datasets and procurement signals for provider networks (pilot connector — configure API key to activate).',
      type: 'Government',
      url: 'https://data.cms.gov/provider-data/api/1/datastore/query',
      integrationMode: 'api',
      connectorTemplate: 'generic_api',
      priority: 'low',
      reliability: 'medium',
      frequency: 'weekly',
      status: 'inactive',
      requiresAuth: false,
      discoveryConfig: {
        baseUrl: 'https://data.cms.gov',
        opportunitiesPath: '/provider-data/api/1/datastore/query',
        authType: 'none',
        lookbackHours: 720,
        scheduleEnabled: false
      },
      keywords: ['CMS', 'provider', 'Medicare', 'supply chain'],
      lastSync: null,
      nextSync: null,
      totalTenders: 0,
      newTenders: 0,
      successRate: 0,
      aiConfidence: 70
    }
  ];
}

async function seedSourcesWatchlistsForCompany(company, ownerId) {
  const companyCode = company.code || 'DEMO';
  const isHealthcare = company.industry === 'HEALTHCARE' || companyCode === 'MEDICARE';

  await Watchlist.deleteMany({ companyId: company._id });

  const sourceTemplates = isHealthcare
    ? buildHealthcareDiscoveryConnectors(companyCode)
    : [
        {
          name: `${companyCode} SAM.gov Discovery`,
          description: 'Federal opportunity feed for life sciences and laboratory procurement.',
          type: 'Government',
          url: 'https://api.sam.gov/opportunities/v2/search',
          priority: 'high',
          reliability: 'high',
          frequency: 'daily',
          lastSync: daysFromNow(-1),
          nextSync: daysFromNow(1),
          totalTenders: 22,
          newTenders: 9,
          successRate: 92,
          aiConfidence: 91
        },
        {
          name: `${companyCode} GovWin Intelligence`,
          description: 'Curated federal and SLED intelligence feed with agency targeting.',
          type: 'Industry',
          url: 'https://api.govwin.example/opportunities',
          priority: 'critical',
          reliability: 'high',
          frequency: 'every_4_hours',
          lastSync: daysFromNow(0),
          nextSync: daysFromNow(0.2),
          totalTenders: 16,
          newTenders: 6,
          successRate: 88,
          aiConfidence: 88
        },
        {
          name: `${companyCode} Email Tender Inbox`,
          description: 'Forwarded RFP and amendment packages from strategic account inboxes.',
          type: 'Direct',
          url: 'https://inbox.tenders.example.com/feed',
          priority: 'medium',
          reliability: 'medium',
          frequency: 'hourly',
          lastSync: daysFromNow(-0.1),
          nextSync: daysFromNow(0.05),
          totalTenders: 7,
          newTenders: 2,
          successRate: 81,
          aiConfidence: 79
        }
      ];

  const sourceNames = sourceTemplates.map((template) => template.name);
  await TenderSource.deleteMany({ companyId: company._id, name: { $nin: sourceNames } });

  const upsertedSources = [];

  for (const template of sourceTemplates) {
    const source = await TenderSource.findOneAndUpdate(
      { companyId: company._id, name: template.name },
      {
        companyId: company._id,
        owner: ownerId,
        status: template.status || 'active',
        authCredentials: template.authCredentials || { apiKey: '' },
        ...template
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    upsertedSources.push(source);
  }

  const watchlistTemplates = isHealthcare
    ? [
        {
          name: 'Hospital diagnostics modernization',
          description: 'Hospital and IDN tenders for immunoassay, imaging, and point-of-care refresh.',
          keywords: ['diagnostics', 'immunoassay', 'point of care'],
          categories: ['Diagnostics', 'Hospital Systems'],
          regions: ['US', 'TX', 'CA', 'FL'],
          priority: 'high',
          frequency: 'daily',
          totalMatches: 21,
          newMatches: 6,
          totalAlerts: 5,
          aiConfidence: 88,
          lastAlert: daysFromNow(-1)
        },
        {
          name: 'Public health laboratory expansion',
          description: 'State and federal public health laboratory build-outs and reference lab upgrades.',
          keywords: ['public health', 'PCR', 'reference laboratory'],
          categories: ['Public Health', 'Laboratory'],
          regions: ['MD', 'NY', 'TX'],
          priority: 'high',
          frequency: 'every_4_hours',
          totalMatches: 14,
          newMatches: 4,
          totalAlerts: 3,
          aiConfidence: 85,
          lastAlert: daysFromNow(-2)
        },
        {
          name: 'Medical device service contracts',
          description: 'Multi-year service, calibration, and lifecycle support contracts for installed fleets.',
          keywords: ['service contract', 'calibration', 'lifecycle support'],
          categories: ['Medical Devices', 'Service'],
          regions: ['US'],
          priority: 'medium',
          frequency: 'daily',
          totalMatches: 10,
          newMatches: 2,
          totalAlerts: 2,
          aiConfidence: 80,
          lastAlert: daysFromNow(-3)
        }
      ]
    : [
        {
          name: 'Biotech GMP instrumentation',
          description: 'GovWin + SAM.gov watchlist for GMP suites, EM, and cold chain.',
          keywords: ['GMP', 'biorepository', 'cold chain'],
          categories: ['Laboratory', 'Life Sciences'],
          regions: ['US'],
          priority: 'high',
          frequency: 'daily',
          totalMatches: 18,
          newMatches: 5,
          totalAlerts: 4,
          aiConfidence: 86,
          lastAlert: daysFromNow(-1)
        },
        {
          name: 'Public health diagnostics',
          description: 'State and federal public health laboratory modernization opportunities.',
          keywords: ['public health', 'immunoassay', 'PCR'],
          categories: ['Diagnostics', 'Public Health'],
          regions: ['MD', 'TX', 'CA'],
          priority: 'high',
          frequency: 'every_4_hours',
          totalMatches: 12,
          newMatches: 3,
          totalAlerts: 2,
          aiConfidence: 82,
          lastAlert: daysFromNow(-2)
        },
        {
          name: 'University core facilities',
          description: 'Research core facility instrument refresh and service contracts.',
          keywords: ['university core', 'proteomics', 'sequencing'],
          categories: ['Research', 'Academic'],
          regions: ['US'],
          priority: 'medium',
          frequency: 'daily',
          totalMatches: 9,
          newMatches: 2,
          totalAlerts: 1,
          aiConfidence: 78,
          lastAlert: daysFromNow(-3)
        }
      ];

  await Watchlist.insertMany(
    watchlistTemplates.map((watchlist) => ({
      companyId: company._id,
      owner: ownerId,
      status: 'active',
      ...watchlist
    }))
  );

  return {
    sources: upsertedSources,
    samSource: upsertedSources.find((s) => s.connectorTemplate === 'sam_gov'),
    govwinSource: upsertedSources.find((s) => s.connectorTemplate === 'govwin'),
    emailSource: upsertedSources.find((s) => s.connectorTemplate === 'email')
  };
}

module.exports = {
  daysFromNow,
  resolveSeedOwner,
  seedSourcesWatchlistsForCompany
};
