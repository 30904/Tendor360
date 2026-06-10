const Company = require('../../models/Company');
const User = require('../../models/User');
const Tender = require('../../models/Tender');
const Document = require('../../models/Document');
const TenderDiscoveryJob = require('../../modules/tender-discovery/models/TenderDiscoveryJob');
const TenderDiscoveryLog = require('../../modules/tender-discovery/models/TenderDiscoveryLog');
const TenderImportBatch = require('../../modules/tender-discovery/models/TenderImportBatch');
const ScoringProfile = require('../../modules/ai-scoring/models/ScoringProfile');
const ScoringRule = require('../../modules/ai-scoring/models/ScoringRule');
const OpportunityScore = require('../../modules/ai-scoring/models/OpportunityScore');
const DocumentExtraction = require('../../modules/document-intelligence/models/DocumentExtraction');
const ExtractionResult = require('../../modules/document-intelligence/models/ExtractionResult');
const ClauseExtraction = require('../../modules/document-intelligence/models/ClauseExtraction');
const GoNoGoReview = require('../../modules/go-no-go/models/GoNoGoReview');
const DecisionHistory = require('../../modules/go-no-go/models/DecisionHistory');
const AutomationJob = require('../../modules/automation/models/AutomationJob');
const AutomationLog = require('../../modules/automation/models/AutomationLog');
const AutomationFailure = require('../../modules/automation/models/AutomationFailure');
const IntegrationConnector = require('../../modules/integrations/models/IntegrationConnector');
const ApiCredential = require('../../modules/integrations/models/ApiCredential');
const SavedSearch = require('../../models/SavedSearch');
const {
  resolveSeedOwner,
  seedSourcesWatchlistsForCompany
} = require('../data/sourcesWatchlistsSeedData');
const { buildThermoOpportunityCatalog } = require('../data/thermoOpportunityCatalog');

const THERMO_OPPORTUNITIES = buildThermoOpportunityCatalog(45);

const EXTRACTION_FIELD_LIBRARY = [
  { fieldKey: 'scope', label: 'Scope of work' },
  { fieldKey: 'quantities', label: 'Quantities' },
  { fieldKey: 'pricing', label: 'Pricing structure' },
  { fieldKey: 'contacts', label: 'Procurement contacts' },
  { fieldKey: 'terms_conditions', label: 'Terms & conditions' },
  { fieldKey: 'insurance', label: 'Insurance requirements' },
  { fieldKey: 'bid_instructions', label: 'Bid instructions' },
  { fieldKey: 'compliance_notes', label: 'Compliance notes' },
  { fieldKey: 'delivery_timeline', label: 'Delivery timeline' }
];

const CLAUSE_LIBRARY = [
  { clauseType: 'insurance', text: 'Contractor shall maintain commercial general liability insurance of not less than $5M per occurrence.', riskLevel: 'high' },
  { clauseType: 'compliance', text: 'Offeror must maintain FDA 21 CFR Part 11 compliant audit trails for all validated systems.', riskLevel: 'medium' },
  { clauseType: 'delivery', text: 'All shipments must arrive within 72 hours of scheduled lane departure with validated temperature logs.', riskLevel: 'high' },
  { clauseType: 'pricing', text: 'Unit prices shall remain firm for the first 12 months with CPI-U capped annual adjustments.', riskLevel: 'medium' },
  { clauseType: 'indemnification', text: 'Contractor indemnifies the Government for losses arising from non-compliant storage conditions.', riskLevel: 'high' },
  { clauseType: 'terms', text: 'Government may terminate for convenience with 30 days written notice.', riskLevel: 'low' },
  { clauseType: 'eligibility', text: 'Offeror must demonstrate GMP manufacturing support experience within the last five years.', riskLevel: 'medium' }
];

function daysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function seedIntelligenceDemo() {
  const companies = await Company.find({ organizationKind: { $ne: 'supplier' }, isDeleted: false });
  if (!companies.length) {
    console.log('⚠️ No buyer companies found for intelligence demo seeding');
    return;
  }

  for (const company of companies) {
    const owner = await resolveSeedOwner(company._id);
    if (!owner) continue;

    const companyCode = company.code || 'DEMO';
    const refs = THERMO_OPPORTUNITIES.map((item) => `${companyCode}-${item.reference}`);

    await Promise.all([
      TenderDiscoveryJob.deleteMany({ companyId: company._id }),
      TenderImportBatch.deleteMany({ companyId: company._id }),
      TenderDiscoveryLog.deleteMany({ companyId: company._id }),
      OpportunityScore.deleteMany({ companyId: company._id }),
      ScoringRule.deleteMany({ companyId: company._id }),
      ScoringProfile.deleteMany({ companyId: company._id }),
      DocumentExtraction.deleteMany({ companyId: company._id }),
      ExtractionResult.deleteMany({ companyId: company._id }),
      ClauseExtraction.deleteMany({ companyId: company._id }),
      GoNoGoReview.deleteMany({ companyId: company._id }),
      DecisionHistory.deleteMany({ companyId: company._id }),
      AutomationJob.deleteMany({ companyId: company._id }),
      AutomationLog.deleteMany({ companyId: company._id }),
      AutomationFailure.deleteMany({ companyId: company._id }),
      IntegrationConnector.deleteMany({ companyId: company._id }),
      ApiCredential.deleteMany({ companyId: company._id }),
      SavedSearch.deleteMany({ companyId: company._id }),
      Tender.deleteMany({ companyId: company._id, reference: { $in: refs } })
    ]);

    const reviewer = await User.findOne({ companyId: company._id, roles: 'REVIEWER' });
    const approver = await User.findOne({ companyId: company._id, roles: 'APPROVER' });

    const { samSource, govwinSource, emailSource } = await seedSourcesWatchlistsForCompany(company, owner._id);

    const isHealthcare = company.industry === 'HEALTHCARE' || company.code === 'MEDICARE';
    const profile = await ScoringProfile.create({
      companyId: company._id,
      name: isHealthcare
        ? 'Healthcare pursuit & hospital capital scoring'
        : 'Thermo-style life sciences pursuit profile',
      description: isHealthcare
        ? 'Weights relevancy for hospital diagnostics, med-surg, and public health laboratory opportunities.'
        : 'Demo scoring profile for government laboratory and life sciences opportunities.',
      isDefault: true,
      thresholds: { pursue: 78, review: 58, decline: 40 }
    });

    const rules = [
      { dimension: 'relevancy', weight: 30, name: 'Portfolio relevancy' },
      { dimension: 'product_fit', weight: 25, name: 'Product fit' },
      { dimension: 'strategic', weight: 20, name: 'Strategic priority' },
      { dimension: 'customer_fit', weight: 15, name: 'Customer fit' },
      { dimension: 'risk', weight: 10, name: 'Risk posture' }
    ];

    await ScoringRule.insertMany(
      rules.map((rule) => ({
        companyId: company._id,
        profileId: profile._id,
        name: rule.name,
        dimension: rule.dimension,
        weight: rule.weight,
        enabled: true
      }))
    );

    await SavedSearch.insertMany([
      {
        companyId: company._id,
        name: 'Biotech GMP instrumentation',
        description: 'GovWin + SAM.gov watchlist for GMP suites, EM, and cold chain.',
        user: owner._id,
        filters: {
          searchQuery: 'GMP OR biorepository OR cold chain',
          estimatedValue: { min: 1000000, max: 15000000 }
        }
      },
      {
        companyId: company._id,
        name: 'Public health diagnostics',
        description: 'State and federal public health laboratory modernization opportunities.',
        user: owner._id,
        filters: {
          searchQuery: 'public health laboratory OR immunoassay OR PCR',
          regions: ['MD', 'TX', 'CA']
        }
      },
      {
        companyId: company._id,
        name: 'University core facilities',
        description: 'Research core facility instrument refresh and service contracts.',
        user: owner._id,
        filters: {
          searchQuery: 'university core OR proteomics OR sequencing',
          pipelineStage: ['identified', 'evaluating']
        }
      }
    ]);

    const tenders = [];
    for (let index = 0; index < THERMO_OPPORTUNITIES.length; index += 1) {
      const item = THERMO_OPPORTUNITIES[index];
      const importedAt = daysFromNow(-(index % 14));
      const isExpired = index % 11 === 0;
      const deadline = isExpired ? daysFromNow(-(3 + (index % 5))) : daysFromNow(5 + (index % 45));
      const aiMatchScore = 38 + (index * 7) % 58;
      const tender = await Tender.create({
        companyId: company._id,
        reference: `${companyCode}-${item.reference}`,
        title: item.title,
        organization: item.organization,
        location: item.location,
        description: item.description,
        estimatedValue: item.estimatedValue,
        currency: 'USD',
        deadline,
        tenderType: item.tenderType,
        therapeuticArea: item.therapeuticArea,
        aiMatchScore,
        status: isExpired ? 'overdue' : index % 17 === 0 ? 'closed' : 'active',
        source: item.source,
        pipelineStage: item.pipelineStage,
        priority: item.priority,
        urgency: item.urgency,
        winProbability: Math.min(92, 28 + (index * 5) % 65),
        owner: owner._id,
        assignedTo: reviewer?._id || owner._id,
        publishedDate: importedAt,
        tags: [item.industry || 'life sciences', item.connectorType, item.therapeuticArea],
        discovery: {
          externalKey: `${item.connectorType}:${item.reference}`,
          connectorType: item.connectorType,
          importedAt
        }
      });
      tenders.push(tender);
    }

    for (let index = 0; index < tenders.length; index += 1) {
      const tender = tenders[index];
      const compositeScore = 42 + (index * 6) % 54;
      const confidence = 58 + (index * 5) % 40;
      await OpportunityScore.create({
        companyId: company._id,
        tenderId: tender._id,
        profileId: profile._id,
        dimensions: {
          relevancy: Math.min(98, compositeScore + (index % 3) * 4),
          product_fit: Math.min(98, compositeScore + 3 - (index % 4)),
          customer_fit: Math.min(98, compositeScore - (index % 5)),
          strategic: Math.min(98, compositeScore + (index % 2) * 5),
          risk: 22 + (index % 6) * 11,
          confidence
        },
        compositeScore,
        recommendation: compositeScore >= 78 ? 'pursue' : compositeScore >= 58 ? 'review' : 'decline',
        rationale: `Thermo-style pursuit scoring for ${tender.organization} with ${tender.tags?.[0] || 'life sciences'} fit.`,
        modelProvider: 'heuristic'
      });
    }

    let samJob = null;
    let govwinJob = null;

    if (samSource) {
      samJob = await TenderDiscoveryJob.create({
        companyId: company._id,
        sourceId: samSource._id,
        connectorType: 'sam_gov',
        trigger: 'scheduled',
        status: 'completed',
        scheduledAt: daysFromNow(-1),
        startedAt: daysFromNow(-1),
        completedAt: daysFromNow(-1),
        stats: { discovered: 22, imported: 22, duplicates: 1, failed: 0 },
        createdBy: owner._id
      });
    }

    if (govwinSource) {
      govwinJob = await TenderDiscoveryJob.create({
        companyId: company._id,
        sourceId: govwinSource._id,
        connectorType: 'govwin',
        trigger: 'scheduled',
        status: 'completed',
        scheduledAt: daysFromNow(-0.5),
        startedAt: daysFromNow(-0.5),
        completedAt: daysFromNow(-0.5),
        stats: { discovered: 16, imported: 16, duplicates: 0, failed: 1 },
        createdBy: owner._id
      });
    }

    const importBatches = [];
    if (samJob) {
      importBatches.push({
        companyId: company._id,
        jobId: samJob._id,
        connectorType: 'sam_gov',
        status: 'completed',
        recordsProcessed: 22,
        recordsImported: 22,
        duplicatesSkipped: 0,
        failures: 0,
        completedAt: daysFromNow(-1)
      });
    }
    if (govwinJob) {
      importBatches.push({
        companyId: company._id,
        jobId: govwinJob._id,
        connectorType: 'govwin',
        status: 'completed',
        recordsProcessed: 16,
        recordsImported: 16,
        duplicatesSkipped: 0,
        failures: 0,
        completedAt: daysFromNow(-0.5)
      });
    }
    if (importBatches.length) {
      await TenderImportBatch.insertMany(importBatches);
    }

    let emailJob = null;
    if (emailSource) {
      emailJob = await TenderDiscoveryJob.create({
        companyId: company._id,
        sourceId: emailSource._id,
        connectorType: 'email',
        trigger: 'scheduled',
        status: 'completed',
        scheduledAt: daysFromNow(-0.2),
        startedAt: daysFromNow(-0.2),
        completedAt: daysFromNow(-0.2),
        stats: { discovered: 7, imported: 7, duplicates: 0, failed: 0 },
        createdBy: owner._id
      });
    }

    const discoveryLogs = [];
    if (samJob) {
      discoveryLogs.push({
        companyId: company._id,
        jobId: samJob._id,
        level: 'info',
        message: 'SAM.gov sync imported 22 life sciences opportunities'
      });
    }
    if (govwinJob) {
      discoveryLogs.push({
        companyId: company._id,
        jobId: govwinJob._id,
        level: 'info',
        message: 'GovWin sync imported 16 curated federal and SLED opportunities'
      });
    }
    if (emailJob) {
      discoveryLogs.push({
        companyId: company._id,
        jobId: emailJob._id,
        level: 'info',
        message: 'Email inbox ingestion imported 7 forwarded RFP packages'
      });
    }
    if (discoveryLogs.length) {
      await TenderDiscoveryLog.insertMany(discoveryLogs);
    }

    const featuredTenders = tenders.slice(0, 18);
    for (let docIndex = 0; docIndex < featuredTenders.length; docIndex += 1) {
      const tender = featuredTenders[docIndex];
      const document = await Document.create({
        companyId: company._id,
        name: `Solicitation package - ${tender.reference}`,
        type: 'TENDER_DOCUMENT',
        storage: {
          filename: `${tender.reference}.pdf`,
          originalName: `${tender.reference}.pdf`,
          mimeType: 'application/pdf',
          size: 1843200
        },
        tenderRecord: { isCreated: true, tenderId: tender._id, createdAt: new Date() },
        status: 'EXTRACTED',
        uploadedBy: owner._id,
        aiExtraction: {
          isProcessed: true,
          processedAt: new Date(),
          confidence: 86,
          summary: `Extracted procurement requirements for ${tender.title}.`,
          extractedData: {
            tenderTitle: tender.title,
            organization: tender.organization,
            estimatedValue: { amount: tender.estimatedValue, currency: tender.currency },
            deadline: tender.deadline,
            location: tender.location,
            description: tender.description
          }
        }
      });

      const extraction = await DocumentExtraction.create({
        companyId: company._id,
        documentId: document._id,
        tenderId: tender._id,
        status: 'completed',
        pipeline: 'metadata',
        startedAt: daysFromNow(-2),
        completedAt: daysFromNow(-2)
      });

      await ExtractionResult.insertMany(
        EXTRACTION_FIELD_LIBRARY.map((field, fieldIndex) => ({
          companyId: company._id,
          extractionId: extraction._id,
          fieldKey: field.fieldKey,
          fieldValue:
            field.fieldKey === 'contacts'
              ? ['procurement@agency.gov', 'contracts.officer@agency.gov']
              : field.fieldKey === 'pricing'
                ? { unitPrice: 12500, currency: 'USD', basis: 'per instrument' }
                : field.fieldKey === 'quantities'
                  ? { instruments: 24 + fieldIndex, serviceYears: 5 }
                  : field.fieldKey === 'delivery_timeline'
                    ? 'Installation within 120 days of award; validation within 45 days.'
                    : `${field.label} extracted for ${tender.organization}.`,
          confidence: 68 + ((docIndex + fieldIndex) % 28),
          validated: (docIndex + fieldIndex) % 3 === 0
        }))
      );

      await ClauseExtraction.insertMany(
        CLAUSE_LIBRARY.slice(0, 4 + (docIndex % 3)).map((clause, clauseIndex) => ({
          companyId: company._id,
          extractionId: extraction._id,
          clauseType: clause.clauseType,
          text: clause.text,
          riskLevel: clause.riskLevel,
          confidence: 64 + ((docIndex + clauseIndex) % 30)
        }))
      );
    }

    const reviewTenders = tenders.slice(0, 20);
    for (let index = 0; index < reviewTenders.length; index += 1) {
      const tender = reviewTenders[index];
      const aiRecommendation = index % 4 === 0 ? 'go' : index % 4 === 1 ? 'conditional_go' : index % 4 === 2 ? 'defer' : 'no_go';
      const recommendation = index % 5 === 0 ? 'go' : index % 5 === 1 ? 'conditional_go' : index % 5 === 2 ? 'defer' : index % 5 === 3 ? 'no_go' : 'defer';
      const review = await GoNoGoReview.create({
        companyId: company._id,
        tenderId: tender._id,
        status: index < 8 ? 'in_review' : index < 14 ? 'approved' : 'draft',
        recommendation,
        aiRecommendation,
        summary: `Executive pursuit review for ${tender.reference} with ${tender.tags?.[0] || 'life sciences'} strategic fit.`,
        createdBy: owner._id
      });

      await DecisionHistory.insertMany([
        {
          companyId: company._id,
          reviewId: review._id,
          actorId: owner._id,
          action: 'submitted',
          comment: 'Initial pursuit review submitted for committee.',
          decision: recommendation
        },
        {
          companyId: company._id,
          reviewId: review._id,
          actorId: reviewer?._id || owner._id,
          action: 'commented',
          comment:
            aiRecommendation === 'conditional_go'
              ? 'AI recommends conditional go pending insurance clause review.'
              : 'AI recommendation aligns with strategic account coverage.',
          decision: aiRecommendation
        },
        {
          companyId: company._id,
          reviewId: review._id,
          actorId: approver?._id || owner._id,
          action: index < 8 ? 'commented' : 'approved',
          comment:
            index < 8
              ? 'Awaiting final commercial review and delivery risk validation.'
              : 'Approved for proposal development.',
          decision: recommendation
        }
      ]);
    }

    const automationJobRows = [];
    if (samSource) {
      automationJobRows.push({
        companyId: company._id,
        jobType: 'discovery_sync',
        status: 'completed',
        payload: { sourceId: samSource._id },
        attempts: 1,
        scheduledAt: daysFromNow(-1),
        startedAt: daysFromNow(-1),
        completedAt: daysFromNow(-1)
      });
    }

    const automationJobs = await AutomationJob.insertMany([
      ...automationJobRows,
      {
        companyId: company._id,
        jobType: 'scoring_refresh',
        status: 'completed',
        payload: { profileId: profile._id },
        attempts: 1,
        scheduledAt: daysFromNow(-0.5),
        startedAt: daysFromNow(-0.5),
        completedAt: daysFromNow(-0.5)
      },
      {
        companyId: company._id,
        jobType: 'document_extraction',
        status: 'retrying',
        payload: { tenderId: tenders[0]._id },
        attempts: 1,
        maxAttempts: 3,
        scheduledAt: daysFromNow(0),
        errorMessage: 'Source mailbox not configured'
      }
    ]);

    await AutomationLog.insertMany(
      automationJobs.map((job) => ({
        companyId: company._id,
        jobId: job._id,
        level: job.status === 'completed' ? 'info' : 'warn',
        message:
          job.status === 'completed'
            ? `${job.jobType} completed successfully`
            : `${job.jobType} waiting for connector configuration`
      }))
    );

    await AutomationFailure.create({
      companyId: company._id,
      jobId: automationJobs[2]._id,
      errorMessage: 'Email ingestion connector is not configured',
      retryable: true
    });

    const catalogKeys = ['sam_gov', 'govwin', 'generic_api', 'web_scrape', 'email', 'manual'];
    const connectors = await IntegrationConnector.insertMany(
      catalogKeys.map((key) => ({
        companyId: company._id,
        key,
        displayName: key.replace(/_/g, ' '),
        category: 'discovery',
        status: 'active',
        health: 'healthy',
        config: { configured: true },
        lastCheckedAt: new Date()
      }))
    );

    await ApiCredential.create({
      companyId: company._id,
      connectorId: connectors[0]._id,
      name: 'SAM.gov API key',
      provider: 'sam_gov',
      metadata: { configured: false, note: 'Not configured' }
    });

    console.log(`🧠 Intelligence demo seeded for ${company.name}`);
  }
}

if (require.main === module) {
  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  const path = require('path');

  dotenv.config({ path: path.join(__dirname, '../../../.env') });
  require('../../models');

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => seedIntelligenceDemo())
    .then(() => mongoose.disconnect())
    .then(() => {
      console.log('✅ Intelligence demo seed complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Intelligence demo seed failed:', error);
      process.exit(1);
    });
}

module.exports = seedIntelligenceDemo;
