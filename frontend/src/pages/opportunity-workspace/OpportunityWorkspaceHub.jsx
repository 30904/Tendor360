import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { BiRefresh } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import InsightStream from '../../components/intelligence/InsightStream'
import RecommendationPill from '../../components/intelligence/RecommendationPill'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './OpportunityWorkspaceHub.scss'

const formatCurrency = (value, currency = 'USD') => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDeadline = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

const daysUntil = (value) => {
  if (!value) return null
  const diff = new Date(value).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const OpportunityWorkspaceHub = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [opportunities, setOpportunities] = useState([])
  const [scores, setScores] = useState([])
  const [query, setQuery] = useState('')

  const load = async () => {
    setError(null)
    setLoading(true)
    try {
      const [opportunityRes, scoreRes] = await Promise.all([
        intelligenceAPI.listWorkspaceOpportunities(),
        intelligenceAPI.listScores()
      ])
      setOpportunities(opportunityRes.data?.data?.opportunities || [])
      setScores(scoreRes.data?.data?.scores || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load opportunity workspace')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const scoreByTender = useMemo(
    () => Object.fromEntries(scores.map((score) => [String(score.tenderId?._id || score.tenderId), score])),
    [scores]
  )

  const enrichedOpportunities = useMemo(
    () =>
      opportunities.map((opportunity) => {
        const score = scoreByTender[String(opportunity._id)]
        const compositeScore = score?.compositeScore ?? opportunity.aiMatchScore ?? null
        const recommendation = score?.recommendation || 'defer'
        const deadlineDays = daysUntil(opportunity.deadline)
        return {
          ...opportunity,
          compositeScore,
          recommendation,
          deadlineDays,
          sourceLabel: opportunity.discovery?.connectorType || opportunity.source || 'manual'
        }
      }),
    [opportunities, scoreByTender]
  )

  const filteredOpportunities = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return enrichedOpportunities
    return enrichedOpportunities.filter((opportunity) =>
      [opportunity.title, opportunity.reference, opportunity.organization, opportunity.sourceLabel]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle))
    )
  }, [enrichedOpportunities, query])

  const metrics = useMemo(() => {
    const scored = enrichedOpportunities.filter((item) => Number.isFinite(item.compositeScore))
    const avgScore = scored.length
      ? Math.round(scored.reduce((sum, item) => sum + item.compositeScore, 0) / scored.length)
      : 0
    const highConfidence = enrichedOpportunities.filter((item) => (item.compositeScore || 0) >= 80).length
    const urgent = enrichedOpportunities.filter(
      (item) => item.deadlineDays != null && item.deadlineDays >= 0 && item.deadlineDays <= 14
    ).length
    const pursueReady = enrichedOpportunities.filter((item) =>
      ['go', 'conditional_go'].includes(item.recommendation)
    ).length

    return {
      total: enrichedOpportunities.length,
      avgScore,
      highConfidence,
      urgent,
      pursueReady
    }
  }, [enrichedOpportunities])

  const insightItems = useMemo(() => {
    const items = []

    if (metrics.highConfidence > 0) {
      items.push({
        title: `${metrics.highConfidence} pursuits exceed the 80-point AI confidence threshold`,
        detail: 'Prioritize executive review for high-fit opportunities before qualification windows close.',
        tone: 'success'
      })
    }

    if (metrics.urgent > 0) {
      items.push({
        title: `${metrics.urgent} opportunities have deadlines inside the next 14 days`,
        detail: 'Escalate bid command review for time-sensitive pursuits in the workspace queue.',
        tone: 'warning'
      })
    }

    if (metrics.pursueReady > 0) {
      items.push({
        title: `${metrics.pursueReady} opportunities are AI-recommended for pursuit`,
        detail: 'Advance GO and conditional GO pursuits into document intelligence and go / no-go review.',
        tone: 'info'
      })
    }

    items.push({
      title: `${metrics.total} active pursuits in the bid intelligence workspace`,
      detail: 'Each workspace includes AI summary, qualification meters, CRM intelligence, and operational timeline.',
      tone: 'primary'
    })

    return items.slice(0, 4)
  }, [metrics])

  const showInitialLoader = loading && !opportunities.length && !error

  return (
    <div className="opportunity-workspace-hub page-enter page-bg-gradient intel-executive-page">
      <div className="intel-executive-page__hero">
        <div>
          <h1>Opportunity workspace command center</h1>
          <p>
            Central bid intelligence workspace with AI summary, qualification status, CRM context, and
            operational timeline.
          </p>
        </div>
        <div className="intel-executive-page__hero-actions">
          <Button size="sm" variant="outline-primary" onClick={load} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Refreshing
              </>
            ) : (
              <>
                <BiRefresh className="me-1" />
                Refresh
              </>
            )}
          </Button>
          <small>Portfolio pursuit intelligence</small>
        </div>
      </div>

      {showInitialLoader ? <div className="intel-loading-skeleton mb-3" /> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}

      {!error ? (
        <>
          <div className="intel-cinematic-hero mb-3">
            <h2 className="h4 mb-2">Pursuit intelligence outlook</h2>
            <p className="mb-0">
              {metrics.total} active opportunities with an average AI fit of {metrics.avgScore || '—'} and{' '}
              {metrics.pursueReady} pursuits recommended for advancement.
            </p>
            <div className="intel-cinematic-hero__chips">
              <span className="intel-chip">{metrics.highConfidence} high-confidence pursuits</span>
              <span className="intel-chip">{metrics.urgent} urgent deadlines</span>
              <span className="intel-chip">{metrics.pursueReady} pursuit-ready</span>
              <span className="intel-chip">{filteredOpportunities.length} visible in queue</span>
            </div>
          </div>

          <InsightStream items={insightItems} />

          <div className="intel-mission-control mb-3">
            <Row className="g-3 mb-3">
              <Col xs={6} md={3}>
                <PremiumKpiCard
                  label="Active pursuits"
                  value={metrics.total}
                  hint="Workspace-ready opportunities"
                  tone="intel"
                  trend="Portfolio"
                />
              </Col>
              <Col xs={6} md={3}>
                <PremiumKpiCard
                  label="Average AI fit"
                  value={metrics.avgScore || 0}
                  hint="Composite opportunity score"
                  tone="success"
                  trend="+confidence"
                />
              </Col>
              <Col xs={6} md={3}>
                <PremiumKpiCard
                  label="High confidence"
                  value={metrics.highConfidence}
                  hint="Score 80 or above"
                  tone="success"
                  trend="Priority"
                />
              </Col>
              <Col xs={6} md={3}>
                <PremiumKpiCard
                  label="Urgent deadlines"
                  value={metrics.urgent}
                  hint="Due within 14 days"
                  tone={metrics.urgent > 0 ? 'risk' : 'warning'}
                  trend="Review now"
                />
              </Col>
            </Row>
          </div>

          <Card className="intel-chart-card workspace-queue-panel mb-3">
            <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
              <span className="fw-semibold">Pursuit queue</span>
              <Form.Control
                size="sm"
                type="search"
                className="workspace-queue-search"
                placeholder="Search title, reference, organization, or source"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </Card.Header>
            <Card.Body>
              {loading && !filteredOpportunities.length ? <div className="intel-loading-skeleton" /> : null}
              {!loading && !filteredOpportunities.length ? (
                <p className="text-muted mb-0">
                  No opportunities match the current view. Run discovery sync or seed demo intelligence data.
                </p>
              ) : null}
              <Row className="g-3">
                {filteredOpportunities.map((opportunity) => {
                  const scoreValue = opportunity.compositeScore ?? '—'
                  const scoreTone =
                    Number(opportunity.compositeScore) >= 80
                      ? 'high'
                      : Number(opportunity.compositeScore) >= 60
                        ? 'medium'
                        : 'low'

                  return (
                    <Col md={6} xl={4} key={opportunity._id}>
                      <div className="workspace-opportunity-card">
                        <div className="workspace-opportunity-card__top">
                          <div>
                            <div className="workspace-opportunity-card__title">{opportunity.title}</div>
                            <div className="workspace-opportunity-card__reference">{opportunity.reference}</div>
                          </div>
                          <div className={`workspace-opportunity-card__score tone-${scoreTone}`}>
                            <span>{scoreValue}</span>
                            <small>AI fit</small>
                          </div>
                        </div>

                        <div className="workspace-opportunity-card__org">{opportunity.organization}</div>

                        <div className="workspace-opportunity-card__meta">
                          <span>Source: {opportunity.sourceLabel}</span>
                          <span>Value: {formatCurrency(opportunity.estimatedValue, opportunity.currency)}</span>
                        </div>

                        <div className="workspace-opportunity-card__footer">
                          <div className="workspace-opportunity-card__status">
                            <RecommendationPill value={opportunity.recommendation} />
                            {opportunity.pipelineStage ? (
                              <Badge bg="light" text="dark">
                                {opportunity.pipelineStage}
                              </Badge>
                            ) : null}
                          </div>
                          <div className="workspace-opportunity-card__deadline">
                            <span className="label">Deadline</span>
                            <strong>{formatDeadline(opportunity.deadline)}</strong>
                            {opportunity.deadlineDays != null ? (
                              <span
                                className={
                                  opportunity.deadlineDays < 0
                                    ? 'urgency overdue'
                                    : opportunity.deadlineDays <= 14
                                      ? 'urgency soon'
                                      : 'urgency calm'
                                }
                              >
                                {opportunity.deadlineDays < 0
                                  ? 'Overdue'
                                  : `${opportunity.deadlineDays} days left`}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="primary"
                          className="workspace-opportunity-card__action"
                          onClick={() => navigate(`/opportunity-workspace/${opportunity._id}`)}
                        >
                          Open bid command center
                        </Button>
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </Card.Body>
          </Card>
        </>
      ) : null}
    </div>
  )
}

export default OpportunityWorkspaceHub
