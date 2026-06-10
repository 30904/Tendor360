import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, TrendingUp, Brain, Target, DollarSign, FileText, BarChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TableActionsCell from '../../components/TableActionsCell'
import { buildTableActions, runTableAction } from '../../utils/tableActions'
import './PriceToWin.scss'

const PriceToWin = () => {
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setAnalyses([
      {
        id: 1,
        name: 'Highway Infrastructure PTW Analysis',
        description: 'AI-powered price-to-win analysis for highway construction project',
        tenderId: 'TEN-2024-001',
        client: 'Ministry of Transport',
        currentPrice: 2500000,
        recommendedPrice: 2350000,
        winProbability: 78,
        confidence: 92,
        status: 'Active',
        createdBy: 'John Doe',
        createdDate: '2024-01-20',
        lastUpdated: '2024-01-21',
        factors: ['Competitor pricing', 'Market conditions', 'Historical data'],
        aiInsights: 'Price reduction of 6% recommended to increase win probability by 15%'
      },
      {
        id: 2,
        name: 'Smart City Technology PTW',
        description: 'Technology implementation price-to-win analysis',
        tenderId: 'TEN-2024-002',
        client: 'City Development Authority',
        currentPrice: 1800000,
        recommendedPrice: 1750000,
        winProbability: 85,
        confidence: 88,
        status: 'Completed',
        createdBy: 'Jane Smith',
        createdDate: '2024-01-19',
        lastUpdated: '2024-01-20',
        factors: ['Technology trends', 'Competitor analysis', 'Client budget'],
        aiInsights: 'Current pricing is competitive, minor optimization suggested'
      },
      {
        id: 3,
        name: 'Healthcare Facility PTW Analysis',
        description: 'Construction project price-to-win analysis',
        tenderId: 'TEN-2024-003',
        client: 'Health Ministry',
        currentPrice: 3200000,
        recommendedPrice: 2950000,
        winProbability: 65,
        confidence: 85,
        status: 'Draft',
        createdBy: 'Mike Johnson',
        createdDate: '2024-01-18',
        lastUpdated: '2024-01-19',
        factors: ['Market volatility', 'Regulatory changes', 'Competitor positioning'],
        aiInsights: 'Significant price adjustment needed to improve win probability'
      }
    ])

    setStats({
      totalAnalyses: 3,
      active: 1,
      completed: 1,
      draft: 1,
      avgWinProbability: 76,
      avgConfidence: 88,
      totalSavings: 450000
    })
  }, [])

  const handleViewAnalysis = (analysis) => {
    setSelectedAnalysis(analysis)
    setShowModal(true)
  }

  const handleDeleteAnalysis = (analysis) => {
    if (window.confirm(`Are you sure you want to delete analysis "${analysis.name}"?`)) {
      setAnalyses(prev => prev.filter(a => a.id !== analysis.id))
    }
  }

  const getAnalysisActions = () =>
    buildTableActions({
      onView: true,
      onDelete: true,
      custom: [{ type: 'custom', key: 'optimize', label: 'Apply recommendation', icon: 'play' }]
    })

  const handleAnalysisAction = (action, analysis) => {
    runTableAction(action, analysis, {
      onView: handleViewAnalysis,
      onDelete: handleDeleteAnalysis,
      optimize: () => handleViewAnalysis(analysis)
    })
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'primary',
      'Completed': 'success',
      'Draft': 'warning',
      'Archived': 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getWinProbabilityColor = (probability) => {
    if (probability >= 80) return 'success'
    if (probability >= 60) return 'primary'
    if (probability >= 40) return 'warning'
    return 'danger'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const insightItems = useMemo(() => [
    {
      title: 'AI price-to-win insight',
      detail: `Your price-to-win analyses show an average win probability of ${stats.avgWinProbability}% with ${stats.avgConfidence}% AI confidence. Consider implementing recommended pricing adjustments to improve win rates.`,
      tone: 'info'
    }
  ], [stats.avgWinProbability, stats.avgConfidence])

  return (
    <>
      <ExecutiveCommandCenter
        className="price-to-win-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Price-to-Win', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Price-to-Win"
        description="AI-powered pricing optimization to maximize win probability and profitability"
        heroMeta="Win-room"
        outlookTitle="Win outlook"
        outlookDescription={`${stats.totalAnalyses || 0} analyses — ${stats.avgWinProbability || 0}% avg win probability, ${stats.avgConfidence || 0}% AI confidence.`}
        outlookChips={[
          `${stats.totalAnalyses || 0} analyses`,
          `${stats.avgWinProbability || 0}% avg win prob`,
          `${stats.avgConfidence || 0}% confidence`,
          formatCurrency(stats.totalSavings || 0) + ' savings'
        ]}
        insights={insightItems}
        kpiTitle="Win signal board"
        kpiMeta="Probability vs savings"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total analyses"
                value={stats.totalAnalyses || 0}
                hint="Active models"
                tone="intel"
                trend="Coverage"
                icon={<Target size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg win probability"
                value={stats.avgWinProbability || 0}
                hint="Expected capture"
                tone={(stats.avgWinProbability || 0) >= 70 ? 'success' : 'warning'}
                trend="Momentum"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg AI confidence"
                value={stats.avgConfidence || 0}
                hint="Model strength"
                tone="intel"
                trend="Quality"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Potential savings"
                displayValue={formatCurrency(stats.totalSavings || 0)}
                hint="Vs. current stack"
                tone="success"
                trend="Upside"
                icon={<DollarSign size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Price-to-win analyses (${analyses.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              New Analysis
            </Button>
            <Button variant="outline-secondary">
              <BarChart size={16} className="me-2" />
              Analytics
            </Button>
          </>
        )}
      >
        <Row className="mb-4">
          <Col md={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search analyses..."
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
                        <th>Analysis Details</th>
                        <th>Client</th>
                        <th>Current Price</th>
                        <th>Recommended Price</th>
                        <th>Win Probability</th>
                        <th>AI Confidence</th>
                        <th>Status</th>
                        <th className="table-actions-col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyses.filter(analysis => 
                        !searchTerm || 
                        analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        analysis.client.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((analysis) => (
                        <tr key={analysis.id}>
                          <td>
                            <div className="analysis-info">
                              <h6 className="mb-1">{analysis.name}</h6>
                              <p className="text-muted mb-1">{analysis.description}</p>
                              <small className="text-muted">
                                {analysis.tenderId} • Created by {analysis.createdBy} • Updated: {analysis.lastUpdated}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="client-info">
                              <FileText size={16} className="me-1" />
                              {analysis.client}
                            </div>
                          </td>
                          <td>
                            <div className="price-info">
                              <strong>{formatCurrency(analysis.currentPrice)}</strong>
                            </div>
                          </td>
                          <td>
                            <div className="recommended-price">
                              <strong className="text-success">{formatCurrency(analysis.recommendedPrice)}</strong>
                              <small className="text-muted d-block">
                                {analysis.currentPrice > analysis.recommendedPrice ? '↓' : '↑'} 
                                {Math.abs(((analysis.recommendedPrice - analysis.currentPrice) / analysis.currentPrice) * 100).toFixed(1)}%
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="win-probability">
                              <Badge bg={getWinProbabilityColor(analysis.winProbability)}>
                                {analysis.winProbability}%
                              </Badge>
                            </div>
                          </td>
                          <td>
                            <div className="ai-confidence">
                              <div className="d-flex align-items-center">
                                <Brain size={16} className="me-1 text-primary" />
                                <span>{analysis.confidence}%</span>
                              </div>
                            </div>
                          </td>
                          <td>{getStatusBadge(analysis.status)}</td>
                          <td className="table-actions-col">
                            <TableActionsCell
                              actions={getAnalysisActions()}
                              onAction={(action) => handleAnalysisAction(action, analysis)}
                            />
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
              <TrendingUp size={20} className="me-2" />
              Price-to-Win Analysis - {selectedAnalysis?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAnalysis && (
              <div className="analysis-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Tender ID:</strong> {selectedAnalysis.tenderId}</p>
                    <p><strong>Client:</strong> {selectedAnalysis.client}</p>
                    <p><strong>Created By:</strong> {selectedAnalysis.createdBy}</p>
                    <p><strong>Last Updated:</strong> {selectedAnalysis.lastUpdated}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Pricing Analysis</h6>
                    <p><strong>Current Price:</strong> {formatCurrency(selectedAnalysis.currentPrice)}</p>
                    <p><strong>Recommended Price:</strong> {formatCurrency(selectedAnalysis.recommendedPrice)}</p>
                    <p><strong>Win Probability:</strong> {selectedAnalysis.winProbability}%</p>
                    <p><strong>AI Confidence:</strong> {selectedAnalysis.confidence}%</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Analysis Factors</h6>
                    <div className="factors-list">
                      {selectedAnalysis.factors.map((factor, index) => (
                        <Badge key={index} bg="info" className="me-2 mb-2">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Insights</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      {selectedAnalysis.aiInsights}
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
              <Zap size={16} className="me-2" />
              Apply Recommendations
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default PriceToWin
