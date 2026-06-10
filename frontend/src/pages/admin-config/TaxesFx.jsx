import React from 'react'
import { Container, Row, Col, Card, Button, Breadcrumb } from 'react-bootstrap'
import { ArrowLeft, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './TaxesFX.scss'

const TaxesFX = () => {
  const navigate = useNavigate()

  return (
    <div className="taxes-fx-page">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => navigate('/admin-config')} style={{ cursor: 'pointer' }}>
                Admin & Config
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Taxes & FX</Breadcrumb.Item>
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
                  <h2>Taxes & FX</h2>
                  <p className="text-muted">Configure tax rates and foreign exchange settings</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Taxes & FX Configuration</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-5">
                  <DollarSign size={48} className="text-muted mb-3" />
                  <h5>Taxes & FX</h5>
                  <p className="text-muted">Configure tax rates and foreign exchange settings</p>
                  <Button variant="primary">
                    Configure Taxes & FX
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

export default TaxesFX