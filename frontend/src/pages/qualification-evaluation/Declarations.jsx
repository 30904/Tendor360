import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Alert } from 'react-bootstrap'
import { FileText, Plus, Edit, Trash2, Eye, Shield, Brain, CheckCircle, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { toast } from 'react-toastify'
import './Declarations.scss'

const Declarations = () => {
  const navigate = useNavigate()
  const [declarations, setDeclarations] = useState([])
  const [stats, setStats] = useState({})
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedDeclaration, setSelectedDeclaration] = useState(null)

  useEffect(() => {
    setDeclarations([
      {
        id: 1,
        title: 'Financial Capability Declaration',
        description: 'Declaration of financial stability and capability to execute projects',
        type: 'Financial',
        status: 'Valid',
        tenderId: 'TEN-2024-001',
        client: 'Ministry of Transport',
        submittedBy: 'John Doe',
        submittedDate: '2024-01-20',
        expiryDate: '2024-12-31',
        aiValidation: 'Verified - Strong financial position',
        aiConfidence: 95,
        complianceScore: 98,
        documents: 8,
        priority: 'High'
      },
      {
        id: 2,
        title: 'Technical Competency Statement',
        description: 'Declaration of technical expertise and project execution capabilities',
        type: 'Technical',
        status: 'Valid',
        tenderId: 'TEN-2024-002',
        client: 'City Development Authority',
        submittedBy: 'Jane Smith',
        submittedDate: '2024-01-19',
        expiryDate: '2024-11-30',
        aiValidation: 'Verified - Excellent technical credentials',
        aiConfidence: 92,
        complianceScore: 94,
        documents: 12,
        priority: 'High'
      },
      {
        id: 3,
        title: 'Environmental Compliance Declaration',
        description: 'Declaration of environmental standards and sustainability practices',
        type: 'Environmental',
        status: 'Under Review',
        tenderId: 'TEN-2024-003',
        client: 'Environmental Agency',
        submittedBy: 'Mike Johnson',
        submittedDate: '2024-01-21',
        expiryDate: '2024-10-15',
        aiValidation: 'Review required - Additional documentation needed',
        aiConfidence: 78,
        complianceScore: 85,
        documents: 6,
        priority: 'Medium'
      },
      {
        id: 4,
        title: 'Quality Management Declaration',
        description: 'Declaration of quality management systems and standards',
        type: 'Quality',
        status: 'Valid',
        tenderId: 'TEN-2024-004',
        client: 'Manufacturing Corp',
        submittedBy: 'Sarah Wilson',
        submittedDate: '2024-01-18',
        expiryDate: '2025-01-18',
        aiValidation: 'Verified - ISO 9001:2015 certified',
        aiConfidence: 96,
        complianceScore: 99,
        documents: 15,
        priority: 'High'
      },
      {
        id: 5,
        title: 'Safety Standards Declaration',
        description: 'Declaration of workplace safety standards and procedures',
        type: 'Safety',
        status: 'Expired',
        tenderId: 'TEN-2024-005',
        client: 'Construction Authority',
        submittedBy: 'David Brown',
        submittedDate: '2023-12-15',
        expiryDate: '2024-01-15',
        aiValidation: 'Expired - Renewal required',
        aiConfidence: 0,
        complianceScore: 0,
        documents: 10,
        priority: 'Critical'
      },
      {
        id: 6,
        title: 'Legal Compliance Declaration',
        description: 'Declaration of legal compliance and regulatory adherence',
        type: 'Legal',
        status: 'Valid',
        tenderId: 'TEN-2024-006',
        client: 'Legal Department',
        submittedBy: 'Emily Davis',
        submittedDate: '2024-01-22',
        expiryDate: '2024-09-30',
        aiValidation: 'Verified - Full legal compliance',
        aiConfidence: 94,
        complianceScore: 97,
        documents: 18,
        priority: 'High'
      }
    ])

    setStats({
      totalDeclarations: 6,
      valid: 4,
      underReview: 1,
      expired: 1,
      avgComplianceScore: 79,
      avgAiConfidence: 76,
      criticalExpiry: 1
    })
  }, [])

  const handleViewDeclaration = (declaration) => {
    setSelectedDeclaration(declaration)
    setShowViewModal(true)
  }

  const handleEditDeclaration = (declaration) => {
    toast.info(`Editing declaration "${declaration.title}" is disabled in Demo Mode.`)
  }

  const handleDeleteDeclaration = (declaration) => {
    if (window.confirm(`Are you sure you want to delete declaration "${declaration.title}"?`)) {
      setDeclarations(prev => prev.filter(d => d.id !== declaration.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'title',
      label: 'Declaration Details',
      width: '25%',
      render: (value, row) => (
        <div className="declaration-info">
          <div className="fw-semibold d-flex align-items-center">
            <Shield size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="declaration-meta">
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
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => {
        const variants = {
          'Valid': 'success',
          'Under Review': 'warning',
          'Expired': 'danger',
          'Invalid': 'secondary'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
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
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '12%',
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
      key: 'submittedBy',
      label: 'Submitted By',
      width: '12%'
    },
    {
      key: 'expiryDate',
      label: 'Expiry Date',
      width: '11%',
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
    if ((stats.totalDeclarations || 0) > 0) {
      items.push({
        title: `${stats.valid || 0} valid declarations with ${stats.underReview || 0} awaiting review`,
        detail: `${stats.avgAiConfidence || 0}% average AI confidence against ${stats.avgComplianceScore || 0}% blended compliance.`,
        tone: 'info'
      })
    }
    if ((stats.expired || 0) > 0) {
      items.push({
        title: `${stats.expired} declaration(s) are expired`,
        detail: 'Renew attestations before bid gates to avoid automatic disqualifiers.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Start capturing declaratory evidence',
        detail: 'Link statements to tenders to unlock expiry tracking and automated validation cues.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
      className="declarations-page"
      breadcrumbs={[
        { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
        { label: 'Declarations', active: true }
      ]}
      onBack={() => navigate('/qualification-evaluation')}
      backLabel="Back to modules"
      title="Declarations command center"
      description="Manage qualification declarations and AI-assisted validation signals across your tender portfolio."
      heroMeta="Attestation telemetry"
      outlookTitle="Compliance outlook"
      outlookDescription={`${stats.totalDeclarations || 0} tracked declarations — ${stats.valid || 0} valid, ${stats.underReview || 0} under review.`}
      outlookChips={[
        `${stats.totalDeclarations || 0} total`,
        `${stats.valid || 0} valid`,
        `${stats.avgAiConfidence || 0}% AI confidence`,
        `${stats.criticalExpiry || 0} critical expiry`
      ]}
      insights={insightItems}
      kpiTitle="Declarations signal board"
      kpiMeta="Validity vs model stance"
      kpiContent={(
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Total declarations"
              value={stats.totalDeclarations || 0}
              hint="Registered statements"
              tone="intel"
              trend="Coverage"
              icon={<FileText size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Valid"
              value={stats.valid || 0}
              hint="Eligible for bidding"
              tone="success"
              trend="Healthy"
              icon={<CheckCircle size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Avg AI confidence"
              value={stats.avgAiConfidence || 0}
              hint="Validation strength"
              tone={(stats.avgAiConfidence || 0) >= 80 ? 'success' : 'warning'}
              trend="Model"
              suffix="%"
              icon={<Brain size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Critical expiry"
              value={stats.criticalExpiry || 0}
              hint="Immediate renewal risk"
              tone={stats.criticalExpiry > 0 ? 'danger' : 'success'}
              trend="SLA"
              icon={<AlertTriangle size={20} />}
            />
          </Col>
        </Row>
      )}
      tableTitle={`Qualification declarations (${declarations.length})`}
      tableActions={(
        <>
          <Button variant="primary" className="me-2" onClick={() => toast.info("New declarations must be uploaded via active solicitation folders.")}>
            <Plus size={16} className="me-2" />
            New declaration
          </Button>
          <Button variant="outline-secondary">
            <FileText size={16} className="me-2" />
            Export
          </Button>
        </>
      )}
    >
      {stats.criticalExpiry > 0 ? (
        <Alert variant="warning" className="d-flex align-items-center mb-3">
          <AlertTriangle size={20} className="me-2" />
          <strong>Warning:</strong> {stats.criticalExpiry} declaration(s) have expired and require immediate attention.
        </Alert>
      ) : null}
      <DataTable
        data={declarations}
        columns={columns}
        title="Qualification Declarations"
        searchable={true}
        sortable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        showActions={true}
        showCheckboxes={false}
        onView={handleViewDeclaration}
        onEdit={handleEditDeclaration}
        onDelete={handleDeleteDeclaration}
        customActions={[
          {
            type: 'custom',
            label: 'AI Validation',
            onClick: (row) => {
              handleViewDeclaration(row);
            }
          }
        ]}
        searchPlaceholder="Search declarations..."
        emptyMessage="No declarations found"
        loading={false}
      />
    </ExecutiveCommandCenter>

      {/* Details View Modal */}
      <Modal show={showViewModal} onHide={() => { setShowViewModal(false); setSelectedDeclaration(null); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FileText size={20} className="me-2 text-primary" />
            Declaration Details - {selectedDeclaration?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDeclaration && (
            <div className="declaration-view-details">
              <Row className="mb-4">
                <Col md={6}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Attestation Summary</h6>
                    <p className="mb-1"><strong>Type:</strong> {selectedDeclaration.type}</p>
                    <p className="mb-1"><strong>Status:</strong> <Badge bg={selectedDeclaration.status === 'Valid' ? 'success' : selectedDeclaration.status === 'Expired' ? 'danger' : 'warning'}>{selectedDeclaration.status}</Badge></p>
                    <p className="mb-1"><strong>Tender Reference:</strong> {selectedDeclaration.tenderId}</p>
                    <p className="mb-0"><strong>Client:</strong> {selectedDeclaration.client}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Submission & Validity</h6>
                    <p className="mb-1"><strong>Submitted By:</strong> {selectedDeclaration.submittedBy}</p>
                    <p className="mb-1"><strong>Submitted Date:</strong> {selectedDeclaration.submittedDate}</p>
                    <p className="mb-1"><strong>Expiry Date:</strong> {selectedDeclaration.expiryDate}</p>
                    <p className="mb-0"><strong>Compliance score:</strong> {selectedDeclaration.complianceScore}%</p>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={12}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Description</h6>
                    <p className="mb-0">{selectedDeclaration.description}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className="p-3 border rounded bg-light">
                    <h6 className="text-muted mb-2">AI Assurance</h6>
                    <Alert variant={selectedDeclaration.status === 'Valid' ? 'success' : selectedDeclaration.status === 'Expired' ? 'danger' : 'warning'} className="mb-0 d-flex align-items-center">
                      <Brain size={16} className="me-2 text-primary" />
                      <div>
                        <strong>AI Validation Status:</strong> {selectedDeclaration.aiValidation} • 
                        <strong> Model Confidence:</strong> {selectedDeclaration.aiConfidence}%
                      </div>
                    </Alert>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowViewModal(false); setSelectedDeclaration(null); }}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowViewModal(false);
            handleEditDeclaration(selectedDeclaration);
          }}>
            <Edit size={16} className="me-2" />
            Edit Declaration
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Declarations