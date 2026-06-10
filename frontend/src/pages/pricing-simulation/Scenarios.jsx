import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Calculator, FileText, Brain, CheckCircle, DollarSign, TrendingUp, BarChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TableActionsCell from '../../components/TableActionsCell'
import { buildTableActions, runTableAction } from '../../utils/tableActions'
import './Scenarios.scss'

const Scenarios = () => {
  const navigate = useNavigate()
  const [scenarios, setScenarios] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setScenarios([
      {
        id: 1,
        name: 'Base Case Scenario',
        description: 'Standard pricing scenario with baseline assumptions',
        tenderId: 'TEN-2024-001',
        client: 'Ministry of Transport',
        status: 'Active',
        createdDate: '2024-01-15',
        lastModified: '2024-01-20',
        basePrice: 15000000,
        currency: 'USD',
        margin: 12.5,
        winProbability: 75,
        aiOptimization: 'Optimized for competitive positioning',
        aiConfidence: 88,
        variables: [
          'Material costs: $8.5M',
          'Labor costs: $4.2M',
          'Equipment: $1.8M',
          'Overhead: $0.5M'
        ],
        assumptions: [
          'Standard material pricing',
          'Normal labor rates',
          '6-month project duration',
          'No major risk factors'
        ]
      },
      {
        id: 2,
        name: 'Aggressive Pricing',
        description: 'Competitive pricing scenario to win market share',
        tenderId: 'TEN-2024-002',
        client: 'Health Ministry',
        status: 'Active',
        createdDate: '2024-01-10',
        lastModified: '2024-01-18',
        basePrice: 12000000,
        currency: 'USD',
        margin: 8.0,
        winProbability: 85,
        aiOptimization: 'High win probability with reduced margins',
        aiConfidence: 92,
        variables: [
          'Material costs: $7.8M',
          'Labor costs: $3.5M',
          'Equipment: $1.5M',
          'Overhead: $0.2M'
        ],
        assumptions: [
          'Bulk material discounts',
          'Efficient labor utilization',
          '5-month project duration',
          'Acceptable risk tolerance'
        ]
      },
      {
        id: 3,
        name: 'Premium Quality',
        description: 'High-quality scenario with premium pricing',
        tenderId: 'TEN-2024-003',
        client: 'City Development Authority',
        status: 'Draft',
        createdDate: '2024-01-05',
        lastModified: '2024-01-12',
        basePrice: 18000000,
        currency: 'USD',
        margin: 18.0,
        winProbability: 45,
        aiOptimization: 'Premium positioning for quality-focused clients',
        aiConfidence: 78,
        variables: [
          'Premium materials: $10.5M',
          'Skilled labor: $5.2M',
          'Advanced equipment: $2.1M',
          'Quality overhead: $0.2M'
        ],
        assumptions: [
          'Premium material specifications',
          'Highly skilled workforce',
          '8-month project duration',
          'Quality-first approach'
        ]
      }
    ])

    setStats({
      totalScenarios: 3,
      active: 2,
      draft: 1,
      avgMargin: 12.8,
      avgWinProbability: 68,
      aiConfidence: 86,
      totalValue: 45000000
    })
  }, [])

  const handleViewScenario = (scenario) => {
    setSelectedScenario(scenario)
    setShowModal(true)
  }

  const getScenarioActions = () =>
    buildTableActions({
      onView: true,
      onEdit: true,
      onCopy: true,
      labels: { copy: 'Duplicate' }
    })

  const handleScenarioAction = (action, scenario) => {
    runTableAction(action, scenario, {
      onView: handleViewScenario,
      onEdit: handleViewScenario,
      onCopy: handleDuplicateScenario
    })
  }

  const handleDuplicateScenario = (scenario) => {
    if (window.confirm(`Are you sure you want to duplicate "${scenario.name}"?`)) {
      const newScenario = {
        ...scenario,
        id: Date.now(),
        name: `${scenario.name} (Copy)`,
        status: 'Draft',
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      }
      setScenarios(prev => [...prev, newScenario])
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Draft': 'warning',
      'Archived': 'secondary',
      'Completed': 'info'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getWinProbabilityColor = (probability) => {
    if (probability >= 80) return 'success'
    if (probability >= 60) return 'primary'
    if (probability >= 40) return 'warning'
    return 'danger'
  }

  const insightItems = useMemo(() => {
    const m = (stats.totalValue || 0) / 1000000
    return [
      {
        title: 'AI scenario insight',
        detail: `${stats.totalScenarios || 0} scenarios with $${m.toFixed(1)}M total value. Average win probability is ${stats.avgWinProbability}% with ${stats.aiConfidence}% AI confidence.`,
        tone: 'info'
      }
    ]
  }, [stats.totalScenarios, stats.avgWinProbability, stats.aiConfidence, stats.totalValue])

  const totalValueM = (stats.totalValue || 0) / 1000000

  return (
    <>
      <ExecutiveCommandCenter
        className="scenarios-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Scenarios', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Scenarios"
        description="Create and manage pricing scenarios with AI-powered optimization"
        heroMeta="Scenario intelligence"
        outlookTitle="Scenario outlook"
        outlookDescription={`${stats.totalScenarios || 0} scenarios — $${totalValueM.toFixed(1)}M book, ${stats.active || 0} active, ${stats.draft || 0} draft.`}
        outlookChips={[
          `${stats.totalScenarios || 0} total`,
          `$${totalValueM.toFixed(1)}M value`,
          `${stats.avgWinProbability || 0}% avg win prob`,
          `${stats.aiConfidence || 0}% AI confidence`
        ]}
        insights={insightItems}
        kpiTitle="Scenario signal board"
        kpiMeta="Value vs win rate"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total scenarios"
                value={stats.totalScenarios || 0}
                hint="Modeled postures"
                tone="intel"
                trend="Library"
                icon={<Calculator size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total value"
                displayValue={`$${totalValueM.toFixed(1)}M`}
                hint="Aggregate scenario value"
                tone="success"
                trend="Scale"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg win probability"
                value={stats.avgWinProbability || 0}
                hint="Expected capture"
                tone={(stats.avgWinProbability || 0) >= 70 ? 'success' : 'warning'}
                trend="Momentum"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence || 0}
                hint="Model trust"
                tone="intel"
                trend="Calibration"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Pricing scenarios (${scenarios.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              New Scenario
            </Button>
            <Button variant="outline-secondary">
              <FileText size={16} className="me-2" />
              Export Report
            </Button>
          </>
        )}
      >
        <Row className="mb-4">
          <Col md={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Scenario Details</th>
                        <th>Client</th>
                        <th>Base Price</th>
                        <th>Margin</th>
                        <th>Win Probability</th>
                        <th>Status</th>
                        <th className="table-actions-col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarios.filter(scenario => 
                        !searchTerm || 
                        scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        scenario.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        scenario.tenderId.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((scenario) => (
                        <tr key={scenario.id}>
                          <td>
                            <div className="scenario-info">
                              <h6 className="mb-1">{scenario.name}</h6>
                              <p className="text-muted mb-1">{scenario.description}</p>
                              <small className="text-muted">
                                {scenario.tenderId} • Created: {scenario.createdDate}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="client-info">
                              {scenario.client}
                            </div>
                          </td>
                          <td>
                            <div className="price-info">
                              <div className="fw-medium">{formatCurrency(scenario.basePrice, scenario.currency)}</div>
                            </div>
                          </td>
                          <td>
                            <div className="margin-info">
                              <Badge bg="primary">{scenario.margin}%</Badge>
                            </div>
                          </td>
                          <td>
                            <div className="win-probability">
                              <Badge bg={getWinProbabilityColor(scenario.winProbability)}>
                                {scenario.winProbability}%
                              </Badge>
                            </div>
                          </td>
                          <td>{getStatusBadge(scenario.status)}</td>
                          <td className="table-actions-col">
                            <TableActionsCell
                              actions={getScenarioActions()}
                              onAction={(action) => handleScenarioAction(action, scenario)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Calculator size={20} className="me-2" />
              Scenario Details - {selectedScenario?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedScenario && (
              <div className="scenario-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Tender ID:</strong> {selectedScenario.tenderId}</p>
                    <p><strong>Client:</strong> {selectedScenario.client}</p>
                    <p><strong>Status:</strong> {selectedScenario.status}</p>
                    <p><strong>Created:</strong> {selectedScenario.createdDate}</p>
                    <p><strong>Last Modified:</strong> {selectedScenario.lastModified}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Pricing Details</h6>
                    <p><strong>Base Price:</strong> {formatCurrency(selectedScenario.basePrice, selectedScenario.currency)}</p>
                    <p><strong>Margin:</strong> {selectedScenario.margin}%</p>
                    <p><strong>Win Probability:</strong> {selectedScenario.winProbability}%</p>
                    <p><strong>AI Confidence:</strong> {selectedScenario.aiConfidence}%</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedScenario.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={6}>
                    <h6>Cost Variables</h6>
                    <ul className="variables-list">
                      {selectedScenario.variables.map((variable, index) => (
                        <li key={index} className="variable-item">
                          <DollarSign size={14} className="me-2 text-success" />
                          {variable}
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>Key Assumptions</h6>
                    <ul className="assumptions-list">
                      {selectedScenario.assumptions.map((assumption, index) => (
                        <li key={index} className="assumption-item">
                          <CheckCircle size={14} className="me-2 text-primary" />
                          {assumption}
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Assessment & Optimization</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Optimization:</strong> {selectedScenario.aiOptimization}
                    </Alert>
                    <Alert variant="success">
                      <BarChart size={16} className="me-2" />
                      <strong>Confidence Level:</strong> {selectedScenario.aiConfidence}% based on historical data and market analysis
                    </Alert>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary">
              <Edit size={16} className="me-2" />
              Edit Scenario
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default Scenarios