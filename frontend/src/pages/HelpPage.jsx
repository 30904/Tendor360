import React, { useState } from 'react'
import { 
  Container, Row, Col, Card, Button, Badge, 
  Accordion, Alert, Table, ListGroup, Nav, Tab
} from 'react-bootstrap'
import { 
  BiSearch, BiFilter, BiGrid, BiListUl, BiPlus, BiRefresh, 
  BiShare, BiDownload, BiUpload, BiEdit, BiShow, BiHelpCircle,
  BiBuilding, BiMapPin, BiCalendar, BiAward, BiFile, BiUser,
  BiCheckCircle, BiXCircle, BiTime, BiChevronRight
} from 'react-icons/bi'
// Using centralized help page styling from components.scss

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const features = [
    {
      title: 'AI-Powered Tender Matching',
      description: 'Advanced AI algorithms analyze tender requirements and match them with your company profile',
      icon: '🤖',
      benefits: ['Higher win probability', 'Time-saving analysis', 'Data-driven insights']
    },
    {
      title: 'Smart Status Management',
      description: 'Organize tenders by status with intelligent workflow management',
      icon: '📊',
      benefits: ['Visual status tracking', 'Automated reminders', 'Progress monitoring']
    },
    {
      title: 'Advanced Filtering & Search',
      description: 'Powerful search and filter capabilities to find relevant tenders quickly',
      icon: '🔍',
      benefits: ['Multi-criteria filtering', 'Saved searches', 'Real-time results']
    },
    {
      title: 'Comprehensive Tender Details',
      description: 'View and edit detailed tender information with professional layouts',
      icon: '📋',
      benefits: ['Rich data display', 'Print-friendly format', 'Export capabilities']
    }
  ]

  const quickActions = [
    { action: 'Create New Tender', icon: <BiPlus />, description: 'Start a new tender opportunity' },
    { action: 'Bulk Import', icon: <BiUpload />, description: 'Import multiple tenders at once' },
    { action: 'Search Tenders', icon: <BiSearch />, description: 'Find specific tenders quickly' },
    { action: 'Filter Results', icon: <BiFilter />, description: 'Narrow down results by criteria' },
    { action: 'View Details', icon: <BiShow />, description: 'See complete tender information' },
    { action: 'Edit Tender', icon: <BiEdit />, description: 'Modify tender details' },
    { action: 'Export Data', icon: <BiDownload />, description: 'Download tender data' }
  ]

  const statusGuide = [
    { status: 'Active', color: 'success', description: 'Currently open and accepting submissions', icon: '✅' },
    { status: 'Draft', color: 'secondary', description: 'Work in progress, fully editable', icon: '📝' },
    { status: 'Overdue', color: 'warning', description: 'Deadline has passed, limited editing', icon: '⚠️' },
    { status: 'Closed', color: 'info', description: 'No longer accepting submissions', icon: '🔒' },
    { status: 'Completed', color: 'primary', description: 'Awarded or cancelled, archived', icon: '🏆' }
  ]

  return (
    <div className="help-page">
      <Container fluid>
        {/* Header */}
        <div className="help-header text-center py-5 mb-5 position-relative">
          {/* Back to App Button */}
          <div className="position-absolute top-0 start-0 p-4">
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={() => window.close()}
              className="back-to-app-btn"
            >
              ← Back to App
            </Button>
          </div>
          
          <div className="help-icon-large mb-3">
            <BiHelpCircle />
          </div>
          <h1 className="display-4 fw-bold text-primary mb-3">
            Tender Intelligence Help Center
          </h1>
          <p className="lead text-muted">
            Your comprehensive guide to managing tender opportunities with AI-powered insights
          </p>
          <div className="help-badges mt-4">
            <Badge bg="primary" className="me-2 px-3 py-2">User Guide</Badge>
            <Badge bg="success" className="me-2 px-3 py-2">Features</Badge>
            <Badge bg="info" className="me-2 px-3 py-2">Tutorials</Badge>
            <Badge bg="warning" className="px-3 py-2">Tips & Tricks</Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Row className="mb-5">
          <Col>
            <Nav variant="pills" className="help-nav justify-content-center" activeKey={activeTab} onSelect={setActiveTab}>
              <Nav.Item>
                <Nav.Link eventKey="overview">
                  <BiHelpCircle className="me-2" />
                  Overview
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="features">
                  <BiAward className="me-2" />
                  Features
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="how-to">
                  <BiFile className="me-2" />
                  How to Use
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tips">
                  <BiAward className="me-2" />
                  Tips & Best Practices
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        {/* Content Tabs */}
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Tab.Content>
            
            {/* Overview Tab */}
            <Tab.Pane eventKey="overview">
              <Row className="g-4">
                <Col lg={8}>
                  <Card className="help-card h-100">
                    <Card.Body>
                      <h3 className="mb-4">
                        <BiHelpCircle className="me-3 text-primary" />
                        Welcome to Tender Intelligence
                      </h3>
                      <p className="lead mb-4">
                        Tender Intelligence is a comprehensive platform designed to help organizations discover, 
                        track, and manage tender opportunities with the power of artificial intelligence.
                      </p>
                      
                      <div className="mb-4">
                        <h5 className="mb-3">🎯 What You Can Do:</h5>
                        <ListGroup variant="flush">
                          <ListGroup.Item className="d-flex align-items-center">
                            <BiSearch className="me-3 text-primary" />
                            <div>
                              <strong>Discover Opportunities:</strong> Find relevant tenders using AI-powered matching
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center">
                            <BiFilter className="me-3 text-primary" />
                            <div>
                              <strong>Smart Filtering:</strong> Use advanced filters to narrow down results
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center">
                            <BiEdit className="me-3 text-primary" />
                            <div>
                              <strong>Manage Tenders:</strong> Create, edit, and track tender opportunities
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center">
                            <BiDownload className="me-3 text-primary" />
                            <div>
                              <strong>Export & Share:</strong> Download data and share with team members
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      </div>

                      <Alert variant="info" className="mb-0">
                        <BiTime className="me-2" />
                        <strong>Pro Tip:</strong> Use the AI Match Score to prioritize tenders with the highest 
                        probability of success based on your company's capabilities and experience.
                      </Alert>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                                             <h5 className="mb-3">
                         <BiAward className="me-2 text-primary" />
                         Quick Stats
                       </h5>
                      <div className="text-center">
                        <div className="stat-item mb-3">
                          <div className="display-6 text-primary fw-bold">AI-Powered</div>
                          <small className="text-muted">Matching Algorithm</small>
                        </div>
                        <div className="stat-item mb-3">
                          <div className="h4 text-success fw-bold">Smart</div>
                          <small className="text-muted">Status Management</small>
                        </div>
                        <div className="stat-item mb-3">
                          <div className="h4 text-info fw-bold">Advanced</div>
                          <small className="text-muted">Filtering System</small>
                        </div>
                        <div className="stat-item">
                          <div className="h4 text-warning fw-bold">Professional</div>
                          <small className="text-muted">Data Export</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Features Tab */}
            <Tab.Pane eventKey="features">
              <Row className="g-4">
                {features.map((feature, index) => (
                  <Col lg={6} key={index}>
                    <Card className="border-0 shadow-sm h-100 feature-card">
                      <Card.Body className="p-4">
                        <div className="text-center mb-3">
                          <div className="feature-icon mb-2">{feature.icon}</div>
                          <h5 className="fw-bold">{feature.title}</h5>
                        </div>
                        <p className="text-muted mb-3">{feature.description}</p>
                        <div>
                          <strong className="text-primary">Key Benefits:</strong>
                          <ul className="mt-2 mb-0">
                            {feature.benefits.map((benefit, idx) => (
                              <li key={idx} className="small">{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row className="mt-5">
                <Col>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="mb-3">
                        <BiAward className="me-2 text-primary" />
                        Advanced Capabilities
                      </h5>
                      <Row className="g-3">
                        <Col md={6}>
                          <div className="capability-item d-flex align-items-center p-3 bg-light rounded">
                            <BiBuilding className="me-3 text-primary" />
                            <div>
                              <strong>Organization Management</strong>
                              <small className="d-block text-muted">Track multiple organizations and locations</small>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="capability-item d-flex align-items-center p-3 bg-light rounded">
                            <BiCalendar className="me-3 text-primary" />
                            <div>
                              <strong>Timeline Tracking</strong>
                              <small className="d-block text-muted">Monitor deadlines and milestones</small>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="capability-item d-flex align-items-center p-3 bg-light rounded">
                            <BiFile className="me-3 text-primary" />
                            <div>
                              <strong>Document Management</strong>
                              <small className="d-block text-muted">Store and organize tender documents</small>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="capability-item d-flex align-items-center p-3 bg-light rounded">
                            <BiUser className="me-3 text-primary" />
                            <div>
                              <strong>Team Collaboration</strong>
                              <small className="d-block text-muted">Share and collaborate on tenders</small>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* How to Use Tab */}
            <Tab.Pane eventKey="how-to">
              <Row className="g-4">
                <Col lg={8}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h4 className="mb-4">
                        <BiFile className="me-3 text-primary" />
                        Step-by-Step Guide
                      </h4>
                      
                      <Accordion className="mb-4">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <BiPlus className="me-2 text-primary" />
                            Creating a New Tender
                          </Accordion.Header>
                          <Accordion.Body>
                            <ol>
                              <li>Click the <strong>"+ Create New Tender"</strong> button in the top right</li>
                              <li>Fill in the basic information (title, description, organization)</li>
                              <li>Set the estimated value and submission deadline</li>
                              <li>Choose therapeutic areas and tender type</li>
                              <li>Add tags for better categorization</li>
                              <li>Click <strong>"Create Tender"</strong> to save</li>
                            </ol>
                          </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                          <Accordion.Header>
                            <BiSearch className="me-2 text-primary" />
                            Searching and Filtering
                          </Accordion.Header>
                          <Accordion.Body>
                            <ol>
                              <li>Use the search bar to find specific tenders</li>
                              <li>Apply quick filters (Status, AI Match Score)</li>
                              <li>Expand the sidebar for advanced filters</li>
                              <li>Use therapeutic areas and tender types filters</li>
                              <li>Set estimated value ranges</li>
                              <li>Filter by submission deadlines</li>
                            </ol>
                          </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                          <Accordion.Header>
                            <BiEdit className="me-2 text-primary" />
                            Managing Tender Status
                          </Accordion.Header>
                          <Accordion.Body>
                            <ol>
                              <li>Use the status tabs to organize tenders</li>
                              <li>Click <strong>"Edit"</strong> to modify tender details</li>
                              <li>Change status based on current progress</li>
                              <li>Update pipeline stage and win probability</li>
                              <li>Add notes and additional details</li>
                              <li>Save changes to update the tender</li>
                            </ol>
                          </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="3">
                          <Accordion.Header>
                            <BiShow className="me-2 text-primary" />
                            Viewing Tender Details
                          </Accordion.Header>
                          <Accordion.Body>
                            <ol>
                              <li>Click <strong>"View Details"</strong> on any tender</li>
                              <li>Review all tender information in the modal</li>
                              <li>Check timeline and requirements</li>
                              <li>View contact information and tags</li>
                              <li>Use the <strong>"Print Details"</strong> button for reports</li>
                              <li>Close the modal when finished</li>
                            </ol>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>

                      <Alert variant="success">
                        <BiCheckCircle className="me-2" />
                        <strong>Remember:</strong> You can switch between grid and list views using the view toggle 
                        buttons in the main content area.
                      </Alert>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                                             <h5 className="mb-3">
                         <BiAward className="me-2 text-primary" />
                         Quick Actions
                       </h5>
                      <div className="quick-actions">
                        {quickActions.map((action, index) => (
                          <div key={index} className="quick-action-item d-flex align-items-center p-2 mb-2 bg-light rounded">
                            <div className="action-icon me-2 text-primary">
                              {action.icon}
                            </div>
                            <div>
                              <strong className="small">{action.action}</strong>
                              <small className="d-block text-muted">{action.description}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Tips & Best Practices Tab */}
            <Tab.Pane eventKey="tips">
              <Row className="g-4">
                <Col lg={8}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h4 className="mb-4">
                        <BiAward className="me-3 text-primary" />
                        Pro Tips & Best Practices
                      </h4>

                      <div className="tips-section mb-4">
                        <h5 className="mb-3">🚀 Efficiency Tips</h5>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <strong>Use AI Match Scores:</strong> Focus on tenders with 80%+ match scores for 
                            higher success rates
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Save Common Searches:</strong> Create and save frequently used filter combinations
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Bulk Operations:</strong> Use bulk import for multiple tenders and bulk actions 
                            for efficiency
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Regular Updates:</strong> Keep tender information current for accurate tracking
                          </ListGroup.Item>
                        </ListGroup>
                      </div>

                      <div className="tips-section mb-4">
                        <h5 className="mb-3">📊 Data Management</h5>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <strong>Consistent Tagging:</strong> Use standardized tags for better organization
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Status Workflow:</strong> Follow the recommended status progression for consistency
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Document Organization:</strong> Keep all related documents linked to tenders
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Regular Backups:</strong> Export important data regularly
                          </ListGroup.Item>
                        </ListGroup>
                      </div>

                      <Alert variant="warning">
                        <BiTime className="me-2" />
                        <strong>Pro Tip:</strong> Set up regular reminders for tender deadlines and use the 
                        urgency indicators to prioritize your work.
                      </Alert>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <h5 className="mb-3">
                        <BiCheckCircle className="me-2 text-primary" />
                        Status Guide
                      </h5>
                      <div className="status-guide">
                        {statusGuide.map((status, index) => (
                          <div key={index} className="status-item d-flex align-items-center p-2 mb-2 bg-light rounded">
                            <div className="status-icon me-2">{status.icon}</div>
                            <div>
                              <Badge bg={status.color} className="mb-1">{status.status}</Badge>
                              <small className="d-block text-muted">{status.description}</small>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                                                 <h6 className="mb-2">
                           <BiAward className="me-2 text-primary" />
                           Keyboard Shortcuts
                         </h6>
                        <Table size="sm" borderless>
                          <tbody>
                            <tr>
                              <td><kbd>Ctrl</kbd> + <kbd>N</kbd></td>
                              <td>New Tender</td>
                            </tr>
                            <tr>
                              <td><kbd>Ctrl</kbd> + <kbd>F</kbd></td>
                              <td>Search</td>
                            </tr>
                            <tr>
                              <td><kbd>Ctrl</kbd> + <kbd>E</kbd></td>
                              <td>Export</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {/* Footer */}
        <div className="help-footer text-center py-5 mt-5">
          <div className="border-top pt-4">
            <p className="text-muted mb-2">
              Need more help? Contact our support team or check our comprehensive documentation.
            </p>
            <div className="help-links">
              <Button variant="outline-primary" className="me-2">
                Contact Support
              </Button>
              <Button variant="outline-secondary" className="me-2">
                Video Tutorials
              </Button>
              <Button variant="outline-success">
                User Manual
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default HelpPage
