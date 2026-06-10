import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './AuthLayout.scss'

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={8} md={6} lg={4} xl={3}>
            <div className="auth-container">
              <div className="auth-header text-center mb-4">
                <h1 className="auth-title">Tender360</h1>
                <p className="auth-subtitle">World-Class Tender Management</p>
              </div>
              {children}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AuthLayout
