import React from 'react'
import { Alert, Breadcrumb, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { ArrowLeft } from 'lucide-react'
import InsightStream from './InsightStream'
import './ExecutiveCommandCenter.scss'

const ExecutiveCommandCenter = ({
  className = '',
  breadcrumbs = [],
  onBack,
  backLabel = 'Back to modules',
  title,
  description,
  heroActions = null,
  heroMeta = null,
  outlookTitle,
  outlookDescription,
  outlookChips = [],
  insights = [],
  kpiBadge = 'Operating metrics',
  kpiTitle = 'Signal board',
  kpiMeta = null,
  kpiContent = null,
  error = '',
  success = '',
  onDismissError,
  onDismissSuccess,
  tableTitle,
  tableActions = null,
  children,
  loading = false,
  showSkeleton = false
}) => {
  if (showSkeleton) {
    return (
      <div className={`executive-command-center page-enter page-bg-gradient intel-executive-page ${className}`.trim()}>
        <Container fluid className="py-4">
          <div className="intel-loading-skeleton mb-3" />
          <div className="intel-loading-skeleton mb-3" style={{ minHeight: 120 }} />
          <div className="intel-loading-skeleton mb-3" style={{ minHeight: 88 }} />
          <div className="intel-loading-skeleton" style={{ minHeight: 420 }} />
        </Container>
      </div>
    )
  }

  return (
    <div className={`executive-command-center page-enter page-bg-gradient intel-executive-page ${className}`.trim()}>
      <Container fluid>
        {breadcrumbs.length ? (
          <Row className="mb-3">
            <Col>
              <Breadcrumb>
                {breadcrumbs.map((item) => (
                  item.active ? (
                    <Breadcrumb.Item key={item.label} active>{item.label}</Breadcrumb.Item>
                  ) : (
                    <Breadcrumb.Item
                      key={item.label}
                      onClick={item.onClick}
                      style={item.onClick ? { cursor: 'pointer' } : undefined}
                    >
                      {item.label}
                    </Breadcrumb.Item>
                  )
                ))}
              </Breadcrumb>
            </Col>
          </Row>
        ) : null}

        <div className="intel-executive-page__hero mb-3">
          <div>
            {onBack ? (
              <Button variant="outline-secondary" size="sm" className="mb-2" onClick={onBack}>
                <ArrowLeft size={16} className="me-2" />
                {backLabel}
              </Button>
            ) : null}
            <h1>{title}</h1>
            {description ? <p>{description}</p> : null}
          </div>
          {(heroActions || heroMeta) ? (
            <div className="intel-executive-page__hero-actions">
              {heroActions}
              {heroMeta ? <small>{heroMeta}</small> : null}
            </div>
          ) : null}
        </div>

        {error ? (
          <Alert variant="danger" dismissible onClose={onDismissError}>{error}</Alert>
        ) : null}
        {success ? (
          <Alert variant="success" dismissible onClose={onDismissSuccess}>{success}</Alert>
        ) : null}

        {outlookTitle || outlookDescription || outlookChips.length ? (
          <div className="intel-cinematic-hero mb-3">
            {outlookTitle ? <h2 className="h4 mb-2">{outlookTitle}</h2> : null}
            {outlookDescription ? <p className="mb-0">{outlookDescription}</p> : null}
            {outlookChips.length ? (
              <div className="intel-cinematic-hero__chips">
                {outlookChips.map((chip) => (
                  <span key={chip} className="intel-chip">{chip}</span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {insights.length ? <InsightStream items={insights} /> : null}

        {kpiContent ? (
          <div className="intel-mission-control executive-command-center__kpi-strip mb-3">
            <div className="pipeline-kpi-strip__head">
              <div>
                <span className="pipeline-kpi-strip__badge">{kpiBadge}</span>
                <h2 className="pipeline-kpi-strip__title">{kpiTitle}</h2>
              </div>
              {kpiMeta ? <small className="pipeline-kpi-strip__meta">{kpiMeta}</small> : null}
            </div>
            {kpiContent}
          </div>
        ) : null}

        <Card className="intel-chart-card mb-3">
          {(tableTitle || tableActions) ? (
            <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
              {tableTitle ? <span className="fw-semibold">{tableTitle}</span> : <span />}
              {tableActions}
            </Card.Header>
          ) : null}
          <Card.Body>{children}</Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default ExecutiveCommandCenter
