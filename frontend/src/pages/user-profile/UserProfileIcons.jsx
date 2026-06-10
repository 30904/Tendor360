import React from 'react'

const base = 'user-profile-svg'

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

/** Decorative hero mark — passport / identity */
export function IconProfileHero ({ className }) {
  return (
    <SvgIcon className={className}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.65"
      />
      <circle cx="12" cy="10.25" r="2.65" stroke="currentColor" strokeWidth="1.65" />
      <path
        d="M7.75 17.25c.85-2.35 2.45-3.5 4.25-3.5s3.4 1.15 4.25 3.5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
    </SvgIcon>
  )
}

export function IconSectionIdentity ({ className }) {
  return (
    <SvgIcon className={className}>
      <circle cx="12" cy="8.75" r="3.25" stroke="currentColor" strokeWidth="1.65" />
      <path
        d="M6 19.25c1.1-3.2 3.35-5 6-5s4.9 1.8 6 5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
    </SvgIcon>
  )
}

export function IconEnvelope ({ className }) {
  return (
    <SvgIcon className={className}>
      <rect x="3.75" y="6.25" width="16.5" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.65" />
      <path d="M4.25 8.25 12 13.35l7.75-5.1" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
  )
}

export function IconPhone ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M8.85 4.65h1.6c.55 0 1.05.35 1.25.85l1.05 2.65c.15.4.05.85-.25 1.15l-1.05 1.05a11.8 11.8 0 0 0 5.35 5.35l1.05-1.05c.3-.3.75-.4 1.15-.25l2.65 1.05c.5.2.85.7.85 1.25v1.6c0 1.15-.95 2.1-2.1 2.1h-.45C12.5 21.25 4.75 13.5 4.75 4.8v-.45c0-1.15.95-2.1 2.1-2.1Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

export function IconBuilding ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M5 20.25V10.5L12 6.25l7 4.25v9.75"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path d="M9 20.25v-4.75h6v4.75" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
      <path d="M12 13v2.25" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </SvgIcon>
  )
}

export function IconBriefcase ({ className }) {
  return (
    <SvgIcon className={className}>
      <rect x="5.25" y="8.75" width="13.5" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.65" />
      <path d="M9.25 8.75V7.35c0-1.1.9-2 2-2h1.5c1.1 0 2 .9 2 2v1.4" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path d="M4.25 12.75h15.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </SvgIcon>
  )
}

export function IconBell ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 3.25a5.75 5.75 0 0 0-5.75 5.75v3.25l-1.75 3.25h15l-1.75-3.25V9a5.75 5.75 0 0 0-5.75-5.75Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path d="M10.35 19.25h3.3a1.65 1.65 0 0 1-3.3 0Z" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
    </SvgIcon>
  )
}

export function IconSun ({ className }) {
  return (
    <SvgIcon className={className}>
      <circle cx="12" cy="12" r="3.75" stroke="currentColor" strokeWidth="1.65" />
      <path d="M12 4.25v2M12 17.75v2M4.25 12h2M17.75 12h2M6.4 6.4l1.4 1.4M16.2 16.2l1.4 1.4M6.4 17.6l1.4-1.4M16.2 7.8l1.4-1.4" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </SvgIcon>
  )
}

export function IconMoon ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M20.35 14.65A7.75 7.75 0 0 1 10.25 4.45a7.75 7.75 0 1 0 10.1 10.2Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}

export function IconShield ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 21s7-4.35 7-11V6l-7-3-7 3v4c0 6.65 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path d="M9.75 12.25 11.5 14l3.25-4" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
  )
}

export function IconCalendar ({ className }) {
  return (
    <SvgIcon className={className}>
      <rect x="4.25" y="5.25" width="15.5" height="14.5" rx="2.25" stroke="currentColor" strokeWidth="1.65" />
      <path d="M8 3.5v3.5M16 3.5v3.5M4.25 10.5h15.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path d="M8.5 14.25h3M12.5 14.25h3M8.5 17.25h6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" opacity="0.6" />
    </SvgIcon>
  )
}

export function IconLock ({ className }) {
  return (
    <SvgIcon className={className}>
      <rect x="7.25" y="10.75" width="9.5" height="9.5" rx="1.75" stroke="currentColor" strokeWidth="1.65" />
      <path
        d="M9.25 10.75V8.25a2.75 2.75 0 0 1 5.5 0v2.5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.25" r="1.35" fill="currentColor" opacity="0.35" />
    </SvgIcon>
  )
}

export function IconPencil ({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M4.75 17.25v3.5h3.5l10.45-10.45a2.45 2.45 0 0 0 0-3.5l-.95-.95a2.45 2.45 0 0 0-3.5 0L4.75 17.25Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path d="m13.25 6.75 3.5 3.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </SvgIcon>
  )
}

export function IconCheck ({ className }) {
  return (
    <SvgIcon className={className}>
      <path d="m5 12.85 5.05 5.15L19.25 7.5" stroke="currentColor" strokeWidth="1.95" strokeLinecap="round" strokeLinejoin="round" />
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
