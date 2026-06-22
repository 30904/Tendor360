import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import { Search, Plus, Edit, Trash2, Eye, Link, Globe, Brain, CheckCircle, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import AdminWorkspaceModal from '../../components/admin/AdminWorkspaceModal'
import { showToast } from '../../utils/toast'
import './EProcurementAdapters.scss'

const ADAPTER_FORM_FIELDS = [
  { name: 'name', label: 'Name', required: true },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    required: true,
    options: [
      { value: 'ERP Integration', label: 'ERP Integration' },
      { value: 'Cloud Integration', label: 'Cloud Integration' },
      { value: 'SaaS Integration', label: 'SaaS Integration' }
    ]
  },
  { name: 'description', label: 'Description', type: 'textarea', required: true }
]

const EProcurementAdapters = () => {
  const navigate = useNavigate()
  const [adapters, setAdapters] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedAdapter, setSelectedAdapter] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    setAdapters([
      {
        id: 1,
        name: 'SAP Ariba Adapter',
        description: 'Integration with SAP Ariba procurement platform',
        type: 'ERP Integration',
        status: 'Active',
        lastSync: '2024-02-10 14:30',
        frequency: 'Real-time',
        aiOptimization: 'Optimized for SAP Ariba data synchronization',
        aiConfidence: 94,
        priority: 'High',
        endpoints: 12,
        dataVolume: '2.5 GB',
        successRate: 98.5
      },
      {
        id: 2,
        name: 'Oracle Procurement Cloud',
        description: 'Oracle Cloud procurement system integration',
        type: 'Cloud Integration',
        status: 'Active',
        lastSync: '2024-02-10 12:15',
        frequency: 'Hourly',
        aiOptimization: 'Enhanced Oracle Cloud data mapping',
        aiConfidence: 91,
        priority: 'Medium',
        endpoints: 8,
        dataVolume: '1.8 GB',
        successRate: 96.2
      },
      {
        id: 3,
        name: 'Coupa Procurement',
        description: 'Coupa spend management platform adapter',
        type: 'SaaS Integration',
        status: 'Inactive',
        lastSync: '2024-02-08 09:45',
        frequency: 'Daily',
        aiOptimization: 'Coupa API optimization for better performance',
        aiConfidence: 87,
        priority: 'Low',
        endpoints: 6,
        dataVolume: '1.2 GB',
        successRate: 94.8
      }
    ])
  }, [])

  const handleViewAdapter = (adapter) => {
    setSelectedAdapter(adapter)
    setShowModal(true)
  }

  const handleToggleAdapter = (adapter) => {
    const newStatus = adapter.status === 'Active' ? 'Inactive' : 'Active'
    if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} "${adapter.name}"?`)) {
      setAdapters(prev => prev.map(a =>
        a.id === adapter.id ? { ...a, status: newStatus } : a
      ))
    }
  }

  const handleCreateAdapter = () => {
    setEditingItem(null)
    setShowFormModal(true)
  }

  const handleEditAdapter = (adapter) => {
    setEditingItem(adapter)
    setShowFormModal(true)
  }

  const handleDeleteAdapter = (adapter) => {
    if (!window.confirm(`Delete adapter "${adapter.name}"?`)) return
    setAdapters((prev) => prev.filter((entry) => entry.id !== adapter.id))
    showToast.success(`"${adapter.name}" deleted`)
  }

  const handleSystemStatus = () => {
    showToast.info(
      `${stats.totalAdapters} adapters · ${stats.active} active · ${stats.avgSuccessRate}% success · ${stats.totalDataVolume}`
    )
  }

  const closeFormModal = () => {
    setShowFormModal(false)
    setEditingItem(null)
  }

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      setAdapters((prev) =>
        prev.map((entry) =>
          entry.id === editingItem.id
            ? { ...entry, name: formData.name, type: formData.type, description: formData.description }
            : entry
        )
      )
      showToast.success(`Adapter "${formData.name}" updated`)
      closeFormModal()
      return
    }

    const newAdapter = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      type: formData.type,
      status: 'Active',
      lastSync: 'Never',
      frequency: 'Daily',
      aiOptimization: 'New adapter configuration',
      aiConfidence: 85,
      priority: 'Medium',
      endpoints: 0,
      dataVolume: '0 GB',
      successRate: 0
    }
    setAdapters((prev) => [...prev, newAdapter])
    closeFormModal()
    showToast.success(`Adapter "${formData.name}" created`)
  }

  const stats = useMemo(() => {
    const active = adapters.filter((a) => a.status === 'Active').length
    const inactive = adapters.filter((a) => a.status === 'Inactive').length
    const types = new Set(adapters.map((a) => a.type)).size
    const totalEndpoints = adapters.reduce((sum, a) => sum + (a.endpoints || 0), 0)
    const avgSuccessRate = adapters.length
      ? Math.round((adapters.reduce((sum, a) => sum + (a.successRate || 0), 0) / adapters.length) * 10) / 10
      : 0
    const aiConfidence = adapters.length
      ? Math.round(adapters.reduce((sum, a) => sum + (a.aiConfidence || 0), 0) / adapters.length)
      : 0
    const totalGb = adapters.reduce((sum, a) => {
      const match = (a.dataVolume || '0').match(/[\d.]+/)
      return sum + (match ? parseFloat(match[0]) : 0)
    }, 0)
    return {
      totalAdapters: adapters.length,
      active,
      inactive,
      types,
      aiConfidence,
      totalEndpoints,
      avgSuccessRate,
      totalDataVolume: `${totalGb.toFixed(1)} GB`
    }
  }, [adapters])

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Pending': 'warning',
      'Error': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      'ERP Integration': Link,
      'Cloud Integration': Globe,
      'SaaS Integration': Settings
    }
    return icons[type] || Link
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalAdapters ?? 0) > 0) {
      items.push({
        title: `${stats.totalAdapters} adapters · ${stats.totalEndpoints} endpoints`,
        detail: `${stats.avgSuccessRate}% avg success · ${stats.totalDataVolume} data volume · ${stats.aiConfidence}% AI confidence.`,
        tone: 'info'
      })
    }
    if ((stats.inactive ?? 0) > 0) {
      items.push({
        title: `${stats.inactive} inactive adapter(s)`,
        detail: 'Reconnect or decommission dormant integrations to avoid drift.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'e-Procurement mesh',
        detail: 'Register adapters to unlock sync intelligence.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="eprocurement-adapters-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'e-Procurement Adapters', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="e-Procurement integration command center"
        description="Manage e-procurement system integrations and adapters with AI optimization."
        heroMeta="ERP, cloud, SaaS connectors"
        outlookTitle="Integration health outlook"
        outlookDescription={`${stats.totalAdapters ?? 0} adapters · ${stats.active ?? 0} active · ${stats.avgSuccessRate ?? 0}% success · ${stats.totalDataVolume ?? '—'}.`}
        outlookChips={[
          `${stats.totalAdapters ?? 0} adapters`,
          `${stats.totalEndpoints ?? 0} endpoints`,
          `${stats.avgSuccessRate ?? 0}% success`,
          `${stats.aiConfidence ?? 0}% AI`
        ]}
        insights={insightItems}
        kpiTitle="Adapter signal board"
        kpiMeta="Coverage, reliability, confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Adapters"
                value={stats.totalAdapters ?? 0}
                hint="Registered connectors"
                tone="intel"
                trend="Mesh"
                icon={<Link size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg success"
                value={stats.avgSuccessRate ?? 0}
                hint="Sync reliability"
                tone={
                  (stats.avgSuccessRate ?? 0) >= 95
                    ? 'success'
                    : (stats.avgSuccessRate ?? 0) >= 85
                      ? 'warning'
                      : 'danger'
                }
                trend="SLA"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Endpoints"
                value={stats.totalEndpoints ?? 0}
                hint="Mapped routes"
                tone="intel"
                trend="Surface"
                icon={<Globe size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Tuning quality"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="e-Procurement adapters"
        tableActions={
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateAdapter}>
              <Plus size={16} className="me-2" />
              New Adapter
            </Button>
            <Button variant="outline-secondary" onClick={handleSystemStatus}>
              <Link size={16} className="me-2" />
              System Status
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
                placeholder="Search adapters..."
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
                <th>Adapter Details</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th>Endpoints</th>
                <th>Success Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adapters.filter(adapter =>
                !searchTerm ||
                adapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                adapter.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                adapter.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((adapter) => {
                const TypeIcon = getTypeIcon(adapter.type)
                return (
                  <tr key={adapter.id}>
                    <td>
                      <div className="adapter-info">
                        <h6 className="mb-1">{adapter.name}</h6>
                        <p className="text-muted mb-1">{adapter.description}</p>
                        <small className="text-muted">
                          Frequency: {adapter.frequency} • Data Volume: {adapter.dataVolume} • AI Confidence: {adapter.aiConfidence}%
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="type-info">
                        <div className="d-flex align-items-center">
                          <TypeIcon size={16} className="me-1" />
                          <span>{adapter.type}</span>
                        </div>
                      </div>
                    </td>
                    <td>{getStatusBadge(adapter.status)}</td>
                    <td>
                      <div className="last-sync">
                        <div className="fw-medium">{adapter.lastSync}</div>
                      </div>
                    </td>
                    <td>
                      <div className="endpoints-info">
                        <div className="fw-medium">{adapter.endpoints}</div>
                      </div>
                    </td>
                    <td>
                      <div className="success-rate">
                        <div className="fw-medium text-success">{adapter.successRate}%</div>
                        <small className="text-muted">Priority: {adapter.priority}</small>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleViewAdapter(adapter)}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant={adapter.status === 'Active' ? 'outline-warning' : 'outline-success'}
                          size="sm"
                          className="me-1"
                          onClick={() => handleToggleAdapter(adapter)}
                        >
                          <Settings size={14} />
                        </Button>
                        <Button variant="outline-warning" size="sm" className="me-1" onClick={() => handleEditAdapter(adapter)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteAdapter(adapter)}>
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
            <Link size={20} className="me-2" />
            Adapter Details - {selectedAdapter?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAdapter && (
            <div className="adapter-details">
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p><strong>Name:</strong> {selectedAdapter.name}</p>
                  <p><strong>Type:</strong> {selectedAdapter.type}</p>
                  <p><strong>Status:</strong> {selectedAdapter.status}</p>
                  <p><strong>Priority:</strong> {selectedAdapter.priority}</p>
                  <p><strong>Frequency:</strong> {selectedAdapter.frequency}</p>
                </Col>
                <Col md={6}>
                  <h6>Performance Metrics</h6>
                  <p><strong>Last Sync:</strong> {selectedAdapter.lastSync}</p>
                  <p><strong>Endpoints:</strong> {selectedAdapter.endpoints}</p>
                  <p><strong>Data Volume:</strong> {selectedAdapter.dataVolume}</p>
                  <p><strong>Success Rate:</strong> {selectedAdapter.successRate}%</p>
                  <p><strong>AI Confidence:</strong> {selectedAdapter.aiConfidence}%</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Description</h6>
                  <p>{selectedAdapter.description}</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>AI Assessment & Optimization</h6>
                  <Alert variant="info">
                    <Brain size={16} className="me-2" />
                    <strong>Optimization:</strong> {selectedAdapter.aiOptimization}
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle size={16} className="me-2" />
                    <strong>Confidence Level:</strong> {selectedAdapter.aiConfidence}% based on integration performance and data synchronization analysis
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
          <Button variant="primary" onClick={() => { setShowModal(false); handleEditAdapter(selectedAdapter) }}>
            <Edit size={16} className="me-2" />
            Edit Adapter
          </Button>
        </Modal.Footer>
      </Modal>

      <AdminWorkspaceModal
        show={showFormModal}
        onHide={closeFormModal}
        title={editingItem ? `Edit Adapter — ${editingItem.name}` : 'New e-Procurement Adapter'}
        description={editingItem ? 'Update adapter configuration.' : 'Register a connector for an external procurement system.'}
        submitLabel={editingItem ? 'Save changes' : 'Create Adapter'}
        fields={ADAPTER_FORM_FIELDS}
        initialValues={
          editingItem
            ? { name: editingItem.name, type: editingItem.type, description: editingItem.description }
            : {}
        }
        onSubmit={handleFormSubmit}
      />
    </>
  )
}

export default EProcurementAdapters
