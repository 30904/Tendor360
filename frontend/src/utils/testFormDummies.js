/** Realistic sample payloads for QA (Alt+F1 test fill). */

export function isoDateDaysFromNow(days) {
  const d = new Date()
  d.setDate(d.getDate() + Number(days || 0))
  return d.toISOString().slice(0, 10)
}

export function dummyPipelineTenderForm() {
  return {
    reference: 'RFQ-2026-1847',
    title: 'Sterile injectables line upgrade — isolator & filling equipment',
    organization: 'National Health Procurement Agency',
    location: 'Hyderabad, Telangana, India',
    description:
      'Design, supply, install, and qualify an aseptic filling line including restricted access barrier (RABs), VHP cycle development, and CSV package aligned to EU GMP Annex 1.',
    estimatedValue: 12800000,
    currency: 'INR',
    deadline: isoDateDaysFromNow(45),
    tenderType: 'Government RFP',
    therapeuticArea: 'Cardiovascular',
    source: 'Central Public Procurement Portal — eProcure',
    tags: ['aseptic', 'isolator', 'CSV', 'Annex1'],
    urgency: 'high',
    priority: 'high',
    pipelineStage: 'evaluating',
    winProbability: 62
  }
}

export function dummyPrequalCustomerForm() {
  return {
    name: 'Karnataka State Medical Supplies Corporation Ltd.',
    email: 'tenders.procurement@kmscl.karnataka.gov.in',
    phone: '+91-80-2227-6400',
    address: 'MS Building, Dr. B.R. Ambedkar Veedhi, Bengaluru 560001',
    industry: 'Healthcare',
    size: 'Large',
    status: 'Active'
  }
}

export function dummyTenderSourceFormData() {
  return {
    name: 'GEM — Government e-Marketplace (Services)',
    description:
      'Centralized public procurement portal for goods and services; monitor healthcare and infrastructure verticals.',
    type: 'Government',
    url: 'https://gem.gov.in',
    priority: 'high',
    reliability: 'high',
    frequency: 'daily'
  }
}

export function dummyWatchlistFormData() {
  return {
    name: 'Cold chain & vaccine logistics — India public sector',
    description:
      'Track tenders mentioning cold chain, vaccine storage, and WHO PQS equipment across state health departments.',
    priority: 'high',
    frequency: 'every_4_hours',
    keywordsText: 'cold chain, vaccine, WHO PQS, ice-lined refrigerator, ULR',
    categoriesText: 'Healthcare, Logistics, Cold chain',
    regionsText: 'IN, KA, MH, TN',
    minValue: 2500000,
    maxValue: 750000000,
    currency: 'INR',
    daysAhead: 45,
    daysBehind: 14
  }
}

export function dummyCompetitorForm() {
  return {
    name: 'Vertex Pharma Infrastructure Pvt. Ltd.',
    description:
      'EPC and validation partner for sterile manufacturing and OSD facilities; strong in India and MENA.',
    website: 'https://www.example-vertexinfra.com',
    industry: 'Pharmaceutical engineering',
    size: 'Large',
    location: {
      country: 'India',
      region: 'Gujarat',
      city: 'Ahmedabad'
    },
    contactInfo: {
      email: 'bd@example-vertexinfra.com',
      phone: '+91-79-4000-2200',
      address: 'Plot 12, Changodar GIDC, Ahmedabad 382213'
    },
    financialInfo: {
      revenue: '420',
      currency: 'USD',
      employees: '1850',
      foundedYear: '1998'
    },
    capabilities: [
      { category: 'EPC', description: 'Turnkey sterile plant delivery', strength: 'Strong' },
      { category: 'Validation', description: 'CQV and computer system validation', strength: 'Strong' }
    ],
    marketPosition: 'Leader',
    threatLevel: 'High',
    strengths: ['Integrated EPC + CQV', 'Strong regulator relationships', 'Large installed base in vaccines'],
    weaknesses: ['Premium pricing', 'Long mobilization for greenfield'],
    opportunities: ['Public sector hospital capex wave', 'Biologics capacity expansion'],
    threats: ['Price-led local contractors', 'Long payment cycles on government contracts'],
    tags: ['EPC', 'sterile', 'India', 'vaccines']
  }
}

export function dummyMarketDeclarationForm() {
  return {
    title: 'FY26 — Sanctions & export control attestation (India operations)',
    description:
      'Annual declaration covering trade sanctions screening, dual-use export controls, and restricted party monitoring for all active pursuits.',
    type: 'Sanctions Compliance',
    category: 'Regulatory',
    priority: 'High',
    jurisdiction: 'India + United States (parent listing)',
    regulatoryBody: 'OFAC / DGFT — as applicable to contract scope',
    expiryDate: isoDateDaysFromNow(365),
    complianceRequirements: ['Daily RPS screening', 'Restricted country policy'],
    stakeholders: ['Chief Compliance Officer', 'Legal — Trade'],
    tags: ['sanctions', 'export control', 'FY26']
  }
}

export function dummyMarketCertificateForm() {
  return {
    certificateNumber: 'ISO-9001-2026-009812',
    name: 'ISO 9001:2015 — Quality management (Corporate)',
    description: 'Multi-site certificate covering engineering, procurement, and project delivery.',
    type: 'ISO 9001',
    category: 'Quality Management',
    issuingBody: 'Bureau Veritas Certification',
    scope: 'Design, engineering, procurement, construction, and commissioning of pharmaceutical facilities',
    issueDate: isoDateDaysFromNow(-120),
    expiryDate: isoDateDaysFromNow(600),
    renewalRequired: true,
    renewalFrequency: 'Annually',
    cost: { amount: '18500', currency: 'USD' },
    requirements: ['Stage 1 surveillance', 'Management review records'],
    tags: ['ISO9001', 'QMS', 'multi-site']
  }
}

export function dummyMarketVendorForm() {
  return {
    vendorId: 'VND-2026-004421',
    companyName: 'CryoLink Cold Chain Logistics',
    legalName: 'CryoLink Cold Chain Logistics Private Limited',
    businessType: 'Corporation',
    industry: 'Healthcare logistics',
    category: 'Services Supplier',
    contactInformation: {
      primaryContact: {
        name: 'Ananya Desai',
        title: 'Key Account Director',
        email: 'ananya.desai@example-cryolink.in',
        phone: '+91-22-6600-7711'
      },
      address: {
        street: 'Tower A, Mindspace Airoli',
        city: 'Navi Mumbai',
        state: 'Maharashtra',
        postalCode: '400708',
        country: 'India'
      }
    },
    businessInformation: {
      registrationNumber: 'U63040MH2011PTC220044',
      taxId: '27AABCC1234D1Z5',
      website: 'https://www.example-cryolink.in',
      establishedYear: '2011',
      numberOfEmployees: { min: '500', max: '1200' }
    },
    capabilities: ['GDP-compliant transport', 'Real-time temperature monitoring', 'Redressal SOP'],
    complianceRequirements: ['GDP', 'TSA screening where applicable'],
    tags: ['cold chain', 'GDP', 'India']
  }
}

export function dummyRoleForm() {
  return {
    name: 'QA — Tender pursuit reviewer',
    description: 'Reviews pipeline tenders, bid/no-bid checkpoints, and compliance gates before submission.',
    permissions: ['ALL'],
    isActive: true,
    priority: 400
  }
}

export function dummyUserDomFormValues() {
  return {
    firstName: 'Jordan',
    lastName: 'Patel',
    email: 'jordan.patel.qa@example.com',
    department: 'Procurement',
    role: 'TENDER MANAGER',
    status: 'Active',
    position: 'Senior tender manager — public sector',
    phone: '+1-415-555-0198',
    password: 'TestPass123!'
  }
}

export function dummyTemplateForm() {
  return {
    name: 'Technical & commercial response — two-envelope (RFP)',
    description:
      'Master structure for two-envelope submissions with compliance matrix, pricing workbook links, and CV annex.',
    category: 'TECHNICAL',
    type: 'PROPOSAL',
    content:
      '1. Executive summary\n2. Compliance matrix\n3. Technical solution\n4. Project plan & milestones\n5. Commercial schedule (envelope B pointer)\n6. Appendices',
    tags: 'RFP, two-envelope, compliance, pricing',
    isActive: true
  }
}

export function dummyDataRoomForm() {
  return {
    name: 'Data room — NHM oxygen generation PPP (Lot 2)',
    description:
      'Restricted workspace for bidder due diligence: drawings, O&M drafts, performance test protocols, and draft concession agreement.',
    accessLevel: 'CONFIDENTIAL',
    expiryDate: isoDateDaysFromNow(90),
    isActive: true
  }
}

export function dummyScoringEvaluationModelForm() {
  const criteria = [
    { id: 101, name: 'GxP compliance & audit readiness', weight: 25, maxScore: 100 },
    { id: 102, name: 'Commercial pricing & ramp schedule', weight: 25, maxScore: 100 },
    { id: 103, name: 'Tech transfer & line clearance', weight: 20, maxScore: 100 },
    { id: 104, name: 'Supply resilience / dual sourcing', weight: 15, maxScore: 100 },
    { id: 105, name: 'Digital batch records integration', weight: 15, maxScore: 100 }
  ]
  const weights = {}
  criteria.forEach((c) => {
    weights[c.name] = c.weight
  })
  return {
    name: 'Biologics sterile fill-finish — weighted scorecard',
    description: 'Commercial + technical gate for fill-finish pursuits in regulated markets.',
    criteria,
    weights,
    passingScore: 72,
    isActive: true
  }
}

export function dummyClarificationReply() {
  return (
    'Thank you for the question. Please find the following clarifications:\n\n' +
    '1) The employer will accept alternate brands listed in the tender data sheet provided equivalence is demonstrated with test certificates dated within 24 months.\n' +
    '2) Site visit attendance is mandatory; proxies are not permitted.\n' +
    '3) Liquidated damages will be calculated per the formula in clause 12.4 of the draft contract.\n\n' +
    'This response is issued without prejudice to the terms of the RFP.'
  )
}

export function dummyComplianceReportPrefill() {
  return {
    name: 'Q1 2026 — Tender compliance & audit readiness summary',
    type: 'Compliance',
    description:
      'Quarterly report covering evaluation model usage, redaction rule hits, and outstanding clarifications for active pursuits.',
    status: 'In Progress',
    complianceScore: 88
  }
}

export function dummyCpqImportPrefill() {
  return {
    name: 'CPQ import — oncology tender price book v3.2',
    source: 'Salesforce CPQ',
    description: 'Bundle SKUs, optional modules, and country-specific tax flags for EU5 + India.',
    connectionString: 'https://example.my.salesforce.com/services/data/v59.0/sobjects/SBQQ__Quote__c',
    schedule: 'weekly',
    aiOptimized: true
  }
}

export function dummySlaKpiPrefill(isSla) {
  if (isSla) {
    return {
      name: 'Incident acknowledgement — P1 business hours',
      contract: 'MSA-2026-4412',
      description: 'Acknowledge severity-1 incidents within 4 business hours; update status every 2 hours until mitigated.',
      target: '4 hours',
      current: '3.5 hours',
      status: 'On Track'
    }
  }
  return {
    name: 'Forecast accuracy — rolling 13-week',
    contract: 'MSA-2026-4412',
    description: 'Weighted MAPE for installed base spare parts demand forecast used for tender pricing.',
    target: '≤ 12%',
    current: '10.8%',
    trend: 'up'
  }
}

export function dummyBidNoBidPrefill() {
  return {
    tenderTitle: 'Regional hospital HVAC & BMS modernization',
    client: 'State Health Engineering Department',
    value: 18500000,
    decision: 'Bid',
    riskLevel: 'Medium',
    confidence: 78,
    status: 'Pending',
    rationale:
      'Strong references in similar climate zones; margin adequate at 9.2% loaded cost. Key risk is long-lead chillers — mitigated via nominated supplier clause already accepted on prior framework.'
  }
}

export function dummyProfilingCompetitorPrefill() {
  return {
    name: 'Nordic Rail Electrification AB',
    industry: 'Rail & traction power',
    marketShare: 12.4,
    status: 'Monitoring',
    strength: 'High',
    threat: 'Medium',
    weakness: 'Medium',
    keyStrengths: ['Proven 25 kV OCS packages', 'Strong LCC financing partners', 'Local JV in India'],
    keyWeaknesses: ['Limited after-sales density in tier-3 cities', 'Premium vs Chinese EPCs']
  }
}

export function dummyCertificationTrackingPrefill() {
  return {
    certificationName: 'ISO 45001:2018 — Occupational health and safety',
    certificateNumber: 'ISO-45001-2026-IN-004812',
    issuer: 'TÜV SÜD South Asia',
    category: 'Health & Safety',
    issueDate: isoDateDaysFromNow(-400),
    expiryDate: isoDateDaysFromNow(330),
    renewalCost: 'INR 4,85,000 + taxes',
    assignedTo: 'HSE Programs Office — India region',
    aiMonitoring: true,
    sendExpiryAlerts: true
  }
}

export function dummyEsignPackagePrefill() {
  return {
    name: 'EPC contract package — solar park Phase II',
    dueDate: isoDateDaysFromNow(21),
    description:
      'Execution copies for EPC agreement, performance bank guarantee format, and LD schedule for 250 MW solar park.',
    recipients: 'legal.counterparty@discom.in\nprocurement@discom.in\nepc.signatory@ourco.com',
    documents: 'EPC-Execution-DRAFT-v7.pdf\nPBG-Format.docx\nLD-Schedule.xlsx',
    aiOptimized: true
  }
}

export function dummyRedactionRulePrefill() {
  return {
    name: 'Commercial pricing & bank fee redaction',
    category: 'Financial',
    description: 'Redacts unit rates, total contract values, and banking fee tables in shared data rooms.',
    patterns: ['\\bUSD\\s?[0-9][0-9,]{2,}\\b', 'Total\\s+Contract\\s+Value\\s*[:=]\\s*[0-9,.]+', 'LC\\s+commission\\s*[:=]\\s*[0-9,.]+%'],
    priority: 'High',
    status: 'Active',
    aiEnabled: true
  }
}

export function dummyTenderCreationModalForm() {
  return {
    title: 'Grid-scale battery energy storage — 200 MWh (turnkey)',
    status: 'draft',
    organization: 'Western Regional Load Dispatch Centre',
    location: 'Rajasthan, India',
    description:
      'Turnkey delivery including containers, PCS, EMS integration, fire suppression, and 24-month O&M option with availability guarantees.'
  }
}

export function dummyDocumentUploadForm() {
  return {
    name: 'BoQ-and-technical-schedules.zip',
    type: 'TENDER_DOCUMENT',
    tags: 'BoQ, schedules, civil',
    category: 'Tender response',
    priority: 'HIGH'
  }
}

export function dummyDocumentEditForm() {
  return {
    name: 'Technical proposal — final submission v3.pdf',
    type: 'TENDER_DOCUMENT',
    tags: 'technical, proposal, final',
    category: 'Submission',
    priority: 'HIGH',
    status: 'UPLOADED'
  }
}

export function dummySupportTicketForm() {
  return {
    title: 'Unable to attach >25MB BoQ from document library',
    description:
      'Steps: Open tender T-4412 → Documents → Upload from library → select 31MB zip → spinner then generic error. Browser: Edge 130. Expected: chunked upload or clear limit message.',
    category: 'BUG_REPORT',
    subcategory: 'Document upload',
    priority: 'HIGH',
    tags: ['upload', 'library', 'edge'],
    relatedTenders: [],
    relatedDocuments: []
  }
}

export function dummyEvaluationModalForm() {
  const criteria = [
    { category: 'TECHNICAL', name: 'Technical capability', weight: 25, score: 0, description: 'Solution fit and delivery risk' },
    { category: 'FINANCIAL', name: 'Financial stability', weight: 20, score: 0, description: 'Credit and bonding capacity' },
    { category: 'EXPERIENCE', name: 'Relevant experience', weight: 20, score: 0, description: 'Comparable references' },
    { category: 'CAPACITY', name: 'Resource capacity', weight: 15, score: 0, description: 'PMO and site supervision depth' },
    { category: 'COMPLIANCE', name: 'Regulatory compliance', weight: 10, score: 0, description: 'Permits, HSE, quality systems' },
    { category: 'RISK', name: 'Risk & mitigation', weight: 10, score: 0, description: 'Schedule, FX, and subcontractor risk' }
  ]
  return {
    evaluationName: 'Pre-bid gate — grid battery storage (comprehensive)',
    evaluationType: 'COMPREHENSIVE',
    criteria,
    notes: 'Internal scoring prior to bid committee; not shared with customer.',
    priority: 'HIGH'
  }
}

export function dummyTenderModalForm() {
  return {
    title: 'National immunization cold chain expansion — equipment & services',
    organization: 'Ministry of Health — Central Medical Stores',
    location: 'Pan-India (multi-state rollout)',
    description:
      'Supply, install, and commission WHO PQS-compliant cold rooms, solar direct drive refrigerators, and remote temperature monitoring with 5-year AMC.',
    estimatedValue: '2400000000',
    currency: 'INR',
    deadline: isoDateDaysFromNow(60),
    tenderType: 'Government RFP',
    therapeuticArea: 'Other',
    aiMatchScore: 78,
    status: 'active',
    tags: ['cold chain', 'WHO PQS', 'AMC', 'public health'],
    source: 'eProcure / CPPP aggregated feed',
    requirements: {
      technical: ['PQS certificates', 'Installation SOPs', 'Training for state engineers'],
      financial: ['Performance bank guarantee 10%', 'Payment milestone map'],
      legal: ['Arbitration SIAC rules', 'Data localization for telemetry']
    },
    pipelineStage: 'pursuing',
    priority: 'high',
    winProbability: 55
  }
}

export function dummyEvaluationMatrixPatch(base) {
  const b = base || {}
  return {
    tenderTitle: 'National grid SCADA refresh — Lot 2 (substations)',
    organization: 'Powergrid Corporation of India Ltd.',
    evaluator: 'Samira Khan (Technical bid manager)',
    status: 'IN_PROGRESS',
    decision: 'BID',
    totalScore: 88,
    weightedScore: 86.2,
    criteria: (b.criteria || []).map((c, i) => ({
      ...c,
      score: typeof c.score === 'number' && c.score > 0 ? c.score : 7 + (i % 3) * 0.5,
      weight: c.weight || 15
    }))
  }
}

/**
 * Set values on a native form (named fields). Dispatches input/change for React controlled parents where needed.
 */
export function applyDomFormValues(formEl, values) {
  if (!formEl || !formEl.elements) return
  Object.entries(values).forEach(([name, value]) => {
    const ctrl = formEl.elements.namedItem(name)
    if (!ctrl) return
    const list = ctrl.length && !ctrl.tagName ? Array.from(ctrl) : [ctrl]
    list.forEach((el) => {
      if (el.type === 'checkbox') {
        el.checked = Boolean(value)
      } else if (el.type === 'radio') {
        el.checked = el.value === String(value)
      } else {
        el.value = value == null ? '' : String(value)
      }
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    })
  })
}
