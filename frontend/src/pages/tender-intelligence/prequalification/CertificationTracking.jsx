import React, { useState, useMemo, useRef } from 'react'
import { Row, Col, Card, Table, Badge, Button, Form, Modal, ProgressBar, Alert, Tabs, Tab } from 'react-bootstrap'
import FormDrawerModal from '../../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../../components/intelligence/PremiumKpiCard'
import {
  Award,
  Calendar,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Brain,
  Building,
  Shield,
  Plus,
  Edit,
  Clock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './CertificationTracking.scss'
import { applyDomFormValues, dummyCertificationTrackingPrefill } from '../../../utils/testFormDummies'

const CertificationTracking = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCert, setSelectedCert] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)
  const certAddFormRef = useRef(null)

  const certificationData = [
    {
      id: 1,
      certificationName: 'ISO 9001:2015 Quality Management',
      issuer: 'International Organization for Standardization',
      certificateNumber: 'ISO-9001-2024-001',
      issueDate: '2024-01-15',
      expiryDate: '2027-01-15',
      status: 'Active',
      daysToExpiry: 1085,
      aiExpiryRisk: 'Low',
      aiRecommendation: 'Certification is valid for 3+ years, no immediate action required',
      category: 'Quality Management',
      renewalCost: '$2,500',
      renewalProcess: 'Annual audit required',
      assignedTo: 'Quality Team',
      lastAudit: '2024-01-10',
      nextAudit: '2025-01-10',
      complianceScore: 95
    },
    {
      id: 2,
      certificationName: 'ISO 14001:2015 Environmental Management',
      issuer: 'Environmental Standards Institute',
      certificateNumber: 'ISO-14001-2023-045',
      issueDate: '2023-06-20',
      expiryDate: '2026-06-20',
      status: 'Active',
      daysToExpiry: 880,
      aiExpiryRisk: 'Low',
      aiRecommendation: 'Continue current environmental practices',
      category: 'Environmental',
      renewalCost: '$3,200',
      renewalProcess: 'Biannual audit required',
      assignedTo: 'Environmental Team',
      lastAudit: '2023-12-15',
      nextAudit: '2024-06-15',
      complianceScore: 92
    },
    {
      id: 3,
      certificationName: 'OHSAS 18001:2007 Occupational Health & Safety',
      issuer: 'Safety Standards Authority',
      certificateNumber: 'OHSAS-18001-2022-089',
      issueDate: '2022-03-10',
      expiryDate: '2025-03-10',
      status: 'Expiring Soon',
      daysToExpiry: 45,
      aiExpiryRisk: 'High',
      aiRecommendation: 'Urgent renewal required - schedule audit immediately',
      category: 'Health & Safety',
      renewalCost: '$4,100',
      renewalProcess: 'Annual audit required',
      assignedTo: 'Safety Team',
      lastAudit: '2024-01-05',
      nextAudit: '2024-02-15',
      complianceScore: 88
    },
    {
      id: 4,
      certificationName: 'ISO 27001:2013 Information Security',
      issuer: 'Information Security Institute',
      certificateNumber: 'ISO-27001-2023-156',
      issueDate: '2023-09-15',
      expiryDate: '2026-09-15',
      status: 'Active',
      daysToExpiry: 950,
      aiExpiryRisk: 'Low',
      aiRecommendation: 'Maintain current security protocols',
      category: 'Information Security',
      renewalCost: '$5,800',
      renewalProcess: 'Annual audit required',
      assignedTo: 'IT Security Team',
      lastAudit: '2023-12-20',
      nextAudit: '2024-09-10',
      complianceScore: 97
    },
    {
      id: 5,
      certificationName: 'ISO 45001:2018 Occupational Health & Safety',
      issuer: 'Global Safety Standards',
      certificateNumber: 'ISO-45001-2021-234',
      issueDate: '2021-11-30',
      expiryDate: '2024-11-30',
      status: 'Expired',
      daysToExpiry: -15,
      aiExpiryRisk: 'Critical',
      aiRecommendation: 'Certification expired - immediate renewal required',
      category: 'Health & Safety',
      renewalCost: '$4,500',
      renewalProcess: 'Full recertification required',
      assignedTo: 'Safety Team',
      lastAudit: '2023-11-25',
      nextAudit: '2024-02-01',
      complianceScore: 0
    }
  ]

  const aiInsights = [
    {
      type: 'Expiry Alert',
      message: 'AI detected 2 certifications expiring within 60 days',
      severity: 'warning',
      action: 'Schedule renewal audits'
    },
    {
      type: 'Cost Optimization',
      message: 'AI suggests bundling certifications to reduce renewal costs by 20%',
      severity: 'info',
      action: 'Review certification packages'
    },
    {
      type: 'Compliance Score',
      message: 'AI recommends improving OHSAS compliance score to 95%',
      severity: 'success',
      action: 'Enhance safety protocols'
    }
  ]

  const expiringSoon = useMemo(
    () => certificationData.filter((cert) => cert.daysToExpiry <= 90 && cert.daysToExpiry > 0),
    []
  )
  const expired = useMemo(
    () => certificationData.filter((cert) => cert.daysToExpiry < 0),
    []
  )

  const stats = useMemo(() => {
    const total = certificationData.length
    const avgCompliance =
      total > 0
        ? Math.round(
            certificationData.reduce((sum, c) => sum + (c.complianceScore || 0), 0) / total
          )
        : 0
    return {
      total,
      expiringSoonCount: expiringSoon.length,
      expiredCount: expired.length,
      avgCompliance
    }
  }, [expiringSoon.length, expired.length])

  const insightItems = useMemo(() => {
    const items = []
    if (stats.expiredCount > 0) {
      items.push({
        title: `${stats.expiredCount} certification${stats.expiredCount > 1 ? 's are' : ' is'} expired or overdue`,
        detail: 'Prioritize recertification to restore bid eligibility and audit readiness.',
        tone: 'warning'
      })
    }
    if (stats.expiringSoonCount > 0) {
      items.push({
        title: `${stats.expiringSoonCount} certification${stats.expiringSoonCount > 1 ? 's' : ''} in the 90-day renewal window`,
        detail: 'Line up audits, documentation, and issuer submissions before deadlines.',
        tone: 'info'
      })
    }
    items.push({
      title: aiInsights[0].message,
      detail: `Suggested action: ${aiInsights[0].action}.`,
      tone: aiInsights[0].severity === 'warning' ? 'warning' : 'info'
    })
    if (stats.avgCompliance >= 85) {
      items.push({
        title: 'Portfolio compliance scores are within a strong range',
        detail: 'Sustain documentation discipline ahead of peak tender seasons.',
        tone: 'success'
      })
    } else if (stats.total > 0) {
      items.push({
        title: 'Average compliance score merits executive review',
        detail: 'Target remedial audits on the lowest-scoring certificates first.',
        tone: 'warning'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const getStatusBadge = (status) => {
    const variants = {
      Active: 'success',
      'Expiring Soon': 'warning',
      Expired: 'danger',
      'Under Review': 'info',
      Pending: 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getRiskBadge = (riskLevel) => {
    const variants = {
      Low: 'success',
      Medium: 'warning',
      High: 'danger',
      Critical: 'danger'
    }
    return <Badge bg={variants[riskLevel] || 'secondary'}>{riskLevel} Risk</Badge>
  }

  const getCategoryBadge = (category) => {
    const variants = {
      'Quality Management': 'primary',
      Environmental: 'success',
      'Health & Safety': 'warning',
      'Information Security': 'info'
    }
    return <Badge bg={variants[category] || 'secondary'}>{category}</Badge>
  }

  const filteredData = certificationData.filter((item) => {
    const matchesSearch =
      item.certificationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleViewDetails = (cert) => {
    setSelectedCert(cert)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="certification-tracking-page"
        breadcrumbs={[
          {
            label: 'Pre-Qualification Registry',
            onClick: () => navigate('/tender-intelligence/prequalification')
          },
          { label: 'Certification Tracking', active: true }
        ]}
        onBack={() => navigate('/tender-intelligence/prequalification')}
        backLabel="Back to Pre-Qualification Registry"
        title="Certification tracking command center"
        description="Monitor certificate validity, renewal risk, and compliance signals across your pre-qualification portfolio."
        heroActions={(
          <>
            <Button size="sm" variant="outline-primary" className="me-2">
              <Download size={16} className="me-1" />
              Export report
            </Button>
            <Button size="sm" variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} className="me-1" />
              Add certification
            </Button>
          </>
        )}
        heroMeta="Certification & compliance telemetry"
        outlookTitle="Renewal and compliance outlook"
        outlookDescription={`${stats.total} certifications on record: ${stats.total - stats.expiredCount - stats.expiringSoonCount} stable, ${stats.expiringSoonCount} in the renewal window, ${stats.expiredCount} expired or lapsed.`}
        outlookChips={[
          `${stats.total} total`,
          `${stats.expiringSoonCount} expiring soon`,
          `${stats.expiredCount} expired`,
          `${stats.avgCompliance}% avg compliance`
        ]}
        insights={insightItems}
        kpiTitle="Certification signal board"
        kpiMeta="Coverage, risk windows, and score quality"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total certifications"
                value={stats.total}
                hint="Registered certificates in scope"
                tone="intel"
                trend="Registry"
                icon={<Award size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Expiring soon"
                value={stats.expiringSoonCount}
                hint="Within 90 days of expiry"
                tone="warning"
                trend="Renewal"
                trendDirection="down"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Expired"
                value={stats.expiredCount}
                hint="Requires immediate action"
                tone="risk"
                trend="Risk"
                trendDirection="down"
                icon={<Clock size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg compliance"
                value={stats.avgCompliance}
                hint="Mean score across portfolio"
                tone={stats.avgCompliance >= 85 ? 'success' : 'warning'}
                trend="Quality"
                suffix="%"
                icon={<Shield size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle="Certification workspace"
        tableActions={(
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus size={16} className="me-1" />
            Add certification
          </Button>
        )}
      >
        <Row className="mb-4 g-2 align-items-end">
          <Col md={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
          <Col md={3}>
            <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
              <option value="Under Review">Under Review</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button variant="outline-secondary" className="w-100">
              <Filter size={16} className="me-2" />
              More filters
            </Button>
          </Col>
        </Row>

        <Card className="border-0 shadow-none">
          <Card.Body className="p-0">
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="custom-tabs">
              <Tab eventKey="overview" title="Certifications overview">
                <div className="pt-3">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Certification details</th>
                          <th>Issuer</th>
                          <th>Category</th>
                          <th>Issue date</th>
                          <th>Expiry date</th>
                          <th>Days to expiry</th>
                          <th>AI risk level</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="cert-info">
                                <h6 className="mb-1">{item.certificationName}</h6>
                                <small className="text-muted">#{item.certificateNumber}</small>
                                <div className="mt-1">{getCategoryBadge(item.category)}</div>
                              </div>
                            </td>
                            <td>
                              <div className="issuer-info">
                                <Building size={16} className="me-1" />
                                {item.issuer}
                              </div>
                            </td>
                            <td>
                              <span className="category-text">{item.category}</span>
                            </td>
                            <td>
                              <span className="date-text">{item.issueDate}</span>
                            </td>
                            <td>
                              <span className="date-text">{item.expiryDate}</span>
                            </td>
                            <td>
                              <div className="expiry-info">
                                <span
                                  className={`days-text ${
                                    item.daysToExpiry < 0
                                      ? 'expired'
                                      : item.daysToExpiry <= 90
                                        ? 'expiring'
                                        : 'valid'
                                  }`}
                                >
                                  {item.daysToExpiry < 0
                                    ? `${Math.abs(item.daysToExpiry)} days overdue`
                                    : `${item.daysToExpiry} days`}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="ai-risk-info">
                                {getRiskBadge(item.aiExpiryRisk)}
                                <small className="d-block text-muted">{item.aiRecommendation}</small>
                              </div>
                            </td>
                            <td>
                              <div className="status-info">
                                {getStatusBadge(item.status)}
                                <div className="mt-1">
                                  <Badge bg="info" style={{ fontSize: '0.7rem' }}>
                                    Score: {item.complianceScore}%
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleViewDetails(item)}
                                >
                                  <Eye size={14} />
                                </Button>
                                <Button variant="outline-secondary" size="sm" className="ms-1">
                                  <Brain size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Tab>

              <Tab eventKey="expiring" title="Expiring soon">
                <div className="pt-3">
                  <Row>
                    {expiringSoon.map((cert) => (
                      <Col md={6} key={cert.id} className="mb-3">
                        <Card className="cert-card expiring">
                          <Card.Body>
                            <div className="cert-header">
                              <div className="cert-status">{getStatusBadge(cert.status)}</div>
                              <div className="cert-risk">{getRiskBadge(cert.aiExpiryRisk)}</div>
                            </div>
                            <h6 className="cert-title">{cert.certificationName}</h6>
                            <div className="cert-details">
                              <div className="cert-issuer">
                                <Building size={14} className="me-1" />
                                {cert.issuer}
                              </div>
                              <div className="cert-expiry">
                                <Calendar size={14} className="me-1" />
                                Expires: {cert.expiryDate}
                              </div>
                              <div className="cert-days">
                                <Clock size={14} className="me-1" />
                                {cert.daysToExpiry} days remaining
                              </div>
                            </div>
                            <div className="ai-recommendation">
                              <Brain size={14} className="me-1" />
                              <small>{cert.aiRecommendation}</small>
                            </div>
                            <div className="cert-actions mt-3">
                              <Button variant="outline-primary" size="sm" className="me-2">
                                <Edit size={14} className="me-1" />
                                Renew
                              </Button>
                              <Button variant="outline-secondary" size="sm">
                                <Brain size={14} className="me-1" />
                                AI plan
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Tab>

              <Tab eventKey="recommendations" title="AI recommendations">
                <div className="pt-3">
                  <Row>
                    {aiInsights.map((insight, index) => (
                      <Col md={4} key={index} className="mb-3">
                        <Card className={`recommendation-card ${insight.severity}`}>
                          <Card.Body>
                            <div className="recommendation-header">
                              <Brain size={20} className="me-2" />
                              <strong>{insight.type}</strong>
                            </div>
                            <p className="recommendation-message">{insight.message}</p>
                            <Button variant="outline-primary" size="sm" className="w-100">
                              {insight.action}
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </ExecutiveCommandCenter>

      <Modal show={selectedCert !== null} onHide={() => setSelectedCert(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Award size={20} className="me-2" />
            Certification details — {selectedCert?.certificationName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCert && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Certificate number:</strong> {selectedCert.certificateNumber}
                </Col>
                <Col md={6}>
                  <strong>Issuer:</strong> {selectedCert.issuer}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Issue date:</strong> {selectedCert.issueDate}
                </Col>
                <Col md={6}>
                  <strong>Expiry date:</strong> {selectedCert.expiryDate}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Category:</strong> {getCategoryBadge(selectedCert.category)}
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> {getStatusBadge(selectedCert.status)}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Renewal cost:</strong> {selectedCert.renewalCost}
                </Col>
                <Col md={6}>
                  <strong>Assigned to:</strong> {selectedCert.assignedTo}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Last audit:</strong> {selectedCert.lastAudit}
                </Col>
                <Col md={6}>
                  <strong>Next audit:</strong> {selectedCert.nextAudit}
                </Col>
              </Row>

              <hr />

              <div className="ai-recommendation">
                <h6>
                  <Brain size={16} className="me-2" />
                  AI recommendation
                </h6>
                <Alert variant="info">{selectedCert.aiRecommendation}</Alert>
              </div>

              <div className="compliance-score">
                <h6>
                  <Shield size={16} className="me-2" />
                  Compliance score
                </h6>
                <ProgressBar
                  now={selectedCert.complianceScore}
                  variant={
                    selectedCert.complianceScore >= 90
                      ? 'success'
                      : selectedCert.complianceScore >= 70
                        ? 'warning'
                        : 'danger'
                  }
                  label={`${selectedCert.complianceScore}%`}
                  className="mb-2"
                />
                <small className="text-muted">Based on latest audit results</small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedCert(null)}>
            Close
          </Button>
          <Button variant="primary">
            <Brain size={16} className="me-2" />
            Run AI analysis
          </Button>
        </Modal.Footer>
      </Modal>

      <FormDrawerModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        onTestFill={
          showAddModal
            ? () => requestAnimationFrame(() => applyDomFormValues(certAddFormRef.current, dummyCertificationTrackingPrefill()))
            : undefined
        }
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Plus size={20} className="me-2" />
            Add new certification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={certAddFormRef}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Certification name</Form.Label>
                  <Form.Control name="certificationName" type="text" placeholder="Enter certification name" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Certificate number</Form.Label>
                  <Form.Control name="certificateNumber" type="text" placeholder="Enter certificate number" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Issuer</Form.Label>
                  <Form.Control name="issuer" type="text" placeholder="Enter issuing organization" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category">
                    <option value="Quality Management">Quality Management</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Health & Safety">Health &amp; Safety</option>
                    <option value="Information Security">Information Security</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Issue date</Form.Label>
                  <Form.Control name="issueDate" type="date" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry date</Form.Label>
                  <Form.Control name="expiryDate" type="date" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Renewal cost</Form.Label>
                  <Form.Control name="renewalCost" type="text" placeholder="Enter renewal cost" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assigned to</Form.Label>
                  <Form.Control name="assignedTo" type="text" placeholder="Enter team or person responsible" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Check name="aiMonitoring" type="checkbox" label="Enable AI monitoring" defaultChecked />
              </Col>
              <Col md={6}>
                <Form.Check name="sendExpiryAlerts" type="checkbox" label="Send expiry alerts" defaultChecked />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            <Brain size={16} className="me-2" />
            Add with AI tracking
          </Button>
        </Modal.Footer>
      </FormDrawerModal>
    </>
  )
}

export default CertificationTracking
