import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, ProgressBar } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, PenTool, Brain, CheckCircle, FileText, Send, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { toast } from 'react-toastify'
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
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

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
      toast.success(`Successfully deleted package "${pkg.name}"!`)
    }
  }

  const handleViewPackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowViewModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formEl = e.currentTarget
    const name = formEl.elements.name.value
    const dueDate = formEl.elements.dueDate.value
    const description = formEl.elements.description.value
    const recipientsRaw = formEl.elements.recipients.value || ''
    const documentsRaw = formEl.elements.documents.value || ''
    const aiOptimized = formEl.elements.aiOptimized.checked

    const recipientsList = recipientsRaw.split('\n').map(r => r.trim()).filter(Boolean)
    const documentsList = documentsRaw.split('\n').map(d => d.trim()).filter(Boolean)

    if (editingPackage) {
      setPackages(prev => prev.map(p => p.id === editingPackage.id ? {
        ...p,
        name,
        dueDate,
        description,
        recipients: recipientsList.length,
        recipientsList,
        documents: documentsList.length,
        documentsList,
        aiOptimized,
        lastActivity: new Date().toISOString().split('T')[0]
      } : p))
      toast.success(`Successfully updated eSign package "${name}"!`)
    } else {
      const nextId = packages.length ? Math.max(...packages.map(p => p.id), 0) + 1 : 1
      const newPkg = {
        id: nextId,
        name,
        dueDate,
        description,
        status: 'Draft',
        progress: 0,
        recipients: recipientsList.length,
        recipientsList,
        documents: documentsList.length,
        documentsList,
        signed: 0,
        pending: documentsList.length,
        aiOptimized,
        completionRate: 0,
        createdBy: 'Current User',
        createdDate: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0]
      }
      setPackages(prev => [...prev, newPkg])
      toast.success(`Successfully created eSign package "${name}"!`)
    }
    closeEsignModal()
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
            <Button variant="outline-secondary" className="me-2" onClick={() => toast.success('Sent outstanding reminders to all pending recipients!')}>
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
                if (row.status === 'Completed') {
                  toast.info(`Package "${row.name}" is already completed.`)
                  return
                }
                setPackages(prev => prev.map(p => p.id === row.id ? { ...p, status: 'In Progress' } : p))
                toast.success(`Successfully routed package "${row.name}" to recipients!`)
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
        <Form key={modalFormKey} onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Package Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter package name"
                    defaultValue={formSeed.name || ''}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control name="dueDate" type="date" defaultValue={formSeed.dueDate || ''} required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
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
                    name="recipients"
                    as="textarea"
                    rows={4}
                    placeholder="Enter recipient emails (one per line)"
                    defaultValue={formSeed.recipients || ''}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Documents</Form.Label>
                  <Form.Control
                    name="documents"
                    as="textarea"
                    rows={4}
                    placeholder="Enter document names (one per line)"
                    defaultValue={formSeed.documents || ''}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                name="aiOptimized"
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
            <Button variant="primary" type="submit">
              {editingPackage ? 'Update Package' : 'Create Package'}
            </Button>
          </Modal.Footer>
        </Form>
      </FormDrawerModal>

      {/* View Package Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <PenTool size={20} className="me-2 text-primary" />
            eSign Package Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPackage && (
            <div className="p-2">
              <h5 className="mb-3 text-primary">{selectedPackage.name}</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Status:</strong> {getStatusBadge(selectedPackage.status)}
                </Col>
                <Col md={6}>
                  <strong>Progress:</strong> <span className="fw-semibold">{selectedPackage.progress}%</span>
                  <ProgressBar
                    now={selectedPackage.progress}
                    variant={selectedPackage.progress === 100 ? 'success' : selectedPackage.progress >= 75 ? 'info' : selectedPackage.progress >= 50 ? 'warning' : 'danger'}
                    size="sm"
                    className="mt-1"
                    style={{ height: '6px' }}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Due Date:</strong> {new Date(selectedPackage.dueDate).toLocaleDateString()}
                </Col>
                <Col md={6}>
                  <strong>Last Activity:</strong> {selectedPackage.lastActivity}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Created By:</strong> {selectedPackage.createdBy} ({selectedPackage.createdDate})
                </Col>
                <Col md={6}>
                  <strong>AI Optimized:</strong> {selectedPackage.aiOptimized ? 'Yes' : 'No'}
                </Col>
              </Row>
              <div className="mb-3 mt-3">
                <strong>Description:</strong>
                <p className="text-muted mt-1">{selectedPackage.description}</p>
              </div>
              <Row>
                <Col md={6}>
                  <strong>Recipients:</strong>
                  <ul className="mt-2 pl-3">
                    {selectedPackage.recipientsList && selectedPackage.recipientsList.length > 0 ? (
                      selectedPackage.recipientsList.map((email, idx) => (
                        <li key={idx} className="text-muted small">{email}</li>
                      ))
                    ) : (
                      Array.from({ length: selectedPackage.recipients || 0 }).map((_, idx) => (
                        <li key={idx} className="text-muted small">Recipient {idx + 1} (pending@example.com)</li>
                      ))
                    )}
                  </ul>
                </Col>
                <Col md={6}>
                  <strong>Documents:</strong>
                  <ul className="mt-2 pl-3">
                    {selectedPackage.documentsList && selectedPackage.documentsList.length > 0 ? (
                      selectedPackage.documentsList.map((doc, idx) => (
                        <li key={idx} className="text-muted small">{doc}</li>
                      ))
                    ) : (
                      Array.from({ length: selectedPackage.documents || 0 }).map((_, idx) => (
                        <li key={idx} className="text-muted small">Document {idx + 1}.pdf</li>
                      ))
                    )}
                  </ul>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ESignPackages
