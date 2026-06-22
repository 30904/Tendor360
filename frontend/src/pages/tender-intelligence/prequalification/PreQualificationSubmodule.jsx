import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { ArrowLeft } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ComingSoon from '../../ComingSoon'
import { getPreQualModuleBySlug } from './preQualificationModules'

const PreQualificationSubmodule = ({ moduleId: moduleIdProp }) => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const moduleId = moduleIdProp || slug
  const module = getPreQualModuleBySlug(moduleId)

  if (!module) {
    return <Navigate to="/tender-intelligence/prequalification" replace />
  }

  if (module.implemented) {
    return <Navigate to={module.path} replace />
  }

  return (
    <div className="pre-qualification-submodule">
      <Container fluid className="py-3">
        <Button
          variant="outline-secondary"
          size="sm"
          className="mb-3"
          onClick={() => navigate('/tender-intelligence/prequalification')}
        >
          <ArrowLeft size={16} className="me-2" />
          Back to Pre-Qualification Registry
        </Button>
      </Container>
      <ComingSoon
        title={module.title}
        description={module.description}
        estimatedDate="Pre-Qualification rollout in progress"
        features={[module.description]}
      />
    </div>
  )
}

export default PreQualificationSubmodule
