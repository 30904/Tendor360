import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Form } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, GitBranch, Download, CheckCircle, FileText, History, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { toast } from 'react-toastify'
import './Versioning.scss'

const Versioning = () => {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currentVersion: 'v1.0',
    totalVersions: 1,
    status: 'Active',
    changes: '',
    fileSize: '1.0 MB',
    category: 'Technical'
  })

  useEffect(() => {
    setDocuments([
      {
        id: 1,
        name: 'Technical Specification Document',
        description: 'Main technical specifications for highway project',
        currentVersion: 'v2.3',
        totalVersions: 8,
        lastModified: '2024-01-20',
        modifiedBy: 'John Doe',
        status: 'Active',
        changes: 'Updated safety requirements and compliance standards',
        fileSize: '2.4 MB',
        category: 'Technical'
      },
      {
        id: 2,
        name: 'Company Profile Template',
        description: 'Standard company profile template for tenders',
        currentVersion: 'v1.5',
        totalVersions: 5,
        lastModified: '2024-01-19',
        modifiedBy: 'Jane Smith',
        status: 'Active',
        changes: 'Updated company achievements and certifications',
        fileSize: '1.2 MB',
        category: 'Template'
      },
      {
        id: 3,
        name: 'Financial Proposal Template',
        description: 'Standard financial proposal template for tenders',
        currentVersion: 'v3.1',
        totalVersions: 12,
        lastModified: '2024-01-21',
        modifiedBy: 'Mike Johnson',
        status: 'Active',
        changes: 'Added new pricing categories and updated formulas',
        fileSize: '3.1 MB',
        category: 'Financial'
      },
      {
        id: 4,
        name: 'Safety Protocol Manual',
        description: 'Comprehensive safety protocols and procedures',
        currentVersion: 'v2.0',
        totalVersions: 6,
        lastModified: '2024-01-18',
        modifiedBy: 'Sarah Wilson',
        status: 'Active',
        changes: 'Updated safety regulations and emergency procedures',
        fileSize: '4.2 MB',
        category: 'Safety'
      },
      {
        id: 5,
        name: 'Quality Assurance Checklist',
        description: 'Quality control and assurance verification checklist',
        currentVersion: 'v1.8',
        totalVersions: 9,
        lastModified: '2024-01-22',
        modifiedBy: 'David Brown',
        status: 'Draft',
        changes: 'Added new quality metrics and testing procedures',
        fileSize: '1.8 MB',
        category: 'Quality'
      },
      {
        id: 6,
        name: 'Legal Compliance Document',
        description: 'Legal compliance requirements and documentation',
        currentVersion: 'v4.2',
        totalVersions: 15,
        lastModified: '2024-01-17',
        modifiedBy: 'Emily Davis',
        status: 'Active',
        changes: 'Updated regulatory requirements and compliance standards',
        fileSize: '2.7 MB',
        category: 'Legal'
      },
      {
        id: 7,
        name: 'Project Timeline Template',
        description: 'Standard project timeline and milestone template',
        currentVersion: 'v2.5',
        totalVersions: 7,
        lastModified: '2024-01-23',
        modifiedBy: 'Robert Taylor',
        status: 'Active',
        changes: 'Added new milestone categories and dependencies',
        fileSize: '1.5 MB',
        category: 'Project'
      },
      {
        id: 8,
        name: 'Risk Assessment Framework',
        description: 'Comprehensive risk assessment and mitigation framework',
        currentVersion: 'v1.3',
        totalVersions: 4,
        lastModified: '2024-01-16',
        modifiedBy: 'Lisa Anderson',
        status: 'Archived',
        changes: 'Final version before archiving, all risks documented',
        fileSize: '2.9 MB',
        category: 'Risk'
      }
    ])
  }, [])

  const stats = useMemo(() => {
    const totalDocuments = documents.length
    const sumVersions = documents.reduce((acc, d) => acc + (d.totalVersions || 0), 0)
    const activeVersions = documents.filter(d => d.status === 'Active').length
    const draftVersions = documents.filter(d => d.status === 'Draft').length
    const archivedVersions = documents.filter(d => d.status === 'Archived').length
    const avgVersionsPerDoc = totalDocuments ? Math.round((sumVersions / totalDocuments) * 100) / 100 : 0
    return {
      totalDocuments,
      activeVersions,
      draftVersions,
      archivedVersions,
      totalVersions: sumVersions,
      avgVersionsPerDoc
    }
  }, [documents])

  const insightItems = useMemo(() => {
    const items = []
    if (stats.totalDocuments > 0) {
      items.push({
        title: `${stats.totalVersions} cumulative revisions across ${stats.totalDocuments} controlled documents`,
        detail: `Average depth is ${stats.avgVersionsPerDoc} versions per document with ${stats.activeVersions} active heads.`,
        tone: 'info'
      })
      items.push({
        title: 'Version hygiene and audit readiness',
        detail: 'Standardize naming and metadata for long-horizon tenders and joint ventures.',
        tone: 'success'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Version control registry is ready',
        detail: 'Register documents to unlock lineage tracking and exportable history.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleViewVersions = (document) => {
    setSelectedDocument(document)
    setShowModal(true)
  }

  const handleEditDocument = (document) => {
    setSelectedDocument(document)
    setFormData({
      ...document
    })
    setShowEditModal(true)
  }

  const handleDeleteDocument = (document) => {
    if (window.confirm(`Are you sure you want to delete document "${document.name}"?`)) {
      setDocuments(prev => prev.filter(d => d.id !== document.id))
      toast.success(`Successfully deleted document "${document.name}" from registry!`)
    }
  }

  const handleCreateNewVersion = (document) => {
    setSelectedDocument(document)
    const verParts = document.currentVersion.replace('v', '').split('.')
    const major = parseInt(verParts[0])
    const minor = parseInt(verParts[1] || 0)
    const nextVer = `v${major}.${minor + 1}`

    setFormData({
      ...document,
      currentVersion: nextVer,
      totalVersions: document.totalVersions + 1,
      changes: '',
      modifiedBy: 'Admin User'
    })
    setShowEditModal(true)
  }

  const handleSaveDocument = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.changes) {
      toast.error('Please enter name and change description.')
      return
    }

    const updatedData = {
      ...formData,
      lastModified: new Date().toISOString().split('T')[0]
    }

    setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? { ...d, ...updatedData } : d))
    toast.success(`Successfully incremented version for "${formData.name}" to ${formData.currentVersion}!`)
    setShowEditModal(false)
  }

  const columns = [
    {
      key: 'name',
      label: 'Document Details',
      width: '25%',
      render: (value, row) => (
        <div className="document-info">
          <div className="fw-semibold d-flex align-items-center">
            <FileText size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="document-meta">
            <small className="text-muted">Size: {row.fileSize}</small>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      width: '12%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'currentVersion',
      label: 'Current Version',
      width: '12%',
      render: (value) => (
        <div className="version-info">
          <div className="fw-bold text-primary">{value}</div>
        </div>
      )
    },
    {
      key: 'totalVersions',
      label: 'Total Versions',
      width: '12%',
      render: (value) => (
        <div className="text-center">
          <GitBranch size={16} className="me-1" />
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
      key: 'modifiedBy',
      label: 'Modified By',
      width: '12%'
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
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
      key: 'changes',
      label: 'Recent Changes',
      width: '15%',
      render: (value) => (
        <div className="changes-info">
          <small className="text-muted">
            {value.length > 50 ? `${value.substring(0, 50)}...` : value}
          </small>
        </div>
      )
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Draft': 'warning',
      'Archived': 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="versioning-page"
        showSkeleton={loading && !documents.length}
        breadcrumbs={[
          {
            label: 'Document Management',
            onClick: () => navigate('/document-management')
          },
          { label: 'Version Control', active: true }
        ]}
        onBack={() => navigate('/document-management')}
        title="Version control command center"
        description="Track document versions, change narratives, and maintain an exportable audit trail."
        heroMeta="Lineage telemetry"
        outlookTitle="Revision intelligence outlook"
        outlookDescription={`${stats.totalDocuments} documents carry ${stats.totalVersions} cumulative revisions with ${stats.activeVersions} active publication heads.`}
        outlookChips={[
          `${stats.totalDocuments} documents`,
          `${stats.totalVersions} revisions`,
          `${stats.avgVersionsPerDoc} avg depth`,
          `${stats.activeVersions} active`
        ]}
        insights={insightItems}
        kpiTitle="Version signal board"
        kpiMeta="Depth, status mix, and change volume"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Documents"
                value={stats.totalDocuments}
                hint="Controlled master records"
                tone="intel"
                trend="Registry"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total revisions"
                value={stats.totalVersions}
                hint="All recorded checkpoints"
                tone="warning"
                trend="History"
                icon={<GitBranch size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active heads"
                value={stats.activeVersions}
                hint="Published or live drafts"
                tone="success"
                trend="Live"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg versions / doc"
                value={stats.avgVersionsPerDoc}
                hint="Depth per asset"
                tone="intel"
                trend="Depth"
                icon={<History size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Document versions (${documents.length})`}
        tableActions={(
          <>
            <Button variant="outline-secondary" className="me-2" onClick={() => toast.success("Document version history audit log exported!")}>
              <Download size={16} className="me-2" />
              Export history
            </Button>
            <Button variant="primary" onClick={() => {
              if (documents.length > 0) {
                handleCreateNewVersion(documents[0]);
              } else {
                toast.info("No documents in library to increment version.");
              }
            }}>
              <Plus size={16} className="me-2" />
              New version
            </Button>
          </>
        )}
      >
        <DataTable
          data={documents}
          columns={columns}
          title="Document versions"
          searchable
          sortable
          exportable
          pagination
          pageSize={10}
          showActions
          showCheckboxes={false}
          onView={handleViewVersions}
          onEdit={handleEditDocument}
          onDelete={handleDeleteDocument}
          customActions={[
            {
              type: 'custom',
              label: 'Version History',
              onClick: (row) => {
                handleViewVersions(row)
              }
            },
            {
              type: 'custom',
              label: 'Download',
              onClick: (row) => {
                toast.success(`Downloading version ${row.currentVersion} of "${row.name}"...`)
              }
            }
          ]}
          searchPlaceholder="Search documents..."
          emptyMessage="No documents found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <GitBranch size={20} className="me-2" />
            Version History - {selectedDocument?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && (
            <div className="version-history">
              <p>Version history for {selectedDocument.name} will be displayed here.</p>
              <p>Current version: {selectedDocument.currentVersion}</p>
              <p>Total versions: {selectedDocument.totalVersions}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedDocument && (
            <Button variant="primary" onClick={() => {
              setShowModal(false);
              handleCreateNewVersion(selectedDocument);
            }}>
              <Plus size={16} className="me-2" />
              Create New Version
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Edit/Create Modal (Version Registry Form) */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Increment Version Checklist: {formData.currentVersion}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveDocument}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Document Name *</Form.Label>
              <Form.Control
                type="text"
                required
                readOnly
                value={formData.name}
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>New Version *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.currentVersion}
                    onChange={e => setFormData(prev => ({ ...prev, currentVersion: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={formData.category}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Recent Changes (Version Narrative) *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={formData.changes}
                onChange={e => setFormData(prev => ({ ...prev, changes: e.target.value }))}
                placeholder="e.g. Added section 4.2 compliance standards..."
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Modified By</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.modifiedBy}
                    onChange={e => setFormData(prev => ({ ...prev, modifiedBy: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              Commit Version
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default Versioning
