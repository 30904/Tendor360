import React from 'react'
import RFPModuleTemplate from './RFPModuleTemplate'

const PublishRFP = () => (
  <RFPModuleTemplate
    title="Publish RFP"
    description="Run final approvals and publish RFP packages to selected vendors and partners."
    features={[
      'Approval checklist before release',
      'Vendor list selection and publish controls',
      'Publish history and acknowledgement logs'
    ]}
  />
)

export default PublishRFP
