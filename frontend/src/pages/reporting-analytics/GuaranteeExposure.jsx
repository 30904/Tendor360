import React, { useState } from 'react'
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, ProgressBar, Alert, Tabs, Tab } from 'react-bootstrap'
import { 
  ArrowLeft, 
  BarChart, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Brain,
  Zap,
  Target,
  PieChart,
  Activity,
  Calendar,
  Building,
  Globe,
  Clock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './GuaranteeExposure.scss'

const GuaranteeExposure = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedGuarantee, setSelectedGuarantee] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // AI-powered risk analytics data
  const guaranteeExposureData = [
    {
      id: 1,
      guaranteeType: "Performance Bond",
      tenderName: "Highway Infrastructure Development",
      client: "Ministry of Transport",
      amount: "$4.5M",
      utilization: 75,
      expiryDate: "2024-06-15",
      issuer: "Bank of Commerce",
      riskScore: 25,
      aiRiskLevel: "Low",
      aiRecommendation: "Maintain current exposure",
      region: "North America",
      status: "Active"
    },
    {
      id: 2,
      guaranteeType: "Advance Payment Guarantee",
      tenderName: "Smart City Technology Implementation",
      client: "City Development Authority",
      amount: "$2.8M",
      utilization: 100,
      expiryDate: "2024-04-20",
      issuer: "Global Trust Bank",
      riskScore: 45,
      aiRiskLevel: "Medium",
      aiRecommendation: "Monitor closely - approaching limit",
      region: "Asia Pacific",
      status: "Active"
    },
    {
      id: 3,
      guaranteeType: "Bid Bond",
      tenderName: "Healthcare Facility Construction",
      client: "Health Ministry",
      amount: "$1.2M",
      utilization: 60,
      expiryDate: "2024-03-10",
      issuer: "Metropolitan Bank",
      riskScore: 15,
      aiRiskLevel: "Low",
      aiRecommendation: "Optimal utilization level",
      region: "Europe",
      status: "Active"
    },
    {
      id: 4,
      guaranteeType: "Warranty Bond",
      tenderName: "Renewable Energy Power Plant",
      client: "Energy Corporation",
      amount: "$8.9M",
      utilization: 90,
      expiryDate: "2024-08-30",
      issuer: "International Finance Corp",
      riskScore: 65,
      aiRiskLevel: "High",
      aiRecommendation: "Consider risk mitigation strategies",
      region: "Middle East",
      status: "Active"
    },
    {
      id: 5,
      guaranteeType: "Retention Bond",
      tenderName: "Educational Campus Development",
      client: "Education Board",
      amount: "$1.7M",
      utilization: 40,
      expiryDate: "2024-12-15",
      issuer: "Regional Development Bank",
      riskScore: 20,
      aiRiskLevel: "Low",
      aiRecommendation: "Standard monitoring required",
      region: "South America",
      status: "Active"
    }
  ]

  const aiInsights = [
    {
      type: "Risk Alert",
      message: "AI detected 2 guarantees approaching expiry within 30 days",
      severity: "warning",
      action: "Review renewal schedules"
    },
    {
      type: "Optimization",
      message: "AI suggests consolidating 3 small guarantees to reduce costs by 15%",
      severity: "info",
      action: "Consider consolidation"
    },
    {
      type: "Risk Assessment",
      message: "Overall portfolio risk is within acceptable limits",
      severity: "success",
      action: "Continue monitoring"
    }
  ]

  const exposureMetrics = {
    totalExposure: "$19.1M",
    utilizedAmount: "$14.2M",
    availableCapacity: "$4.9M",
    averageRiskScore: 34,
    expiringSoon: 2,
    aiOptimizationPotential: "$2.8M"
  }

  const getRiskBadge = (riskLevel) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return <Badge bg={variants[riskLevel] || 'secondary'}>{riskLevel} Risk</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Expired': 'danger',
      'Pending': 'warning'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const filteredData = guaranteeExposureData.filter(item => {
    const matchesSearch = item.tenderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.guaranteeType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || item.guaranteeType === filterType
    return matchesSearch && matchesFilter
  })

  const handleViewDetails = (guarantee) => {
    setSelectedGuarantee(guarantee)
  }

  return (
    <div className="guarantee-exposure-page">
      <Container fluid>
        {/* Breadcrumb */}
        <Row className="mb-3">
          <Col>
            <div className="breadcrumb-nav">
              <button 
                className="breadcrumb-back"
                onClick={() => navigate('/reporting-analytics')}
              >
                <ArrowLeft size={16} className="me-2" />
                Back to Reporting & Analytics
              </button>
            </div>
          </Col>
        </Row>

        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <div className="header-content">
                <div className="header-icon">
                  <BarChart size={32} />
                </div>
                <div className="header-text">
                  <h2>Guarantee Exposure</h2>
                  <p className="text-muted">AI-powered risk analytics and exposure monitoring</p>
                </div>
              </div>
              <div className="header-actions">
                <Button variant="outline-primary" className="me-2">
                  <Download size={16} className="me-2" />
                  Export Report
                </Button>
                <Button variant="primary">
                  <Brain size={16} className="me-2" />
                  AI Analysis
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* AI Insights Alert */}
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="ai-insights-alert">
              <div className="d-flex align-items-center">
                <Brain size={20} className="me-2" />
                <div className="flex-grow-1">
                  <strong>AI Insights:</strong> {aiInsights[0].message}
                </div>
                <Button variant="outline-info" size="sm">
                  {aiInsights[0].action}
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>

        {/* Key Metrics Cards */}
        <Row className="mb-4">
          <Col md={2}>
            <Card className="metric-card">
              <Card.Body>
                <div className="metric-content">
                  <div className="metric-icon bg-primary">
                    <DollarSign size={24} />
                  </div>
                  <div className="metric-details">
                    <h3>{exposureMetrics.totalExposure}</h3>
                    <p>Total Exposure</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="metric-card">
              <Card.Body>
                <div className="metric-content">
                  <div className="metric-icon bg-success">
                    <Activity size={24} />
                  </div>
                  <div className="metric-details">
                    <h3>{exposureMetrics.utilizedAmount}</h3>
                    <p>Utilized</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="metric-card">
              <Card.Body>
                <div className="metric-content">
                  <div className="metric-icon bg-info">
                    <Target size={24} />
                  </div>
                  <div className="metric-details">
                    <h3>{exposureMetrics.availableCapacity}</h3>
                    <p>Available</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="metric-card">
              <Card.Body>
                <div className="metric-content">
                  <div className="metric-icon bg-warning">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="metric-details">
                    <h3>{exposureMetrics.averageRiskScore}</h3>
                    <p>Avg Risk Score</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="metric-card">
              <Card.Body>
                <div className="metric-content">
                  <div className="metric-icon bg-danger">
                    <Clock size={24} />
                  </div>
                  <div className="metric-details">
                    <h3>{exposureMetrics.expiringSoon}</h3>
                    <p>Expiring Soon</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="metric-card ai-optimization">
              <Card.Body>
                <div className="metric-content">
                  <div className="metric-icon bg-gradient">
                    <Zap size={24} />
                  </div>
                  <div className="metric-details">
                    <h3>{exposureMetrics.aiOptimizationPotential}</h3>
                    <p>AI Savings Potential</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters and Search */}
        <Row className="mb-4">
          <Col md={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search guarantees, tenders, or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Performance Bond">Performance Bond</option>
              <option value="Advance Payment Guarantee">Advance Payment</option>
              <option value="Bid Bond">Bid Bond</option>
              <option value="Warranty Bond">Warranty Bond</option>
              <option value="Retention Bond">Retention Bond</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button variant="outline-secondary" className="w-100">
              <Filter size={16} className="me-2" />
              More Filters
            </Button>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Row>
          <Col>
            <Card>
              <Card.Body className="p-0">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="custom-tabs"
                >
                  <Tab eventKey="overview" title="Overview">
                    <div className="p-4">
                      <div className="table-responsive">
                        <Table hover className="mb-0">
                          <thead>
                            <tr>
                              <th>Guarantee Details</th>
                              <th>Client</th>
                              <th>Amount</th>
                              <th>Utilization</th>
                              <th>Expiry Date</th>
                              <th>AI Risk Level</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <div className="guarantee-info">
                                    <h6 className="mb-1">{item.guaranteeType}</h6>
                                    <small className="text-muted">{item.tenderName}</small>
                                  </div>
                                </td>
                                <td>
                                  <div className="client-info">
                                    <Building size={16} className="me-1" />
                                    {item.client}
                                  </div>
                                </td>
                                <td>
                                  <span className="amount-text">{item.amount}</span>
                                </td>
                                <td>
                                  <div className="utilization-info">
                                    <ProgressBar 
                                      now={item.utilization} 
                                      variant={item.utilization >= 90 ? 'danger' : item.utilization >= 70 ? 'warning' : 'success'}
                                      className="mb-1"
                                      style={{ height: '6px' }}
                                    />
                                    <small>{item.utilization}%</small>
                                  </div>
                                </td>
                                <td>
                                  <div className="expiry-info">
                                    <Calendar size={14} className="me-1" />
                                    {item.expiryDate}
                                  </div>
                                </td>
                                <td>
                                  <div className="ai-risk-info">
                                    {getRiskBadge(item.aiRiskLevel)}
                                    <small className="d-block text-muted">Score: {item.riskScore}</small>
                                  </div>
                                </td>
                                <td>{getStatusBadge(item.status)}</td>
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
                  
                  <Tab eventKey="analytics" title="AI Analytics">
                    <div className="p-4">
                      <Row>
                        <Col md={6}>
                          <Card className="analytics-card">
                            <Card.Header>
                              <h6 className="mb-0">
                                <PieChart size={16} className="me-2" />
                                Exposure by Type
                              </h6>
                            </Card.Header>
                            <Card.Body>
                              <div className="chart-placeholder">
                                <div className="chart-icon">
                                  <PieChart size={48} />
                                </div>
                                <p className="text-muted">AI-generated exposure distribution chart</p>
                                <Button variant="outline-primary" size="sm">
                                  <Brain size={14} className="me-1" />
                                  Generate AI Chart
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="analytics-card">
                            <Card.Header>
                              <h6 className="mb-0">
                                <TrendingUp size={16} className="me-2" />
                                Risk Trends
                              </h6>
                            </Card.Header>
                            <Card.Body>
                              <div className="chart-placeholder">
                                <div className="chart-icon">
                                  <TrendingUp size={48} />
                                </div>
                                <p className="text-muted">AI-powered risk trend analysis</p>
                                <Button variant="outline-primary" size="sm">
                                  <Brain size={14} className="me-1" />
                                  View AI Insights
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Tab>

                  <Tab eventKey="recommendations" title="AI Recommendations">
                    <div className="p-4">
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
          </Col>
        </Row>

        {/* Detailed View Modal */}
        <Modal show={selectedGuarantee !== null} onHide={() => setSelectedGuarantee(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <BarChart size={20} className="me-2" />
              Guarantee Details - {selectedGuarantee?.guaranteeType}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedGuarantee && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Tender:</strong> {selectedGuarantee.tenderName}
                  </Col>
                  <Col md={6}>
                    <strong>Client:</strong> {selectedGuarantee.client}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Amount:</strong> {selectedGuarantee.amount}
                  </Col>
                  <Col md={6}>
                    <strong>Issuer:</strong> {selectedGuarantee.issuer}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>AI Risk Level:</strong> {getRiskBadge(selectedGuarantee.aiRiskLevel)}
                  </Col>
                  <Col md={6}>
                    <strong>Region:</strong> {selectedGuarantee.region}
                  </Col>
                </Row>
                
                <hr />
                
                <div className="ai-recommendation">
                  <h6>
                    <Brain size={16} className="me-2" />
                    AI Recommendation
                  </h6>
                  <Alert variant="info">
                    {selectedGuarantee.aiRecommendation}
                  </Alert>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedGuarantee(null)}>
              Close
            </Button>
            <Button variant="primary">
              <Brain size={16} className="me-2" />
              Run AI Analysis
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  )
}

export default GuaranteeExposure
