/**
 * Normalized role checks for navigation and route guards.
 * Users may have ADMIN, SYSTEM ADMINISTRATOR, or TENDER MANAGER for config screens.
 */

export const ROLE = {
  SYSTEM_ADMINISTRATOR: 'SYSTEM ADMINISTRATOR',
  ADMIN: 'ADMIN',
  TENDER_MANAGER: 'TENDER MANAGER',
  REVIEWER: 'REVIEWER',
  APPROVER: 'APPROVER',
  PRICING_ANALYST: 'PRICING ANALYST',
  GUEST: 'GUEST'
}

/** Roles that can open Admin hub and discovery connector configuration */
export const ADMIN_NAV_ROLES = [
  ROLE.SYSTEM_ADMINISTRATOR,
  ROLE.ADMIN,
  ROLE.TENDER_MANAGER
]

export const DISCOVERY_CONFIG_ROLES = ADMIN_NAV_ROLES

function normalizeRoleKey(role) {
  if (!role) return ''
  const trimmed = String(role).trim()
  const upper = trimmed.toUpperCase()
  if (upper === 'ADMIN' || trimmed === 'Admin') return ROLE.ADMIN
  if (upper === 'SYSTEM ADMINISTRATOR') return ROLE.SYSTEM_ADMINISTRATOR
  if (upper === 'TENDER MANAGER') return ROLE.TENDER_MANAGER
  return trimmed
}

function extractRoleValue(role) {
  if (!role) return ''
  if (typeof role === 'string') return role
  if (typeof role === 'object') {
    return role.name || role.key || role.role || ''
  }
  return String(role)
}

export function getUserRoles(user) {
  if (!user) return []
  const raw = Array.isArray(user.roles) && user.roles.length ? user.roles : user.role ? [user.role] : []
  return raw.map((r) => normalizeRoleKey(extractRoleValue(r))).filter(Boolean)
}

export function userHasAnyRole(user, allowedRoles = []) {
  if (!allowedRoles.length) return true
  const userRoles = getUserRoles(user)
  const allowed = allowedRoles.map(normalizeRoleKey)
  return userRoles.some((role) => allowed.includes(role))
}

const ADMIN_BUNDLE_KEYS = new Set([
  ROLE.SYSTEM_ADMINISTRATOR,
  ROLE.ADMIN,
  ROLE.TENDER_MANAGER
])

/** Expand route guards so ADMIN users can access admin-only screens */
export function resolveRequiredRoles(requiredRoles = []) {
  if (!requiredRoles.length) return []
  const needsAdminBundle = requiredRoles.some((r) => ADMIN_BUNDLE_KEYS.has(r))
  return needsAdminBundle ? ADMIN_NAV_ROLES : requiredRoles
}

export function formatUserRolesLabel(user) {
  const roles = getUserRoles(user)
  if (!roles.length) return 'User'
  return roles
    .map((r) =>
      r
        .split(' ')
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(' ')
    )
    .join(', ')
}
