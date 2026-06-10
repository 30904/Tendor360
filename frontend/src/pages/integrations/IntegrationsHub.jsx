import React, { useEffect, useState } from 'react'
import { Alert, Badge, Card, Col, Row, Spinner } from 'react-bootstrap'
import ModuleHubPage from '../../components/hub/ModuleHubPage'
import { intelligenceAPI } from '../../services/intelligenceAPI'

const modules = [
  {
    id: 'integrations',
    title: 'Connector marketplace',
    description: 'Enable discovery, CRM, BI, and e-procurement connectors.',
    path: '/integrations',
    color: 'primary'
  },
  {
    id: 'api-keys-webhooks',
    title: 'API credentials & webhooks',
    description: 'Manage credentials, outbound webhooks, and event subscriptions.',
    path: '/admin-config/api-keys-webhooks',
    color: 'success'
  },
  {
    id: 'eprocurement-adapters',
    title: 'E-procurement adapters',
    description: 'Adapter configuration for enterprise procurement systems.',
    path: '/admin-config/eprocurement-adapters',
    color: 'warning'
  }
]

const IntegrationsHub = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hub, setHub] = useState(null)

  useEffect(() => {
    intelligenceAPI
      .getIntegrationHub()
      .then((res) => setHub(res.data?.data ?? null))
      .catch((e) => setError(e.response?.data?.message || 'Unable to load integration hub'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <ModuleHubPage
        title="Integrations"
        subtitle="Central integration management for discovery connectors, CRM enrichment, and automation."
        modules={modules}
        className="integrations-hub app-module-hub"
      />
      <Row className="px-3 pb-4 g-3">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-semibold">Configured connectors</Card.Header>
            <Card.Body>
              {loading ? <Spinner animation="border" size="sm" /> : null}
              {error ? <Alert variant="danger">{error}</Alert> : null}
              {(hub?.connectors || []).map((connector) => (
                <div key={connector._id} className="d-flex justify-content-between py-2 border-bottom">
                  <span>{connector.displayName}</span>
                  <Badge bg={connector.status === 'active' ? 'success' : 'secondary'}>
                    {connector.status}
                  </Badge>
                </div>
              ))}
              {!loading && !hub?.connectors?.length ? (
                <p className="text-muted mb-0">No tenant connectors configured yet.</p>
              ) : null}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-semibold">Marketplace</Card.Header>
            <Card.Body>
              {(hub?.connectorCatalog || hub?.marketplace || []).map((item) => (
                <div key={item.key} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span>{item.displayName}</span>
                  <Badge bg={item.configured ? 'success' : 'secondary'}>
                    {item.configured ? 'Configured' : item.message || 'Not configured'}
                  </Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default IntegrationsHub
