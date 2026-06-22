import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import { Search, Plus, Edit, Trash2, Eye, Package, Globe, Brain, CheckCircle, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import AdminWorkspaceModal from '../../components/admin/AdminWorkspaceModal'
import { showToast } from '../../utils/toast'
import './UnitsIncoterms.scss'

const UNIT_FORM_FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'symbol', label: 'Symbol', required: true },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    required: true,
    options: [
      { value: 'Length', label: 'Length' },
      { value: 'Weight', label: 'Weight' },
      { value: 'Volume', label: 'Volume' }
    ]
  }
]

const INCOTERM_FORM_FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'code', label: 'Code', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true }
]

const UnitsIncoterms = () => {
  const navigate = useNavigate()
  const [units, setUnits] = useState([])
  const [incoterms, setIncoterms] = useState([])
  const [activeTab, setActiveTab] = useState('units')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    setUnits([
      {
        id: 1,
        name: 'Meter',
        symbol: 'm',
        type: 'Length',
        status: 'Active',
        conversionFactor: 1,
        baseUnit: 'Meter',
        aiOptimization: 'Standard length unit for construction projects',
        aiConfidence: 95,
        priority: 'High',
        usage: 1250
      },
      {
        id: 2,
        name: 'Kilogram',
        symbol: 'kg',
        type: 'Weight',
        status: 'Active',
        conversionFactor: 1,
        baseUnit: 'Kilogram',
        aiOptimization: 'Primary weight unit for material calculations',
        aiConfidence: 98,
        priority: 'High',
        usage: 890
      },
      {
        id: 3,
        name: 'Cubic Meter',
        symbol: 'm³',
        type: 'Volume',
        status: 'Active',
        conversionFactor: 1,
        baseUnit: 'Cubic Meter',
        aiOptimization: 'Volume unit for concrete and material calculations',
        aiConfidence: 92,
        priority: 'Medium',
        usage: 456
      }
    ])

    setIncoterms([
      {
        id: 1,
        name: 'EXW - Ex Works',
        code: 'EXW',
        description: 'Seller makes goods available at their premises',
        status: 'Active',
        riskTransfer: 'Buyer',
        aiOptimization: 'Lowest cost option for domestic transactions',
        aiConfidence: 88,
        priority: 'Medium',
        usage: 234
      },
      {
        id: 2,
        name: 'FOB - Free on Board',
        code: 'FOB',
        description: 'Seller delivers goods on board the vessel',
        status: 'Active',
        riskTransfer: 'Buyer',
        aiOptimization: 'Common for international shipping',
        aiConfidence: 94,
        priority: 'High',
        usage: 567
      },
      {
        id: 3,
        name: 'CIF - Cost, Insurance, Freight',
        code: 'CIF',
        description: 'Seller pays costs, insurance, and freight',
        status: 'Active',
        riskTransfer: 'Buyer',
        aiOptimization: 'Comprehensive shipping solution',
        aiConfidence: 91,
        priority: 'High',
        usage: 345
      }
    ])
  }, [])

  const handleViewItem = (item) => {
    setSelectedItem(item)
    setShowModal(true)
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
    if (activeTab === 'units') {
      setUnits((prev) => prev.filter((entry) => entry.id !== item.id))
    } else {
      setIncoterms((prev) => prev.filter((entry) => entry.id !== item.id))
    }
    showToast.success(`"${item.name}" deleted`)
  }

  const closeFormModal = () => {
    setShowFormModal(false)
    setEditingItem(null)
  }

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      if (activeTab === 'units') {
        setUnits((prev) =>
          prev.map((entry) =>
            entry.id === editingItem.id
              ? { ...entry, name: formData.name, symbol: formData.symbol, type: formData.type }
              : entry
          )
        )
      } else {
        setIncoterms((prev) =>
          prev.map((entry) =>
            entry.id === editingItem.id
              ? { ...entry, name: formData.name, code: formData.code, description: formData.description }
              : entry
          )
        )
      }
      showToast.success(`"${formData.name}" updated`)
      closeFormModal()
      return
    }

    if (activeTab === 'units') {
      const newUnit = {
        id: Date.now(),
        name: formData.name,
        symbol: formData.symbol,
        type: formData.type,
        description: '',
        status: 'Active',
        conversionFactor: 1,
        baseUnit: formData.name,
        aiOptimization: 'New unit configuration',
        aiConfidence: 85,
        priority: 'Medium',
        usage: 0
      }
      setUnits((prev) => [...prev, newUnit])
      showToast.success(`Unit "${formData.name}" created`)
    } else {
      const newIncoterm = {
        id: Date.now(),
        name: formData.name,
        code: formData.code,
        description: formData.description,
        status: 'Active',
        riskTransfer: 'Buyer',
        aiOptimization: 'New incoterm configuration',
        aiConfidence: 85,
        priority: 'Medium',
        usage: 0
      }
      setIncoterms((prev) => [...prev, newIncoterm])
      showToast.success(`Incoterm "${formData.name}" created`)
    }
    closeFormModal()
  }

  const stats = useMemo(() => {
    const allItems = [...units, ...incoterms]
    const totalUsage = allItems.reduce((sum, i) => sum + (i.usage || 0), 0)
    const highPriority = allItems.filter((i) => i.priority === 'High').length
    const aiConfidence = allItems.length
      ? Math.round(allItems.reduce((sum, i) => sum + (i.aiConfidence || 0), 0) / allItems.length)
      : 0
    return {
      totalUnits: units.length,
      totalIncoterms: incoterms.length,
      activeUnits: units.filter((u) => u.status === 'Active').length,
      activeIncoterms: incoterms.filter((i) => i.status === 'Active').length,
      aiConfidence,
      totalUsage,
      highPriority
    }
  }, [units, incoterms])

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Pending': 'warning',
      'Deprecated': 'danger'
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

  const getTypeIcon = (type) => {
    const icons = {
      'Length': Package,
      'Weight': Package,
      'Volume': Package,
      'Area': Package,
      'Temperature': Settings
    }
    return icons[type] || Package
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalUnits ?? 0) + (stats.totalIncoterms ?? 0) > 0) {
      items.push({
        title: `${stats.totalUnits} units · ${stats.totalIncoterms} incoterms`,
        detail: `${stats.totalUsage} combined references · ${stats.highPriority} high-priority rows · ${stats.aiConfidence}% model confidence.`,
        tone: 'info'
      })
    }
    if ((stats.highPriority ?? 0) > 0) {
      items.push({
        title: 'High-priority master rows',
        detail: 'Align conversions and shipping terms before international bid cycles.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Commercial masters',
        detail: 'Seed units and incoterms to unlock optimization hints.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="units-incoterms-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'Units & Incoterms', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="Units & incoterms command center"
        description="Manage measurement units and international trade terms with AI optimization."
        heroMeta="Commercial reference data"
        outlookTitle="Trade & measurement outlook"
        outlookDescription={`${stats.totalUnits ?? 0} units · ${stats.totalIncoterms ?? 0} incoterms · ${stats.totalUsage ?? 0} usage references.`}
        outlookChips={[
          `${stats.totalUnits ?? 0} units`,
          `${stats.totalIncoterms ?? 0} incoterms`,
          `${stats.totalUsage ?? 0} usage`,
          `${stats.aiConfidence ?? 0}% AI`
        ]}
        insights={insightItems}
        kpiTitle="Reference signal board"
        kpiMeta="Coverage, adoption, confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Units"
                value={stats.totalUnits ?? 0}
                hint="Measurement catalog"
                tone="intel"
                trend="UoM"
                icon={<Package size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Incoterms"
                value={stats.totalIncoterms ?? 0}
                hint="Shipping terms"
                tone="intel"
                trend="Trade"
                icon={<Globe size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total usage"
                value={stats.totalUsage ?? 0}
                hint="Reference touches"
                tone="intel"
                trend="Adoption"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Optimization hints"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle={activeTab === 'units' ? 'Measurement units' : 'Incoterms'}
        tableActions={
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateItem}>
              <Plus size={16} className="me-2" />
              New {activeTab === 'units' ? 'Unit' : 'Incoterm'}
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/admin-config/masters')}>
              <Settings size={16} className="me-2" />
              Settings
            </Button>
          </>
        }
      >
        <Row className="mb-3">
          <Col>
            <div className="tab-navigation">
              <Button
                variant={activeTab === 'units' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('units')}
                className="me-2"
              >
                <Package size={16} className="me-2" />
                Units ({stats.totalUnits})
              </Button>
              <Button
                variant={activeTab === 'incoterms' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('incoterms')}
              >
                <Globe size={16} className="me-2" />
                Incoterms ({stats.totalIncoterms})
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
                {activeTab === 'units' ? (
                  <>
                    <th>Unit Details</th>
                    <th>Type</th>
                    <th>Symbol</th>
                    <th>Status</th>
                    <th>Usage</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </>
                ) : (
                  <>
                    <th>Incoterm Details</th>
                    <th>Code</th>
                    <th>Risk Transfer</th>
                    <th>Status</th>
                    <th>Usage</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'units' ? units : incoterms).filter(item =>
                !searchTerm ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
              ).map((item) => {
                const TypeIcon = getTypeIcon(item.type)
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="item-info">
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="text-muted mb-1">{item.description}</p>
                        {activeTab === 'units' ? (
                          <small className="text-muted">
                            Base Unit: {item.baseUnit} • Conversion: {item.conversionFactor}
                          </small>
                        ) : (
                          <small className="text-muted">
                            Risk Transfer: {item.riskTransfer}
                          </small>
                        )}
                      </div>
                    </td>
                    {activeTab === 'units' ? (
                      <>
                        <td>
                          <div className="type-info">
                            <div className="d-flex align-items-center">
                              <TypeIcon size={16} className="me-1" />
                              <span>{item.type}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="symbol-info">
                            <Badge bg="info">{item.symbol}</Badge>
                          </div>
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td>
                          <div className="usage-info">
                            <div className="fw-medium">{item.usage}</div>
                            <small className="text-muted">AI Confidence: {item.aiConfidence}%</small>
                          </div>
                        </td>
                        <td>{getPriorityBadge(item.priority)}</td>
                      </>
                    ) : (
                      <>
                        <td>
                          <div className="code-info">
                            <Badge bg="primary">{item.code}</Badge>
                          </div>
                        </td>
                        <td>
                          <div className="risk-info">
                            <div className="fw-medium">{item.riskTransfer}</div>
                          </div>
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td>
                          <div className="usage-info">
                            <div className="fw-medium">{item.usage}</div>
                            <small className="text-muted">AI Confidence: {item.aiConfidence}%</small>
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
                )
              })}
            </tbody>
          </Table>
        </div>
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {activeTab === 'units' ? <Package size={20} className="me-2" /> : <Globe size={20} className="me-2" />}
            {activeTab === 'units' ? 'Unit' : 'Incoterm'} Details - {selectedItem?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div className="item-details">
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p><strong>Name:</strong> {selectedItem.name}</p>
                  {activeTab === 'units' ? (
                    <>
                      <p><strong>Type:</strong> {selectedItem.type}</p>
                      <p><strong>Symbol:</strong> {selectedItem.symbol}</p>
                      <p><strong>Base Unit:</strong> {selectedItem.baseUnit}</p>
                      <p><strong>Conversion Factor:</strong> {selectedItem.conversionFactor}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Code:</strong> {selectedItem.code}</p>
                      <p><strong>Risk Transfer:</strong> {selectedItem.riskTransfer}</p>
                    </>
                  )}
                  <p><strong>Status:</strong> {selectedItem.status}</p>
                  <p><strong>Priority:</strong> {selectedItem.priority}</p>
                </Col>
                <Col md={6}>
                  <h6>Usage & Performance</h6>
                  <p><strong>Usage:</strong> {selectedItem.usage}</p>
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
              <Row>
                <Col>
                  <h6>AI Assessment & Optimization</h6>
                  <Alert variant="info">
                    <Brain size={16} className="me-2" />
                    <strong>Optimization:</strong> {selectedItem.aiOptimization}
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle size={16} className="me-2" />
                    <strong>Confidence Level:</strong> {selectedItem.aiConfidence}% based on usage patterns and industry standards
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
          <Button variant="primary" onClick={() => { setShowModal(false); handleEditItem(selectedItem) }}>
            <Edit size={16} className="me-2" />
            Edit {activeTab === 'units' ? 'Unit' : 'Incoterm'}
          </Button>
        </Modal.Footer>
      </Modal>

      <AdminWorkspaceModal
        show={showFormModal}
        onHide={closeFormModal}
        title={editingItem ? `Edit ${activeTab === 'units' ? 'Unit' : 'Incoterm'}` : activeTab === 'units' ? 'New Unit' : 'New Incoterm'}
        description={
          activeTab === 'units'
            ? editingItem ? 'Update measurement unit.' : 'Add a measurement unit to the catalog.'
            : editingItem ? 'Update incoterm definition.' : 'Add an international trade term.'
        }
        submitLabel={editingItem ? 'Save changes' : activeTab === 'units' ? 'Create Unit' : 'Create Incoterm'}
        fields={activeTab === 'units' ? UNIT_FORM_FIELDS : INCOTERM_FORM_FIELDS}
        initialValues={
          editingItem
            ? activeTab === 'units'
              ? { name: editingItem.name, symbol: editingItem.symbol, type: editingItem.type }
              : { name: editingItem.name, code: editingItem.code, description: editingItem.description }
            : {}
        }
        onSubmit={handleFormSubmit}
      />
    </>
  )
}

export default UnitsIncoterms
