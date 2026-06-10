import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { BiRefresh } from 'react-icons/bi'
import ModuleHubPage from '../../components/hub/ModuleHubPage'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import InsightStream from '../../components/intelligence/InsightStream'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './AiDocumentIntelligenceHub.scss'

const modules = [
  {
    id: 'tender-intelligence-rtm',
    title: 'Tender Intelligence RTM',
    description: 'TB-006–TB-010 status: metadata, commercial, T&C, pricing, relevancy scoring.',
    path: '/ai-document-intelligence/rtm',
    color: 'primary',
    statusLabel: 'RTM',
    metric: '5 requirements',
    actionLabel: 'Open RTM board'
  },
  {
    id: 'crm-account-intelligence',
    title: 'CRM Account Intelligence',
    description: 'TB-011: validate customer/account from Salesforce by organization, ship-to, and contact.',
    path: '/ai-document-intelligence/crm',
    color: 'success',
    statusLabel: 'TB-011',
    metric: 'Salesforce + cache',
    actionLabel: 'Open CRM board'
  },
  {
    id: 'ai-analysis',
    title: 'AI extraction review',
    description: 'Run OCR, metadata, clause, pricing, and contact extraction pipelines.',
    path: '/document-management/ai-analysis',
    color: 'primary'
  },
  {
    id: 'submission-builder',
    title: 'AI summary view',
    description: 'Review generated summaries and extracted opportunity fields.',
    path: '/document-management/submission-builder',
    color: 'success'
  },
  {
    id: 'redaction-rules',
    title: 'Clause viewer',
    description: 'Inspect extracted clauses and risk signals.',
    path: '/document-management/redaction-rules',
    color: 'warning'
  },
  {
    id: 'version-control',
    title: 'Document comparison',
    description: 'Compare versions and validate extracted field changes.',
    path: '/document-management/version-control',
    color: 'info'
  }
]

const clauseGroups = [
  'insurance',
  'compliance',
  'delivery',
  'pricing',
  'indemnification',
  'terms',
  'eligibility'
]

const riskTone = (level) => {
  const key = String(level || '').toLowerCase()
  if (key === 'high' || key === 'critical') return 'danger'
  if (key === 'medium') return 'warning'
  return 'secondary'
}

const confidenceTone = (value) => {
  if (value >= 85) return 'high'
  if (value >= 70) return 'medium'
  return 'low'
}

const AiDocumentIntelligenceHub = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')

  const load = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await intelligenceAPI.listDocumentIntelligence()
      setItems(res.data?.data?.items || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load document intelligence')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const metrics = useMemo(() => {
    const fields = items.flatMap((item) => item.fields || [])
    const clauses = items.flatMap((item) => item.clauses || [])
    const validated = fields.filter((field) => field.validated).length
    const avgConfidence = fields.length
      ? Math.round(fields.reduce((sum, field) => sum + (field.confidence || 0), 0) / fields.length)
      : 0
    const highRiskClauses = clauses.filter((clause) =>
      ['high', 'critical'].includes(String(clause.riskLevel || '').toLowerCase())
    ).length
    const pendingValidation = fields.filter((field) => !field.validated).length

    return {
      packages: items.length,
      fields: fields.length,
      clauses: clauses.length,
      validated,
      avgConfidence,
      highRiskClauses,
      pendingValidation
    }
  }, [items])

  const insightItems = useMemo(() => {
    const clauses = items.flatMap((item) => item.clauses || [])
    const fields = items.flatMap((item) => item.fields || [])
    const itemsOut = []

    if (clauses.some((clause) => clause.clauseType === 'insurance')) {
      itemsOut.push({
        title: 'Unusual insurance requirement detected in active solicitations',
        detail: 'Review indemnification and coverage thresholds before bid submission.',
        tone: 'warning'
      })
    }

    if (clauses.some((clause) => clause.clauseType === 'delivery')) {
      itemsOut.push({
        title: 'Potential delivery timeline conflict identified',
        detail: 'Cold-chain and installation packages may require schedule validation.',
        tone: 'warning'
      })
    }

    if (fields.some((field) => field.fieldKey === 'pricing' && !field.validated)) {
      itemsOut.push({
        title: 'Pricing document missing mandatory section',
        detail: 'One or more pricing sheets still require human validation.',
        tone: 'warning'
      })
    }

    itemsOut.push({
      title: `${metrics.packages} solicitation packages processed through extraction pipelines`,
      detail: `${metrics.validated} validated fields and ${metrics.clauses} clause signals available for review.`,
      tone: 'info'
    })

    if (!itemsOut.some((item) => item.tone === 'warning')) {
      itemsOut.unshift({
        title: 'Document extraction confidence is within executive review thresholds',
        detail: 'Insurance, delivery, and pricing clauses are ready for committee validation.',
        tone: 'success'
      })
    }

    return itemsOut.slice(0, 4)
  }, [items, metrics])

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items
    return items.filter((item) => {
      const documentName = item.extraction.documentId?.name || ''
      const reference = item.extraction.tenderId?.reference || ''
      return [documentName, reference].some((value) => String(value).toLowerCase().includes(needle))
    })
  }, [items, query])

  const groupedClauses = useMemo(() => {
    const map = Object.fromEntries(clauseGroups.map((group) => [group, []]))
    items.forEach((item) => {
      ;(item.clauses || []).forEach((clause) => {
        const key = clauseGroups.includes(clause.clauseType) ? clause.clauseType : 'terms'
        map[key].push({ ...clause, reference: item.extraction.tenderId?.reference })
      })
    })
    return map
  }, [items])

  const featured = filteredItems[0] || items[0]
  const showInitialLoader = loading && !items.length && !error

  return (
    <div className="ai-doc-intel-hub page-enter page-bg-gradient intel-executive-page">
      <div className="intel-executive-page__hero">
        <div>
          <h1>AI document intelligence command center</h1>
          <p>
            Enterprise extraction pipelines for PDF, DOCX, XLSX, and scanned tender packages with clause
            intelligence and validation workflows.
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
          <small>Extraction confidence and clause telemetry</small>
        </div>
      </div>

      {showInitialLoader ? <div className="intel-loading-skeleton mb-3" /> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}

      {!error ? (
        <>
          <div className="intel-cinematic-hero mb-3">
            <h2 className="h4 mb-2">Extraction intelligence outlook</h2>
            <p className="mb-0">
              {metrics.packages} packages analyzed with {metrics.avgConfidence || 0}% average field confidence
              and {metrics.highRiskClauses} high-risk clause signals under review.
            </p>
            <div className="intel-cinematic-hero__chips">
              <span className="intel-chip">{metrics.fields} extracted fields</span>
              <span className="intel-chip">{metrics.clauses} clause signals</span>
              <span className="intel-chip">{metrics.validated} validated fields</span>
              <span className="intel-chip">{metrics.pendingValidation} pending validation</span>
            </div>
          </div>

          <InsightStream items={insightItems} />

          <div className="intel-mission-control mb-3">
            <Row className="g-3 mb-3">
              <Col xs={6} md={4} xl={2}>
                <PremiumKpiCard
                  label="Packages processed"
                  value={metrics.packages}
                  hint="Active extraction workspaces"
                  tone="intel"
                  trend="Pipeline"
                />
              </Col>
              <Col xs={6} md={4} xl={2}>
                <PremiumKpiCard
                  label="Extracted fields"
                  value={metrics.fields}
                  hint="Metadata and pricing fields"
                  tone="intel"
                  trend="+coverage"
                />
              </Col>
              <Col xs={6} md={4} xl={2}>
                <PremiumKpiCard
                  label="Clause signals"
                  value={metrics.clauses}
                  hint="Risk and compliance clauses"
                  tone="warning"
                  trend="Review"
                />
              </Col>
              <Col xs={6} md={4} xl={2}>
                <PremiumKpiCard
                  label="Avg confidence"
                  value={metrics.avgConfidence || 0}
                  hint="Across extracted fields"
                  tone="success"
                  trend="+quality"
                />
              </Col>
              <Col xs={6} md={4} xl={2}>
                <PremiumKpiCard
                  label="Validated fields"
                  value={metrics.validated}
                  hint="Human-approved extraction"
                  tone="success"
                  trend="Ready"
                />
              </Col>
              <Col xs={6} md={4} xl={2}>
                <PremiumKpiCard
                  label="High-risk clauses"
                  value={metrics.highRiskClauses}
                  hint="Executive review required"
                  tone={metrics.highRiskClauses > 0 ? 'risk' : 'warning'}
                  trend="Escalate"
                />
              </Col>
            </Row>
          </div>

          <ModuleHubPage
            title="Document intelligence workspace"
            subtitle="Navigate extraction review, AI summaries, clause inspection, and version comparison."
            modules={modules}
            className="ai-document-intelligence-hub app-module-hub intel-module-hub mb-3"
          />

          {featured ? (
            <Card className="intel-chart-card mb-3">
              <Card.Header className="bg-white fw-semibold">Featured extraction workspace</Card.Header>
              <Card.Body className="doc-viewer-split">
                <div className="doc-viewer-pane">
                  <div className="doc-viewer-placeholder">
                    <span className="doc-viewer-placeholder__label">Solicitation package preview</span>
                    <strong>{featured.extraction.documentId?.name || 'Document'}</strong>
                    <p>{featured.extraction.tenderId?.reference || 'Opportunity package'}</p>
                  </div>
                </div>
                <div className="doc-viewer-pane">
                  {(featured.fields || []).slice(0, 6).map((field) => (
                    <div
                      key={field._id}
                      className={`extracted-field tone-${confidenceTone(field.confidence || 0)}`}
                    >
                      <div className="extracted-field__head">
                        <strong>{field.fieldKey}</strong>
                        <Badge bg={field.validated ? 'success' : 'warning'}>
                          {field.validated ? 'Validated' : 'Review'}
                        </Badge>
                      </div>
                      <div>{String(field.fieldValue)}</div>
                      <div className="extracted-field__meta">
                        {field.confidence}% confidence
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          ) : null}

          <Card className="intel-chart-card mb-3">
            <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
              <span className="fw-semibold">Extracted document intelligence</span>
              <Form.Control
                size="sm"
                type="search"
                className="doc-intel-search"
                placeholder="Search document or opportunity reference"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </Card.Header>
            <Card.Body>
              {loading && !filteredItems.length ? <div className="intel-loading-skeleton" /> : null}
              {!loading && !filteredItems.length ? (
                <p className="text-muted mb-0">No extraction results match the current view.</p>
              ) : null}
              <div className="doc-intel-grid">
                {filteredItems.map((item) => {
                  const validatedCount = (item.fields || []).filter((field) => field.validated).length
                  const avgConfidence = (item.fields || []).length
                    ? Math.round(
                        (item.fields || []).reduce((sum, field) => sum + (field.confidence || 0), 0) /
                          item.fields.length
                      )
                    : 0
                  return (
                    <div key={item.extraction._id} className="doc-intel-card">
                      <div className="doc-intel-card__head">
                        <div>
                          <div className="doc-intel-card__title">
                            {item.extraction.documentId?.name || 'Document'}
                          </div>
                          <div className="doc-intel-card__reference">
                            {item.extraction.tenderId?.reference || '—'}
                          </div>
                        </div>
                        <div className={`doc-intel-card__confidence tone-${confidenceTone(avgConfidence)}`}>
                          <span>{avgConfidence}%</span>
                          <small>Confidence</small>
                        </div>
                      </div>
                      <div className="doc-intel-card__stats">
                        <span>{item.fields?.length || 0} fields</span>
                        <span>{item.clauses?.length || 0} clauses</span>
                        <span>{validatedCount} validated</span>
                      </div>
                      <div className="doc-intel-card__badges">
                        <Badge bg={validatedCount > 0 ? 'success' : 'secondary'}>
                          {validatedCount > 0 ? 'Validation in progress' : 'Awaiting validation'}
                        </Badge>
                        {(item.clauses || []).some((clause) =>
                          ['high', 'critical'].includes(String(clause.riskLevel || '').toLowerCase())
                        ) ? (
                          <Badge bg="danger">Risk clause detected</Badge>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card.Body>
          </Card>

          <Row className="g-3 pb-4">
            {clauseGroups.map((group) => (
              <Col lg={6} key={group}>
                <Card className="intel-chart-card h-100">
                  <Card.Header className="bg-white fw-semibold text-capitalize">{group} intelligence</Card.Header>
                  <Card.Body>
                    {(groupedClauses[group] || []).slice(0, 3).map((clause) => (
                      <div key={`${group}-${clause.text}`} className="clause-group">
                        <div className="fw-semibold">{clause.reference || 'Opportunity'}</div>
                        <div>{clause.text}</div>
                        <Badge bg={riskTone(clause.riskLevel)} className="mt-2">
                          {clause.riskLevel} risk · {clause.confidence}%
                        </Badge>
                      </div>
                    ))}
                    {!groupedClauses[group]?.length ? (
                      <p className="text-muted mb-0 small">No clauses in this group yet.</p>
                    ) : null}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : null}
    </div>
  )
}

export default AiDocumentIntelligenceHub
