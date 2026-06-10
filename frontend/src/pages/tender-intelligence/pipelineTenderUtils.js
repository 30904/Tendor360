export const emptyPipelineTenderForm = () => ({
  reference: '',
  title: '',
  organization: '',
  location: '',
  description: '',
  estimatedValue: '',
  currency: 'USD',
  deadline: '',
  tenderType: '',
  therapeuticArea: '',
  source: '',
  tags: [],
  urgency: 'medium',
  priority: 'medium',
  pipelineStage: 'identified',
  winProbability: 50
})

export const mapTenderToForm = (tender) => ({
  reference: tender.reference || '',
  title: tender.title || '',
  organization: tender.organization || '',
  location: tender.location || '',
  description: tender.description || '',
  estimatedValue: tender.estimatedValue ?? '',
  currency: tender.currency || 'USD',
  deadline: tender.deadline ? new Date(tender.deadline).toISOString().split('T')[0] : '',
  tenderType: tender.tenderType || '',
  therapeuticArea: tender.therapeuticArea || '',
  source: tender.source || '',
  tags: tender.tags || [],
  urgency: tender.urgency || 'medium',
  priority: tender.priority || 'medium',
  pipelineStage: tender.pipelineStage || 'identified',
  winProbability: tender.winProbability ?? 50
})

export const validatePipelineTenderForm = (formData) => {
  const errors = {}
  if (!formData.reference?.trim()) errors.reference = 'Reference is required'
  if (!formData.title?.trim()) errors.title = 'Title is required'
  if (!formData.organization?.trim()) errors.organization = 'Organization is required'
  if (!formData.location?.trim()) errors.location = 'Location is required'
  if (!formData.description?.trim()) errors.description = 'Description is required'
  if (!formData.estimatedValue) errors.estimatedValue = 'Estimated value is required'
  if (!formData.deadline) errors.deadline = 'Deadline is required'
  if (!formData.tenderType) errors.tenderType = 'Tender type is required'
  if (!formData.therapeuticArea) errors.therapeuticArea = 'Therapeutic area is required'
  if (!formData.source?.trim()) errors.source = 'Source is required'
  return errors
}

export const formatPipelineCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount || 0))

export const formatPipelineDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatPipelineLabel = (value) => {
  if (!value) return '—'
  return String(value)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
