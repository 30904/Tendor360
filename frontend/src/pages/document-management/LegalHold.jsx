import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Edit, Archive, FileText, Brain, CheckCircle, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './LegalHold.scss'

const LegalHold = () => {
  const navigate = useNavigate()
  const [legalHolds, setLegalHolds] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedHold, setSelectedHold] = useState(null)

  useEffect(() => {
    setLegalHolds([
      {
        id: 1,
        caseName: 'Highway Construction Litigation',
        caseNumber: 'CASE-2024-001',
        description: 'Legal hold for highway construction project documents',
        status: 'Active',
        issuedDate: '2024-01-15',
        expiryDate: '2025-01-15',
        custodian: 'Legal Department',
        documents: 1250,
        retentionPeriod: '7 years',
        aiComplianceScore: 95,
        aiRecommendation: 'All documents properly preserved and accessible',
        aiConfidence: 92,
        scope: [
          'Project contracts and agreements',
          'Technical specifications and drawings',
          'Correspondence and communications',
          'Financial records and invoices',
          'Quality control documentation'
        ]
      },
      {
        id: 2,
        caseName: 'Software Implementation Dispute',
        caseNumber: 'CASE-2024-002',
        description: 'Legal hold for software implementation project',
        status: 'Active',
        issuedDate: '2024-02-01',
        expiryDate: '2025-02-01',
        custodian: 'IT Department',
        documents: 890,
        retentionPeriod: '5 years',
        aiComplianceScore: 88,
        aiRecommendation: 'Monitor document accessibility and ensure proper indexing',
        aiConfidence: 85,
        scope: [
          'Software development documentation',
          'User requirements and specifications',
          'Testing and quality assurance records',
          'Project management communications',
          'System configuration files'
        ]
      },
      {
        id: 3,
        caseName: 'Infrastructure Compliance Review',
        caseNumber: 'CASE-2024-003',
        description: 'Legal hold for infrastructure compliance review',
        status: 'Expired',
        issuedDate: '2023-06-01',
        expiryDate: '2024-06-01',
        custodian: 'Compliance Department',
        documents: 2100,
        retentionPeriod: '10 years',
        aiComplianceScore: 98,
        aiRecommendation: 'Hold successfully completed, documents archived',
        aiConfidence: 95,
        scope: [
          'Regulatory compliance documentation',
          'Environmental impact assessments',
          'Safety and security protocols',
          'Audit reports and findings',
          'Permit and license documentation'
        ]
      },
      {
        id: 4,
        caseName: 'Financial Services Audit',
        caseNumber: 'CASE-2024-004',
        description: 'Legal hold for financial services regulatory audit',
        status: 'Active',
        issuedDate: '2024-01-20',
        expiryDate: '2025-01-20',
        custodian: 'Finance Department',
        documents: 1560,
        retentionPeriod: '7 years',
        aiComplianceScore: 92,
        aiRecommendation: 'Ensure all financial records are properly indexed',
        aiConfidence: 89,
        scope: [
          'Financial statements and reports',
          'Transaction records and ledgers',
          'Audit trails and documentation',
          'Regulatory correspondence',
          'Risk assessment reports'
        ]
      },
      {
        id: 5,
        caseName: 'Employment Dispute Resolution',
        caseNumber: 'CASE-2024-005',
        description: 'Legal hold for employment-related dispute',
        status: 'Active',
        issuedDate: '2024-02-10',
        expiryDate: '2025-02-10',
        custodian: 'HR Department',
        documents: 780,
        retentionPeriod: '6 years',
        aiComplianceScore: 87,
        aiRecommendation: 'Monitor employee communications and HR records',
        aiConfidence: 83,
        scope: [
          'Employee records and files',
          'Performance evaluations',
          'Disciplinary actions',
          'HR communications',
          'Workplace policies and procedures'
        ]
      },
      {
        id: 6,
        caseName: 'Intellectual Property Protection',
        caseNumber: 'CASE-2024-006',
        description: 'Legal hold for intellectual property protection case',
        status: 'Active',
        issuedDate: '2024-01-25',
        expiryDate: '2026-01-25',
        custodian: 'Legal Department',
        documents: 3200,
        retentionPeriod: '10 years',
        aiComplianceScore: 96,
        aiRecommendation: 'All IP documents properly secured and accessible',
        aiConfidence: 94,
        scope: [
          'Patent applications and filings',
          'Trademark registrations',
          'Copyright documentation',
          'Trade secret materials',
          'Research and development records'
        ]
      },
      {
        id: 7,
        caseName: 'Environmental Impact Assessment',
        caseNumber: 'CASE-2024-007',
        description: 'Legal hold for environmental impact assessment review',
        status: 'Pending',
        issuedDate: '2024-02-15',
        expiryDate: '2025-02-15',
        custodian: 'Environmental Department',
        documents: 0,
        retentionPeriod: '8 years',
        aiComplianceScore: 0,
        aiRecommendation: 'Hold pending activation, prepare document collection',
        aiConfidence: 0,
        scope: [
          'Environmental impact studies',
          'Regulatory permits and approvals',
          'Monitoring and compliance reports',
          'Stakeholder communications',
          'Mitigation plans and documentation'
        ]
      },
      {
        id: 8,
        caseName: 'Data Privacy Compliance Review',
        caseNumber: 'CASE-2024-008',
        description: 'Legal hold for data privacy and GDPR compliance review',
        status: 'Active',
        issuedDate: '2024-01-30',
        expiryDate: '2025-01-30',
        custodian: 'IT Security Department',
        documents: 2100,
        retentionPeriod: '5 years',
        aiComplianceScore: 91,
        aiRecommendation: 'Ensure data processing records are complete',
        aiConfidence: 88,
        scope: [
          'Data processing agreements',
          'Privacy impact assessments',
          'Consent management records',
          'Data breach documentation',
          'Compliance monitoring reports'
        ]
      }
    ])
  }, [])

  const stats = useMemo(() => {
    const totalHolds = legalHolds.length
    const active = legalHolds.filter(h => h.status === 'Active').length
    const expired = legalHolds.filter(h => h.status === 'Expired').length
    const pending = legalHolds.filter(h => h.status === 'Pending').length
    const totalDocuments = legalHolds.reduce((a, h) => a + (h.documents || 0), 0)
    const scored = legalHolds.filter(h => h.aiComplianceScore > 0)
    const avgComplianceScore = scored.length
      ? Math.round(scored.reduce((a, h) => a + h.aiComplianceScore, 0) / scored.length)
      : 0
    const conf = legalHolds.filter(h => h.aiConfidence > 0)
    const aiConfidence = conf.length
      ? Math.round(conf.reduce((a, h) => a + h.aiConfidence, 0) / conf.length)
      : 0
    return {
      totalHolds,
      active,
      expired,
      pending,
      totalDocuments,
      avgComplianceScore,
      aiConfidence
    }
  }, [legalHolds])

  const insightItems = useMemo(() => {
    const items = []
    if (stats.totalHolds > 0) {
      items.push({
        title: `${stats.totalHolds} legal holds covering ${stats.totalDocuments.toLocaleString()} custodial documents`,
        detail: `Portfolio compliance averages ${stats.avgComplianceScore}% with ${stats.aiConfidence}% model confidence.`,
        tone: 'info'
      })
    }
    if (stats.pending > 0) {
      items.push({
        title: 'Pending holds need activation workflows',
        detail: 'Complete custodian mapping before discovery windows compress.',
        tone: 'warning'
      })
    }
    if (stats.avgComplianceScore >= 90) {
      items.push({
        title: 'Preservation posture is audit-grade',
        detail: 'Maintain chain-of-custody reviews for high-liability matters.',
        tone: 'success'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Legal hold registry is ready',
        detail: 'Issue your first matter to activate AI compliance scoring.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleViewHold = (hold) => {
    setSelectedHold(hold)
    setShowModal(true)
  }

  const handleEditHold = (hold) => {
    console.log('Edit hold:', hold)
  }

  const handleDeleteHold = (hold) => {
    if (window.confirm(`Are you sure you want to delete legal hold "${hold.caseName}"?`)) {
      setLegalHolds(prev => prev.filter(h => h.id !== hold.id))
    }
  }

  const columns = [
    {
      key: 'caseName',
      label: 'Case Details',
      width: '25%',
      render: (value, row) => (
        <div className="case-info">
          <div className="fw-semibold d-flex align-items-center">
            <Shield size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="case-meta">
            <small className="text-muted">Case: {row.caseNumber}</small>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'custodian',
      label: 'Custodian',
      width: '15%',
      render: (value) => (
        <div className="custodian-info">
          <div className="fw-medium">{value}</div>
        </div>
      )
    },
    {
      key: 'documents',
      label: 'Documents',
      width: '10%',
      render: (value) => (
        <div className="text-center">
          <FileText size={16} className="me-1" />
          <span className="fw-medium">{value.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'aiComplianceScore',
      label: 'Compliance Score',
      width: '12%',
      render: (value) => (
        <div className="compliance-score">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">AI Score</small>
        </div>
      )
    },
    {
      key: 'retentionPeriod',
      label: 'Retention',
      width: '10%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'expiryDate',
      label: 'Expires',
      width: '12%',
      render: (value) => {
        const date = new Date(value)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
    },
    {
      key: 'issuedDate',
      label: 'Issued',
      width: '12%',
      render: (value) => {
        const date = new Date(value)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
    }
  ]

  const handleExtendHold = (hold) => {
    if (window.confirm(`Are you sure you want to extend "${hold.caseName}"?`)) {
      setLegalHolds(prev => prev.map(h =>
        h.id === hold.id ? { ...h, expiryDate: '2025-06-01' } : h
      ))
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Expired': 'danger',
      'Pending': 'warning',
      'Suspended': 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="legal-hold-page"
        showSkeleton={loading && !legalHolds.length}
        breadcrumbs={[
          {
            label: 'Document Management',
            onClick: () => navigate('/document-management')
          },
          { label: 'Legal Hold', active: true }
        ]}
        onBack={() => navigate('/document-management')}
        title="Legal hold command center"
        description="Manage legal holds, retention posture, and AI-assisted compliance signals across matters."
        heroMeta="Preservation governance"
        outlookTitle="Hold portfolio outlook"
        outlookDescription={`${stats.totalHolds} matters with ${stats.active} active, ${stats.pending} pending activation, and ${stats.expired} closed holds.`}
        outlookChips={[
          `${stats.totalHolds} holds`,
          `${stats.active} active`,
          `${stats.totalDocuments.toLocaleString()} docs`,
          `${stats.avgComplianceScore}% compliance`
        ]}
        insights={insightItems}
        kpiTitle="Hold signal board"
        kpiMeta="Coverage, scoring, and model confidence"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total holds"
                value={stats.totalHolds}
                hint="Registered matters"
                tone="intel"
                trend="Registry"
                icon={<Archive size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Documents in scope"
                value={stats.totalDocuments}
                hint="Custodial volume"
                tone="warning"
                trend="Volume"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg compliance"
                value={stats.avgComplianceScore}
                hint="AI preservation score"
                tone={stats.avgComplianceScore >= 85 ? 'success' : 'warning'}
                trend="Risk"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence}
                hint="Model certainty band"
                tone="intel"
                trend="Assurance"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Legal hold management (${legalHolds.length})`}
        tableActions={(
          <>
            <Button variant="outline-secondary" className="me-2">
              <FileText size={16} className="me-2" />
              Export report
            </Button>
            <Button variant="primary">
              <Plus size={16} className="me-2" />
              New legal hold
            </Button>
          </>
        )}
      >
        <DataTable
          data={legalHolds}
          columns={columns}
          title="Legal hold management"
          searchable
          sortable
          exportable
          pagination
          pageSize={10}
          showActions
          showCheckboxes={false}
          onView={handleViewHold}
          onEdit={handleEditHold}
          onDelete={handleDeleteHold}
          customActions={[
            {
              type: 'custom',
              label: 'Extend Hold',
              onClick: (row) => {
                if (row.status === 'Active') {
                  handleExtendHold(row)
                }
              }
            }
          ]}
          searchPlaceholder="Search legal holds..."
          emptyMessage="No legal holds found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Archive size={20} className="me-2" />
            Legal Hold Details - {selectedHold?.caseName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHold && (
            <div className="legal-hold-details">
              <Row>
                <Col md={6}>
                  <h6>Case Information</h6>
                  <p><strong>Case Number:</strong> {selectedHold.caseNumber}</p>
                  <p><strong>Description:</strong> {selectedHold.description}</p>
                  <p><strong>Status:</strong> {selectedHold.status}</p>
                  <p><strong>Custodian:</strong> {selectedHold.custodian}</p>
                  <p><strong>Documents:</strong> {selectedHold.documents.toLocaleString()}</p>
                </Col>
                <Col md={6}>
                  <h6>Hold Details</h6>
                  <p><strong>Issued Date:</strong> {selectedHold.issuedDate}</p>
                  <p><strong>Expiry Date:</strong> {selectedHold.expiryDate}</p>
                  <p><strong>Retention Period:</strong> {selectedHold.retentionPeriod}</p>
                  <p><strong>Compliance Score:</strong> {selectedHold.aiComplianceScore}%</p>
                  <p><strong>AI Confidence:</strong> {selectedHold.aiConfidence}%</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Document Scope</h6>
                  <ul className="scope-list">
                    {selectedHold.scope.map((item, index) => (
                      <li key={index} className="scope-item">
                        <CheckCircle size={14} className="me-2 text-success" />
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
                    <strong>Compliance Score:</strong> {selectedHold.aiComplianceScore}% • <strong>Confidence:</strong> {selectedHold.aiConfidence}%
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle size={16} className="me-2" />
                    <strong>Recommendation:</strong> {selectedHold.aiRecommendation}
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
            Edit Legal Hold
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default LegalHold
