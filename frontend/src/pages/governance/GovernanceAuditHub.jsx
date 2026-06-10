import React, { useEffect, useState } from 'react'
import { Alert, Card, Col, Row, Spinner } from 'react-bootstrap'
import ModuleHubPage from '../../components/hub/ModuleHubPage'
import { intelligenceAPI } from '../../services/intelligenceAPI'

const modules = [
  {
    id: 'audit-logs',
    title: 'Audit explorer',
    description: 'Search immutable activity history and export audit trails.',
    path: '/admin-config/audit-logs',
    color: 'primary'
  },
  {
    id: 'compliance-audit-reports',
    title: 'Compliance reporting',
    description: 'Governance packs and evidence bundles.',
    path: '/reporting-analytics/compliance-audit-reports',
    color: 'success'
  },
  {
    id: 'retention',
    title: 'Retention policies',
    description: 'Retention schedules and legal hold alignment.',
    path: '/admin-config/retention',
    color: 'warning'
  }
]

const GovernanceAuditHub = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboard, setDashboard] = useState(null)

  useEffect(() => {
    intelligenceAPI
      .getGovernanceDashboard()
      .then((res) => setDashboard(res.data?.data ?? null))
      .catch((e) => setError(e.response?.data?.message || 'Unable to load governance dashboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <ModuleHubPage
        title="Governance & Audit"
        subtitle="Immutable activity history, compliance reporting, and governance workflows."
        modules={modules}
        className="governance-audit-hub app-module-hub"
      />
      <Row className="px-3 pb-4 g-3">
        {['reviews', 'scores', 'jobs'].map((key) => (
          <Col md={4} key={key}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white fw-semibold text-capitalize">{key}</Card.Header>
              <Card.Body>
                {loading ? <Spinner animation="border" size="sm" /> : null}
                {error ? <Alert variant="danger">{error}</Alert> : null}
                {!loading && !error ? (
                  <div className="display-6">{(dashboard?.[key] || []).length}</div>
                ) : null}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default GovernanceAuditHub
