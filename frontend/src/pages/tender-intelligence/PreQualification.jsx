import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../../components/hub/HubModuleIcon'
import { PRE_QUALIFICATION_MODULES } from './prequalification/preQualificationModules'
import './PreQualification.scss'

const PreQualification = () => {
  const navigate = useNavigate()

  const modules = PRE_QUALIFICATION_MODULES

  const handleModuleClick = (module) => {
    navigate(module.path)
  }

  return (
    <div className="pre-qualification-modules app-module-hub">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h2>Pre-Qualification Registry</h2>
              <p className="text-muted">
                Comprehensive vendor pre-qualification and certification management
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <div className="modules-grid">
              {modules.map((module) => (
                <Card
                  key={module.id}
                  className={`module-card module-card-${module.color}`}
                  onClick={() => handleModuleClick(module)}
                >
                  <Card.Body>
                    <div className="module-content">
                      <div className="module-icon">
                        <HubModuleIcon moduleId={module.id} />
                      </div>
                      <div className="module-text">
                        <h5 className="module-title">{module.title}</h5>
                        <p className="module-description">{module.description}</p>
                      </div>
                      <div className="module-arrow">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default PreQualification
