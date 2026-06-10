import React, { useState, useMemo } from 'react'
import { Row, Col, Card, Table, Badge, Button, Form, Modal, ProgressBar, Alert, Tabs, Tab } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import {
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Brain,
  Target,
  CheckCircle,
  AlertTriangle,
  Building,
  Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './MilestonesBilling.scss'

const projectData = [
  {
    id: 1,
    projectName: 'Highway Infrastructure Development',
    client: 'Ministry of Transport',
    contractValue: '$45.2M',
    progress: 78,
    milestones: 12,
    completed: 9,
    pending: 3,
    overdue: 0,
    nextMilestone: 'Phase 2 Completion',
    nextDueDate: '2024-02-15',
    aiRiskLevel: 'Low',
    aiPrediction: 'On track for completion',
    billingStatus: 'Current',
    totalBilled: '$35.1M',
    pendingAmount: '$10.1M'
  },
  {
    id: 2,
    projectName: 'Smart City Technology Implementation',
    client: 'City Development Authority',
    contractValue: '$28.7M',
    progress: 65,
    milestones: 8,
    completed: 5,
    pending: 2,
    overdue: 1,
    nextMilestone: 'System Integration',
    nextDueDate: '2024-01-25',
    aiRiskLevel: 'Medium',
    aiPrediction: 'Potential 2-week delay',
    billingStatus: 'Overdue',
    totalBilled: '$18.6M',
    pendingAmount: '$10.1M'
  },
  {
    id: 3,
    projectName: 'Healthcare Facility Construction',
    client: 'Health Ministry',
    contractValue: '$67.8M',
    progress: 45,
    milestones: 15,
    completed: 7,
    pending: 6,
    overdue: 2,
    nextMilestone: 'Foundation Completion',
    nextDueDate: '2024-01-30',
    aiRiskLevel: 'High',
    aiPrediction: 'High risk of delays',
    billingStatus: 'Current',
    totalBilled: '$30.5M',
    pendingAmount: '$37.3M'
  },
  {
    id: 4,
    projectName: 'Renewable Energy Power Plant',
    client: 'Energy Corporation',
    contractValue: '$125.4M',
    progress: 32,
    milestones: 20,
    completed: 6,
    pending: 12,
    overdue: 2,
    nextMilestone: 'Equipment Installation',
    nextDueDate: '2024-02-10',
    aiRiskLevel: 'Medium',
    aiPrediction: 'Monitor supply chain',
    billingStatus: 'Current',
    totalBilled: '$40.1M',
    pendingAmount: '$85.3M'
  }
]

const aiInsights = [
  {
    type: 'Schedule Alert',
    message: 'AI predicts 2 projects may face delays due to supply chain issues',
    severity: 'warning',
    action: 'Review procurement schedules'
  },
  {
    type: 'Billing Optimization',
    message: 'AI suggests accelerating billing for 3 completed milestones worth $12.5M',
    severity: 'info',
    action: 'Process pending invoices'
  },
  {
    type: 'Resource Allocation',
    message: 'AI recommends reallocating resources to Project #3 to meet deadlines',
    severity: 'success',
    action: 'Optimize resource plan'
  }
]

const MilestonesBilling = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const portfolioStats = useMemo(() => {
    const n = projectData.length
    const completedMilestones = projectData.reduce((s, p) => s + (p.completed || 0), 0)
    const overdueItems = projectData.reduce((s, p) => s + (p.overdue || 0), 0)
    return {
      activeProjects: n,
      completedMilestones,
      overdueItems,
      displayContractValue: '$142.8M'
    }
  }, [])

  const insights = useMemo(
    () =>
      aiInsights.map((i) => ({
        title: i.type,
        detail: i.message,
        tone: i.severity === 'warning' ? 'warning' : i.severity === 'success' ? 'success' : 'info'
      })),
    []
  )

  const getStatusBadge = (status) => {
    const variants = {
      Completed: 'success',
      'In Progress': 'primary',
      Pending: 'warning',
      Overdue: 'danger',
      Current: 'success'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getRiskBadge = (riskLevel) => {
    const variants = {
      Low: 'success',
      Medium: 'warning',
      High: 'danger'
    }
    return <Badge bg={variants[riskLevel] || 'secondary'}>{riskLevel} Risk</Badge>
  }

  const filteredData = projectData.filter((item) => {
    const matchesSearch =
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || item.billingStatus === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleViewDetails = (project) => {
    setSelectedProject(project)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="milestones-billing-page"
        breadcrumbs={[
          { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
          { label: 'Milestones & Billing', active: true }
        ]}
        onBack={() => navigate('/post-award-tracker')}
        backLabel="Back to modules"
        title="Milestones & billing command center"
        description="AI-assisted project tracking, milestone health, and billing posture across the portfolio."
        heroActions={
          <>
            <Button variant="outline-primary" className="me-2" size="sm">
              <Download size={16} className="me-2" />
              Export Report
            </Button>
            <Button variant="primary" size="sm">
              <Brain size={16} className="me-2" />
              AI Analysis
            </Button>
          </>
        }
        heroMeta="Schedule & revenue signals"
        outlookTitle="Delivery & billing outlook"
        outlookDescription={`${portfolioStats.activeProjects} active programs — ${portfolioStats.completedMilestones} milestones closed, ${portfolioStats.overdueItems} overdue items flagged.`}
        outlookChips={[
          `${portfolioStats.activeProjects} projects`,
          `${portfolioStats.completedMilestones} milestones done`,
          `${portfolioStats.overdueItems} overdue`,
          portfolioStats.displayContractValue
        ]}
        insights={insights}
        kpiTitle="Program signal board"
        kpiMeta="Progress, milestones, and contract scale"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active projects"
                value={portfolioStats.activeProjects}
                hint="In flight"
                tone="intel"
                trend="Programs"
                icon={<Target size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Milestones complete"
                value={portfolioStats.completedMilestones}
                hint="Closed gates"
                tone="success"
                trend="Delivery"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Overdue items"
                value={portfolioStats.overdueItems}
                hint="Needs recovery"
                tone={portfolioStats.overdueItems > 0 ? 'danger' : 'success'}
                trend="Risk"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Contract value"
                value={0}
                hint="Aggregate (demo display)"
                tone="primary"
                trend="Scale"
                displayValue={portfolioStats.displayContractValue}
                icon={<Zap size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Milestones, billing & AI recommendations"
      >
        <Row className="mb-3">
          <Col md={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search projects or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
          <Col md={3}>
            <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Current">Current</option>
              <option value="Overdue">Overdue</option>
              <option value="Pending">Pending</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button variant="outline-secondary" className="w-100">
              <Filter size={16} className="me-2" />
              More Filters
            </Button>
          </Col>
        </Row>

        <Tabs activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)} className="custom-tabs">
          <Tab eventKey="overview" title="Project Overview">
            <div className="pt-3">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Project Details</th>
                      <th>Client</th>
                      <th>Contract Value</th>
                      <th>Progress</th>
                      <th>Milestones</th>
                      <th>AI Risk Level</th>
                      <th>Billing Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="project-info">
                            <h6 className="mb-1">{item.projectName}</h6>
                            <small className="text-muted">Next: {item.nextMilestone}</small>
                          </div>
                        </td>
                        <td>
                          <div className="client-info">
                            <Building size={16} className="me-1" />
                            {item.client}
                          </div>
                        </td>
                        <td>
                          <span className="value-text">{item.contractValue}</span>
                        </td>
                        <td>
                          <div className="progress-info">
                            <ProgressBar
                              now={item.progress}
                              variant={item.progress >= 80 ? 'success' : item.progress >= 50 ? 'warning' : 'danger'}
                              className="mb-1"
                              style={{ height: '6px' }}
                            />
                            <small>{item.progress}%</small>
                          </div>
                        </td>
                        <td>
                          <div className="milestones-info">
                            <span className="completed">{item.completed}</span>
                            <span className="separator">/</span>
                            <span className="total">{item.milestones}</span>
                            {item.overdue > 0 && (
                              <Badge bg="danger" className="ms-2" style={{ fontSize: '0.7rem' }}>
                                {item.overdue} overdue
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="ai-risk-info">
                            {getRiskBadge(item.aiRiskLevel)}
                            <small className="d-block text-muted">{item.aiPrediction}</small>
                          </div>
                        </td>
                        <td>
                          <div className="billing-info">
                            {getStatusBadge(item.billingStatus)}
                            <small className="d-block text-muted">Billed: {item.totalBilled}</small>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(item)}>
                              <Eye size={14} />
                            </Button>
                            <Button variant="outline-secondary" size="sm" className="ms-1">
                              <Brain size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Tab>

          <Tab eventKey="recommendations" title="AI Recommendations">
            <div className="pt-3">
              <Row>
                {aiInsights.map((insight, index) => (
                  <Col md={4} key={index} className="mb-3">
                    <Card className={`recommendation-item ${insight.severity}`}>
                      <Card.Body>
                        <div className="recommendation-header">
                          <Brain size={20} className="me-2" />
                          <strong>{insight.type}</strong>
                        </div>
                        <p className="recommendation-message">{insight.message}</p>
                        <Button variant="outline-primary" size="sm" className="w-100">
                          {insight.action}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>
        </Tabs>
      </ExecutiveCommandCenter>

      <Modal show={selectedProject !== null} onHide={() => setSelectedProject(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Clock size={20} className="me-2" />
            Project Details - {selectedProject?.projectName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Client:</strong> {selectedProject.client}
                </Col>
                <Col md={6}>
                  <strong>Contract Value:</strong> {selectedProject.contractValue}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Progress:</strong> {selectedProject.progress}%
                </Col>
                <Col md={6}>
                  <strong>AI Risk Level:</strong> {getRiskBadge(selectedProject.aiRiskLevel)}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Next Milestone:</strong> {selectedProject.nextMilestone}
                </Col>
                <Col md={6}>
                  <strong>Due Date:</strong> {selectedProject.nextDueDate}
                </Col>
              </Row>

              <hr />

              <div className="ai-prediction">
                <h6>
                  <Brain size={16} className="me-2" />
                  AI Prediction
                </h6>
                <Alert variant="info">{selectedProject.aiPrediction}</Alert>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedProject(null)}>
            Close
          </Button>
          <Button variant="primary">
            <Brain size={16} className="me-2" />
            Run AI Analysis
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MilestonesBilling
