import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Row, Spinner } from 'react-bootstrap'
import { BiRefresh } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import ModuleHubPage from '../../components/hub/ModuleHubPage'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import InsightStream from '../../components/intelligence/InsightStream'
import { issuedRfpAPI } from '../../services/issuedRfpAPI'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './CollaborationHub.scss'

const modules = [
  {
    id: 'create-rfp',
    title: 'Opportunity collaboration authoring',
    description: 'Optional internal collaboration for opportunity response packaging.',
    path: '/rfp-management/create',
    color: 'primary'
  },
  {
    id: 'team-collaboration',
    title: 'Team collaboration',
    description: 'Section ownership, handoffs, and review checkpoints.',
    path: '/rfp-management/teams',
    color: 'success'
  },
  {
    id: 'publish-rfp',
    title: 'Release controls',
    description: 'Controlled release workflows for partner collaboration.',
    path: '/rfp-management/publish',
    color: 'warning'
  },
  {
    id: 'rfp-tracking',
    title: 'Participation tracking',
    description: 'Monitor partner engagement and milestone health.',
    path: '/rfp-management/tracking',
    color: 'info'
  },
  {
    id: 'issued-rfps',
    title: 'Collaboration workspaces',
    description: 'Invite external partners into collaboration workspaces.',
    path: '/issued-rfps',
    color: 'primary'
  }
]

const CollaborationHub = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pursuitCount, setPursuitCount] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [workspaceCount, setWorkspaceCount] = useState(0)
  const [activity, setActivity] = useState([])

  const load = async () => {
    setError(null)
    setLoading(true)
    try {
      const [opportunityRes, reviewRes, issuedRes] = await Promise.all([
        intelligenceAPI.listWorkspaceOpportunities(),
        intelligenceAPI.listGoNoGoReviews(),
        issuedRfpAPI.list()
      ])

      const opportunities = opportunityRes.data?.data?.opportunities || []
      const reviews = reviewRes.data?.data?.reviews || []
      const issued = issuedRes.data?.data?.issuedRfps || issuedRes.data?.data || []

      setPursuitCount(opportunities.length)
      setReviewCount(reviews.length)
      setWorkspaceCount(Array.isArray(issued) ? issued.length : 0)

      const historyEntries = reviews
        .flatMap((review) =>
          (review.history || []).map((entry) => ({
            id: entry._id,
            reference: review.tenderId?.reference || 'Opportunity',
            actor: entry.actorId?.name || 'Reviewer',
            action: entry.action,
            comment: entry.comment
          }))
        )
        .slice(0, 6)

      setActivity(historyEntries)
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load collaboration telemetry')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const metrics = useMemo(
    () => ({
      modules: modules.length,
      pursuits: pursuitCount,
      reviews: reviewCount,
      workspaces: workspaceCount,
      activity: activity.length
    }),
    [pursuitCount, reviewCount, workspaceCount, activity.length]
  )

  const insightItems = useMemo(
    () => [
      {
        title: `${metrics.pursuits} pursuit packages ready for internal collaboration`,
        detail: 'Coordinate authoring, review checkpoints, and release controls across pursuit teams.',
        tone: 'info'
      },
      {
        title: `${metrics.reviews} committee decisions can trigger collaboration handoffs`,
        detail: 'Use go / no-go outcomes to open response packaging and partner workspaces.',
        tone: 'primary'
      },
      {
        title: `${metrics.workspaces} partner collaboration workspaces available`,
        detail: 'Invite external partners with controlled release and participation tracking.',
        tone: metrics.workspaces > 0 ? 'success' : 'warning'
      },
      {
        title: `${metrics.activity} recent stakeholder actions captured in the audit trail`,
        detail: 'Review ownership, handoffs, and release readiness before external distribution.',
        tone: 'info'
      }
    ],
    [metrics]
  )

  const showInitialLoader = loading && !error

  return (
    <div className="collaboration-hub page-enter page-bg-gradient intel-executive-page">
      <div className="intel-executive-page__hero">
        <div>
          <h1>Collaboration command center</h1>
          <p>
            Partner and internal collaboration layered on top of core tender intelligence, with authoring,
            checkpoints, release controls, and participation tracking.
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
          <small>Collaboration readiness telemetry</small>
        </div>
      </div>

      {showInitialLoader ? <div className="intel-loading-skeleton mb-3" /> : null}
      {error ? <Alert variant="warning">{error}</Alert> : null}

      <div className="intel-cinematic-hero mb-3">
        <h2 className="h4 mb-2">Collaboration intelligence outlook</h2>
        <p className="mb-0">
          {metrics.modules} collaboration workspaces configured across {metrics.pursuits} active pursuits and{' '}
          {metrics.workspaces} partner-facing programs.
        </p>
        <div className="intel-cinematic-hero__chips">
          <span className="intel-chip">{metrics.pursuits} pursuit packages</span>
          <span className="intel-chip">{metrics.reviews} committee reviews</span>
          <span className="intel-chip">{metrics.workspaces} partner workspaces</span>
          <span className="intel-chip">{metrics.activity} recent actions</span>
        </div>
      </div>

      <InsightStream items={insightItems} />

      <div className="intel-mission-control mb-3">
        <Row className="g-3">
          <Col xs={6} md={3}>
            <PremiumKpiCard
              label="Collaboration modules"
              value={metrics.modules}
              hint="Authoring to partner release"
              tone="intel"
              trend="Ready"
            />
          </Col>
          <Col xs={6} md={3}>
            <PremiumKpiCard
              label="Pursuit packages"
              value={metrics.pursuits}
              hint="Internal response coordination"
              tone="intel"
              trend="Active"
            />
          </Col>
          <Col xs={6} md={3}>
            <PremiumKpiCard
              label="Committee reviews"
              value={metrics.reviews}
              hint="Decision-driven handoffs"
              tone="warning"
              trend="In flow"
            />
          </Col>
          <Col xs={6} md={3}>
            <PremiumKpiCard
              label="Partner workspaces"
              value={metrics.workspaces}
              hint="External collaboration"
              tone={metrics.workspaces > 0 ? 'success' : 'warning'}
              trend="Engagement"
            />
          </Col>
        </Row>
      </div>

      <ModuleHubPage
        title="Collaboration workspace"
        subtitle="Navigate authoring, team checkpoints, release controls, participation tracking, and partner workspaces."
        modules={modules}
        className="collaboration-hub__modules app-module-hub intel-module-hub mb-3"
      />

      <Row className="g-3 pb-4">
        <Col lg={7}>
          <Card className="intel-chart-card h-100">
            <Card.Header className="bg-white fw-semibold">Collaboration workstreams</Card.Header>
            <Card.Body className="collaboration-workstream-list">
              {modules.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  className="collaboration-workstream-card"
                  onClick={() => navigate(module.path)}
                >
                  <div>
                    <div className="collaboration-workstream-card__title">{module.title}</div>
                    <div className="collaboration-workstream-card__description">{module.description}</div>
                  </div>
                  <Badge bg="light" text="dark">Open</Badge>
                </button>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="intel-chart-card h-100">
            <Card.Header className="bg-white fw-semibold">Stakeholder activity</Card.Header>
            <Card.Body>
              {activity.length ? (
                activity.map((entry) => (
                  <div key={entry.id} className="collaboration-activity-item">
                    <div className="collaboration-activity-item__head">
                      <strong>{entry.reference}</strong>
                      <span>{entry.action}</span>
                    </div>
                    <div className="collaboration-activity-item__actor">{entry.actor}</div>
                    {entry.comment ? (
                      <div className="collaboration-activity-item__comment">{entry.comment}</div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-muted mb-0 small">
                  Stakeholder actions from committee reviews and collaboration checkpoints will appear here.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CollaborationHub
