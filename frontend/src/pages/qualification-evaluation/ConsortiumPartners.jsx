import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Edit, Trash2, Eye, Users, Building, Handshake, Brain, CheckCircle, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './ConsortiumPartners.scss'

const ConsortiumPartners = () => {
  const navigate = useNavigate()
  const [consortiums, setConsortiums] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedConsortium, setSelectedConsortium] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setConsortiums([
      {
        id: 1,
        name: 'Infrastructure Development Consortium',
        description: 'Multi-company partnership for large infrastructure projects',
        type: 'Strategic',
        status: 'Active',
        leadPartner: 'ABC Construction Ltd.',
        partners: [
          { name: 'ABC Construction Ltd.', role: 'Lead Partner', expertise: 'Construction', contribution: 40 },
          { name: 'XYZ Engineering Corp.', role: 'Technical Partner', expertise: 'Engineering', contribution: 30 },
          { name: 'DEF Materials Inc.', role: 'Supply Partner', expertise: 'Materials', contribution: 20 },
          { name: 'GHI Logistics Ltd.', role: 'Logistics Partner', expertise: 'Transportation', contribution: 10 }
        ],
        totalPartners: 4,
        totalContribution: 100,
        aiAssessment: 'Strong complementary expertise with balanced risk distribution',
        aiConfidence: 92,
        successRate: 88,
        avgProjectValue: 25000000,
        riskLevel: 'Low',
        establishedDate: '2023-01-15',
        lastProject: 'Highway Construction Phase 2'
      },
      {
        id: 2,
        name: 'Technology Innovation Alliance',
        description: 'Tech-focused consortium for digital transformation projects',
        type: 'Innovation',
        status: 'Active',
        leadPartner: 'Tech Solutions Inc.',
        partners: [
          { name: 'Tech Solutions Inc.', role: 'Lead Partner', expertise: 'Software Development', contribution: 35 },
          { name: 'Cloud Services Ltd.', role: 'Cloud Partner', expertise: 'Cloud Infrastructure', contribution: 25 },
          { name: 'Data Analytics Corp.', role: 'Analytics Partner', expertise: 'Data Science', contribution: 25 },
          { name: 'Security Systems Ltd.', role: 'Security Partner', expertise: 'Cybersecurity', contribution: 15 }
        ],
        totalPartners: 4,
        totalContribution: 100,
        aiAssessment: 'High innovation potential with strong technical capabilities',
        aiConfidence: 89,
        successRate: 82,
        avgProjectValue: 15000000,
        riskLevel: 'Medium',
        establishedDate: '2023-06-20',
        lastProject: 'Government Digital Platform'
      },
      {
        id: 3,
        name: 'Healthcare Services Partnership',
        description: 'Specialized consortium for healthcare infrastructure projects',
        type: 'Specialized',
        status: 'Forming',
        leadPartner: 'MediCare Solutions',
        partners: [
          { name: 'MediCare Solutions', role: 'Lead Partner', expertise: 'Healthcare Services', contribution: 45 },
          { name: 'BioTech Innovations', role: 'Technology Partner', expertise: 'Medical Technology', contribution: 30 },
          { name: 'Health Logistics Ltd.', role: 'Operations Partner', expertise: 'Healthcare Logistics', contribution: 25 }
        ],
        totalPartners: 3,
        totalContribution: 100,
        aiAssessment: 'Specialized expertise with growing market demand',
        aiConfidence: 85,
        successRate: 75,
        avgProjectValue: 12000000,
        riskLevel: 'Medium',
        establishedDate: '2024-01-10',
        lastProject: 'Regional Medical Center'
      },
      {
        id: 4,
        name: 'Renewable Energy Alliance',
        description: 'Green energy consortium for sustainable development projects',
        type: 'Environmental',
        status: 'Active',
        leadPartner: 'GreenPower Solutions',
        partners: [
          { name: 'GreenPower Solutions', role: 'Lead Partner', expertise: 'Solar Energy', contribution: 40 },
          { name: 'WindTech Corp.', role: 'Wind Partner', expertise: 'Wind Energy', contribution: 30 },
          { name: 'Energy Storage Ltd.', role: 'Storage Partner', expertise: 'Battery Technology', contribution: 20 },
          { name: 'GridConnect Inc.', role: 'Grid Partner', expertise: 'Grid Integration', contribution: 10 }
        ],
        totalPartners: 4,
        totalContribution: 100,
        aiAssessment: 'Strong environmental focus with comprehensive energy solutions',
        aiConfidence: 91,
        successRate: 86,
        avgProjectValue: 18000000,
        riskLevel: 'Low',
        establishedDate: '2023-09-15',
        lastProject: 'Solar Farm Development'
      },
      {
        id: 5,
        name: 'Financial Services Consortium',
        description: 'Banking and financial services partnership for fintech projects',
        type: 'Financial',
        status: 'Active',
        leadPartner: 'BankTech Solutions',
        partners: [
          { name: 'BankTech Solutions', role: 'Lead Partner', expertise: 'Banking Technology', contribution: 35 },
          { name: 'PaySecure Ltd.', role: 'Payment Partner', expertise: 'Payment Systems', contribution: 25 },
          { name: 'RiskAnalytics Corp.', role: 'Risk Partner', expertise: 'Risk Management', contribution: 25 },
          { name: 'ComplianceGuard Inc.', role: 'Compliance Partner', expertise: 'Regulatory Compliance', contribution: 15 }
        ],
        totalPartners: 4,
        totalContribution: 100,
        aiAssessment: 'Comprehensive financial services with strong compliance focus',
        aiConfidence: 88,
        successRate: 84,
        avgProjectValue: 22000000,
        riskLevel: 'Medium',
        establishedDate: '2023-11-20',
        lastProject: 'Digital Banking Platform'
      },
      {
        id: 6,
        name: 'Education Technology Partnership',
        description: 'EdTech consortium for educational infrastructure and digital learning',
        type: 'Education',
        status: 'Forming',
        leadPartner: 'EduTech Innovations',
        partners: [
          { name: 'EduTech Innovations', role: 'Lead Partner', expertise: 'Educational Technology', contribution: 50 },
          { name: 'LearningPlatform Ltd.', role: 'Platform Partner', expertise: 'Learning Management', contribution: 30 },
          { name: 'ContentCreation Corp.', role: 'Content Partner', expertise: 'Educational Content', contribution: 20 }
        ],
        totalPartners: 3,
        totalContribution: 100,
        aiAssessment: 'Growing market with innovative educational solutions',
        aiConfidence: 82,
        successRate: 78,
        avgProjectValue: 9500000,
        riskLevel: 'Medium',
        establishedDate: '2024-02-01',
        lastProject: 'Smart Campus Initiative'
      }
    ])

    setStats({
      totalConsortiums: 6,
      active: 4,
      forming: 2,
      totalPartners: 22,
      aiConfidence: 88,
      avgSuccessRate: 82,
      totalProjectValue: 107500000
    })
  }, [])

  const handleViewConsortium = (consortium) => {
    setSelectedConsortium(consortium)
    setShowModal(true)
  }

  const handleEditConsortium = (consortium) => {
    console.log('Edit consortium:', consortium)
    // Navigate to edit consortium or open edit modal
  }

  const handleDeleteConsortium = (consortium) => {
    if (window.confirm(`Are you sure you want to delete consortium "${consortium.name}"?`)) {
      setConsortiums(prev => prev.filter(c => c.id !== consortium.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Consortium Details',
      width: '25%',
      render: (value, row) => (
        <div className="consortium-info">
          <div className="fw-semibold d-flex align-items-center">
            <Handshake size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="consortium-meta">
            <small className="text-muted">Lead: {row.leadPartner}</small>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      width: '10%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => {
        const variants = {
          'Active': 'success',
          'Forming': 'warning',
          'Inactive': 'secondary'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'totalPartners',
      label: 'Partners',
      width: '8%',
      render: (value) => (
        <div className="partners-count">
          <div className="fw-bold text-primary">{value}</div>
          <small className="text-muted">partners</small>
        </div>
      )
    },
    {
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '12%',
      render: (value) => (
        <div className="confidence-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">AI Score</small>
        </div>
      )
    },
    {
      key: 'successRate',
      label: 'Success Rate',
      width: '12%',
      render: (value) => (
        <div className="success-info">
          <div className="fw-bold text-success">{value}%</div>
          <small className="text-muted">Success</small>
        </div>
      )
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      width: '10%',
      render: (value) => {
        const variants = {
          'Low': 'success',
          'Medium': 'warning',
          'High': 'danger'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'avgProjectValue',
      label: 'Avg Project Value',
      width: '13%',
      render: (value) => (
        <div className="value-info">
          <div className="fw-bold text-primary">${(value / 1000000).toFixed(1)}M</div>
        </div>
      )
    }
  ]

  const handleCreateConsortium = () => {
    if (window.confirm('Are you sure you want to create a new consortium?')) {
      // Implementation for creating new consortium
      console.log('Creating new consortium...')
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Forming': 'warning',
      'Inactive': 'secondary',
      'Dissolved': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getRiskBadge = (risk) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return <Badge bg={variants[risk] || 'secondary'}>{risk}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Strategic': Handshake,
      'Innovation': TrendingUp,
      'Specialized': Building
    }
    return icons[type] || Users
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
    if ((stats.totalConsortiums || 0) > 0) {
      items.push({
        title: `${stats.totalConsortiums} consortiums spanning ${stats.totalPartners || 0} partners`,
        detail: `${stats.avgSuccessRate || 0}% historical success with ${stats.aiConfidence || 0}% AI compatibility confidence.`,
        tone: 'info'
      })
    }
    if ((stats.forming || 0) > 0) {
      items.push({
        title: `${stats.forming} formation(s) still in motion`,
        detail: 'Lock workshare, governance, and lead roles before submission freeze.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Register consortium vehicles for upcoming multi-prime work',
        detail: 'Centralize partners, AI fit, and success telemetry in one command view.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="consortium-partners-page"
        breadcrumbs={[
          { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
          { label: 'Consortium / partners', active: true }
        ]}
        onBack={() => navigate('/qualification-evaluation')}
        backLabel="Back to modules"
        title="Consortium & partner command center"
        description="Manage strategic alliances and JV formations with compatibility signals and performance lift."
        heroMeta="Alliance telemetry"
        outlookTitle="Partnership outlook"
        outlookDescription={`${stats.totalConsortiums || 0} consortiums — ${stats.totalPartners || 0} partners — ${stats.active || 0} active, ${stats.forming || 0} forming.`}
        outlookChips={[
          `${stats.totalConsortiums || 0} consortiums`,
          `${stats.totalPartners || 0} partners`,
          `${stats.avgSuccessRate || 0}% success`,
          `${stats.aiConfidence || 0}% AI fit`
        ]}
        insights={insightItems}
        kpiTitle="Alliance signal board"
        kpiMeta="Depth and lift"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Consortiums"
                value={stats.totalConsortiums || 0}
                hint="Registered vehicles"
                tone="intel"
                trend="Coverage"
                icon={<Handshake size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Partners"
                value={stats.totalPartners || 0}
                hint="Across all shells"
                tone="success"
                trend="Network"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg success rate"
                value={stats.avgSuccessRate || 0}
                hint="Historical wins"
                tone="warning"
                trend="Lift"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence || 0}
                hint="Compatibility stance"
                tone={(stats.aiConfidence || 0) >= 85 ? 'success' : 'warning'}
                trend="Model"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Consortiums & partners (${consortiums.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateConsortium}>
              <Plus size={16} className="me-2" />
              New consortium
            </Button>
            <Button variant="outline-secondary">
              <Users size={16} className="me-2" />
              Export report
            </Button>
          </>
        )}
      >
        <DataTable
          data={consortiums}
          columns={columns}
          title="Consortiums & Partnerships"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewConsortium}
          onEdit={handleEditConsortium}
          onDelete={handleDeleteConsortium}
          customActions={[
            {
              type: 'custom',
              label: 'View Partners',
              onClick: (row) => {
                handleViewConsortium(row);
              }
            }
          ]}
          searchPlaceholder="Search consortiums..."
          emptyMessage="No consortiums found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Users size={20} className="me-2" />
              Consortium Details - {selectedConsortium?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedConsortium && (
              <div className="consortium-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedConsortium.type}</p>
                    <p><strong>Status:</strong> {selectedConsortium.status}</p>
                    <p><strong>Established:</strong> {selectedConsortium.establishedDate}</p>
                    <p><strong>Last Project:</strong> {selectedConsortium.lastProject}</p>
                    <p><strong>Risk Level:</strong> {selectedConsortium.riskLevel}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Performance Metrics</h6>
                    <p><strong>Success Rate:</strong> {selectedConsortium.successRate}%</p>
                    <p><strong>Average Project Value:</strong> {formatCurrency(selectedConsortium.avgProjectValue)}</p>
                    <p><strong>Total Partners:</strong> {selectedConsortium.totalPartners}</p>
                    <p><strong>Total Contribution:</strong> {selectedConsortium.totalContribution}%</p>
                    <p><strong>AI Confidence:</strong> {selectedConsortium.aiConfidence}%</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedConsortium.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Partners & Contributions</h6>
                    <div className="partners-list">
                      {selectedConsortium.partners.map((partner, index) => (
                        <div key={index} className="partner-item">
                          <div className="partner-header">
                            <div className="partner-info">
                              <h6 className="mb-1">{partner.name}</h6>
                              <small className="text-muted">{partner.role} • {partner.expertise}</small>
                            </div>
                            <div className="partner-contribution">
                              <Badge bg="primary">{partner.contribution}%</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Assessment & Compatibility</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Assessment:</strong> {selectedConsortium.aiAssessment}
                    </Alert>
                    <Alert variant="success">
                      <CheckCircle size={16} className="me-2" />
                      <strong>Confidence Level:</strong> {selectedConsortium.aiConfidence}% based on partner compatibility analysis and historical performance
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
              Edit Consortium
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default ConsortiumPartners
