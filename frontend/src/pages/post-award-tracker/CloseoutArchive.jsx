import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import PostAwardWorkspaceModal from './components/PostAwardWorkspaceModal'
import { exportRowsToExcel } from './utils/exportReport'
import { Search, Plus, Edit, Trash2, Eye, Archive, FileText, Brain, CheckCircle, Clock, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast'
import './CloseoutArchive.scss'

const CLOSEOUT_FIELDS = [
  { name: 'projectName', label: 'Project name', placeholder: 'Bridge rehabilitation program', required: true },
  { name: 'projectId', label: 'Project ID', placeholder: 'PROJ-2024-010', required: true },
  { name: 'client', label: 'Client', placeholder: 'Public works authority', required: true },
  { name: 'contractValue', label: 'Contract value (USD)', type: 'number', min: 0, required: true },
  { name: 'endDate', label: 'Planned end date', type: 'date', required: true }
]

const CloseoutArchive = () => {
  const navigate = useNavigate()
  const [closeouts, setCloseouts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedCloseout, setSelectedCloseout] = useState(null)

  useEffect(() => {
    setCloseouts([
      {
        id: 1,
        projectName: 'Highway Construction Project',
        projectId: 'PROJ-2024-001',
        client: 'Ministry of Transport',
        contractValue: 15000000,
        currency: 'USD',
        startDate: '2023-01-15',
        endDate: '2024-01-15',
        status: 'Completed',
        closeoutDate: '2024-01-20',
        archivedDate: '2024-01-25',
        documents: 45,
        deliverables: 12,
        aiComplianceScore: 98,
        aiRecommendation: 'Project successfully completed with excellent compliance',
        aiConfidence: 95,
        retentionPeriod: '7 years',
        archiveLocation: 'Cloud Storage - Primary'
      },
      {
        id: 2,
        projectName: 'Software Implementation',
        projectId: 'PROJ-2024-002',
        client: 'Health Ministry',
        contractValue: 5000000,
        currency: 'USD',
        startDate: '2023-06-01',
        endDate: '2024-01-31',
        status: 'In Progress',
        closeoutDate: null,
        archivedDate: null,
        documents: 28,
        deliverables: 8,
        aiComplianceScore: 85,
        aiRecommendation: 'On track for completion, monitor final deliverables',
        aiConfidence: 88,
        retentionPeriod: '5 years',
        archiveLocation: 'Pending'
      },
      {
        id: 3,
        projectName: 'Infrastructure Development',
        projectId: 'PROJ-2024-003',
        client: 'City Development Authority',
        contractValue: 8000000,
        currency: 'USD',
        startDate: '2023-03-01',
        endDate: '2023-12-31',
        status: 'Archived',
        closeoutDate: '2024-01-05',
        archivedDate: '2024-01-10',
        documents: 67,
        deliverables: 15,
        aiComplianceScore: 92,
        aiRecommendation: 'Project archived successfully with full compliance',
        aiConfidence: 90,
        retentionPeriod: '10 years',
        archiveLocation: 'Cloud Storage - Secondary'
      }
    ])
  }, [])

  const stats = useMemo(() => {
    const n = closeouts.length
    if (!n) {
      return {
        totalProjects: 0,
        completed: 0,
        inProgress: 0,
        archived: 0,
        totalDocuments: 0,
        totalDeliverables: 0,
        avgComplianceScore: 0,
        aiConfidence: 0
      }
    }
    const totalDocuments = closeouts.reduce((s, c) => s + (Number(c.documents) || 0), 0)
    const totalDeliverables = closeouts.reduce((s, c) => s + (Number(c.deliverables) || 0), 0)
    const avgComplianceScore = Math.round(
      closeouts.reduce((s, c) => s + (Number(c.aiComplianceScore) || 0), 0) / n
    )
    const aiConfidence = Math.round(
      closeouts.reduce((s, c) => s + (Number(c.aiConfidence) || 0), 0) / n
    )
    return {
      totalProjects: n,
      completed: closeouts.filter((c) => c.status === 'Completed').length,
      inProgress: closeouts.filter((c) => c.status === 'In Progress').length,
      archived: closeouts.filter((c) => c.status === 'Archived').length,
      totalDocuments,
      totalDeliverables,
      avgComplianceScore,
      aiConfidence
    }
  }, [closeouts])

  const insights = useMemo(() => {
    const items = [
      {
        title: `${stats.totalProjects} projects in closeout archive scope`,
        detail: `${stats.totalDocuments} documents indexed; avg compliance ${stats.avgComplianceScore}% with ${stats.aiConfidence}% model confidence.`,
        tone: 'info'
      }
    ]
    if (stats.inProgress > 0) {
      items.push({
        title: `${stats.inProgress} project(s) still in progress`,
        detail: 'Validate deliverable sign-off before scheduling formal closeout.',
        tone: 'warning'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleViewCloseout = (closeout) => {
    setSelectedCloseout(closeout)
    setShowModal(true)
  }

  const handleCloseout = (closeout) => {
    if (window.confirm(`Are you sure you want to closeout "${closeout.projectName}"?`)) {
      setCloseouts((prev) =>
        prev.map((c) =>
          c.id === closeout.id ? { ...c, status: 'Completed', closeoutDate: new Date().toISOString().split('T')[0] } : c
        )
      )
      showToast.success(`"${closeout.projectName}" marked as completed`)
    }
  }

  const handleArchive = (closeout) => {
    if (window.confirm(`Are you sure you want to archive "${closeout.projectName}"?`)) {
      setCloseouts((prev) =>
        prev.map((c) =>
          c.id === closeout.id ? { ...c, status: 'Archived', archivedDate: new Date().toISOString().split('T')[0] } : c
        )
      )
      showToast.success(`"${closeout.projectName}" archived`)
    }
  }

  const handleNewCloseout = (formData) => {
    const projectName = String(formData.projectName || '').trim()
    const projectId = String(formData.projectId || '').trim()
    const client = String(formData.client || '').trim()
    const endDate = String(formData.endDate || '').trim()
    const contractValue = Number(formData.contractValue)

    if (!projectName || !projectId || !client || !endDate) {
      showToast.error('Please complete all required fields')
      return
    }

    if (!Number.isFinite(contractValue) || contractValue < 0) {
      showToast.error('Enter a valid contract value')
      return
    }

    if (closeouts.some((item) => item.projectId.toLowerCase() === projectId.toLowerCase())) {
      showToast.error(`Project ID "${projectId}" already exists`)
      return
    }

    const newCloseout = {
      id: Date.now(),
      projectName,
      projectId,
      client,
      contractValue,
      currency: 'USD',
      startDate: new Date().toISOString().split('T')[0],
      endDate,
      status: 'In Progress',
      closeoutDate: null,
      archivedDate: null,
      documents: 0,
      deliverables: 0,
      aiComplianceScore: 0,
      aiRecommendation: 'Awaiting closeout documentation upload.',
      aiConfidence: 0,
      retentionPeriod: '7 years',
      archiveLocation: 'Pending'
    }

    setCloseouts((prev) => [...prev, newCloseout])
    setSearchTerm('')
    showToast.success(`Closeout registry opened for ${projectName}`)
    setShowFormModal(false)
  }

  const handleExportReport = () => {
    exportRowsToExcel(
      closeouts.map((closeout) => ({
        'Project Name': closeout.projectName,
        'Project ID': closeout.projectId,
        Client: closeout.client,
        'Contract Value': closeout.contractValue,
        Status: closeout.status,
        'Closeout Date': closeout.closeoutDate || 'Pending',
        'Archived Date': closeout.archivedDate || 'Pending',
        Documents: closeout.documents,
        'Compliance Score': closeout.aiComplianceScore
      })),
      { sheetName: 'Closeout Archive', fileName: 'closeout_archive_report.xlsx' }
    )
  }

  const handleExportDetails = () => {
    if (!selectedCloseout) return
    exportRowsToExcel([selectedCloseout], {
      sheetName: 'Project Details',
      fileName: `${selectedCloseout.projectId}_closeout_details.xlsx`
    })
  }

  const getStatusBadge = (status) => {
    const variants = {
      Completed: 'success',
      'In Progress': 'warning',
      Archived: 'info',
      Pending: 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const getComplianceColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 75) return 'primary'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="closeout-archive-page"
        breadcrumbs={[
          { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
          { label: 'Closeout & Archive', active: true }
        ]}
        onBack={() => navigate('/post-award-tracker')}
        backLabel="Back to modules"
        title="Closeout & archive command center"
        description="Manage project closeout and archival processes with compliance and AI-assisted review."
        heroMeta="Compliance & records"
        outlookTitle="Portfolio closeout outlook"
        outlookDescription={`${stats.totalProjects} projects — ${stats.completed} completed, ${stats.archived} archived, ${stats.inProgress} in progress.`}
        outlookChips={[
          `${stats.totalProjects} projects`,
          `${stats.totalDocuments} docs`,
          `${stats.avgComplianceScore}% avg compliance`,
          `${stats.aiConfidence}% AI confidence`
        ]}
        insights={insights}
        kpiTitle="Archive signal board"
        kpiMeta="Volume, compliance, and model confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total projects"
                value={stats.totalProjects}
                hint="In registry"
                tone="intel"
                trend="Portfolio"
                icon={<Archive size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Documents"
                value={stats.totalDocuments}
                hint="Indexed artifacts"
                tone="primary"
                trend="Records"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg compliance"
                value={stats.avgComplianceScore}
                hint="AI compliance score"
                tone={
                  stats.avgComplianceScore >= 90 ? 'success' : stats.avgComplianceScore >= 75 ? 'warning' : 'danger'
                }
                trend="Quality"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence}
                hint="Model confidence"
                tone="intel"
                trend="Signals"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle={`Project closeout & archive (${closeouts.length})`}
        tableActions={
          <>
            <Button variant="primary" className="me-2" onClick={() => setShowFormModal(true)}>
              <Plus size={16} className="me-2" />
              New Closeout
            </Button>
            <Button variant="outline-secondary" onClick={handleExportReport}>
              <Download size={16} className="me-2" />
              Export Report
            </Button>
          </>
        }
      >
        <Row className="mb-3">
          <Col md={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search projects..."
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
                <th>Project Details</th>
                <th>Client</th>
                <th>Contract Value</th>
                <th>Duration</th>
                <th>Documents</th>
                <th>Compliance Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {closeouts
                .filter(
                  (closeout) =>
                    !searchTerm ||
                    closeout.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    closeout.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    closeout.projectId.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((closeout) => (
                  <tr key={closeout.id}>
                    <td>
                      <div className="project-info">
                        <h6 className="mb-1">{closeout.projectName}</h6>
                        <p className="text-muted mb-1">{closeout.projectId}</p>
                        <small className="text-muted">
                          {closeout.deliverables} deliverables • Retention: {closeout.retentionPeriod}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="client-info">{closeout.client}</div>
                    </td>
                    <td>
                      <div className="value-info">
                        <div className="fw-medium">{formatCurrency(closeout.contractValue, closeout.currency)}</div>
                      </div>
                    </td>
                    <td>
                      <div className="duration-info">
                        <div className="d-flex align-items-center">
                          <Clock size={16} className="me-1" />
                          <div>
                            <div className="fw-medium">
                              {closeout.startDate} to {closeout.endDate}
                            </div>
                            {closeout.closeoutDate && (
                              <small className="text-muted">Closed: {closeout.closeoutDate}</small>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="documents-info">
                        <div className="d-flex align-items-center">
                          <FileText size={16} className="me-1" />
                          <span>{closeout.documents}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="compliance-score">
                        <Badge bg={getComplianceColor(closeout.aiComplianceScore)}>{closeout.aiComplianceScore}%</Badge>
                      </div>
                    </td>
                    <td>{getStatusBadge(closeout.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleViewCloseout(closeout)}
                        >
                          <Eye size={14} />
                        </Button>
                        {closeout.status === 'In Progress' && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="me-1"
                            onClick={() => handleCloseout(closeout)}
                          >
                            <CheckCircle size={14} />
                          </Button>
                        )}
                        {closeout.status === 'Completed' && (
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-1"
                            onClick={() => handleArchive(closeout)}
                          >
                            <Archive size={14} />
                          </Button>
                        )}
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
            <Archive size={20} className="me-2" />
            Project Details - {selectedCloseout?.projectName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCloseout && (
            <div className="closeout-details">
              <Row>
                <Col md={6}>
                  <h6>Project Information</h6>
                  <p>
                    <strong>Project ID:</strong> {selectedCloseout.projectId}
                  </p>
                  <p>
                    <strong>Client:</strong> {selectedCloseout.client}
                  </p>
                  <p>
                    <strong>Contract Value:</strong>{' '}
                    {formatCurrency(selectedCloseout.contractValue, selectedCloseout.currency)}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {selectedCloseout.startDate}
                  </p>
                  <p>
                    <strong>End Date:</strong> {selectedCloseout.endDate}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Closeout Details</h6>
                  <p>
                    <strong>Status:</strong> {selectedCloseout.status}
                  </p>
                  <p>
                    <strong>Closeout Date:</strong> {selectedCloseout.closeoutDate || 'Pending'}
                  </p>
                  <p>
                    <strong>Archived Date:</strong> {selectedCloseout.archivedDate || 'Pending'}
                  </p>
                  <p>
                    <strong>Documents:</strong> {selectedCloseout.documents}
                  </p>
                  <p>
                    <strong>Deliverables:</strong> {selectedCloseout.deliverables}
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Archive Information</h6>
                  <p>
                    <strong>Retention Period:</strong> {selectedCloseout.retentionPeriod}
                  </p>
                  <p>
                    <strong>Archive Location:</strong> {selectedCloseout.archiveLocation}
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>AI Assessment & Recommendation</h6>
                  <Alert variant="info">
                    <Brain size={16} className="me-2" />
                    <strong>Compliance Score:</strong> {selectedCloseout.aiComplianceScore}% •{' '}
                    <strong>Confidence:</strong> {selectedCloseout.aiConfidence}%
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle size={16} className="me-2" />
                    <strong>Recommendation:</strong> {selectedCloseout.aiRecommendation}
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
          <Button variant="primary" onClick={handleExportDetails}>
            <Download size={16} className="me-2" />
            Export Details
          </Button>
        </Modal.Footer>
      </Modal>

      <PostAwardWorkspaceModal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        title="New closeout"
        description="Register a project for closeout and archival tracking."
        submitLabel="Create closeout"
        fields={CLOSEOUT_FIELDS}
        onSubmit={handleNewCloseout}
      />
    </>
  )
}

export default CloseoutArchive
