import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Components
import AuthInitializer from './components/AuthInitializer'

// Layout Components
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import RespondLayout from './layouts/RespondLayout'

// Issued RFP & participant portal
import IssuedRfpListPage from './pages/issued-rfps/IssuedRfpListPage'
import IssuedRfpDetailPage from './pages/issued-rfps/IssuedRfpDetailPage'
import IssuedRfpNewPage from './pages/issued-rfps/IssuedRfpNewPage'
import RespondInboxPage from './pages/respond/RespondInboxPage'
import RespondRedeemPage from './pages/respond/RespondRedeemPage'
import RespondRfpPage from './pages/respond/RespondRfpPage'
import RegisterRespondent from './pages/auth/RegisterRespondent'

// Auth Pages
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'

// About Page
import About from './pages/About'

// Main Pages
import Dashboard from './pages/Dashboard'
import TenderIntelligence from './pages/TenderIntelligence'
import QualificationEvaluation from './pages/QualificationEvaluation'
import DocumentManagement from './pages/DocumentManagement'
import PricingSimulation from './pages/PricingSimulation'
import TenderCalendar from './pages/TenderCalendar'
import PostAwardTracker from './pages/PostAwardTracker'
import ReportingAnalytics from './pages/ReportingAnalytics'
import RFPManagement from './pages/RFPManagement'
import AdminConfig from './pages/AdminConfig'
import UserProfile from './pages/UserProfile'
import MyWork from './pages/MyWork'
import HelpSupport from './pages/HelpSupport'
import HelpPage from './pages/HelpPage'
import DocumentManagementHelp from './pages/DocumentManagementHelp'
import QualificationEvaluationHelp from './pages/QualificationEvaluationHelp'
import DataTableDemo from './pages/DataTableDemo'

// Tender Intelligence Subpages
import Pipeline from './pages/tender-intelligence/Pipeline'
import PipelineTenderPage from './pages/tender-intelligence/PipelineTenderPage'
import SourcesWatchlists from './pages/tender-intelligence/SourcesWatchlists'
import Competitors from './pages/tender-intelligence/Competitors'
import PreQualification from './pages/tender-intelligence/PreQualification'
import TIDeclarations from './pages/tender-intelligence/Declarations'
import PreQualificationRegistry from './pages/tender-intelligence/PreQualificationRegistry'
import MarketDeclarations from './pages/tender-intelligence/MarketDeclarations'

// Pre-Qualification Registry Subpages
import CustomerManagement from './pages/tender-intelligence/prequalification/CustomerManagement'
import CertificationTracking from './pages/tender-intelligence/prequalification/CertificationTracking'
import PreQualificationSubmodule from './pages/tender-intelligence/prequalification/PreQualificationSubmodule'

// Document Management Subpages
import ContentLibrary from './pages/document-management/ContentLibrary'
import DataRooms from './pages/document-management/DataRooms'
import Templates from './pages/document-management/Templates'
import SubmissionBuilder from './pages/document-management/SubmissionBuilder'
import Versioning from './pages/document-management/Versioning'
import RedactionRules from './pages/document-management/RedactionRules'
import ESignPackages from './pages/document-management/ESignPackages'
import LegalHold from './pages/document-management/LegalHold'
import AIAnalysis from './pages/document-management/AIAnalysis'
import GuaranteeTemplates from './pages/document-management/GuaranteeTemplates'

// Pricing & Simulation Subpages
import Scenarios from './pages/pricing-simulation/Scenarios'
import Guardrails from './pages/pricing-simulation/Guardrails'
import CPQImport from './pages/pricing-simulation/CPQImport'
import PricingApprovals from './pages/pricing-simulation/PricingApprovals'
import PriceToWin from './pages/pricing-simulation/PriceToWin'
import Indexation from './pages/pricing-simulation/Indexation'
import GuaranteeCostModel from './pages/pricing-simulation/GuaranteeCostModel'
import Cashflow from './pages/pricing-simulation/Cashflow'
import DutiesFreight from './pages/pricing-simulation/DutiesFreight'
import FXTaxes from './pages/pricing-simulation/FXTaxes'

// Post-Award Tracker Subpages
import SLAsKPIs from './pages/post-award-tracker/SLAsKPIs'
import MilestonesBilling from './pages/post-award-tracker/MilestonesBilling'
import VendorPerformance from './pages/post-award-tracker/VendorPerformance'
import ChangeOrders from './pages/post-award-tracker/ChangeOrders'
import CloseoutArchive from './pages/post-award-tracker/CloseoutArchive'
import GuaranteesDeposits from './pages/post-award-tracker/GuaranteesDeposits'
import GuaranteesContract from './pages/post-award-tracker/GuaranteesContract'
import ClaimsRisks from './pages/post-award-tracker/ClaimsRisks'
import Handover from './pages/post-award-tracker/Handover'
import HandoverDelivery from './pages/post-award-tracker/HandoverDelivery'
import ObligationsSLAs from './pages/post-award-tracker/ObligationsSLAs'

// Tender Calendar Subpages
import CalendarView from './pages/tender-calendar/CalendarView'
import EventManagement from './pages/tender-calendar/EventManagement'
import DeadlineTracking from './pages/tender-calendar/DeadlineTracking'
import Notifications from './pages/tender-calendar/Notifications'
import TeamCalendar from './pages/tender-calendar/TeamCalendar'
import CalendarReports from './pages/tender-calendar/CalendarReports'

// Competitor Intelligence Subpages
import Profiling from './pages/tender-intelligence/competitors/Profiling'
import WinLossAnalysis from './pages/tender-intelligence/WinLossAnalysis'
import WinLossAnalysisByCompetitor from './pages/tender-intelligence/competitors/WinLossAnalysisByCompetitor'

// Admin & Config Subpages
import SystemSettings from './pages/admin-config/SystemSettings'
import SecuritySettings from './pages/admin-config/SecuritySettings'
import NotificationSettings from './pages/admin-config/NotificationSettings'
import DataTools from './pages/admin-config/DataTools'
import IssuerMaster from './pages/admin-config/IssuerMaster'
import AIPromptTemplates from './pages/admin-config/AIPromptTemplates'
import UnitsIncoterms from './pages/admin-config/UnitsIncoterms'
import DataResidency from './pages/admin-config/DataResidency'
import EProcurementAdapters from './pages/admin-config/EProcurementAdapters'
import APIKeysWebhooks from './pages/admin-config/APIKeysWebhooks'
import IntelligencePlatformConfig from './pages/admin-config/IntelligencePlatformConfig'
import DiscoveryConnectors from './pages/admin-config/DiscoveryConnectors'

// Qualification & Evaluation Subpages
import BidNoBid from './pages/qualification-evaluation/BidNoBid'
import ComplianceMatrix from './pages/qualification-evaluation/ComplianceMatrix'
import Clarifications from './pages/qualification-evaluation/Clarifications'
import Scoring from './pages/qualification-evaluation/Scoring'
import Approvals from './pages/qualification-evaluation/Approvals'
import Declarations from './pages/qualification-evaluation/Declarations'
import RiskExceptions from './pages/qualification-evaluation/RiskExceptions'
import Workspace from './pages/qualification-evaluation/Workspace'
import GuaranteesPreAward from './pages/qualification-evaluation/GuaranteesPreAward'
import TenderType from './pages/qualification-evaluation/TenderType'
import TenderTypeStructure from './pages/qualification-evaluation/TenderTypeStructure'
import EvaluationModels from './pages/qualification-evaluation/EvaluationModels'
import ConsortiumPartners from './pages/qualification-evaluation/ConsortiumPartners'
import WorkspaceTasks from './pages/qualification-evaluation/WorkspaceTasks'

// Admin & Config Subpages
import UserManagement from './pages/admin-config/UserManagement'
import AuditLogs from './pages/admin-config/AuditLogs'
import RolesPermissions from './pages/admin-config/RolesPermissions'
import GlobalSettings from './pages/admin-config/GlobalSettings'
import Branding from './pages/admin-config/Branding'
import Localization from './pages/admin-config/Localization'
import Masters from './pages/admin-config/Masters'
import Retention from './pages/admin-config/Retention'
import SecuritiesMaster from './pages/admin-config/SecuritiesMaster'
import TaxesFX from './pages/admin-config/TaxesFX'
import Workflows from './pages/admin-config/Workflows'

// Reporting & Analytics Subpages
import ComplianceAuditReports from './pages/reporting-analytics/ComplianceAuditReports'
import GuaranteeExposure from './pages/reporting-analytics/GuaranteeExposure'
import CustomReportBuilder from './pages/reporting-analytics/CustomReportBuilder'
import BIConnectors from './pages/reporting-analytics/BIConnectors'
import CreateRFP from './pages/rfp-management/CreateRFP'
import TeamCollaboration from './pages/rfp-management/TeamCollaboration'
import PublishRFP from './pages/rfp-management/PublishRFP'
import TrackRFP from './pages/rfp-management/TrackRFP'
import AIRFPCopilot from './pages/rfp-management/AIRFPCopilot'
import RFPResponseEditor from './pages/rfp-management/RFPResponseEditor'
import TenderDiscoveryHub from './pages/tender-discovery/TenderDiscoveryHub'
import DiscoveryHistoryPage from './pages/tender-discovery/DiscoveryHistoryPage'
import DiscoveryImportQueuePage from './pages/tender-discovery/DiscoveryImportQueuePage'
import DiscoverySchedulerPage from './pages/tender-discovery/DiscoverySchedulerPage'
import DiscoveryProspectingPage from './pages/tender-discovery/DiscoveryProspectingPage'
import DiscoveryMetadataPage from './pages/tender-discovery/DiscoveryMetadataPage'
import EmailTenderScanningPage from './pages/tender-discovery/EmailTenderScanningPage'
import OpportunityWorkspaceHub from './pages/opportunity-workspace/OpportunityWorkspaceHub'
import OpportunityWorkspaceDetail from './pages/opportunity-workspace/OpportunityWorkspaceDetail'
import AiDocumentIntelligenceHub from './pages/ai-document-intelligence/AiDocumentIntelligenceHub'
import TenderIntelligenceRtmPage from './pages/ai-document-intelligence/TenderIntelligenceRtmPage'
import CrmAccountIntelligencePage from './pages/ai-document-intelligence/CrmAccountIntelligencePage'
import GoNoGoHub from './pages/go-no-go/GoNoGoHub'
import CollaborationHub from './pages/collaboration/CollaborationHub'
import IntegrationsHub from './pages/integrations/IntegrationsHub'
import GovernanceAuditHub from './pages/governance/GovernanceAuditHub'
import { userHasAnyRole, resolveRequiredRoles } from './utils/roles'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRoles = [], organizationKind }) => {
  const { user, isAuthenticated, isInitialized } = useSelector(state => state.auth)
  
  // Don't redirect until we've initialized auth state
  if (!isInitialized) {
    return null // AuthInitializer will handle the loading state
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const orgKind = user?.company?.organizationKind || 'buyer'
  if (organizationKind && orgKind !== organizationKind) {
    const fallback = orgKind === 'supplier' ? '/respond/inbox' : '/dashboard'
    return <Navigate to={fallback} replace />
  }
  
  if (requiredRoles.length > 0 && !userHasAnyRole(user, resolveRequiredRoles(requiredRoles))) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function App() {
  return (
    <AuthInitializer>
      <div className="app">
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register-respondent" element={<RegisterRespondent />} />
        <Route path="/forgot-password" element={
            <ForgotPassword />
        } />
        
        {/* About Page */}
        <Route path="/about" element={<About />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute organizationKind="buyer">
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="tender-discovery" element={<TenderDiscoveryHub />} />
          <Route path="tender-discovery/history" element={<DiscoveryHistoryPage />} />
          <Route path="tender-discovery/import-queue" element={<DiscoveryImportQueuePage />} />
          <Route path="tender-discovery/scheduler" element={<DiscoverySchedulerPage />} />
          <Route path="tender-discovery/prospecting" element={<DiscoveryProspectingPage />} />
          <Route path="tender-discovery/metadata" element={<DiscoveryMetadataPage />} />
          <Route path="tender-discovery/email-scanning" element={<EmailTenderScanningPage />} />
          <Route path="opportunity-workspace" element={<OpportunityWorkspaceHub />} />
          <Route path="opportunity-workspace/:tenderId" element={<OpportunityWorkspaceDetail />} />
          <Route path="ai-document-intelligence" element={<AiDocumentIntelligenceHub />} />
          <Route path="ai-document-intelligence/rtm" element={<TenderIntelligenceRtmPage />} />
          <Route path="ai-document-intelligence/crm" element={<CrmAccountIntelligencePage />} />
          <Route path="go-no-go" element={<GoNoGoHub />} />
          <Route path="collaboration" element={<CollaborationHub />} />
          <Route path="integrations" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <IntegrationsHub />
            </ProtectedRoute>
          } />
          <Route path="governance-audit" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <GovernanceAuditHub />
            </ProtectedRoute>
          } />
          {/* Tender Intelligence Routes */}
          <Route path="tender-intelligence" element={<TenderIntelligence />} />
          <Route path="tender-intelligence/pipeline" element={<Pipeline />} />
          <Route path="tender-intelligence/pipeline/new" element={<PipelineTenderPage />} />
          <Route path="tender-intelligence/pipeline/:tenderId/edit" element={<PipelineTenderPage />} />
          <Route path="tender-intelligence/pipeline/:tenderId" element={<PipelineTenderPage />} />
          <Route path="tender-intelligence/sources/new" element={<SourcesWatchlists />} />
          <Route path="tender-intelligence/sources" element={<SourcesWatchlists />} />
          <Route path="tender-intelligence/competitors/new" element={<Competitors />} />
          <Route path="tender-intelligence/competitors" element={<Competitors />} />
      <Route path="tender-intelligence/competitors/profiling" element={<Profiling />} />
      <Route path="tender-intelligence/competitors/win-loss-analysis" element={<WinLossAnalysis />} />
      <Route path="tender-intelligence/win-loss-analysis" element={<WinLossAnalysis />} />
      <Route path="tender-intelligence/competitors/win-loss-analysis-by-competitor" element={<WinLossAnalysisByCompetitor />} />
          <Route path="tender-intelligence/prequalification" element={<PreQualification />} />
          <Route path="tender-intelligence/prequalification/customer-management/new" element={<CustomerManagement />} />
          <Route path="tender-intelligence/prequalification/customer-management" element={<CustomerManagement />} />
          <Route path="tender-intelligence/prequalification/certification-tracking" element={<CertificationTracking />} />
          <Route path="tender-intelligence/prequalification/:slug" element={<PreQualificationSubmodule />} />
          <Route path="tender-intelligence/declarations" element={<TIDeclarations />} />
          <Route path="tender-intelligence/sources-watchlists" element={<Navigate to="/tender-intelligence/sources" replace />} />
          <Route path="tender-intelligence/prequalification-registry" element={<PreQualificationRegistry />} />
          <Route path="tender-intelligence/market-declarations/new" element={<MarketDeclarations />} />
          <Route path="tender-intelligence/market-declarations" element={<MarketDeclarations />} />
          
          {/* Qualification & Evaluation Routes */}
          <Route path="qualification-evaluation" element={<QualificationEvaluation />} />
          <Route path="qualification-evaluation/bid-no-bid" element={<BidNoBid />} />
          <Route path="qualification-evaluation/compliance-matrix" element={<ComplianceMatrix />} />
          <Route path="qualification-evaluation/clarifications" element={<Clarifications />} />
          <Route path="qualification-evaluation/scoring" element={<Scoring />} />
          <Route path="qualification-evaluation/approvals" element={<Approvals />} />
          <Route path="qualification-evaluation/declarations" element={<Declarations />} />
          <Route path="qualification-evaluation/risk-exceptions" element={<RiskExceptions />} />
          <Route path="qualification-evaluation/workspace" element={<Workspace />} />
          <Route path="qualification-evaluation/guarantees-pre-award" element={<GuaranteesPreAward />} />
          <Route path="qualification-evaluation/tender-type" element={<TenderType />} />
          <Route path="qualification-evaluation/tender-type-structure" element={<TenderTypeStructure />} />
          <Route path="qualification-evaluation/evaluation-models" element={<EvaluationModels />} />
          <Route path="qualification-evaluation/consortium-partners" element={<ConsortiumPartners />} />
          <Route path="qualification-evaluation/workspace-tasks" element={<WorkspaceTasks />} />
          
          {/* Document Management Routes */}
          <Route path="document-management" element={<DocumentManagement />} />
          <Route path="document-management/content-library" element={<ContentLibrary />} />
          <Route path="document-management/data-rooms" element={<DataRooms />} />
          <Route path="document-management/templates" element={<Templates />} />
          <Route path="document-management/submission-builder" element={<SubmissionBuilder />} />
          <Route path="document-management/version-control" element={<Versioning />} />
          <Route path="document-management/redaction-rules" element={<RedactionRules />} />
          <Route path="document-management/esign-packages" element={<ESignPackages />} />
          <Route path="document-management/legal-hold" element={<LegalHold />} />
          <Route path="document-management/ai-analysis" element={<AIAnalysis />} />
          <Route path="document-management/guarantee-templates" element={<GuaranteeTemplates />} />
          
          {/* Pricing & Simulation Routes */}
          <Route path="pricing-simulation" element={<PricingSimulation />} />
          <Route path="pricing-simulation/scenarios" element={<Scenarios />} />
          <Route path="pricing-simulation/guardrails" element={<Guardrails />} />
          <Route path="pricing-simulation/cpq-import" element={<CPQImport />} />
          <Route path="pricing-simulation/approvals" element={<PricingApprovals />} />
          <Route path="pricing-simulation/price-to-win" element={<PriceToWin />} />
          <Route path="pricing-simulation/indexation" element={<Indexation />} />
          <Route path="pricing-simulation/guarantee-cost-model" element={<GuaranteeCostModel />} />
          <Route path="pricing-simulation/cashflow" element={<Cashflow />} />
          <Route path="pricing-simulation/duties-freight" element={<DutiesFreight />} />
          <Route path="pricing-simulation/fx-taxes" element={<FXTaxes />} />
          
          <Route path="tender-calendar" element={<TenderCalendar />} />
          <Route path="tender-calendar/calendar-view" element={<CalendarView />} />
          <Route path="tender-calendar/event-management" element={<EventManagement />} />
          <Route path="tender-calendar/deadline-tracking" element={<DeadlineTracking />} />
          <Route path="tender-calendar/notifications" element={<Notifications />} />
          <Route path="tender-calendar/team-calendar" element={<TeamCalendar />} />
          <Route path="tender-calendar/calendar-reports" element={<CalendarReports />} />
          
          {/* Post-Award Tracker Routes */}
          <Route path="post-award-tracker" element={<PostAwardTracker />} />
          <Route path="post-award-tracker/slas-kpis" element={<SLAsKPIs />} />
          <Route path="post-award-tracker/milestones-billing" element={<MilestonesBilling />} />
          <Route path="post-award-tracker/vendor-performance" element={<VendorPerformance />} />
          <Route path="post-award-tracker/change-orders" element={<ChangeOrders />} />
          <Route path="post-award-tracker/closeout-archive" element={<CloseoutArchive />} />
          <Route path="post-award-tracker/guarantees-deposits" element={<GuaranteesDeposits />} />
          <Route path="post-award-tracker/guarantees-contract" element={<GuaranteesContract />} />
          <Route path="post-award-tracker/claims-risks" element={<ClaimsRisks />} />
          <Route path="post-award-tracker/handover" element={<Handover />} />
          <Route path="post-award-tracker/handover-delivery" element={<HandoverDelivery />} />
          <Route path="post-award-tracker/obligations-slas" element={<ObligationsSLAs />} />
          
          <Route path="reporting-analytics" element={<ReportingAnalytics />} />
          <Route path="reporting-analytics/compliance-audit-reports" element={<ComplianceAuditReports />} />
          <Route path="reporting-analytics/guarantee-exposure" element={<GuaranteeExposure />} />
          <Route path="reporting-analytics/custom-report-builder" element={<CustomReportBuilder />} />
          <Route path="reporting-analytics/bi-connectors" element={<BIConnectors />} />

          {/* RFP Management Routes */}
          <Route path="rfp-management" element={<RFPManagement />} />
          <Route path="rfp-management/create" element={<CreateRFP />} />
          <Route path="rfp-management/teams" element={<TeamCollaboration />} />
          <Route path="rfp-management/publish" element={<PublishRFP />} />
          <Route path="rfp-management/tracking" element={<TrackRFP />} />
          <Route path="rfp-management/ai-copilot" element={<AIRFPCopilot />} />
          <Route path="rfp-management/editor/:id" element={<RFPResponseEditor />} />

          <Route path="issued-rfps" element={<IssuedRfpListPage />} />
          <Route path="issued-rfps/new" element={<IssuedRfpNewPage />} />
          <Route path="issued-rfps/:id" element={<IssuedRfpDetailPage />} />
          
          {/* Admin & Config Routes */}
          <Route path="admin-config" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <AdminConfig />
            </ProtectedRoute>
          } />
          <Route path="admin-config/user-management" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="admin-config/audit-logs" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <AuditLogs />
            </ProtectedRoute>
          } />
          <Route path="admin-config/roles-permissions" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <RolesPermissions />
            </ProtectedRoute>
          } />
          <Route path="admin-config/global-settings" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <GlobalSettings />
            </ProtectedRoute>
          } />
          <Route path="admin-config/branding" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <Branding />
            </ProtectedRoute>
          } />
          <Route path="admin-config/governance" element={<Navigate to="/governance-audit" replace />} />
          <Route path="admin-config/integrations" element={<Navigate to="/integrations" replace />} />
          <Route path="admin-config/localization" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <Localization />
            </ProtectedRoute>
          } />
          <Route path="admin-config/masters" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <Masters />
            </ProtectedRoute>
          } />
          <Route path="admin-config/retention" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <Retention />
            </ProtectedRoute>
          } />
          <Route path="admin-config/securities-master" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <SecuritiesMaster />
            </ProtectedRoute>
          } />
          <Route path="admin-config/taxes-fx" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <TaxesFX />
            </ProtectedRoute>
          } />
          <Route path="admin-config/workflows" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <Workflows />
            </ProtectedRoute>
          } />
          <Route path="admin-config/system-settings" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="admin-config/security-settings" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <SecuritySettings />
            </ProtectedRoute>
          } />
          <Route path="admin-config/notification-settings" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <NotificationSettings />
            </ProtectedRoute>
          } />
          <Route path="admin-config/data-tools" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <DataTools />
            </ProtectedRoute>
          } />
          <Route path="admin-config/issuer-master" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <IssuerMaster />
            </ProtectedRoute>
          } />
          <Route path="admin-config/ai-prompt-templates" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <AIPromptTemplates />
            </ProtectedRoute>
          } />
          <Route path="admin-config/units-incoterms" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <UnitsIncoterms />
            </ProtectedRoute>
          } />
          <Route path="admin-config/data-residency" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <DataResidency />
            </ProtectedRoute>
          } />
          <Route path="admin-config/eprocurement-adapters" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <EProcurementAdapters />
            </ProtectedRoute>
          } />
          <Route path="admin-config/api-keys-webhooks" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <APIKeysWebhooks />
            </ProtectedRoute>
          } />
          <Route path="admin-config/intelligence-platform" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR']}>
              <IntelligencePlatformConfig />
            </ProtectedRoute>
          } />
          <Route path="admin-config/discovery-connectors" element={
            <ProtectedRoute requiredRoles={['SYSTEM ADMINISTRATOR', 'TENDER MANAGER']}>
              <DiscoveryConnectors />
            </ProtectedRoute>
          } />
          
          <Route path="profile" element={<UserProfile />} />
          <Route path="my-work" element={<MyWork />} />
          <Route path="help-support" element={<HelpSupport />} />
          <Route path="datatable-demo" element={<DataTableDemo />} />
        </Route>

        <Route
          path="/respond"
          element={
            <ProtectedRoute organizationKind="supplier">
              <RespondLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/respond/inbox" replace />} />
          <Route path="inbox" element={<RespondInboxPage />} />
          <Route path="redeem" element={<RespondRedeemPage />} />
          <Route path="rfp/:id" element={<RespondRfpPage />} />
        </Route>
        
        {/* Public Help Route - Accessible without authentication */}
        <Route path="help" element={<HelpPage />} />
        <Route path="document-management-help" element={<DocumentManagementHelp />} />
        <Route path="qualification-evaluation-help" element={<QualificationEvaluationHelp />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AuthInitializer>
  )
}

export default App
