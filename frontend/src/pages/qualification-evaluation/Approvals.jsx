import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, Alert } from 'react-bootstrap'
import { Plus, Edit, Trash2, Eye, CheckCircle, Brain, AlertTriangle, Clock, FileText, User, Shield, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './Approvals.scss'

const Approvals = () => {
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
        title: 'Technical Qualification Approval',
        description: 'Approval for technical qualification submission for highway project',
        tenderId: 'TEN-2024-001',
        client: 'Ministry of Transport',
        submittedBy: 'John Doe',
        submittedDate: '2024-01-20',
        status: 'Pending',
        priority: 'High',
        category: 'Technical',
        approver: 'Sarah Wilson',
        dueDate: '2024-01-25',
        aiRiskLevel: 'Low',
        aiRecommendation: 'Approve - All technical requirements met',
        aiConfidence: 92,
        documents: 8,
        complianceScore: 95
      },
      {
        id: 2,
        title: 'Financial Capability Assessment',
        description: 'Financial capability and creditworthiness evaluation',
        tenderId: 'TEN-2024-002',
        client: 'City Development Authority',
        submittedBy: 'Jane Smith',
        submittedDate: '2024-01-19',
        status: 'Approved',
        priority: 'Critical',
        category: 'Financial',
        approver: 'Mike Johnson',
        dueDate: '2024-01-24',
        aiRiskLevel: 'Low',
        aiRecommendation: 'Approved - Strong financial position',
        aiConfidence: 88,
        documents: 12,
        complianceScore: 98
      },
      {
        id: 3,
        title: 'Safety Compliance Certification',
        description: 'Safety protocols and compliance certification review',
        tenderId: 'TEN-2024-003',
        client: 'Health Department',
        submittedBy: 'David Brown',
        submittedDate: '2024-01-21',
        status: 'Under Review',
        priority: 'High',
        category: 'Safety',
        approver: 'Emily Davis',
        dueDate: '2024-01-26',
        aiRiskLevel: 'Medium',
        aiRecommendation: 'Review required - Additional safety documentation needed',
        aiConfidence: 75,
        documents: 15,
        complianceScore: 82
      },
      {
        id: 4,
        title: 'Environmental Impact Assessment',
        description: 'Environmental compliance and impact assessment approval',
        tenderId: 'TEN-2024-004',
        client: 'Environmental Agency',
        submittedBy: 'Sarah Wilson',
        submittedDate: '2024-01-22',
        status: 'Pending',
        priority: 'Medium',
        category: 'Environmental',
        approver: 'Robert Taylor',
        dueDate: '2024-01-27',
        aiRiskLevel: 'Low',
        aiRecommendation: 'Approve - All environmental requirements satisfied',
        aiConfidence: 91,
        documents: 10,
        complianceScore: 94
      },
      {
        id: 5,
        title: 'Quality Assurance Framework',
        description: 'Quality management system and assurance framework approval',
        tenderId: 'TEN-2024-005',
        client: 'Manufacturing Corp',
        submittedBy: 'Lisa Anderson',
        submittedDate: '2024-01-23',
        status: 'Rejected',
        priority: 'High',
        category: 'Quality',
        approver: 'James Wilson',
        dueDate: '2024-01-28',
        aiRiskLevel: 'High',
        aiRecommendation: 'Reject - Insufficient quality control measures',
        aiConfidence: 85,
        documents: 6,
        complianceScore: 65
      },
      {
        id: 6,
        title: 'Legal Compliance Verification',
        description: 'Legal compliance and regulatory requirement verification',
        tenderId: 'TEN-2024-006',
        client: 'Legal Department',
        submittedBy: 'Michael Chen',
        submittedDate: '2024-01-24',
        status: 'Approved',
        priority: 'Critical',
        category: 'Legal',
        approver: 'Maria Garcia',
        dueDate: '2024-01-29',
        aiRiskLevel: 'Low',
        aiRecommendation: 'Approved - Full legal compliance verified',
        aiConfidence: 96,
        documents: 18,
        complianceScore: 99
      }
    ])

    setStats({
      totalApprovals: 6,
      pending: 2,
      approved: 3,
      underReview: 1,
      rejected: 1,
      avgComplianceScore: 89,
      avgAiConfidence: 88,
      criticalApprovals: 2
    })
  }, [])

  const handleViewApproval = (approval) => {
    setSelectedApproval(approval)
    setShowModal(true)
  }

  const handleEditApproval = (approval) => {
    console.log('Edit approval:', approval)
    // Navigate to edit approval or open edit modal
  }

  const handleDeleteApproval = (approval) => {
    if (window.confirm(`Are you sure you want to delete approval "${approval.title}"?`)) {
      setApprovals(prev => prev.filter(a => a.id !== approval.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'title',
      label: 'Approval Details',
      width: '25%',
      render: (value, row) => (
        <div className="approval-info">
          <div className="fw-semibold d-flex align-items-center">
            <Shield size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="approval-meta">
            <small className="text-muted">Tender: {row.tenderId}</small>
          </div>
        </div>
      )
    },
    {
      key: 'client',
      label: 'Client',
      width: '12%',
      render: (value) => (
        <div className="client-info">
          <User size={16} className="me-1" />
          <span className="fw-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      width: '10%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '10%',
      render: (value) => getPriorityBadge(value)
    },
    {
      key: 'complianceScore',
      label: 'Compliance Score',
      width: '12%',
      render: (value) => (
        <div className="score-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">Compliance</small>
        </div>
      )
    },
    {
      key: 'approver',
      label: 'Approver',
      width: '12%'
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      width: '12%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Approved': 'success',
      'Under Review': 'info',
      'Rejected': 'danger'
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

  const getRiskBadge = (risk) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return <Badge bg={variants[risk] || 'secondary'}>{risk} Risk</Badge>
  }

  const getComplianceColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 75) return 'primary'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  const insightItems = useMemo(() => {
    const items = []
    items.push({
      title: `${stats.avgComplianceScore || 0}% average compliance with ${stats.avgAiConfidence || 0}% AI confidence`,
      detail: `${stats.pending || 0} pending, ${stats.approved || 0} approved, ${stats.underReview || 0} under review — ${stats.criticalApprovals || 0} flagged critical.`,
      tone: 'info'
    })
    if ((stats.pending || 0) > 2) {
      items.push({
        title: 'Approval queue depth is elevated',
        detail: 'Rebalance approver pools to protect submission deadlines.',
        tone: 'warning'
      })
    }
    items.push({
      title: stats.criticalApprovals ? 'Exercise extra scrutiny on critical submissions' : 'Critical queue is healthy',
      detail: 'Use AI dossiers alongside human judgment on borderline dossiers.',
      tone: stats.criticalApprovals ? 'warning' : 'success'
    })
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="approvals-page"
        breadcrumbs={[
          { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
          { label: 'Approvals', active: true }
        ]}
        onBack={() => navigate('/qualification-evaluation')}
        backLabel="Back to modules"
        title="Approvals command center"
        description="Operate qualification approvals with SLA visibility, dossier scoring, and AI-assisted risk overlays."
        heroMeta="Governance cockpit"
        outlookTitle="Throughput outlook"
        outlookDescription={`${stats.totalApprovals || 0} requests — ${stats.pending || 0} pending versus ${stats.approved || 0} cleared.`}
        outlookChips={[
          `${stats.totalApprovals || 0} total`,
          `${stats.pending || 0} pending`,
          `${stats.avgComplianceScore || 0}% compliance`,
          `${stats.criticalApprovals || 0} critical`
        ]}
        insights={insightItems}
        kpiTitle="Approval signal board"
        kpiMeta="Quality vs velocity"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total approvals"
                value={stats.totalApprovals || 0}
                hint="Captured requests"
                tone="intel"
                trend="Intake"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg compliance"
                value={stats.avgComplianceScore || 0}
                hint="Dossier strength"
                tone="success"
                trend="Quality"
                suffix="%"
                icon={<Award size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.avgAiConfidence || 0}
                hint="Model recommendation strength"
                tone="warning"
                trend="Signals"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Critical items"
                value={stats.criticalApprovals || 0}
                hint="Executive path"
                tone={stats.criticalApprovals ? 'danger' : 'success'}
                trend="Priority"
                icon={<Clock size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Approval requests (${approvals.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              New approval
            </Button>
            <Button variant="outline-secondary">
              <FileText size={16} className="me-2" />
              Export
            </Button>
          </>
        )}
      >
        <DataTable
          data={approvals}
          columns={columns}
          title="Approval Requests"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewApproval}
          onEdit={handleEditApproval}
          onDelete={handleDeleteApproval}
          customActions={[
            {
              type: 'custom',
              label: 'AI Assessment',
              onClick: (row) => {
                console.log('AI Assessment:', row.aiRecommendation);
              }
            }
          ]}
          searchPlaceholder="Search approvals..."
          emptyMessage="No approvals found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <CheckCircle size={20} className="me-2" />
              Approval Details - {selectedApproval?.title}
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
                    <p><strong>Category:</strong> {selectedApproval.category}</p>
                    <p><strong>Submitted By:</strong> {selectedApproval.submittedBy}</p>
                    <p><strong>Submitted Date:</strong> {selectedApproval.submittedDate}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Approval Details</h6>
                    <p><strong>Priority:</strong> {selectedApproval.priority}</p>
                    <p><strong>Status:</strong> {selectedApproval.status}</p>
                    <p><strong>Approver:</strong> {selectedApproval.approver}</p>
                    <p><strong>Due Date:</strong> {selectedApproval.dueDate}</p>
                    <p><strong>Documents:</strong> {selectedApproval.documents}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedApproval.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Assessment & Recommendation</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Risk Level:</strong> {selectedApproval.aiRiskLevel} • <strong>Confidence:</strong> {selectedApproval.aiConfidence}%
                    </Alert>
                    <Alert variant="success">
                      <CheckCircle size={16} className="me-2" />
                      <strong>Recommendation:</strong> {selectedApproval.aiRecommendation}
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
              <CheckCircle size={16} className="me-2" />
              Take Action
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default Approvals