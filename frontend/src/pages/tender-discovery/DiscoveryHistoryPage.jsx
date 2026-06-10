import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Row, Spinner, Table } from 'react-bootstrap'
import { Activity, GitCompare, Plus, RefreshCw, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './TenderDiscoveryPages.scss'

const statusTone = (status) => {
  const k = String(status || '').toLowerCase()
  if (k === 'completed') return 'success'
  if (k === 'running' || k === 'queued') return 'warning'
  if (k === 'failed') return 'danger'
  return 'secondary'
}

const formatDateTime = (v) => (v ? new Date(v).toLocaleString() : '—')

const DiscoveryHistoryPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jobs, setJobs] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await intelligenceAPI.getDiscoveryJobs({ limit: 50 })
      setJobs(res.data?.data?.jobs || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load discovery history')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    const completed = jobs.filter((j) => j.status === 'completed').length
    const totalNew = jobs.reduce((s, j) => s + (j.stats?.new || 0), 0)
    const totalUpdated = jobs.reduce((s, j) => s + (j.stats?.updated || 0), 0)
    const attachments = jobs.reduce((s, j) => s + (j.stats?.attachmentsDownloaded || 0), 0)
    return { completed, totalNew, totalUpdated, attachments, total: jobs.length }
  }, [jobs])

  const insights = useMemo(
    () => [
      {
        title: 'TB-003 — New vs updated bid identification',
        detail:
          'Each job applies content-hash change detection: new opportunities create pipeline records; updates refresh metadata and attachments.',
        tone: 'info',
      },
      stats.totalNew + stats.totalUpdated > 0
        ? {
            title: `${stats.totalNew} new · ${stats.totalUpdated} updated across jobs`,
            detail: `${stats.attachments} attachment(s) harvested (TB-004).`,
            tone: 'success',
          }
        : {
            title: 'No import activity yet',
            detail: 'Run discovery from Admin → Discovery Connectors.',
            tone: 'warning',
          },
    ],
    [stats]
  )

  return (
    <ExecutiveCommandCenter
      className="tender-discovery-subpage"
      showSkeleton={loading && !jobs.length}
      breadcrumbs={[
        { label: 'Tender Discovery', onClick: () => navigate('/tender-discovery') },
        { label: 'Discovery history', active: true },
      ]}
      onBack={() => navigate('/tender-discovery')}
      backLabel="Back to hub"
      title="Discovery job history"
      description="Audit trail for scheduled and manual discovery runs — discovered, imported, new, updated, and attachment counts per job."
      heroMeta="TB-002 · TB-003 · TB-004"
      heroActions={
        <Button size="sm" variant="outline-primary" onClick={load} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <RefreshCw size={16} className="me-1" />}
          Refresh
        </Button>
      }
      outlookTitle="Job execution outlook"
      outlookDescription={`${stats.completed} completed of ${stats.total} jobs · ${stats.totalNew} new and ${stats.totalUpdated} updated opportunities.`}
      insights={insights}
      error={error}
      kpiContent={
        <Row className="g-3 mb-3">
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Jobs" value={stats.total} tone="intel" icon={<Activity size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="New" value={stats.totalNew} tone="success" icon={<Plus size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Updated" value={stats.totalUpdated} tone="warning" icon={<GitCompare size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Attachments" value={stats.attachments} tone="intel" icon={<Sparkles size={20} />} />
          </Col>
        </Row>
      }
      tableTitle="Discovery jobs"
    >
      {loading && jobs.length > 0 ? (
        <div className="text-center py-2">
          <Spinner animation="border" size="sm" />
        </div>
      ) : null}
      <div className="discovery-connectors-table-wrap">
        <Table hover responsive className="discovery-data-table mb-0">
          <thead>
            <tr>
              <th>Connector</th>
              <th>Trigger</th>
              <th>Lookback</th>
              <th>Discovered</th>
              <th>New</th>
              <th>Updated</th>
              <th>Attachments</th>
              <th>Status</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td className="fw-semibold">{job.connectorType}</td>
                <td>{job.trigger}</td>
                <td>{job.lookbackHours ?? 24}h</td>
                <td>{job.stats?.discovered ?? 0}</td>
                <td>{job.stats?.new ?? 0}</td>
                <td>{job.stats?.updated ?? 0}</td>
                <td>{job.stats?.attachmentsDownloaded ?? 0}</td>
                <td>
                  <Badge bg={statusTone(job.status)}>{job.status}</Badge>
                </td>
                <td>{formatDateTime(job.completedAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {!loading && !jobs.length ? (
          <p className="text-muted text-center py-4 mb-0">No discovery jobs yet.</p>
        ) : null}
      </div>
    </ExecutiveCommandCenter>
  )
}

export default DiscoveryHistoryPage
