import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../../components/hub/HubModuleIcon'
import './PreQualification.scss'

const PreQualification = () => {
  const navigate = useNavigate()

  const modules = [
    {
      id: 'customer-management',
      title: 'Customer Management',
      description: 'Accounts, hierarchies, and relationship context.',
      path: '/tender-intelligence/prequalification/customer-management',
      color: 'primary'
    },
    {
      id: 'certification-tracking',
      title: 'Certification Tracking',
      description: 'ISO, CE, UL, FDA certs with evidence artifacts.',
      path: '/tender-intelligence/prequalification/certification-tracking',
      color: 'success'
    },
    {
      id: 'expiry-monitoring',
      title: 'Expiry Monitoring',
      description: 'Expiry radar with severity and countdown rules.',
      path: '/tender-intelligence/prequalification/expiry-monitoring',
      color: 'warning'
    },
    {
      id: 'automated-reminders',
      title: 'Automated Reminders',
      description: 'Renewal queues, escalations, and owner nudges.',
      path: '/tender-intelligence/prequalification/automated-reminders',
      color: 'info'
    },
    {
      id: 'compliance-dashboard',
      title: 'Compliance Dashboard',
      description: 'Heatmaps, coverage ratios, and open findings.',
      path: '/tender-intelligence/prequalification/compliance-dashboard',
      color: 'primary'
    },
    {
      id: 'performance-scoring',
      title: 'Performance Scoring',
      description: 'Vendor scorecards with trends and thresholds.',
      path: '/tender-intelligence/prequalification/performance-scoring',
      color: 'success'
    },
    {
      id: 'document-verification',
      title: 'Document Verification',
      description: 'Check authenticity, versioning, and sign-offs.',
      path: '/tender-intelligence/prequalification/document-verification',
      color: 'warning'
    },
    {
      id: 'qualification-levels',
      title: 'Qualification Levels',
      description: 'Tiered programs with prerequisites and approvals.',
      path: '/tender-intelligence/prequalification/qualification-levels',
      color: 'info'
    },
    {
      id: 'audit-trail',
      title: 'Audit Trail',
      description: 'Who changed what, when—with exportable timelines.',
      path: '/tender-intelligence/prequalification/audit-trail',
      color: 'secondary'
    },
    {
      id: 'external-integration',
      title: 'External Integration',
      description: 'Connect MDM, ERP, and third-party vendor registries.',
      path: '/tender-intelligence/prequalification/external-integration',
      color: 'primary'
    },
    {
      id: 'bulk-operations',
      title: 'Bulk Operations',
      description: 'CSV import/export with validation templates.',
      path: '/tender-intelligence/prequalification/bulk-operations',
      color: 'success'
    },
    {
      id: 'custom-criteria',
      title: 'Custom Criteria',
      description: 'Define bespoke checks and reviewer playbooks.',
      path: '/tender-intelligence/prequalification/custom-criteria',
      color: 'warning'
    }
  ]

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
