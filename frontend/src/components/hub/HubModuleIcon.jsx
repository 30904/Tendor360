import React from 'react'

function S ({ children }) {
  return (
    <svg
      className="hub-module-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

/** ----- Tender Intelligence ----- */
const IcPipeline = () => (
  <S>
    <path d="M4 18V6M4 18h14M10 14h10M16 10h4M13 7h7" />
    <circle cx="7" cy="6" r="2" />
  </S>
)
const IcSources = () => (
  <S>
    <path d="M12 3v18M9 21h6" />
    <path d="M5 8h6M17 16h4M15 5l3 6" />
    <circle cx="5" cy="8" r="1.2" fill="currentColor" stroke="none" />
  </S>
)
const IcPrequalReg = () => (
  <S>
    <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z" />
    <path d="M9 10h6M12 13V7" />
  </S>
)
const IcCompetitors = () => (
  <S>
    <circle cx="9" cy="8" r="2.8" />
    <circle cx="16" cy="9" r="2.2" />
    <path d="M4 21v-1a5 5 0 0 1 5-5h2M21 21v-1a4 4 0 0 0-3.5-4" />
  </S>
)
const IcMarketDecl = () => (
  <S>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
    <path d="M6 12h12M10 15h5M10 18h7" />
  </S>
)

/** ----- Document Management ----- */
const IcBooks = () => (
  <S>
    <path d="M4 19V5c0-.53.43-1 1.6-1H14c1 0 1.9.53 2 1v17" />
    <path d="M20 21V5c0-.47-.92-1-2.2-1H10" />
    <path d="M8 9h5M8 13h7" />
  </S>
)
const IcSubmitBuild = () => (
  <S>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h6" />
    <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
  </S>
)
const IcGitBranch = () => (
  <S>
    <circle cx="6" cy="6" r="2.2" />
    <circle cx="18" cy="6" r="2.2" />
    <circle cx="12" cy="18" r="2.2" />
    <path d="M6 8v2a6 6 0 0 0 6 6M18 8v2a6 6 0 0 1-6 6" />
  </S>
)
const IcLibrary = () => (
  <S>
    <path d="m4 19 9-13 9 13" />
    <path d="M7 21h13M11 21V9" />
    <path d="M17 21V9.5" />
  </S>
)
const IcLockRoom = () => (
  <S>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
  </S>
)
const IcRedact = () => (
  <S>
    <path d="M12 21s8-4.8 8-11a8 8 0 1 0-16 0c0 6.2 8 11 8 11Z" />
    <path d="m4.8 13.8 14.7-9.4M8 21l10-13" opacity=".85" />
  </S>
)
const IcPenSign = () => (
  <S>
    <path d="M12 19h10" />
    <path d="M16.8 13.9 21 18l-2 4-4.9-.9L4 13l8.5-9.5 7.3 8.9Z" />
  </S>
)
const IcArchive = () => (
  <S>
    <path d="M21 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
    <path d="M3 9h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
    <path d="M10 13h4" />
  </S>
)
const IcBrainDoc = () => (
  <S>
    <path d="M9.5 3a4 4 0 0 1 4 2.2A4 4 0 0 1 19 10c0 3-2 5-5 7H8c-4 0-6-4-6-7a6 6 0 0 1 7.5-7Z" />
    <path d="M10 17h10M13 21h7" opacity=".85" />
  </S>
)

/** ----- Qualification & Evaluation ----- */
const IcBuildingStruct = () => (
  <S>
    <path d="M4 21V9l8-6 8 6v12" />
    <path d="M9 21V12h6v9" />
    <path d="M4 21h16" />
  </S>
)
const IcBidChoice = () => (
  <S>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8M12 16V8" />
  </S>
)
const IcComplianceMatrix = () => (
  <S>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 17.5 16 19l5-6" />
  </S>
)
const IcQA = () => (
  <S>
    <path d="M21 15a4 4 0 0 1-4 4H9l-4 3v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4Z" />
    <path d="M7 10V6a5 5 0 1 1 10 0v4" />
  </S>
)
const IcEvalScore = () => (
  <S>
    <path d="M4 19V5M4 19h16" />
    <path d="M8 14v4h3v-4M13 11v7h3v-7M18 8v10" />
    <circle cx="19" cy="6" r="1.3" fill="currentColor" stroke="none" />
  </S>
)
const IcRisk = () => (
  <S>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.8 5.8 2 20h20L13.2 5.8a2 2 0 0 0-3.5 0Z" />
  </S>
)
const IcConsortium = () => (
  <S>
    <circle cx="8" cy="9" r="2.6" />
    <circle cx="16" cy="9" r="2.6" />
    <path d="M4 21v-1c0-1.85 3-4 8-4s8 2.15 8 4v1" />
    <path d="M12 5V3" />
  </S>
)
const IcApprovalStamp = () => (
  <S>
    <circle cx="12" cy="12" r="8" />
    <path d="M8 12.5 10.8 15 16 9" />
    <circle cx="12" cy="12" r="2" />
  </S>
)
const IcBonds = () => (
  <S>
    <rect x="3" y="7" width="18" height="12" rx="2" />
    <path d="M7 7V5h10v2M12 14h.01M9 17h6" />
  </S>
)
const IcWorkspaceTask = () => (
  <S>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M8 11h9M8 15h7M8 7h6" />
    <path d="M16 21V4a1 1 0 0 0-1-1h-3" opacity=".85" />
  </S>
)

/** ----- Pricing & Simulation ----- */
const IcCalc = () => (
  <S>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 6h8M8 10h8M10 17h5" />
  </S>
)
const IcGuardrail = () => (
  <S>
    <path d="M12 21s7-5 7-12V8l-7-5-7 5v1c0 7 7 12 7 12Z" />
    <path d="M12 16V9M12 12h-.01" />
  </S>
)
const IcUpload = () => (
  <S>
    <path d="M12 17V7m0 0-4 4m4-4 4 4" />
    <path d="M4 21h16" />
    <rect x="2" y="3" width="20" height="6" rx="1" opacity=".85" />
  </S>
)
const IcPricingApproval = () => (
  <S>
    <path d="M9 14 11 16l10-11" />
    <rect x="2" y="8" width="16" height="13" rx="2" />
  </S>
)
const IcTrendWin = () => (
  <S>
    <path d="M4 17v5M10 17v5M16 17v5M22 17v5" />
    <path d="m4 12 8-9 12 13" />
    <circle cx="20" cy="9" r="2" />
  </S>
)
const IcIndex = () => (
  <S>
    <path d="M4 21V12M12 21V9M20 21V5" />
    <path d="M2 21h20" />
  </S>
)
const IcDollarShield = () => (
  <S>
    <path d="M12 21s7-5 7-12V8l-7-5-7 5v1c0 7 7 12 7 12Z" />
    <path d="M12 9v10M15 13H9m3-4v.01H9v-.01m6 7H9v.01m6-.01z" opacity=".92" />
  </S>
)
const IcGlobeDuty = () => (
  <S>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a17 17 0 0 1 6 18M12 3a17 17 0 0 0-6 18" opacity=".82" />
  </S>
)
const IcCashflow = () => (
  <S>
    <path d="M4 21V5c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v16" />
    <path d="M8 21V12h3v9M13 21V9h3v12M18 21V14h2v7" />
  </S>
)

/** ----- Tender Calendar ----- */
const IcCalendar = () => (
  <S>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </S>
)
const IcEventCal = () => (
  <S>
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M8 2v6M16 2v6M4 13h16" />
    <circle cx="12" cy="17" r="2" />
  </S>
)
const IcClockDeadline = () => (
  <S>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" />
  </S>
)
const IcBellNotify = () => (
  <S>
    <path d="M18 13V9a6 6 0 1 0-12 0v4l-3 4h18l-3-4Z" />
    <path d="M9 21h6" />
  </S>
)
const IcTeamCal = () => (
  <S>
    <circle cx="8" cy="8" r="2.4" />
    <circle cx="16" cy="8" r="2.4" />
    <path d="M3 21v-1c0-1.76 5-5 9-5s9 3.24 9 5v1" />
    <rect x="2" y="2" width="20" height="5" rx="1" opacity=".35" />
  </S>
)
const IcCalReport = () => (
  <S>
    <path d="M4 21V11M11 21V9M18 21V6" />
    <path d="M4 21h16" />
  </S>
)
const IcSync = () => (
  <S>
    <path d="M4 8V4h5M16 14v7h6M17 21l3-4-3-4" opacity=".92" />
    <path d="M20 6V5a3 3 0 0 0-6 0v1M10 21H7a5 5 0 1 1 4-11" opacity=".92" />
  </S>
)
const IcMilestone = () => (
  <S>
    <path d="M4 21V7l9-5 9 5v14" />
    <path d="M9 21V13h10v8" />
    <path d="M12 13V10" />
  </S>
)

/** ----- Post-Award ----- */
const IcAwardSLA = () => (
  <S>
    <circle cx="12" cy="8" r="5" />
    <path d="M8 12l2 11h4l2-11" />
    <path d="M9 21h8" opacity=".76" />
  </S>
)
const IcBillingClock = () => (
  <S>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M6 2v6M18 2v6M8 21h11" opacity=".92" />
  </S>
)
const IcVendorPerf = () => (
  <S>
    <circle cx="9" cy="8" r="2.8" />
    <path d="M4 21v-1c0-1.94 6-6 10-7M15 5l4 13" opacity=".94" />
  </S>
)
const IcCloseArchive = () => (
  <S>
    <path d="M4 6h16M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
    <path d="M6 21h14a2 2 0 0 0 2-2V8H6v11a2 2 0 0 0 2 2Z" opacity=".93" />
  </S>
)
const IcContractBond = () => (
  <S>
    <path d="M12 21s9-6 9-11V9l-9-7-9 7v1c0 5 9 11 9 11Z" />
    <path d="M9 12h6M12 9v6" />
  </S>
)
const IcChangeOrder = () => (
  <S>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M10 14h6M10 18h4" />
  </S>
)
const IcClaims = () => (
  <S>
    <path d="M12 3 2 20h20L12 3Z" />
    <path d="M12 9v5M12 17h.01" />
  </S>
)
const IcHandshake = () => (
  <S>
    <path d="M11 21h4c1.76 0 3-2.76 5-9l7-11H8L4 21h7Z" opacity=".93" />
    <path d="M14 21V10M8 21V10l2-8" opacity=".93" />
  </S>
)

/** ----- Admin config ----- */
const IcGear = () => (
  <S>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
  </S>
)
const IcUsers = () => (
  <S>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="10" r="2.5" />
    <path d="M4 21v-2a7 7 0 0 1 14 0v2M21 21v-.5a6 6 0 0 0-11-4" opacity=".93" />
  </S>
)
const IcRoleShield = () => (
  <S>
    <path d="M12 21s8-4.67 8-10V8l-8-6-8 6v3c0 5.33 8 10 8 10Z" />
    <circle cx="12" cy="12.5" r="2.5" />
  </S>
)
const IcSecurity = () => (
  <S>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 1 1 8 0v4" />
  </S>
)
const IcBrand = () => (
  <S>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 6v12M9 17h7M9 7h8" opacity=".88" />
  </S>
)
const IcAdminBell = () => (
  <S>
    <path d="M12 21a4 4 0 0 1-4-4h10a4 4 0 0 1-4 4Z" />
    <path d="M14 17V10a6 6 0 1 0-12 0v7z" opacity=".93" />
  </S>
)
const IcAuditEye = () => (
  <S>
    <path d="M2 12s4.5-8 10-8 10 8 10 8-4.5 8-10 8-10-8-10-8Z" />
    <circle cx="12" cy="12" r="3.2" />
  </S>
)
const IcDataTools = () => (
  <S>
    <path d="M4 21V7M12 21V13M20 21V5" />
    <path d="M2 21h20" />
    <path d="M6 7h4v4H6zM18 11h-4v2h4z" opacity=".93" />
  </S>
)

/** ----- Reporting ----- */
const IcComplianceReport = () => (
  <S>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
    <path d="M9 9h7M9 13h5" />
    <path d="M14 18l2 2 4-5" />
  </S>
)
const IcGuaranteeExp = () => (
  <S>
    <path d="M4 19V5M4 19h16" />
    <path d="M8 15v4h3v-4M13 10v9h3v-9M18 6v13" />
    <circle cx="19" cy="4" r="1.2" fill="currentColor" stroke="none" />
  </S>
)
const IcReportBuilder = () => (
  <S>
    <path d="M8 21H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2" />
    <path d="M16 21h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
    <rect x="11" y="3" width="2" height="18" rx="1" />
    <path d="M10 13h8M10 9h12" opacity=".93" />
  </S>
)
const IcBILink = () => (
  <S>
    <path d="M10 13a6 6 0 1 1 4-11l9 18a6 6 0 1 1-11-4z" opacity=".93" />
    <path d="M8 9h8M13 21H9" opacity=".93" />
  </S>
)

/** ----- Pre-Qualification subtree ----- */
const IcCustomers = () => (
  <S>
    <path d="M18 21v-5a7 7 0 1 0-12 0v5Z" />
    <circle cx="12" cy="8" r="3.5" />
    <path d="M21 21v-3a9 9 0 0 0-13-10" opacity=".88" />
  </S>
)
const IcCertShield = () => (
  <S>
    <path d="M12 21s8-4.5 8-10V8l-8-6-8 6v3c0 5.5 8 10 8 10Z" />
    <path d="M9 12.5 11 14.5l5-6" />
  </S>
)
const IcExpiry = () => (
  <S>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 12l4-6" />
    <path d="M6 21h13" opacity=".93" />
  </S>
)
const IcAutoBell = () => (
  <S>
    <path d="M12 21a4 4 0 0 1-4-4h13a5 5 0 1 0-13-7v7c0 .7-.47 4-6 9" opacity=".93" />
  </S>
)
const IcComplianceDash = () => (
  <S>
    <path d="M4 21V10M11 21V13M18 21V7" />
    <path d="M2 21h20M5 17h14" opacity=".93" />
  </S>
)
const IcStarPerf = () => (
  <S>
    <path d="M12 2l3 8h9l-7 6 3 10-9-6-9 6 3-10L2 10h10l2-8Z" />
  </S>
)
const IcFileCheck = () => (
  <S>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 15l3 3 5-8" />
  </S>
)
const IcQualLevels = () => (
  <S>
    <path d="M6 21V10M12 21V13M18 21V6" />
    <path d="M2 21h20M5 17h14" opacity=".92" />
  </S>
)
const IcHistory = () => (
  <S>
    <path d="M3 12a9 9 0 1 1 10 9" opacity=".93" />
    <path d="M3 21v-6h7" opacity=".93" />
    <path d="M12 7v5l4 2" opacity=".93" />
  </S>
)
const IcPlug = () => (
  <S>
    <path d="M9 21h6v-9H9z" />
    <path d="M8 14V8a8 8 0 1 1 8 8v6" opacity=".93" />
  </S>
)
const IcBulk = () => (
  <S>
    <path d="M4 6h16M4 12h16M4 18h16" />
    <path d="M2 21h10M18 21h4" opacity=".93" />
  </S>
)
const IcCriteria = () => (
  <S>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6M12 17v6M4.93 7.93l4.24 4.24M13.93 17.93l4.24 4.24M19.07 4.93l-4.24 4.24M7.93 17.93l-4.24 4.24" />
  </S>
)

/** ----- Collaboration & discovery hubs ----- */
const IcCollabAuthor = () => (
  <S>
    <path d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
    <path d="M15 4v3h3" />
    <path d="M8 11h8M8 15h5" />
    <path d="M14.5 17.5 19 22" />
    <path d="M16.8 15.7 19 18l-1.8 1.8-2.2-2.2" />
    <path d="M18.5 8.5 20 7l1 1-1.5 1.5" opacity=".88" />
  </S>
)
const IcCollabTeam = () => (
  <S>
    <circle cx="8" cy="9" r="2.4" />
    <circle cx="16" cy="9" r="2.4" />
    <circle cx="12" cy="6.5" r="2.1" />
    <path d="M4 20v-1.2c0-1.8 3.2-3.8 8-3.8s8 2 8 3.8V20" />
    <path d="M9.5 12.5 12 14.5l4.5-4" opacity=".88" />
  </S>
)
const IcCollabRelease = () => (
  <S>
    <path d="M12 3 4 7v6c0 4.2 3.4 7.4 8 9 4.6-1.6 8-4.8 8-9V7l-8-4Z" />
    <path d="M12 8v7" />
    <path d="m9.5 11.5 2.5-2.5 2.5 2.5" />
    <path d="M8 18h8" opacity=".82" />
  </S>
)
const IcCollabTracking = () => (
  <S>
    <path d="M4 19V5M4 19h16" />
    <path d="M8 15.5 11.5 11 15 13.5 20 8" />
    <circle cx="8" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="11.5" cy="11" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="15" cy="13.5" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="20" cy="8" r="1.4" fill="currentColor" stroke="none" />
  </S>
)
const IcCollabWorkspace = () => (
  <S>
    <rect x="3" y="5" width="8" height="8" rx="1.5" />
    <rect x="13" y="5" width="8" height="8" rx="1.5" />
    <rect x="3" y="15" width="8" height="4" rx="1.2" />
    <rect x="13" y="15" width="8" height="4" rx="1.2" />
    <path d="M17 7.5h4M17 10h2.5M6 17h3" opacity=".82" />
    <path d="M19 3.5h2.5v2.5M19 3.5 22 6.5" />
  </S>
)
const IcDiscoveryDashboard = () => (
  <S>
    <circle cx="12" cy="12" r="8.5" opacity=".28" />
    <circle cx="12" cy="12" r="5.5" opacity=".42" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21" />
    <path d="M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M5.8 18.2l1.6-1.6M16.6 7.4l1.6-1.6" opacity=".82" />
  </S>
)
const IcDiscoverySourceConfig = () => (
  <S>
    <circle cx="6.5" cy="8" r="2.2" />
    <circle cx="17.5" cy="8" r="2.2" />
    <circle cx="12" cy="17" r="2.2" />
    <path d="M8.2 9.4 10.4 15M13.6 15 15.8 9.4M4.3 8h2.4M17.3 8h2.4" />
    <path d="M12 14.8V11.5" opacity=".82" />
  </S>
)
const IcDiscoverySavedSearches = () => (
  <S>
    <path d="M6 4.5h9l3 3V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" />
    <path d="M15 4.5V7h3" />
    <circle cx="10.5" cy="13.5" r="2.6" />
    <path d="M13.1 16.1 16 19" />
  </S>
)
const IcDiscoveryHistory = () => (
  <S>
    <path d="M4 6h16M4 12h16M4 18h10" />
    <path d="M17.5 16.5 20 19l-2.5 2.5" />
    <circle cx="7" cy="6" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="7" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="7" cy="18" r="1.1" fill="currentColor" stroke="none" />
  </S>
)
const IcDiscoveryImportQueue = () => (
  <S>
    <path d="M5 8h14l-2 10H7L5 8Z" />
    <path d="M9 4h6l1 4H8l1-4Z" />
    <path d="M12 11v4M10 13h4" />
    <path d="M4 20h16" opacity=".82" />
  </S>
)
const IcDiscoveryScheduler = () => (
  <S>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M8 3v4M16 3v4M4 10h16" />
    <path d="M12 13v3" />
    <path d="M9.5 18.5a6.5 6.5 0 0 1 7-10.5" opacity=".88" />
    <path d="M17.5 6.5 19 5l1.5 1.5" opacity=".88" />
  </S>
)

const IcIntegrations = () => (
  <S>
    <circle cx="7" cy="7" r="2.4" />
    <circle cx="17" cy="7" r="2.4" />
    <circle cx="12" cy="17" r="2.4" />
    <path d="M8.8 8.6 10.8 14.2M13.2 14.2 15.2 8.6M9.4 7h5.2M14.6 7H12" />
  </S>
)
const IcApiWebhook = () => (
  <S>
    <path d="M7 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" />
    <path d="M12 17h8M12 17l3-3M12 17l3 3" />
    <path d="M16 7h4v4M20 7l-4 4" opacity=".9" />
    <path d="M5 21v-2a4 4 0 0 1 4-4h1" opacity=".88" />
  </S>
)
const IcEprocAdapter = () => (
  <S>
    <rect x="3" y="6" width="8" height="12" rx="1.5" />
    <rect x="13" y="6" width="8" height="12" rx="1.5" />
    <path d="M11 12h2M11 9h2M11 15h2" />
    <path d="M7 3.5h10" opacity=".88" />
  </S>
)
const IcIntelPlatform = () => (
  <S>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2.2M12 18.8V21M4.2 7.8l1.6 1.6M18.2 16.2l1.6 1.6M3 12h2.2M18.8 12H21M4.2 16.2l1.6-1.6M18.2 7.8l1.6-1.6" />
    <path d="M8.5 8.5 10.2 10.2M13.8 13.8 15.5 15.5" opacity=".82" />
  </S>
)
const IcRetention = () => (
  <S>
    <path d="M4 6h16M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M6 21h14a2 2 0 0 0 2-2V8H6v11a2 2 0 0 0 2 2Z" />
    <path d="M10 12h6M10 16h4" />
    <path d="M18 4.5V3M20 5.5 18.5 7.5" opacity=".88" />
  </S>
)
const IcAIRFPCopilot = () => (
  <S>
    <path d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4l1.4-1.4m10-10 1.4-1.4" />
    <rect x="8" y="9" width="8" height="10" rx="2" />
    <path d="M10 13h4M10 16h4" />
    <path d="M12 7V5M9.5 5.5h5" />
  </S>
)

const IcFallback = () => (
  <S>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 10h9M8 14h9" />
  </S>
)

const HUB_MODULE_ICONS = {
  pipeline: IcPipeline,
  'sources-watchlists': IcSources,
  'pre-qualification-registry': IcPrequalReg,
  competitors: IcCompetitors,
  'market-declarations': IcMarketDecl,
  'content-library': IcBooks,
  'submission-builder': IcSubmitBuild,
  'version-control': IcGitBranch,
  'template-library': IcLibrary,
  'data-rooms': IcLockRoom,
  'redaction-rules': IcRedact,
  'esign-packages': IcPenSign,
  'legal-hold': IcArchive,
  'ai-analysis': IcBrainDoc,
  'tender-type-structure': IcBuildingStruct,
  'bid-no-bid': IcBidChoice,
  'compliance-matrix': IcComplianceMatrix,
  clarifications: IcQA,
  'evaluation-scoring': IcEvalScore,
  'risks-exceptions': IcRisk,
  'consortium-partners': IcConsortium,
  approvals: IcApprovalStamp,
  'guarantees-pre-award': IcBonds,
  'guarantee-templates': IcBonds,
  'workspace-tasks': IcWorkspaceTask,
  scenarios: IcCalc,
  guardrails: IcGuardrail,
  'cpq-import': IcUpload,
  'pricing-approvals': IcPricingApproval,
  'price-to-win': IcTrendWin,
  indexation: IcIndex,
  'guarantee-cost-model': IcDollarShield,
  'duties-freight': IcGlobeDuty,
  cashflow: IcCashflow,
  'fx-taxes': IcGlobeDuty,
  'calendar-view': IcCalendar,
  'event-management': IcEventCal,
  'deadline-tracking': IcClockDeadline,
  'calendar-notifications': IcBellNotify,
  'team-calendar': IcTeamCal,
  'calendar-reports': IcCalReport,
  'calendar-sync': IcSync,
  'milestone-tracking': IcMilestone,
  'slas-kpis': IcAwardSLA,
  'milestones-billing': IcBillingClock,
  'vendor-performance': IcVendorPerf,
  'closeout-archive': IcCloseArchive,
  'guarantees-contract': IcContractBond,
  'guarantees-deposits': IcContractBond,
  'change-orders': IcChangeOrder,
  'claims-risks': IcClaims,
  'handover-delivery': IcHandshake,
  handover: IcHandshake,
  'obligations-slas': IcAwardSLA,
  'system-settings': IcGear,
  'user-management': IcUsers,
  'roles-permissions': IcRoleShield,
  'security-settings': IcSecurity,
  'branding-theming': IcBrand,
  'admin-notifications': IcAdminBell,
  'audit-logs': IcAuditEye,
  'data-tools': IcDataTools,
  'compliance-audit-reports': IcComplianceReport,
  'guarantee-exposure': IcGuaranteeExp,
  'custom-report-builder': IcReportBuilder,
  'bi-connectors': IcBILink,
  'customer-management': IcCustomers,
  'certification-tracking': IcCertShield,
  'expiry-monitoring': IcExpiry,
  'automated-reminders': IcAutoBell,
  'compliance-dashboard': IcComplianceDash,
  'performance-scoring': IcStarPerf,
  'document-verification': IcFileCheck,
  'qualification-levels': IcQualLevels,
  'audit-trail': IcHistory,
  'external-integration': IcPlug,
  'bulk-operations': IcBulk,
  'custom-criteria': IcCriteria,
  'create-rfp': IcCollabAuthor,
  'team-collaboration': IcCollabTeam,
  'publish-rfp': IcCollabRelease,
  'rfp-tracking': IcCollabTracking,
  'issued-rfps': IcCollabWorkspace,
  'discovery-dashboard': IcDiscoveryDashboard,
  'discovery-source-config': IcDiscoverySourceConfig,
  'discovery-saved-searches': IcDiscoverySavedSearches,
  'discovery-history': IcDiscoveryHistory,
  'discovery-import-queue': IcDiscoveryImportQueue,
  'discovery-scheduler': IcDiscoveryScheduler,
  integrations: IcIntegrations,
  'api-keys-webhooks': IcApiWebhook,
  'eprocurement-adapters': IcEprocAdapter,
  'intelligence-platform': IcIntelPlatform,
  retention: IcRetention,
  'ai-copilot': IcAIRFPCopilot,
  'global-settings': IcDataTools,
  'keyword-management': IcDiscoverySavedSearches
}

export function HubModuleIcon ({ moduleId }) {
  const Icon = HUB_MODULE_ICONS[moduleId] || IcFallback
  return <Icon />
}
