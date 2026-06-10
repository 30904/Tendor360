import React from 'react'
import { Container, Row, Col, Card, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../components/hub/HubModuleIcon'
import './RFPManagement.scss'

const RFPManagement = () => {
  const navigate = useNavigate()

  const modules = [
    {
      id: 'create-rfp',
      title: 'Create RFP',
      description: 'Structured metadata, timelines, scopes, and response skeleton.',
      path: '/rfp-management/create',
      color: 'primary',
      status: 'Ready'
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      description: 'Section RACI, handoffs, and progress across authoring teams.',
      path: '/rfp-management/teams',
      color: 'success',
      status: 'Ready'
    },
    {
      id: 'publish-rfp',
      title: 'Publish RFP',
      description: 'Approver gates plus controlled release to short-listed vendors.',
      path: '/rfp-management/publish',
      color: 'warning',
      status: 'Ready'
    },
    {
      id: 'rfp-tracking',
      title: 'Track RFP',
      description: 'Participation funnel, milestones, reminders, and response health.',
      path: '/rfp-management/tracking',
      color: 'info',
      status: 'Ready'
    },
    {
      id: 'ai-copilot',
      title: 'AI RFP Copilot',
      description: 'Prompt-guided drafting, tone polish, and executive summaries.',
      path: '/rfp-management/ai-copilot',
      color: 'primary',
      status: 'AI Enabled'
    }
  ]

  return (
    <div className="rfp-management-modules app-module-hub">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h2>RFP Management</h2>
              <p className="text-muted">
                Create, collaborate, publish, and track RFP workflows with AI-assisted authoring.
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
                  onClick={() => navigate(module.path)}
                >
                  <Card.Body>
                    <div className="module-content">
                      <div className="module-icon">
                        <HubModuleIcon moduleId={module.id} />
                      </div>
                      <div className="module-text">
                          <div className="module-header-row">
                            <h5 className="module-title">{module.title}</h5>
                            <Badge bg="light" text="dark" className="module-status-badge">
                              {module.status}
                            </Badge>
                          </div>
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

export default RFPManagement
