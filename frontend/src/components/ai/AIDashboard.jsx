import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Alert, ProgressBar, Table } from 'react-bootstrap'
import {
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Star,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../intelligence/PremiumKpiCard'
import aiService from '../../services/aiService'
import { showToast } from '../../utils/toast'
import './AIDashboard.scss'

const AIDashboard = ({ onBack }) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentAnalyses, setRecentAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAIData()
  }, [])

  const loadAIData = async () => {
    setLoading(true)
    setError(null)

    try {
      const statsResponse = await aiService.getAnalysisStats()

      if (statsResponse.success) {
        setStats(statsResponse.data.statistics || null)
        setRecentAnalyses(statsResponse.data.recentAnalyses || [])
      } else {
        setError(statsResponse.message || 'Failed to load AI analytics data')
        showToast.error('Failed to load AI analytics')
      }
    } catch (err) {
      console.error('Error loading AI data:', err)
      const message =
        err.response?.data?.message || err.message || 'Failed to load AI analytics data'
      setError(message)
      showToast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRiskLevelColor = (score) => {
    if (score >= 8) return 'danger'
    if (score >= 6) return 'warning'
    if (score >= 4) return 'info'
    return 'success'
  }

  const getRiskLevelText = (score) => {
    if (score >= 8) return 'Very high'
    if (score >= 6) return 'High'
    if (score >= 4) return 'Medium'
    return 'Low'
  }

  const successRate = useMemo(() => {
    if (!stats?.totalAnalyses) return 0
    return Math.round((stats.completedAnalyses / stats.totalAnalyses) * 100)
  }, [stats])

  const insightItems = useMemo(() => {
    if (!stats) return []
    const items = []
    if (stats.totalAnalyses > 0) {
      items.push({
        title: 'Analysis pipeline insight',
        detail: `${stats.completedAnalyses} of ${stats.totalAnalyses} runs completed (${successRate}% success). Average confidence ${stats.avgConfidenceScore ? Math.round(stats.avgConfidenceScore * 100) : 0}%.`,
        tone: successRate >= 70 ? 'success' : 'info'
      })
    } else {
      items.push({
        title: 'No analyses yet',
        detail: 'Run AI analysis on a document from the corpus list to populate this dashboard.',
        tone: 'warning'
      })
    }
    if (stats.avgRiskScore >= 6) {
      items.push({
        title: 'Elevated risk detected',
        detail: `Average risk score is ${stats.avgRiskScore?.toFixed(1)}/10 — review high-risk findings before submission.`,
        tone: 'warning'
      })
    }
    return items.slice(0, 2)
  }, [stats, successRate])

  const outlookChips = useMemo(() => {
    if (!stats) return []
    return [
      `${stats.totalAnalyses || 0} total runs`,
      `${stats.completedAnalyses || 0} completed`,
      `${stats.avgConfidenceScore ? Math.round(stats.avgConfidenceScore * 100) : 0}% confidence`,
      `${stats.avgRiskScore?.toFixed(1) || 0}/10 risk`
    ]
  }, [stats])

  const handleBack = onBack || (() => navigate('/document-management'))

  if (loading && !stats) {
    return (
      <ExecutiveCommandCenter
        className="ai-analytics-hub"
        showSkeleton
        title="AI analytics"
        onBack={handleBack}
        backLabel="Back to documents"
      />
    )
  }

  if (error && !stats) {
    return (
      <ExecutiveCommandCenter
        className="ai-analytics-hub"
        title="AI analytics"
        description="Insights from AI-powered document analysis."
        onBack={handleBack}
        backLabel="Back to documents"
      >
        <Alert variant="danger" className="ai-analytics-hub__alert">
          <AlertTriangle size={18} className="me-2" />
          {error}
          <Button variant="outline-danger" size="sm" className="ms-3" onClick={loadAIData}>
            <RefreshCw size={14} className="me-2" />
            Retry
          </Button>
        </Alert>
      </ExecutiveCommandCenter>
    )
  }

  return (
    <ExecutiveCommandCenter
      className="ai-analytics-hub"
      breadcrumbs={[
        { label: 'Document management', onClick: () => navigate('/document-management') },
        { label: 'AI analysis', onClick: handleBack },
        { label: 'Analytics', active: true }
      ]}
      onBack={handleBack}
      backLabel="Back to documents"
      title="AI analytics dashboard"
      description="Track analysis runs, model confidence, risk posture, and recent document intelligence outcomes."
      heroMeta="Model-assisted review"
      heroActions={(
        <Button variant="outline-primary" size="sm" onClick={loadAIData} disabled={loading}>
          <RefreshCw size={16} className="me-2" />
          {loading ? 'Refreshing…' : 'Refresh'}
        </Button>
      )}
      outlookTitle="Analysis outlook"
      outlookDescription={
        stats
          ? `${stats.totalAnalyses} analysis run(s) — ${stats.completedAnalyses} completed with ${successRate}% success rate.`
          : 'Loading analysis metrics…'
      }
      outlookChips={outlookChips}
      insights={insightItems}
      kpiTitle="Analysis signal board"
      kpiMeta="Volume, quality & risk"
      kpiContent={(
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Total analyses"
              value={stats?.totalAnalyses || 0}
              hint="All pipeline runs"
              tone="intel"
              trend="Volume"
              icon={<BarChart3 size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Completed"
              value={stats?.completedAnalyses || 0}
              hint="Successful runs"
              tone="success"
              trend={`${successRate}% rate`}
              icon={<CheckCircle size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Avg confidence"
              value={stats?.avgConfidenceScore ? Math.round(stats.avgConfidenceScore * 100) : 0}
              hint="Model certainty"
              tone="intel"
              trend="Quality"
              suffix="%"
              icon={<Star size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Avg risk score"
              value={stats?.avgRiskScore ? Math.round(stats.avgRiskScore * 10) / 10 : 0}
              hint={getRiskLevelText(stats?.avgRiskScore || 0)}
              tone={
                (stats?.avgRiskScore || 0) >= 6 ? 'risk' : (stats?.avgRiskScore || 0) >= 4 ? 'warning' : 'success'
              }
              trend="Exposure"
              suffix="/10"
              icon={<AlertTriangle size={20} />}
            />
          </Col>
        </Row>
      )}
      tableTitle={`Recent analyses (${recentAnalyses.length})`}
      tableActions={
        <Badge bg="primary" className="fw-normal">
          <Sparkles size={12} className="me-1" />
          AI powered
        </Badge>
      }
    >
      <Row className="g-3 mb-4">
        <Col lg={6}>
          <div className="ai-analytics-panel">
            <div className="ai-analytics-panel__head">
              <TrendingUp size={18} />
              <span>Analysis performance</span>
            </div>
            <div className="ai-analytics-panel__body">
              <div className="ai-analytics-meter">
                <div className="ai-analytics-meter__label">
                  <span>Success rate</span>
                  <strong>{successRate}%</strong>
                </div>
                <ProgressBar now={successRate} variant="success" className="ai-analytics-meter__bar" />
              </div>
              <div className="ai-analytics-meter">
                <div className="ai-analytics-meter__label">
                  <span>Avg processing time</span>
                  <strong>
                    {stats?.avgProcessingTime
                      ? `${Math.round(stats.avgProcessingTime / 1000)}s`
                      : 'N/A'}
                  </strong>
                </div>
                <ProgressBar
                  now={
                    stats?.avgProcessingTime
                      ? Math.min((stats.avgProcessingTime / 30000) * 100, 100)
                      : 0
                  }
                  variant="info"
                  className="ai-analytics-meter__bar"
                />
              </div>
              <div className="ai-analytics-meter mb-0">
                <div className="ai-analytics-meter__label">
                  <span>Confidence score</span>
                  <strong>
                    {stats?.avgConfidenceScore
                      ? `${Math.round(stats.avgConfidenceScore * 100)}%`
                      : 'N/A'}
                  </strong>
                </div>
                <ProgressBar
                  now={stats?.avgConfidenceScore ? stats.avgConfidenceScore * 100 : 0}
                  variant="primary"
                  className="ai-analytics-meter__bar"
                />
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="ai-analytics-panel">
            <div className="ai-analytics-panel__head">
              <AlertTriangle size={18} />
              <span>Risk distribution</span>
            </div>
            <div className="ai-analytics-panel__body ai-analytics-panel__body--center">
              <div className={`ai-analytics-risk-badge text-${getRiskLevelColor(stats?.avgRiskScore || 0)}`}>
                {getRiskLevelText(stats?.avgRiskScore || 0)}
              </div>
              <p className="text-muted small mb-3">Average risk level</p>
              <div className="ai-analytics-meter w-100">
                <div className="ai-analytics-meter__label">
                  <span>Risk score</span>
                  <strong>{stats?.avgRiskScore?.toFixed(1) || 0}/10</strong>
                </div>
                <ProgressBar
                  now={stats?.avgRiskScore ? stats.avgRiskScore * 10 : 0}
                  variant={getRiskLevelColor(stats?.avgRiskScore || 0)}
                  className="ai-analytics-meter__bar"
                />
              </div>
              <small className="text-muted mt-3 d-block">
                Based on {stats?.totalAnalyses || 0} document {stats?.totalAnalyses === 1 ? 'analysis' : 'analyses'}
              </small>
            </div>
          </div>
        </Col>
      </Row>

      {recentAnalyses.length > 0 ? (
        <div className="ai-analytics-table-wrap">
          <Table responsive hover className="mb-0 ai-analytics-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Status</th>
                <th>Requirements</th>
                <th>Risks</th>
                <th>Confidence</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentAnalyses.map((analysis) => (
                <tr key={analysis.id || analysis._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="ai-analytics-doc-icon">
                        <FileText size={16} />
                      </span>
                      <div>
                        <div className="fw-semibold">
                          {analysis.documentId?.name ||
                            analysis.documentId?.originalName ||
                            'Unknown document'}
                        </div>
                        <small className="text-muted text-capitalize">
                          {analysis.analysisType || 'full'} analysis
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge
                      bg={
                        analysis.status === 'completed'
                          ? 'success'
                          : analysis.status === 'failed'
                            ? 'danger'
                            : 'warning'
                      }
                      className="text-capitalize"
                    >
                      {analysis.status}
                    </Badge>
                  </td>
                  <td className="fw-semibold">{analysis.totalRequirements || 0}</td>
                  <td>
                    <span className="fw-semibold me-2">{analysis.totalRisks || 0}</span>
                    {analysis.risks?.overall_risk_score != null && (
                      <Badge bg={getRiskLevelColor(analysis.risks.overall_risk_score)} className="small">
                        {analysis.risks.overall_risk_score}/10
                      </Badge>
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="small fw-semibold">
                        {Math.round((analysis.confidenceScore || 0) * 100)}%
                      </span>
                      <div className="ai-analytics-confidence">
                        <div
                          className="ai-analytics-confidence__fill"
                          style={{ width: `${(analysis.confidenceScore || 0) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <small className="text-muted">
                      {formatDate(analysis.createdAt || analysis.analyzedAt)}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="ai-analytics-empty">
          <Brain size={44} strokeWidth={1.25} />
          <h5>No analyses yet</h5>
          <p>Run AI analysis on a document to see requirements, risks, and confidence scores here.</p>
          <Button variant="primary" size="sm" onClick={handleBack}>
            <FileText size={16} className="me-2" />
            Go to documents
          </Button>
        </div>
      )}
    </ExecutiveCommandCenter>
  )
}

export default AIDashboard
