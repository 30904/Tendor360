import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../components/hub/HubModuleIcon'
import './ReportingAnalytics.scss'

const ReportingAnalytics = () => {
  const navigate = useNavigate()

  const modules = [
    {
      id: 'compliance-audit-reports',
      title: 'Compliance & Audit Reports',
      description: 'Regulatory packs, evidence bundles, and audit readiness.',
      path: '/reporting-analytics/compliance-audit-reports',
      color: 'primary'
    },
    {
      id: 'guarantee-exposure',
      title: 'Guarantee Exposure',
      description: 'Aggregate exposure, concentration, and maturity ladders.',
      path: '/reporting-analytics/guarantee-exposure',
      color: 'success'
    },
    {
      id: 'custom-report-builder',
      title: 'Custom Report Builder',
      description: 'Drag-and-drop datasets with saved views and sharing.',
      path: '/reporting-analytics/custom-report-builder',
      color: 'warning'
    },
    {
      id: 'bi-connectors',
      title: 'BI Connectors',
      description: 'Power BI, Tableau, and warehouse feed connectors.',
      path: '/reporting-analytics/bi-connectors',
      color: 'info'
    }
  ]

  const handleModuleClick = (module) => {
    navigate(module.path)
  }

  return (
    <div className="reporting-analytics-modules app-module-hub">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h2>Reporting & Analytics</h2>
              <p className="text-muted">
                Comprehensive reporting and analytics platform for tender management insights
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

export default ReportingAnalytics
