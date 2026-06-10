import React from 'react'
import ComingSoon from '../ComingSoon'

const RFPModuleTemplate = ({ title, description, features }) => {
  return (
    <ComingSoon
      title={title}
      description={description}
      estimatedDate="Phase 1 rollout in progress"
      features={features}
    />
  )
}

export default RFPModuleTemplate
