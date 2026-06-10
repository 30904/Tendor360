import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { BiRocket, BiTime, BiCog, BiInfoCircle } from 'react-icons/bi'
import './ComingSoon.scss'

const ComingSoon = ({ 
  title = "Coming Soon", 
  description = "This feature is currently under development and will be available soon.",
  features = [],
  estimatedDate = null 
}) => {
  return (
    <div className="coming-soon-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="coming-soon-card">
              <Card.Body className="text-center">
                <div className="icon-container">
                  <BiRocket className="main-icon" />
                </div>
                
                <h2 className="page-title">{title}</h2>
                
                <p className="description">
                  {description}
                </p>

                {estimatedDate && (
                  <div className="estimated-date">
                    <BiTime className="date-icon" />
                    <span>Expected: {estimatedDate}</span>
                  </div>
                )}

                {features.length > 0 && (
                  <div className="features-preview">
                    <h5 className="features-title">
                      <BiInfoCircle className="features-icon" />
                      What to Expect
                    </h5>
                    <ul className="features-list">
                      {features.map((feature, index) => (
                        <li key={index} className="feature-item">
                          <BiCog className="feature-icon" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="development-status">
                  <div className="status-indicator">
                    <div className="status-dot"></div>
                    <span>In Development</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ComingSoon
