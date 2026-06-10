const CrmAccount = require('../../modules/crm/models/CrmAccount');
const IntegrationConnector = require('../../modules/integrations/models/IntegrationConnector');

const HEALTHCARE_CRM_ACCOUNTS = [
  {
    salesforceId: 'SF-001HCA',
    name: 'MediCare Demo Health System',
    division: 'Healthcare Diagnostics',
    relationshipStatus: 'Strategic',
    billingAddress: '100 Hospital Way, Boston, MA 02115',
    shippingAddress: '1200 Medical Center Dr, Boston, MA 02115',
    city: 'Boston',
    state: 'MA',
    contacts: [{ name: 'Procurement Demo', email: 'procurement.demo@healthsystem.example', phone: '+1-617-555-0100' }],
    annualRevenue: 9600000,
    previousContracts: 4
  },
  {
    salesforceId: 'SF-002IDN',
    name: 'Integrated Delivery Network',
    division: 'Healthcare Diagnostics',
    relationshipStatus: 'Active',
    billingAddress: '500 Campus Drive, Chicago, IL 60601',
    shippingAddress: '500 Campus Drive, Chicago, IL 60601',
    city: 'Chicago',
    state: 'IL',
    contacts: [{ name: 'Supply Chain', email: 'supply@idn.example' }],
    annualRevenue: 12000000,
    previousContracts: 6
  },
  {
    salesforceId: 'SF-003VA',
    name: 'US Federal Health Accounts',
    division: 'Government & Defense Medical',
    relationshipStatus: 'Strategic',
    billingAddress: '810 Vermont Ave NW, Washington, DC 20420',
    shippingAddress: '810 Vermont Ave NW, Washington, DC 20420',
    city: 'Washington',
    state: 'DC',
    contacts: [{ name: 'Contracting Officer', email: 'co@va-health.example' }],
    annualRevenue: 18400000,
    previousContracts: 8
  },
  {
    salesforceId: 'SF-004PH',
    name: 'Public Health Agencies',
    division: 'Public Sector Life Sciences',
    relationshipStatus: 'Strategic',
    billingAddress: '1600 Clifton Rd, Atlanta, GA 30329',
    shippingAddress: '1600 Clifton Rd, Atlanta, GA 30329',
    city: 'Atlanta',
    state: 'GA',
    contacts: [{ name: 'Lab Director', email: 'lab@ph-agency.example' }],
    annualRevenue: 22100000,
    previousContracts: 10
  },
  {
    salesforceId: 'SF-005UNI',
    name: 'Academic Research Consortium',
    division: 'University & Core Facilities',
    relationshipStatus: 'Developing',
    billingAddress: '77 Massachusetts Ave, Cambridge, MA 02139',
    shippingAddress: '77 Massachusetts Ave, Cambridge, MA 02139',
    city: 'Cambridge',
    state: 'MA',
    contacts: [{ name: 'Core Facility Admin', email: 'core@university.example' }],
    annualRevenue: 4200000,
    previousContracts: 2
  }
];

async function seedSalesforceCrmForCompany(companyId) {
  const upserted = [];
  for (const template of HEALTHCARE_CRM_ACCOUNTS) {
    const doc = await CrmAccount.findOneAndUpdate(
      { companyId, salesforceId: template.salesforceId },
      { companyId, ...template, source: 'seed', isDeleted: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    upserted.push(doc);
  }

  await IntegrationConnector.findOneAndUpdate(
    { companyId, key: 'salesforce' },
    {
      companyId,
      key: 'salesforce',
      displayName: 'Salesforce CRM',
      category: 'crm',
      status: 'active',
      health: process.env.SALESFORCE_ACCESS_TOKEN ? 'healthy' : 'healthy',
      config: {
        configured: true,
        mode: process.env.SALESFORCE_ACCESS_TOKEN ? 'live_api' : 'crm_cache',
        instanceUrl: process.env.SALESFORCE_INSTANCE_URL || '',
        seededAt: new Date().toISOString()
      },
      lastCheckedAt: new Date(),
      isDeleted: false
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return upserted;
}

module.exports = { seedSalesforceCrmForCompany, HEALTHCARE_CRM_ACCOUNTS };
