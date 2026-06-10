import React from 'react'
import { Badge, Card, Col, Container, Row } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from './HubModuleIcon'

const ModuleHubPage = ({ title, subtitle, modules, className = 'app-module-hub' }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleModuleActivate = (module) => {
    if (module.disabled) return

    const targetPath = String(module.path || '').split('#')[0]
    if (module.scrollTarget && location.pathname === targetPath) {
      const section = document.getElementById(module.scrollTarget)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    navigate(module.path)
  }

  const handleModuleKeyDown = (event, module) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handleModuleActivate(module)
  }

  return (
    <div className={className}>
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <div className="page-header">
              <h2>{title}</h2>
              {subtitle ? <p className="text-muted">{subtitle}</p> : null}
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <div className="modules-grid">
              {modules.map((module) => (
                <Card
                  key={module.id}
                  className={`module-card module-card-${module.color || 'primary'} ${module.disabled ? 'is-disabled' : ''}`}
                  role="button"
                  tabIndex={module.disabled ? -1 : 0}
                  aria-disabled={module.disabled ? 'true' : 'false'}
                  onClick={() => handleModuleActivate(module)}
                  onKeyDown={(event) => handleModuleKeyDown(event, module)}
                >
                  <Card.Body>
                    <div className="module-content">
                      <div className="module-leading">
                        <div className="module-icon">
                          <HubModuleIcon moduleId={module.id} />
                        </div>
                        {module.statusLabel ? (
                          <Badge bg="light" text="dark" className="module-status-badge">
                            {module.statusLabel}
                          </Badge>
                        ) : null}
                      </div>
                      <div className="module-text">
                        <h5 className="module-title">{module.title}</h5>
                        <p className="module-description">{module.description}</p>
                        {module.metric ? <div className="module-metric">{module.metric}</div> : null}
                      </div>
                      <div className="module-arrow" aria-hidden="true">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                    <div className="module-foot">
                      <span>{module.actionLabel || 'Open workspace'}</span>
                      <ChevronRight size={16} />
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ModuleHubPage
