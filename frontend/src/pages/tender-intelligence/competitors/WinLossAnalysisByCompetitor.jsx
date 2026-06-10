import React, { useState, useMemo } from 'react'
import { Row, Col, Card, Badge, Button, Modal, Alert, Tabs, Tab } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../../components/intelligence/PremiumKpiCard'
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Download,
  Brain,
  Users,
  Building,
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Settings
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../components/DataTable'
import './WinLossAnalysisByCompetitor.scss'

const WinLossAnalysisByCompetitor = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCompetitor, setFilterCompetitor] = useState('all')
  const [selectedCompetitor, setSelectedCompetitor] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // AI-powered competitor win/loss analysis data
  const competitorData = [
    {
      id: 1,
      competitorName: "TechCorp Solutions",
      winRate: 68,
      totalBids: 25,
      wonBids: 17,
      lostBids: 8,
      averageBidValue: "$2.8M",
      totalValue: "$47.6M",
      aiRiskLevel: "High",
      aiInsight: "Strong technical capabilities and competitive pricing",
      strengths: ["Technical Excellence", "Innovation", "Local Presence"],
      weaknesses: ["Limited Scale", "Higher Costs"],
      marketShare: 28,
      trend: "increasing",
      lastWin: "2024-01-15",
      keyWins: ["Smart City Project", "Healthcare IT", "Infrastructure Tech"],
      keyLosses: ["Energy Project", "Education Contract"]
    },
    {
      id: 2,
      competitorName: "Global Infrastructure Ltd",
      winRate: 72,
      totalBids: 18,
      wonBids: 13,
      lostBids: 5,
      averageBidValue: "$4.2M",
      totalValue: "$54.6M",
      aiRiskLevel: "High",
      aiInsight: "Dominant in large infrastructure projects",
      strengths: ["Scale", "Experience", "Financial Strength"],
      weaknesses: ["Slow Innovation", "High Overhead"],
      marketShare: 32,
      trend: "stable",
      lastWin: "2024-01-20",
      keyWins: ["Highway Development", "Power Plant", "Airport Expansion"],
      keyLosses: ["Smart City", "Healthcare Facility"]
    },
    {
      id: 3,
      competitorName: "GreenEnergy Corp",
      winRate: 55,
      totalBids: 12,
      wonBids: 7,
      lostBids: 5,
      averageBidValue: "$3.5M",
      totalValue: "$24.5M",
      aiRiskLevel: "Medium",
      aiInsight: "Specialized in renewable energy but limited diversification",
      strengths: ["Renewable Expertise", "Sustainability", "Cost Efficiency"],
      weaknesses: ["Limited Scope", "Smaller Scale"],
      marketShare: 18,
      trend: "increasing",
      lastWin: "2024-01-10",
      keyWins: ["Solar Farm", "Wind Energy", "Green Building"],
      keyLosses: ["Traditional Infrastructure", "Healthcare", "Education"]
    },
    {
      id: 4,
      competitorName: "Digital Solutions Inc",
      winRate: 62,
      totalBids: 20,
      wonBids: 12,
      lostBids: 8,
      averageBidValue: "$1.8M",
      totalValue: "$21.6M",
      aiRiskLevel: "Medium",
      aiInsight: "Strong in digital transformation but weak in traditional sectors",
      strengths: ["Digital Innovation", "Agility", "Cost Efficiency"],
      weaknesses: ["Limited Experience", "Smaller Scale"],
      marketShare: 15,
      trend: "increasing",
      lastWin: "2024-01-18",
      keyWins: ["Digital Platform", "Cloud Migration", "Data Analytics"],
      keyLosses: ["Physical Infrastructure", "Manufacturing", "Healthcare"]
    },
    {
      id: 5,
      competitorName: "MegaCorp Industries",
      winRate: 75,
      totalBids: 16,
      wonBids: 12,
      lostBids: 4,
      averageBidValue: "$5.2M",
      totalValue: "$62.4M",
      aiRiskLevel: "High",
      aiInsight: "Dominant in large-scale industrial projects",
      strengths: ["Scale", "Financial Strength", "Global Reach"],
      weaknesses: ["Slow Innovation", "High Overhead", "Bureaucracy"],
      marketShare: 35,
      trend: "stable",
      lastWin: "2024-01-22",
      keyWins: ["Industrial Complex", "Manufacturing Plant", "Logistics Hub"],
      keyLosses: ["Smart City", "Digital Platform", "Green Energy"]
    },
    {
      id: 6,
      competitorName: "StartupX Solutions",
      winRate: 45,
      totalBids: 8,
      wonBids: 4,
      lostBids: 4,
      averageBidValue: "$0.8M",
      totalValue: "$3.2M",
      aiRiskLevel: "Low",
      aiInsight: "Innovative but limited resources and experience",
      strengths: ["Innovation", "Agility", "Cost Efficiency"],
      weaknesses: ["Limited Resources", "Small Scale", "Limited Experience"],
      marketShare: 8,
      trend: "increasing",
      lastWin: "2024-01-12",
      keyWins: ["Mobile App", "AI Platform", "IoT Solution"],
      keyLosses: ["Large Infrastructure", "Enterprise System", "Manufacturing"]
    },
    {
      id: 5,
      competitorName: "EduTech Solutions",
      winRate: 38,
      totalBids: 8,
      wonBids: 3,
      lostBids: 5,
      averageBidValue: "$1.2M",
      totalValue: "$3.6M",
      aiRiskLevel: "Low",
      aiInsight: "Niche player with limited market presence",
      strengths: ["Education Focus", "Innovation", "Agility"],
      weaknesses: ["Small Scale", "Limited Resources"],
      marketShare: 8,
      trend: "stable",
      lastWin: "2023-12-20",
      keyWins: ["E-Learning Platform", "School Management", "Training Program"],
      keyLosses: ["Infrastructure", "Healthcare", "Energy"]
    }
  ]

  const aiInsights = [
    {
      type: "Competitive Threat",
      message: "AI identified TechCorp and Global Infrastructure as primary threats",
      severity: "warning",
      action: "Develop counter-strategies"
    },
    {
      type: "Market Opportunity",
      message: "AI suggests focusing on healthcare and education sectors",
      severity: "info",
      action: "Expand sector coverage"
    },
    {
      type: "Pricing Strategy",
      message: "AI recommends competitive pricing for infrastructure projects",
      severity: "success",
      action: "Review pricing models"
    }
  ]

  const winLossPatterns = [
    {
      pattern: "Technical Excellence",
      frequency: "85% of wins",
      description: "Strong technical proposals lead to higher win rates",
      recommendation: "Invest in technical team capabilities"
    },
    {
      pattern: "Competitive Pricing",
      frequency: "72% of wins",
      description: "Price competitiveness is crucial for success",
      recommendation: "Optimize cost structures"
    },
    {
      pattern: "Local Presence",
      frequency: "68% of wins",
      description: "Local partnerships improve win probability",
      recommendation: "Strengthen local partnerships"
    },
    {
      pattern: "Past Performance",
      frequency: "61% of wins",
      description: "Strong track record influences client decisions",
      recommendation: "Highlight successful project outcomes"
    }
  ]

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp size={16} className="text-success" />
      case 'decreasing': return <TrendingDown size={16} className="text-danger" />
      default: return <Activity size={16} className="text-info" />
    }
  }

  const getRiskBadge = (riskLevel) => {
    const variants = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'success'
    }
    return <Badge bg={variants[riskLevel] || 'secondary'}>{riskLevel} Risk</Badge>
  }

  const getTrendBadge = (trend) => {
    const variants = {
      'increasing': 'success',
      'decreasing': 'danger',
      'stable': 'info'
    }
    return <Badge bg={variants[trend] || 'secondary'}>{trend}</Badge>
  }

  const filteredData = competitorData.filter(item => {
    const matchesSearch = item.competitorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCompetitor === 'all' || item.competitorName === filterCompetitor
    return matchesSearch && matchesFilter
  })

  const handleViewDetails = (competitor) => {
    setSelectedCompetitor(competitor)
  }

  const handleViewCompetitor = (competitor) => {
    handleViewDetails(competitor)
  }

  const handleEditCompetitor = (competitor) => {
    console.log('Edit competitor:', competitor)
    // Navigate to edit competitor or open edit modal
  }

  const handleDeleteCompetitor = (competitor) => {
    if (window.confirm(`Are you sure you want to delete competitor "${competitor.competitorName}"?`)) {
      // Remove competitor from data
      console.log('Delete competitor:', competitor)
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'competitorName',
      label: 'Competitor Details',
      width: '25%',
      render: (value, row) => (
        <div className="competitor-info">
          <div className="fw-semibold d-flex align-items-center">
            <Building size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">Market Share: {row.marketShare}%</small>
          <div className="competitor-meta">
            <small className="text-muted">Trend: {row.trend}</small>
          </div>
        </div>
      )
    },
    {
      key: 'winRate',
      label: 'Win Rate',
      width: '10%',
      render: (value) => (
        <div className="win-rate">
          <div className="fw-bold text-success">{value}%</div>
          <small className="text-muted">Success</small>
        </div>
      )
    },
    {
      key: 'totalBids',
      label: 'Total Bids',
      width: '10%',
      render: (value, row) => (
        <div className="bids-info">
          <div className="fw-bold text-primary">{value}</div>
          <small className="text-muted">
            {row.wonBids} won, {row.lostBids} lost
          </small>
        </div>
      )
    },
    {
      key: 'averageBidValue',
      label: 'Avg Bid Value',
      width: '12%',
      render: (value) => (
        <div className="bid-value">
          <div className="fw-bold text-primary">{value}</div>
        </div>
      )
    },
    {
      key: 'totalValue',
      label: 'Total Value',
      width: '12%',
      render: (value) => (
        <div className="total-value">
          <div className="fw-bold text-primary">{value}</div>
        </div>
      )
    },
    {
      key: 'aiRiskLevel',
      label: 'AI Risk Level',
      width: '10%',
      render: (value) => {
        const variants = {
          'High': 'danger',
          'Medium': 'warning',
          'Low': 'success'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'marketShare',
      label: 'Market Share',
      width: '10%',
      render: (value) => (
        <div className="market-share">
          <div className="fw-bold text-primary">{value}%</div>
        </div>
      )
    },
    {
      key: 'lastWin',
      label: 'Last Win',
      width: '11%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    }
  ]

  const competitorSummary = useMemo(() => {
    const n = competitorData.length
    const avgWin = n ? Math.round(competitorData.reduce((s, c) => s + c.winRate, 0) / n) : 0
    const totalBids = competitorData.reduce((s, c) => s + c.totalBids, 0)
    return { tracked: n, avgWinRate: avgWin, totalBids }
  }, [])

  const insightItems = useMemo(() => {
    const items = aiInsights.map((insight) => ({
      title: insight.type,
      detail: insight.message,
      tone: insight.severity === 'success' ? 'success' : insight.severity === 'warning' ? 'warning' : 'info'
    }))
    items.unshift({
      title: `${competitorSummary.tracked} competitors in intelligence registry`,
      detail: `${competitorSummary.totalBids} cumulative bids analyzed — portfolio average win rate about ${competitorSummary.avgWinRate}%.`,
      tone: 'info'
    })
    return items.slice(0, 3)
  }, [competitorSummary])

  return (
    <>
      <ExecutiveCommandCenter
        className="win-loss-analysis-competitor-page"
        breadcrumbs={[
          { label: 'Tender Intelligence', onClick: () => navigate('/tender-intelligence') },
          { label: 'Win/Loss by Competitor', active: true }
        ]}
        onBack={() => navigate('/tender-intelligence')}
        backLabel="Back to Tender Intelligence"
        title="Win/loss analysis by competitor"
        description="Analyze win/loss patterns and performance against specific competitors with detailed insights and strategic recommendations."
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
        outlookTitle="Competitor intelligence outlook"
        outlookDescription={`${competitorSummary.tracked} competitors tracked with ${competitorSummary.totalBids} bids in the composite analysis set.`}
        outlookChips={[
          `${competitorSummary.tracked} tracked`,
          `${competitorSummary.avgWinRate}% avg win rate`,
          `${competitorSummary.totalBids} bids`,
          'Strategic watchlist'
        ]}
        insights={insightItems}
        kpiTitle="Competitor signal board"
        kpiMeta="Field coverage and performance"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard label="Tracked competitors" value={competitorSummary.tracked} hint="Active intelligence profiles" tone="intel" trend="Registry" icon={<Target size={20} />} />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard label="Average win rate" value={competitorSummary.avgWinRate} hint="Across competitor set" tone="success" trend="Benchmark" suffix="%" icon={<CheckCircle size={20} />} />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard label="Bids analyzed" value={competitorSummary.totalBids} hint="Cumulative bid volume" tone="warning" trend="Activity" icon={<AlertTriangle size={20} />} />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard label="Total market value" value={0} displayValue="$142.9M" hint="Representative TAM snapshot" tone="intel" trend="Value" icon={<Zap size={20} />} />
            </Col>
          </Row>
        )}
        tableTitle="Competitive analysis workspace"
      >

        {/* What to Expect Section */}
        <Row className="mb-4">
          <Col>
            <Card className="expectations-card">
              <Card.Body>
                <div className="expectations-header">
                  <div className="expectations-icon">
                    <Settings size={20} />
                  </div>
                  <h5 className="expectations-title">What to Expect</h5>
                </div>
                <Row>
                  <Col md={6}>
                    <ul className="expectations-list">
                      <li>Analyze win/loss patterns against specific competitors</li>
                      <li>Track competitive performance metrics and trends</li>
                      <li>Identify winning strategies and losing factors</li>
                      <li>Generate competitor-specific win/loss reports</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <ul className="expectations-list">
                      <li>Monitor competitive bid success rates</li>
                      <li>Analyze pricing strategies of successful competitors</li>
                      <li>Track market share changes over time</li>
                      <li>Generate strategic recommendations based on analysis</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
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
                  <Tab eventKey="overview" title="Competitor Overview">
                    <div className="p-4">
                      <DataTable
                        data={filteredData}
                        columns={columns}
                        title="Competitor Win/Loss Analysis"
                        searchable={true}
                        sortable={true}
                        exportable={true}
                        pagination={true}
                        pageSize={10}
                        showActions={true}
                        showCheckboxes={false}
                        onView={handleViewCompetitor}
                        onEdit={handleEditCompetitor}
                        onDelete={handleDeleteCompetitor}
                        customActions={[
                          {
                            type: 'custom',
                            label: 'AI Analysis',
                            onClick: (row) => {
                              console.log('AI Analysis:', row);
                              // Add AI analysis logic here
                            }
                          }
                        ]}
                        searchPlaceholder="Search competitors..."
                        emptyMessage="No competitors found"
                        loading={false}
                      />
                    </div>
                  </Tab>
                  
                  <Tab eventKey="patterns" title="Win/Loss Patterns">
                    <div className="p-4">
                      <Row>
                        {winLossPatterns.map((pattern, index) => (
                          <Col md={6} key={index} className="mb-3">
                            <Card className="pattern-card">
                              <Card.Body>
                                <div className="pattern-header">
                                  <div className="pattern-icon">
                                    <Settings size={20} />
                                  </div>
                                  <div className="pattern-info">
                                    <h6 className="pattern-title">{pattern.pattern}</h6>
                                    <span className="pattern-frequency">{pattern.frequency}</span>
                                  </div>
                                </div>
                                <p className="pattern-description">{pattern.description}</p>
                                <div className="pattern-recommendation">
                                  <strong>Recommendation:</strong> {pattern.recommendation}
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
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
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </ExecutiveCommandCenter>

        <Modal show={selectedCompetitor !== null} onHide={() => setSelectedCompetitor(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Target size={20} className="me-2" />
              Competitor Analysis - {selectedCompetitor?.competitorName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCompetitor && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Win Rate:</strong> {selectedCompetitor.winRate}%
                  </Col>
                  <Col md={6}>
                    <strong>Market Share:</strong> {selectedCompetitor.marketShare}%
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Total Bids:</strong> {selectedCompetitor.totalBids}
                  </Col>
                  <Col md={6}>
                    <strong>Total Value:</strong> {selectedCompetitor.totalValue}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Trend:</strong> {getTrendBadge(selectedCompetitor.trend)}
                  </Col>
                  <Col md={6}>
                    <strong>AI Risk Level:</strong> {getRiskBadge(selectedCompetitor.aiRiskLevel)}
                  </Col>
                </Row>
                
                <hr />
                
                <div className="ai-insight">
                  <h6>
                    <Brain size={16} className="me-2" />
                    AI Insight
                  </h6>
                  <Alert variant="info">
                    {selectedCompetitor.aiInsight}
                  </Alert>
                </div>

                <Row>
                  <Col md={6}>
                    <div className="strengths">
                      <h6>
                        <CheckCircle size={16} className="me-2" />
                        Strengths
                      </h6>
                      <ul>
                        {selectedCompetitor.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="weaknesses">
                      <h6>
                        <XCircle size={16} className="me-2" />
                        Weaknesses
                      </h6>
                      <ul>
                        {selectedCompetitor.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedCompetitor(null)}>
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

export default WinLossAnalysisByCompetitor