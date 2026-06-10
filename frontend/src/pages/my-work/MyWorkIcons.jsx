import React from 'react'

const base = 'my-work-svg'

/** @param {{ className?: string; title?: string }} props */
export function SvgIcon ({ className = '', title, children, ...rest }) {
  return (
    <svg
      className={`${base} ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

/** Hero — checklist panel + flowing lines */
export function IconMyWorkHero ({ className }) {
  return (
    <SvgIcon className={className}>
      <rect x="3.75" y="3.75" width="10.75" height="16.5" rx="2" stroke="currentColor" strokeWidth="1.65" />
      <path
        d="m7 9.85 2.15 2.15L14.85 7"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 14.5h8M7 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <path d="M16.85 10.05h5.4M16.85 13.95h5.4M16.85 17.85h4" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </SvgIcon>
  )
}

/** Stat — pending / clock ring */
export function IconStatPending ({ className }) {
  return (
    <SvgIcon className={className}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.65" />
      <path
        d="M12 7.5v5l3.25 1.75"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

/** Stat — approvals / seal */
export function IconStatApprovals ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 3.5 18.5 6v5.2c0 4.1-2.55 6.65-6.5 7.8-3.95-1.15-6.5-3.7-6.5-7.8V6L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path
        d="m9.25 12.25 1.65 1.65 3.85-4.4"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

/** Stat — expiring / alert arc */
export function IconStatExpiry ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 4.5a7.5 7.5 0 1 0 7.3 9.2"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      <path
        d="M12 8.25V12l2.5 1.5M12 2.75v2M19.25 12h-2M6.75 12h-2"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
    </SvgIcon>
  )
}

/** Stat — in progress / calendar */
export function IconStatProgress ({ className }) {
  return (
    <SvgIcon className={className}>
      <rect
        x="4.25"
        y="5.25"
        width="15.5"
        height="14.5"
        rx="2.25"
        stroke="currentColor"
        strokeWidth="1.65"
      />
      <path d="M8 3.5v3.5M16 3.5v3.5M4.25 10.5h15.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <circle cx="12" cy="15.85" r="2.85" stroke="currentColor" strokeWidth="1.65" opacity="0.45" />
      <path d="M12 14.25v2.5l1.4.75" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </SvgIcon>
  )
}

export function IconTabTasks ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M8.5 6.5h12M8.5 12h12M8.5 17.5h12"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      <path
        d="m4.25 6.9 1.35 1.35 2.5-2.8M4.25 12.4l1.35 1.35 2.5-2.8M4.25 17.9l1.35 1.35 2.5-2.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

export function IconTabApprovals ({ className }) {
  return (
    <SvgIcon className={className}>
      <path d="M9 5.25h6.75M10.25 4.35v2.15M13.95 4.35v2.15" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <rect x="6" y="7.65" width="12" height="13.85" rx="2" stroke="currentColor" strokeWidth="1.65" />
      <path
        d="m9.35 13.95 2.1 2.05 4.3-5.25"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.5 17.85h8M9.5 20.35h6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" opacity="0.38" />
    </SvgIcon>
  )
}

export function IconTabGuarantees ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 21s7-4.35 7-11V6l-7-3-7 3v4c0 6.65 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.75v6M12 13.75h-.01"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
    </SvgIcon>
  )
}

/** Task type — document review */
export function IconTypeEvaluation ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M13.75 4.25H8.25A2.25 2.25 0 0 0 6 6.5v14A2.25 2.25 0 0 0 8.25 22.75h9A2.25 2.25 0 0 0 19.5 20.5V8.75L13.75 4.25Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path d="M13.75 4.25v4.5h4.25" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
      <path d="M10 17.25h5.75M10 13.5h3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </SvgIcon>
  )
}

/** Task type — approval stamp */
export function IconTypeApproval ({ className }) {
  return (
    <SvgIcon className={className}>
      <rect x="6" y="7" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.65" />
      <path d="M9 21h6" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path d="M12 17v4" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path
        d="m9 11.75 2 2 4-5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

/** Task type — compliance shield grid */
export function IconTypeCompliance ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 3.75 17.65 7v5c0 3.95-3.95 8.85-5.65 10.85C9.95 21.85 6.35 17.95 6.35 12V7L12 3.75Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path d="M9.5 13h5M12 10.25v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </SvgIcon>
  )
}

/** Task type — decision branches */
export function IconTypeBidDecision ({ className }) {
  return (
    <SvgIcon className={className}>
      <circle cx="6.5" cy="6.5" r="2.25" stroke="currentColor" strokeWidth="1.65" />
      <circle cx="17.5" cy="6.5" r="2.25" stroke="currentColor" strokeWidth="1.65" />
      <circle cx="12" cy="18" r="2.25" stroke="currentColor" strokeWidth="1.65" />
      <path d="M8.45 7.75 10.5 11.5M15.55 7.75 13.5 11.5M12 13.35V15.25" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </SvgIcon>
  )
}

/** Task type — pricing chart */
export function IconTypePricing ({ className }) {
  return (
    <SvgIcon className={className}>
      <path d="M4.5 19.5h15" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path d="M7 19.5V14M12 19.5V9M17 19.5v-7" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path
        d="M6.5 12.5 9.25 9.75 12.6 12.1l3.6-4.2 2.9 2.35"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

export function IconEye ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M2.5 12s3.75-6.25 9.5-6.25S21.5 12 21.5 12s-3.75 6.25-9.5 6.25S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.65" />
    </SvgIcon>
  )
}

export function IconCheck ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="m5 12.85 5.05 5.15L19.25 7.5"
        stroke="currentColor"
        strokeWidth="1.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

export function IconClose ({ className }) {
  return (
    <SvgIcon className={className}>
      <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.95" strokeLinecap="round" />
    </SvgIcon>
  )
}

export function IconPlay ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M10.75 9.05v11.35l9-5.65-9-5.7Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

export function IconRenew ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M18.5 6.75A7.25 7.25 0 0 0 6.35 8.35M5.5 6.75v4.25h4.25"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 17.25A7.25 7.25 0 0 0 17.65 15.65M18.5 17.25v-4.25h-4.25"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
