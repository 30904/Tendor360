import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Row, Spinner, Table } from 'react-bootstrap'
import { CalendarClock, Clock, Radar, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './TenderDiscoveryPages.scss'

const DiscoverySchedulerPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboard, setDashboard] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await intelligenceAPI.getDiscoveryDashboard()
      setDashboard(res.data?.data ?? null)
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load scheduler')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const scheduler = dashboard?.scheduler || {}
  const sources = dashboard?.sources || []
  const dailySources = sources.filter((s) => s.frequency === 'daily' || s.frequency === 'every_4_hours')
  const lookback24 = sources.filter((s) => (s.discoveryConfig?.lookbackHours ?? 24) === 24).length

  const insights = useMemo(
    () => [
      {
        title: 'TB-002 — Daily scan for bids in last 24 hours',
        detail:
          'Each scheduled job passes modifiedSince / postedFrom based on source lookbackHours (default 24). GovWin and SAM.gov connectors honor this window.',
        tone: 'info',
      },
      scheduler.enabled
        ? {
            title: 'Discovery scheduler is running',
            detail: `Polling every ${Math.round((scheduler.intervalMs || 60000) / 1000)}s for sources due for sync.`,
            tone: 'success',
          }
        : {
            title: 'Scheduler idle',
            detail: 'Start the backend with schedulers enabled to run unattended discovery bots.',
            tone: 'warning',
          },
    ],
    [scheduler]
  )

  return (
    <ExecutiveCommandCenter
      className="tender-discovery-subpage"
      showSkeleton={loading && !dashboard}
      breadcrumbs={[
        { label: 'Tender Discovery', onClick: () => navigate('/tender-discovery') },
        { label: 'Scheduler', active: true },
      ]}
      onBack={() => navigate('/tender-discovery')}
      backLabel="Back to hub"
      title="Discovery scheduler & 24h scan"
      description="Unattended BOT cadence: daily frequency on connectors, 24-hour lookback window, and next-sync scheduling per portal (TB-002)."
      heroMeta="TB-002 · Automated BOT"
      heroActions={
        <>
          <Button size="sm" variant="outline-primary" onClick={load} disabled={loading} className="me-2">
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <RefreshCw size={16} className="me-1" />}
            Refresh
          </Button>
          <Button size="sm" variant="primary" onClick={() => navigate('/admin-config/discovery-connectors')}>
            <Radar size={16} className="me-1" />
            Configure sources
          </Button>
        </>
      }
      outlookTitle="Scheduler policy"
      outlookDescription={`${dailySources.length} source(s) on daily/4h cadence · ${lookback24} with 24h lookback · Scheduler ${scheduler.enabled ? 'active' : 'idle'}.`}
      insights={insights}
      error={error}
      kpiContent={
        <Row className="g-3 mb-3">
          <Col sm={6} xl={4}>
            <PremiumKpiCard
              label="Scheduler"
              value={scheduler.enabled ? 'On' : 'Off'}
              tone={scheduler.enabled ? 'success' : 'warning'}
              icon={<CalendarClock size={20} />}
            />
          </Col>
          <Col sm={6} xl={4}>
            <PremiumKpiCard label="24h lookback" value={lookback24} hint="TB-002 sources" tone="intel" icon={<Clock size={20} />} />
          </Col>
          <Col sm={6} xl={4}>
            <PremiumKpiCard label="Active sources" value={sources.filter((s) => s.status === 'active').length} tone="success" icon={<Radar size={20} />} />
          </Col>
        </Row>
      }
      tableTitle="Scheduled sources"
    >
      <Table hover responsive className="discovery-data-table mb-0">
        <thead>
          <tr>
            <th>Source</th>
            <th>Template</th>
            <th>Frequency</th>
            <th>Lookback</th>
            <th>Next sync</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((s) => (
            <tr key={s._id}>
              <td className="fw-semibold">{s.name}</td>
              <td>{s.connectorTemplate || '—'}</td>
              <td>{s.frequency}</td>
              <td>{s.discoveryConfig?.lookbackHours ?? 24}h</td>
              <td>{s.nextSync ? new Date(s.nextSync).toLocaleString() : '—'}</td>
              <td>
                <Badge bg={s.status === 'active' ? 'success' : 'secondary'}>{s.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!loading && !sources.length ? (
        <p className="text-muted text-center py-4 mb-0">
          No sources configured. Use Discovery Connectors to add GovWin/SAM portals for MediCare.
        </p>
      ) : null}
    </ExecutiveCommandCenter>
  )
}

export default DiscoverySchedulerPage
