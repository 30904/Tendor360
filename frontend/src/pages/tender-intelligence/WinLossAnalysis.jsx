import React, { useState, useMemo } from 'react'
import { Row, Col, Card, Table, Badge, Button, Form, Modal, Alert, Tabs, Tab } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { 
  TrendingUp, 
  Target,
  Search,
  Filter,
  Download,
  Eye,
  Brain,
  Percent,
  Users,
  Building,
  Zap,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './WinLossAnalysis.scss'

const WinLossAnalysis = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTender, setSelectedTender] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // AI-powered win/loss analysis data
  const tenderData = [
    {
      id: 1,
      tenderName: "Highway Infrastructure Development",
      client: "Ministry of Transport",
      value: "$45.2M",
      status: "Won",
      winRate: 85,
      competitorCount: 8,
      ourRank: 1,
      aiWinProbability: 78,
      aiInsight: "Strong technical proposal and competitive pricing",
      winFactors: ["Technical Excellence", "Competitive Pricing", "Past Performance"],
      lossFactors: [],
      competitorAnalysis: "Outperformed 7 competitors including major players",
      submissionDate: "2024-01-15",
      awardDate: "2024-01-20",
      category: "Infrastructure"
    },
    {
      id: 2,
      tenderName: "Smart City Technology Implementation",
      client: "City Development Authority",
      value: "$28.7M",
      status: "Lost",
      winRate: 0,
      competitorCount: 12,
      ourRank: 3,
      aiWinProbability: 45,
      aiInsight: "Pricing was 15% higher than winning bid",
      winFactors: [],
      lossFactors: ["High Pricing", "Limited Local Presence", "Technical Complexity"],
      competitorAnalysis: "Lost to TechCorp Solutions - they had better local partnerships",
      submissionDate: "2024-01-10",
      awardDate: "2024-01-18",
      category: "Technology"
    },
    {
      id: 3,
      tenderName: "Healthcare Facility Construction",
      client: "Health Ministry",
      value: "$67.8M",
      status: "Won",
      winRate: 92,
      competitorCount: 6,
      ourRank: 1,
      aiWinProbability: 88,
      aiInsight: "Excellent compliance record and innovative design",
      winFactors: ["Compliance Excellence", "Innovative Design", "Strong Team"],
      lossFactors: [],
      competitorAnalysis: "Dominant performance against 5 competitors",
      submissionDate: "2024-01-05",
      awardDate: "2024-01-12",
      category: "Healthcare"
    },
    {
      id: 4,
      tenderName: "Renewable Energy Power Plant",
      client: "Energy Corporation",
      value: "$125.4M",
      status: "Lost",
      winRate: 0,
      competitorCount: 15,
      ourRank: 4,
      aiWinProbability: 35,
      aiInsight: "Limited experience in renewable energy sector",
      winFactors: [],
      lossFactors: ["Limited Sector Experience", "High Risk Assessment", "Complex Requirements"],
      competitorAnalysis: "Lost to GreenEnergy Corp - they had 10+ years renewable experience",
      submissionDate: "2024-01-08",
      awardDate: "2024-01-25",
      category: "Energy"
    },
    {
      id: 5,
      tenderName: "Educational Campus Development",
      client: "Education Board",
      value: "$34.6M",
      status: "Won",
      winRate: 78,
      competitorCount: 9,
      ourRank: 1,
      aiWinProbability: 82,
      aiInsight: "Strong educational sector experience and cost-effective solution",
      winFactors: ["Sector Experience", "Cost Effectiveness", "Timeline Compliance"],
      lossFactors: [],
      competitorAnalysis: "Beat 8 competitors with superior project management approach",
      submissionDate: "2024-01-12",
      awardDate: "2024-01-22",
      category: "Education"
    }
  ]

  const aiInsights = [
    {
      type: "Win Pattern Analysis",
      message: "AI identified that technical excellence and competitive pricing are key success factors",
      severity: "success",
      action: "Focus on technical differentiation"
    },
    {
      type: "Loss Pattern Analysis",
      message: "AI detected pricing and sector experience as primary loss factors",
      severity: "warning",
      action: "Review pricing strategies"
    },
    {
      type: "Competitive Intelligence",
      message: "AI recommends strengthening partnerships in technology and energy sectors",
      severity: "info",
      action: "Develop strategic partnerships"
    }
  ]

  const winLossMetrics = {
    totalTenders: tenderData.length,
    wonTenders: tenderData.filter(t => t.status === 'Won').length,
    lostTenders: tenderData.filter(t => t.status === 'Lost').length,
    overallWinRate: Math.round((tenderData.filter(t => t.status === 'Won').length / tenderData.length) * 100),
    averageCompetitors: Math.round(tenderData.reduce((sum, t) => sum + t.competitorCount, 0) / tenderData.length),
    aiAccuracy: 87
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Won': 'success',
      'Lost': 'danger',
      'Pending': 'warning',
      'Under Review': 'info'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return <Badge bg="success">1st Place</Badge>
    if (rank === 2) return <Badge bg="warning">2nd Place</Badge>
    if (rank === 3) return <Badge bg="info">3rd Place</Badge>
    return <Badge bg="secondary">{rank}th Place</Badge>
  }

  const getProbabilityBadge = (probability) => {
    if (probability >= 80) return <Badge bg="success">{probability}%</Badge>
    if (probability >= 60) return <Badge bg="warning">{probability}%</Badge>
    return <Badge bg="danger">{probability}%</Badge>
  }

  const filteredData = tenderData.filter(item => {
    const matchesSearch = item.tenderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const insightItems = useMemo(() => {
    const items = aiInsights.map((insight) => ({
      title: insight.type,
      detail: insight.message,
      tone: insight.severity === 'success' ? 'success' : insight.severity === 'warning' ? 'warning' : 'info'
    }))
    items.unshift({
      title: `${winLossMetrics.overallWinRate}% overall win rate across ${winLossMetrics.totalTenders} tenders`,
      detail: `${winLossMetrics.wonTenders} wins, ${winLossMetrics.lostTenders} losses. AI model accuracy about ${winLossMetrics.aiAccuracy}%.`,
      tone: winLossMetrics.overallWinRate >= 50 ? 'success' : 'warning'
    })
    return items.slice(0, 3)
  }, [
    winLossMetrics.overallWinRate,
    winLossMetrics.totalTenders,
    winLossMetrics.wonTenders,
    winLossMetrics.lostTenders,
    winLossMetrics.aiAccuracy
  ])

  const handleViewDetails = (tender) => {
    setSelectedTender(tender)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="win-loss-analysis-page"
        breadcrumbs={[
          { label: 'Tender Intelligence', onClick: () => navigate('/tender-intelligence') },
          { label: 'Win/Loss Analysis', active: true }
        ]}
        onBack={() => navigate('/tender-intelligence')}
        backLabel="Back to Tender Intelligence"
        title="Win/loss analysis command center"
        description="AI-powered competitive insights and performance analytics across evaluated tenders."
        heroActions={(
          <>
            <Button variant="outline-primary" size="sm" className="me-2">
              <Download size={16} className="me-2" />
              Export Analysis
            </Button>
            <Button variant="primary" size="sm">
              <Brain size={16} className="me-2" />
              AI Deep Dive
            </Button>
          </>
        )}
        heroMeta="Competitive intelligence telemetry"
        outlookTitle="Win/loss intelligence outlook"
        outlookDescription={`${winLossMetrics.totalTenders} tenders analyzed — ${winLossMetrics.wonTenders} won, ${winLossMetrics.lostTenders} lost. Typical field size ~${winLossMetrics.averageCompetitors} competitors.`}
        outlookChips={[
          `${winLossMetrics.overallWinRate}% win rate`,
          `${winLossMetrics.wonTenders} wins`,
          `${winLossMetrics.lostTenders} losses`,
          `~${winLossMetrics.averageCompetitors} avg competitors`,
          `${winLossMetrics.aiAccuracy}% AI accuracy`
        ]}
        insights={insightItems}
        kpiTitle="Performance signal board"
        kpiMeta="Outcomes and model confidence"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={2}>
              <PremiumKpiCard label="Total tenders" value={winLossMetrics.totalTenders} hint="In analysis set" tone="intel" trend="Pipeline" icon={<Target size={20} />} />
            </Col>
            <Col xs={12} sm={6} xl={2}>
              <PremiumKpiCard label="Won" value={winLossMetrics.wonTenders} hint="Awarded pursuits" tone="success" trend="Wins" icon={<CheckCircle size={20} />} />
            </Col>
            <Col xs={12} sm={6} xl={2}>
              <PremiumKpiCard label="Lost" value={winLossMetrics.lostTenders} hint="Non-awarded" tone="warning" trend="Losses" icon={<XCircle size={20} />} />
            </Col>
            <Col xs={12} sm={6} xl={2}>
              <PremiumKpiCard label="Win rate" value={winLossMetrics.overallWinRate} hint="Win / total" tone="intel" trend="Rate" suffix="%" icon={<Percent size={20} />} />
            </Col>
            <Col xs={12} sm={6} xl={2}>
              <PremiumKpiCard label="Avg competitors" value={winLossMetrics.averageCompetitors} hint="Per tender" tone="info" trend="Field" icon={<Users size={20} />} />
            </Col>
            <Col xs={12} sm={6} xl={2}>
              <PremiumKpiCard label="AI accuracy" value={winLossMetrics.aiAccuracy} hint="Model calibration" tone="success" trend="Model" suffix="%" icon={<Zap size={20} />} />
            </Col>
          </Row>
        )}
        tableTitle="Analysis workspace"
      >
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="ai-insights-alert mb-0">
              <div className="d-flex align-items-center flex-wrap gap-2">
                <Brain size={20} className="me-2 flex-shrink-0" />
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

        <Row className="mb-4">
          <Col md={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search tenders or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
              <option value="Pending">Pending</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button variant="outline-secondary" className="w-100">
              <Filter size={16} className="me-2" />
              More Filters
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Body className="p-0">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="custom-tabs"
                >
                  <Tab eventKey="overview" title="Analysis Overview">
                    <div className="p-4">
                      <div className="table-responsive">
                        <Table hover className="mb-0">
                          <thead>
                            <tr>
                              <th>Tender Details</th>
                              <th>Client</th>
                              <th>Value</th>
                              <th>Status</th>
                              <th>Our Rank</th>
                              <th>Competitors</th>
                              <th>AI Win Probability</th>
                              <th>Win/Loss Factors</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <div className="tender-info">
                                    <h6 className="mb-1">{item.tenderName}</h6>
                                    <small className="text-muted">{item.category}</small>
                                    <div className="mt-1">
                                      <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>
                                        {item.category}
                                      </Badge>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="client-info">
                                    <Building size={16} className="me-1" />
                                    {item.client}
                                  </div>
                                </td>
                                <td>
                                  <span className="value-text">{item.value}</span>
                                </td>
                                <td>{getStatusBadge(item.status)}</td>
                                <td>{getRankBadge(item.ourRank)}</td>
                                <td>
                                  <div className="competitors-info">
                                    <Users size={14} className="me-1" />
                                    {item.competitorCount}
                                  </div>
                                </td>
                                <td>
                                  <div className="probability-info">
                                    {getProbabilityBadge(item.aiWinProbability)}
                                    <small className="d-block text-muted">{item.aiInsight}</small>
                                  </div>
                                </td>
                                <td>
                                  <div className="factors-info">
                                    {item.winFactors.length > 0 && (
                                      <div className="win-factors">
                                        <CheckCircle size={12} className="me-1 text-success" />
                                        <small className="text-success">{item.winFactors.length} factors</small>
                                      </div>
                                    )}
                                    {item.lossFactors.length > 0 && (
                                      <div className="loss-factors">
                                        <XCircle size={12} className="me-1 text-danger" />
                                        <small className="text-danger">{item.lossFactors.length} factors</small>
                                      </div>
                                    )}
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
                  
                  <Tab eventKey="insights" title="AI Insights">
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

                  <Tab eventKey="patterns" title="Win/Loss Patterns">
                    <div className="p-4">
                      <Row>
                        <Col md={6}>
                          <Card className="pattern-card">
                            <Card.Header>
                              <h6 className="mb-0">
                                <CheckCircle size={16} className="me-2" />
                                Top Win Factors
                              </h6>
                            </Card.Header>
                            <Card.Body>
                              <div className="pattern-list">
                                <div className="pattern-item">
                                  <div className="pattern-factor">Technical Excellence</div>
                                  <div className="pattern-frequency">85% of wins</div>
                                </div>
                                <div className="pattern-item">
                                  <div className="pattern-factor">Competitive Pricing</div>
                                  <div className="pattern-frequency">78% of wins</div>
                                </div>
                                <div className="pattern-item">
                                  <div className="pattern-factor">Past Performance</div>
                                  <div className="pattern-frequency">72% of wins</div>
                                </div>
                                <div className="pattern-item">
                                  <div className="pattern-factor">Innovative Design</div>
                                  <div className="pattern-frequency">65% of wins</div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="pattern-card">
                            <Card.Header>
                              <h6 className="mb-0">
                                <XCircle size={16} className="me-2" />
                                Top Loss Factors
                              </h6>
                            </Card.Header>
                            <Card.Body>
                              <div className="pattern-list">
                                <div className="pattern-item">
                                  <div className="pattern-factor">High Pricing</div>
                                  <div className="pattern-frequency">68% of losses</div>
                                </div>
                                <div className="pattern-item">
                                  <div className="pattern-factor">Limited Sector Experience</div>
                                  <div className="pattern-frequency">55% of losses</div>
                                </div>
                                <div className="pattern-item">
                                  <div className="pattern-factor">Technical Complexity</div>
                                  <div className="pattern-frequency">42% of losses</div>
                                </div>
                                <div className="pattern-item">
                                  <div className="pattern-factor">Limited Local Presence</div>
                                  <div className="pattern-frequency">38% of losses</div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </ExecutiveCommandCenter>

        {/* Detailed View Modal */}
        <Modal show={selectedTender !== null} onHide={() => setSelectedTender(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <TrendingUp size={20} className="me-2" />
              Tender Analysis - {selectedTender?.tenderName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTender && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Client:</strong> {selectedTender.client}
                  </Col>
                  <Col md={6}>
                    <strong>Value:</strong> {selectedTender.value}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Status:</strong> {getStatusBadge(selectedTender.status)}
                  </Col>
                  <Col md={6}>
                    <strong>Our Rank:</strong> {getRankBadge(selectedTender.ourRank)}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Competitors:</strong> {selectedTender.competitorCount}
                  </Col>
                  <Col md={6}>
                    <strong>AI Win Probability:</strong> {getProbabilityBadge(selectedTender.aiWinProbability)}
                  </Col>
                </Row>
                
                <hr />
                
                <div className="ai-insight">
                  <h6>
                    <Brain size={16} className="me-2" />
                    AI Insight
                  </h6>
                  <Alert variant="info">
                    {selectedTender.aiInsight}
                  </Alert>
                </div>

                <div className="competitor-analysis">
                  <h6>
                    <Users size={16} className="me-2" />
                    Competitor Analysis
                  </h6>
                  <Alert variant="secondary">
                    {selectedTender.competitorAnalysis}
                  </Alert>
                </div>

                {selectedTender.winFactors.length > 0 && (
                  <div className="win-factors">
                    <h6>
                      <CheckCircle size={16} className="me-2" />
                      Win Factors
                    </h6>
                    <ul>
                      {selectedTender.winFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedTender.lossFactors.length > 0 && (
                  <div className="loss-factors">
                    <h6>
                      <XCircle size={16} className="me-2" />
                      Loss Factors
                    </h6>
                    <ul>
                      {selectedTender.lossFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedTender(null)}>
              Close
            </Button>
            <Button variant="primary">
              <Brain size={16} className="me-2" />
              Run AI Analysis
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default WinLossAnalysis
