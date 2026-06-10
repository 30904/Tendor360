import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Shield, FileText, Brain, CheckCircle, AlertTriangle, DollarSign, TrendingUp, BarChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TableActionsCell from '../../components/TableActionsCell'
import { buildTableActions, runTableAction } from '../../utils/tableActions'
import './Guardrails.scss'

const Guardrails = () => {
  const navigate = useNavigate()
  const [guardrails, setGuardrails] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedGuardrail, setSelectedGuardrail] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setGuardrails([
      {
        id: 1,
        name: 'Minimum Margin Guardrail',
        description: 'Enforce minimum profit margin requirements',
        type: 'Margin',
        status: 'Active',
        threshold: 8.0,
        unit: '%',
        action: 'Block',
        createdDate: '2024-01-15',
        lastTriggered: '2024-01-20',
        triggeredCount: 3,
        aiRecommendation: 'Consider adjusting threshold based on market conditions',
        aiConfidence: 85,
        scope: [
          'All construction projects',
          'Software implementation contracts',
          'Infrastructure development'
        ],
        exceptions: [
          'Strategic partnerships',
          'Market entry scenarios',
          'Long-term contracts (>3 years)'
        ]
      },
      {
        id: 2,
        name: 'Maximum Price Ceiling',
        description: 'Prevent excessive pricing above market rates',
        type: 'Price',
        status: 'Active',
        threshold: 20000000,
        unit: 'USD',
        action: 'Require Approval',
        createdDate: '2024-01-10',
        lastTriggered: '2024-01-18',
        triggeredCount: 1,
        aiRecommendation: 'Threshold appropriate for current market conditions',
        aiConfidence: 92,
        scope: [
          'All tender submissions',
          'Direct negotiations',
          'Framework agreements'
        ],
        exceptions: [
          'Emergency contracts',
          'Sole source scenarios',
          'High-risk projects'
        ]
      },
      {
        id: 3,
        name: 'Cost Escalation Limit',
        description: 'Limit cost escalation factors in pricing',
        type: 'Escalation',
        status: 'Warning',
        threshold: 15.0,
        unit: '%',
        action: 'Alert',
        createdDate: '2024-01-05',
        lastTriggered: '2024-01-12',
        triggeredCount: 5,
        aiRecommendation: 'Consider tightening threshold to improve competitiveness',
        aiConfidence: 78,
        scope: [
          'Multi-year contracts',
          'Fixed-price agreements',
          'Cost-plus contracts'
        ],
        exceptions: [
          'Inflation-indexed contracts',
          'Commodity-based pricing',
          'Government contracts'
        ]
      }
    ])

    setStats({
      totalGuardrails: 3,
      active: 2,
      warning: 1,
      totalTriggers: 9,
      aiConfidence: 85,
      avgThreshold: 12.5,
      complianceRate: 94
    })
  }, [])

  const handleViewGuardrail = (guardrail) => {
    setSelectedGuardrail(guardrail)
    setShowModal(true)
  }

  const getGuardrailActions = (guardrail) =>
    buildTableActions({
      onView: true,
      onEdit: true,
      custom: [
        {
          type: 'custom',
          key: 'toggle',
          label: guardrail.status === 'Active' ? 'Deactivate' : 'Activate',
          icon: 'sync'
        }
      ]
    })

  const handleGuardrailAction = (action, guardrail) => {
    runTableAction(action, guardrail, {
      onView: handleViewGuardrail,
      onEdit: handleViewGuardrail,
      toggle: () => handleToggleStatus(guardrail)
    })
  }

  const handleToggleStatus = (guardrail) => {
    const newStatus = guardrail.status === 'Active' ? 'Inactive' : 'Active'
    if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} "${guardrail.name}"?`)) {
      setGuardrails(prev => prev.map(g => 
        g.id === guardrail.id ? { ...g, status: newStatus } : g
      ))
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Warning': 'warning',
      'Error': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getActionBadge = (action) => {
    const variants = {
      'Block': 'danger',
      'Require Approval': 'warning',
      'Alert': 'info',
      'Log': 'secondary'
    }
    return <Badge bg={variants[action] || 'secondary'}>{action}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Margin': DollarSign,
      'Price': DollarSign,
      'Escalation': TrendingUp,
      'Volume': BarChart
    }
    return icons[type] || Settings
  }

  const formatThreshold = (threshold, unit) => {
    if (unit === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(threshold)
    }
    return `${threshold}${unit}`
  }

  const insightItems = useMemo(() => [
    {
      title: 'AI guardrail insight',
      detail: `${stats.totalGuardrails || 0} guardrails active with ${stats.totalTriggers || 0} total triggers. Compliance rate is ${stats.complianceRate}% with ${stats.aiConfidence}% AI confidence.`,
      tone: 'info'
    }
  ], [stats.totalGuardrails, stats.totalTriggers, stats.complianceRate, stats.aiConfidence])

  return (
    <>
      <ExecutiveCommandCenter
        className="guardrails-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Guardrails', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Guardrails"
        description="Configure pricing limits and approval workflows with AI-powered monitoring"
        heroMeta="Control tower"
        outlookTitle="Guardrail outlook"
        outlookDescription={`${stats.totalGuardrails || 0} policies — ${stats.totalTriggers || 0} lifetime triggers, ${stats.complianceRate || 0}% compliance posture.`}
        outlookChips={[
          `${stats.totalGuardrails || 0} guardrails`,
          `${stats.totalTriggers || 0} triggers`,
          `${stats.complianceRate || 0}% compliance`,
          `${stats.aiConfidence || 0}% AI confidence`
        ]}
        insights={insightItems}
        kpiTitle="Guardrail signal board"
        kpiMeta="Triggers vs compliance"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total guardrails"
                value={stats.totalGuardrails || 0}
                hint="Active controls"
                tone="intel"
                trend="Coverage"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total triggers"
                value={stats.totalTriggers || 0}
                hint="Historical firings"
                tone="warning"
                trend="Load"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Compliance rate"
                value={stats.complianceRate || 0}
                hint="Adherence signal"
                tone={(stats.complianceRate || 0) >= 90 ? 'success' : 'warning'}
                trend="Discipline"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence || 0}
                hint="Model assurance"
                tone="intel"
                trend="Trust"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Pricing guardrails (${guardrails.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              New Guardrail
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
                placeholder="Search guardrails..."
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
                        <th>Guardrail Details</th>
                        <th>Type</th>
                        <th>Threshold</th>
                        <th>Action</th>
                        <th>Triggers</th>
                        <th>Status</th>
                        <th className="table-actions-col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guardrails.filter(guardrail => 
                        !searchTerm || 
                        guardrail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        guardrail.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        guardrail.description.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((guardrail) => {
                        const TypeIcon = getTypeIcon(guardrail.type)
                        return (
                          <tr key={guardrail.id}>
                            <td>
                              <div className="guardrail-info">
                                <h6 className="mb-1">{guardrail.name}</h6>
                                <p className="text-muted mb-1">{guardrail.description}</p>
                                <small className="text-muted">
                                  Created: {guardrail.createdDate} • Last triggered: {guardrail.lastTriggered}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="type-info">
                                <div className="d-flex align-items-center">
                                  <TypeIcon size={16} className="me-1" />
                                  <span>{guardrail.type}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="threshold-info">
                                <div className="fw-medium">{formatThreshold(guardrail.threshold, guardrail.unit)}</div>
                              </div>
                            </td>
                            <td>{getActionBadge(guardrail.action)}</td>
                            <td>
                              <div className="triggers-info">
                                <div className="d-flex align-items-center">
                                  <AlertTriangle size={16} className="me-1" />
                                  <span>{guardrail.triggeredCount}</span>
                                </div>
                              </div>
                            </td>
                            <td>{getStatusBadge(guardrail.status)}</td>
                            <td className="table-actions-col">
                              <TableActionsCell
                                actions={getGuardrailActions(guardrail)}
                                onAction={(action) => handleGuardrailAction(action, guardrail)}
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </div>
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Shield size={20} className="me-2" />
              Guardrail Details - {selectedGuardrail?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedGuardrail && (
              <div className="guardrail-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedGuardrail.type}</p>
                    <p><strong>Status:</strong> {selectedGuardrail.status}</p>
                    <p><strong>Threshold:</strong> {formatThreshold(selectedGuardrail.threshold, selectedGuardrail.unit)}</p>
                    <p><strong>Action:</strong> {selectedGuardrail.action}</p>
                    <p><strong>Created:</strong> {selectedGuardrail.createdDate}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Activity</h6>
                    <p><strong>Last Triggered:</strong> {selectedGuardrail.lastTriggered}</p>
                    <p><strong>Total Triggers:</strong> {selectedGuardrail.triggeredCount}</p>
                    <p><strong>AI Confidence:</strong> {selectedGuardrail.aiConfidence}%</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedGuardrail.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={6}>
                    <h6>Scope</h6>
                    <ul className="scope-list">
                      {selectedGuardrail.scope.map((item, index) => (
                        <li key={index} className="scope-item">
                          <CheckCircle size={14} className="me-2 text-success" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>Exceptions</h6>
                    <ul className="exceptions-list">
                      {selectedGuardrail.exceptions.map((item, index) => (
                        <li key={index} className="exception-item">
                          <AlertTriangle size={14} className="me-2 text-warning" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Assessment & Recommendation</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Recommendation:</strong> {selectedGuardrail.aiRecommendation}
                    </Alert>
                    <Alert variant="success">
                      <CheckCircle size={16} className="me-2" />
                      <strong>Confidence Level:</strong> {selectedGuardrail.aiConfidence}% based on historical trigger patterns and market analysis
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
              Edit Guardrail
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default Guardrails