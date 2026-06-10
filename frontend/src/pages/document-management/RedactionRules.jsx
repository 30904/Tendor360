import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Shield, Brain, CheckCircle, FileText, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './RedactionRules.scss'
import { dummyRedactionRulePrefill } from '../../utils/testFormDummies'

const RedactionRules = () => {
  const navigate = useNavigate()
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [prefillSnapshot, setPrefillSnapshot] = useState(null)
  const [modalFormKey, setModalFormKey] = useState(0)

  useEffect(() => {
    setRules([
      {
        id: 1,
        name: 'Financial Information Redaction',
        description: 'Automatically redact financial figures and pricing information',
        category: 'Financial',
        status: 'Active',
        priority: 'High',
        patterns: ['$[0-9,]+', 'Price: [0-9]+', 'Cost: [0-9]+'],
        documents: 45,
        lastUsed: '2024-01-20',
        createdBy: 'John Doe',
        createdDate: '2024-01-15',
        aiEnabled: true,
        aiAccuracy: 95
      },
      {
        id: 2,
        name: 'Personal Data Protection',
        description: 'Redact personal information and contact details',
        category: 'Privacy',
        status: 'Active',
        priority: 'Critical',
        patterns: ['[A-Za-z]+@[A-Za-z]+\\.[A-Za-z]+', 'Phone: [0-9-]+', 'SSN: [0-9-]+'],
        documents: 32,
        lastUsed: '2024-01-19',
        createdBy: 'Jane Smith',
        createdDate: '2024-01-12',
        aiEnabled: true,
        aiAccuracy: 98
      },
      {
        id: 3,
        name: 'Technical Specifications',
        description: 'Redact proprietary technical specifications and trade secrets',
        category: 'Technical',
        status: 'Draft',
        priority: 'Medium',
        patterns: ['Specification: [A-Z0-9]+', 'Patent: [A-Z0-9]+'],
        documents: 18,
        lastUsed: '2024-01-18',
        createdBy: 'Mike Johnson',
        createdDate: '2024-01-16',
        aiEnabled: false,
        aiAccuracy: 0
      },
      {
        id: 4,
        name: 'Legal Document Redaction',
        description: 'Redact sensitive legal information and case details',
        category: 'Legal',
        status: 'Active',
        priority: 'High',
        patterns: ['Case No: [A-Z0-9-]+', 'Attorney: [A-Za-z ]+', 'Court: [A-Za-z ]+'],
        documents: 67,
        lastUsed: '2024-01-21',
        createdBy: 'Sarah Wilson',
        createdDate: '2024-01-14',
        aiEnabled: true,
        aiAccuracy: 92
      },
      {
        id: 5,
        name: 'Healthcare Data Protection',
        description: 'Redact medical records and healthcare information',
        category: 'Healthcare',
        status: 'Active',
        priority: 'Critical',
        patterns: ['Patient ID: [A-Z0-9]+', 'Medical Record: [A-Z0-9]+', 'Diagnosis: [A-Za-z ]+'],
        documents: 89,
        lastUsed: '2024-01-22',
        createdBy: 'David Brown',
        createdDate: '2024-01-10',
        aiEnabled: true,
        aiAccuracy: 97
      },
      {
        id: 6,
        name: 'Government Classified Information',
        description: 'Redact classified government and security information',
        category: 'Security',
        status: 'Active',
        priority: 'Critical',
        patterns: ['Classification: [A-Z]+', 'Security Clearance: [A-Z0-9]+', 'Department: [A-Za-z ]+'],
        documents: 156,
        lastUsed: '2024-01-23',
        createdBy: 'Emily Davis',
        createdDate: '2024-01-08',
        aiEnabled: true,
        aiAccuracy: 99
      },
      {
        id: 7,
        name: 'Corporate Confidential Data',
        description: 'Redact corporate confidential and proprietary information',
        category: 'Corporate',
        status: 'Draft',
        priority: 'Medium',
        patterns: ['Confidential: [A-Za-z ]+', 'Proprietary: [A-Za-z ]+', 'Internal Use: [A-Za-z ]+'],
        documents: 23,
        lastUsed: '2024-01-17',
        createdBy: 'Robert Taylor',
        createdDate: '2024-01-20',
        aiEnabled: false,
        aiAccuracy: 0
      },
      {
        id: 8,
        name: 'Academic Research Data',
        description: 'Redact sensitive academic research and experimental data',
        category: 'Academic',
        status: 'Active',
        priority: 'High',
        patterns: ['Research ID: [A-Z0-9]+', 'Experiment: [A-Z0-9]+', 'Study: [A-Z0-9]+'],
        documents: 134,
        lastUsed: '2024-01-24',
        createdBy: 'Lisa Anderson',
        createdDate: '2024-01-11',
        aiEnabled: true,
        aiAccuracy: 94
      }
    ])
  }, [])

  const stats = useMemo(() => {
    const totalRules = rules.length
    const activeRules = rules.filter(r => r.status === 'Active').length
    const draftRules = rules.filter(r => r.status === 'Draft').length
    const totalDocuments = rules.reduce((a, r) => a + (r.documents || 0), 0)
    const withAi = rules.filter(r => r.aiAccuracy > 0)
    const avgAccuracy = withAi.length
      ? Math.round(withAi.reduce((a, r) => a + r.aiAccuracy, 0) / withAi.length)
      : 0
    return { totalRules, activeRules, draftRules, totalDocuments, avgAccuracy }
  }, [rules])

  const insightItems = useMemo(() => {
    const items = []
    if (stats.totalRules > 0) {
      items.push({
        title: `${stats.totalRules} redaction policies protecting ${stats.totalDocuments} document touchpoints`,
        detail: `${stats.activeRules} policies are enforced while ${stats.draftRules} drafts await activation.`,
        tone: 'info'
      })
    }
    if (stats.draftRules > 0) {
      items.push({
        title: 'Draft policies need validation',
        detail: 'Enable AI assistance on drafts to tighten detection before production release.',
        tone: 'warning'
      })
    }
    if (stats.avgAccuracy >= 90) {
      items.push({
        title: 'Classifier accuracy is operating at high fidelity',
        detail: 'Continue regression tests when new sensitive data classes are introduced.',
        tone: 'success'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Redaction policy registry is ready',
        detail: 'Author your first rule to automate content protection.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleEditRule = (rule) => {
    setPrefillSnapshot(null)
    setEditingRule(rule)
    setModalFormKey((k) => k + 1)
    setShowModal(true)
  }

  const handleDeleteRule = (rule) => {
    if (window.confirm(`Are you sure you want to delete rule "${rule.name}"?`)) {
      setRules(prev => prev.filter(r => r.id !== rule.id))
    }
  }

  const handleViewRule = (rule) => {
    console.log('View rule:', rule)
  }

  const columns = [
    {
      key: 'name',
      label: 'Rule Details',
      width: '25%',
      render: (value, row) => (
        <div className="rule-info">
          <div className="fw-semibold d-flex align-items-center">
            <Shield size={16} className="me-2" />
            {value}
            {row.aiEnabled && (
              <Brain size={14} className="ms-2 text-primary" title="AI Enabled" />
            )}
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
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '10%',
      render: (value) => getPriorityBadge(value)
    },
    {
      key: 'documents',
      label: 'Documents',
      width: '10%',
      render: (value) => (
        <div className="text-center">
          <FileText size={16} className="me-1" />
          <span className="fw-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'aiAccuracy',
      label: 'AI Accuracy',
      width: '12%',
      render: (value) => (
        <div className="accuracy-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">Accuracy</small>
        </div>
      )
    },
    {
      key: 'lastUsed',
      label: 'Last Used',
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
      'Active': 'success',
      'Draft': 'warning',
      'Inactive': 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      'Critical': 'danger',
      'High': 'warning',
      'Medium': 'info',
      'Low': 'secondary'
    }
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  const openCreateModal = () => {
    setEditingRule(null)
    setPrefillSnapshot(null)
    setModalFormKey((k) => k + 1)
    setShowModal(true)
  }

  const formSeed = editingRule || prefillSnapshot || {}

  const closeRedactionModal = () => {
    setShowModal(false)
    setEditingRule(null)
    setPrefillSnapshot(null)
    setModalFormKey((k) => k + 1)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="redaction-rules-page"
        showSkeleton={loading && !rules.length}
        breadcrumbs={[
          {
            label: 'Document Management',
            onClick: () => navigate('/document-management')
          },
          { label: 'Redaction Rules', active: true }
        ]}
        onBack={() => navigate('/document-management')}
        title="Redaction rules command center"
        description="Configure automated redaction policies and AI-assisted detectors across sensitive document classes."
        heroMeta="Data minimization telemetry"
        outlookTitle="Policy enforcement outlook"
        outlookDescription={`${stats.totalRules} rules cover ${stats.totalDocuments} protected documents with ${stats.activeRules} active guardrails.`}
        outlookChips={[
          `${stats.totalRules} rules`,
          `${stats.activeRules} active`,
          `${stats.draftRules} draft`,
          `${stats.avgAccuracy}% AI accuracy`
        ]}
        insights={insightItems}
        kpiTitle="Protection signal board"
        kpiMeta="Rule mix, coverage, and classifier quality"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total rules"
                value={stats.totalRules}
                hint="Configured policies"
                tone="intel"
                trend="Registry"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active rules"
                value={stats.activeRules}
                hint="Enforced in pipelines"
                tone="success"
                trend="Live"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Documents protected"
                value={stats.totalDocuments}
                hint="Cumulative touches"
                tone="warning"
                trend="Coverage"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg AI accuracy"
                value={stats.avgAccuracy}
                hint="Where AI is enabled"
                tone={stats.avgAccuracy >= 85 ? 'success' : 'warning'}
                trend="Quality"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Redaction rules (${rules.length})`}
        tableActions={(
          <>
            <Button variant="outline-secondary" className="me-2">
              <Settings size={16} className="me-2" />
              Settings
            </Button>
            <Button variant="primary" onClick={openCreateModal}>
              <Plus size={16} className="me-2" />
              New rule
            </Button>
          </>
        )}
      >
        <DataTable
          data={rules}
          columns={columns}
          title="Redaction rules"
          searchable
          sortable
          exportable
          pagination
          pageSize={10}
          showActions
          showCheckboxes={false}
          onView={handleViewRule}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
          customActions={[
            {
              type: 'custom',
              label: 'Configure',
              onClick: (row) => {
                console.log('Configure rule:', row.name)
              }
            }
          ]}
          searchPlaceholder="Search redaction rules..."
          emptyMessage="No redaction rules found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={closeRedactionModal}
        size="lg"
        onTestFill={
          showModal
            ? () => {
                setPrefillSnapshot(dummyRedactionRulePrefill())
                setModalFormKey((k) => k + 1)
              }
            : undefined
        }
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Shield size={20} className="me-2" />
            {editingRule ? 'Edit Redaction Rule' : 'New Redaction Rule'}
          </Modal.Title>
        </Modal.Header>
        <Form key={modalFormKey}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rule Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter rule name"
                    defaultValue={formSeed.name || ''}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select defaultValue={formSeed.category || ''}>
                    <option value="">Select category</option>
                    <option value="Financial">Financial</option>
                    <option value="Privacy">Privacy</option>
                    <option value="Technical">Technical</option>
                    <option value="Legal">Legal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter rule description"
                defaultValue={formSeed.description || ''}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Redaction Patterns</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter regex patterns (one per line)"
                defaultValue={
                  (Array.isArray(formSeed.patterns) ? formSeed.patterns.join('\n') : formSeed.patterns) || ''
                }
              />
              <Form.Text className="text-muted">
                Use regex patterns to identify content to redact. One pattern per line.
              </Form.Text>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select defaultValue={formSeed.priority || ''}>
                    <option value="">Select priority</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={formSeed.status || ''}>
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Enable AI assistance for improved accuracy"
                defaultChecked={formSeed.aiEnabled || false}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeRedactionModal}>
              Cancel
            </Button>
            <Button variant="primary">
              {editingRule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </Modal.Footer>
        </Form>
      </FormDrawerModal>
    </>
  )
}

export default RedactionRules
