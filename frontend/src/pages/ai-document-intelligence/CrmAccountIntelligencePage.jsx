import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Row, Spinner, Table } from 'react-bootstrap'
import { Building2, RefreshCw, Search, ShieldCheck, Users } from 'lucide-react'
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

const validationTone = (status) => {
  if (status === 'validated') return 'success'
  if (status === 'partial') return 'warning'
  if (status === 'not_found') return 'danger'
  return 'secondary'
}

const CrmAccountIntelligencePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [data, setData] = useState(null)
  const [feed, setFeed] = useState([])
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rtmRes, feedRes] = await Promise.all([
        intelligenceAPI.getCrmAccountRtm(),
        intelligenceAPI.getCrmValidationFeed({ limit: 25 })
      ])
      setData(rtmRes.data?.data ?? null)
      setFeed(feedRes.data?.data?.tenders || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load CRM account intelligence')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleSeed = async () => {
    setActionLoading(true)
    try {
      await intelligenceAPI.seedCrmDemo()
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Seed failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleValidateAll = async () => {
    setActionLoading(true)
    try {
      await intelligenceAPI.validateAllCrm({ limit: 25 })
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Bulk validation failed')
    } finally {
      setActionLoading(false)
    }
  }

  const requirements = data?.requirements || []
  const counts = data?.summary?.counts || {}
  const status = data?.summary?.status || {}

  const insights = useMemo(
    () => [
      {
        title: 'TB-011 — Salesforce account validation',
        detail:
          'Match issuing organization, ship-to address, and contact email against CRM cache or live Salesforce REST API.',
        tone: 'info'
      },
      status.configured
        ? {
            title: 'Live Salesforce API configured',
            detail: 'Account SOQL lookup runs before falling back to tenant CRM cache.',
            tone: 'success'
          }
        : {
            title: 'CRM cache mode (demo-ready)',
            detail: 'Load healthcare demo accounts, then validate opportunities from discovery imports.',
            tone: 'warning'
          }
    ],
    [status.configured]
  )

  return (
    <ExecutiveCommandCenter
      className="tender-discovery-subpage"
      showSkeleton={loading && !data}
      breadcrumbs={[
        { label: 'AI Document Intelligence', onClick: () => navigate('/ai-document-intelligence') },
        { label: 'CRM Account Intelligence', active: true }
      ]}
      onBack={() => navigate('/ai-document-intelligence')}
      backLabel="Back to AI hub"
      title="CRM / Account Intelligence"
      description="Validate customer accounts from Salesforce or tenant CRM cache by organization, ship-to, and contact (TB-011)."
      heroMeta="TB-011"
      heroActions={
        <>
          <Button size="sm" variant="outline-secondary" onClick={handleSeed} disabled={actionLoading}>
            Load CRM demo accounts
          </Button>
          <Button size="sm" variant="outline-primary" className="ms-2" onClick={handleValidateAll} disabled={actionLoading}>
            {actionLoading ? <Spinner animation="border" size="sm" className="me-2" /> : <Search size={16} className="me-1" />}
            Validate recent
          </Button>
          <Button size="sm" variant="outline-primary" className="ms-2" onClick={load} disabled={loading}>
            <RefreshCw size={16} className="me-1" />
            Refresh
          </Button>
        </>
      }
      outlookTitle="Account validation outlook"
      outlookDescription={`${status.cachedAccounts || 0} CRM accounts · ${counts.validated || 0} validated · ${counts.partial || 0} partial · ${counts.notFound || 0} not found.`}
      insights={insights}
      error={error}
      kpiContent={
        <Row className="g-3 mb-3">
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="CRM accounts" value={status.cachedAccounts || 0} tone="intel" icon={<Building2 size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Validated" value={counts.validated || 0} tone="success" icon={<ShieldCheck size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Partial match" value={counts.partial || 0} tone="warning" icon={<Users size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Not found" value={counts.notFound || 0} tone="intel" icon={<Search size={20} />} />
          </Col>
        </Row>
      }
    >
      <Row className="g-3 mb-4">
        {requirements.map((req) => (
          <Col key={req.id} md={12} lg={8}>
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

      <div className="rtm-section-card">
        <div className="rtm-section-card__head">
          <h3 className="mb-0">Recent validations</h3>
        </div>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Match</th>
              <th>Account</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {feed.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-muted py-4 text-center">
                  No validations yet. Seed CRM accounts and run Validate recent, or open an opportunity workspace.
                </td>
              </tr>
            ) : (
              feed.map((row) => (
                <tr key={row._id}>
                  <td>{row.reference || '—'}</td>
                  <td>{row.organization || '—'}</td>
                  <td>
                    <Badge bg={validationTone(row.crmValidation?.status)}>{row.crmValidation?.status || '—'}</Badge>
                  </td>
                  <td>{row.crmValidation?.matchScore != null ? `${row.crmValidation.matchScore}%` : '—'}</td>
                  <td>{row.crmValidation?.matchedAccountName || '—'}</td>
                  <td>{row.crmValidation?.matchMethod || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </ExecutiveCommandCenter>
  )
}

export default CrmAccountIntelligencePage
