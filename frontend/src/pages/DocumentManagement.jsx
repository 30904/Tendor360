import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../components/hub/HubModuleIcon'
import './DocumentManagement.scss'

const DocumentManagement = () => {
  const navigate = useNavigate()

  const modules = [
    {
      id: 'content-library',
      title: 'Content Library',
      description: 'Organize and reuse document content across submissions.',
      path: '/document-management/content-library',
      color: 'primary'
    },
    {
      id: 'submission-builder',
      title: 'Submission Builder',
      description: 'Assemble submission packages and response binders.',
      path: '/document-management/submission-builder',
      color: 'success'
    },
    {
      id: 'version-control',
      title: 'Version Control',
      description: 'Track document versions, deltas, and approvals.',
      path: '/document-management/version-control',
      color: 'warning'
    },
    {
      id: 'template-library',
      title: 'Template Library',
      description: 'Standard clauses, templates, and reusable blocks.',
      path: '/document-management/templates',
      color: 'info'
    },
    {
      id: 'data-rooms',
      title: 'Data Rooms',
      description: 'Secure sharing, access control, and collaboration.',
      path: '/document-management/data-rooms',
      color: 'primary'
    },
    {
      id: 'redaction-rules',
      title: 'Redaction Rules',
      description: 'Policy-driven masking and privileged content controls.',
      path: '/document-management/redaction-rules',
      color: 'success'
    },
    {
      id: 'esign-packages',
      title: 'eSign Packages',
      description: 'Bundle documents for compliant e-signature workflows.',
      path: '/document-management/esign-packages',
      color: 'warning'
    },
    {
      id: 'legal-hold',
      title: 'Legal Hold',
      description: 'Legal hold, retention schedules, and defensible holds.',
      path: '/document-management/legal-hold',
      color: 'info'
    },
    {
      id: 'ai-analysis',
      title: 'AI Document Analysis',
      description: 'AI-assisted extraction, classification, and risk signals.',
      path: '/document-management/ai-analysis',
      color: 'primary'
    }
  ]

  const handleModuleClick = (module) => {
    navigate(module.path)
  }

  return (
    <div className="document-management-modules app-module-hub">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h2>Document Management</h2>
              <p className="text-muted">Comprehensive document processing, storage, and collaboration platform</p>
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

export default DocumentManagement
