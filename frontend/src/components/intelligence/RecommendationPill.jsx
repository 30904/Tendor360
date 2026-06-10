import React from 'react'
import { Badge } from 'react-bootstrap'

const LABELS = {
  go: 'GO',
  conditional_go: 'CONDITIONAL GO',
  no_go: 'NO-GO',
  defer: 'DEFER'
}

const TONES = {
  go: 'success',
  conditional_go: 'info',
  no_go: 'danger',
  defer: 'warning'
}

const RecommendationPill = ({ value, className = '' }) => (
  <Badge bg={TONES[value] || 'secondary'} className={`intel-recommendation-pill ${className}`}>
    {LABELS[value] || value}
  </Badge>
)

export default RecommendationPill
