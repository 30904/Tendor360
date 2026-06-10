import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import { Search, Plus, Edit, Trash2, Eye, Building, Globe, Brain, CheckCircle, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './IssuerMaster.scss'

const IssuerMaster = () => {
  const navigate = useNavigate()
  const [issuers, setIssuers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedIssuer, setSelectedIssuer] = useState(null)
  const [stats, setStats] = useState({})

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

    setStats({
      totalIssuers: 3,
      active: 3,
      types: 1,
      aiConfidence: 88,
      totalTenders: 105,
      avgTenderValue: 19333333,
      countries: 1
    })
  }, [])

  const handleViewIssuer = (issuer) => {
    setSelectedIssuer(issuer)
    setShowModal(true)
  }

  const handleCreateIssuer = () => {
    if (window.confirm('Are you sure you want to create a new issuer?')) {
      console.log('Creating new issuer...')
    }
  }

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
            <Button variant="outline-secondary">
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
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-1"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
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
          <Button variant="primary">
            <Edit size={16} className="me-2" />
            Edit Issuer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default IssuerMaster
