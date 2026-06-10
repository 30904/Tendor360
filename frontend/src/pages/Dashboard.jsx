import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Badge, Table, Button, Spinner, Alert, Pagination } from 'react-bootstrap'
import { BiRefresh } from 'react-icons/bi'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar
} from 'recharts'
import {
  fetchDashboardOverview,
  fetchDashboardStats,
  fetchRecentActivities,
  refreshDashboard
} from '../store/slices/dashboardSlice'
import { intelligenceAPI } from '../services/intelligenceAPI'
import PremiumKpiCard from '../components/intelligence/PremiumKpiCard'
import InsightStream from '../components/intelligence/InsightStream'
import './Dashboard.scss'

const TENDER_MOBILE_PAGE_SIZE = 5

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const parseValueMillions = (valueStr) => {
  if (valueStr == null || valueStr === '') return 0
  const n = parseFloat(String(valueStr).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatINRMillions = (millions) => {
  if (!millions || millions < 0.05) return '—'
  return `₹${millions.toFixed(1)}M`
}

const initialsFromName = (name) => {
  if (!name || typeof name !== 'string') return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
}

const MetricGlyph = ({ metricKey }) => {
  const glyphs = {
    active: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    winRatio: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4h8v3h3v3c0 4-3 7-7 8-4-1-7-4-7-8V7h3V4Z" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    deadlines: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    pipeline: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v18M6 9h12M8.5 5.5h7a1.5 1.5 0 0 1 0 3h-7a1.5 1.5 0 0 1 0-3ZM10 15.5h4a1.5 1.5 0 0 1 0 3h-4a1.5 1.5 0 0 1 0-3Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
      </svg>
    ),
    matchScore: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a7 7 0 1 0 7 7h-4a3 3 0 1 1-3-3V3Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  return glyphs[metricKey] || glyphs.active
}

const TrendIndicator = ({ direction, value }) => (
  <div className={`trend-chip ${direction === 'up' ? 'up' : 'down'}`}>
    <svg viewBox="0 0 14 14" aria-hidden="true">
      {direction === 'up' ? (
        <path d="M2 9.5 6.2 5.3 8.6 7.7 12 4.3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M2 4.3 6.2 8.5 8.6 6.1 12 9.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
    <span>{value}</span>
  </div>
)

const Sparkline = ({ values = [], tone = 'blue' }) => {
  const cleaned = values.length ? values : [3, 4, 5, 4, 6]
  const max = Math.max(...cleaned, 1)

  return (
    <div className={`sparkline sparkline-${tone}`}>
      {cleaned.map((point, index) => (
        <span key={`${point}-${index}`} style={{ height: `${(point / max) * 100}%` }} />
      ))}
    </div>
  )
}

const InsightGlyph = ({ type }) => {
  const icons = {
    target: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="4" fill="currentColor" />
      </svg>
    ),
    risk: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4 4 20h16L12 4Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <path d="M12 10v5M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    currency: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10h10M7 14h10M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 5 6v6c0 5 4 8 7 9 3-1 7-4 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      </svg>
    )
  }
  return icons[type] || icons.target
}

const OwnerAvatar = ({ name }) => (
  <div className="owner-avatar" title={name || ''}>
    <span>{initialsFromName(name || '')}</span>
  </div>
)

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)
  const [tenderMobilePage, setTenderMobilePage] = useState(1)
  const [intelDashboard, setIntelDashboard] = useState(null)
  const {
    kpiData,
    activeTenders,
    upcomingDeadlines,
    lastUpdated,
    statusCounts,
    valueByStatus,
    tendersByMonth,
    recentEvaluations,
    overviewLoading,
    statsLoading,
    activitiesLoading,
    overviewError,
    statsError,
    activitiesError,
    isRefreshing
  } = useSelector((state) => state.dashboard)

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      dispatch(fetchDashboardOverview())
      dispatch(fetchDashboardStats())
      dispatch(fetchRecentActivities())
      intelligenceAPI
        .getDashboard()
        .then((res) => setIntelDashboard(res.data?.data ?? null))
        .catch(() => setIntelDashboard(null))
    }
  }, [dispatch, refreshKey])

  useEffect(() => {
    if (!isAuthenticated && !accessToken) {
      window.location.href = '/login'
    }
  }, [isAuthenticated, accessToken])

  const activeTendersData = activeTenders || []
  const upcomingDeadlinesData = upcomingDeadlines || []

  const tenderMobileTotalPages = Math.max(
    1,
    Math.ceil(activeTendersData.length / TENDER_MOBILE_PAGE_SIZE)
  )

  const tenderMobilePaginated = useMemo(() => {
    const start = (tenderMobilePage - 1) * TENDER_MOBILE_PAGE_SIZE
    return activeTendersData.slice(start, start + TENDER_MOBILE_PAGE_SIZE)
  }, [activeTendersData, tenderMobilePage])

  useEffect(() => {
    setTenderMobilePage((p) => Math.min(Math.max(p, 1), tenderMobileTotalPages))
  }, [tenderMobileTotalPages, activeTendersData.length])

  const avgMatchScore = useMemo(() => {
    if (!activeTendersData.length) return 0
    const sum = activeTendersData.reduce((acc, t) => acc + (Number(t.matchScore) || 0), 0)
    return Math.round(sum / activeTendersData.length)
  }, [activeTendersData])

  const aiInsights = useMemo(() => {
    const high = activeTendersData.filter((t) => (Number(t.matchScore) || 0) >= 75)
    const highVal = high.reduce((s, t) => s + parseValueMillions(t.value), 0)
    const risk = activeTendersData.filter(
      (t) =>
        (Number(t.matchScore) || 0) < 45 ||
        (t.deadline && new Date(t.deadline) < new Date())
    )
    const riskVal = risk.reduce((s, t) => s + parseValueMillions(t.value), 0)
    const pipelineNeed = kpiData?.find((k) => k.title === 'Revenue Pipeline')
    const pipelineNum = pipelineNeed ? parseValueMillions(pipelineNeed.value) : 0
    const complianceCount = Array.isArray(recentEvaluations) ? recentEvaluations.length : 0
    return {
      highCount: high.length,
      highValue: formatINRMillions(highVal),
      riskCount: risk.length,
      riskValue: formatINRMillions(riskVal),
      pipelineValue: pipelineNum > 0 ? formatINRMillions(pipelineNum) : '—',
      complianceCount: Math.min(complianceCount, 99)
    }
  }, [activeTendersData, kpiData, recentEvaluations])

  const pipelineStages = useMemo(() => {
    const labelMap = {
      active: 'Active',
      overdue: 'Overdue',
      awarded: 'Awarded',
      closed: 'Closed',
      cancelled: 'Cancelled'
    }
    const colors = ['#2d4f8b', '#3d8b9e', '#5cb87a', '#e3b033', '#8b6bb8']
    const counts = Array.isArray(statusCounts) ? statusCounts : []
    const values = Array.isArray(valueByStatus) ? valueByStatus : []
    const valById = Object.fromEntries(values.map((v) => [v._id, v.totalValue || 0]))

    const rows = counts.map((s, i) => ({
      key: s._id,
      label: labelMap[s._id] || String(s._id || ''),
      count: s.count || 0,
      value: valById[s._id] != null ? valById[s._id] : 0,
      color: colors[i % colors.length]
    }))
    const total = rows.reduce((a, r) => a + r.count, 0) || 1
    return rows.map((r) => ({ ...r, pct: Math.round((r.count / total) * 100) }))
  }, [statusCounts, valueByStatus])

  const winRatioNumber = useMemo(() => {
    const wr = kpiData?.find((k) => k.title === 'Win Ratio')
    if (!wr?.value) return 32
    const n = parseFloat(String(wr.value).replace('%', ''))
    return Number.isFinite(n) ? n : 32
  }, [kpiData])

  const monthlyTrendData = useMemo(() => {
    const raw = Array.isArray(tendersByMonth) ? tendersByMonth : []
    const mapped = raw.map((item) => {
      const y = item._id?.year
      const m = item._id?.month
      const label =
        y != null && m != null ? `${MONTH_SHORT[Math.max(0, m - 1)]} ${y}` : '—'
      return { label, count: item.count || 0, month: m, year: y }
    })
    const avg =
      mapped.length > 0 ? mapped.reduce((a, x) => a + x.count, 0) / mapped.length : 0
    return { rows: mapped, avgCount: avg }
  }, [tendersByMonth])

  const trendChartRows = useMemo(() => {
    const wr = winRatioNumber
    return monthlyTrendData.rows.map((r) => ({ ...r, winRatio: wr }))
  }, [monthlyTrendData.rows, winRatioNumber])

  const aiAlerts = useMemo(() => {
    const list = []
    upcomingDeadlinesData.slice(0, 4).forEach((d, i) => {
      const urgent = d.isOverdue || (d.deadline && new Date(d.deadline) <= new Date(Date.now() + 3 * 86400000))
      list.push({
        id: `dl-${d.id || i}`,
        priority: urgent ? 'high' : 'medium',
        title: d.isOverdue ? 'Submission deadline passed' : 'Submission window closing',
        detail: d.name,
        meta: d.organization
      })
    })
    activeTendersData
      .filter((t) => (Number(t.matchScore) || 0) < 50)
      .slice(0, 2)
      .forEach((t, i) => {
        list.push({
          id: `ms-${t.id || i}`,
          priority: 'medium',
          title: 'Low AI match — review scope fit',
          detail: t.name,
          meta: `${t.matchScore}% match`
        })
      })
    if (Array.isArray(recentEvaluations) && recentEvaluations.length) {
      recentEvaluations.slice(0, 2).forEach((ev, i) => {
        const tid = ev.tenderId
        const title = typeof tid === 'object' && tid?.title ? tid.title : 'Evaluation update'
        list.push({
          id: `ev-${ev._id || i}`,
          priority: 'low',
          title: 'Evaluation activity',
          detail: title,
          meta: 'Compliance queue'
        })
      })
    }
    if (list.length === 0) {
      list.push({
        id: 'placeholder',
        priority: 'low',
        title: 'All clear',
        detail: 'No critical alerts for your portfolio right now.',
        meta: 'AI monitoring active'
      })
    }
    return list.slice(0, 6)
  }, [upcomingDeadlinesData, activeTendersData, recentEvaluations])

  const metricCards = useMemo(() => {
    const list = Array.isArray(kpiData) ? kpiData : []
    const fallback = [
      {
        title: 'Active Tenders',
        value: '18',
        subtitle: '6 added this week',
        trend: '+12.5%',
        trendDirection: 'up',
        chartData: [4, 6, 5, 7, 8],
        metricKey: 'active',
        tone: 'blue'
      },
      {
        title: 'Win Ratio',
        value: '34.6%',
        subtitle: 'Above last quarter',
        trend: '+4.1%',
        trendDirection: 'up',
        chartData: [3, 4, 4, 5, 6],
        metricKey: 'winRatio',
        tone: 'green'
      },
      {
        title: 'Upcoming Deadlines',
        value: '7',
        subtitle: 'Next 14 days',
        trend: '-2.3%',
        trendDirection: 'down',
        chartData: [6, 5, 4, 4, 3],
        metricKey: 'deadlines',
        tone: 'amber'
      },
      {
        title: 'Revenue Pipeline',
        value: '₹42.8M',
        subtitle: 'Potential value',
        trend: '+8.9%',
        trendDirection: 'up',
        chartData: [2, 3, 4, 5, 6],
        metricKey: 'pipeline',
        tone: 'cyan'
      }
    ]

    const base = !list.length
      ? fallback
      : list.map((item, index) => {
          const keyMap = {
            'Active Tenders': 'active',
            'Win Ratio': 'winRatio',
            'Upcoming Deadlines': 'deadlines',
            'Revenue Pipeline': 'pipeline'
          }
          const toneMap = {
            'Active Tenders': 'blue',
            'Win Ratio': 'green',
            'Upcoming Deadlines': 'amber',
            'Revenue Pipeline': 'cyan'
          }
          return {
            ...item,
            metricKey: keyMap[item.title] || fallback[index]?.metricKey || 'active',
            tone: toneMap[item.title] || fallback[index]?.tone || 'blue'
          }
        })

    const sparkFromAvg = () => {
      const v = avgMatchScore || 72
      return [v - 8, v - 4, v, v + 2, v].map((x) => Math.max(5, Math.min(100, x)))
    }

    const fifth = {
      title: 'Avg. Match Score',
      value: `${avgMatchScore || '—'}${avgMatchScore ? '%' : ''}`,
      subtitle: 'AI fit across active tenders',
      trend: avgMatchScore >= 70 ? '+vs target' : 'Review fit',
      trendDirection: avgMatchScore >= 70 ? 'up' : 'down',
      chartData: sparkFromAvg(),
      metricKey: 'matchScore',
      tone: 'purple'
    }

    return [...base, fifth]
  }, [kpiData, avgMatchScore])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    dispatch(refreshDashboard())
    intelligenceAPI
      .getDashboard()
      .then((res) => setIntelDashboard(res.data?.data ?? null))
      .catch(() => setIntelDashboard(null))
  }

  const getStatusBadge = (status) => {
    const key = String(status || '').toLowerCase()
    const variants = {
      active: 'success',
      overdue: 'danger',
      closed: 'secondary',
      awarded: 'primary',
      cancelled: 'dark',
      review: 'primary',
      pending: 'warning'
    }
    const bg = variants[key] || 'secondary'
    return <Badge bg={bg}>{status}</Badge>
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isOverdue = (dateString) => {
    const deadline = new Date(dateString)
    const today = new Date()
    return deadline < today
  }

  const kpiCount = Array.isArray(kpiData) ? kpiData.length : 0
  const showInitialLoader = overviewLoading && kpiCount === 0 && !isRefreshing
  const showAuthSpinner = !isAuthenticated && !accessToken
  const hasLegacyDashboardData = kpiCount > 0 || activeTendersData.length > 0
  const showError = Boolean(overviewError) && !intelDashboard && !hasLegacyDashboardData
  const partialLoadWarning = [overviewError, statsError, activitiesError].filter(Boolean).join(' ')

  const readinessPct = avgMatchScore || 0
  const readinessLabel =
    readinessPct >= 75 ? 'On track' : readinessPct >= 55 ? 'Needs attention' : 'At risk'

  let body = null
  if (showInitialLoader) {
    body = (
      <div className="page-bg-gradient d-flex justify-content-center align-items-center dashboard-state-full">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      </div>
    )
  } else if (showAuthSpinner) {
    body = (
      <div className="page-bg-gradient d-flex justify-content-center align-items-center dashboard-state-full">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Checking authentication...</p>
        </div>
      </div>
    )
  } else if (showError) {
    body = (
      <div className="page-bg-gradient">
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-header-title">
              <h1 className="page-title">
                <span className="title-icon">📊</span>
                Dashboard
              </h1>
            </div>
          </div>
        </div>
        <Alert variant="danger" className="m-4">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>{overviewError}</p>
          <Button variant="outline-danger" onClick={handleRefresh}>
            <BiRefresh className="me-2" />
            Try Again
          </Button>
        </Alert>
      </div>
    )
  } else {
    body = (
      <div className="dashboard-world-class page-bg-gradient">
        <div className="dashboard-hero">
          <div>
            <h1>
              Executive Dashboard
              {isRefreshing && <Spinner animation="border" size="sm" className="ms-2" />}
            </h1>
            <p>AI opportunity discovery, qualification readiness, and pursuit intelligence for your portfolio.</p>
          </div>
          <div className="hero-actions">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || overviewLoading}
            >
              {isRefreshing || overviewLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Refreshing
                </>
              ) : (
                'Refresh'
              )}
            </Button>
            <small>Updated {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'just now'}</small>
          </div>
        </div>

        {partialLoadWarning ? (
          <Alert variant="warning" className="mx-3 mt-3 mb-0">
            Some dashboard data could not be refreshed. Intelligence widgets remain available below.
            <div className="small mt-1 mb-0">{partialLoadWarning}</div>
          </Alert>
        ) : null}

        {intelDashboard?.widgets ? (
          <div className="intel-mission-control mb-3">
            <div className="intel-cinematic-hero">
              <h2 className="h4">AI mission control outlook</h2>
              <p>
                AI identified {intelDashboard.widgets.highValueOpportunities ?? 0} high-value opportunities and{' '}
                {intelDashboard.widgets.opportunitiesRequiringReview ?? 0} pursuits requiring immediate review.
              </p>
              <div className="intel-cinematic-hero__chips">
                <span className="intel-chip">Win probability {intelDashboard.widgets.winProbabilityInsights ?? '—'}%</span>
                <span className="intel-chip">{intelDashboard.widgets.expiringDeadlines ?? 0} deadlines in 14 days</span>
                <span className="intel-chip">{intelDashboard.widgets.aiRiskAlerts ?? 0} active risk alerts</span>
              </div>
            </div>

            <InsightStream items={intelDashboard.aiInsightPanels || []} />

            <Row className="g-3 mb-3">
            {[
              ['Opportunities Discovered', intelDashboard.widgets.newOpportunitiesDiscovered, 'New in the last 7 days', 'intel', '+12%'],
              ['Qualified Opportunities', intelDashboard.widgets.qualifiedOpportunities, 'Evaluating or pursuing', 'success', '+6%'],
              ['High Value Opportunities', intelDashboard.widgets.highValueOpportunities, 'Above $1M threshold', 'intel', '+4%'],
              ['Go / No-Go Pending', intelDashboard.widgets.goNoGoPending, 'Awaiting committee action', 'warning', '—'],
              ['Win Probability', intelDashboard.widgets.winProbabilityInsights, 'Portfolio average', 'success', '+3%'],
              ['AI Risk Alerts', intelDashboard.widgets.aiRiskAlerts, 'Critical or urgent pursuits', 'risk', '—'],
              ['Upcoming Deadlines', intelDashboard.widgets.expiringDeadlines, 'Next 14 days', 'warning', '—'],
              ['Automation Savings (h)', intelDashboard.widgets.automationSavingsHours, 'Completed automation jobs', 'intel', '+18%']
            ].map(([label, value, hint, tone, trend]) => (
              <Col xs={6} md={4} xl={3} key={label}>
                <PremiumKpiCard label={label} value={value ?? 0} hint={hint} tone={tone} trend={trend} />
              </Col>
            ))}
          </Row>

            <Row className="g-3 mb-3">
              <Col lg={4}>
                <Card className="intel-chart-card h-100">
                  <Card.Header className="bg-white fw-semibold">Pipeline funnel</Card.Header>
                  <Card.Body style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(intelDashboard.funnel || {}).map(([stage, value]) => ({
                          stage,
                          value
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stage" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="intel-chart-card h-100">
                  <Card.Header className="bg-white fw-semibold">AI score distribution</Card.Header>
                  <Card.Body style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={intelDashboard.scoreDistribution || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bucket" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="intel-chart-card h-100">
                  <Card.Header className="bg-white fw-semibold">Source distribution</Card.Header>
                  <Card.Body style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(intelDashboard.sourceWiseCounts || {}).map(([source, count]) => ({
                          source,
                          count
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="source" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        ) : null}

        {/* AI Tender Insights */}
        <Card className="ai-insights-bar mb-3">
          <Card.Body className="py-2 py-md-3">
            <div className="ai-insights-head">
              <h2 className="ai-insights-title">AI Tender Insights</h2>
              <Button
                variant="link"
                size="sm"
                className="ai-insights-all p-0"
                onClick={() => navigate('/tender-intelligence/pipeline')}
              >
                View all insights
              </Button>
            </div>
            <Row className="g-2 g-md-3 ai-insights-row">
              <Col xs={12} sm={6} xl={3}>
                <div className="ai-insight-card ai-insight--purple">
                  <div className="ai-insight-icon">
                    <InsightGlyph type="target" />
                  </div>
                  <div className="ai-insight-body">
                    <div className="ai-insight-label">High-probability wins</div>
                    <div className="ai-insight-value">
                      {aiInsights.highCount}{' '}
                      <span className="ai-insight-sub">· {aiInsights.highValue} pipeline</span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} xl={3}>
                <div className="ai-insight-card ai-insight--risk">
                  <div className="ai-insight-icon">
                    <InsightGlyph type="risk" />
                  </div>
                  <div className="ai-insight-body">
                    <div className="ai-insight-label">Tenders at risk</div>
                    <div className="ai-insight-value">
                      {aiInsights.riskCount}{' '}
                      <span className="ai-insight-sub">· {aiInsights.riskValue}</span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} xl={3}>
                <div className="ai-insight-card ai-insight--blue">
                  <div className="ai-insight-icon">
                    <InsightGlyph type="currency" />
                  </div>
                  <div className="ai-insight-body">
                    <div className="ai-insight-label">Pipeline needs action</div>
                    <div className="ai-insight-value">
                      {aiInsights.pipelineValue}{' '}
                      <span className="ai-insight-sub">· next 30 days focus</span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} xl={3}>
                <div className="ai-insight-card ai-insight--compliance">
                  <div className="ai-insight-icon">
                    <InsightGlyph type="shield" />
                  </div>
                  <div className="ai-insight-body">
                    <div className="ai-insight-label">Evaluation &amp; compliance</div>
                    <div className="ai-insight-value">
                      {aiInsights.complianceCount}{' '}
                      <span className="ai-insight-sub">· recent reviews</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* KPI row */}
        <Row className="g-3 mb-3 metric-row-5">
          {metricCards.map((metric, index) => (
            <Col xs={12} sm={6} lg={4} className="dashboard-kpi-col" key={`${metric.title}-${index}`}>
              <Card className={`metric-card tone-${metric.tone}`}>
                <Card.Body>
                  <div className="metric-top">
                    <div className="metric-icon">
                      <MetricGlyph metricKey={metric.metricKey} />
                    </div>
                    <div>
                      <h6>{metric.title}</h6>
                      <h3>{metric.value}</h3>
                    </div>
                  </div>
                  <div className="metric-meta">
                    <span>{metric.subtitle}</span>
                    <TrendIndicator direction={metric.trendDirection} value={metric.trend} />
                  </div>
                  <Sparkline values={metric.chartData} tone={metric.tone} />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {(statsError || activitiesError) && (
          <Row className="mb-3">
            <Col>
              {statsError && (
                <Alert variant="warning" dismissible>
                  <strong>Dashboard statistics issue:</strong> {statsError}
                </Alert>
              )}
              {activitiesError && (
                <Alert variant="warning" dismissible>
                  <strong>Activities issue:</strong> {activitiesError}
                </Alert>
              )}
            </Col>
          </Row>
        )}

        {/* Charts + sidebar */}
        <Row className="g-3 mb-3 align-items-stretch">
          <Col lg={5}>
            <Card className="panel-card h-100">
              <Card.Header>
                <div>
                  <h5>Pipeline by stage</h5>
                  <p>Tender volume and value across lifecycle states.</p>
                </div>
                {statsLoading && <Spinner animation="border" size="sm" />}
              </Card.Header>
              <Card.Body>
                <div className="funnel-wrap">
                  <div className="funnel-bar">
                    {pipelineStages.map((s) => (
                      <div
                        key={s.key}
                        className="funnel-segment"
                        style={{
                          flexGrow: Math.max(s.count, 1),
                          background: s.color
                        }}
                        title={`${s.label}: ${s.count}`}
                      />
                    ))}
                  </div>
                  <div className="funnel-table mt-3">
                    {pipelineStages.length === 0 ? (
                      <div className="text-muted small">No pipeline data yet.</div>
                    ) : (
                      pipelineStages.map((s) => (
                        <div key={s.key} className="funnel-row">
                          <span className="funnel-dot" style={{ background: s.color }} />
                          <span className="funnel-name">{s.label}</span>
                          <span className="funnel-count">{s.count}</span>
                          <span className="funnel-pct">{s.pct}%</span>
                          <span className="funnel-val">
                            {s.value
                              ? `₹${(s.value / 1e6).toFixed(1)}M`
                              : '—'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="panel-card h-100">
              <Card.Header>
                <div>
                  <h5>Win ratio &amp; intake trend</h5>
                  <p>Monthly publications vs. your overall win rate benchmark.</p>
                </div>
              </Card.Header>
              <Card.Body className="chart-card-body">
                {trendChartRows.length === 0 ? (
                  <div className="chart-empty text-muted small py-5 text-center">
                    Not enough monthly data yet. Publish or import tenders to see the trend.
                  </div>
                ) : (
                <div className="recharts-h-240">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={trendChartRows}
                      margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="dashAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4678be" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#4678be" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8eef6" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#8899ae" />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11 }}
                        stroke="#4678be"
                        allowDecimals={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                        tick={{ fontSize: 11 }}
                        stroke="#22a56f"
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: '1px solid #e3eaf4' }}
                        formatter={(value, name) =>
                          name === 'winRatio' ? [`${value}%`, 'Win ratio'] : [value, 'Published']
                        }
                      />
                      <ReferenceLine
                        yAxisId="left"
                        y={monthlyTrendData.avgCount}
                        stroke="#94a3b8"
                        strokeDasharray="4 4"
                        label={{ value: 'Avg. intake', fill: '#64748b', fontSize: 11 }}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="count"
                        stroke="#4678be"
                        strokeWidth={2}
                        fill="url(#dashAreaGrad)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="winRatio"
                        stroke="#22a56f"
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                )}
                <p className="chart-footnote small text-muted mb-0 mt-2">
                  Area shows monthly intake volume; green line is portfolio win ratio from KPIs.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3}>
            <Card className="panel-card mb-3">
              <Card.Header>
                <div>
                  <h5>AI alerts</h5>
                  <p>Priority actions from deadlines and scoring.</p>
                </div>
              </Card.Header>
              <Card.Body className="alerts-body">
                {activitiesLoading ? (
                  <div className="text-muted small">Loading alerts…</div>
                ) : (
                  aiAlerts.map((a) => (
                    <div key={a.id} className={`alert-line alert-line--${a.priority}`}>
                      <div className="alert-line-priority">{a.priority}</div>
                      <div className="alert-line-content">
                        <div className="alert-line-title">{a.title}</div>
                        <div className="alert-line-detail">{a.detail}</div>
                        <div className="alert-line-meta">{a.meta}</div>
                      </div>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>

            <Card className="panel-card mb-3">
              <Card.Header>
                <div>
                  <h5>Quick actions</h5>
                  <p>Jump into execution workflows.</p>
                </div>
              </Card.Header>
              <Card.Body className="quick-actions-body p-0">
                <button
                  type="button"
                  className="quick-action-row"
                  onClick={() => navigate('/rfp-management/create')}
                >
                  <span>Create new RFP</span>
                  <span className="quick-action-chevron" aria-hidden>
                    ›
                  </span>
                </button>
                <button
                  type="button"
                  className="quick-action-row"
                  onClick={() => navigate('/document-management/content-library')}
                >
                  <span>Upload tender documents</span>
                  <span className="quick-action-chevron" aria-hidden>
                    ›
                  </span>
                </button>
                <button
                  type="button"
                  className="quick-action-row"
                  onClick={() => navigate('/document-management/ai-analysis')}
                >
                  <span>Run AI document analysis</span>
                  <span className="quick-action-chevron" aria-hidden>
                    ›
                  </span>
                </button>
                <button
                  type="button"
                  className="quick-action-row"
                  onClick={() => navigate('/tender-intelligence/pipeline')}
                >
                  <span>Review opportunity pipeline</span>
                  <span className="quick-action-chevron" aria-hidden>
                    ›
                  </span>
                </button>
              </Card.Body>
            </Card>

            <Card className="panel-card readiness-card">
              <Card.Body>
                <div className="readiness-layout">
                  <div
                    className="readiness-donut"
                    style={{
                      background: `conic-gradient(var(--t360-blue, #4678be) ${readinessPct * 3.6}deg, #e7edf5 0)`
                    }}
                  >
                    <div className="readiness-donut-inner">
                      <strong>{readinessPct}%</strong>
                      <span>readiness</span>
                    </div>
                  </div>
                  <div className="readiness-copy">
                    <div className="readiness-label">Submission readiness</div>
                    <div className={`readiness-status readiness-status--${readinessPct >= 75 ? 'ok' : readinessPct >= 55 ? 'mid' : 'low'}`}>
                      {readinessLabel}
                    </div>
                    <Button
                      variant="link"
                      className="readiness-link p-0"
                      onClick={() => navigate('/qualification-evaluation/compliance-matrix')}
                    >
                      Improve readiness
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Table + deadlines */}
        <Row className="g-3">
          <Col lg={8}>
            <Card className="panel-card">
              <Card.Header>
                <div>
                  <h5>Active tenders</h5>
                  <p>Opportunities requiring ownership and submission focus.</p>
                </div>
                <Button variant="link" size="sm" onClick={() => navigate('/tender-calendar')}>
                  View calendar
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="d-none d-lg-block table-responsive dashboard-table-wrap">
                  <Table className="compact-table mb-0">
                    <thead>
                      <tr>
                        <th>Tender</th>
                        <th>Deadline</th>
                        <th>Status</th>
                        <th>Match</th>
                        <th>Value</th>
                        <th>Owner</th>
                        <th>Region</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overviewLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                          <tr key={index}>
                            <td colSpan="7" className="text-center py-2 text-muted small">
                              Loading row {index + 1}...
                            </td>
                          </tr>
                        ))
                      ) : activeTendersData.length > 0 ? (
                        activeTendersData.map((tender) => (
                          <tr key={tender.id}>
                            <td>
                              <div className="tender-name">{tender.name}</div>
                              <div className="tender-org">{tender.organization}</div>
                            </td>
                            <td>
                              <span className={isOverdue(tender.deadline) ? 'text-danger' : ''}>
                                {formatDate(tender.deadline)}
                              </span>
                            </td>
                            <td>{getStatusBadge(tender.status)}</td>
                            <td>
                              <div className="score-wrap">
                                <span>{tender.matchScore}%</span>
                                <div className="score-track">
                                  <div style={{ width: `${tender.matchScore}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="value-cell">{tender.value}</td>
                            <td>
                              <div className="owner-cell">
                                <OwnerAvatar name={tender.assignedTeam} />
                                <span className="owner-name">{tender.assignedTeam || '—'}</span>
                              </div>
                            </td>
                            <td>{tender.region}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-3 text-muted">
                            No active tenders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                <div className="d-lg-none tender-cards-mobile pb-3">
                  {overviewLoading ? (
                    <div className="px-3 pt-3 text-muted small d-flex align-items-center gap-2">
                      <Spinner animation="border" size="sm" variant="primary" />
                      Loading tenders…
                    </div>
                  ) : activeTendersData.length > 0 ? (
                    <>
                      <div className="px-3 pt-3 d-flex justify-content-between align-items-baseline tender-mobile-meta">
                        <span className="small text-muted">
                          {(tenderMobilePage - 1) * TENDER_MOBILE_PAGE_SIZE + 1}–
                          {Math.min(
                            tenderMobilePage * TENDER_MOBILE_PAGE_SIZE,
                            activeTendersData.length
                          )}{' '}
                          of {activeTendersData.length}
                        </span>
                      </div>
                      {tenderMobilePaginated.map((tender) => (
                        <div key={tender.id} className="tender-card-mobile mx-3">
                          <div className="tender-card-mobile__title">{tender.name}</div>
                          <div className="tender-card-mobile__org">{tender.organization}</div>
                          <div className="tender-card-mobile__grid">
                            <div className="tender-card-mobile__field">
                              <span className="label">Deadline</span>
                              <span className={isOverdue(tender.deadline) ? 'text-danger' : ''}>
                                {formatDate(tender.deadline)}
                              </span>
                            </div>
                            <div className="tender-card-mobile__field tender-card-mobile__field--badge">
                              <span className="label">Status</span>
                              {getStatusBadge(tender.status)}
                            </div>
                            <div className="tender-card-mobile__field tender-card-mobile__field--full owner-cell owner-cell--mobile">
                              <span className="label">Owner</span>
                              <div className="d-flex align-items-center gap-2">
                                <OwnerAvatar name={tender.assignedTeam} />
                                <span>{tender.assignedTeam || '—'}</span>
                              </div>
                            </div>
                            <div className="tender-card-mobile__field">
                              <span className="label">Value</span>
                              <span className="value-strong">{tender.value}</span>
                            </div>
                            <div className="tender-card-mobile__field">
                              <span className="label">Region</span>
                              <span>{tender.region}</span>
                            </div>
                            <div className="tender-card-mobile__field tender-card-mobile__field--full">
                              <span className="label">Match score</span>
                              <div className="score-wrap score-wrap-mobile">
                                <span>{tender.matchScore}%</span>
                                <div className="score-track">
                                  <div style={{ width: `${tender.matchScore}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {tenderMobileTotalPages > 1 && (
                        <div className="tender-mobile-pagination-wrap px-3 mt-3 mb-1">
                          {tenderMobileTotalPages <= 9 ? (
                            <Pagination className="justify-content-center flex-wrap mb-0">
                              <Pagination.Prev
                                disabled={tenderMobilePage <= 1}
                                onClick={() => setTenderMobilePage((p) => Math.max(1, p - 1))}
                              />
                              {Array.from({ length: tenderMobileTotalPages }, (_, i) => i + 1).map(
                                (n) => (
                                  <Pagination.Item
                                    key={n}
                                    active={n === tenderMobilePage}
                                    onClick={() => setTenderMobilePage(n)}
                                  >
                                    {n}
                                  </Pagination.Item>
                                )
                              )}
                              <Pagination.Next
                                disabled={tenderMobilePage >= tenderMobileTotalPages}
                                onClick={() =>
                                  setTenderMobilePage((p) =>
                                    Math.min(tenderMobileTotalPages, p + 1)
                                  )
                                }
                              />
                            </Pagination>
                          ) : (
                            <div className="tender-mobile-pagination-compact d-flex align-items-center justify-content-center gap-3 flex-wrap">
                              <Pagination className="mb-0">
                                <Pagination.Prev
                                  disabled={tenderMobilePage <= 1}
                                  onClick={() => setTenderMobilePage((p) => Math.max(1, p - 1))}
                                />
                                <Pagination.Next
                                  disabled={tenderMobilePage >= tenderMobileTotalPages}
                                  onClick={() =>
                                    setTenderMobilePage((p) =>
                                      Math.min(tenderMobileTotalPages, p + 1)
                                    )
                                  }
                                />
                              </Pagination>
                              <span className="small text-muted">
                                Page {tenderMobilePage} of {tenderMobileTotalPages}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="px-3 pt-3 text-center text-muted py-4">No active tenders found</div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="panel-card">
              <Card.Header>
                <div>
                  <h5>Upcoming deadlines</h5>
                  <p>Prioritized submissions due soon.</p>
                </div>
                <Button variant="link" size="sm" onClick={() => navigate('/tender-calendar')}>
                  Open calendar
                </Button>
              </Card.Header>
              <Card.Body className="deadline-body">
                {overviewLoading ? (
                  <div className="text-muted small">Loading deadlines...</div>
                ) : upcomingDeadlinesData.length > 0 ? (
                  upcomingDeadlinesData.map((deadline) => (
                    <div key={deadline.id} className="deadline-item">
                      <div className={`deadline-dot ${deadline.isOverdue ? 'overdue' : 'normal'}`} />
                      <div className="deadline-content">
                        <div className="deadline-title-row">
                          <h6>{deadline.name}</h6>
                          <Badge bg={deadline.isOverdue ? 'danger' : 'warning'}>{deadline.status}</Badge>
                        </div>
                        <p>{deadline.organization}</p>
                        <div className="deadline-meta">
                          <span>{deadline.value}</span>
                          <span>{formatDate(deadline.deadline)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted small">No upcoming deadlines</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  return <>{body}</>
}

export default Dashboard
