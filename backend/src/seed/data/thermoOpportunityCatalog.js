const BASE_OPPORTUNITIES = [
  {
    reference: 'SAM-75A60226Q00012',
    title: 'Ultra-Low Temperature Freezer Fleet for CDC Biorepository',
    organization: 'Centers for Disease Control and Prevention',
    location: 'Atlanta, GA',
    description:
      'Procurement of -80C ULT freezers, monitoring systems, and preventive maintenance for national biorepository expansion.',
    estimatedValue: 4200000,
    therapeuticArea: 'Other',
    tenderType: 'Government RFP',
    source: 'SAM.gov',
    connectorType: 'sam_gov',
    urgency: 'high',
    priority: 'high',
    pipelineStage: 'evaluating',
    industry: 'public health'
  },
  {
    reference: 'GW-26-0148-PCR',
    title: 'Clinical Mass Spectrometry Service Contract',
    organization: 'Department of Veterans Affairs',
    location: 'Washington, DC',
    description:
      'Multi-year service contract for LC-MS/MS systems supporting clinical toxicology and proteomics workflows.',
    estimatedValue: 8900000,
    therapeuticArea: 'Oncology',
    tenderType: 'Government RFP',
    source: 'GovWin',
    connectorType: 'govwin',
    urgency: 'medium',
    priority: 'critical',
    pipelineStage: 'pursuing',
    industry: 'government hospitals'
  },
  {
    reference: 'SAM-36C25626Q0123',
    title: 'Laboratory Information Management System Modernization',
    organization: 'VA Medical Center Network',
    location: 'Chicago, IL',
    description:
      'LIMS replacement with validated workflows for sample accessioning, chain-of-custody, and audit reporting.',
    estimatedValue: 3100000,
    therapeuticArea: 'Other',
    tenderType: 'Hospital Tender',
    source: 'SAM.gov',
    connectorType: 'sam_gov',
    urgency: 'medium',
    priority: 'high',
    pipelineStage: 'identified',
    industry: 'healthcare'
  },
  {
    reference: 'GW-26-0192-SEQ',
    title: 'Next-Generation Sequencing Consumables IDIQ',
    organization: 'National Institutes of Health',
    location: 'Bethesda, MD',
    description:
      'Indefinite delivery contract for NGS library prep kits, flow cells, and sequencing reagents.',
    estimatedValue: 12500000,
    therapeuticArea: 'Rare Diseases',
    tenderType: 'Framework Agreement',
    source: 'GovWin',
    connectorType: 'govwin',
    urgency: 'high',
    priority: 'critical',
    pipelineStage: 'evaluating',
    industry: 'research institutions'
  },
  {
    reference: 'SAM-70Z03126Q00045',
    title: 'Cold Chain Packaging for Vaccine Distribution',
    organization: 'Health and Human Services',
    location: 'Rockville, MD',
    description:
      'Qualified shippers, temperature loggers, and lane qualification for 2-8C and frozen distribution lanes.',
    estimatedValue: 5600000,
    therapeuticArea: 'Respiratory',
    tenderType: 'Supply Agreement',
    source: 'SAM.gov',
    connectorType: 'sam_gov',
    urgency: 'critical',
    priority: 'critical',
    pipelineStage: 'pursuing',
    industry: 'public health'
  },
  {
    reference: 'GW-26-0210-ELISA',
    title: 'Immunoassay Analyzer Refresh Program',
    organization: 'State Public Health Laboratory Consortium',
    location: 'Austin, TX',
    description:
      'Replacement of aging ELISA and CLIA analyzers with compliant middleware and training packages.',
    estimatedValue: 2400000,
    therapeuticArea: 'Diabetes',
    tenderType: 'Public Procurement',
    source: 'GovWin',
    connectorType: 'govwin',
    urgency: 'medium',
    priority: 'medium',
    pipelineStage: 'identified',
    industry: 'diagnostics'
  },
  {
    reference: 'SAM-47QSMD26R0008',
    title: 'Cryogenic Sample Storage and Tracking',
    organization: 'National Cancer Institute',
    location: 'Frederick, MD',
    description:
      'Automated cryo storage, barcode tracking, and integration with biobank inventory systems.',
    estimatedValue: 6800000,
    therapeuticArea: 'Oncology',
    tenderType: 'Government RFP',
    source: 'SAM.gov',
    connectorType: 'sam_gov',
    urgency: 'high',
    priority: 'high',
    pipelineStage: 'submitted',
    industry: 'biotech'
  },
  {
    reference: 'GW-26-0233-CC',
    title: 'Cell Culture Media and Supplement Blanket PO',
    organization: 'DoD Medical Research Command',
    location: 'San Antonio, TX',
    description:
      'Annual blanket purchase order for GMP-grade cell culture media, sera, and supplements.',
    estimatedValue: 1900000,
    therapeuticArea: 'Neurology',
    tenderType: 'Supply Agreement',
    source: 'GovWin',
    connectorType: 'govwin',
    urgency: 'low',
    priority: 'medium',
    pipelineStage: 'identified',
    industry: 'defense medical procurement'
  },
  {
    reference: 'SAM-693KA726Q00019',
    title: 'Environmental Monitoring System for GMP Suites',
    organization: 'FDA Laboratory Network',
    location: 'Silver Spring, MD',
    description:
      'Continuous EM for particle counts, differential pressure, and alarm escalation in GMP manufacturing suites.',
    estimatedValue: 3500000,
    therapeuticArea: 'Other',
    tenderType: 'Government RFP',
    source: 'SAM.gov',
    connectorType: 'sam_gov',
    urgency: 'medium',
    priority: 'high',
    pipelineStage: 'evaluating',
    industry: 'laboratory equipment'
  },
  {
    reference: 'GW-26-0251-REF',
    title: 'Reference Standards and Proficiency Testing Materials',
    organization: 'CMS Quality Measurement Program',
    location: 'Baltimore, MD',
    description:
      'Supply of reference materials, calibrators, and PT samples for clinical chemistry and immunoassay programs.',
    estimatedValue: 2700000,
    therapeuticArea: 'Cardiovascular',
    tenderType: 'Public Procurement',
    source: 'GovWin',
    connectorType: 'govwin',
    urgency: 'medium',
    priority: 'medium',
    pipelineStage: 'identified',
    industry: 'diagnostics'
  }
];

const GENERATOR_TEMPLATES = [
  {
    title: 'Automated Liquid Handler Refresh for Core Genomics Lab',
    organization: 'Stanford University School of Medicine',
    location: 'Palo Alto, CA',
    industry: 'universities',
    therapeuticArea: 'Rare Diseases',
    tenderType: 'Public Procurement',
    estimatedValue: 1800000
  },
  {
    title: 'Point-of-Care Molecular Diagnostics Platform',
    organization: 'Johns Hopkins Hospital',
    location: 'Baltimore, MD',
    industry: 'government hospitals',
    therapeuticArea: 'Respiratory',
    tenderType: 'Hospital Tender',
    estimatedValue: 4200000
  },
  {
    title: 'High-Throughput qPCR Reagent Supply Agreement',
    organization: 'Massachusetts General Hospital',
    location: 'Boston, MA',
    industry: 'healthcare',
    therapeuticArea: 'Oncology',
    tenderType: 'Supply Agreement',
    estimatedValue: 2600000
  },
  {
    title: 'Flow Cytometry Analyzer and Service IDIQ',
    organization: 'University of Michigan Medical Center',
    location: 'Ann Arbor, MI',
    industry: 'universities',
    therapeuticArea: 'Oncology',
    tenderType: 'Framework Agreement',
    estimatedValue: 5100000
  },
  {
    title: 'Biological Safety Cabinet Replacement Program',
    organization: 'Walter Reed National Military Medical Center',
    location: 'Bethesda, MD',
    industry: 'defense medical procurement',
    therapeuticArea: 'Other',
    tenderType: 'Government RFP',
    estimatedValue: 2200000
  },
  {
    title: 'Clinical Chemistry Analyzer Fleet Modernization',
    organization: 'Cleveland Clinic',
    location: 'Cleveland, OH',
    industry: 'healthcare',
    therapeuticArea: 'Cardiovascular',
    tenderType: 'Hospital Tender',
    estimatedValue: 3900000
  },
  {
    title: 'Sterile Fill-Finish Monitoring and EM Sensors',
    organization: 'Biogen Manufacturing Alliance',
    location: 'Durham, NC',
    industry: 'biotech',
    therapeuticArea: 'Neurology',
    tenderType: 'Private Tender',
    estimatedValue: 4700000
  },
  {
    title: 'Cryo-Electron Microscopy Support Services',
    organization: 'Scripps Research Institute',
    location: 'La Jolla, CA',
    industry: 'research institutions',
    therapeuticArea: 'Rare Diseases',
    tenderType: 'Public Procurement',
    estimatedValue: 6200000
  },
  {
    title: 'Hospital Blood Gas and Electrolyte Analyzer Refresh',
    organization: 'HCA Healthcare Regional Network',
    location: 'Nashville, TN',
    industry: 'healthcare',
    therapeuticArea: 'Cardiovascular',
    tenderType: 'Hospital Tender',
    estimatedValue: 2800000
  },
  {
    title: 'Public Health Surveillance PCR Consumables',
    organization: 'California Department of Public Health',
    location: 'Sacramento, CA',
    industry: 'public health',
    therapeuticArea: 'Respiratory',
    tenderType: 'Government RFP',
    estimatedValue: 3300000
  },
  {
    title: 'GMP Chromatography Skid and Column Supply',
    organization: 'Pfizer Global Supply Chain',
    location: 'Kalamazoo, MI',
    industry: 'biotech',
    therapeuticArea: 'Other',
    tenderType: 'Supply Agreement',
    estimatedValue: 9800000
  },
  {
    title: 'University Core Facility Mass Spec Maintenance',
    organization: 'University of Wisconsin-Madison',
    location: 'Madison, WI',
    industry: 'universities',
    therapeuticArea: 'Other',
    tenderType: 'Public Procurement',
    estimatedValue: 1500000
  },
  {
    title: 'Defense Medical Logistics Cold Storage Expansion',
    organization: 'Defense Logistics Agency Medical',
    location: 'Philadelphia, PA',
    industry: 'defense medical procurement',
    therapeuticArea: 'Other',
    tenderType: 'Government RFP',
    estimatedValue: 7400000
  },
  {
    title: 'Automated Microbiology Identification Platform',
    organization: 'Mayo Clinic Laboratories',
    location: 'Rochester, MN',
    industry: 'diagnostics',
    therapeuticArea: 'Diabetes',
    tenderType: 'Hospital Tender',
    estimatedValue: 3600000
  },
  {
    title: 'Research-Grade Incubator and CO2 Control Systems',
    organization: 'Broad Institute of MIT and Harvard',
    location: 'Cambridge, MA',
    industry: 'research institutions',
    therapeuticArea: 'Oncology',
    tenderType: 'Public Procurement',
    estimatedValue: 2100000
  },
  {
    title: 'Scientific Instrument Calibration and Metrology Services',
    organization: 'National Institute of Standards and Technology',
    location: 'Gaithersburg, MD',
    industry: 'scientific instruments',
    therapeuticArea: 'Other',
    tenderType: 'Government RFP',
    estimatedValue: 1900000
  },
  {
    title: 'Regional Hospital Laboratory Automation Upgrade',
    organization: 'Intermountain Healthcare',
    location: 'Salt Lake City, UT',
    industry: 'healthcare',
    therapeuticArea: 'Diabetes',
    tenderType: 'Hospital Tender',
    estimatedValue: 4300000
  },
  {
    title: 'Biobank Sample Retrieval Robotics and Software',
    organization: 'UK Biobank US Collaboration Office',
    location: 'New York, NY',
    industry: 'research institutions',
    therapeuticArea: 'Rare Diseases',
    tenderType: 'Framework Agreement',
    estimatedValue: 5500000
  },
  {
    title: 'Veterans Integrated Service Network Lab Consolidation',
    organization: 'VA VISN 16',
    location: 'Houston, TX',
    industry: 'government hospitals',
    therapeuticArea: 'Cardiovascular',
    tenderType: 'Government RFP',
    estimatedValue: 6700000
  },
  {
    title: 'Infectious Disease Surveillance Sequencing Kits',
    organization: 'Texas Department of State Health Services',
    location: 'Austin, TX',
    industry: 'public health',
    therapeuticArea: 'Respiratory',
    tenderType: 'Public Procurement',
    estimatedValue: 2400000
  },
  {
    title: 'Cell Therapy Manufacturing QC Instrumentation',
    organization: 'National Cancer Institute CCR',
    location: 'Frederick, MD',
    industry: 'biotech',
    therapeuticArea: 'Oncology',
    tenderType: 'Government RFP',
    estimatedValue: 8200000
  },
  {
    title: 'University Hospital Toxicology Screening Platform',
    organization: 'University of Washington Medicine',
    location: 'Seattle, WA',
    industry: 'universities',
    therapeuticArea: 'Neurology',
    tenderType: 'Hospital Tender',
    estimatedValue: 2900000
  },
  {
    title: 'Portable Diagnostic Device Field Deployment',
    organization: 'US Army Medical Research and Development Command',
    location: 'Fort Detrick, MD',
    industry: 'defense medical procurement',
    therapeuticArea: 'Other',
    tenderType: 'Government RFP',
    estimatedValue: 4600000
  },
  {
    title: 'Clinical Laboratory Outreach Courier Monitoring',
    organization: 'Quest Diagnostics Public Sector',
    location: 'Secaucus, NJ',
    industry: 'diagnostics',
    therapeuticArea: 'Other',
    tenderType: 'Supply Agreement',
    estimatedValue: 1700000
  },
  {
    title: 'High-Containment Laboratory Freezer Monitoring',
    organization: 'Emory University Biosafety Program',
    location: 'Atlanta, GA',
    industry: 'universities',
    therapeuticArea: 'Other',
    tenderType: 'Public Procurement',
    estimatedValue: 2300000
  },
  {
    title: 'State University Research Core Reagent IDIQ',
    organization: 'Ohio State University Wexner Medical Center',
    location: 'Columbus, OH',
    industry: 'universities',
    therapeuticArea: 'Rare Diseases',
    tenderType: 'Framework Agreement',
    estimatedValue: 3100000
  },
  {
    title: 'Pediatric Hospital Immunoassay Menu Expansion',
    organization: 'Childrens Hospital of Philadelphia',
    location: 'Philadelphia, PA',
    industry: 'healthcare',
    therapeuticArea: 'Rare Diseases',
    tenderType: 'Hospital Tender',
    estimatedValue: 3400000
  },
  {
    title: 'Public Health Reference Lab Automation',
    organization: 'New York State Department of Health Wadsworth Center',
    location: 'Albany, NY',
    industry: 'public health',
    therapeuticArea: 'Respiratory',
    tenderType: 'Government RFP',
    estimatedValue: 4100000
  },
  {
    title: 'GMP Water System Monitoring and Validation',
    organization: 'Moderna Manufacturing Support',
    location: 'Norwood, MA',
    industry: 'biotech',
    therapeuticArea: 'Other',
    tenderType: 'Private Tender',
    estimatedValue: 5200000
  },
  {
    title: 'Cryogenic Vapor Phase Storage and Inventory Software',
    organization: 'National Human Genome Research Institute',
    location: 'Bethesda, MD',
    industry: 'research institutions',
    therapeuticArea: 'Rare Diseases',
    tenderType: 'Government RFP',
    estimatedValue: 4800000
  },
  {
    title: 'Military Treatment Facility Lab Consolidation Support',
    organization: 'Navy Medicine Readiness Command',
    location: 'San Diego, CA',
    industry: 'defense medical procurement',
    therapeuticArea: 'Other',
    tenderType: 'Government RFP',
    estimatedValue: 3900000
  },
  {
    title: 'Regional Blood Center Cold Chain Validation',
    organization: 'American Red Cross Biomedical Services',
    location: 'Charlotte, NC',
    industry: 'healthcare',
    therapeuticArea: 'Cardiovascular',
    tenderType: 'Supply Agreement',
    estimatedValue: 2600000
  },
  {
    title: 'University Core Proteomics Reagent Supply',
    organization: 'University of California San Francisco',
    location: 'San Francisco, CA',
    industry: 'universities',
    therapeuticArea: 'Oncology',
    tenderType: 'Public Procurement',
    estimatedValue: 2000000
  },
  {
    title: 'State Hospital Network Diagnostic Standardization',
    organization: 'North Carolina Department of Health and Human Services',
    location: 'Raleigh, NC',
    industry: 'government hospitals',
    therapeuticArea: 'Diabetes',
    tenderType: 'Government RFP',
    estimatedValue: 3700000
  },
  {
    title: 'Scientific Balance and Pipette Calibration Program',
    organization: 'FDA Center for Devices and Radiological Health',
    location: 'Silver Spring, MD',
    industry: 'scientific instruments',
    therapeuticArea: 'Other',
    tenderType: 'Government RFP',
    estimatedValue: 1400000
  },
  {
    title: 'Email-Sourced RFP: Regional Immunohematology Reagents',
    organization: 'LifeShare Blood Center',
    location: 'Shreveport, LA',
    industry: 'healthcare',
    therapeuticArea: 'Cardiovascular',
    tenderType: 'Hospital Tender',
    estimatedValue: 1600000
  }
];

const CONNECTOR_ROTATION = ['sam_gov', 'govwin', 'email'];
const SOURCE_BY_CONNECTOR = {
  sam_gov: 'SAM.gov',
  govwin: 'GovWin',
  email: 'Email inbox'
};
const PIPELINE_ROTATION = ['identified', 'evaluating', 'pursuing', 'submitted', 'awarded', 'lost'];
const URGENCY_ROTATION = ['low', 'medium', 'high', 'critical'];
const PRIORITY_ROTATION = ['low', 'medium', 'high', 'critical'];

function buildGeneratedOpportunity(template, index) {
  const connectorType = CONNECTOR_ROTATION[index % CONNECTOR_ROTATION.length];
  const prefix = connectorType === 'sam_gov' ? 'SAM' : connectorType === 'govwin' ? 'GW' : 'EML';
  const reference = `${prefix}-26-${String(300 + index).padStart(4, '0')}-${String.fromCharCode(65 + (index % 26))}${index % 9}`;

  return {
    reference,
    title: template.title,
    organization: template.organization,
    location: template.location,
    description: `${template.title} for ${template.organization}. Includes installation, validation, training, and multi-year service options aligned to regulated laboratory operations.`,
    estimatedValue: template.estimatedValue,
    therapeuticArea: template.therapeuticArea,
    tenderType: template.tenderType,
    source: SOURCE_BY_CONNECTOR[connectorType],
    connectorType,
    urgency: URGENCY_ROTATION[index % URGENCY_ROTATION.length],
    priority: PRIORITY_ROTATION[(index + 1) % PRIORITY_ROTATION.length],
    pipelineStage: PIPELINE_ROTATION[index % PIPELINE_ROTATION.length],
    industry: template.industry
  };
}

function buildThermoOpportunityCatalog(targetCount = 45) {
  const generated = GENERATOR_TEMPLATES.map((template, index) => buildGeneratedOpportunity(template, index));
  const catalog = [...BASE_OPPORTUNITIES, ...generated];

  while (catalog.length < targetCount) {
    const template = GENERATOR_TEMPLATES[catalog.length % GENERATOR_TEMPLATES.length];
    catalog.push(buildGeneratedOpportunity(template, catalog.length));
  }

  return catalog.slice(0, targetCount);
}

module.exports = {
  BASE_OPPORTUNITIES,
  buildThermoOpportunityCatalog
};
