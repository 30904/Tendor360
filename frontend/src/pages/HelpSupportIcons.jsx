import React from 'react'

function S ({ children, className = '' }) {
  return (
    <svg
      className={`support-hub-svg ${className}`.trim()}
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

export const IconLifeRing = () => (
  <S>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <path d="M18.36 5.64 16.2 7.8M7.8 16.2l-2.16 2.16M5.64 5.64 7.8 7.8m8.4 8.4 2.16 2.16" />
  </S>
)

export const IconTicketsTotal = () => (
  <S>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h6" />
  </S>
)

export const IconTicketOpen = () => (
  <S>
    <path d="M21 15a4 4 0 0 1-4 4H7l-5 3V7a4 4 0 0 1 4-4h13a4 4 0 0 1 4 4z" />
    <path d="M8 10h6M8 14h4" />
  </S>
)

export const IconProgress = () => (
  <S>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </S>
)

export const IconResolved = () => (
  <S>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12l2.5 2.5L15.2 9" />
  </S>
)

export const IconUrgent = () => (
  <S>
    <path d="M12 9v5M12 17h.01" />
    <path d="M10.3 3.3 2 20h20L13.7 3.3a2 2 0 0 0-3.4 0z" />
  </S>
)

export const IconClosed = () => (
  <S>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M8 21h13M12 17V9" />
    <path d="m9 12 2 2 4-4" />
  </S>
)

export const IconDashboard = () => (
  <S>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </S>
)

export const IconTicketList = () => (
  <S>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <path d="M4 6h1M4 12h1M4 18h1" />
  </S>
)

export const IconFaqBook = () => (
  <S>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2Z" />
    <path d="M8 7h9M8 11h9" opacity=".82" />
  </S>
)

export const IconAiAssistant = () => (
  <S>
    <rect x="6" y="8" width="12" height="10" rx="2" />
    <path d="M9 5h6M12 18v3" />
    <circle cx="9.5" cy="13" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="13" r="0.9" fill="currentColor" stroke="none" />
    <path d="M12 3v2M5.6 6.6l1.4 1.4M19.4 6.6 18 8" opacity=".75" />
  </S>
)

export const IconPlus = () => (
  <S>
    <path d="M12 5v14M5 12h14" />
  </S>
)

export const IconMessage = () => (
  <S>
    <path d="M21 15a4 4 0 0 1-4 4H8l-6 3V7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4z" />
  </S>
)

export const IconBook = () => (
  <S>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </S>
)

export const IconVideo = () => (
  <S>
    <rect x="2" y="7" width="15" height="10" rx="2" />
    <path d="m17 10 5-3v10l-5-3v-4Z" />
  </S>
)

export const IconTraining = () => (
  <S>
    <circle cx="12" cy="8" r="3" />
    <path d="M4 20v-2a8 8 0 0 1 16 0v2" />
    <path d="m16 22 4-4-4-4" opacity=".76" />
  </S>
)

export const IconEmptyTickets = () => (
  <S>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M10 21V14" opacity=".92" />
  </S>
)

export const IconRefresh = () => (
  <S>
    <path d="M21 12a9 9 0 1 1-9-9" />
    <path d="M21 3v9h-9" />
  </S>
)

export const IconNav = () => (
  <S>
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4M12 18v4M4.93 7.93l2.83 2.83M17.93 17.93l2.83 2.83M2 12h4M18 12h4M4.93 16.93l2.83-2.83M17.93 8.93l2.83-2.83" opacity=".74" />
  </S>
)

export const IconFeature = () => (
  <S>
    <path d="M12 18V5M12 18l5-7M12 18 7 12" opacity=".93" />
  </S>
)
