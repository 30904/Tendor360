import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Row, Spinner } from 'react-bootstrap'
import {
  BookOpen,
  Brain,
  FileSpreadsheet,
  RefreshCw,
  Scale,
  Truck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import '../tender-discovery/TenderDiscoveryPages.scss'

const statusClass = (status) => {
  if (status === 'active') return 'rtm-status-pill--active'
  if (status === 'ready') return 'rtm-status-pill--ready'
  return 'rtm-status-pill--pending'
}

const TenderIntelligenceRtmPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await intelligenceAPI.getTenderIntelligenceRtm()
      setData(res.data?.data ?? null)
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load tender intelligence status')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const requirements = data?.requirements || []
  const counts = data?.summary?.counts || {}
  const activeCount = requirements.filter((r) => r.status === 'active').length

  const insights = useMemo(
    () => [
      {
        title: 'Tender Intelligence (TB-006 – TB-010)',
        detail:
          'Metadata, commercial fields, T&C, pricing lines, and relevancy scoring run after discovery import or on demand.',
        tone: 'info',
      },
      activeCount >= 4
        ? {
            title: `${activeCount} of 5 intelligence requirements active`,
            detail: 'Run discovery sync then review scored opportunities in the pipeline.',
            tone: 'success',
          }
        : {
            title: 'Run discovery or POST intelligence on a tender to populate fields',
            detail: 'Use Discovery Connectors → Run now, or open a pipeline tender and run intelligence.',
            tone: 'warning',
          },
    ],
    [activeCount]
  )

  return (
    <ExecutiveCommandCenter
      className="tender-discovery-subpage"
      showSkeleton={loading && !data}
      breadcrumbs={[
        { label: 'AI Document Intelligence', onClick: () => navigate('/ai-document-intelligence') },
        { label: 'Tender Intelligence RTM', active: true },
      ]}
      onBack={() => navigate('/ai-document-intelligence')}
      backLabel="Back to AI hub"
      title="Tender Intelligence"
      description="RTM alignment for metadata extraction, commercial fields, terms & conditions, pricing sheets, and relevancy scoring (TB-006–TB-010)."
      heroMeta="TB-006 · TB-010"
      heroActions={
        <Button size="sm" variant="outline-primary" onClick={load} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <RefreshCw size={16} className="me-1" />}
          Refresh
        </Button>
      }
      outlookTitle="Intelligence extraction outlook"
      outlookDescription={`${counts.metadata || 0} metadata · ${counts.commercial || 0} commercial · ${counts.terms || 0} T&C · ${counts.pricing || 0} pricing · ${counts.scores || 0} scores.`}
      insights={insights}
      error={error}
      kpiContent={
        <Row className="g-3 mb-3">
          <Col sm={6} xl={4}>
            <PremiumKpiCard label="Metadata (TB-006)" value={counts.metadata || 0} tone="intel" icon={<BookOpen size={20} />} />
          </Col>
          <Col sm={6} xl={4}>
            <PremiumKpiCard label="Commercial (TB-007)" value={counts.commercial || 0} tone="success" icon={<Truck size={20} />} />
          </Col>
          <Col sm={6} xl={4}>
            <PremiumKpiCard label="T&C (TB-008)" value={counts.terms || 0} tone="warning" icon={<Scale size={20} />} />
          </Col>
          <Col sm={6} xl={4}>
            <PremiumKpiCard label="Pricing (TB-009)" value={counts.pricing || 0} tone="intel" icon={<FileSpreadsheet size={20} />} />
          </Col>
          <Col sm={6} xl={4}>
            <PremiumKpiCard label="Relevancy (TB-010)" value={counts.scores || 0} tone="success" icon={<Brain size={20} />} />
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
          <Button variant="primary" className="w-100" onClick={() => navigate('/tender-discovery/metadata')}>
            TB-006 Metadata feed
          </Button>
        </Col>
        <Col md={4}>
          <Button variant="outline-primary" className="w-100" onClick={() => navigate('/document-management/ai-analysis')}>
            Extraction review
          </Button>
        </Col>
        <Col md={4}>
          <Button variant="outline-primary" className="w-100" onClick={() => navigate('/qualification-evaluation/scoring')}>
            TB-010 Scoring profiles
          </Button>
        </Col>
      </Row>
    </ExecutiveCommandCenter>
  )
}

export default TenderIntelligenceRtmPage
