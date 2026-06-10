export const BUYER_NAVIGATION = [
  {
    key: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    titleFull: 'Executive intelligence dashboard',
    icon: 'home',
    matchPaths: ['/dashboard']
  },
  {
    key: 'tender-discovery',
    path: '/tender-discovery',
    label: 'Discovery',
    titleFull: 'Tender Discovery',
    icon: 'radar',
    matchPaths: ['/tender-discovery', '/tender-discovery/prospecting', '/tender-discovery/metadata']
  },
  {
    key: 'tender-intelligence',
    path: '/tender-intelligence',
    label: 'Intelligence',
    titleFull: 'Tender Intelligence',
    icon: 'search',
    matchPaths: ['/tender-intelligence']
  },
  {
    key: 'opportunity-workspace',
    path: '/opportunity-workspace',
    label: 'Workspace',
    titleFull: 'Opportunity Workspace',
    icon: 'workspace',
    matchPaths: ['/opportunity-workspace']
  },
  {
    key: 'ai-document-intelligence',
    path: '/ai-document-intelligence',
    label: 'AI Docs',
    titleFull: 'AI Document Intelligence',
    icon: 'file',
    matchPaths: ['/ai-document-intelligence', '/document-management']
  },
  {
    key: 'qualification-review',
    path: '/qualification-evaluation',
    label: 'Qualification',
    titleFull: 'Qualification & Review',
    icon: 'check',
    matchPaths: ['/qualification-evaluation']
  },
  {
    key: 'go-no-go',
    path: '/go-no-go',
    label: 'Go / No-Go',
    titleFull: 'Go / No-Go',
    icon: 'decision',
    matchPaths: ['/go-no-go']
  },
  {
    key: 'collaboration',
    path: '/collaboration',
    label: 'Collaboration',
    titleFull: 'Collaboration',
    icon: 'collaboration',
    matchPaths: ['/collaboration', '/rfp-management', '/issued-rfps']
  },
  {
    key: 'pricing-commercials',
    path: '/pricing-simulation',
    label: 'Commercials',
    titleFull: 'Pricing & Commercials',
    icon: 'calculator',
    matchPaths: ['/pricing-simulation']
  },
  {
    key: 'calendar-deadlines',
    path: '/tender-calendar',
    label: 'Calendar',
    titleFull: 'Calendar & Deadlines',
    icon: 'calendar',
    matchPaths: ['/tender-calendar']
  },
  {
    key: 'post-award-tracking',
    path: '/post-award-tracker',
    label: 'Post-award',
    titleFull: 'Post-Award Tracking',
    icon: 'trophy',
    matchPaths: ['/post-award-tracker']
  },
  {
    key: 'analytics-reports',
    path: '/reporting-analytics',
    label: 'Analytics',
    titleFull: 'Analytics & Reports',
    icon: 'chart',
    matchPaths: ['/reporting-analytics']
  },
  {
    key: 'help-support',
    path: '/help-support',
    label: 'Help',
    titleFull: 'Help & Support',
    icon: 'help',
    matchPaths: ['/help-support']
  },
  {
    key: 'admin-config',
    path: '/admin-config',
    label: 'Admin',
    titleFull: 'Administration',
    icon: 'cog',
    roles: ['SYSTEM ADMINISTRATOR', 'ADMIN', 'TENDER MANAGER'],
    matchPaths: ['/admin-config', '/integrations', '/governance-audit']
  }
]
