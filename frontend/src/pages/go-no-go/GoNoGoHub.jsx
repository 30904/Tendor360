import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { BiRefresh } from 'react-icons/bi'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import InsightStream from '../../components/intelligence/InsightStream'
import RecommendationPill from '../../components/intelligence/RecommendationPill'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './GoNoGoHub.scss'

const recommendationKeys = ['go', 'conditional_go', 'no_go', 'defer']

const formatCurrency = (value) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

const statusTone = (status) => {
  const key = String(status || '').toLowerCase()
  if (key === 'approved') return 'success'
  if (key === 'rejected') return 'danger'
  if (key === 'in_review') return 'warning'
  return 'secondary'
}

const GoNoGoHub = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState([])
  const [query, setQuery] = useState('')

  const load = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await intelligenceAPI.listGoNoGoReviews()
      setReviews(res.data?.data?.reviews || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load Go / No-Go reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const summary = useMemo(() => {
    const counts = { go: 0, conditional_go: 0, no_go: 0, defer: 0 }
    reviews.forEach((review) => {
      const key = review.aiRecommendation || 'defer'
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [reviews])

  const metrics = useMemo(() => {
    const aligned = reviews.filter(
      (review) => review.recommendation && review.aiRecommendation === review.recommendation
    ).length
    const pending = reviews.filter((review) => review.status === 'in_review').length
    const approved = reviews.filter((review) => review.status === 'approved').length
    const committeeActions = reviews.reduce((sum, review) => sum + (review.history?.length || 0), 0)

    return {
      total: reviews.length,
      aligned,
      pending,
      approved,
      committeeActions
    }
  }, [reviews])

  const insightItems = useMemo(() => {
    const items = []

    if (summary.go > 0) {
      items.push({
        title: `${summary.go} pursuits carry a clear AI GO recommendation`,
        detail: 'Advance committee-ready opportunities into bid execution and document validation.',
        tone: 'success'
      })
    }

    if (summary.conditional_go > 0) {
      items.push({
        title: `${summary.conditional_go} pursuits require conditional committee approval`,
        detail: 'Resolve pricing, delivery, or compliance caveats before final pursuit authorization.',
        tone: 'warning'
      })
    }

    if (summary.no_go > 0) {
      items.push({
        title: `${summary.no_go} pursuits are flagged as NO-GO by AI risk analysis`,
        detail: 'Archive or defer low-fit opportunities to protect pursuit capacity.',
        tone: 'warning'
      })
    }

    items.push({
      title: `${metrics.pending} reviews remain in committee workflow`,
      detail: `${metrics.committeeActions} stakeholder actions captured across the decision audit trail.`,
      tone: 'info'
    })

    return items.slice(0, 4)
  }, [summary, metrics])

  const filteredReviews = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return reviews
    return reviews.filter((review) =>
      [review.tenderId?.title, review.tenderId?.reference, review.tenderId?.organization, review.summary]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle))
    )
  }, [reviews, query])

  const showInitialLoader = loading && !reviews.length && !error

  return (
    <div className="go-no-go-hub page-enter page-bg-gradient intel-executive-page">
      <div className="intel-executive-page__hero">
        <div>
          <h1>Executive decision center</h1>
          <p>
            Committee-ready pursuit decisions with AI recommendations, stakeholder commentary, and audit
            history.
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
          <small>Committee decision telemetry</small>
        </div>
      </div>

      {showInitialLoader ? <div className="intel-loading-skeleton mb-3" /> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}

      {!error ? (
        <>
          <div className="intel-cinematic-hero mb-3">
            <h2 className="h4 mb-2">Decision intelligence outlook</h2>
            <p className="mb-0">
              {metrics.total} pursuit reviews in committee workflow with {metrics.aligned} AI and committee
              decisions aligned.
            </p>
            <div className="intel-cinematic-hero__chips">
              <span className="intel-chip">{summary.go} AI GO</span>
              <span className="intel-chip">{summary.conditional_go} conditional</span>
              <span className="intel-chip">{summary.no_go} NO-GO</span>
              <span className="intel-chip">{metrics.pending} in review</span>
            </div>
          </div>

          <InsightStream items={insightItems} />

          <div className="intel-mission-control mb-3">
            <Row className="g-3 mb-3">
              {recommendationKeys.map((key) => (
                <Col xs={6} md={3} key={key}>
                  <PremiumKpiCard
                    label={`AI ${key.replace('_', ' ')}`}
                    value={summary[key] || 0}
                    hint="AI recommendation mix"
                    tone={
                      key === 'go'
                        ? 'success'
                        : key === 'no_go'
                          ? 'risk'
                          : key === 'conditional_go'
                            ? 'warning'
                            : 'intel'
                    }
                    trend="Portfolio"
                  />
                </Col>
              ))}
            </Row>
            <Row className="g-3">
              <Col xs={6} md={4}>
                <PremiumKpiCard
                  label="Committee aligned"
                  value={metrics.aligned}
                  hint="AI and committee match"
                  tone="success"
                  trend="Consensus"
                />
              </Col>
              <Col xs={6} md={4}>
                <PremiumKpiCard
                  label="In review"
                  value={metrics.pending}
                  hint="Awaiting committee action"
                  tone="warning"
                  trend="Active"
                />
              </Col>
              <Col xs={12} md={4}>
                <PremiumKpiCard
                  label="Audit actions"
                  value={metrics.committeeActions}
                  hint="Stakeholder history entries"
                  tone="intel"
                  trend="Traceable"
                />
              </Col>
            </Row>
          </div>

          <Row className="g-3 mb-3">
            <Col xl={8}>
              <Card className="intel-chart-card decision-board">
                <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <span className="fw-semibold">Decision board</span>
                  <Form.Control
                    size="sm"
                    type="search"
                    className="go-no-go-search"
                    placeholder="Search opportunity, reference, or summary"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </Card.Header>
                <Card.Body>
                  {loading && !filteredReviews.length ? <div className="intel-loading-skeleton" /> : null}
                  {!loading && !filteredReviews.length ? (
                    <p className="text-muted mb-0">
                      No committee reviews match the current view. Seed intelligence demo data or create a
                      review from an opportunity workspace.
                    </p>
                  ) : null}
                  <div className="decision-board-grid">
                    {filteredReviews.map((review) => (
                      <div key={review._id} className="decision-board-card">
                        <div className="decision-board-card__head">
                          <div>
                            <div className="decision-board-card__title">
                              {review.tenderId?.title || 'Opportunity'}
                            </div>
                            <div className="decision-board-card__reference">
                              {review.tenderId?.reference || '—'}
                            </div>
                          </div>
                          <Badge bg={statusTone(review.status)} className="text-capitalize">
                            {review.status?.replace('_', ' ') || 'draft'}
                          </Badge>
                        </div>
                        <div className="decision-board-card__meta">
                          <span>{review.tenderId?.organization || 'Organization pending'}</span>
                          <span>Value {formatCurrency(review.tenderId?.estimatedValue)}</span>
                          <span>Deadline {formatDate(review.tenderId?.deadline)}</span>
                        </div>
                        {review.summary ? (
                          <p className="decision-board-card__summary">{review.summary}</p>
                        ) : null}
                        <div className="decision-board-card__recommendations">
                          <div>
                            <span className="label">AI recommendation</span>
                            <RecommendationPill value={review.aiRecommendation} />
                          </div>
                          <div>
                            <span className="label">Committee decision</span>
                            <RecommendationPill value={review.recommendation} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4}>
              <Card className="intel-chart-card approval-history-panel h-100">
                <Card.Header className="bg-white fw-semibold">Approval history</Card.Header>
                <Card.Body>
                  {reviews.slice(0, 5).map((review) => (
                    <div key={`history-${review._id}`} className="approval-history-item">
                      <div className="approval-history-item__head">
                        <div className="fw-semibold small">{review.tenderId?.reference || 'Opportunity'}</div>
                        <RecommendationPill value={review.recommendation} />
                      </div>
                      {review.summary ? (
                        <div className="small text-muted mb-2">{review.summary}</div>
                      ) : null}
                      {(review.history || []).slice(0, 3).map((entry) => (
                        <div key={entry._id} className="approval-history-entry">
                          <div className="approval-history-entry__action">
                            <strong>{entry.actorId?.name || 'Reviewer'}</strong> · {entry.action}
                          </div>
                          {entry.comment ? (
                            <div className="approval-history-entry__comment">{entry.comment}</div>
                          ) : null}
                        </div>
                      ))}
                      {!review.history?.length ? (
                        <div className="small text-muted">No committee actions recorded yet.</div>
                      ) : null}
                    </div>
                  ))}
                  {!reviews.length ? (
                    <p className="text-muted mb-0 small">Approval history will appear as committee actions are logged.</p>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : null}
    </div>
  )
}

export default GoNoGoHub
