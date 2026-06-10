import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Row, Spinner } from 'react-bootstrap'
import { BookOpen, RefreshCw, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './TenderDiscoveryPages.scss'

const formatDate = (v) => (v ? new Date(v).toLocaleString() : '—')

const DiscoveryMetadataPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [tenders, setTenders] = useState([])
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await intelligenceAPI.getDiscoveryMetadata({ limit: 50 })
      setTenders(res.data?.data?.tenders || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load metadata feed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const withContacts = tenders.filter((t) => (t.discovery?.metadata?.contacts || []).length > 0).length

  const insights = useMemo(
    () => [
      {
        title: 'TB-006 — GovWin metadata on import',
        detail:
          'Program summary, solicitation timeline, and procurement contacts are mapped when opportunities are ingested from GovWin or SAM.gov.',
        tone: 'info',
      },
      tenders.length
        ? {
            title: `${tenders.length} tender(s) with extracted metadata`,
            detail: 'Open pipeline workspace for full document AI extraction on downloaded attachments.',
            tone: 'success',
          }
        : {
            title: 'No metadata yet',
            detail: 'Run a discovery job from Discovery Connectors or wait for the daily 24h scheduler.',
            tone: 'warning',
          },
    ],
    [tenders.length]
  )

  return (
    <ExecutiveCommandCenter
      className="tender-discovery-subpage"
      showSkeleton={loading && !tenders.length}
      breadcrumbs={[
        { label: 'Tender Discovery', onClick: () => navigate('/tender-discovery') },
        { label: 'Bid metadata', active: true },
      ]}
      onBack={() => navigate('/tender-discovery/prospecting')}
      backLabel="Back to prospecting"
      title="Bid metadata extraction"
      description="Program summaries, response timelines, and procurement contacts extracted from GovWin-style connector fields (TB-006)."
      heroMeta="TB-006 · Tender intelligence"
      heroActions={
        <Button size="sm" variant="outline-primary" onClick={load} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <RefreshCw size={16} className="me-1" />}
          Refresh
        </Button>
      }
      outlookTitle="Metadata extraction outlook"
      outlookDescription={`${tenders.length} opportunities with structured discovery metadata · ${withContacts} include contact emails.`}
      insights={insights}
      error={error}
      kpiContent={
        <Row className="g-3 mb-3">
          <Col sm={6} xl={4}>
            <PremiumKpiCard label="With metadata" value={tenders.length} tone="intel" icon={<BookOpen size={20} />} />
          </Col>
          <Col sm={6} xl={4}>
            <PremiumKpiCard label="With contacts" value={withContacts} tone="success" icon={<UserRound size={20} />} />
          </Col>
        </Row>
      }
    >
      {loading && !tenders.length ? (
        <div className="text-center py-4">
          <Spinner animation="border" size="sm" />
        </div>
      ) : null}
      {!loading && !tenders.length ? (
        <p className="text-muted">Run discovery on GovWin or SAM.gov connectors to populate metadata.</p>
      ) : null}
      {tenders.map((t) => {
        const meta = t.discovery?.metadata || {}
        return (
          <div key={t._id} className="metadata-card">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <div className="metadata-card__title">{t.title}</div>
                <div className="metadata-card__ref">
                  {t.reference} · {t.organization}
                </div>
              </div>
              <Badge bg="light" text="dark">
                {t.discovery?.connectorType || meta.sourceConnector || 'discovery'}
              </Badge>
            </div>
            {meta.programSummary ? (
              <p className="metadata-card__summary">{meta.programSummary}</p>
            ) : null}
            <div className="d-flex flex-wrap gap-2 mt-2">
              {meta.timeline?.responseDeadline ? (
                <span className="discovery-stat-chip">
                  Due {formatDate(meta.timeline.responseDeadline)}
                </span>
              ) : null}
              {meta.timeline?.updatedDate ? (
                <span className="discovery-stat-chip">Updated {formatDate(meta.timeline.updatedDate)}</span>
              ) : null}
              {(meta.contacts || []).slice(0, 2).map((c, i) => (
                <span key={i} className="discovery-stat-chip">
                  {c.value || c.email || JSON.stringify(c)}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </ExecutiveCommandCenter>
  )
}

export default DiscoveryMetadataPage
