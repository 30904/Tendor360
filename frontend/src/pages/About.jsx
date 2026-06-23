import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import {
  BiRocket, BiBullseye, BiCog, BiBrain, BiUser, BiTrendingUp,
  BiLink, BiBarChart, BiCheckCircle, BiStar, BiShield, BiFile,
  BiGroup, BiTime, BiAward, BiGlobe, BiPieChart, BiLineChart,
  BiInfoCircle
} from 'react-icons/bi';
// Using centralized about page styling from components.scss

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg="10">
              <div className="hero-content">
                <div className="hero-logo">
                  <div className="logo-icon">T</div>
                </div>
                <h1 className="hero-title">Tender360</h1>
                <h2 className="hero-subtitle">Enterprise Tender Management System</h2>
                <p className="hero-description">
                  A comprehensive, enterprise-grade solution designed for manufacturing, life sciences, and global enterprises.
                  Simplify your entire tender lifecycle with AI-powered insights and streamlined workflows.
                </p>
                <div className="hero-badges">
                  <Badge bg="light" text="dark" className="me-2 mb-2">Enterprise Grade</Badge>
                  <Badge bg="success" className="me-2 mb-2">AI-Powered</Badge>
                  <Badge bg="info" className="me-2 mb-2">Global Ready</Badge>
                  <Badge bg="warning" className="me-2 mb-2">Compliance Focused</Badge>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="about-content">
        <Container fluid className="px-4">
          {/* Introduction Section */}
          <Row className="mb-5">
            <Col lg="12">
              <Card className="about-feature-card">
                <Card.Body className="p-4">
                  <div className="about-section-header">
                    <BiRocket className="about-section-icon" />
                    <h3 className="about-section-title">Introduction</h3>
                  </div>
                  <p className="about-section-description">
                    Tender360 is a comprehensive, enterprise-grade Tender Management System designed for manufacturing,
                    life sciences, and global enterprises. It simplifies the entire tender lifecycle — from tender creation
                    to bid submission, evaluation, compliance, and award — while providing AI-powered insights to improve
                    efficiency and success rates.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Why Tender360 Section */}
          <Row className="mb-5">
            <Col lg="12">
              <Card className="about-feature-card">
                <Card.Body className="p-4">
                  <div className="about-section-header">
                    <BiBullseye className="about-section-icon" />
                    <h3 className="about-section-title">Why Tender360?</h3>
                  </div>
                  <Row>
                    <Col md="6">
                      <ul className="feature-list">
                        <li><BiCheckCircle className="list-icon" /> Reduce tender turnaround time by automating manual processes</li>
                        <li><BiCheckCircle className="list-icon" /> Ensure compliance with international tendering standards</li>
                        <li><BiCheckCircle className="list-icon" /> Improve win rates with AI-driven scoring and recommendations</li>
                      </ul>
                    </Col>
                    <Col md="6">
                      <ul className="feature-list">
                        <li><BiCheckCircle className="list-icon" /> Centralize tender documents, communication, and workflows</li>
                        <li><BiCheckCircle className="list-icon" /> Enable collaboration across departments and geographies</li>
                        <li><BiCheckCircle className="list-icon" /> Streamline the entire tender lifecycle</li>
                      </ul>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Functional Capabilities */}
          <Row className="mb-5">
            <Col lg="12">
              <Card className="about-feature-card">
                <Card.Body className="p-4">
                  <div className="about-section-header">
                    <BiCog className="about-section-icon" />
                    <h3 className="about-section-title">Functional Capabilities</h3>
                  </div>
                  <p className="about-section-description mb-4">
                    Tender360 covers the end-to-end tender lifecycle with comprehensive features:
                  </p>
                  <Row>
                    <Col md="6" lg="4" className="mb-4">
                      <div className="about-capability-item">
                        <BiFile className="about-capability-icon" />
                        <h5>Tender Creation & Publishing</h5>
                        <ul>
                          <li>Standardized templates for RFPs, RFQs, EOIs</li>
                          <li>Configurable approval workflows</li>
                        </ul>
                      </div>
                    </Col>
                    <Col md="6" lg="4" className="mb-4">
                      <div className="about-capability-item">
                        <BiBarChart className="about-capability-icon" />
                        <h5>Bid Submission & Tracking</h5>
                        <ul>
                          <li>Secure supplier portal for bid submissions</li>
                          <li>Real-time tracking of received bids</li>
                        </ul>
                      </div>
                    </Col>
                    <Col md="6" lg="4" className="mb-4">
                      <div className="about-capability-item">
                        <BiStar className="about-capability-icon" />
                        <h5>Evaluation & Scoring</h5>
                        <ul>
                          <li>Multi-criteria evaluation frameworks</li>
                          <li>AI-assisted scoring and ranking</li>
                        </ul>
                      </div>
                    </Col>
                    <Col md="6" lg="4" className="mb-4">
                      <div className="about-capability-item">
                        <BiShield className="about-capability-icon" />
                        <h5>Document Management</h5>
                        <ul>
                          <li>Upload, versioning, and AI-based extraction</li>
                          <li>Audit trail and compliance records</li>
                        </ul>
                      </div>
                    </Col>
                    <Col md="6" lg="4" className="mb-4">
                      <div className="about-capability-item">
                        <BiGroup className="about-capability-icon" />
                        <h5>Collaboration Tools</h5>
                        <ul>
                          <li>Cross-team communication</li>
                          <li>Role-based access controls</li>
                        </ul>
                      </div>
                    </Col>
                    <Col md="6" lg="4" className="mb-4">
                      <div className="capability-item">
                        <BiLineChart className="capability-icon" />
                        <h5>Reporting & Analytics</h5>
                        <ul>
                          <li>Win/loss analysis</li>
                          <li>Predictive insights and dashboards</li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* AI/ML Enhancements */}
          <Row className="mb-5">
            <Col lg="12">
              <Card className="feature-card ai-card">
                <Card.Body className="p-4">
                  <div className="section-header">
                    <BiBrain className="section-icon ai-icon" />
                    <h3 className="section-title">AI/ML & GenAI Enhancements</h3>
                  </div>
                  <Row>
                    <Col md="6" className="mb-3">
                      <div className="ai-feature">
                        <h5><BiFile className="me-2" />Automated Document Extraction</h5>
                        <p>Identify key clauses, compliance items, and risks from tender documents</p>
                      </div>
                    </Col>
                    <Col md="6" className="mb-3">
                      <div className="ai-feature">
                        <h5><BiBullseye className="me-2" />Bid/No-Bid Recommendations</h5>
                        <p>AI helps teams make smarter decisions on tender participation</p>
                      </div>
                    </Col>
                    <Col md="6" className="mb-3">
                      <div className="ai-feature">
                        <h5><BiBarChart className="me-2" />Executive Summaries</h5>
                        <p>GenAI produces tender summaries for leadership review</p>
                      </div>
                    </Col>
                    <Col md="6" className="mb-3">
                      <div className="ai-feature">
                        <h5><BiTrendingUp className="me-2" />Predictive Analytics</h5>
                        <p>Forecast success probability and resource requirements</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* User Roles */}
          <Row className="mb-5">
            <Col lg="12">
              <Card className="feature-card">
                <Card.Body className="p-4">
                  <div className="section-header">
                    <BiUser className="section-icon" />
                    <h3 className="section-title">User Roles</h3>
                  </div>
                  <Row>
                    <Col md="6" lg="4" className="mb-3">
                      <div className="role-item">
                        <Badge bg="primary" className="role-badge">Admin</Badge>
                        <p>Configuration, role management, reporting</p>
                      </div>
                    </Col>
                    <Col md="6" lg="4" className="mb-3">
                      <div className="role-item">
                        <Badge bg="success" className="role-badge">Bid Manager</Badge>
                        <p>Create and manage tenders, assign evaluators</p>
                      </div>
                    </Col>
                    <Col md="6" lg="4" className="mb-3">
                      <div className="role-item">
                        <Badge bg="info" className="role-badge">Evaluator</Badge>
                        <p>Score and assess supplier submissions</p>
                      </div>
                    </Col>
                    <Col md="6" lg="4" className="mb-3">
                      <div className="role-item">
                        <Badge bg="warning" className="role-badge">Executive</Badge>
                        <p>View high-level dashboards and insights</p>
                      </div>
                    </Col>
                    <Col md="6" lg="4" className="mb-3">
                      <div className="role-item">
                        <Badge bg="secondary" className="role-badge">Supplier</Badge>
                        <p>Submit bids, respond to queries, track results</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Business Benefits */}
          <Row className="mb-5">
            <Col lg="12">
              <Card className="feature-card benefits-card">
                <Card.Body className="p-4">
                  <div className="section-header">
                    <BiTrendingUp className="section-icon" />
                    <h3 className="section-title">Business Benefits</h3>
                  </div>
                  <Row>
                    <Col md="4" className="text-center mb-4">
                      <div className="benefit-item">
                        <div className="benefit-number">30%</div>
                        <h5>Faster Tender Cycle Times</h5>
                        <p>Automated processes reduce manual work</p>
                      </div>
                    </Col>
                    <Col md="4" className="text-center mb-4">
                      <div className="benefit-item">
                        <div className="benefit-number">20%</div>
                        <h5>Higher Win Rates</h5>
                        <p>Data-driven decisions improve success</p>
                      </div>
                    </Col>
                    <Col md="4" className="text-center mb-4">
                      <div className="benefit-item">
                        <div className="benefit-number">100%</div>
                        <h5>Compliance Assurance</h5>
                        <p>Reduced audit risks and stronger compliance</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Integration & Customer Impact */}
          <Row className="mb-5">
            <Col lg="6" className="mb-4">
              <Card className="feature-card">
                <Card.Body className="p-4">
                  <div className="section-header">
                    <BiLink className="section-icon" />
                    <h3 className="section-title">Integration & Configurability</h3>
                  </div>
                  <ul className="feature-list">
                    <li><BiCheckCircle className="list-icon" /> Seamless integration with ERP/CRM systems</li>
                    <li><BiCheckCircle className="list-icon" /> Multi-currency and multi-language support</li>
                    <li><BiCheckCircle className="list-icon" /> Configurable workflows for local/global processes</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col lg="6" className="mb-4">
              <Card className="feature-card">
                <Card.Body className="p-4">
                  <div className="section-header">
                    <BiBarChart className="section-icon" />
                    <h3 className="section-title">Customer Impact</h3>
                  </div>
                  <p className="mb-3">Companies using Tender360 have reported:</p>
                  <ul className="feature-list">
                    <li><BiCheckCircle className="list-icon" /> Faster bid evaluations with fewer errors</li>
                    <li><BiCheckCircle className="list-icon" /> Reduced paperwork and centralized compliance</li>
                    <li><BiCheckCircle className="list-icon" /> Enhanced visibility with real-time dashboards</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Footer */}
          <Row>
            <Col lg="12">
              <Card className="footer-card">
                <Card.Body className="text-center p-4">
                  <h4 className="footer-title">Ready to Transform Your Tender Management?</h4>
                  <p className="footer-description">
                    Join leading enterprises who have revolutionized their tender processes with Tender360.
                  </p>
                  <div className="footer-badges">
                    <Badge bg="light" text="dark" className="me-2 mb-2">Enterprise Ready</Badge>
                    <Badge bg="light" text="dark" className="me-2 mb-2">AI-Powered</Badge>
                    <Badge bg="light" text="dark" className="me-2 mb-2">Global Scale</Badge>
                    <Badge bg="light" text="dark" className="me-2 mb-2">Compliance Focused</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default About;
