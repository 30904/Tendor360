import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import { Search, Plus, Edit, Trash2, Eye, Building, Globe, Brain, CheckCircle, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import AdminWorkspaceModal from '../../components/admin/AdminWorkspaceModal'
import { showToast } from '../../utils/toast'
import { exportRowsToExcel } from '../../utils/exportReport'
import './IssuerMaster.scss'

const ISSUER_FORM_FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'code', label: 'Code', required: true },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    required: true,
    options: [
      { value: 'Government', label: 'Government' },
      { value: 'Private', label: 'Private' },
      { value: 'NGO', label: 'NGO' }
    ]
  },
  { name: 'country', label: 'Country', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true }
]

const IssuerMaster = () => {
  const navigate = useNavigate()
  const [issuers, setIssuers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedIssuer, setSelectedIssuer] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    setIssuers([
      {
        id: 1,
        name: 'Ministry of Transport',
        code: 'MOT-001',
        type: 'Government',
        status: 'Active',
        country: 'United States',
        region: 'North America',
        contactPerson: 'John Smith',
        email: 'john.smith@transport.gov',
        phone: '+1-555-0123',
        address: '123 Transportation Ave, Washington DC',
        aiAssessment: 'High-value government client with consistent tendering',
        aiConfidence: 92,
        priority: 'High',
        totalTenders: 45,
        avgTenderValue: 25000000,
        lastTender: '2024-02-08'
      },
      {
        id: 2,
        name: 'Health Ministry',
        code: 'HM-002',
        type: 'Government',
        status: 'Active',
        country: 'United States',
        region: 'North America',
        contactPerson: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@health.gov',
        phone: '+1-555-0456',
        address: '456 Health Street, Washington DC',
        aiAssessment: 'Growing healthcare sector with increasing digital requirements',
        aiConfidence: 88,
        priority: 'Medium',
        totalTenders: 32,
        avgTenderValue: 18000000,
        lastTender: '2024-02-05'
      },
      {
        id: 3,
        name: 'Digital Transformation Authority',
        code: 'DTA-003',
        type: 'Government',
        status: 'Active',
        country: 'United States',
        region: 'North America',
        contactPerson: 'Michael Brown',
        email: 'michael.brown@digital.gov',
        phone: '+1-555-0789',
        address: '789 Digital Boulevard, Washington DC',
        aiAssessment: 'Technology-focused agency with innovative procurement',
        aiConfidence: 85,
        priority: 'Medium',
        totalTenders: 28,
        avgTenderValue: 15000000,
        lastTender: '2024-02-03'
      }
    ])
  }, [])

  const handleViewIssuer = (issuer) => {
    setSelectedIssuer(issuer)
    setShowModal(true)
  }

  const handleCreateIssuer = () => {
    setEditingItem(null)
    setShowFormModal(true)
  }

  const handleEditIssuer = (issuer) => {
    setEditingItem(issuer)
    setShowFormModal(true)
  }

  const handleDeleteIssuer = (issuer) => {
    if (!window.confirm(`Delete issuer "${issuer.name}"?`)) return
    setIssuers((prev) => prev.filter((entry) => entry.id !== issuer.id))
    showToast.success(`"${issuer.name}" deleted`)
  }

  const handleExportReport = () => {
    exportRowsToExcel(
      issuers.map(({ id, name, code, type, status, country, email, totalTenders, avgTenderValue }) => ({
        id, name, code, type, status, country, email, totalTenders, avgTenderValue
      })),
      { sheetName: 'Issuers', fileName: 'issuer_master_report.xlsx' }
    )
  }

  const closeFormModal = () => {
    setShowFormModal(false)
    setEditingItem(null)
  }

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      setIssuers((prev) =>
        prev.map((entry) =>
          entry.id === editingItem.id
            ? {
                ...entry,
                name: formData.name,
                code: formData.code,
                type: formData.type,
                country: formData.country,
                region: formData.country,
                email: formData.email
              }
            : entry
        )
      )
      showToast.success(`Issuer "${formData.name}" updated`)
      closeFormModal()
      return
    }

    const newIssuer = {
      id: Date.now(),
      name: formData.name,
      code: formData.code,
      type: formData.type,
      status: 'Active',
      country: formData.country,
      region: formData.country,
      contactPerson: formData.name,
      email: formData.email,
      phone: '',
      address: '',
      aiAssessment: 'New issuer — assessment pending',
      aiConfidence: 75,
      priority: 'Medium',
      totalTenders: 0,
      avgTenderValue: 0,
      lastTender: '—'
    }
    setIssuers((prev) => [...prev, newIssuer])
    closeFormModal()
    showToast.success(`Issuer "${formData.name}" created`)
  }

  const stats = useMemo(() => {
    const active = issuers.filter((i) => i.status === 'Active').length
    const countries = new Set(issuers.map((i) => i.country)).size
    const types = new Set(issuers.map((i) => i.type)).size
    const totalTenders = issuers.reduce((sum, i) => sum + (i.totalTenders || 0), 0)
    const avgTenderValue = issuers.length
      ? issuers.reduce((sum, i) => sum + (i.avgTenderValue || 0), 0) / issuers.length
      : 0
    const aiConfidence = issuers.length
      ? Math.round(issuers.reduce((sum, i) => sum + (i.aiConfidence || 0), 0) / issuers.length)
      : 0
    return {
      totalIssuers: issuers.length,
      active,
      types,
      aiConfidence,
      totalTenders,
      avgTenderValue,
      countries
    }
  }, [issuers])

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Pending': 'warning',
      'Suspended': 'danger'
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
      'Government': Building,
      'Private': Globe,
      'NGO': MapPin
    }
    return icons[type] || Building
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalIssuers ?? 0) > 0) {
      items.push({
        title: `${stats.totalIssuers} issuers · ${stats.totalTenders} tenders`,
        detail: `Avg award ${formatCurrency(stats.avgTenderValue ?? 0)} · ${stats.countries} market(s) · ${stats.aiConfidence}% AI confidence.`,
        tone: 'info'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Issuer registry',
        detail: 'Add issuers to unlock relationship intelligence.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="issuer-master-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'Issuer Master', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="Issuer intelligence command center"
        description="Manage tender issuers and organizations with AI-powered relationship insights."
        heroMeta="Buy-side coverage"
        outlookTitle="Issuer portfolio outlook"
        outlookDescription={`${stats.totalIssuers ?? 0} issuers · ${stats.totalTenders ?? 0} tenders · ${stats.countries ?? 0} countries · avg ${formatCurrency(stats.avgTenderValue ?? 0)}.`}
        outlookChips={[
          `${stats.totalIssuers ?? 0} issuers`,
          `${stats.totalTenders ?? 0} tenders`,
          `${stats.countries ?? 0} countries`,
          `${stats.aiConfidence ?? 0}% AI`
        ]}
        insights={insightItems}
        kpiTitle="Market signal board"
        kpiMeta="Depth, spend, confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total issuers"
                value={stats.totalIssuers ?? 0}
                hint="Active directory"
                tone="intel"
                trend="Coverage"
                icon={<Building size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total tenders"
                value={stats.totalTenders ?? 0}
                hint="Tracked competitions"
                tone="intel"
                trend="Pipeline"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Countries"
                value={stats.countries ?? 0}
                hint="Geographic span"
                tone="intel"
                trend="Markets"
                icon={<Globe size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Relationship scoring"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Issuer master data"
        tableActions={
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateIssuer}>
              <Plus size={16} className="me-2" />
              New Issuer
            </Button>
            <Button variant="outline-secondary" onClick={handleExportReport}>
              <Building size={16} className="me-2" />
              Export Report
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
                placeholder="Search issuers..."
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
                <th>Issuer Details</th>
                <th>Type</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issuers.filter(issuer =>
                !searchTerm ||
                issuer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issuer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issuer.country.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((issuer) => {
                const TypeIcon = getTypeIcon(issuer.type)
                return (
                  <tr key={issuer.id}>
                    <td>
                      <div className="issuer-info">
                        <h6 className="mb-1">{issuer.name}</h6>
                        <p className="text-muted mb-1">Code: {issuer.code}</p>
                        <small className="text-muted">
                          Tenders: {issuer.totalTenders} • Avg Value: {formatCurrency(issuer.avgTenderValue)} • Last: {issuer.lastTender}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="type-info">
                        <div className="d-flex align-items-center">
                          <TypeIcon size={16} className="me-1" />
                          <span>{issuer.type}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="location-info">
                        <div className="fw-medium">{issuer.country}</div>
                        <small className="text-muted">{issuer.region}</small>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="fw-medium">{issuer.contactPerson}</div>
                        <small className="text-muted">{issuer.email}</small>
                      </div>
                    </td>
                    <td>{getStatusBadge(issuer.status)}</td>
                    <td>{getPriorityBadge(issuer.priority)}</td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleViewIssuer(issuer)}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button variant="outline-warning" size="sm" className="me-1" onClick={() => handleEditIssuer(issuer)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteIssuer(issuer)}>
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
            <Building size={20} className="me-2" />
            Issuer Details - {selectedIssuer?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIssuer && (
            <div className="issuer-details">
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p><strong>Name:</strong> {selectedIssuer.name}</p>
                  <p><strong>Code:</strong> {selectedIssuer.code}</p>
                  <p><strong>Type:</strong> {selectedIssuer.type}</p>
                  <p><strong>Status:</strong> {selectedIssuer.status}</p>
                  <p><strong>Priority:</strong> {selectedIssuer.priority}</p>
                </Col>
                <Col md={6}>
                  <h6>Location Information</h6>
                  <p><strong>Country:</strong> {selectedIssuer.country}</p>
                  <p><strong>Region:</strong> {selectedIssuer.region}</p>
                  <p><strong>Address:</strong> {selectedIssuer.address}</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <h6>Contact Information</h6>
                  <p><strong>Contact Person:</strong> {selectedIssuer.contactPerson}</p>
                  <p><strong>Email:</strong> {selectedIssuer.email}</p>
                  <p><strong>Phone:</strong> {selectedIssuer.phone}</p>
                </Col>
                <Col md={6}>
                  <h6>Tender Statistics</h6>
                  <p><strong>Total Tenders:</strong> {selectedIssuer.totalTenders}</p>
                  <p><strong>Average Value:</strong> {formatCurrency(selectedIssuer.avgTenderValue)}</p>
                  <p><strong>Last Tender:</strong> {selectedIssuer.lastTender}</p>
                  <p><strong>AI Confidence:</strong> {selectedIssuer.aiConfidence}%</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>AI Assessment & Insights</h6>
                  <Alert variant="info">
                    <Brain size={16} className="me-2" />
                    <strong>Assessment:</strong> {selectedIssuer.aiAssessment}
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle size={16} className="me-2" />
                    <strong>Confidence Level:</strong> {selectedIssuer.aiConfidence}% based on historical tender analysis and relationship assessment
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
          <Button variant="primary" onClick={() => { setShowModal(false); handleEditIssuer(selectedIssuer) }}>
            <Edit size={16} className="me-2" />
            Edit Issuer
          </Button>
        </Modal.Footer>
      </Modal>

      <AdminWorkspaceModal
        show={showFormModal}
        onHide={closeFormModal}
        title={editingItem ? `Edit Issuer — ${editingItem.name}` : 'New Issuer'}
        description={editingItem ? 'Update issuer master record.' : 'Add a tender issuer to the master directory.'}
        submitLabel={editingItem ? 'Save changes' : 'Create Issuer'}
        fields={ISSUER_FORM_FIELDS}
        initialValues={
          editingItem
            ? {
                name: editingItem.name,
                code: editingItem.code,
                type: editingItem.type,
                country: editingItem.country,
                email: editingItem.email
              }
            : {}
        }
        onSubmit={handleFormSubmit}
      />
    </>
  )
}

export default IssuerMaster
