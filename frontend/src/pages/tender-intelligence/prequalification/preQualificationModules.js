export const PRE_QUALIFICATION_MODULES = [
  {
    id: 'customer-management',
    title: 'Customer Management',
    description: 'Accounts, hierarchies, and relationship context.',
    path: '/tender-intelligence/prequalification/customer-management',
    color: 'primary',
    implemented: true
  },
  {
    id: 'certification-tracking',
    title: 'Certification Tracking',
    description: 'ISO, CE, UL, FDA certs with evidence artifacts.',
    path: '/tender-intelligence/prequalification/certification-tracking',
    color: 'success',
    implemented: true
  },
  {
    id: 'expiry-monitoring',
    title: 'Expiry Monitoring',
    description: 'Expiry radar with severity and countdown rules.',
    path: '/tender-intelligence/prequalification/expiry-monitoring',
    color: 'warning',
    implemented: false
  },
  {
    id: 'automated-reminders',
    title: 'Automated Reminders',
    description: 'Renewal queues, escalations, and owner nudges.',
    path: '/tender-intelligence/prequalification/automated-reminders',
    color: 'info',
    implemented: false
  },
  {
    id: 'compliance-dashboard',
    title: 'Compliance Dashboard',
    description: 'Heatmaps, coverage ratios, and open findings.',
    path: '/tender-intelligence/prequalification/compliance-dashboard',
    color: 'primary',
    implemented: false
  },
  {
    id: 'performance-scoring',
    title: 'Performance Scoring',
    description: 'Vendor scorecards with trends and thresholds.',
    path: '/tender-intelligence/prequalification/performance-scoring',
    color: 'success',
    implemented: false
  },
  {
    id: 'document-verification',
    title: 'Document Verification',
    description: 'Check authenticity, versioning, and sign-offs.',
    path: '/tender-intelligence/prequalification/document-verification',
    color: 'warning',
    implemented: false
  },
  {
    id: 'qualification-levels',
    title: 'Qualification Levels',
    description: 'Tiered programs with prerequisites and approvals.',
    path: '/tender-intelligence/prequalification/qualification-levels',
    color: 'info',
    implemented: false
  },
  {
    id: 'audit-trail',
    title: 'Audit Trail',
    description: 'Who changed what, when—with exportable timelines.',
    path: '/tender-intelligence/prequalification/audit-trail',
    color: 'secondary',
    implemented: false
  },
  {
    id: 'external-integration',
    title: 'External Integration',
    description: 'Connect MDM, ERP, and third-party vendor registries.',
    path: '/tender-intelligence/prequalification/external-integration',
    color: 'primary',
    implemented: false
  },
  {
    id: 'bulk-operations',
    title: 'Bulk Operations',
    description: 'CSV import/export with validation templates.',
    path: '/tender-intelligence/prequalification/bulk-operations',
    color: 'success',
    implemented: false
  },
  {
    id: 'custom-criteria',
    title: 'Custom Criteria',
    description: 'Define bespoke checks and reviewer playbooks.',
    path: '/tender-intelligence/prequalification/custom-criteria',
    color: 'warning',
    implemented: false
  }
]

export function getPreQualModuleBySlug(slug) {
  return PRE_QUALIFICATION_MODULES.find((module) => module.id === slug)
}
