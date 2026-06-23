import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, FileText, Layers, CheckCircle, BookOpen, Edit, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { toast } from 'react-toastify'
import './Templates.scss'
import { dummyTemplateForm } from '../../utils/testFormDummies'

const Templates = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'GENERAL',
    type: 'DOCUMENT',
    content: '',
    tags: '',
    isActive: true
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    const mockTemplates = [
      {
        id: 1,
        name: 'Technical Proposal Template',
        description: 'Standard template for technical proposals',
        category: 'TECHNICAL',
        type: 'PROPOSAL',
        content: 'Technical proposal content...',
        tags: 'technical, proposal, RFP',
        isActive: true,
        usageCount: 25,
        lastModified: '2024-01-15T10:30:00Z',
        createdBy: 'Admin User'
      },
      {
        id: 2,
        name: 'Financial Bid Template',
        description: 'Template for financial bid submissions',
        category: 'FINANCIAL',
        type: 'BID',
        content: 'Financial bid content...',
        tags: 'financial, bid, pricing',
        isActive: true,
        usageCount: 18,
        lastModified: '2024-01-14T14:20:00Z',
        createdBy: 'Finance Team'
      },
      {
        id: 3,
        name: 'Compliance Checklist',
        description: 'Standard compliance verification checklist',
        category: 'COMPLIANCE',
        type: 'CHECKLIST',
        content: 'Compliance checklist content...',
        tags: 'compliance, checklist, verification',
        isActive: true,
        usageCount: 12,
        lastModified: '2024-01-13T09:15:00Z',
        createdBy: 'Compliance Team'
      },
      {
        id: 4,
        name: 'Project Timeline Template',
        description: 'Template for project timeline and milestones',
        category: 'PROJECT',
        type: 'TIMELINE',
        content: 'Project timeline content...',
        tags: 'project, timeline, milestones',
        isActive: false,
        usageCount: 8,
        lastModified: '2024-01-10T16:45:00Z',
        createdBy: 'Project Manager'
      },
      {
        id: 5,
        name: 'Risk Assessment Template',
        description: 'Comprehensive risk assessment and mitigation plan',
        category: 'RISK',
        type: 'ASSESSMENT',
        content: 'Risk assessment content...',
        tags: 'risk, assessment, mitigation',
        isActive: true,
        usageCount: 15,
        lastModified: '2024-01-12T11:30:00Z',
        createdBy: 'Risk Manager'
      },
      {
        id: 6,
        name: 'Quality Assurance Checklist',
        description: 'Quality control and assurance verification checklist',
        category: 'QUALITY',
        type: 'CHECKLIST',
        content: 'QA checklist content...',
        tags: 'quality, assurance, checklist',
        isActive: true,
        usageCount: 22,
        lastModified: '2024-01-11T13:15:00Z',
        createdBy: 'QA Team'
      },
      {
        id: 7,
        name: 'Contract Terms Template',
        description: 'Standard contract terms and conditions template',
        category: 'LEGAL',
        type: 'CONTRACT',
        content: 'Contract terms content...',
        tags: 'legal, contract, terms',
        isActive: true,
        usageCount: 19,
        lastModified: '2024-01-09T15:20:00Z',
        createdBy: 'Legal Team'
      },
      {
        id: 8,
        name: 'Resource Allocation Template',
        description: 'Template for resource planning and allocation',
        category: 'RESOURCE',
        type: 'PLANNING',
        content: 'Resource allocation content...',
        tags: 'resource, planning, allocation',
        isActive: true,
        usageCount: 14,
        lastModified: '2024-01-08T10:45:00Z',
        createdBy: 'Resource Manager'
      },
      {
        id: 9,
        name: 'Communication Plan Template',
        description: 'Stakeholder communication and reporting plan',
        category: 'COMMUNICATION',
        type: 'PLAN',
        content: 'Communication plan content...',
        tags: 'communication, stakeholder, reporting',
        isActive: false,
        usageCount: 6,
        lastModified: '2024-01-07T14:30:00Z',
        createdBy: 'Communication Manager'
      },
      {
        id: 10,
        name: 'Budget Estimation Template',
        description: 'Detailed budget estimation and cost breakdown',
        category: 'FINANCIAL',
        type: 'BUDGET',
        content: 'Budget estimation content...',
        tags: 'budget, estimation, cost',
        isActive: true,
        usageCount: 31,
        lastModified: '2024-01-06T09:00:00Z',
        createdBy: 'Finance Team'
      }
    ]
    setTemplates(mockTemplates)
  }

  const stats = useMemo(() => {
    const total = templates.length
    const active = templates.filter(t => t.isActive).length
    const categories = new Set(templates.map(t => t.category)).size
    const usage = templates.reduce((a, t) => a + (t.usageCount || 0), 0)
    return { total, active, inactive: total - active, categories, usage }
  }, [templates])

  const insightItems = useMemo(() => {
    const items = []
    if (stats.total > 0) {
      items.push({
        title: `${stats.total} governed templates with ${stats.usage} aggregate reuse events`,
        detail: `${stats.active} assets are publisher-ready across ${stats.categories} disciplines.`,
        tone: 'info'
      })
    }
    if (stats.inactive > 0) {
      items.push({
        title: 'Sunset inactive templates',
        detail: 'Archive dormant clause packs to reduce version drift in regulated bids.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Template library awaits authoring',
        detail: 'Seed jurisdictional packs to accelerate submission consistency.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextId = templates.length ? Math.max(...templates.map(t => t.id), 0) + 1 : 1
    if (editingTemplate) {
      setTemplates(prev => prev.map(template =>
        template.id === editingTemplate.id
          ? { ...template, ...formData, lastModified: new Date().toISOString() }
          : template
      ))
      toast.success(`Successfully updated template "${formData.name}"!`)
    } else {
      const newTemplate = {
        id: nextId,
        ...formData,
        usageCount: 0,
        lastModified: new Date().toISOString(),
        createdBy: 'Current User'
      }
      setTemplates(prev => [...prev, newTemplate])
      toast.success(`Successfully created template "${formData.name}"!`)
    }
    setShowModal(false)
    setEditingTemplate(null)
    resetForm()
  }

  const handleDelete = (id) => {
    const template = templates.find(t => t.id === id)
    if (window.confirm(`Are you sure you want to delete template "${template?.name}"?`)) {
      setTemplates(prev => prev.filter(template => template.id !== id))
      toast.success(`Successfully deleted template "${template?.name}"!`)
    }
  }

  const handleEdit = (template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      type: template.type,
      content: template.content,
      tags: template.tags,
      isActive: template.isActive
    })
    setShowModal(true)
  }

  const handleDuplicate = (template) => {
    const nextId = templates.length ? Math.max(...templates.map(t => t.id), 0) + 1 : 1
    const duplicatedTemplate = {
      ...template,
      id: nextId,
      name: `${template.name} (Copy)`,
      usageCount: 0,
      lastModified: new Date().toISOString(),
      createdBy: 'Current User'
    }
    setTemplates(prev => [...prev, duplicatedTemplate])
    toast.success(`Duplicated template into "${duplicatedTemplate.name}"!`)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'GENERAL',
      type: 'DOCUMENT',
      content: '',
      tags: '',
      isActive: true
    })
  }

  const openCreateModal = () => {
    setEditingTemplate(null)
    resetForm()
    setShowModal(true)
  }

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template)
    setShowViewModal(true)
  }

  const columns = [
    {
      key: 'name',
      label: 'Template Details',
      width: '25%',
      render: (value, row) => (
        <div className="template-info">
          <div className="fw-semibold d-flex align-items-center">
            <FileText size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
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
      key: 'type',
      label: 'Type',
      width: '12%',
      render: (value) => (
        <Badge bg="secondary">{value}</Badge>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      width: '10%',
      render: (value) => (
        <Badge bg={value ? 'success' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'usageCount',
      label: 'Usage',
      width: '8%',
      render: (value) => (
        <div className="text-center">
          <div className="fw-bold text-primary">{value}</div>
          <small className="text-muted">times</small>
        </div>
      )
    },
    {
      key: 'createdBy',
      label: 'Created By',
      width: '15%'
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
      key: 'tags',
      label: 'Tags',
      width: '10%',
      render: (value) => (
        <div className="tags-info">
          <small className="text-muted">
            {value.split(',').slice(0, 2).join(', ')}
            {value.split(',').length > 2 && ` +${value.split(',').length - 2} more`}
          </small>
        </div>
      )
    }
  ]

  const categories = ['GENERAL', 'TECHNICAL', 'FINANCIAL', 'COMPLIANCE', 'PROJECT']
  const types = ['DOCUMENT', 'PROPOSAL', 'BID', 'CHECKLIST', 'TIMELINE']

  return (
    <>
      <ExecutiveCommandCenter
        className="templates-page"
        showSkeleton={loading && !templates.length}
        breadcrumbs={[
          {
            label: 'Document Management',
            onClick: () => navigate('/document-management')
          },
          { label: 'Template Library', active: true }
        ]}
        onBack={() => navigate('/document-management')}
        title="Template library command center"
        description="Manage document templates, jurisdictional clause sets, and reuse telemetry."
        heroMeta="Authoring operations"
        outlookTitle="Template portfolio outlook"
        outlookDescription={`${stats.total} templates (${stats.active} active) span ${stats.categories} categories with ${stats.usage} historical applications.`}
        outlookChips={[
          `${stats.total} templates`,
          `${stats.active} active`,
          `${stats.categories} categories`,
          `${stats.usage} uses`
        ]}
        insights={insightItems}
        kpiTitle="Template signal board"
        kpiMeta="Adoption, diversity, and lifecycle health"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total templates"
                value={stats.total}
                hint="Registered assets"
                tone="intel"
                trend="Registry"
                icon={<Layers size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active"
                value={stats.active}
                hint="Ready for bids"
                tone="success"
                trend="Live"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Categories"
                value={stats.categories}
                hint="Taxonomy breadth"
                tone="warning"
                trend="Coverage"
                icon={<BookOpen size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Reuse events"
                value={stats.usage}
                hint="Cumulative applications"
                tone="intel"
                trend="Adoption"
                icon={<FileText size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Templates (${templates.length})`}
        tableActions={(
          <Button variant="primary" onClick={openCreateModal} className="add-template-btn">
            <Plus size={20} className="me-2" />
            Add template
          </Button>
        )}
      >
        <DataTable
          data={templates}
          columns={columns}
          title={`Templates (${templates.length})`}
          searchable
          sortable
          exportable
          pagination
          pageSize={10}
          showActions
          showCheckboxes={false}
          onView={handleViewTemplate}
          onEdit={handleEdit}
          onDelete={(row) => handleDelete(row.id)}
          customActions={[
            {
              type: 'custom',
              label: 'Duplicate',
              onClick: (row) => handleDuplicate(row)
            },
            {
              type: 'custom',
              label: 'Download',
              onClick: (row) => {
                toast.success(`Starting download for template "${row.name}"...`)
              }
            }
          ]}
          searchPlaceholder="Search templates..."
          emptyMessage="No templates found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        onTestFill={showModal ? () => setFormData(dummyTemplateForm()) : undefined}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTemplate ? 'Edit Template' : 'Add New Template'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Template Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Comma-separated tags"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Template Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter template content..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingTemplate ? 'Update' : 'Add Template'}
            </Button>
          </Modal.Footer>
        </Form>
      </FormDrawerModal>

      {/* View Template Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <FileText size={20} className="me-2 text-primary" />
            Template Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTemplate && (
            <div className="p-2">
              <h5 className="mb-3 text-primary">{selectedTemplate.name}</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Category:</strong> {selectedTemplate.category}
                </Col>
                <Col md={6}>
                  <strong>Type:</strong> {selectedTemplate.type}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Status:</strong>{' '}
                  <Badge bg={selectedTemplate.isActive ? 'success' : 'secondary'}>
                    {selectedTemplate.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Col>
                <Col md={6}>
                  <strong>Usage Count:</strong> {selectedTemplate.usageCount} times reused
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Created By:</strong> {selectedTemplate.createdBy}
                </Col>
                <Col md={6}>
                  <strong>Last Modified:</strong>{' '}
                  {new Date(selectedTemplate.lastModified).toLocaleDateString()}
                </Col>
              </Row>
              <div className="mb-3">
                <strong>Tags:</strong>{' '}
                {selectedTemplate.tags.split(',').map((tag, index) => (
                  <Badge key={index} bg="info" className="me-1">{tag.trim()}</Badge>
                ))}
              </div>
              <hr />
              <div className="mb-3">
                <h6>Description</h6>
                <p>{selectedTemplate.description}</p>
              </div>
              <div className="mb-3">
                <h6>Template Content Schema</h6>
                <pre className="p-3 bg-light rounded" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedTemplate.content}
                </pre>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          {selectedTemplate && (
            <>
              <Button variant="outline-primary" onClick={() => {
                setShowViewModal(false);
                toast.success(`Starting download for template "${selectedTemplate.name}"...`);
              }}>
                <Download size={16} className="me-2" />
                Download Template
              </Button>
              <Button variant="primary" onClick={() => {
                setShowViewModal(false);
                handleEdit(selectedTemplate);
              }}>
                <Edit size={16} className="me-2" />
                Edit Template
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Templates
