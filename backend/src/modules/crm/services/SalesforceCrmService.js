const axios = require('axios');
const Tender = require('../../../models/Tender');
const CrmAccount = require('../models/CrmAccount');
const IntegrationConnector = require('../../integrations/models/IntegrationConnector');

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9@.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenOverlap(a, b) {
  const ta = new Set(normalizeText(a).split(' ').filter((t) => t.length > 2));
  const tb = new Set(normalizeText(b).split(' ').filter((t) => t.length > 2));
  if (!ta.size || !tb.size) return 0;
  let shared = 0;
  ta.forEach((t) => {
    if (tb.has(t)) shared += 1;
  });
  return Math.round((shared / Math.max(ta.size, tb.size)) * 100);
}

async function resolveSalesforceConfig(companyId) {
  const connector = await IntegrationConnector.findOne({
    companyId,
    key: 'salesforce',
    isDeleted: false
  }).lean();

  const fromEnv = {
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
    accessToken: process.env.SALESFORCE_ACCESS_TOKEN
  };

  if (connector?.config?.instanceUrl && connector?.config?.accessToken) {
    return {
      instanceUrl: connector.config.instanceUrl,
      accessToken: connector.config.accessToken,
      mode: 'connector'
    };
  }

  if (fromEnv.instanceUrl && fromEnv.accessToken) {
    return { ...fromEnv, mode: 'env' };
  }

  return { mode: 'cache' };
}

async function querySalesforceApi(config, { name, email }) {
  const base = config.instanceUrl.replace(/\/$/, '');
  const safeName = name.replace(/'/g, "\\'");
  let soql = `SELECT Id,AccountNumber,Name,BillingStreet,BillingCity,BillingState,Phone,Website FROM Account WHERE Name LIKE '%${safeName.slice(0, 40)}%' LIMIT 5`;
  if (email) {
    const safeEmail = email.replace(/'/g, "\\'");
    soql = `SELECT Id,Name,BillingStreet,BillingCity,BillingState,Phone FROM Contact WHERE Email = '${safeEmail}' LIMIT 1`;
  }

  const response = await axios.get(`${base}/services/data/v59.0/query`, {
    params: { q: soql },
    headers: { Authorization: `Bearer ${config.accessToken}` },
    timeout: 20000,
    validateStatus: (s) => s < 500
  });

  if (response.status >= 400) {
    throw new Error(response.data?.message || `Salesforce API ${response.status}`);
  }

  const records = response.data?.records || [];
  return records.map((r) => ({
    salesforceId: r.Id,
    accountNumber: r.AccountNumber || null,
    name: r.Name,
    billingAddress: [r.BillingStreet, r.BillingCity, r.BillingState].filter(Boolean).join(', '),
    shippingAddress: '',
    city: r.BillingCity,
    state: r.BillingState,
    contacts: email ? [{ email }] : [],
    source: 'salesforce_api'
  }));
}

async function searchLocalCache(companyId, { name, address, email }) {
  const accounts = await CrmAccount.find({ companyId, isDeleted: false }).lean();
  let best = null;
  let bestScore = 0;

  for (const account of accounts) {
    let score = tokenOverlap(name, account.name);
    if (address) {
      score = Math.max(score, tokenOverlap(address, account.shippingAddress || account.billingAddress));
    }
    if (email && (account.contacts || []).some((c) => normalizeText(c.email) === normalizeText(email))) {
      score = Math.max(score, 95);
    }
    if (score > bestScore) {
      bestScore = score;
      best = account;
    }
  }

  return { account: best, matchScore: bestScore };
}

function buildValidationSnapshot(account, matchScore, matchMethod, matchedBy) {
  return {
    status: account ? (matchScore >= 70 ? 'validated' : 'partial') : 'not_found',
    salesforceAccountId: account?.salesforceId || null,
    matchedAccountName: account?.name || null,
    matchScore,
    matchMethod,
    matchedBy,
    validatedAt: new Date(),
    snapshot: account
      ? {
          accountNumber: account.accountNumber || null,
          division: account.division,
          relationshipStatus: account.relationshipStatus,
          historicalRevenue: account.annualRevenue,
          previousContracts: account.previousContracts,
          opportunityHistory: `${account.previousContracts || 0} prior programs in CRM.`,
          billingAddress: account.billingAddress,
          shippingAddress: account.shippingAddress,
          contacts: account.contacts || []
        }
      : null
  };
}

class SalesforceCrmService {
  async getStatus(companyId) {
    const config = await resolveSalesforceConfig(companyId);
    const accountCount = await CrmAccount.countDocuments({ companyId, isDeleted: false });
    const validatedTenders = await Tender.countDocuments({
      companyId,
      isDeleted: false,
      'crmValidation.status': { $in: ['validated', 'partial'] }
    });

    return {
      configured: config.mode !== 'cache',
      mode: config.mode,
      cachedAccounts: accountCount,
      validatedTenders
    };
  }

  async lookupAccount(companyId, criteria = {}) {
    const { name = '', address = '', email = '' } = criteria;
    const config = await resolveSalesforceConfig(companyId);

    if (config.mode !== 'cache' && name) {
      try {
        const apiHits = await querySalesforceApi(config, { name, email });
        if (apiHits.length) {
          const top = apiHits[0];
          
          // Live Sync: Upsert API record into CrmAccount cache to keep local database updated
          const cached = await CrmAccount.findOneAndUpdate(
            { companyId, salesforceId: top.salesforceId },
            {
              companyId,
              salesforceId: top.salesforceId,
              accountNumber: top.accountNumber,
              name: top.name,
              billingAddress: top.billingAddress,
              city: top.city,
              state: top.state,
              contacts: top.contacts,
              source: 'salesforce_api',
              relationshipStatus: 'Active',
              division: 'Salesforce CRM'
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          return buildValidationSnapshot(
            cached,
            88,
            'salesforce_api',
            { name: true, address: Boolean(address), contact: Boolean(email) }
          );
        }
      } catch (error) {
        console.warn('Salesforce API lookup failed, using cache:', error.message);
      }
    }

    const { account, matchScore } = await searchLocalCache(companyId, { name, address, email });
    return buildValidationSnapshot(
      account,
      matchScore,
      'crm_cache',
      { name: true, address: Boolean(address), contact: Boolean(email) }
    );
  }

  async validateTender(companyId, tenderId) {
    const tender = await Tender.findOne({ _id: tenderId, companyId, isDeleted: false });
    if (!tender) throw new Error('Opportunity not found');

    const shipTo = tender.intelligence?.commercial?.shipTo || '';
    const contacts = tender.discovery?.metadata?.contacts || tender.intelligence?.metadata?.contacts || [];
    const email =
      contacts.find((c) => c.value && String(c.value).includes('@'))?.value ||
      contacts.find((c) => c.email)?.email ||
      '';

    const result = await this.lookupAccount(companyId, {
      name: tender.organization,
      address: shipTo || tender.location,
      email: String(email).includes('@') ? email : ''
    });

    tender.crmValidation = result;
    await tender.save();

    return { tender, validation: result };
  }

  async validateAllRecent(companyId, limit = 20) {
    const tenders = await Tender.find({
      companyId,
      isDeleted: false,
      organization: { $exists: true, $ne: '' }
    })
      .sort({ updatedAt: -1 })
      .limit(limit);

    const results = [];
    for (const tender of tenders) {
      const { validation } = await this.validateTender(companyId, tender._id);
      results.push({ tenderId: tender._id, reference: tender.reference, validation });
    }
    return results;
  }
}

module.exports = new SalesforceCrmService();
