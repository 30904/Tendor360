import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Row, Spinner } from 'react-bootstrap'
import {
  CheckCircle2,
  Clock,
  FileDown,
  GitCompare,
  Radar,
  RefreshCw,
  ScanSearch,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './TenderDiscoveryPages.scss'

const statusClass = (status) => {
  if (status === 'active') return 'rtm-status-pill--active'
  if (status === 'ready') return 'rtm-status-pill--ready'
  return 'rtm-status-pill--pending'
}

const DiscoveryProspectingPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await intelligenceAPI.getDiscoveryProspectingRtm()
      setData(res.data?.data ?? null)
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load prospecting requirements')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const requirements = data?.requirements || []
  const totals = data?.summary?.totals || {}
  const activeCount = requirements.filter((r) => r.status === 'active').length

  const insights = useMemo(() => {
    const items = [
      {
        title: 'Tender Discovery & Prospecting (TB-001 – TB-006)',
        detail:
          'GovWin/SAM connectors, 24-hour lookback scans, new vs updated bid detection, attachment harvest, SAM fallback, and metadata extraction on import.',
        tone: 'info',
      },
    ]
    if (activeCount < 6) {
      items.push({
        title: `${6 - activeCount} requirement(s) need configuration or a discovery run`,
        detail: 'Open Discovery Connectors, load healthcare demo data, then run a scheduled or manual sync.',
        tone: 'warning',
      })
    } else {
      items.push({
        title: 'All Phase 1 prospecting requirements are operational',
        detail: 'Review import queue and metadata feed for operator validation.',
        tone: 'success',
      })
    }
    return items
  }, [activeCount])

  return (
    <ExecutiveCommandCenter
      className="tender-discovery-subpage"
      showSkeleton={loading && !data}
      breadcrumbs={[
        { label: 'Tender Discovery', onClick: () => navigate('/tender-discovery') },
        { label: 'Prospecting RTM', active: true },
      ]}
      onBack={() => navigate('/tender-discovery')}
      backLabel="Back to discovery hub"
      title="Tender discovery & prospecting"
      description="RTM alignment for MediCare and healthcare buyers: GovWin login, 24h bid scan, new/updated detection, document download, SAM.gov fallback, and GovWin metadata extraction."
      heroMeta="TB-001 · TB-006 · Phase A"
      heroActions={
        <Button size="sm" variant="outline-primary" onClick={load} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <RefreshCw size={16} className="me-1" />}
          Refresh
        </Button>
      }
      outlookTitle="Prospecting compliance outlook"
      outlookDescription={`${activeCount} of 6 RTM requirements active · ${totals.new || 0} new and ${totals.updated || 0} updated in recent import batches.`}
      outlookChips={[
        `${activeCount}/6 active`,
        `${totals.attachments || 0} attachments`,
        data?.scheduler?.enabled ? 'Scheduler on' : 'Scheduler idle',
      ]}
      insights={insights}
      error={error}
      kpiBadge="RTM metrics"
      kpiTitle="Prospecting signal board"
      kpiContent={
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="RTM active" value={activeCount} hint="Of 6 requirements" tone="success" icon={<CheckCircle2 size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="New bids" value={totals.new || 0} hint="TB-003 last imports" tone="intel" icon={<Sparkles size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Updated bids" value={totals.updated || 0} hint="Change detection" tone="warning" icon={<GitCompare size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Attachments"
              value={totals.attachments || 0}
              hint={totals.samFallback ? 'SAM fallback used' : 'TB-004 / TB-005'}
              tone="intel"
              icon={<FileDown size={20} />}
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
              <h4>{req.title}</h4>
              <p>{req.detail}</p>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        <Col md={4}>
          <Button variant="primary" className="w-100 mb-2" onClick={() => navigate('/admin-config/discovery-connectors')}>
            <Radar size={16} className="me-2" />
            TB-001 Connectors
          </Button>
        </Col>
        <Col md={4}>
          <Button variant="outline-primary" className="w-100 mb-2" onClick={() => navigate('/tender-discovery/scheduler')}>
            <Clock size={16} className="me-2" />
            TB-002 Scheduler
          </Button>
        </Col>
        <Col md={4}>
          <Button variant="outline-primary" className="w-100 mb-2" onClick={() => navigate('/tender-discovery/metadata')}>
            <ScanSearch size={16} className="me-2" />
            TB-006 Metadata
          </Button>
        </Col>
      </Row>
    </ExecutiveCommandCenter>
  )
}

export default DiscoveryProspectingPage
