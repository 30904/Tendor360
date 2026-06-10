import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert, ProgressBar } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Trash2, Eye, Clock, AlertTriangle, CheckCircle, Calendar, Brain, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './DeadlineTracking.scss'

const DeadlineTracking = () => {
  const navigate = useNavigate()
  const [deadlines, setDeadlines] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedDeadline, setSelectedDeadline] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setDeadlines([
      {
        id: 1,
        title: 'Highway Construction Bid Submission',
        description: 'Final submission deadline for highway construction tender',
        tenderId: 'TEN-2024-001',
        client: 'Ministry of Transport',
        deadlineDate: '2024-02-15',
        deadlineTime: '14:00',
        priority: 'High',
        status: 'Active',
        daysRemaining: 5,
        progress: 85,
        aiRiskAssessment: 'Low risk - On track for completion',
        aiConfidence: 92,
        dependencies: [
          'Technical specifications review',
          'Financial proposal finalization',
          'Legal documentation completion'
        ],
        assignedTo: 'Project Team Alpha',
        category: 'Submission'
      },
      {
        id: 2,
        title: 'Software Implementation Clarification Response',
        description: 'Response to client clarifications for software implementation',
        tenderId: 'TEN-2024-002',
        client: 'Health Ministry',
        deadlineDate: '2024-02-10',
        deadlineTime: '17:00',
        priority: 'Medium',
        status: 'Active',
        daysRemaining: 2,
        progress: 60,
        aiRiskAssessment: 'Medium risk - Requires immediate attention',
        aiConfidence: 88,
        dependencies: [
          'Technical team consultation',
          'Client requirement analysis',
          'Response document preparation'
        ],
        assignedTo: 'Technical Team Beta',
        category: 'Clarification'
      },
      {
        id: 3,
        title: 'Infrastructure Project Site Visit',
        description: 'Mandatory site visit for infrastructure development project',
        tenderId: 'TEN-2024-003',
        client: 'City Development Authority',
        deadlineDate: '2024-02-08',
        deadlineTime: '09:00',
        priority: 'Critical',
        status: 'Overdue',
        daysRemaining: -1,
        progress: 100,
        aiRiskAssessment: 'High risk - Deadline exceeded, immediate action required',
        aiConfidence: 95,
        dependencies: [
          'Site access permissions',
          'Technical team availability',
          'Safety protocol compliance'
        ],
        assignedTo: 'Field Team Gamma',
        category: 'Site Visit'
      }
    ])

    setStats({
      totalDeadlines: 3,
      active: 2,
      overdue: 1,
      critical: 1,
      avgProgress: 82,
      aiConfidence: 92,
      totalDaysRemaining: 6
    })
  }, [])

  const handleViewDeadline = (deadline) => {
    setSelectedDeadline(deadline)
    setShowModal(true)
  }

  const handleMarkComplete = (deadline) => {
    if (window.confirm(`Are you sure you want to mark "${deadline.title}" as complete?`)) {
      setDeadlines(prev => prev.map(d => 
        d.id === deadline.id ? { ...d, status: 'Completed', progress: 100 } : d
      ))
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Overdue': 'danger',
      'Completed': 'info',
      'Cancelled': 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      'Critical': 'danger',
      'High': 'warning',
      'Medium': 'primary',
      'Low': 'secondary'
    }
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  const getDaysRemainingColor = (days) => {
    if (days < 0) return 'text-danger'
    if (days <= 2) return 'text-warning'
    if (days <= 5) return 'text-primary'
    return 'text-success'
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success'
    if (progress >= 60) return 'primary'
    if (progress >= 40) return 'warning'
    return 'danger'
  }

  const insightItems = useMemo(() => {
    const total = stats.totalDeadlines ?? 0
    const overdue = stats.overdue ?? 0
    const avg = stats.avgProgress ?? 0
    const conf = stats.aiConfidence ?? 0
    const items = []
    items.push({
      title: overdue > 0 ? 'Attention: overdue milestones' : 'Deadlines trending on track',
      detail: overdue > 0
        ? `${overdue} overdue — close gaps before submission windows lapse. Average progress ${avg}%.`
        : `${total} milestones tracked averaging ${avg}% progress with ${conf}% AI confidence.`,
      tone: overdue > 0 ? 'danger' : 'info'
    })
    if (avg >= 75 && overdue === 0) {
      items.push({
        title: 'Execution velocity healthy',
        detail: 'Portfolio progress supports confident executive sign-off.',
        tone: 'success'
      })
    }
    items.push({
      title: 'Model-assisted review',
      detail: `${conf}% AI confidence supplements owner validation on at-risk tenders.`,
      tone: 'info'
    })
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="deadline-tracking-page"
        breadcrumbs={[
          { label: 'Tender Calendar', onClick: () => navigate('/tender-calendar') },
          { label: 'Deadline Tracking', active: true }
        ]}
        onBack={() => navigate('/tender-calendar')}
        backLabel="Back to modules"
        title="Deadline command center"
        description="Monitor critical deadlines with progress, SLA pressure, and AI risk signals."
        heroMeta="Tender Calendar · SLA intelligence"
        outlookTitle="Portfolio deadline outlook"
        outlookDescription={`${stats.totalDeadlines ?? 0} tracked · ${stats.overdue ?? 0} overdue · ${stats.avgProgress ?? 0}% avg progress · ${stats.aiConfidence ?? 0}% AI confidence.`}
        outlookChips={[
          `${stats.totalDeadlines ?? 0} total`,
          `${stats.overdue ?? 0} overdue`,
          `${stats.active ?? stats.totalDeadlines ?? 0} active`,
          `${stats.critical ?? 0} critical`
        ]}
        insights={insightItems}
        kpiTitle="Deadline signal board"
        kpiMeta="Burndown, exposure, model confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total deadlines"
                value={stats.totalDeadlines ?? 0}
                hint="Active portfolio"
                tone="intel"
                trend="Workload"
                icon={<Clock size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Overdue"
                value={stats.overdue ?? 0}
                hint="Immediate recovery"
                tone={(stats.overdue ?? 0) > 0 ? 'danger' : 'success'}
                trend="Risk"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg progress"
                value={stats.avgProgress ?? 0}
                hint="Completion velocity"
                tone={(stats.avgProgress ?? 0) >= 70 ? 'success' : 'warning'}
                trend="Velocity"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Model certainty"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Deadline registry"
        tableActions={
          <div className="d-flex flex-wrap gap-2 justify-content-end">
            <Button variant="primary" size="sm">
              <Plus size={16} className="me-2" />
              New deadline
            </Button>
            <Button variant="outline-secondary" size="sm">
              <Calendar size={16} className="me-2" />
              Export
            </Button>
          </div>
        }
      >
        <Row className="mb-3">
          <Col md={12} lg={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search deadlines..."
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
                        <th>Deadline Details</th>
                        <th>Client</th>
                        <th>Deadline</th>
                        <th>Days Remaining</th>
                        <th>Progress</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deadlines.filter(deadline => 
                        !searchTerm || 
                        deadline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        deadline.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        deadline.tenderId.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((deadline) => (
                        <tr key={deadline.id}>
                          <td>
                            <div className="deadline-info">
                              <h6 className="mb-1">{deadline.title}</h6>
                              <p className="text-muted mb-1">{deadline.description}</p>
                              <small className="text-muted">
                                {deadline.tenderId} • {deadline.category} • Assigned to: {deadline.assignedTo}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="client-info">
                              {deadline.client}
                            </div>
                          </td>
                          <td>
                            <div className="deadline-datetime">
                              <div className="fw-medium">{deadline.deadlineDate}</div>
                              <small className="text-muted">{deadline.deadlineTime}</small>
                            </div>
                          </td>
                          <td>
                            <div className={`days-remaining ${getDaysRemainingColor(deadline.daysRemaining)}`}>
                              <div className="d-flex align-items-center">
                                <Clock size={16} className="me-1" />
                                <span className="fw-medium">
                                  {deadline.daysRemaining < 0 ? `${Math.abs(deadline.daysRemaining)} days overdue` : 
                                   deadline.daysRemaining === 0 ? 'Due today' : 
                                   `${deadline.daysRemaining} days`}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="progress-info">
                              <ProgressBar 
                                variant={getProgressColor(deadline.progress)}
                                now={deadline.progress}
                                label={`${deadline.progress}%`}
                                className="mb-1"
                              />
                            </div>
                          </td>
                          <td>{getPriorityBadge(deadline.priority)}</td>
                          <td>{getStatusBadge(deadline.status)}</td>
                          <td>
                            <div className="action-buttons">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-1"
                                onClick={() => handleViewDeadline(deadline)}
                              >
                                <Eye size={14} />
                              </Button>
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="me-1"
                                onClick={() => handleMarkComplete(deadline)}
                              >
                                <CheckCircle size={14} />
                              </Button>
                              <Button 
                                variant="outline-warning" 
                                size="sm"
                              >
                                <Edit size={14} />
                              </Button>
                            </div>
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
              <Clock size={20} className="me-2" />
              Deadline Details - {selectedDeadline?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDeadline && (
              <div className="deadline-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Tender ID:</strong> {selectedDeadline.tenderId}</p>
                    <p><strong>Client:</strong> {selectedDeadline.client}</p>
                    <p><strong>Category:</strong> {selectedDeadline.category}</p>
                    <p><strong>Priority:</strong> {selectedDeadline.priority}</p>
                    <p><strong>Status:</strong> {selectedDeadline.status}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Deadline Details</h6>
                    <p><strong>Date:</strong> {selectedDeadline.deadlineDate}</p>
                    <p><strong>Time:</strong> {selectedDeadline.deadlineTime}</p>
                    <p><strong>Days Remaining:</strong> {selectedDeadline.daysRemaining}</p>
                    <p><strong>Progress:</strong> {selectedDeadline.progress}%</p>
                    <p><strong>Assigned To:</strong> {selectedDeadline.assignedTo}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedDeadline.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={6}>
                    <h6>Dependencies</h6>
                    <ul className="dependencies-list">
                      {selectedDeadline.dependencies.map((dependency, index) => (
                        <li key={index} className="dependency-item">
                          <CheckCircle size={14} className="me-2 text-success" />
                          {dependency}
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>AI Assessment</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Risk Assessment:</strong> {selectedDeadline.aiRiskAssessment}
                    </Alert>
                    <p><strong>AI Confidence:</strong> {selectedDeadline.aiConfidence}%</p>
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
              Edit Deadline
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default DeadlineTracking
