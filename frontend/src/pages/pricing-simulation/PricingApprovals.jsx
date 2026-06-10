import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, CheckCircle, AlertTriangle, Brain, FileText, User, DollarSign, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TableActionsCell from '../../components/TableActionsCell'
import { buildTableActions, runTableAction } from '../../utils/tableActions'
import './PricingApprovals.scss'

const PricingApprovals = () => {
  const navigate = useNavigate()
  const [approvals, setApprovals] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setApprovals([
      {
        id: 1,
        name: 'Highway Project Pricing Approval',
        description: 'Pricing approval for highway infrastructure project',
        tenderId: 'TEN-2024-001',
        client: 'Ministry of Transport',
        requestedBy: 'John Doe',
        requestedDate: '2024-01-20',
        status: 'Pending',
        priority: 'High',
        amount: 2500000,
        margin: 15.5,
        approver: 'Sarah Wilson',
        dueDate: '2024-01-25',
        aiRecommendation: 'Approve - Within acceptable margin range',
        aiConfidence: 92
      },
      {
        id: 2,
        name: 'Smart City Technology Pricing',
        description: 'Technology implementation pricing approval',
        tenderId: 'TEN-2024-002',
        client: 'City Development Authority',
        requestedBy: 'Jane Smith',
        requestedDate: '2024-01-19',
        status: 'Approved',
        priority: 'Medium',
        amount: 1800000,
        margin: 18.2,
        approver: 'Mike Johnson',
        dueDate: '2024-01-24',
        aiRecommendation: 'Approved - Competitive pricing with good margin',
        aiConfidence: 88
      },
      {
        id: 3,
        name: 'Healthcare Facility Construction',
        description: 'Construction project pricing approval',
        tenderId: 'TEN-2024-003',
        client: 'Health Ministry',
        requestedBy: 'Mike Johnson',
        requestedDate: '2024-01-18',
        status: 'Rejected',
        priority: 'Critical',
        amount: 3200000,
        margin: 12.0,
        approver: 'Sarah Wilson',
        dueDate: '2024-01-23',
        aiRecommendation: 'Review - Margin below threshold, consider revision',
        aiConfidence: 85
      }
    ])

    setStats({
      totalApprovals: 3,
      pending: 1,
      approved: 1,
      rejected: 1,
      totalAmount: 7500000,
      avgMargin: 15.2,
      avgAiConfidence: 88
    })
  }, [])

  const handleViewApproval = (approval) => {
    setSelectedApproval(approval)
    setShowModal(true)
  }

  const handleApprove = (approval) => {
    if (window.confirm(`Are you sure you want to approve "${approval.name}"?`)) {
      setApprovals(prev => prev.map(a => 
        a.id === approval.id ? { ...a, status: 'Approved' } : a
      ))
    }
  }

  const getApprovalActions = (approval) => {
    const custom =
      approval.status === 'Pending'
        ? [
            { type: 'custom', key: 'approve', label: 'Approve', icon: 'qualify' },
            { type: 'custom', key: 'reject', label: 'Reject', icon: 'risk', variant: 'danger' }
          ]
        : []
    return buildTableActions({ onView: true, custom })
  }

  const handleApprovalAction = (action, approval) => {
    runTableAction(action, approval, {
      onView: handleViewApproval,
      approve: () => handleApprove(approval),
      reject: () => handleReject(approval)
    })
  }

  const handleReject = (approval) => {
    if (window.confirm(`Are you sure you want to reject "${approval.name}"?`)) {
      setApprovals(prev => prev.map(a => 
        a.id === approval.id ? { ...a, status: 'Rejected' } : a
      ))
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'danger',
      'Under Review': 'info'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      'Critical': 'danger',
      'High': 'warning',
      'Medium': 'info',
      'Low': 'secondary'
    }
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const insightItems = useMemo(() => [
    {
      title: 'AI approval insight',
      detail: `Your pricing approvals have an average AI confidence of ${stats.avgAiConfidence}%. Consider reviewing rejected approvals to understand pricing patterns and improve future submissions.`,
      tone: 'info'
    }
  ], [stats.avgAiConfidence])

  return (
    <>
      <ExecutiveCommandCenter
        className="pricing-approvals-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Pricing Approvals', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Pricing Approvals"
        description="Manage pricing approval workflows with AI-powered recommendations"
        heroMeta="Approval desk"
        outlookTitle="Approval posture"
        outlookDescription={`${stats.totalApprovals || 0} items — ${stats.pending || 0} pending, ${stats.approved || 0} approved, ${stats.rejected || 0} rejected.`}
        outlookChips={[
          `${stats.totalApprovals || 0} total`,
          `${stats.pending || 0} pending`,
          formatCurrency(stats.totalAmount || 0),
          `${stats.avgAiConfidence || 0}% AI confidence`
        ]}
        insights={insightItems}
        kpiTitle="Approval signal board"
        kpiMeta="Capital vs margin"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total approvals"
                value={stats.totalApprovals || 0}
                hint="In workflow"
                tone="intel"
                trend="Volume"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total amount"
                displayValue={formatCurrency(stats.totalAmount || 0)}
                hint="Requested value"
                tone="success"
                trend="Scale"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg margin"
                value={stats.avgMargin || 0}
                hint="Profitability guard"
                tone="warning"
                trend="Structure"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.avgAiConfidence || 0}
                hint="Model recommendation strength"
                tone="intel"
                trend="Assurance"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Pricing approvals (${approvals.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              New Approval
            </Button>
            <Button variant="outline-secondary">
              <FileText size={16} className="me-2" />
              Export
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
                placeholder="Search approvals..."
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
                        <th>Approval Details</th>
                        <th>Client</th>
                        <th>Amount</th>
                        <th>Margin</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>AI Recommendation</th>
                        <th className="table-actions-col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvals.filter(approval => 
                        !searchTerm || 
                        approval.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        approval.client.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((approval) => (
                        <tr key={approval.id}>
                          <td>
                            <div className="approval-info">
                              <h6 className="mb-1">{approval.name}</h6>
                              <p className="text-muted mb-1">{approval.description}</p>
                              <small className="text-muted">
                                {approval.tenderId} • Requested by {approval.requestedBy} • Due: {approval.dueDate}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="client-info">
                              <User size={16} className="me-1" />
                              {approval.client}
                            </div>
                          </td>
                          <td>
                            <div className="amount-info">
                              <strong>{formatCurrency(approval.amount)}</strong>
                            </div>
                          </td>
                          <td>
                            <div className="margin-info">
                              <Badge bg={approval.margin >= 15 ? 'success' : approval.margin >= 10 ? 'warning' : 'danger'}>
                                {approval.margin}%
                              </Badge>
                            </div>
                          </td>
                          <td>{getPriorityBadge(approval.priority)}</td>
                          <td>{getStatusBadge(approval.status)}</td>
                          <td>
                            <div className="ai-recommendation">
                              <div className="d-flex align-items-center mb-1">
                                <Brain size={14} className="me-1 text-primary" />
                                <small className="text-muted">({approval.aiConfidence}% confidence)</small>
                              </div>
                              <small className="text-muted">{approval.aiRecommendation}</small>
                            </div>
                          </td>
                          <td className="table-actions-col">
                            <TableActionsCell
                              actions={getApprovalActions(approval)}
                              onAction={(action) => handleApprovalAction(action, approval)}
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
              <CheckCircle size={20} className="me-2" />
              Pricing Approval Details - {selectedApproval?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedApproval && (
              <div className="approval-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Tender ID:</strong> {selectedApproval.tenderId}</p>
                    <p><strong>Client:</strong> {selectedApproval.client}</p>
                    <p><strong>Requested By:</strong> {selectedApproval.requestedBy}</p>
                    <p><strong>Requested Date:</strong> {selectedApproval.requestedDate}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Pricing Details</h6>
                    <p><strong>Amount:</strong> {formatCurrency(selectedApproval.amount)}</p>
                    <p><strong>Margin:</strong> {selectedApproval.margin}%</p>
                    <p><strong>Priority:</strong> {selectedApproval.priority}</p>
                    <p><strong>Due Date:</strong> {selectedApproval.dueDate}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Recommendation</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Confidence: {selectedApproval.aiConfidence}%</strong>
                      <br />
                      {selectedApproval.aiRecommendation}
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
            {selectedApproval?.status === 'Pending' && (
              <>
                <Button variant="success" onClick={() => handleApprove(selectedApproval)}>
                  <CheckCircle size={16} className="me-2" />
                  Approve
                </Button>
                <Button variant="danger" onClick={() => handleReject(selectedApproval)}>
                  <AlertTriangle size={16} className="me-2" />
                  Reject
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default PricingApprovals
