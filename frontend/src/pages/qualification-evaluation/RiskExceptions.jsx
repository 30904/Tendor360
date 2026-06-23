import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Alert, Modal, ProgressBar } from 'react-bootstrap'
import { AlertTriangle, Plus, Edit, Trash2, Eye, CheckCircle, Brain, Shield, TrendingUp, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './RiskExceptions.scss'

const RiskExceptions = () => {
  const navigate = useNavigate()
  const [riskExceptions, setRiskExceptions] = useState([])
  const [stats, setStats] = useState({})
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState(null)

  useEffect(() => {
    setRiskExceptions([
      {
        id: 1,
        title: 'Financial Capability Risk',
        description: 'Insufficient financial documentation for large project requirements',
        type: 'Financial',
        riskLevel: 'High',
        status: 'Open',
        tenderId: 'TEN-2024-001',
        client: 'Ministry of Transport',
        identifiedBy: 'John Doe',
        identifiedDate: '2024-01-20',
        dueDate: '2024-02-15',
        aiAssessment: 'High risk - Financial capacity concerns identified',
        aiConfidence: 89,
        impactScore: 85,
        mitigationPlan: 'Obtain additional financial guarantees',
        priority: 'Critical',
        assignedTo: 'Finance Team'
      },
      {
        id: 2,
        title: 'Technical Expertise Gap',
        description: 'Lack of specific technical expertise in required domain',
        type: 'Technical',
        riskLevel: 'Medium',
        status: 'Under Review',
        tenderId: 'TEN-2024-002',
        client: 'City Development Authority',
        identifiedBy: 'Jane Smith',
        identifiedDate: '2024-01-19',
        dueDate: '2024-02-10',
        aiAssessment: 'Medium risk - Technical competency gaps identified',
        aiConfidence: 76,
        impactScore: 72,
        mitigationPlan: 'Partner with specialized technical firm',
        priority: 'High',
        assignedTo: 'Technical Team'
      },
      {
        id: 3,
        title: 'Compliance Exception',
        description: 'Non-compliance with environmental regulations',
        type: 'Compliance',
        riskLevel: 'High',
        status: 'Open',
        tenderId: 'TEN-2024-003',
        client: 'Environmental Agency',
        identifiedBy: 'Mike Johnson',
        identifiedDate: '2024-01-21',
        dueDate: '2024-02-20',
        aiAssessment: 'High risk - Environmental compliance issues',
        aiConfidence: 92,
        impactScore: 88,
        mitigationPlan: 'Implement environmental management system',
        priority: 'Critical',
        assignedTo: 'Compliance Team'
      },
      {
        id: 4,
        title: 'Resource Availability Risk',
        description: 'Limited availability of skilled resources for project execution',
        type: 'Resource',
        riskLevel: 'Medium',
        status: 'Mitigated',
        tenderId: 'TEN-2024-004',
        client: 'Manufacturing Corp',
        identifiedBy: 'Sarah Wilson',
        identifiedDate: '2024-01-18',
        dueDate: '2024-02-05',
        aiAssessment: 'Medium risk - Resource constraints identified',
        aiConfidence: 81,
        impactScore: 75,
        mitigationPlan: 'Pre-arrange resource contracts',
        priority: 'High',
        assignedTo: 'HR Team'
      },
      {
        id: 5,
        title: 'Timeline Exception',
        description: 'Aggressive project timeline may impact quality',
        type: 'Schedule',
        riskLevel: 'Low',
        status: 'Closed',
        tenderId: 'TEN-2024-005',
        client: 'Construction Authority',
        identifiedBy: 'David Brown',
        identifiedDate: '2024-01-15',
        dueDate: '2024-01-30',
        aiAssessment: 'Low risk - Timeline concerns addressed',
        aiConfidence: 68,
        impactScore: 60,
        mitigationPlan: 'Optimize project schedule and resources',
        priority: 'Medium',
        assignedTo: 'Project Manager'
      },
      {
        id: 6,
        title: 'Legal Compliance Risk',
        description: 'Potential legal issues with contract terms',
        type: 'Legal',
        riskLevel: 'High',
        status: 'Open',
        tenderId: 'TEN-2024-006',
        client: 'Legal Department',
        identifiedBy: 'Emily Davis',
        identifiedDate: '2024-01-22',
        dueDate: '2024-02-25',
        aiAssessment: 'High risk - Legal compliance concerns',
        aiConfidence: 94,
        impactScore: 90,
        mitigationPlan: 'Legal review and contract amendments',
        priority: 'Critical',
        assignedTo: 'Legal Team'
      }
    ])

    setStats({
      totalRisks: 6,
      open: 3,
      underReview: 1,
      mitigated: 1,
      closed: 1,
      highRisk: 3,
      avgAiConfidence: 83,
      avgImpactScore: 78,
      criticalPriority: 3
    })
  }, [])

  const handleViewRiskException = (riskException) => {
    setSelectedRisk(riskException)
    setShowViewModal(true)
  }

  const handleEditRiskException = (riskException) => {
    toast.info(`Editing risk exception "${riskException.title}" is disabled in Demo Mode.`)
  }

  const handleDeleteRiskException = (riskException) => {
    if (window.confirm(`Are you sure you want to delete risk exception "${riskException.title}"?`)) {
      setRiskExceptions(prev => prev.filter(r => r.id !== riskException.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'title',
      label: 'Risk Exception Details',
      width: '25%',
      render: (value, row) => (
        <div className="risk-info">
          <div className="fw-semibold d-flex align-items-center">
            <AlertTriangle size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="risk-meta">
            <small className="text-muted">Tender: {row.tenderId}</small>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      width: '10%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      width: '10%',
      render: (value) => {
        const variants = {
          'High': 'danger',
          'Medium': 'warning',
          'Low': 'success'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => {
        const variants = {
          'Open': 'danger',
          'Under Review': 'warning',
          'Mitigated': 'info',
          'Closed': 'success'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'impactScore',
      label: 'Impact Score',
      width: '10%',
      render: (value) => (
        <div className="impact-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">Impact</small>
        </div>
      )
    },
    {
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '10%',
      render: (value) => (
        <div className="confidence-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">AI Score</small>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '8%',
      render: (value) => {
        const variants = {
          'Critical': 'danger',
          'High': 'warning',
          'Medium': 'info',
          'Low': 'success'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      width: '12%'
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      width: '10%',
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

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalRisks || 0) > 0) {
      items.push({
        title: `${stats.open || 0} open exceptions with ${stats.highRisk || 0} flagged as high severity`,
        detail: `${stats.avgAiConfidence || 0}% average model confidence vs ${stats.avgImpactScore || 0}% blended impact.`,
        tone: stats.highRisk > 2 ? 'warning' : 'info'
      })
    }
    if ((stats.criticalPriority || 0) > 0) {
      items.push({
        title: `${stats.criticalPriority} critical-tier items need executive mitigation`,
        detail: 'Escalate owners and shorten review loops on items breaching SLA.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Exception register is ready for live risks',
        detail: 'Log exceptions to centralize mitigation, approvals, and AI triage signals.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
      className="risk-exceptions-page"
      breadcrumbs={[
        { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
        { label: 'Risk & exceptions', active: true }
      ]}
      onBack={() => navigate('/qualification-evaluation')}
      backLabel="Back to modules"
      title="Risk & exceptions command center"
      description="Identify and manage qualification risks and exceptions with modeled impact and remediation coverage."
      heroMeta="Threat surface"
      outlookTitle="Mitigation outlook"
      outlookDescription={`${stats.totalRisks || 0} tracked risks — ${stats.open || 0} open, ${stats.highRisk || 0} high severity.`}
      outlookChips={[
        `${stats.totalRisks || 0} total`,
        `${stats.open || 0} open`,
        `${stats.highRisk || 0} high`,
        `${stats.avgAiConfidence || 0}% AI confidence`
      ]}
      insights={insightItems}
      kpiTitle="Risk signal board"
      kpiMeta="Severity vs model assurance"
      kpiContent={(
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Total risks"
              value={stats.totalRisks || 0}
              hint="Portfolio exceptions"
              tone="intel"
              trend="Register"
              icon={<AlertTriangle size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="High risk"
              value={stats.highRisk || 0}
              hint="Severity concentration"
              tone="warning"
              trend="Heat"
              icon={<Shield size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Avg AI confidence"
              value={stats.avgAiConfidence || 0}
              hint="Triage quality"
              tone="warning"
              trend="Model"
              suffix="%"
              icon={<Brain size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Critical priority"
              value={stats.criticalPriority || 0}
              hint="Executive attention"
              tone="danger"
              trend="Escalations"
              icon={<TrendingUp size={20} />}
            />
          </Col>
        </Row>
      )}
      tableTitle={`Risk & exceptions (${riskExceptions.length})`}
      tableActions={(
        <>
          <Button variant="primary" className="me-2" onClick={() => toast.info("New risk assessments are automatically registered during document ingest.")}>
            <Plus size={16} className="me-2" />
            New risk assessment
          </Button>
          <Button variant="outline-secondary">
            <FileText size={16} className="me-2" />
            Export
          </Button>
        </>
      )}
    >
      {stats.criticalPriority > 0 ? (
        <Alert variant="danger" className="d-flex align-items-center mb-3">
          <AlertTriangle size={20} className="me-2" />
          <strong>Critical:</strong> {stats.criticalPriority} risk(s) require immediate attention and mitigation.
        </Alert>
      ) : null}
      <DataTable
        data={riskExceptions}
        columns={columns}
        title="Risk & Exceptions Management"
        searchable={true}
        sortable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        showActions={true}
        showCheckboxes={false}
        onView={handleViewRiskException}
        onEdit={handleEditRiskException}
        onDelete={handleDeleteRiskException}
        customActions={[
          {
            type: 'custom',
            label: 'AI Assessment',
            onClick: (row) => {
              handleViewRiskException(row);
            }
          }
        ]}
        searchPlaceholder="Search risk exceptions..."
        emptyMessage="No risk exceptions found"
        loading={false}
      />
    </ExecutiveCommandCenter>

      {/* Details View Modal */}
      <Modal show={showViewModal} onHide={() => { setShowViewModal(false); setSelectedRisk(null); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <AlertTriangle size={20} className="me-2 text-danger" />
            Risk Exception Details - {selectedRisk?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRisk && (
            <div className="risk-view-details">
              <Row className="mb-4">
                <Col md={6}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Risk Summary</h6>
                    <p className="mb-1"><strong>Type:</strong> {selectedRisk.type}</p>
                    <p className="mb-1"><strong>Risk Level:</strong> <Badge bg={selectedRisk.riskLevel === 'High' ? 'danger' : selectedRisk.riskLevel === 'Medium' ? 'warning' : 'success'}>{selectedRisk.riskLevel}</Badge></p>
                    <p className="mb-1"><strong>Status:</strong> <Badge bg={selectedRisk.status === 'Open' ? 'danger' : selectedRisk.status === 'Mitigated' ? 'success' : 'warning'}>{selectedRisk.status}</Badge></p>
                    <p className="mb-0"><strong>Tender Reference:</strong> {selectedRisk.tenderId}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Identification & SLA</h6>
                    <p className="mb-1"><strong>Client:</strong> {selectedRisk.client}</p>
                    <p className="mb-1"><strong>Identified By:</strong> {selectedRisk.identifiedBy}</p>
                    <p className="mb-1"><strong>Identified Date:</strong> {selectedRisk.identifiedDate}</p>
                    <p className="mb-0"><strong>Due Date:</strong> {selectedRisk.dueDate}</p>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={6}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Priority & Responsibility</h6>
                    <p className="mb-1"><strong>Priority:</strong> <Badge bg={selectedRisk.priority === 'Critical' ? 'danger' : 'info'}>{selectedRisk.priority}</Badge></p>
                    <p className="mb-0"><strong>Assigned To:</strong> {selectedRisk.assignedTo}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Impact Score</h6>
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-bold me-2">{selectedRisk.impactScore}%</span>
                    </div>
                    <ProgressBar
                      now={selectedRisk.impactScore}
                      variant={selectedRisk.impactScore >= 75 ? 'danger' : selectedRisk.impactScore >= 50 ? 'warning' : 'success'}
                      style={{ height: '8px' }}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={12}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Description</h6>
                    <p className="mb-0">{selectedRisk.description}</p>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={12}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Mitigation Plan</h6>
                    <p className="mb-0">{selectedRisk.mitigationPlan || 'No mitigation plan registered.'}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className="p-3 border rounded bg-light">
                    <h6 className="text-muted mb-2">AI Assessment</h6>
                    <Alert variant={selectedRisk.riskLevel === 'High' ? 'danger' : selectedRisk.riskLevel === 'Medium' ? 'warning' : 'success'} className="mb-0 d-flex align-items-center">
                      <Brain size={16} className="me-2 text-primary" />
                      <div>
                        <strong>AI Assessment:</strong> {selectedRisk.aiAssessment} • 
                        <strong> Model Confidence:</strong> {selectedRisk.aiConfidence}%
                      </div>
                    </Alert>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowViewModal(false); setSelectedRisk(null); }}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowViewModal(false);
            handleEditRiskException(selectedRisk);
          }}>
            <Edit size={16} className="me-2" />
            Edit Risk
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RiskExceptions