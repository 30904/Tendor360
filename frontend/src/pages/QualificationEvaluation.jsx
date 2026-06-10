import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../components/hub/HubModuleIcon'
import './QualificationEvaluation.scss'

const QualificationEvaluation = () => {
  const navigate = useNavigate()

  const modules = [
    {
      id: 'tender-type-structure',
      title: 'Tender Type & Structure',
      description: 'Configure tender types and evaluation frameworks.',
      path: '/qualification-evaluation/tender-type-structure',
      color: 'primary'
    },
    {
      id: 'bid-no-bid',
      title: 'Bid/No-Bid',
      description: 'Structured decisions with rationale and guardrails.',
      path: '/qualification-evaluation/bid-no-bid',
      color: 'success'
    },
    {
      id: 'compliance-matrix',
      title: 'Compliance Matrix',
      description: 'Requirement-to-response mapping and coverage.',
      path: '/qualification-evaluation/compliance-matrix',
      color: 'warning'
    },
    {
      id: 'clarifications',
      title: 'Q&A / Clarifications & Addenda',
      description: 'Issuer Q&A, clarifications, and formal addenda.',
      path: '/qualification-evaluation/clarifications',
      color: 'info'
    },
    {
      id: 'evaluation-scoring',
      title: 'Evaluation Models & Scoring',
      description: 'Weighted models, criteria, and scorer workflows.',
      path: '/qualification-evaluation/scoring',
      color: 'primary'
    },
    {
      id: 'risks-exceptions',
      title: 'Risks & Exceptions',
      description: 'Identify deviations, mitigations, and approvals.',
      path: '/qualification-evaluation/risk-exceptions',
      color: 'success'
    },
    {
      id: 'consortium-partners',
      title: 'Consortium / Partners',
      description: 'Joint bids, workshare, and partner obligations.',
      path: '/qualification-evaluation/consortium-partners',
      color: 'warning'
    },
    {
      id: 'approvals',
      title: 'Approvals (Pre-Award)',
      description: 'Delegation, sign-off, and audit-friendly approval paths.',
      path: '/qualification-evaluation/approvals',
      color: 'info'
    },
    {
      id: 'guarantees-pre-award',
      title: 'Guarantees & Deposits (Pre-Award)',
      description: 'Bid bonds, PGs, EMDs, and validity tracking.',
      path: '/qualification-evaluation/guarantees-pre-award',
      color: 'success'
    },
    {
      id: 'workspace-tasks',
      title: 'Workspace & Tasks',
      description: 'Collaborative workspace with tasks and checklists.',
      path: '/qualification-evaluation/workspace-tasks',
      color: 'warning'
    }
  ]

  const handleModuleClick = (module) => {
    navigate(module.path)
  }

  return (
    <div className="qualification-evaluation-modules app-module-hub">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h2>Qualification & Review</h2>
              <p className="text-muted">Opportunity qualification, structured review, and pursuit decision support</p>
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

export default QualificationEvaluation
