import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../components/hub/HubModuleIcon'
import './TenderIntelligence.scss'

const TenderIntelligence = () => {
  const navigate = useNavigate()

  const modules = [
    {
      id: 'pipeline',
      title: 'Pipeline',
      description: 'Manage tender pipeline and track opportunities.',
      path: '/tender-intelligence/pipeline',
      color: 'primary'
    },
    {
      id: 'sources-watchlists',
      title: 'Sources & Watchlists',
      description: 'Monitor tender sources and maintain watchlists.',
      path: '/tender-intelligence/sources',
      color: 'success'
    },
    {
      id: 'pre-qualification-registry',
      title: 'Pre-Qualification Registry',
      description: 'Vendor pre-qualification, certification, and eligibility.',
      path: '/tender-intelligence/prequalification',
      color: 'warning'
    },
    {
      id: 'competitors',
      title: 'Competitors',
      description: 'Track competitor intelligence and market analysis.',
      path: '/tender-intelligence/competitors',
      color: 'info'
    },
    {
      id: 'market-declarations',
      title: 'Market Declarations',
      description: 'Manage market declarations and regulatory compliance.',
      path: '/tender-intelligence/declarations',
      color: 'primary'
    }
  ]

  const handleModuleClick = (module) => {
    navigate(module.path)
  }

  return (
    <div className="tender-intelligence-modules app-module-hub">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h2>Tender Intelligence</h2>
              <p className="text-muted">Comprehensive tender intelligence and opportunity management platform</p>
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

export default TenderIntelligence
