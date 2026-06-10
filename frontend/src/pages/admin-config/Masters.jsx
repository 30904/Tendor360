import React from 'react'
import { Container, Row, Col, Card, Button, Breadcrumb } from 'react-bootstrap'
import { ArrowLeft, Database } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Masters.scss'

const Masters = () => {
  const navigate = useNavigate()

  return (
    <div className="masters-page">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => navigate('/admin-config')} style={{ cursor: 'pointer' }}>
                Admin & Config
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Masters</Breadcrumb.Item>
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
                  onClick={() => navigate('/admin-config')}
                  className="back-btn"
                >
                  <ArrowLeft size={16} className="me-2" />
                  Back to Modules
                </Button>
                <div className="header-text">
                  <h2>Masters</h2>
                  <p className="text-muted">Manage master data and reference information</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Masters Data Management</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-5">
                  <Database size={48} className="text-muted mb-3" />
                  <h5>Masters</h5>
                  <p className="text-muted">Manage master data and reference information</p>
                  <Button variant="primary">
                    Manage Masters
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

export default Masters