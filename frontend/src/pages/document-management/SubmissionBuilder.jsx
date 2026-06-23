import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, ProgressBar, Modal, Form } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, FileText, Download, Brain, CheckCircle, Clock, Building, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { toast } from 'react-toastify'
import './SubmissionBuilder.scss'

const SubmissionBuilder = () => {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Draft',
    progress: 0,
    tenderId: '',
    client: '',
    dueDate: new Date().toISOString().split('T')[0],
    documents: 0,
    completed: 0,
    pending: 0,
    aiScore: 70,
    aiRecommendations: []
  })

  useEffect(() => {
    setSubmissions([
      {
        id: 1,
        name: 'Highway Infrastructure Tender Submission',
        description: 'Complete submission package for highway construction project',
        status: 'In Progress',
        progress: 75,
        tenderId: 'TEN-2024-001',
        client: 'Ministry of Transport',
        dueDate: '2024-02-15',
        documents: 12,
        completed: 9,
        pending: 3,
        aiScore: 85,
        aiRecommendations: ['Add technical specifications', 'Include compliance certificates'],
        createdBy: 'John Doe',
        createdDate: '2024-01-15',
        lastModified: '2024-01-20'
      },
      {
        id: 2,
        name: 'Smart City Technology Proposal',
        description: 'Technology implementation proposal for smart city project',
        status: 'Review',
        progress: 90,
        tenderId: 'TEN-2024-002',
        client: 'City Development Authority',
        dueDate: '2024-02-20',
        documents: 8,
        completed: 7,
        pending: 1,
        aiScore: 92,
        aiRecommendations: ['Finalize pricing details'],
        createdBy: 'Jane Smith',
        createdDate: '2024-01-16',
        lastModified: '2024-01-21'
      },
      {
        id: 3,
        name: 'Healthcare Facility Construction',
        description: 'Construction proposal for new healthcare facility',
        status: 'Draft',
        progress: 45,
        tenderId: 'TEN-2024-003',
        client: 'Health Department',
        dueDate: '2024-03-01',
        documents: 15,
        completed: 5,
        pending: 10,
        aiScore: 68,
        aiRecommendations: ['Complete technical drawings', 'Add safety protocols'],
        createdBy: 'Mike Johnson',
        createdDate: '2024-01-18',
        lastModified: '2024-01-22'
      },
      {
        id: 4,
        name: 'Educational Institution IT Upgrade',
        description: 'IT infrastructure upgrade for educational institution',
        status: 'Submitted',
        progress: 100,
        tenderId: 'TEN-2024-004',
        client: 'Education Board',
        dueDate: '2024-01-25',
        documents: 10,
        completed: 10,
        pending: 0,
        aiScore: 95,
        aiRecommendations: ['Submission completed successfully'],
        createdBy: 'Sarah Wilson',
        createdDate: '2024-01-10',
        lastModified: '2024-01-25'
      },
      {
        id: 5,
        name: 'Renewable Energy Project',
        description: 'Solar energy installation project proposal',
        status: 'In Progress',
        progress: 80,
        tenderId: 'TEN-2024-005',
        client: 'Energy Corporation',
        dueDate: '2024-02-28',
        documents: 14,
        completed: 11,
        pending: 3,
        aiScore: 88,
        aiRecommendations: ['Include environmental impact assessment'],
        createdBy: 'David Brown',
        createdDate: '2024-01-12',
        lastModified: '2024-01-23'
      },
      {
        id: 6,
        name: 'Financial Services Platform',
        description: 'Digital banking platform development proposal',
        status: 'Rejected',
        progress: 60,
        tenderId: 'TEN-2024-006',
        client: 'Banking Authority',
        dueDate: '2024-01-20',
        documents: 9,
        completed: 6,
        pending: 3,
        aiScore: 72,
        aiRecommendations: ['Improve security documentation', 'Add compliance details'],
        createdBy: 'Emily Davis',
        createdDate: '2024-01-05',
        lastModified: '2024-01-20'
      },
      {
        id: 7,
        name: 'Manufacturing Equipment Supply',
        description: 'Industrial equipment supply and installation',
        status: 'Review',
        progress: 85,
        tenderId: 'TEN-2024-007',
        client: 'Manufacturing Corp',
        dueDate: '2024-02-25',
        documents: 11,
        completed: 9,
        pending: 2,
        aiScore: 91,
        aiRecommendations: ['Add maintenance schedules'],
        createdBy: 'Robert Taylor',
        createdDate: '2024-01-14',
        lastModified: '2024-01-24'
      },
      {
        id: 8,
        name: 'Real Estate Development',
        description: 'Commercial real estate development project',
        status: 'Draft',
        progress: 30,
        tenderId: 'TEN-2024-008',
        client: 'Development Authority',
        dueDate: '2024-03-15',
        documents: 18,
        completed: 3,
        pending: 15,
        aiScore: 55,
        aiRecommendations: ['Complete feasibility study', 'Add financial projections'],
        createdBy: 'Lisa Anderson',
        createdDate: '2024-01-25',
        lastModified: '2024-01-26'
      }
    ])
  }, [])

  const stats = useMemo(() => {
    const total = submissions.length
    if (!total) {
      return {
        totalSubmissions: 0,
        inProgress: 0,
        inReview: 0,
        draft: 0,
        submitted: 0,
        rejected: 0,
        avgProgress: 0,
        avgAiScore: 0
      }
    }
    const inProgress = submissions.filter(s => s.status === 'In Progress').length
    const inReview = submissions.filter(s => s.status === 'Review').length
    const draft = submissions.filter(s => s.status === 'Draft').length
    const submitted = submissions.filter(s => s.status === 'Submitted').length
    const rejected = submissions.filter(s => s.status === 'Rejected').length
    const avgProgress = Math.round(submissions.reduce((a, s) => a + (s.progress || 0), 0) / total)
    const avgAiScore = Math.round(submissions.reduce((a, s) => a + (s.aiScore || 0), 0) / total)
    return {
      totalSubmissions: total,
      inProgress,
      inReview,
      draft,
      submitted,
      rejected,
      avgProgress,
      avgAiScore
    }
  }, [submissions])

  const insightItems = useMemo(() => {
    const items = []
    if (stats.totalSubmissions > 0) {
      items.push({
        title: `${stats.totalSubmissions} submission packages with ${stats.avgProgress}% average assembly progress`,
        detail: `AI quality index averages ${stats.avgAiScore}%. ${stats.inProgress} active builds and ${stats.inReview} in governance review.`,
        tone: 'info'
      })
    }
    if (stats.avgAiScore >= 85) {
      items.push({
        title: 'AI-assisted quality is trending strong',
        detail: 'Prioritize packaging for in-review deals while momentum is high.',
        tone: 'success'
      })
    } else if (stats.totalSubmissions > 0) {
      items.push({
        title: 'AI scoring indicates refinement opportunities',
        detail: 'Revisit rejected and draft packages for compliance and narrative gaps.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Submission builder is ready for your first package',
        detail: 'Create a submission workspace to unlock progress and AI scoring telemetry.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission)
    setShowViewModal(true)
  }

  const handleEditSubmission = (submission) => {
    setSelectedSubmission(submission)
    setFormData({
      ...submission
    })
    setShowEditModal(true)
  }

  const handleDeleteSubmission = (submission) => {
    if (window.confirm(`Are you sure you want to delete submission "${submission.name}"?`)) {
      setSubmissions(prev => prev.filter(s => s.id !== submission.id))
      toast.success(`Successfully deleted submission "${submission.name}"!`)
    }
  }

  const handleCreateSubmission = () => {
    setSelectedSubmission(null)
    setFormData({
      name: '',
      description: '',
      status: 'Draft',
      progress: 0,
      tenderId: '',
      client: '',
      dueDate: new Date().toISOString().split('T')[0],
      documents: 5,
      completed: 0,
      pending: 5,
      aiScore: 70,
      aiRecommendations: ['Add core technical templates']
    })
    setShowEditModal(true)
  }

  const handleSaveSubmission = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.client || !formData.tenderId) {
      toast.error('Please fill in all required fields.')
      return
    }

    const calculatedProgress = formData.documents > 0 ? Math.round((formData.completed / formData.documents) * 100) : 0

    const updatedData = {
      ...formData,
      progress: calculatedProgress,
      lastModified: new Date().toISOString().split('T')[0]
    }

    if (selectedSubmission) {
      setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, ...updatedData } : s))
      toast.success(`Successfully updated submission "${formData.name}"!`)
    } else {
      const newId = submissions.length ? Math.max(...submissions.map(s => s.id)) + 1 : 1
      const newSub = {
        id: newId,
        ...updatedData,
        createdDate: new Date().toISOString().split('T')[0]
      }
      setSubmissions(prev => [newSub, ...prev])
      toast.success(`Successfully initialized new submission package "${formData.name}"!`)
    }

    setShowEditModal(false)
  }

  const columns = [
    {
      key: 'name',
      label: 'Submission Details',
      width: '25%',
      render: (value, row) => (
        <div className="submission-info">
          <div className="fw-semibold d-flex align-items-center">
            <FileText size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="submission-meta">
            <small className="text-muted">Tender: {row.tenderId}</small>
          </div>
        </div>
      )
    },
    {
      key: 'client',
      label: 'Client',
      width: '15%',
      render: (value) => (
        <div className="client-info">
          <Building size={16} className="me-1" />
          <span className="fw-medium">{value}</span>
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
      key: 'progress',
      label: 'Progress',
      width: '15%',
      render: (value) => (
        <div className="progress-info">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small className="fw-medium">{value}%</small>
          </div>
          <ProgressBar
            now={value}
            variant={value === 100 ? 'success' : value >= 75 ? 'info' : value >= 50 ? 'warning' : 'danger'}
            size="sm"
            style={{ height: '6px' }}
          />
        </div>
      )
    },
    {
      key: 'documents',
      label: 'Documents',
      width: '12%',
      render: (value, row) => (
        <div className="documents-info">
          <div className="fw-medium">{value} total</div>
          <small className="text-muted">
            {row.completed} completed, {row.pending} pending
          </small>
        </div>
      )
    },
    {
      key: 'aiScore',
      label: 'AI Score',
      width: '10%',
      render: (value) => (
        <div className="ai-score">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">AI Score</small>
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
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
      key: 'createdBy',
      label: 'Created By',
      width: '12%'
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'In Progress': 'primary',
      'Review': 'warning',
      'Draft': 'secondary',
      'Submitted': 'success',
      'Rejected': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <>
    <ExecutiveCommandCenter
      className="submission-builder-page"
      showSkeleton={loading && !submissions.length}
      breadcrumbs={[
        {
          label: 'Document Management',
          onClick: () => navigate('/document-management')
        },
        { label: 'Submission Builder', active: true }
      ]}
      onBack={() => navigate('/document-management')}
      title="Submission builder command center"
      description="Build and customize tender submission packages with assembly progress and AI quality signals."
      heroMeta="Bid packaging telemetry"
      outlookTitle="Submission operations outlook"
      outlookDescription={`${stats.totalSubmissions} packages tracked: ${stats.inProgress} in progress, ${stats.inReview} in review, ${stats.submitted} filed, ${stats.rejected} rejected.`}
      outlookChips={[
        `${stats.totalSubmissions} packages`,
        `${stats.inProgress} active`,
        `${stats.avgProgress}% avg progress`,
        `${stats.avgAiScore} AI score`
      ]}
      insights={insightItems}
      kpiTitle="Assembly signal board"
      kpiMeta="Throughput and AI-assisted quality"
      kpiContent={(
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Total submissions"
              value={stats.totalSubmissions}
              hint="Registered packages"
              tone="intel"
              trend="Registry"
              icon={<FileText size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="In progress"
              value={stats.inProgress}
              hint="Active assembly lanes"
              tone="warning"
              trend="Build"
              icon={<Clock size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Avg progress"
              value={stats.avgProgress}
              hint="Completion across packages"
              tone="success"
              trend="Execution"
              suffix="%"
              icon={<CheckCircle size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Avg AI score"
              value={stats.avgAiScore}
              hint="Quality heuristics"
              tone={stats.avgAiScore >= 80 ? 'success' : 'warning'}
              trend="Quality"
              suffix="%"
              icon={<Brain size={20} />}
            />
          </Col>
        </Row>
      )}
      tableTitle={`Submission packages (${submissions.length})`}
      tableActions={(
        <>
          <Button variant="outline-secondary" className="me-2" onClick={() => toast.success("Submission registry exported successfully!")}>
            <Download size={16} className="me-2" />
            Export
          </Button>
          <Button variant="primary" onClick={handleCreateSubmission}>
            <Plus size={16} className="me-2" />
            New submission
          </Button>
        </>
      )}
    >
      <DataTable
        data={submissions}
        columns={columns}
        title="Submission packages"
        searchable
        sortable
        exportable
        pagination
        pageSize={10}
        showActions
        showCheckboxes={false}
        onView={handleViewSubmission}
        onEdit={handleEditSubmission}
        onDelete={handleDeleteSubmission}
        customActions={[
          {
            type: 'custom',
            label: 'Download',
            onClick: (row) => {
              toast.success(`Starting download for submission package "${row.name}"...`)
            }
          }
        ]}
        searchPlaceholder="Search submissions..."
        emptyMessage="No submissions found"
        loading={loading}
      />
    </ExecutiveCommandCenter>

    {/* View Submission Modal */}
    <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <FileText size={20} className="me-2 text-primary" />
          Submission Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedSubmission && (
          <div className="p-2">
            <h5 className="mb-3 text-primary">{selectedSubmission.name}</h5>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Client:</strong> {selectedSubmission.client}
              </Col>
              <Col md={6}>
                <strong>Tender ID:</strong> {selectedSubmission.tenderId}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Status:</strong> {getStatusBadge(selectedSubmission.status)}
              </Col>
              <Col md={6}>
                <strong>Due Date:</strong> {new Date(selectedSubmission.dueDate).toLocaleDateString()}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Total Documents:</strong> {selectedSubmission.documents}
              </Col>
              <Col md={4}>
                <strong>Completed:</strong> {selectedSubmission.completed}
              </Col>
              <Col md={4}>
                <strong>Pending:</strong> {selectedSubmission.pending}
              </Col>
            </Row>
            <div className="mb-3">
              <strong>Assembly Progress:</strong>
              <ProgressBar
                now={selectedSubmission.progress}
                label={`${selectedSubmission.progress}%`}
                variant={selectedSubmission.progress === 100 ? 'success' : selectedSubmission.progress >= 75 ? 'info' : 'warning'}
                className="mt-1"
              />
            </div>
            <hr />
            <Row className="mb-3">
              <Col md={6}>
                <strong>Created By:</strong> {selectedSubmission.createdBy}
              </Col>
              <Col md={6}>
                <strong>Last Modified:</strong> {selectedSubmission.lastModified}
              </Col>
            </Row>
            <hr />
            <div>
              <h6>AI Quality Rating & Advice</h6>
              <Alert variant="info" className="d-flex align-items-start mt-2">
                <Brain size={18} className="me-2 mt-1 flex-shrink-0" />
                <div>
                  <div><strong>AI Quality Index:</strong> {selectedSubmission.aiScore}%</div>
                  <div className="mt-2"><strong>Recommendations:</strong></div>
                  <ul className="mb-0 mt-1">
                    {selectedSubmission.aiRecommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </Alert>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        {selectedSubmission && (
          <>
            <Button variant="outline-primary" onClick={() => {
              setShowViewModal(false);
              toast.success(`Starting download for submission "${selectedSubmission.name}"...`);
            }}>
              <Download size={16} className="me-2" />
              Download Package
            </Button>
            <Button variant="primary" onClick={() => {
              setShowViewModal(false);
              handleEditSubmission(selectedSubmission);
            }}>
              <Edit size={16} className="me-2" />
              Edit Package
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>

    {/* Edit/Create Modal */}
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedSubmission ? 'Edit Submission Details' : 'New Submission Package'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSaveSubmission}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Submission Name *</Form.Label>
            <Form.Control
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Highway Infrastructure Tender Submission"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </Form.Group>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Client *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.client}
                  onChange={e => setFormData(prev => ({ ...prev, client: e.target.value }))}
                  placeholder="e.g. Ministry of Transport"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tender ID *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.tenderId}
                  onChange={e => setFormData(prev => ({ ...prev, tenderId: e.target.value }))}
                  placeholder="e.g. TEN-2024-001"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Draft">Draft</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Rejected">Rejected</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Due Date *</Form.Label>
                <Form.Control
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Total Documents</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.documents}
                  onChange={e => setFormData(prev => ({ ...prev, documents: parseInt(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Completed Documents</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.completed}
                  onChange={e => setFormData(prev => ({ ...prev, completed: parseInt(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Pending Documents</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.pending}
                  onChange={e => setFormData(prev => ({ ...prev, pending: parseInt(e.target.value) || 0 }))}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" type="submit">
            {selectedSubmission ? 'Save Changes' : 'Initialize Package'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  </>
)
}

export default SubmissionBuilder
