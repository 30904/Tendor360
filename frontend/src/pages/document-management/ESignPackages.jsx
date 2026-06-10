import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, ProgressBar } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, PenTool, Brain, CheckCircle, FileText, Send, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './ESignPackages.scss'
import { dummyEsignPackagePrefill } from '../../utils/testFormDummies'

const ESignPackages = () => {
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [prefillSnapshot, setPrefillSnapshot] = useState(null)
  const [modalFormKey, setModalFormKey] = useState(0)

  useEffect(() => {
    setPackages([
      {
        id: 1,
        name: 'Highway Project Contract Package',
        description: 'Complete contract signing package for highway infrastructure project',
        status: 'In Progress',
        progress: 75,
        documents: 8,
        signed: 6,
        pending: 2,
        recipients: 4,
        dueDate: '2024-02-15',
        createdBy: 'John Doe',
        createdDate: '2024-01-15',
        lastActivity: '2024-01-20',
        aiOptimized: true,
        completionRate: 85
      },
      {
        id: 2,
        name: 'Smart City Agreement Package',
        description: 'Technology implementation agreement signing package',
        status: 'Completed',
        progress: 100,
        documents: 5,
        signed: 5,
        pending: 0,
        recipients: 3,
        dueDate: '2024-01-25',
        createdBy: 'Jane Smith',
        createdDate: '2024-01-10',
        lastActivity: '2024-01-25',
        aiOptimized: true,
        completionRate: 100
      },
      {
        id: 3,
        name: 'Healthcare Facility Contract',
        description: 'Construction contract signing package for healthcare facility',
        status: 'Draft',
        progress: 45,
        documents: 12,
        signed: 0,
        pending: 12,
        recipients: 6,
        dueDate: '2024-03-01',
        createdBy: 'Mike Johnson',
        createdDate: '2024-01-18',
        lastActivity: '2024-01-19',
        aiOptimized: false,
        completionRate: 0
      },
      {
        id: 4,
        name: 'Educational Institution Agreement',
        description: 'Partnership agreement signing package for educational institution',
        status: 'In Progress',
        progress: 60,
        documents: 6,
        signed: 3,
        pending: 3,
        recipients: 4,
        dueDate: '2024-02-28',
        createdBy: 'Sarah Wilson',
        createdDate: '2024-01-20',
        lastActivity: '2024-01-22',
        aiOptimized: true,
        completionRate: 75
      },
      {
        id: 5,
        name: 'Renewable Energy Project Contract',
        description: 'Solar energy project contract signing package',
        status: 'Completed',
        progress: 100,
        documents: 10,
        signed: 10,
        pending: 0,
        recipients: 5,
        dueDate: '2024-01-30',
        createdBy: 'David Brown',
        createdDate: '2024-01-05',
        lastActivity: '2024-01-30',
        aiOptimized: true,
        completionRate: 100
      },
      {
        id: 6,
        name: 'IT Services Agreement',
        description: 'IT services and maintenance agreement signing package',
        status: 'Expired',
        progress: 30,
        documents: 4,
        signed: 1,
        pending: 3,
        recipients: 3,
        dueDate: '2024-01-15',
        createdBy: 'Emily Davis',
        createdDate: '2024-01-01',
        lastActivity: '2024-01-10',
        aiOptimized: false,
        completionRate: 25
      },
      {
        id: 7,
        name: 'Manufacturing Partnership Agreement',
        description: 'Manufacturing partnership and supply agreement',
        status: 'In Progress',
        progress: 80,
        documents: 15,
        signed: 12,
        pending: 3,
        recipients: 8,
        dueDate: '2024-02-20',
        createdBy: 'Robert Taylor',
        createdDate: '2024-01-12',
        lastActivity: '2024-01-21',
        aiOptimized: true,
        completionRate: 90
      },
      {
        id: 8,
        name: 'Real Estate Development Contract',
        description: 'Commercial real estate development contract package',
        status: 'Draft',
        progress: 25,
        documents: 20,
        signed: 0,
        pending: 20,
        recipients: 12,
        dueDate: '2024-03-15',
        createdBy: 'Lisa Anderson',
        createdDate: '2024-01-25',
        lastActivity: '2024-01-26',
        aiOptimized: false,
        completionRate: 0
      }
    ])
  }, [])

  const stats = useMemo(() => {
    const totalPackages = packages.length
    const totalDocuments = packages.reduce((a, p) => a + (p.documents || 0), 0)
    const totalRecipients = packages.reduce((a, p) => a + (p.recipients || 0), 0)
    const avgCompletionRate = totalPackages
      ? Math.round(packages.reduce((a, p) => a + (p.completionRate || 0), 0) / totalPackages)
      : 0
    const inProgress = packages.filter(p => p.status === 'In Progress').length
    const completed = packages.filter(p => p.status === 'Completed').length
    return {
      totalPackages,
      totalDocuments,
      totalRecipients,
      avgCompletionRate,
      inProgress,
      completed
    }
  }, [packages])

  const insightItems = useMemo(() => {
    const items = []
    if (stats.totalPackages > 0) {
      items.push({
        title: `${stats.totalPackages} eSign programs with ${stats.avgCompletionRate}% average completion`,
        detail: `${stats.inProgress} cycles still routing signatures across ${stats.totalRecipients} recipients.`,
        tone: 'info'
      })
    }
    if (stats.avgCompletionRate < 75) {
      items.push({
        title: 'Signature velocity can be improved',
        detail: 'Turn on AI-optimized sequencing and reminder cadences for stalled packets.',
        tone: 'warning'
      })
    } else if (stats.totalPackages > 0) {
      items.push({
        title: 'Execution throughput is healthy',
        detail: 'Monitor expired packets and renew before regulatory filings slip.',
        tone: 'success'
      })
    }
    if (!items.length) {
      items.push({
        title: 'eSign command deck is ready',
        detail: 'Create a package to activate signer telemetry.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleEditPackage = (pkg) => {
    setPrefillSnapshot(null)
    setEditingPackage(pkg)
    setModalFormKey((k) => k + 1)
    setShowModal(true)
  }

  const handleDeletePackage = (pkg) => {
    if (window.confirm(`Are you sure you want to delete package "${pkg.name}"?`)) {
      setPackages(prev => prev.filter(p => p.id !== pkg.id))
    }
  }

  const handleViewPackage = (pkg) => {
    console.log('View package:', pkg)
  }

  const columns = [
    {
      key: 'name',
      label: 'Package Details',
      width: '25%',
      render: (value, row) => (
        <div className="package-info">
          <div className="fw-semibold d-flex align-items-center">
            <PenTool size={16} className="me-2" />
            {value}
            {row.aiOptimized && (
              <Brain size={14} className="ms-2 text-primary" title="AI Optimized" />
            )}
          </div>
          <small className="text-muted">{row.description}</small>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
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
            {row.signed} signed, {row.pending} pending
          </small>
        </div>
      )
    },
    {
      key: 'recipients',
      label: 'Recipients',
      width: '10%',
      render: (value) => (
        <div className="text-center">
          <Users size={16} className="me-1" />
          <span className="fw-medium">{value}</span>
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
      'Completed': 'success',
      'Draft': 'warning',
      'Expired': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const openCreateModal = () => {
    setEditingPackage(null)
    setPrefillSnapshot(null)
    setModalFormKey((k) => k + 1)
    setShowModal(true)
  }

  const formSeed = editingPackage || prefillSnapshot || {}

  const closeEsignModal = () => {
    setShowModal(false)
    setEditingPackage(null)
    setPrefillSnapshot(null)
    setModalFormKey((k) => k + 1)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="esign-packages-page"
        showSkeleton={loading && !packages.length}
        breadcrumbs={[
          {
            label: 'Document Management',
            onClick: () => navigate('/document-management')
          },
          { label: 'eSign Packages', active: true }
        ]}
        onBack={() => navigate('/document-management')}
        title="eSign packages command center"
        description="Orchestrate signature packets, recipient coverage, and AI-optimized signing workflows."
        heroMeta="Execution telemetry"
        outlookTitle="Signature operations outlook"
        outlookDescription={`${stats.totalPackages} packages span ${stats.totalDocuments} documents and ${stats.totalRecipients} recipients with ${stats.avgCompletionRate}% mean completion.`}
        outlookChips={[
          `${stats.totalPackages} packages`,
          `${stats.completed} completed`,
          `${stats.inProgress} in flight`,
          `${stats.avgCompletionRate}% completion`
        ]}
        insights={insightItems}
        kpiTitle="eSign signal board"
        kpiMeta="Packet volume, signer reach, and completion quality"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total packages"
                value={stats.totalPackages}
                hint="Active programs"
                tone="intel"
                trend="Registry"
                icon={<PenTool size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Documents"
                value={stats.totalDocuments}
                hint="Included in envelopes"
                tone="warning"
                trend="Volume"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Recipients"
                value={stats.totalRecipients}
                hint="Signer footprint"
                tone="success"
                trend="Reach"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg completion"
                value={stats.avgCompletionRate}
                hint="Packet finalize rate"
                tone={stats.avgCompletionRate >= 75 ? 'success' : 'warning'}
                trend="Velocity"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`eSign packages (${packages.length})`}
        tableActions={(
          <>
            <Button variant="outline-secondary" className="me-2">
              <Send size={16} className="me-2" />
              Send reminders
            </Button>
            <Button variant="primary" onClick={openCreateModal}>
              <Plus size={16} className="me-2" />
              New package
            </Button>
          </>
        )}
      >
        <DataTable
          data={packages}
          columns={columns}
          title="eSign packages"
          searchable
          sortable
          exportable
          pagination
          pageSize={10}
          showActions
          showCheckboxes={false}
          onView={handleViewPackage}
          onEdit={handleEditPackage}
          onDelete={handleDeletePackage}
          customActions={[
            {
              type: 'custom',
              label: 'Send Package',
              onClick: (row) => {
                console.log('Send package:', row.name)
              }
            }
          ]}
          searchPlaceholder="Search eSign packages..."
          emptyMessage="No eSign packages found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={closeEsignModal}
        size="lg"
        onTestFill={
          showModal
            ? () => {
                setPrefillSnapshot(dummyEsignPackagePrefill())
                setModalFormKey((k) => k + 1)
              }
            : undefined
        }
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <PenTool size={20} className="me-2" />
            {editingPackage ? 'Edit eSign Package' : 'New eSign Package'}
          </Modal.Title>
        </Modal.Header>
        <Form key={modalFormKey}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Package Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter package name"
                    defaultValue={formSeed.name || ''}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control type="date" defaultValue={formSeed.dueDate || ''} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter package description"
                defaultValue={formSeed.description || ''}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Recipients</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter recipient emails (one per line)"
                    defaultValue={formSeed.recipients || ''}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Documents</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter document names (one per line)"
                    defaultValue={formSeed.documents || ''}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Enable AI optimization for signing workflow"
                defaultChecked={formSeed.aiOptimized || false}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEsignModal}>
              Cancel
            </Button>
            <Button variant="primary">
              {editingPackage ? 'Update Package' : 'Create Package'}
            </Button>
          </Modal.Footer>
        </Form>
      </FormDrawerModal>
    </>
  )
}

export default ESignPackages
