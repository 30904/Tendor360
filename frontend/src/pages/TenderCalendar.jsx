import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HubModuleIcon } from '../components/hub/HubModuleIcon'
import './TenderCalendar.scss'

const TenderCalendar = () => {
  const navigate = useNavigate()

  const modules = [
    {
      id: 'calendar-view',
      title: 'Calendar View',
      description: 'Month/week views with milestones and blackout dates.',
      path: '/tender-calendar/calendar-view',
      color: 'primary'
    },
    {
      id: 'event-management',
      title: 'Event Management',
      description: 'Create events, checkpoints, and review meetings.',
      path: '/tender-calendar/event-management',
      color: 'success'
    },
    {
      id: 'deadline-tracking',
      title: 'Deadline Tracking',
      description: 'SLA countdowns with severity and escalation paths.',
      path: '/tender-calendar/deadline-tracking',
      color: 'warning'
    },
    {
      id: 'calendar-notifications',
      title: 'Notifications',
      description: 'Email, in-app, and digest alerts for critical dates.',
      path: '/tender-calendar/notifications',
      color: 'info'
    },
    {
      id: 'team-calendar',
      title: 'Team Calendar',
      description: 'Shared team capacity and conflict visibility.',
      path: '/tender-calendar/team-calendar',
      color: 'primary'
    },
    {
      id: 'calendar-reports',
      title: 'Calendar Reports',
      description: 'On-time KPIs, heatmaps, and exportable summaries.',
      path: '/tender-calendar/calendar-reports',
      color: 'success'
    }
  ]

  const handleModuleClick = (module) => {
    navigate(module.path)
  }

  return (
    <div className="tender-calendar-modules app-module-hub">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h2>Tender Calendar</h2>
              <p className="text-muted">
                Comprehensive calendar management for tender deadlines, events, and milestone tracking
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <div className="modules-grid">
              {modules.map((module) => (
                <Card
                  key={module.id}
                  className={`module-card module-card-${module.color}`}
                  onClick={() => handleModuleClick(module)}
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
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default TenderCalendar
