import React, { useMemo } from 'react'
import ModuleHubPage from '../../components/hub/ModuleHubPage'
import { PRE_QUALIFICATION_MODULES } from './prequalification/preQualificationModules'
import './PreQualification.scss'

const PreQualification = () => {
  const modules = useMemo(() => PRE_QUALIFICATION_MODULES, [])

  return (
    <ModuleHubPage
      title="Pre-Qualification Registry"
      subtitle="Comprehensive vendor pre-qualification and certification management"
      modules={modules}
      className="pre-qualification-modules app-module-hub"
    />
  )
}

export default PreQualification
