const titleCase = (value) => {
  if (!value || typeof value !== 'string') return '—'
  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const formatLastChecked = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })
}

export const mapSourceRow = (source = {}) => ({
  ...source,
  id: source._id || source.id,
  statusLabel: source.status === 'active' ? 'Active' : titleCase(source.status),
  priorityLabel: titleCase(source.priority),
  reliabilityLabel: titleCase(source.reliability),
  frequencyLabel: titleCase(source.frequency),
  lastSync: source.lastSync || source.updatedAt || source.createdAt,
  lastCheckedLabel: formatLastChecked(source.lastSync || source.updatedAt || source.createdAt),
  newTenders: source.newTenders ?? 0,
  totalTenders: source.totalTenders ?? 0,
  aiConfidence: source.aiConfidence ?? 0,
  aiOptimization: source.aiOptimization || 'Connector cadence and parsing rules are tuned for this source.'
})

export const mapWatchlistRow = (watchlist = {}) => ({
  ...watchlist,
  id: watchlist._id || watchlist.id,
  statusLabel: watchlist.status === 'active' ? 'Active' : titleCase(watchlist.status),
  priorityLabel: titleCase(watchlist.priority),
  frequencyLabel: titleCase(watchlist.frequency),
  alerts: watchlist.totalAlerts ?? 0,
  matches: watchlist.totalMatches ?? 0,
  lastAlert: watchlist.lastAlert || watchlist.updatedAt || watchlist.createdAt,
  categories: watchlist.categories || [],
  keywords: watchlist.keywords || [],
  aiConfidence: watchlist.aiConfidence ?? 0,
  aiOptimization: watchlist.aiOptimization || 'Keyword and category filters are tuned for this watchlist.'
})
