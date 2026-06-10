import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, TrendingUp, Calculator, Brain, BarChart, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TableActionsCell from '../../components/TableActionsCell'
import { buildTableActions, runTableAction } from '../../utils/tableActions'
import './Indexation.scss'

const Indexation = () => {
  const navigate = useNavigate()
  const [indexations, setIndexations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedIndexation, setSelectedIndexation] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setIndexations([
      {
        id: 1,
        name: 'Consumer Price Index (CPI)',
        description: 'Monthly CPI adjustment for labor costs',
        type: 'Labor',
        baseValue: 100.0,
        currentValue: 108.5,
        changePercent: 8.5,
        frequency: 'Monthly',
        lastUpdated: '2024-01-15',
        status: 'Active',
        aiPrediction: 'Expected to increase by 2.3% next month',
        aiConfidence: 87,
        tenderId: 'TEN-2024-001',
        impact: 'High',
        category: 'Economic'
      },
      {
        id: 2,
        name: 'Producer Price Index (PPI)',
        description: 'Quarterly PPI adjustment for material costs',
        type: 'Materials',
        baseValue: 100.0,
        currentValue: 112.3,
        changePercent: 12.3,
        frequency: 'Quarterly',
        lastUpdated: '2024-01-10',
        status: 'Active',
        aiPrediction: 'Stable trend expected with 1.1% increase',
        aiConfidence: 92,
        tenderId: 'TEN-2024-002',
        impact: 'Medium',
        category: 'Economic'
      },
      {
        id: 3,
        name: 'Fuel Price Index',
        description: 'Weekly fuel price adjustments for transportation',
        type: 'Transportation',
        baseValue: 100.0,
        currentValue: 95.2,
        changePercent: -4.8,
        frequency: 'Weekly',
        lastUpdated: '2024-01-20',
        status: 'Active',
        aiPrediction: 'Volatile market, expect 3.2% fluctuation',
        aiConfidence: 75,
        tenderId: 'TEN-2024-003',
        impact: 'High',
        category: 'Commodity'
      }
    ])

    setStats({
      totalIndexations: 3,
      active: 3,
      averageChange: 5.3,
      highImpact: 2,
      aiConfidence: 85,
      lastUpdate: '2024-01-20'
    })
  }, [])

  const handleViewIndexation = (indexation) => {
    setSelectedIndexation(indexation)
    setShowModal(true)
  }

  const handleDeleteIndexation = (indexation) => {
    if (window.confirm(`Are you sure you want to delete "${indexation.name}"?`)) {
      setIndexations((prev) => prev.filter((item) => item.id !== indexation.id))
    }
  }

  const getIndexationActions = () =>
    buildTableActions({ onView: true, onEdit: true, onDelete: true })

  const handleIndexationAction = (action, indexation) => {
    runTableAction(action, indexation, {
      onView: handleViewIndexation,
      onEdit: handleViewIndexation,
      onDelete: handleDeleteIndexation
    })
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Suspended': 'warning'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getImpactBadge = (impact) => {
    const variants = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'info'
    }
    return <Badge bg={variants[impact] || 'secondary'}>{impact}</Badge>
  }

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success'
    if (change < 0) return 'text-danger'
    return 'text-muted'
  }

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp size={16} className="text-success" />
    if (change < 0) return <TrendingUp size={16} className="text-danger" style={{ transform: 'rotate(180deg)' }} />
    return <BarChart size={16} className="text-muted" />
  }

  const insightItems = useMemo(() => [
    {
      title: 'AI indexation insight',
      detail: `Average indexation change is ${stats.averageChange}% with ${stats.aiConfidence}% AI confidence. ${stats.highImpact} indexations have high impact on pricing. Last updated: ${stats.lastUpdate}`,
      tone: 'info'
    }
  ], [stats.averageChange, stats.aiConfidence, stats.highImpact, stats.lastUpdate])

  return (
    <>
      <ExecutiveCommandCenter
        className="indexation-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Indexation', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Indexation"
        description="Manage price indexation and inflation adjustments with AI-powered predictions"
        heroMeta="Index intelligence"
        outlookTitle="Indexation outlook"
        outlookDescription={`${stats.totalIndexations || 0} indices — ${stats.averageChange || 0}% avg move, ${stats.highImpact || 0} high-impact, last refresh ${stats.lastUpdate || '—'}.`}
        outlookChips={[
          `${stats.totalIndexations || 0} tracked`,
          `${stats.averageChange || 0}% avg change`,
          `${stats.aiConfidence || 0}% AI confidence`,
          `${stats.highImpact || 0} high impact`
        ]}
        insights={insightItems}
        kpiTitle="Index signal board"
        kpiMeta="Drift vs impact"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total indexations"
                value={stats.totalIndexations || 0}
                hint="Active indices"
                tone="intel"
                trend="Coverage"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg change"
                value={stats.averageChange || 0}
                hint="Period movement"
                tone="warning"
                trend="Drift"
                suffix="%"
                icon={<Calculator size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence || 0}
                hint="Forecast trust"
                tone="intel"
                trend="Signal"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="High impact"
                value={stats.highImpact || 0}
                hint="Pricing sensitivity"
                tone="warning"
                trend="Risk"
                icon={<DollarSign size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Price indexations (${indexations.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              New Indexation
            </Button>
            <Button variant="outline-secondary">
              <Calculator size={16} className="me-2" />
              Calculate Impact
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
                placeholder="Search indexations..."
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
                        <th>Indexation Details</th>
                        <th>Type</th>
                        <th>Current Value</th>
                        <th>Change</th>
                        <th>Frequency</th>
                        <th>Impact</th>
                        <th>AI Prediction</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indexations.filter(indexation => 
                        !searchTerm || 
                        indexation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        indexation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        indexation.category.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((indexation) => (
                        <tr key={indexation.id}>
                          <td>
                            <div className="indexation-info">
                              <h6 className="mb-1">{indexation.name}</h6>
                              <p className="text-muted mb-1">{indexation.description}</p>
                              <small className="text-muted">
                                {indexation.tenderId} • Last updated: {indexation.lastUpdated}
                              </small>
                            </div>
                          </td>
                          <td>
                            <Badge bg="info" className="type-badge">
                              {indexation.type}
                            </Badge>
                          </td>
                          <td>
                            <div className="value-info">
                              <div className="d-flex align-items-center">
                                <DollarSign size={16} className="me-1" />
                                <span className="fw-medium">{indexation.currentValue}</span>
                              </div>
                              <small className="text-muted">Base: {indexation.baseValue}</small>
                            </div>
                          </td>
                          <td>
                            <div className="change-info">
                              <div className="d-flex align-items-center">
                                {getChangeIcon(indexation.changePercent)}
                                <span className={`ms-1 fw-medium ${getChangeColor(indexation.changePercent)}`}>
                                  {indexation.changePercent > 0 ? '+' : ''}{indexation.changePercent}%
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="frequency-info">
                              <Badge bg="secondary" className="frequency-badge">
                                {indexation.frequency}
                              </Badge>
                            </div>
                          </td>
                          <td>{getImpactBadge(indexation.impact)}</td>
                          <td>
                            <div className="ai-prediction">
                              <div className="d-flex align-items-center mb-1">
                                <Brain size={14} className="me-1 text-primary" />
                                <span className="text-primary fw-medium">{indexation.aiConfidence}%</span>
                              </div>
                              <small className="text-muted">{indexation.aiPrediction}</small>
                            </div>
                          </td>
                          <td className="table-actions-col">
                            <TableActionsCell
                              actions={getIndexationActions()}
                              onAction={(action) => handleIndexationAction(action, indexation)}
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
              <TrendingUp size={20} className="me-2" />
              Indexation Details - {selectedIndexation?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedIndexation && (
              <div className="indexation-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedIndexation.type}</p>
                    <p><strong>Category:</strong> {selectedIndexation.category}</p>
                    <p><strong>Frequency:</strong> {selectedIndexation.frequency}</p>
                    <p><strong>Status:</strong> {selectedIndexation.status}</p>
                    <p><strong>Tender ID:</strong> {selectedIndexation.tenderId}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Value Information</h6>
                    <p><strong>Base Value:</strong> {selectedIndexation.baseValue}</p>
                    <p><strong>Current Value:</strong> {selectedIndexation.currentValue}</p>
                    <p><strong>Change:</strong> {selectedIndexation.changePercent > 0 ? '+' : ''}{selectedIndexation.changePercent}%</p>
                    <p><strong>Impact:</strong> {selectedIndexation.impact}</p>
                    <p><strong>Last Updated:</strong> {selectedIndexation.lastUpdated}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedIndexation.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Prediction & Analysis</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Confidence:</strong> {selectedIndexation.aiConfidence}% • <strong>Prediction:</strong> {selectedIndexation.aiPrediction}
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
              <Calculator size={16} className="me-2" />
              Calculate Impact
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default Indexation
