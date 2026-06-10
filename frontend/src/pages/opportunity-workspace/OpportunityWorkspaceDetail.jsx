import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Badge, Button, Card, Col, Row, Spinner, Tab, Tabs } from 'react-bootstrap'
import ScoreMeter from '../../components/intelligence/ScoreMeter'
import OperationalTimeline from '../../components/intelligence/OperationalTimeline'
import RecommendationPill from '../../components/intelligence/RecommendationPill'
import { intelligenceAPI } from '../../services/intelligenceAPI'

const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
    Number(value || 0)
  )

const OpportunityWorkspaceDetail = () => {
  const { tenderId } = useParams()
  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState(null)
  const [workspace, setWorkspace] = useState(null)

  const reloadWorkspace = async () => {
    const res = await intelligenceAPI.getWorkspace(tenderId)
    setWorkspace(res.data?.data ?? null)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await intelligenceAPI.getWorkspace(tenderId)
        if (!cancelled) setWorkspace(res.data?.data ?? null)
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || 'Unable to load workspace')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [tenderId])

  if (loading) {
    return (
      <div className="opportunity-workspace-detail page-enter p-3">
        <div className="intel-loading-skeleton mb-3" />
        <Row className="g-3">
          <Col xl={8}><div className="intel-loading-skeleton" style={{ minHeight: 280 }} /></Col>
          <Col xl={4}><div className="intel-loading-skeleton" style={{ minHeight: 280 }} /></Col>
        </Row>
      </div>
    )
  }

  if (error || !workspace) {
    return <Alert variant="warning">{error || 'Workspace unavailable'}</Alert>
  }

  const opportunity = workspace.opportunity
  const meters = workspace.intelligenceMeters || {}
  const crm = workspace.crmIntelligence || {}

  return (
    <div className="opportunity-workspace-detail page-enter">
      <div className="workspace-hero">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            <Badge bg="light" text="dark" className="me-2">
              {opportunity.reference}
            </Badge>
            <Badge bg="info">{opportunity.discovery?.connectorType || opportunity.source}</Badge>
            <h2 className="h3 mt-2 mb-1">{opportunity.title}</h2>
            <p className="mb-0 opacity-75">{opportunity.organization}</p>
            <div className="mt-2">
              <RecommendationPill value={workspace.goNoGo?.aiRecommendation || workspace.score?.recommendation || 'defer'} />
            </div>
          </div>
          <div className="text-end">
            <div className="small opacity-75">Estimated value</div>
            <div className="h4 mb-0">{formatCurrency(opportunity.estimatedValue, opportunity.currency)}</div>
          </div>
        </div>
        <div className="workspace-hero-metrics">
          <div className="metric">
            <div className="label">AI score</div>
            <div className="value">{meters.qualificationScore || opportunity.aiMatchScore || '—'}</div>
          </div>
          <div className="metric">
            <div className="label">Risk</div>
            <div className="value">{opportunity.urgency || meters.urgency || '—'}</div>
          </div>
          <div className="metric">
            <div className="label">Strategic fit</div>
            <div className="value">{meters.strategicFit || '—'}</div>
          </div>
          <div className="metric">
            <div className="label">Deadline</div>
            <div className="value">{new Date(opportunity.deadline).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <Row className="g-3">
        <Col xl={8}>
          <Card className="workspace-ai-panel mb-3">
            <Card.Header className="bg-white fw-semibold">Executive AI summary</Card.Header>
            <Card.Body>
              <p className="mb-3">{workspace.aiSummary?.executiveSummary || workspace.aiSummary?.summary}</p>
              <Row className="g-3">
                <Col md={6}>
                  <h6 className="text-muted text-uppercase small">Key insights</h6>
                  <ul className="mb-0">
                    {(workspace.aiSummary?.insights || []).map((item) => (
                      <li key={item} className="mb-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted text-uppercase small">Recommendation</h6>
                  <ul className="mb-0">
                    {(workspace.aiSummary?.recommendationBullets || []).map((item) => (
                      <li key={item} className="mb-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Tabs defaultActiveKey="metadata" className="mb-3">
            <Tab eventKey="metadata" title="Bid metadata">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p className="mb-1">
                        <strong>Location:</strong> {opportunity.location}
                      </p>
                      <p className="mb-1">
                        <strong>Pipeline stage:</strong> {opportunity.pipelineStage}
                      </p>
                      <p className="mb-0">
                        <strong>Deadline:</strong> {new Date(opportunity.deadline).toLocaleString()}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1">
                        <strong>Win probability:</strong> {opportunity.winProbability || '—'}%
                      </p>
                      <p className="mb-1">
                        <strong>Urgency:</strong> {opportunity.urgency}
                      </p>
                      <p className="mb-0">
                        <strong>Priority:</strong> {opportunity.priority}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="documents" title="Document intelligence">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  {(workspace.documents || []).map((doc) => (
                    <div key={doc._id} className="py-2 border-bottom fw-semibold">
                      {doc.name}
                    </div>
                  ))}
                  {(workspace.extractedFields || []).map((field) => (
                    <div key={field._id} className="extracted-field small">
                      <strong>{field.fieldKey}:</strong> {String(field.fieldValue)} · {field.confidence}%
                      {field.validated ? ' · validated' : ''}
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="qualification" title="Qualification">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  {workspace.qualification
                    ? `Decision: ${workspace.qualification.decision} (${workspace.qualification.status})`
                    : workspace.aiSummary?.qualificationSummary || 'Opportunity qualification has not started.'}
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="crm" title="CRM intelligence">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <Badge bg={crm.validationStatus === 'validated' ? 'success' : crm.validationStatus === 'partial' ? 'warning' : 'secondary'}>
                      {crm.validationStatus || 'not validated'}
                      {crm.matchScore != null ? ` · ${crm.matchScore}%` : ''}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      disabled={validating}
                      onClick={async () => {
                        setValidating(true)
                        try {
                          await intelligenceAPI.validateTenderCrm(tenderId)
                          await reloadWorkspace()
                        } catch (e) {
                          setError(e.response?.data?.message || 'CRM validation failed')
                        } finally {
                          setValidating(false)
                        }
                      }}
                    >
                      {validating ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                      Validate in Salesforce
                    </Button>
                  </div>
                  <p className="mb-1">
                    <strong>Matched account:</strong> {crm.matchedAccount || '—'}
                  </p>
                  <p className="mb-1">
                    <strong>Division:</strong> {crm.division || '—'}
                  </p>
                  <p className="mb-1">
                    <strong>Relationship status:</strong> {crm.relationshipStatus || '—'}
                  </p>
                  <p className="mb-1">
                    <strong>Historical revenue:</strong> {formatCurrency(crm.historicalRevenue)}
                  </p>
                  <p className="mb-1">
                    <strong>Opportunity history:</strong> {crm.opportunityHistory || '—'}
                  </p>
                  {crm.salesforceAccountId ? (
                    <p className="mb-0 text-muted small">
                      Salesforce ID: {crm.salesforceAccountId} · Method: {crm.matchMethod || '—'}
                    </p>
                  ) : null}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>

        <Col xl={4}>
          <div className="workspace-sticky-panel">
            <Card className="border-0 shadow-sm mb-3">
              <Card.Header className="bg-white fw-semibold">Intelligence meters</Card.Header>
              <Card.Body>
                <ScoreMeter label="AI confidence" value={meters.aiConfidence} tone="success" suffix="%" />
                <ScoreMeter label="Qualification score" value={meters.qualificationScore} />
                <ScoreMeter label="Strategic fit" value={meters.strategicFit} tone="success" />
                <ScoreMeter label="Risk score" value={meters.riskScore} tone="risk" />
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-3">
              <Card.Header className="bg-white fw-semibold">Recommended next action</Card.Header>
              <Card.Body>
                <p className="mb-3">{workspace.nextAction || 'Review opportunity intelligence and assign owner.'}</p>
                <Button size="sm" variant="primary">
                  Advance pursuit workflow
                </Button>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-3">
              <Card.Header className="bg-white fw-semibold">Risk analysis</Card.Header>
              <Card.Body>
                {(workspace.risks || []).map((risk) => (
                  <div key={`${risk.label}-${risk.detail}`} className="mb-2">
                    <Badge bg="warning" text="dark" className="me-2">
                      {risk.level}
                    </Badge>
                    <span className="small">{risk.detail}</span>
                  </div>
                ))}
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-3">
              <Card.Header className="bg-white fw-semibold">Operational timeline</Card.Header>
              <Card.Body>
                <OperationalTimeline items={workspace.timeline || []} />
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white fw-semibold">Contacts</Card.Header>
              <Card.Body>
                <div className="small mb-2">
                  <strong>Owner:</strong> {workspace.contacts?.owner?.name || '—'}
                </div>
                <div className="small">
                  <strong>Assigned:</strong> {workspace.contacts?.assignedTo?.name || '—'}
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default OpportunityWorkspaceDetail
