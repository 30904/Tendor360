import React from 'react'
import { Container, Row, Col, Card, Button, Breadcrumb } from 'react-bootstrap'
import { ArrowLeft, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './EventManagement.scss'

const EventManagement = () => {
  const navigate = useNavigate()

  return (
    <div className="event-management-page">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => navigate('/tender-calendar')} style={{ cursor: 'pointer' }}>
                Tender Calendar
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Event Management</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <div className="header-content">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={() => navigate('/tender-calendar')}
                  className="back-btn"
                >
                  <ArrowLeft size={16} className="me-2" />
                  Back to Modules
                </Button>
                <div className="header-text">
                  <h2>Event Management</h2>
                  <p className="text-muted">Create and manage tender-related events and deadlines</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Event Management</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-5">
                  <Calendar size={48} className="text-muted mb-3" />
                  <h5>Event Management</h5>
                  <p className="text-muted">Create and manage tender-related events and deadlines</p>
                  <Button variant="primary">
                    Create New Event
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default EventManagement