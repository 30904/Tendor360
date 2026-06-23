import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../components/hub/HubModuleIcon'
import './PricingSimulation.scss'

const PricingSimulation = () => {
  const navigate = useNavigate()

  const modules = [
    {
      id: 'scenarios',
      title: 'Scenarios',
      description: 'Model price scenarios with assumptions and overlays.',
      path: '/pricing-simulation/scenarios',
      color: 'primary'
    },
    {
      id: 'guardrails',
      title: 'Guardrails',
      description: 'Floor/ceiling rules, approvals, and policy envelopes.',
      path: '/pricing-simulation/guardrails',
      color: 'success'
    },
    {
      id: 'cpq-import',
      title: 'CPQ/Costing Import',
      description: 'Ingest BOM, routings, and CPQ-derived costs.',
      path: '/pricing-simulation/cpq-import',
      color: 'warning'
    },
    {
      id: 'pricing-approvals',
      title: 'Pricing Approvals',
      description: 'Route commercial decisions with evidence and SLA.',
      path: '/pricing-simulation/approvals',
      color: 'info'
    },
    {
      id: 'price-to-win',
      title: 'Price-to-Win',
      description: 'Competitive anchors, win-price bands, and sensitivity.',
      path: '/pricing-simulation/price-to-win',
      color: 'primary'
    },
    {
      id: 'indexation',
      title: 'Indexation & Escalation',
      description: 'Index-linked adjustments and escalation ladders.',
      path: '/pricing-simulation/indexation',
      color: 'success'
    },
    {
      id: 'guarantee-cost-model',
      title: 'Guarantee Cost Model',
      description: 'Price guarantees, bonding, and LC carry costs.',
      path: '/pricing-simulation/guarantee-cost-model',
      color: 'warning'
    },
    {
      id: 'duties-freight',
      title: 'Duties & Freight',
      description: 'Landed cost with duties, freight, and incoterms.',
      path: '/pricing-simulation/duties-freight',
      color: 'info'
    },
    {
      id: 'cashflow',
      title: 'Cashflow',
      description: 'Milestone-aligned cash projections and waterfalls.',
      path: '/pricing-simulation/cashflow',
      color: 'primary'
    },
    {
      id: 'fx-taxes',
      title: 'FX & Taxes',
      description: 'Foreign exchange impact and tax simulation overlays.',
      path: '/pricing-simulation/fx-taxes',
      color: 'success'
    }
  ]

  const handleModuleClick = (module) => {
    navigate(module.path)
  }

  return (
    <div className="pricing-simulation-modules app-module-hub">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h2>Pricing & Simulation</h2>
              <p className="text-muted">Advanced pricing optimization, scenario modeling, and win probability analysis</p>
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

export default PricingSimulation
