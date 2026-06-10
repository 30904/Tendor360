import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Row, Spinner } from 'react-bootstrap'
import { BiRefresh } from 'react-icons/bi'
import { Activity, CalendarClock, CloudDownload, Radar } from 'lucide-react'
import ModuleHubPage from '../../components/hub/ModuleHubPage'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import InsightStream from '../../components/intelligence/InsightStream'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './TenderDiscoveryHub.scss'

const statusTone = (status) => {
  const key = String(status || '').toLowerCase()
  if (key === 'completed' || key === 'active' || key === 'healthy') return 'success'
  if (key === 'retrying' || key === 'running' || key === 'queued') return 'warning'
  if (key === 'failed' || key === 'error') return 'danger'
  return 'secondary'
}

const formatDateTime = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

const TenderDiscoveryHub = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [automation, setAutomation] = useState(null)

  const load = async () => {
    setError(null)
    setLoading(true)
    try {
      const [discoveryRes, automationRes] = await Promise.all([
        intelligenceAPI.getDiscoveryDashboard(),
        intelligenceAPI.getAutomationConsole()
      ])
      setDashboard(discoveryRes.data?.data ?? null)
      setAutomation(automationRes.data?.data ?? null)
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load discovery dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const metrics = useMemo(() => {
    const connectors = dashboard?.connectors || []
    const jobs = dashboard?.jobs || []
    const sources = dashboard?.sources || []
    const savedSearches = dashboard?.savedSearches || []
    const automationJobs = automation?.jobs || []
    const failures = automation?.failures || []

    const configuredConnectors = connectors.filter((item) => item.configured).length
    const importedTotal = jobs.reduce((sum, job) => sum + (job.stats?.imported || 0), 0)
    const completedJobs = jobs.filter((job) => job.status === 'completed').length
    const activeAutomation = automationJobs.filter((job) => job.status !== 'completed').length
    const retryingJobs = automationJobs.filter((job) => job.status === 'retrying').length

    return {
      configuredConnectors,
      connectorTotal: connectors.length,
      importedTotal,
      completedJobs,
      jobTotal: jobs.length,
      sourceCount: sources.length,
      savedSearchCount: savedSearches.length,
      activeAutomation,
      retryingJobs,
      failureCount: failures.length,
      schedulerEnabled: Boolean(dashboard?.scheduler?.enabled)
    }
  }, [dashboard, automation])

  const insightItems = useMemo(() => {
    const items = []
    const unconfigured = metrics.connectorTotal - metrics.configuredConnectors

    if (unconfigured > 0) {
      items.push({
        title: `${unconfigured} connector${unconfigured === 1 ? '' : 's'} awaiting configuration`,
        detail: 'GovWin, SAM.gov, and email ingestion paths should be verified before the next sync window.',
        tone: 'warning'
      })
    }

    if (metrics.importedTotal > 0) {
      items.push({
        title: `${metrics.importedTotal} opportunities ingested across recent discovery jobs`,
        detail: 'Staged imports are ready for qualification and workspace review.',
        tone: 'success'
      })
    }

    if (metrics.retryingJobs > 0 || metrics.failureCount > 0) {
      items.push({
        title: `${metrics.retryingJobs + metrics.failureCount} automation items need operator attention`,
        detail: 'Review retry queues and failed ingestion batches before the next scheduled run.',
        tone: 'warning'
      })
    }

    items.push({
      title: metrics.schedulerEnabled
        ? 'Incremental discovery scheduler is active'
        : 'Discovery scheduler is idle',
      detail: metrics.schedulerEnabled
        ? 'Connector sync cadence is running on the configured interval.'
        : 'Enable scheduler automation to keep connector feeds current.',
      tone: metrics.schedulerEnabled ? 'info' : 'primary'
    })

    if (metrics.savedSearchCount > 0) {
      items.push({
        title: `${metrics.savedSearchCount} saved searches available for watchlist reuse`,
        detail: 'Reuse high-performing filters to accelerate market coverage.',
        tone: 'info'
      })
    }

    return items.slice(0, 4)
  }, [metrics])

  const hubModules = useMemo(
    () => [
      {
        id: 'discovery-prospecting-rtm',
        title: 'Prospecting RTM (TB-001–006)',
        description:
          'Compliance tracker for GovWin login, 24h scan, new/updated bids, attachments, SAM fallback, and metadata extraction.',
        path: '/tender-discovery/prospecting',
        color: 'primary',
        statusLabel: 'Phase A',
        metric: '6 RTM requirements',
        actionLabel: 'Open RTM board'
      },
      {
        id: 'email-tender-scanning',
        title: 'Email Tender Scanning (ATS-001–010)',
        description:
          'Outlook US/AT mailboxes, keyword scan, routing, 3× login retry, failure screenshots & notifications.',
        path: '/tender-discovery/email-scanning',
        color: 'success',
        statusLabel: 'ATS',
        metric: '10 requirements',
        actionLabel: 'Open email RTM'
      },
      {
        id: 'discovery-dashboard',
        title: 'Discovery dashboard',
        description: 'Monitor connector health, sync cadence, and ingestion throughput.',
        path: '/tender-discovery',
        scrollTarget: 'discovery-dashboard-panel',
        color: 'primary',
        statusLabel: 'Live',
        metric: `${metrics.configuredConnectors} of ${metrics.connectorTotal || 0} connectors active`,
        actionLabel: 'View telemetry'
      },
      {
        id: 'discovery-source-config',
        title: 'Source configuration',
        description:
          'Add discovery portals (API or web scrape), saved credentials, bot frequency, and lookback hours.',
        path: '/admin-config/discovery-connectors',
        color: 'success',
        statusLabel: 'Ready',
        metric: `${metrics.sourceCount} configured sources`,
        actionLabel: 'Configure connectors'
      },
      {
        id: 'discovery-saved-searches',
        title: 'Saved searches',
        description: 'Reuse watchlists and saved discovery filters.',
        path: '/tender-intelligence/sources',
        color: 'warning',
        statusLabel: 'Reusable',
        metric: `${metrics.savedSearchCount} saved searches`,
        actionLabel: 'Open watchlists'
      },
      {
        id: 'discovery-history',
        title: 'Discovery history',
        description: 'Review job logs and import outcomes.',
        path: '/tender-discovery/history',
        color: 'info',
        statusLabel: 'Auditable',
        metric: `${metrics.completedJobs} completed jobs`,
        actionLabel: 'Review history'
      },
      {
        id: 'discovery-import-queue',
        title: 'Import queue',
        description: 'Validate staged opportunities before pipeline promotion.',
        path: '/tender-discovery/import-queue',
        color: 'primary',
        statusLabel: metrics.activeAutomation ? 'In queue' : 'Clear',
        metric: `${metrics.importedTotal} imported opportunities`,
        actionLabel: 'Validate imports'
      },
      {
        id: 'discovery-scheduler',
        title: 'Discovery scheduler',
        description: 'Manage incremental sync schedules and retry windows.',
        path: '/tender-discovery/scheduler',
        color: 'success',
        statusLabel: metrics.schedulerEnabled ? 'Active' : 'Idle',
        metric: metrics.schedulerEnabled ? 'Incremental sync enabled' : 'Scheduler awaiting enablement',
        actionLabel: 'Open scheduler'
      },
      {
        id: 'discovery-metadata',
        title: 'Bid metadata (TB-006)',
        description: 'Program summaries, timelines, and contacts extracted on GovWin/SAM import.',
        path: '/tender-discovery/metadata',
        color: 'info',
        statusLabel: 'Intelligence',
        metric: 'GovWin field mapping',
        actionLabel: 'View metadata'
      }
    ],
    [metrics]
  )

  const showInitialLoader = loading && !dashboard && !error
  return (
    <div className="tender-discovery-hub page-enter page-bg-gradient intel-executive-page">
      <div className="intel-executive-page__hero">
        <div>
          <h1>Discovery operations console</h1>
          <p>
            Connector health, ingestion throughput, and automation cadence for government and market
            opportunity discovery.
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
          <small>Live connector and automation telemetry</small>
        </div>
      </div>

      {showInitialLoader ? (
        <div className="intel-loading-skeleton mb-3" />
      ) : null}

      {error ? (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      ) : null}

      {!error ? (
        <>
          <div className="intel-cinematic-hero mb-3">
            <h2 className="h4 mb-2">Ingestion intelligence outlook</h2>
            <p className="mb-0">
              {metrics.configuredConnectors} of {metrics.connectorTotal || 0} connectors are operational with{' '}
              {metrics.importedTotal} opportunities imported across recent discovery activity.
            </p>
            <div className="intel-cinematic-hero__chips">
              <span className="intel-chip">{metrics.completedJobs} completed jobs</span>
              <span className="intel-chip">{metrics.sourceCount} configured sources</span>
              <span className="intel-chip">{metrics.savedSearchCount} saved searches</span>
              <span className="intel-chip">
                Scheduler {metrics.schedulerEnabled ? 'active' : 'idle'}
              </span>
            </div>
          </div>

          <InsightStream items={insightItems} />

          <div className="intel-mission-control mb-3">
            <div className="pipeline-kpi-strip__head">
              <div>
                <span className="pipeline-kpi-strip__badge">Operating metrics</span>
                <h2 className="pipeline-kpi-strip__title">Discovery signal board</h2>
              </div>
              <small className="pipeline-kpi-strip__meta">Connector and automation health</small>
            </div>
            <Row className="g-3 mb-3">
              <Col xs={12} sm={6} xl={3}>
                <PremiumKpiCard
                  label="Configured connectors"
                  value={metrics.configuredConnectors}
                  hint={`${metrics.connectorTotal} in catalog`}
                  tone="intel"
                  trend="+stable"
                  icon={<Radar size={20} />}
                />
              </Col>
              <Col xs={12} sm={6} xl={3}>
                <PremiumKpiCard
                  label="Imported opportunities"
                  value={metrics.importedTotal}
                  hint="Across recent discovery jobs"
                  tone="success"
                  trend="+ingestion"
                  icon={<CloudDownload size={20} />}
                />
              </Col>
              <Col xs={12} sm={6} xl={3}>
                <PremiumKpiCard
                  label="Discovery jobs"
                  value={metrics.jobTotal}
                  hint={`${metrics.completedJobs} completed`}
                  tone="intel"
                  trend="Live queue"
                  icon={<Activity size={20} />}
                />
              </Col>
              <Col xs={12} sm={6} xl={3}>
                <PremiumKpiCard
                  label="Automation queue"
                  value={metrics.activeAutomation}
                  hint={`${metrics.retryingJobs} retrying`}
                  tone={metrics.retryingJobs > 0 ? 'risk' : 'warning'}
                  trend={metrics.failureCount ? `${metrics.failureCount} failures` : 'Healthy'}
                  icon={<CalendarClock size={20} />}
                />
              </Col>
            </Row>
          </div>

          <ModuleHubPage
            title="Discovery workspace"
            subtitle="Navigate ingestion, watchlists, history, queue validation, and scheduler controls."
            modules={hubModules}
            className="tender-discovery-hub__modules app-module-hub intel-module-hub"
          />

          <Row id="discovery-dashboard-panel" className="g-3 mb-3">
            <Col lg={7}>
              <Card className="intel-chart-card h-100">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">Recent discovery jobs</span>
                  <Badge bg="light" text="dark">
                    {metrics.jobTotal} total
                  </Badge>
                </Card.Header>
                <Card.Body className="discovery-job-list">
                  {loading ? <div className="intel-loading-skeleton" /> : null}
                  {!loading && !(dashboard?.jobs || []).length ? (
                    <p className="text-muted mb-0">No discovery jobs yet. Configure a source and run a sync.</p>
                  ) : null}
                  {(dashboard?.jobs || []).map((job) => (
                    <div key={job._id} className="discovery-job-row">
                      <div>
                        <div className="discovery-job-row__title">{job.connectorType}</div>
                        <div className="discovery-job-row__meta">
                          Scheduled {formatDateTime(job.scheduledAt)}
                        </div>
                      </div>
                      <div className="discovery-job-row__stats">
                        <div>
                          <span className="label">New / Updated</span>
                          <strong>
                            {job.stats?.new ?? 0} / {job.stats?.updated ?? 0}
                          </strong>
                        </div>
                        <Badge bg={statusTone(job.status)}>{job.status}</Badge>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5}>
              <Card className="intel-chart-card h-100">
                <Card.Header className="bg-white fw-semibold">Connector catalog</Card.Header>
                <Card.Body>
                  {(dashboard?.connectors || []).map((connector) => (
                    <div key={connector.key} className="connector-card">
                      <div>
                        <div className="connector-card__title">{connector.displayName}</div>
                        <div className="connector-card__meta">
                          Health {connector.health || 'unknown'} · API {connector.configured ? 'ready' : 'pending'}
                        </div>
                      </div>
                      <Badge bg={connector.configured ? 'success' : 'secondary'}>
                        {connector.configured ? 'Configured' : connector.message || 'Not configured'}
                      </Badge>
                    </div>
                  ))}
                  {!dashboard?.connectors?.length ? (
                    <p className="text-muted mb-0">No connectors available in the catalog.</p>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col lg={6}>
              <Card className="intel-chart-card h-100">
                <Card.Header className="bg-white fw-semibold">Source configuration</Card.Header>
                <Card.Body className="discovery-source-list">
                  {(dashboard?.sources || []).map((source) => (
                    <div key={source._id} className="discovery-source-item">
                      <div className="discovery-source-item__title">{source.name}</div>
                      <div className="discovery-source-item__meta">{source.description || 'Configured ingestion source'}</div>
                    </div>
                  ))}
                  {!dashboard?.sources?.length ? (
                    <p className="text-muted mb-0">No configured sources yet.</p>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="intel-chart-card h-100">
                <Card.Header className="bg-white fw-semibold">Saved searches</Card.Header>
                <Card.Body className="discovery-source-list">
                  {(dashboard?.savedSearches || []).map((search) => (
                    <div key={search._id} className="discovery-source-item">
                      <div className="discovery-source-item__title">
                        {search.name || search.title || 'Saved search'}
                      </div>
                      <div className="discovery-source-item__meta">
                        {search.description || search.query || 'Reusable discovery filter'}
                      </div>
                    </div>
                  ))}
                  {!dashboard?.savedSearches?.length ? (
                    <p className="text-muted mb-0">No saved searches yet.</p>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="intel-chart-card">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Automation console</span>
              <Badge bg={metrics.failureCount ? 'warning' : 'success'}>
                {metrics.activeAutomation} active
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {(automation?.jobs || []).slice(0, 6).map((job) => (
                  <Col md={6} key={job._id}>
                    <div className="automation-job-card">
                      <div>
                        <div className="fw-semibold">{job.jobType}</div>
                        <div className="small text-muted">{job.status}</div>
                      </div>
                      <Badge bg={statusTone(job.status)}>{job.attempts || 0} attempts</Badge>
                    </div>
                  </Col>
                ))}
              </Row>
              {!automation?.jobs?.length ? <p className="text-muted mb-0">No automation jobs yet.</p> : null}
            </Card.Body>
          </Card>
        </>
      ) : null}
    </div>
  )
}

export default TenderDiscoveryHub
