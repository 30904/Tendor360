const RfpResponse = require('../models/RfpResponse');
const Tender = require('../models/Tender');
const Evaluation = require('../models/Evaluation');
const Pricing = require('../models/Pricing');
const rfpCopilotService = require('../ai/services/rfpCopilotService');
const { catchAsync } = require('../utils/errorHandler');

// ─── CRUD ─────────────────────────────────────────────────────────

exports.listRfpResponses = catchAsync(async (req, res) => {
  const responses = await RfpResponse.find({ companyId: req.companyId })
    .populate('tenderId', 'title organization referenceNumber estimatedValue deadline category')
    .populate('metadata.createdBy', 'name email')
    .sort('-createdAt');

  res.json({
    success: true,
    data: { rfpResponses: responses },
    message: 'RFP responses retrieved successfully'
  });
});

exports.getRfpResponse = catchAsync(async (req, res) => {
  const response = await RfpResponse.findOne({
    _id: req.params.id,
    companyId: req.companyId
  })
    .populate('tenderId', 'title organization referenceNumber estimatedValue deadline category description requirements location')
    .populate('metadata.createdBy', 'name email')
    .populate('sections.reviewedBy', 'name email');

  if (!response) {
    return res.status(404).json({ success: false, message: 'RFP Response not found' });
  }

  res.json({
    success: true,
    data: { rfpResponse: response },
    message: 'RFP response retrieved successfully'
  });
});

exports.createRfpResponse = catchAsync(async (req, res) => {
  const { tenderId, evaluationId, pricingId, projectName, rfpNumber, submissionDeadline } = req.body;

  // Validate tender exists and belongs to company
  const tender = await Tender.findOne({ _id: tenderId, companyId: req.companyId });
  if (!tender) {
    return res.status(404).json({ success: false, message: 'Tender not found' });
  }

  // Check for duplicate
  const existing = await RfpResponse.findOne({ tenderId, companyId: req.companyId });
  if (existing) {
    return res.status(409).json({ success: false, message: 'An RFP response already exists for this tender' });
  }

  // Define default sections
  const defaultSections = [
    { title: 'Executive Summary', type: 'EXECUTIVE_SUMMARY', order: 1, status: 'PENDING' },
    { title: 'Technical Approach', type: 'TECHNICAL_APPROACH', order: 2, status: 'PENDING' },
    { title: 'Methodology & Approach', type: 'METHODOLOGY', order: 3, status: 'PENDING' },
    { title: 'Team Qualifications', type: 'TEAM_QUALIFICATIONS', order: 4, status: 'PENDING' },
    { title: 'Past Performance', type: 'PAST_PERFORMANCE', order: 5, status: 'PENDING' },
    { title: 'Compliance Matrix', type: 'COMPLIANCE_MATRIX', order: 6, status: 'PENDING' },
    { title: 'Pricing Summary', type: 'PRICING_SUMMARY', order: 7, status: 'PENDING' },
    { title: 'Risk Mitigation', type: 'RISK_MITIGATION', order: 8, status: 'PENDING' }
  ];

  const rfpResponse = await RfpResponse.create({
    tenderId,
    companyId: req.companyId,
    evaluationId: evaluationId || null,
    pricingId: pricingId || null,
    metadata: {
      projectName: projectName || tender.title,
      rfpNumber: rfpNumber || tender.referenceNumber || '',
      submissionDeadline: submissionDeadline || tender.deadline,
      status: 'DRAFT',
      createdBy: req.user.id
    },
    sections: defaultSections
  });

  const populated = await RfpResponse.findById(rfpResponse._id)
    .populate('tenderId', 'title organization referenceNumber estimatedValue deadline category')
    .populate('metadata.createdBy', 'name email');

  res.status(201).json({
    success: true,
    data: { rfpResponse: populated },
    message: 'RFP response project created with 8 default sections'
  });
});

exports.updateRfpResponse = catchAsync(async (req, res) => {
  const rfpResponse = await RfpResponse.findOne({
    _id: req.params.id,
    companyId: req.companyId
  });

  if (!rfpResponse) {
    return res.status(404).json({ success: false, message: 'RFP Response not found' });
  }

  const allowed = ['projectName', 'rfpNumber', 'submissionDeadline'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      rfpResponse.metadata[key] = req.body[key];
    }
  }
  if (req.body.status) {
    rfpResponse.metadata.status = req.body.status;
  }

  await rfpResponse.save();

  res.json({
    success: true,
    data: { rfpResponse },
    message: 'RFP response updated successfully'
  });
});

exports.deleteRfpResponse = catchAsync(async (req, res) => {
  const rfpResponse = await RfpResponse.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId },
    { isDeleted: true },
    { new: true }
  );

  if (!rfpResponse) {
    return res.status(404).json({ success: false, message: 'RFP Response not found' });
  }

  res.json({ success: true, data: null, message: 'RFP response deleted successfully' });
});

// ─── Phase 1: Extract Requirements ────────────────────────────────

exports.extractRequirements = catchAsync(async (req, res) => {
  const rfpResponse = await RfpResponse.findOne({
    _id: req.params.id,
    companyId: req.companyId
  }).populate('tenderId');

  if (!rfpResponse) {
    return res.status(404).json({ success: false, message: 'RFP Response not found' });
  }

  const tender = rfpResponse.tenderId;
  if (!tender) {
    return res.status(400).json({ success: false, message: 'Linked tender not found' });
  }

  const tenderData = {
    title: tender.title,
    organization: tender.organization,
    category: tender.category,
    estimatedValue: tender.estimatedValue,
    deadline: tender.deadline,
    location: tender.location,
    description: tender.description || '',
    requirements: tender.requirements || []
  };

  const result = await rfpCopilotService.extractRequirements(tenderData);

  rfpResponse.extractedRequirements = result.requirements;
  rfpResponse.metadata.status = 'IN_PROGRESS';
  await rfpResponse.save();

  res.json({
    success: true,
    data: {
      requirements: result.requirements,
      summary: result.summary,
      aiMetadata: result.aiMetadata,
      count: result.requirements.length
    },
    message: `Extracted ${result.requirements.length} requirements from tender`
  });
});

// ─── Phase 2: Generate Section ────────────────────────────────────

exports.generateSection = catchAsync(async (req, res) => {
  const { sectionType } = req.params;
  const rfpResponse = await RfpResponse.findOne({
    _id: req.params.id,
    companyId: req.companyId
  }).populate('tenderId');

  if (!rfpResponse) {
    return res.status(404).json({ success: false, message: 'RFP Response not found' });
  }

  // Build context for the LLM
  const tender = rfpResponse.tenderId;
  let pricingContext = 'No pricing data available.';
  if (rfpResponse.pricingId) {
    const pricing = await Pricing.findById(rfpResponse.pricingId);
    if (pricing) {
      pricingContext = `Total Cost: $${pricing.totals?.cost || 0}, Total Price: $${pricing.totals?.price || 0}, Margin: ${pricing.totals?.marginPercentage?.toFixed(1) || 0}%, Win Probability: ${pricing.winProbability || 0}%`;
      if (pricing.items?.length) {
        pricingContext += `\nLine Items: ${pricing.items.map(i => `${i.name}: cost=$${i.cost}, price=$${i.price}`).join('; ')}`;
      }
    }
  }

  const context = {
    tenderTitle: tender?.title || 'Unknown',
    organization: tender?.organization || 'Unknown',
    estimatedValue: tender?.estimatedValue || 'Not specified',
    category: tender?.category || 'General',
    deadline: tender?.deadline || 'Not specified',
    requirements: rfpResponse.extractedRequirements || [],
    companyContext: 'Content Library integration coming soon. Using general company capabilities for now.',
    pricingContext,
    groundingSources: []
  };

  // Mark section as generating
  const sectionIndex = rfpResponse.sections.findIndex(s => s.type === sectionType);
  if (sectionIndex === -1) {
    return res.status(404).json({ success: false, message: `Section type "${sectionType}" not found in this response project` });
  }
  rfpResponse.sections[sectionIndex].status = 'GENERATING';
  await rfpResponse.save();

  try {
    const generated = await rfpCopilotService.generateSection(sectionType, context);

    // Update section with generated content
    rfpResponse.sections[sectionIndex].title = generated.title;
    rfpResponse.sections[sectionIndex].content = generated.content;
    rfpResponse.sections[sectionIndex].status = generated.status;
    rfpResponse.sections[sectionIndex].wordCount = generated.wordCount;
    rfpResponse.sections[sectionIndex].aiMetadata = generated.aiMetadata;

    // Mark addressed requirements
    if (generated.addressedRequirements?.length) {
      for (const req of rfpResponse.extractedRequirements) {
        if (generated.addressedRequirements.some(ar =>
          req.requirement.toLowerCase().includes(ar.toLowerCase()) ||
          ar.toLowerCase().includes(req.requirement.toLowerCase())
        )) {
          req.addressed = true;
          req.addressedBySectionId = rfpResponse.sections[sectionIndex]._id.toString();
        }
      }
    }

    await rfpResponse.save();

    res.json({
      success: true,
      data: {
        section: rfpResponse.sections[sectionIndex],
        aiMetadata: generated.aiMetadata
      },
      message: `Section "${generated.title}" generated with ${generated.aiMetadata.confidenceScore}% confidence`
    });
  } catch (error) {
    // Reset section status on failure
    rfpResponse.sections[sectionIndex].status = 'PENDING';
    await rfpResponse.save();
    throw error;
  }
});

// ─── Generate All Sections ────────────────────────────────────────

exports.generateAllSections = catchAsync(async (req, res) => {
  const rfpResponse = await RfpResponse.findOne({
    _id: req.params.id,
    companyId: req.companyId
  }).populate('tenderId');

  if (!rfpResponse) {
    return res.status(404).json({ success: false, message: 'RFP Response not found' });
  }

  // Auto-extract requirements if not done yet
  if (!rfpResponse.extractedRequirements?.length) {
    const tender = rfpResponse.tenderId;
    const tenderData = {
      title: tender?.title, organization: tender?.organization,
      category: tender?.category, estimatedValue: tender?.estimatedValue,
      deadline: tender?.deadline, location: tender?.location,
      description: tender?.description || '', requirements: tender?.requirements || []
    };
    const extractResult = await rfpCopilotService.extractRequirements(tenderData);
    rfpResponse.extractedRequirements = extractResult.requirements;
    await rfpResponse.save();
  }

  const results = [];
  const errors = [];

  // Generate each pending section sequentially to avoid rate limits
  for (const section of rfpResponse.sections) {
    if (section.status === 'APPROVED' || section.status === 'MANUALLY_WRITTEN') {
      results.push({ type: section.type, status: 'SKIPPED', reason: 'Already approved' });
      continue;
    }

    try {
      // Build fresh context for each section
      const tender = rfpResponse.tenderId;
      let pricingContext = 'No pricing data available.';
      if (rfpResponse.pricingId) {
        const pricing = await Pricing.findById(rfpResponse.pricingId);
        if (pricing) {
          pricingContext = `Total Cost: $${pricing.totals?.cost || 0}, Total Price: $${pricing.totals?.price || 0}, Margin: ${pricing.totals?.marginPercentage?.toFixed(1) || 0}%`;
        }
      }

      const context = {
        tenderTitle: tender?.title || 'Unknown',
        organization: tender?.organization || 'Unknown',
        estimatedValue: tender?.estimatedValue || 'Not specified',
        category: tender?.category || 'General',
        deadline: tender?.deadline || 'Not specified',
        requirements: rfpResponse.extractedRequirements || [],
        companyContext: 'Content Library integration coming soon.',
        pricingContext,
        groundingSources: []
      };

      const generated = await rfpCopilotService.generateSection(section.type, context);

      section.title = generated.title;
      section.content = generated.content;
      section.status = generated.status;
      section.wordCount = generated.wordCount;
      section.aiMetadata = generated.aiMetadata;

      results.push({
        type: section.type,
        status: 'GENERATED',
        confidence: generated.aiMetadata.confidenceScore
      });
    } catch (err) {
      section.status = 'PENDING';
      errors.push({ type: section.type, error: err.message });
      results.push({ type: section.type, status: 'FAILED', error: err.message });
    }
  }

  rfpResponse.metadata.status = 'IN_PROGRESS';
  await rfpResponse.save();

  res.json({
    success: true,
    data: {
      rfpResponse,
      generationResults: results,
      errors,
      generated: results.filter(r => r.status === 'GENERATED').length,
      failed: errors.length,
      skipped: results.filter(r => r.status === 'SKIPPED').length
    },
    message: `Generated ${results.filter(r => r.status === 'GENERATED').length} sections. ${errors.length} failed.`
  });
});

// ─── Update Section Content ───────────────────────────────────────

exports.updateSection = catchAsync(async (req, res) => {
  const { sectionId } = req.params;
  const { content, title } = req.body;

  const rfpResponse = await RfpResponse.findOne({
    _id: req.params.id,
    companyId: req.companyId
  });

  if (!rfpResponse) {
    return res.status(404).json({ success: false, message: 'RFP Response not found' });
  }

  const section = rfpResponse.sections.id(sectionId);
  if (!section) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }

  if (content !== undefined) {
    section.content = content;
    section.wordCount = content.split(/\s+/).length;
    section.status = 'MANUALLY_WRITTEN';
  }
  if (title !== undefined) {
    section.title = title;
  }

  await rfpResponse.save();

  res.json({
    success: true,
    data: { section },
    message: 'Section updated successfully'
  });
});

// ─── Approve Section ──────────────────────────────────────────────

exports.approveSection = catchAsync(async (req, res) => {
  const { sectionId } = req.params;
  const { comments } = req.body;

  const rfpResponse = await RfpResponse.findOne({
    _id: req.params.id,
    companyId: req.companyId
  });

  if (!rfpResponse) {
    return res.status(404).json({ success: false, message: 'RFP Response not found' });
  }

  const section = rfpResponse.sections.id(sectionId);
  if (!section) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }

  if (!section.content || section.content.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'Cannot approve an empty section' });
  }

  section.status = 'APPROVED';
  section.reviewedBy = req.user.id;
  section.reviewedAt = new Date();
  section.reviewComments = comments || '';

  await rfpResponse.save();

  res.json({
    success: true,
    data: { section },
    message: 'Section approved successfully'
  });
});

// ─── Phase 3: Validate (Compliance Audit) ─────────────────────────

exports.validateResponse = catchAsync(async (req, res) => {
  const rfpResponse = await RfpResponse.findOne({
    _id: req.params.id,
    companyId: req.companyId
  });

  if (!rfpResponse) {
    return res.status(404).json({ success: false, message: 'RFP Response not found' });
  }

  const audit = rfpCopilotService.runComplianceAudit(
    rfpResponse.sections,
    rfpResponse.extractedRequirements
  );

  rfpResponse.complianceAudit = audit;
  await rfpResponse.save();

  res.json({
    success: true,
    data: { complianceAudit: audit },
    message: `Compliance audit complete: ${audit.coveragePercentage}% coverage`
  });
});

// ─── Final Submission ─────────────────────────────────────────────

exports.submitResponse = catchAsync(async (req, res) => {
  const rfpResponse = await RfpResponse.findOne({
    _id: req.params.id,
    companyId: req.companyId
  });

  if (!rfpResponse) {
    return res.status(404).json({ success: false, message: 'RFP Response not found' });
  }

  // Check all required sections are approved
  const unapproved = rfpResponse.sections.filter(s =>
    s.status !== 'APPROVED' && s.status !== 'MANUALLY_WRITTEN'
  );

  if (unapproved.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot submit: ${unapproved.length} sections are not yet approved`,
      data: {
        unapprovedSections: unapproved.map(s => ({ type: s.type, title: s.title, status: s.status }))
      }
    });
  }

  rfpResponse.metadata.status = 'SUBMITTED';
  rfpResponse.metadata.approvedBy = req.user.id;
  rfpResponse.metadata.approvedAt = new Date();
  await rfpResponse.save();

  res.json({
    success: true,
    data: { rfpResponse },
    message: 'RFP response submitted successfully'
  });
});
