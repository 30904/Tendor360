import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import ComingSoon from '../../ComingSoon'
import { getPreQualModuleBySlug } from './preQualificationModules'

const PreQualificationSubmodule = () => {
  const { slug } = useParams()
  const module = getPreQualModuleBySlug(slug)

  if (!module) {
    return <Navigate to="/tender-intelligence/prequalification" replace />
  }

  if (module.implemented) {
    return <Navigate to={module.path} replace />
  }

  return (
    <ComingSoon
      title={module.title}
      description={module.description}
      estimatedDate="Pre-Qualification rollout in progress"
      features={[module.description]}
    />
  )
}

export default PreQualificationSubmodule
