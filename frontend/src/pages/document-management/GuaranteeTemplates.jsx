import React from 'react'
import ComingSoon from '../ComingSoon'

const GuaranteeTemplates = () => {
  const features = [
    "Bank and surety guarantee templates by country and issuer",
    "Cover letters and supporting documentation templates",
    "Regional wording variations and compliance requirements",
    "Template versioning and approval workflows",
    "Multi-language support for global deployments",
    "Integration with submission builder for automated document generation",
    "Template library with search and categorization",
    "Legal review and approval tracking"
  ]

  return (
    <ComingSoon
      title="Guarantee Templates & Document Management"
      description="Comprehensive guarantee template library with bank/surety texts, cover letters, and regional compliance support for global tender submissions."
      features={features}
      estimatedDate="Q3 2024"
    />
  )
}

export default GuaranteeTemplates
