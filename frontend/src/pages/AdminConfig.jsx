import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Alert, Badge, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../components/hub/HubModuleIcon'
import { intelligenceAPI } from '../services/intelligenceAPI'
import './AdminConfig.scss'

const MODULE_SECTIONS = [
  {
    id: 'platform',
    title: 'Platform administration',
    modules: [
      {
        id: 'system-settings',
        title: 'System Settings',
        description: 'Core parameters, regional defaults, and feature flags.',
        path: '/admin-config/system-settings',
        color: 'primary',
      },
      {
        id: 'user-management',
        title: 'User Management',
        description: 'Users, invitations, resets, and org assignments.',
        path: '/admin-config/user-management',
        color: 'success',
      },
      {
        id: 'roles-permissions',
        title: 'Roles & Permissions',
        description: 'RBAC matrices and fine-grained entitlements.',
        path: '/admin-config/roles-permissions',
        color: 'warning',
      },
      {
        id: 'security-settings',
        title: 'Security Settings',
        description: 'MFA, session policy, IP rules, and password standards.',
        path: '/admin-config/security-settings',
        color: 'danger',
      },
      {
        id: 'branding-theming',
        title: 'Branding & Theming',
        description: 'Logos, colors, email skins, and white-label touches.',
        path: '/admin-config/branding',
        color: 'info',
      },
      {
        id: 'admin-notifications',
        title: 'Notifications',
        description: 'Templates, channels, throttles, and routing rules.',
        path: '/admin-config/notification-settings',
        color: 'primary',
      },
      {
        id: 'data-tools',
        title: 'Data Tools',
        description: 'Imports, exports, maintenance jobs, and sandbox tools.',
        path: '/admin-config/data-tools',
        color: 'warning',
      },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    modules: [
      {
        id: 'discovery-connectors',
        title: 'Connector marketplace',
        description: 'Enable discovery portals (API or web), credentials, bot frequency, and lookback.',
        path: '/admin-config/discovery-connectors',
        color: 'primary',
      },
      {
        id: 'intelligence-platform',
        title: 'Intelligence Platform',
        description: 'Connector credentials, AI providers, scoring profiles, and scheduler settings.',
        path: '/admin-config/intelligence-platform',
        color: 'info',
      },
      {
        id: 'api-keys-webhooks',
        title: 'API credentials & webhooks',
        description: 'Manage credentials, outbound webhooks, and event subscriptions.',
        path: '/admin-config/api-keys-webhooks',
        color: 'success',
      },
      {
        id: 'eprocurement-adapters',
        title: 'E-procurement adapters',
        description: 'Adapter configuration for enterprise procurement systems.',
        path: '/admin-config/eprocurement-adapters',
        color: 'warning',
      },
    ],
  },
  {
    id: 'governance',
    title: 'Governance & compliance',
    modules: [
      {
        id: 'audit-logs',
        title: 'Audit explorer',
        description: 'Search immutable activity history and export audit trails.',
        path: '/admin-config/audit-logs',
        color: 'primary',
      },
      {
        id: 'compliance-audit-reports',
        title: 'Compliance reporting',
        description: 'Governance packs and evidence bundles.',
        path: '/reporting-analytics/compliance-audit-reports',
        color: 'success',
      },
      {
        id: 'retention',
        title: 'Retention policies',
        description: 'Retention schedules and legal hold alignment.',
        path: '/admin-config/retention',
        color: 'warning',
      },
    ],
  },
]

const AdminConfig = () => {
  const navigate = useNavigate()
  const [hubLoading, setHubLoading] = useState(true)
  const [hubError, setHubError] = useState(null)
  const [integrationHub, setIntegrationHub] = useState(null)
  const [governanceDashboard, setGovernanceDashboard] = useState(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      intelligenceAPI.getIntegrationHub().catch((e) => ({
        error: e.response?.data?.message || 'Unable to load integration status',
      })),
      intelligenceAPI.getGovernanceDashboard().catch((e) => ({
        error: e.response?.data?.message || 'Unable to load governance status',
      })),
    ]).then(([hubRes, govRes]) => {
      if (cancelled) return

      if (hubRes?.error) {
        setHubError(hubRes.error)
      } else {
        setIntegrationHub(hubRes?.data?.data ?? null)
      }

      if (!govRes?.error) {
        setGovernanceDashboard(govRes?.data?.data ?? null)
      }

      setHubLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const marketplace = integrationHub?.connectorCatalog || integrationHub?.marketplace || []

  return (
    <div className="admin-config-modules app-module-hub">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h2>Admin & Configuration</h2>
              <p className="text-muted">
                Platform administration, integrations, governance, and compliance — consolidated in one workspace.
              </p>
            </div>
          </Col>
        </Row>

        {MODULE_SECTIONS.map((section) => (
          <section key={section.id} className="admin-module-section">
            <h3 className="admin-section-title">{section.title}</h3>
            <div className="modules-grid">
              {section.modules.map((module) => (
                <Card
                  key={module.id}
                  className={`module-card module-card-${module.color}`}
                  onClick={() => navigate(module.path)}
                >
                  <Card.Body>
                    <div className="module-content">
                      <div className="module-icon">
                        <HubModuleIcon moduleId={module.id} />
                      </div>
                      <div className="module-text">
                        <h5 className="module-title">{module.title}</h5>
                        <p className="module-description">{module.description}</p>
                      </div>
                      <div className="module-arrow">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <section className="admin-module-section admin-status-section">
          <h3 className="admin-section-title">Live status</h3>
          {hubError ? <Alert variant="warning">{hubError}</Alert> : null}
          <Row className="g-3">
            <Col lg={6}>
              <Card className="admin-status-card border-0 shadow-sm h-100">
                <Card.Header className="bg-white fw-semibold">Configured connectors</Card.Header>
                <Card.Body>
                  {hubLoading ? <Spinner animation="border" size="sm" /> : null}
                  {!hubLoading &&
                    (integrationHub?.connectors || []).map((connector) => (
                      <div
                        key={connector._id}
                        className="d-flex justify-content-between align-items-center py-2 border-bottom"
                      >
                        <span>{connector.displayName}</span>
                        <Badge bg={connector.status === 'active' ? 'success' : 'secondary'}>
                          {connector.status}
                        </Badge>
                      </div>
                    ))}
                  {!hubLoading && !integrationHub?.connectors?.length ? (
                    <p className="text-muted mb-0">No tenant connectors configured yet.</p>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="admin-status-card border-0 shadow-sm h-100">
                <Card.Header className="bg-white fw-semibold">Connector marketplace</Card.Header>
                <Card.Body>
                  {hubLoading ? <Spinner animation="border" size="sm" /> : null}
                  {!hubLoading &&
                    marketplace.map((item) => (
                      <div
                        key={item.key}
                        className="d-flex justify-content-between align-items-center py-2 border-bottom"
                      >
                        <span>{item.displayName}</span>
                        <Badge bg={item.configured ? 'success' : 'secondary'}>
                          {item.configured ? 'Configured' : item.message || 'Not configured'}
                        </Badge>
                      </div>
                    ))}
                  {!hubLoading && !marketplace.length ? (
                    <p className="text-muted mb-0">Marketplace catalog will appear when connectors are registered.</p>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
            {['reviews', 'scores', 'jobs'].map((key) => (
              <Col md={4} key={key}>
                <Card className="admin-status-card border-0 shadow-sm h-100">
                  <Card.Header className="bg-white fw-semibold text-capitalize">{key}</Card.Header>
                  <Card.Body>
                    {hubLoading ? <Spinner animation="border" size="sm" /> : null}
                    {!hubLoading ? (
                      <div className="admin-status-metric">{(governanceDashboard?.[key] || []).length}</div>
                    ) : null}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </div>
  )
}

export default AdminConfig
