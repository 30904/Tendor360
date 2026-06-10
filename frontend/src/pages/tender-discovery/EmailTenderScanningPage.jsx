import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Row, Spinner, Table } from 'react-bootstrap'
import { AlertTriangle, Inbox, Mail, MailX, RefreshCw, Send, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './TenderDiscoveryPages.scss'

const statusClass = (status) => {
  if (status === 'active') return 'rtm-status-pill--active'
  if (status === 'ready') return 'rtm-status-pill--ready'
  if (status === 'not_available') return 'rtm-status-pill--pending'
  return 'rtm-status-pill--pending'
}

const decisionTone = (decision) => {
  if (decision === 'matched') return 'success'
  if (decision === 'partial') return 'info'
  if (decision === 'rejected') return 'danger'
  if (decision === 'image_oos') return 'secondary'
  return 'warning'
}

const EmailTenderScanningPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [data, setData] = useState(null)
  const [feed, setFeed] = useState([])
  const [mailboxes, setMailboxes] = useState([])
  const [failures, setFailures] = useState([])
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rtmRes, feedRes] = await Promise.all([
        intelligenceAPI.getEmailTenderRtm(),
        intelligenceAPI.getEmailTenderFeed({ limit: 40 })
      ])
      setData(rtmRes.data?.data ?? null)
      setFeed(feedRes.data?.data?.messages || [])
      setMailboxes(feedRes.data?.data?.mailboxes || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load email tender scanning')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const runSeed = async () => {
    setActionLoading(true)
    try {
      await intelligenceAPI.seedEmailTenderDemo()
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Seed failed')
    } finally {
      setActionLoading(false)
    }
  }

  const runSimulateFailure = async () => {
    setActionLoading(true)
    try {
      await intelligenceAPI.simulateEmailFailureDemo()
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Demo failure simulation failed')
    } finally {
      setActionLoading(false)
    }
  }

  const runScan = async () => {
    setActionLoading(true)
    try {
      await intelligenceAPI.scanEmailTenders()
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Scan failed')
    } finally {
      setActionLoading(false)
    }
  }

  const requirements = data?.requirements || []
  const counts = data?.summary?.counts || {}
  const summary = data?.summary || {}
  const activeCount = requirements.filter((r) => r.status === 'active').length

  const insights = useMemo(
    () => [
      {
        title: 'Email Tender Scanning (ATS-001 – ATS-007)',
        detail:
          'Outlook US + Austria mailboxes, keyword body/attachment scan, multi-link retain/reject, rejected folder, sales forward.',
        tone: 'info'
      },
      {
        title: 'ATS-008 — Image tenders',
        detail: 'Excluded per customer RTM (not available). Image-only emails are flagged, not imported.',
        tone: 'warning'
      },
      summary.graphConfigured
        ? { title: 'Microsoft Graph live', detail: 'Reading mailboxes via Graph API with 3× retry.', tone: 'success' }
        : {
            title: 'Demo inbox mode',
            detail: 'Load demo mailboxes, run Scan now, then trigger email discovery job from Discovery Connectors.',
            tone: 'warning'
          }
    ],
    [summary.graphConfigured]
  )

  return (
    <ExecutiveCommandCenter
      className="tender-discovery-subpage"
      showSkeleton={loading && !data}
      breadcrumbs={[
        { label: 'Tender Discovery', onClick: () => navigate('/tender-discovery') },
        { label: 'Email Tender Scanning', active: true }
      ]}
      onBack={() => navigate('/tender-discovery')}
      backLabel="Back to discovery"
      title="Email Tender Scanning"
      description="ATS-001–ATS-010: Outlook intake, keyword scan, routing, 3× login retry, and failure screenshots to BOT admin / support."
      heroMeta="ATS-001 · ATS-010"
      heroActions={
        <>
          <Button size="sm" variant="outline-secondary" onClick={runSeed} disabled={actionLoading}>
            Load demo mailboxes
          </Button>
          <Button size="sm" variant="outline-primary" className="ms-2" onClick={runScan} disabled={actionLoading}>
            {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : <Inbox size={16} className="me-1" />}
            Scan now
          </Button>
          <Button size="sm" variant="outline-warning" className="ms-2" onClick={runSimulateFailure} disabled={actionLoading}>
            Simulate failure (ATS-010)
          </Button>
          <Button size="sm" variant="outline-primary" className="ms-2" onClick={load} disabled={loading}>
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </>
      }
      outlookTitle="Email scan outlook"
      outlookDescription={`${summary.mailboxes || 0} mailbox(es) · ${counts.matched || 0} matched · ${counts.rejected || 0} rejected · ${counts.forwarded || 0} forwarded.`}
      insights={insights}
      error={error}
      kpiContent={
        <Row className="g-3 mb-3">
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Mailboxes" value={summary.mailboxes || 0} tone="intel" icon={<Mail size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Matched" value={counts.matched || 0} tone="success" icon={<Send size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Rejected" value={counts.rejected || 0} tone="warning" icon={<MailX size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Image OOS" value={counts.imageOos || 0} tone="intel" icon={<ShieldAlert size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard
              label="Failure artifacts"
              value={counts.failureArtifacts || 0}
              tone="warning"
              icon={<AlertTriangle size={20} />}
            />
          </Col>
        </Row>
      }
    >
      <Row className="g-3 mb-4">
        {requirements.map((req) => (
          <Col key={req.id} md={6} xl={4}>
            <div className="rtm-req-card">
              <div className="rtm-req-card__head">
                <span className="rtm-req-card__id">{req.id}</span>
                <span className={`rtm-status-pill ${statusClass(req.status)}`}>{req.status}</span>
              </div>
              <h3 className="rtm-req-card__title">{req.title}</h3>
              <p className="rtm-req-card__detail mb-0">{req.detail}</p>
            </div>
          </Col>
        ))}
      </Row>

      {mailboxes.length > 0 ? (
        <div className="rtm-section-card mb-4">
          <div className="rtm-section-card__head">
            <h3 className="mb-0">Configured mailboxes (ATS-001)</h3>
          </div>
          <Table responsive className="mb-0">
            <thead>
              <tr>
                <th>Region</th>
                <th>Email</th>
                <th>Forward to</th>
                <th>Last scan</th>
              </tr>
            </thead>
            <tbody>
              {mailboxes.map((mb) => (
                <tr key={mb._id}>
                  <td>{mb.region}</td>
                  <td>{mb.email}</td>
                  <td>{(mb.forwardTo || []).join(', ') || '—'}</td>
                  <td>{mb.lastScanAt ? new Date(mb.lastScanAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : null}

      {failures.length > 0 ? (
        <div className="rtm-section-card mb-4">
          <div className="rtm-section-card__head">
            <h3 className="mb-0">Error handling &amp; monitoring (ATS-009 / ATS-010)</h3>
          </div>
          <Table responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Req</th>
                <th>Error</th>
                <th>Notified</th>
                <th>Screenshot</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {failures.map((row) => (
                <tr key={row._id}>
                  <td>
                    <Badge bg="warning">{row.requirementId || '—'}</Badge>
                  </td>
                  <td className="small">{row.errorMessage}</td>
                  <td>{row.notificationSentAt ? 'Yes' : 'Logged'}</td>
                  <td>
                    {row.screenshotUrl ? (
                      <a href={row.screenshotUrl} target="_blank" rel="noreferrer">
                        View artifact
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="small">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : null}

      <div className="rtm-section-card">
        <div className="rtm-section-card__head d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Processed messages</h3>
          <span className="text-muted small">{activeCount} of {requirements.length} RTM items active</span>
        </div>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Region</th>
              <th>Decision</th>
              <th>Mode</th>
              <th>Keywords</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            {feed.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-muted text-center py-4">
                  No messages yet. Load demo mailboxes, then Scan now.
                </td>
              </tr>
            ) : (
              feed.map((row) => (
                <tr key={row._id}>
                  <td>{row.subject}</td>
                  <td>{row.mailboxId?.region || '—'}</td>
                  <td>
                    <Badge bg={decisionTone(row.decision)}>{row.decision}</Badge>
                  </td>
                  <td>{row.scan?.scanMode || '—'}</td>
                  <td>{(row.scan?.matchedKeywords || []).slice(0, 3).join(', ') || '—'}</td>
                  <td>
                    {row.linkSections?.length
                      ? `${row.linkSections.filter((s) => s.retained).length}/${row.linkSections.length} retained`
                      : row.hasLinks
                        ? '0 links'
                        : 'no links'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </ExecutiveCommandCenter>
  )
}

export default EmailTenderScanningPage
