import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../components/hub/HubModuleIcon'
import './PostAwardTracker.scss'

const PostAwardTracker = () => {
  const navigate = useNavigate()

  const modules = [
    {
      id: 'slas-kpis',
      title: 'SLAs & KPIs',
      description: 'Track service levels, penalties, and performance KPIs.',
      path: '/post-award-tracker/slas-kpis',
      color: 'primary'
    },
    {
      id: 'milestones-billing',
      title: 'Milestones & Billing',
      description: 'Billing milestones, retainers, and invoice triggers.',
      path: '/post-award-tracker/milestones-billing',
      color: 'success'
    },
    {
      id: 'vendor-performance',
      title: 'Vendor/Partner Performance',
      description: 'Scorecards, incidents, and continuous improvement.',
      path: '/post-award-tracker/vendor-performance',
      color: 'warning'
    },
    {
      id: 'closeout-archive',
      title: 'Closeout & Archive',
      description: 'Formal closeout packs and archival policy.',
      path: '/post-award-tracker/closeout-archive',
      color: 'info'
    },
    {
      id: 'guarantees-contract',
      title: 'Guarantees & Deposits',
      description: 'Performance bonds, retentions, and release conditions.',
      path: '/post-award-tracker/guarantees-contract',
      color: 'primary'
    },
    {
      id: 'change-orders',
      title: 'Change Orders',
      description: 'Scope changes, commercial impact, and approvals.',
      path: '/post-award-tracker/change-orders',
      color: 'success'
    },
    {
      id: 'claims-risks',
      title: 'Claims & Risks',
      description: 'Claims register, disputes, and mitigation tracker.',
      path: '/post-award-tracker/claims-risks',
      color: 'warning'
    },
    {
      id: 'handover-delivery',
      title: 'Handover to Delivery',
      description: 'Transition to execution with RACI and assets.',
      path: '/post-award-tracker/handover-delivery',
      color: 'info'
    },
    {
      id: 'handover',
      title: 'Project Handover',
      description: 'Manage the transition from bidding to operational handover.',
      path: '/post-award-tracker/handover',
      color: 'primary'
    },
    {
      id: 'guarantees-deposits',
      title: 'Guarantees & Deposits',
      description: 'Manage guarantees and security deposits after award with lifecycle tracking.',
      path: '/post-award-tracker/guarantees-deposits',
      color: 'success'
    },
    {
      id: 'obligations-slas',
      title: 'Obligations & SLAs',
      description: 'Track post-award contractual obligations and SLA targets.',
      path: '/post-award-tracker/obligations-slas',
      color: 'warning'
    }
  ]

  const handleModuleClick = (module) => {
    navigate(module.path)
  }

  return (
    <div className="post-award-tracker-modules app-module-hub">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h2>Post-Award Tracker</h2>
              <p className="text-muted">
                Comprehensive contract management, performance monitoring, and delivery tracking
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

export default PostAwardTracker
