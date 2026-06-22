import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import { Search, Plus, Edit, Trash2, Eye, Brain, CheckCircle, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import AdminWorkspaceModal from '../../components/admin/AdminWorkspaceModal'
import { showToast } from '../../utils/toast'
import './AIPromptTemplates.scss'

const TEMPLATE_FORM_FIELDS = [
  { name: 'name', label: 'Name', required: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    required: true,
    options: [
      { value: 'Analysis', label: 'Analysis' },
      { value: 'Risk Management', label: 'Risk Management' },
      { value: 'Compliance', label: 'Compliance' }
    ]
  },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'prompt', label: 'Prompt', type: 'textarea', rows: 5, required: true }
]

const AIPromptTemplates = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    setTemplates([
      {
        id: 1,
        name: 'Tender Analysis Prompt',
        description: 'AI prompt for analyzing tender documents and extracting key information',
        category: 'Analysis',
        status: 'Active',
        lastUsed: '2024-02-10 14:30',
        usage: 245,
        aiOptimization: 'Optimized for accuracy and speed in tender analysis',
        aiConfidence: 94,
        priority: 'High',
        prompt: 'Analyze the following tender document and extract: 1) Key requirements, 2) Evaluation criteria, 3) Timeline, 4) Risk factors',
        variables: ['document_text', 'tender_type', 'industry'],
        responseFormat: 'JSON'
      },
      {
        id: 2,
        name: 'Risk Assessment Prompt',
        description: 'AI prompt for assessing project risks and mitigation strategies',
        category: 'Risk Management',
        status: 'Active',
        lastUsed: '2024-02-09 09:15',
        usage: 189,
        aiOptimization: 'Enhanced risk detection with mitigation recommendations',
        aiConfidence: 91,
        priority: 'High',
        prompt: 'Assess the following project for potential risks: 1) Technical risks, 2) Financial risks, 3) Timeline risks, 4) Mitigation strategies',
        variables: ['project_details', 'budget', 'timeline'],
        responseFormat: 'Structured Text'
      },
      {
        id: 3,
        name: 'Compliance Check Prompt',
        description: 'AI prompt for checking regulatory compliance and requirements',
        category: 'Compliance',
        status: 'Active',
        lastUsed: '2024-02-08 16:45',
        usage: 156,
        aiOptimization: 'Comprehensive compliance verification with regulatory updates',
        aiConfidence: 88,
        priority: 'Medium',
        prompt: 'Check the following proposal for compliance with: 1) Regulatory requirements, 2) Industry standards, 3) Legal obligations, 4) Best practices',
        variables: ['proposal_text', 'regulations', 'industry'],
        responseFormat: 'Checklist'
      }
    ])
  }, [])

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template)
    setShowModal(true)
  }

  const handleCreateTemplate = () => {
    setEditingItem(null)
    setShowFormModal(true)
  }

  const handleEditTemplate = (template) => {
    setEditingItem(template)
    setShowFormModal(true)
  }

  const handleDeleteTemplate = (template) => {
    if (!window.confirm(`Delete template "${template.name}"?`)) return
    setTemplates((prev) => prev.filter((entry) => entry.id !== template.id))
    showToast.success(`"${template.name}" deleted`)
  }

  const closeFormModal = () => {
    setShowFormModal(false)
    setEditingItem(null)
  }

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      setTemplates((prev) =>
        prev.map((entry) =>
          entry.id === editingItem.id
            ? {
                ...entry,
                name: formData.name,
                category: formData.category,
                description: formData.description,
                prompt: formData.prompt
              }
            : entry
        )
      )
      showToast.success(`Template "${formData.name}" updated`)
      closeFormModal()
      return
    }

    const newTemplate = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      status: 'Active',
      lastUsed: 'Never',
      usage: 0,
      aiOptimization: 'New template configuration',
      aiConfidence: 85,
      priority: 'Medium',
      prompt: formData.prompt,
      variables: [],
      responseFormat: 'JSON'
    }
    setTemplates((prev) => [...prev, newTemplate])
    closeFormModal()
    showToast.success(`Template "${formData.name}" created`)
  }

  const stats = useMemo(() => {
    const totalUsage = templates.reduce((sum, t) => sum + (t.usage || 0), 0)
    const categories = new Set(templates.map((t) => t.category)).size
    const highPriority = templates.filter((t) => t.priority === 'High').length
    const aiConfidence = templates.length
      ? Math.round(templates.reduce((sum, t) => sum + (t.aiConfidence || 0), 0) / templates.length)
      : 0
    return {
      totalTemplates: templates.length,
      active: templates.filter((t) => t.status === 'Active').length,
      categories,
      aiConfidence,
      totalUsage,
      avgUsage: templates.length ? Math.round(totalUsage / templates.length) : 0,
      highPriority
    }
  }, [templates])

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Draft': 'warning',
      'Error': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'secondary'
    }
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Analysis': Brain,
      'Risk Management': AlertTriangle,
      'Compliance': CheckCircle
    }
    return icons[category] || Brain
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalTemplates ?? 0) > 0) {
      items.push({
        title: `${stats.totalTemplates} templates · ${stats.totalUsage} total invocations`,
        detail: `${stats.categories} categories · avg usage ${stats.avgUsage} · ${stats.aiConfidence}% model confidence.`,
        tone: 'info'
      })
    }
    if ((stats.highPriority ?? 0) > 0) {
      items.push({
        title: `${stats.highPriority} high-priority template(s)`,
        detail: 'Ensure eval harnesses and safety rails stay current for production traffic.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Prompt library',
        detail: 'Author templates to activate optimization insights.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="ai-prompt-templates-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'AI & Prompt Templates', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="AI prompt command center"
        description="Manage AI prompt templates and configurations with intelligent optimization."
        heroMeta="Model-ready instruction sets"
        outlookTitle="LLM operations outlook"
        outlookDescription={`${stats.totalTemplates ?? 0} templates · ${stats.totalUsage ?? 0} invocations · ${stats.highPriority ?? 0} high priority.`}
        outlookChips={[
          `${stats.totalTemplates ?? 0} templates`,
          `${stats.totalUsage ?? 0} usage`,
          `${stats.categories ?? 0} categories`,
          `${stats.aiConfidence ?? 0}% AI`
        ]}
        insights={insightItems}
        kpiTitle="Prompt signal board"
        kpiMeta="Adoption, risk tiering, confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total templates"
                value={stats.totalTemplates ?? 0}
                hint="Library size"
                tone="intel"
                trend="Catalog"
                icon={<Brain size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total usage"
                value={stats.totalUsage ?? 0}
                hint="Invocations tracked"
                tone="intel"
                trend="Adoption"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="High priority"
                value={stats.highPriority ?? 0}
                hint="Needs governance"
                tone={(stats.highPriority ?? 0) > 0 ? 'warning' : 'success'}
                trend="Risk"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Quality signals"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="AI prompt templates"
        tableActions={
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateTemplate}>
              <Plus size={16} className="me-2" />
              New Template
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/admin-config/intelligence-platform')}>
              <Brain size={16} className="me-2" />
              AI Settings
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
                placeholder="Search templates..."
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
                <th>Template Details</th>
                <th>Category</th>
                <th>Status</th>
                <th>Usage</th>
                <th>Last Used</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.filter(template =>
                !searchTerm ||
                template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((template) => {
                const CategoryIcon = getCategoryIcon(template.category)
                return (
                  <tr key={template.id}>
                    <td>
                      <div className="template-info">
                        <h6 className="mb-1">{template.name}</h6>
                        <p className="text-muted mb-1">{template.description}</p>
                        <small className="text-muted">
                          Variables: {template.variables.length} • Format: {template.responseFormat}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="category-info">
                        <div className="d-flex align-items-center">
                          <CategoryIcon size={16} className="me-1" />
                          <span>{template.category}</span>
                        </div>
                      </div>
                    </td>
                    <td>{getStatusBadge(template.status)}</td>
                    <td>
                      <div className="usage-info">
                        <div className="fw-medium">{template.usage}</div>
                        <small className="text-muted">AI Confidence: {template.aiConfidence}%</small>
                      </div>
                    </td>
                    <td>
                      <div className="last-used">
                        <div className="fw-medium">{template.lastUsed}</div>
                      </div>
                    </td>
                    <td>{getPriorityBadge(template.priority)}</td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleViewTemplate(template)}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button variant="outline-warning" size="sm" className="me-1" onClick={() => handleEditTemplate(template)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTemplate(template)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Brain size={20} className="me-2" />
            Template Details - {selectedTemplate?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTemplate && (
            <div className="template-details">
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p><strong>Name:</strong> {selectedTemplate.name}</p>
                  <p><strong>Category:</strong> {selectedTemplate.category}</p>
                  <p><strong>Status:</strong> {selectedTemplate.status}</p>
                  <p><strong>Priority:</strong> {selectedTemplate.priority}</p>
                  <p><strong>Usage:</strong> {selectedTemplate.usage}</p>
                </Col>
                <Col md={6}>
                  <h6>Configuration</h6>
                  <p><strong>Response Format:</strong> {selectedTemplate.responseFormat}</p>
                  <p><strong>Variables:</strong> {selectedTemplate.variables.length}</p>
                  <p><strong>Last Used:</strong> {selectedTemplate.lastUsed}</p>
                  <p><strong>AI Confidence:</strong> {selectedTemplate.aiConfidence}%</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Description</h6>
                  <p>{selectedTemplate.description}</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Prompt Template</h6>
                  <div className="prompt-template">
                    <pre className="bg-light p-3 rounded">{selectedTemplate.prompt}</pre>
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Variables</h6>
                  <div className="variables-list">
                    {selectedTemplate.variables.map((variable, index) => (
                      <Badge key={index} bg="primary" className="me-1 mb-1">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>AI Assessment & Optimization</h6>
                  <Alert variant="info">
                    <Brain size={16} className="me-2" />
                    <strong>Optimization:</strong> {selectedTemplate.aiOptimization}
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle size={16} className="me-2" />
                    <strong>Confidence Level:</strong> {selectedTemplate.aiConfidence}% based on prompt effectiveness and response quality analysis
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
          <Button variant="primary" onClick={() => { setShowModal(false); handleEditTemplate(selectedTemplate) }}>
            <Edit size={16} className="me-2" />
            Edit Template
          </Button>
        </Modal.Footer>
      </Modal>

      <AdminWorkspaceModal
        show={showFormModal}
        onHide={closeFormModal}
        title={editingItem ? `Edit Template — ${editingItem.name}` : 'New AI Prompt Template'}
        description={editingItem ? 'Update prompt template content.' : 'Author a reusable prompt for AI-assisted workflows.'}
        submitLabel={editingItem ? 'Save changes' : 'Create Template'}
        fields={TEMPLATE_FORM_FIELDS}
        initialValues={
          editingItem
            ? {
                name: editingItem.name,
                category: editingItem.category,
                description: editingItem.description,
                prompt: editingItem.prompt
              }
            : {}
        }
        onSubmit={handleFormSubmit}
      />
    </>
  )
}

export default AIPromptTemplates
