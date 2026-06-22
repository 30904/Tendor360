import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import { Search, Plus, Edit, Trash2, Eye, Key, Webhook, Brain, CheckCircle, Settings, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import AdminWorkspaceModal from '../../components/admin/AdminWorkspaceModal'
import { showToast } from '../../utils/toast'
import './APIKeysWebhooks.scss'

const API_KEY_FORM_FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true }
]

const WEBHOOK_FORM_FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'url', label: 'URL', type: 'url', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true }
]

const generateApiKey = () => {
  const segment = () => Math.random().toString(36).slice(2, 6)
  return `tm_api_${segment()}_****_****_****`
}

const APIKeysWebhooks = () => {
  const navigate = useNavigate()
  const [apiKeys, setApiKeys] = useState([])
  const [webhooks, setWebhooks] = useState([])
  const [activeTab, setActiveTab] = useState('apikeys')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    setApiKeys([
      {
        id: 1,
        name: 'Tender Management API',
        key: 'tm_api_****_****_****_****',
        description: 'API key for tender management operations',
        status: 'Active',
        lastUsed: '2024-02-10 14:30',
        usage: 1250,
        aiOptimization: 'Optimized for high-frequency tender operations',
        aiConfidence: 94,
        priority: 'High',
        permissions: ['read', 'write', 'delete'],
        expiryDate: '2024-12-31'
      },
      {
        id: 2,
        name: 'Document API',
        key: 'doc_api_****_****_****_****',
        description: 'API key for document management services',
        status: 'Active',
        lastUsed: '2024-02-10 12:15',
        usage: 890,
        aiOptimization: 'Enhanced document processing capabilities',
        aiConfidence: 91,
        priority: 'Medium',
        permissions: ['read', 'write'],
        expiryDate: '2024-11-30'
      },
      {
        id: 3,
        name: 'Reporting API',
        key: 'rpt_api_****_****_****_****',
        description: 'API key for reporting and analytics',
        status: 'Inactive',
        lastUsed: '2024-02-08 09:45',
        usage: 456,
        aiOptimization: 'Read-only access for reporting functions',
        aiConfidence: 88,
        priority: 'Low',
        permissions: ['read'],
        expiryDate: '2024-10-31'
      }
    ])

    setWebhooks([
      {
        id: 1,
        name: 'Tender Status Updates',
        url: 'https://api.example.com/webhooks/tender-status',
        description: 'Webhook for tender status change notifications',
        status: 'Active',
        lastTriggered: '2024-02-10 14:30',
        triggers: 245,
        aiOptimization: 'Real-time tender status synchronization',
        aiConfidence: 96,
        priority: 'High',
        events: ['tender.created', 'tender.updated', 'tender.completed'],
        retryCount: 3
      },
      {
        id: 2,
        name: 'Document Upload Notifications',
        url: 'https://api.example.com/webhooks/document-upload',
        description: 'Webhook for document upload notifications',
        status: 'Active',
        lastTriggered: '2024-02-10 12:15',
        triggers: 189,
        aiOptimization: 'Automated document processing triggers',
        aiConfidence: 92,
        priority: 'Medium',
        events: ['document.uploaded', 'document.processed'],
        retryCount: 2
      },
      {
        id: 3,
        name: 'User Activity Logs',
        url: 'https://api.example.com/webhooks/user-activity',
        description: 'Webhook for user activity logging',
        status: 'Inactive',
        lastTriggered: '2024-02-08 09:45',
        triggers: 156,
        aiOptimization: 'Comprehensive user activity tracking',
        aiConfidence: 89,
        priority: 'Low',
        events: ['user.login', 'user.logout', 'user.action'],
        retryCount: 1
      }
    ])
  }, [])

  const handleViewItem = (item) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key)
    showToast.success('API key copied to clipboard')
  }

  const handleCreateItem = () => {
    setEditingItem(null)
    setShowFormModal(true)
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setShowFormModal(true)
  }

  const handleDeleteItem = (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return
    if (activeTab === 'apikeys') {
      setApiKeys((prev) => prev.filter((entry) => entry.id !== item.id))
    } else {
      setWebhooks((prev) => prev.filter((entry) => entry.id !== item.id))
    }
    showToast.success(`"${item.name}" deleted`)
  }

  const closeFormModal = () => {
    setShowFormModal(false)
    setEditingItem(null)
  }

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      if (activeTab === 'apikeys') {
        setApiKeys((prev) =>
          prev.map((entry) =>
            entry.id === editingItem.id ? { ...entry, name: formData.name, description: formData.description } : entry
          )
        )
      } else {
        setWebhooks((prev) =>
          prev.map((entry) =>
            entry.id === editingItem.id
              ? { ...entry, name: formData.name, url: formData.url, description: formData.description }
              : entry
          )
        )
      }
      showToast.success(`"${formData.name}" updated`)
      closeFormModal()
      return
    }

    if (activeTab === 'apikeys') {
      const expiry = new Date()
      expiry.setFullYear(expiry.getFullYear() + 1)
      const newKey = {
        id: Date.now(),
        name: formData.name,
        key: generateApiKey(),
        description: formData.description,
        status: 'Active',
        lastUsed: 'Never',
        usage: 0,
        aiOptimization: 'New API key configuration',
        aiConfidence: 85,
        priority: 'Medium',
        permissions: ['read', 'write'],
        expiryDate: expiry.toISOString().slice(0, 10)
      }
      setApiKeys((prev) => [...prev, newKey])
      showToast.success(`API key "${formData.name}" created`)
    } else {
      const newWebhook = {
        id: Date.now(),
        name: formData.name,
        url: formData.url,
        description: formData.description,
        status: 'Active',
        lastTriggered: 'Never',
        triggers: 0,
        aiOptimization: 'New webhook configuration',
        aiConfidence: 85,
        priority: 'Medium',
        events: [],
        retryCount: 3
      }
      setWebhooks((prev) => [...prev, newWebhook])
      showToast.success(`Webhook "${formData.name}" created`)
    }
    closeFormModal()
  }

  const stats = useMemo(() => {
    const allItems = [...apiKeys, ...webhooks]
    const totalUsage = apiKeys.reduce((sum, k) => sum + (k.usage || 0), 0)
    const totalTriggers = webhooks.reduce((sum, w) => sum + (w.triggers || 0), 0)
    const highPriority = allItems.filter((i) => i.priority === 'High').length
    const aiConfidence = allItems.length
      ? Math.round(allItems.reduce((sum, i) => sum + (i.aiConfidence || 0), 0) / allItems.length)
      : 0
    return {
      totalApiKeys: apiKeys.length,
      totalWebhooks: webhooks.length,
      activeApiKeys: apiKeys.filter((k) => k.status === 'Active').length,
      activeWebhooks: webhooks.filter((w) => w.status === 'Active').length,
      aiConfidence,
      totalUsage,
      totalTriggers,
      highPriority
    }
  }, [apiKeys, webhooks])

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Pending': 'warning',
      'Expired': 'danger'
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

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalApiKeys ?? 0) + (stats.totalWebhooks ?? 0) > 0) {
      items.push({
        title: `${stats.totalApiKeys} API keys · ${stats.totalWebhooks} webhooks`,
        detail: `${stats.totalUsage} key calls · ${stats.totalTriggers} webhook deliveries · ${stats.highPriority} high-priority integration(s).`,
        tone: 'info'
      })
    }
    if ((stats.highPriority ?? 0) > 0) {
      items.push({
        title: 'High-priority integrations',
        detail: 'Rotate credentials and verify TLS endpoints ahead of bid-day traffic.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Integration perimeter',
        detail: 'Register keys and webhooks to activate monitoring.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="apikeys-webhooks-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'API Keys & Webhooks', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="API & webhook command center"
        description="Manage API keys and webhook configurations with AI-powered security monitoring."
        heroMeta="Credentials & callbacks"
        outlookTitle="Integration outlook"
        outlookDescription={`${stats.totalApiKeys ?? 0} keys · ${stats.totalWebhooks ?? 0} hooks · ${stats.totalUsage ?? 0} API calls · ${stats.totalTriggers ?? 0} deliveries.`}
        outlookChips={[
          `${stats.totalApiKeys ?? 0} keys`,
          `${stats.totalWebhooks ?? 0} webhooks`,
          `${stats.totalUsage ?? 0} API use`,
          `${stats.aiConfidence ?? 0}% AI`
        ]}
        insights={insightItems}
        kpiTitle="Platform signal board"
        kpiMeta="Identity, callbacks, utilization"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="API keys"
                value={stats.totalApiKeys ?? 0}
                hint="Issued credentials"
                tone="intel"
                trend="Access"
                icon={<Key size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Webhooks"
                value={stats.totalWebhooks ?? 0}
                hint="Outbound callbacks"
                tone="intel"
                trend="Events"
                icon={<Webhook size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="API usage"
                value={stats.totalUsage ?? 0}
                hint="Recorded calls"
                tone="intel"
                trend="Traffic"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="SecOps signals"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle={activeTab === 'apikeys' ? 'API keys' : 'Webhooks'}
        tableActions={
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateItem}>
              <Plus size={16} className="me-2" />
              New {activeTab === 'apikeys' ? 'API Key' : 'Webhook'}
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/admin-config/security-settings')}>
              <Settings size={16} className="me-2" />
              Security Settings
            </Button>
          </>
        }
      >
        <Row className="mb-3">
          <Col>
            <div className="tab-navigation">
              <Button
                variant={activeTab === 'apikeys' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('apikeys')}
                className="me-2"
              >
                <Key size={16} className="me-2" />
                API Keys ({stats.totalApiKeys})
              </Button>
              <Button
                variant={activeTab === 'webhooks' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('webhooks')}
              >
                <Webhook size={16} className="me-2" />
                Webhooks ({stats.totalWebhooks})
              </Button>
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder={`Search ${activeTab}...`}
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
                {activeTab === 'apikeys' ? (
                  <>
                    <th>API Key Details</th>
                    <th>Key</th>
                    <th>Status</th>
                    <th>Usage</th>
                    <th>Last Used</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </>
                ) : (
                  <>
                    <th>Webhook Details</th>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Triggers</th>
                    <th>Last Triggered</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'apikeys' ? apiKeys : webhooks).filter(item =>
                !searchTerm ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="item-info">
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="text-muted mb-1">{item.description}</p>
                        {activeTab === 'apikeys' ? (
                          <small className="text-muted">
                            Permissions: {item.permissions.join(', ')} • Expires: {item.expiryDate}
                          </small>
                        ) : (
                          <small className="text-muted">
                            Events: {item.events.length} • Retry Count: {item.retryCount}
                          </small>
                        )}
                      </div>
                    </td>
                    {activeTab === 'apikeys' ? (
                      <>
                        <td>
                          <div className="key-info">
                            <div className="d-flex align-items-center">
                              <code className="me-2">{item.key}</code>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleCopyKey(item.key)}
                              >
                                <Copy size={14} />
                              </Button>
                            </div>
                          </div>
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td>
                          <div className="usage-info">
                            <div className="fw-medium">{item.usage}</div>
                            <small className="text-muted">AI Confidence: {item.aiConfidence}%</small>
                          </div>
                        </td>
                        <td>
                          <div className="last-used">
                            <div className="fw-medium">{item.lastUsed}</div>
                          </div>
                        </td>
                        <td>{getPriorityBadge(item.priority)}</td>
                      </>
                    ) : (
                      <>
                        <td>
                          <div className="url-info">
                            <code className="text-break">{item.url}</code>
                          </div>
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td>
                          <div className="triggers-info">
                            <div className="fw-medium">{item.triggers}</div>
                            <small className="text-muted">AI Confidence: {item.aiConfidence}%</small>
                          </div>
                        </td>
                        <td>
                          <div className="last-triggered">
                            <div className="fw-medium">{item.lastTriggered}</div>
                          </div>
                        </td>
                        <td>{getPriorityBadge(item.priority)}</td>
                      </>
                    )}
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <Trash2 size={14} />
                        </Button>
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
            {activeTab === 'apikeys' ? <Key size={20} className="me-2" /> : <Webhook size={20} className="me-2" />}
            {activeTab === 'apikeys' ? 'API Key' : 'Webhook'} Details - {selectedItem?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div className="item-details">
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p><strong>Name:</strong> {selectedItem.name}</p>
                  <p><strong>Status:</strong> {selectedItem.status}</p>
                  <p><strong>Priority:</strong> {selectedItem.priority}</p>
                  {activeTab === 'apikeys' ? (
                    <>
                      <p><strong>Expiry Date:</strong> {selectedItem.expiryDate}</p>
                      <p><strong>Permissions:</strong> {selectedItem.permissions.join(', ')}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Retry Count:</strong> {selectedItem.retryCount}</p>
                      <p><strong>Events:</strong> {selectedItem.events.length}</p>
                    </>
                  )}
                </Col>
                <Col md={6}>
                  <h6>Usage & Performance</h6>
                  {activeTab === 'apikeys' ? (
                    <>
                      <p><strong>Usage:</strong> {selectedItem.usage}</p>
                      <p><strong>Last Used:</strong> {selectedItem.lastUsed}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Triggers:</strong> {selectedItem.triggers}</p>
                      <p><strong>Last Triggered:</strong> {selectedItem.lastTriggered}</p>
                    </>
                  )}
                  <p><strong>AI Confidence:</strong> {selectedItem.aiConfidence}%</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Description</h6>
                  <p>{selectedItem.description}</p>
                </Col>
              </Row>
              <hr />
              {activeTab === 'apikeys' ? (
                <Row>
                  <Col>
                    <h6>API Key</h6>
                    <div className="api-key-display">
                      <code className="bg-light p-2 rounded d-block">{selectedItem.key}</code>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleCopyKey(selectedItem.key)}
                      >
                        <Copy size={16} className="me-2" />
                        Copy Key
                      </Button>
                    </div>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col>
                    <h6>Webhook URL</h6>
                    <div className="webhook-url-display">
                      <code className="bg-light p-2 rounded d-block text-break">{selectedItem.url}</code>
                    </div>
                  </Col>
                </Row>
              )}
              <hr />
              <Row>
                <Col>
                  <h6>AI Assessment & Optimization</h6>
                  <Alert variant="info">
                    <Brain size={16} className="me-2" />
                    <strong>Optimization:</strong> {selectedItem.aiOptimization}
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle size={16} className="me-2" />
                    <strong>Confidence Level:</strong> {selectedItem.aiConfidence}% based on usage patterns and security analysis
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
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false)
              handleEditItem(selectedItem)
            }}
          >
            <Edit size={16} className="me-2" />
            Edit {activeTab === 'apikeys' ? 'API Key' : 'Webhook'}
          </Button>
        </Modal.Footer>
      </Modal>

      <AdminWorkspaceModal
        show={showFormModal}
        onHide={closeFormModal}
        title={
          editingItem
            ? `Edit ${activeTab === 'apikeys' ? 'API Key' : 'Webhook'}`
            : activeTab === 'apikeys'
              ? 'New API Key'
              : 'New Webhook'
        }
        description={
          activeTab === 'apikeys'
            ? editingItem
              ? 'Update API credential metadata.'
              : 'Issue a new API credential for platform integrations.'
            : editingItem
              ? 'Update webhook endpoint configuration.'
              : 'Register an outbound webhook endpoint.'
        }
        submitLabel={
          editingItem
            ? 'Save changes'
            : activeTab === 'apikeys'
              ? 'Create API Key'
              : 'Create Webhook'
        }
        fields={activeTab === 'apikeys' ? API_KEY_FORM_FIELDS : WEBHOOK_FORM_FIELDS}
        initialValues={
          editingItem
            ? activeTab === 'apikeys'
              ? { name: editingItem.name, description: editingItem.description }
              : { name: editingItem.name, url: editingItem.url, description: editingItem.description }
            : {}
        }
        onSubmit={handleFormSubmit}
      />
    </>
  )
}

export default APIKeysWebhooks
