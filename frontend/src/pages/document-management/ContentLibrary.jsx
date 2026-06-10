import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Edit, Upload, Download, FileStack, CheckCircle, FolderOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './ContentLibrary.scss'

const ContentLibrary = () => {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)

  useEffect(() => {
    setDocuments([
      {
        id: 1,
        name: 'Tender Specification Document',
        type: 'PDF',
        size: '2.4 MB',
        category: 'Technical',
        status: 'Active',
        uploadedBy: 'John Doe',
        uploadedDate: '2024-01-15',
        tags: ['specification', 'technical', 'requirements']
      },
      {
        id: 2,
        name: 'Company Profile Template',
        type: 'DOCX',
        size: '1.2 MB',
        category: 'Template',
        status: 'Active',
        uploadedBy: 'Jane Smith',
        uploadedDate: '2024-01-14',
        tags: ['template', 'profile', 'company']
      },
      {
        id: 3,
        name: 'Compliance Checklist',
        type: 'XLSX',
        size: '856 KB',
        category: 'Compliance',
        status: 'Draft',
        uploadedBy: 'Mike Johnson',
        uploadedDate: '2024-01-13',
        tags: ['compliance', 'checklist', 'audit']
      },
      {
        id: 4,
        name: 'Financial Proposal Template',
        type: 'DOCX',
        size: '1.8 MB',
        category: 'Financial',
        status: 'Active',
        uploadedBy: 'Sarah Wilson',
        uploadedDate: '2024-01-12',
        tags: ['financial', 'proposal', 'template']
      },
      {
        id: 5,
        name: 'Legal Terms and Conditions',
        type: 'PDF',
        size: '3.2 MB',
        category: 'Legal',
        status: 'Active',
        uploadedBy: 'David Brown',
        uploadedDate: '2024-01-11',
        tags: ['legal', 'terms', 'conditions']
      },
      {
        id: 6,
        name: 'Technical Architecture Diagram',
        type: 'PPTX',
        size: '4.1 MB',
        category: 'Technical',
        status: 'Draft',
        uploadedBy: 'Emily Davis',
        uploadedDate: '2024-01-10',
        tags: ['architecture', 'diagram', 'technical']
      },
      {
        id: 7,
        name: 'Risk Assessment Matrix',
        type: 'XLSX',
        size: '1.5 MB',
        category: 'Compliance',
        status: 'Active',
        uploadedBy: 'Robert Taylor',
        uploadedDate: '2024-01-09',
        tags: ['risk', 'assessment', 'matrix']
      },
      {
        id: 8,
        name: 'Project Timeline Template',
        type: 'XLSX',
        size: '2.1 MB',
        category: 'Template',
        status: 'Active',
        uploadedBy: 'Lisa Anderson',
        uploadedDate: '2024-01-08',
        tags: ['timeline', 'project', 'template']
      },
      {
        id: 9,
        name: 'Quality Assurance Checklist',
        type: 'PDF',
        size: '1.9 MB',
        category: 'Compliance',
        status: 'Archived',
        uploadedBy: 'Michael Chen',
        uploadedDate: '2024-01-07',
        tags: ['quality', 'assurance', 'checklist']
      },
      {
        id: 10,
        name: 'Budget Estimation Worksheet',
        type: 'XLSX',
        size: '2.7 MB',
        category: 'Financial',
        status: 'Active',
        uploadedBy: 'Jennifer Lee',
        uploadedDate: '2024-01-06',
        tags: ['budget', 'estimation', 'worksheet']
      }
    ])
  }, [])

  const stats = useMemo(() => {
    const total = documents.length
    const active = documents.filter(d => d.status === 'Active').length
    const draft = documents.filter(d => d.status === 'Draft').length
    const categories = new Set(documents.map(d => d.category)).size
    return { total, active, draft, categories }
  }, [documents])

  const insightItems = useMemo(() => {
    const items = []
    if (stats.total > 0) {
      items.push({
        title: `${stats.total} library items across ${stats.categories} categories`,
        detail: `${stats.active} are published as active; ${stats.draft} remain in draft.`,
        tone: 'info'
      })
    }
    if (stats.draft > 0) {
      items.push({
        title: 'Draft assets need editorial review',
        detail: 'Complete metadata and promote drafts before tender deadlines.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Content library is ready for uploads',
        detail: 'Add documents to power submissions, templates, and compliance packs.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleViewDocument = (document) => {
    setSelectedDocument(document)
    setShowModal(true)
  }

  const handleEditDocument = (document) => {
    console.log('Edit document:', document)
  }

  const handleDeleteDocument = (document) => {
    if (window.confirm(`Are you sure you want to delete "${document.name}"?`)) {
      setDocuments(prev => prev.filter(doc => doc.id !== document.id))
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      Active: 'success',
      Draft: 'warning',
      Archived: 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      PDF: '📄',
      DOCX: '📝',
      XLSX: '📊',
      PPTX: '📊',
      TXT: '📄'
    }
    return icons[type] || '📄'
  }

  const columns = [
    {
      key: 'name',
      label: 'Document',
      width: '30%',
      render: (value, row) => (
        <div className="document-info">
          <div className="document-icon">
            {getTypeIcon(row.type)}
          </div>
          <div className="document-details">
            <div className="document-name fw-semibold">{value}</div>
            <div className="document-meta">
              <small className="text-muted">
                {row.type} • {row.tags.join(', ')}
              </small>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      width: '15%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      type: 'badge',
      badgeClass: (value) => {
        const variants = {
          'Active': 'badge-success',
          'Draft': 'badge-warning',
          'Archived': 'badge-secondary'
        }
        return variants[value] || 'badge-secondary'
      }
    },
    {
      key: 'size',
      label: 'Size',
      width: '10%'
    },
    {
      key: 'uploadedBy',
      label: 'Uploaded By',
      width: '15%'
    },
    {
      key: 'uploadedDate',
      label: 'Date',
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

  return (
    <>
      <ExecutiveCommandCenter
        className="content-library-page"
        showSkeleton={loading && !documents.length}
        breadcrumbs={[
          {
            label: 'Document Management',
            onClick: () => navigate('/document-management')
          },
          { label: 'Content Library', active: true }
        ]}
        onBack={() => navigate('/document-management')}
        title="Content library command center"
        description="Manage and organize document content with registry-level visibility across categories and lifecycle states."
        heroMeta="Library readiness telemetry"
        outlookTitle="Distribution readiness outlook"
        outlookDescription={`${stats.total} documents indexed with ${stats.active} active, ${stats.draft} in draft, spanning ${stats.categories} categories.`}
        outlookChips={[
          `${stats.total} documents`,
          `${stats.active} active`,
          `${stats.draft} draft`,
          `${stats.categories} categories`
        ]}
        insights={insightItems}
        kpiTitle="Library signal board"
        kpiMeta="Volume, status mix, and taxonomy coverage"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total documents"
                value={stats.total}
                hint="All indexed assets"
                tone="intel"
                trend="Registry"
                icon={<FileStack size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active"
                value={stats.active}
                hint="Published for use"
                tone="success"
                trend="Live"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Draft"
                value={stats.draft}
                hint="Needs review"
                tone="warning"
                trend="Workflow"
                icon={<Edit size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Categories"
                value={stats.categories}
                hint="Distinct taxonomy nodes"
                tone="intel"
                trend="Coverage"
                icon={<FolderOpen size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Documents (${documents.length})`}
        tableActions={(
          <>
            <Button variant="outline-primary" className="me-2">
              <Upload size={18} className="me-2" />
              Upload
            </Button>
            <Button variant="primary">
              <Plus size={18} className="me-2" />
              Add document
            </Button>
          </>
        )}
      >
        <DataTable
          data={documents}
          columns={columns}
          title={`Documents (${documents.length})`}
          searchable
          sortable
          exportable
          pagination
          pageSize={10}
          showActions
          showCheckboxes={false}
          onView={handleViewDocument}
          onEdit={handleEditDocument}
          onDelete={handleDeleteDocument}
          customActions={[
            {
              type: 'custom',
              label: 'Download',
              onClick: (row) => {
                console.log('Download document:', row.name)
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
            {selectedDocument?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Type:</strong> {selectedDocument.type}
                </Col>
                <Col md={6}>
                  <strong>Size:</strong> {selectedDocument.size}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Category:</strong> {selectedDocument.category}
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> {getStatusBadge(selectedDocument.status)}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Uploaded By:</strong> {selectedDocument.uploadedBy}
                </Col>
                <Col md={6}>
                  <strong>Date:</strong> {selectedDocument.uploadedDate}
                </Col>
              </Row>
              <div className="mb-3">
                <strong>Tags:</strong>
                <div className="mt-2">
                  {selectedDocument.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-center p-4">
                <div className="document-preview">
                  <div className="preview-icon">
                    {getTypeIcon(selectedDocument.type)}
                  </div>
                  <p className="text-muted">Document preview would be displayed here</p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <Download size={16} className="me-2" />
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ContentLibrary
