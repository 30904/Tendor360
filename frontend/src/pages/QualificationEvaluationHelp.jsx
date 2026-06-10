import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Button, Badge,
  Accordion, Alert, Table, ListGroup, Nav, Tab
} from 'react-bootstrap';
import {
  BiAward, BiBarChart, BiTrendingUp, BiTrendingDown,
  BiCheckCircle, BiXCircle, BiTime, BiInfoCircle,
  BiHelpCircle, BiDownload, BiUpload, BiEdit, BiShow
} from 'react-icons/bi';
// Using centralized help page styling from components.scss

const QualificationEvaluationHelp = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: 'Interactive Evaluation Matrix',
      description: 'Comprehensive scoring system with customizable criteria and weights',
      icon: BiBarChart,
      color: 'primary'
    },
    {
      title: 'AI-Powered Decision Support',
      description: 'Intelligent recommendations based on scoring and historical data',
      icon: BiAward,
      color: 'success'
    },
    {
      title: 'Quick Decision Framework',
      description: 'Streamlined process for rapid bid/no-bid decisions',
      icon: BiTrendingUp,
      color: 'warning'
    },
    {
      title: 'Performance Analytics',
      description: 'Detailed insights and performance tracking across evaluations',
      icon: BiAward,
      color: 'info'
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Create Evaluation',
      description: 'Start a new evaluation for a tender with predefined or custom criteria',
      actions: ['Select tender', 'Choose evaluation type', 'Set priority level']
    },
    {
      step: 2,
      title: 'Define Criteria',
      description: 'Set up evaluation criteria with appropriate weights and scoring methods',
      actions: ['Add criteria', 'Set weights', 'Define scoring scale']
    },
    {
      step: 3,
      title: 'Score & Analyze',
      description: 'Evaluate each criterion and review the weighted scoring results',
      actions: ['Score criteria', 'Review calculations', 'Analyze performance']
    },
    {
      step: 4,
      title: 'Make Decision',
      description: 'Use insights to make informed bid/no-bid decisions',
      actions: ['Review recommendations', 'Consider factors', 'Finalize decision']
    }
  ];

  const criteriaTypes = [
    {
      category: 'TECHNICAL',
      description: 'Technical capabilities and expertise',
      examples: ['Technical skills', 'Infrastructure', 'Innovation capability'],
      weight: '25-35%'
    },
    {
      category: 'FINANCIAL',
      description: 'Financial stability and capacity',
      examples: ['Financial health', 'Budget capacity', 'Risk assessment'],
      weight: '20-30%'
    },
    {
      category: 'EXPERIENCE',
      description: 'Relevant past experience and track record',
      examples: ['Project history', 'Industry experience', 'Client references'],
      weight: '20-25%'
    },
    {
      category: 'CAPACITY',
      description: 'Resource availability and scalability',
      examples: ['Team size', 'Resource allocation', 'Scalability'],
      weight: '15-20%'
    },
    {
      category: 'COMPLIANCE',
      description: 'Regulatory and legal compliance',
      examples: ['Legal requirements', 'Industry standards', 'Certifications'],
      weight: '10-15%'
    },
    {
      category: 'RISK',
      description: 'Risk factors and mitigation strategies',
      examples: ['Project risks', 'Mitigation plans', 'Contingency measures'],
      weight: '10-15%'
    }
  ];

  const scoringGuide = [
    { score: '10', label: 'Excellent', description: 'Exceeds all requirements significantly', color: 'success' },
    { score: '9', label: 'Very Good', description: 'Exceeds requirements with minor enhancements', color: 'success' },
    { score: '8', label: 'Good', description: 'Meets all requirements fully', color: 'success' },
    { score: '7', label: 'Satisfactory', description: 'Meets most requirements adequately', color: 'warning' },
    { score: '6', label: 'Adequate', description: 'Meets basic requirements', color: 'warning' },
    { score: '5', label: 'Marginal', description: 'Barely meets requirements', color: 'warning' },
    { score: '4', label: 'Below Average', description: 'Partially meets requirements', color: 'danger' },
    { score: '3', label: 'Poor', description: 'Significantly below requirements', color: 'danger' },
    { score: '2', label: 'Very Poor', description: 'Major deficiencies', color: 'danger' },
    { score: '1', label: 'Unacceptable', description: 'Does not meet requirements', color: 'danger' },
    { score: '0', label: 'Not Applicable', description: 'Cannot be evaluated', color: 'secondary' }
  ];

  return (
    <div className="qualification-evaluation-help">
      <Container fluid>
        {/* Header */}
        <div className="help-header text-center py-5 mb-5">
                     <div className="help-icon-large mb-3">
             <BiAward />
           </div>
          <h1 className="display-4 fw-bold text-primary mb-3">
            Qualification & Evaluation Help Center
          </h1>
          <p className="lead text-muted">
            Your comprehensive guide to making informed bid/no-bid decisions with AI-powered insights
          </p>
          <div className="help-badges mt-4">
            <Badge bg="primary" className="me-2 px-3 py-2">User Guide</Badge>
            <Badge bg="success" className="me-2 px-3 py-2">Features</Badge>
            <Badge bg="info" className="me-2 px-3 py-2">Workflow</Badge>
            <Badge bg="warning" className="px-3 py-2">Best Practices</Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-pills mb-4">
          <Nav variant="pills" className="justify-content-center">
            <Nav.Item>
              <Nav.Link
                eventKey="overview"
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2"
              >
                <BiHelpCircle className="me-2" />
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="features"
                active={activeTab === 'features'}
                onClick={() => setActiveTab('features')}
                className="px-4 py-2"
              >
                <BiAward className="me-2" />
                Features
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="workflow"
                active={activeTab === 'workflow'}
                onClick={() => setActiveTab('workflow')}
                className="px-4 py-2"
              >
                <BiTrendingUp className="me-2" />
                Workflow
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="criteria"
                active={activeTab === 'criteria'}
                onClick={() => setActiveTab('criteria')}
                className="px-4 py-2"
              >
                <BiBarChart className="me-2" />
                Criteria
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="scoring"
                active={activeTab === 'scoring'}
                onClick={() => setActiveTab('scoring')}
                className="px-4 py-2"
              >
                                 <BiAward className="me-2" />
                 Scoring
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="tips"
                active={activeTab === 'tips'}
                onClick={() => setActiveTab('tips')}
                className="px-4 py-2"
              >
                <BiInfoCircle className="me-2" />
                Tips & Best Practices
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* Tab Content */}
        <Tab.Content>
          {/* Overview Tab */}
          <Tab.Pane active={activeTab === 'overview'} className="tab-content">
            <Row className="g-4">
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">
                      <BiInfoCircle className="me-2 text-primary" />
                      System Overview
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <p className="lead">
                      The Qualification & Evaluation system is a comprehensive platform designed to help organizations
                      make informed decisions about whether to bid on tender opportunities.
                    </p>
                    
                    <h6>Key Benefits:</h6>
                    <ul>
                      <li><strong>Data-Driven Decisions:</strong> Make objective decisions based on quantitative scoring</li>
                      <li><strong>Time Efficiency:</strong> Streamlined evaluation process with predefined templates</li>
                      <li><strong>Risk Mitigation:</strong> Identify potential risks and challenges early</li>
                      <li><strong>Performance Tracking:</strong> Monitor evaluation success rates and improve processes</li>
                      <li><strong>Team Collaboration:</strong> Enable multiple stakeholders to contribute to evaluations</li>
                    </ul>

                    <h6>When to Use:</h6>
                    <ul>
                      <li>Evaluating new tender opportunities</li>
                      <li>Assessing bid/no-bid decisions</li>
                      <li>Reviewing project feasibility</li>
                      <li>Analyzing competitive positioning</li>
                      <li>Training evaluation teams</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">
                      <BiTrendingUp className="me-2 text-success" />
                      Quick Stats
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="stats-item">
                      <div className="stat-number">4</div>
                      <div className="stat-label">Evaluation Types</div>
                    </div>
                    <div className="stats-item">
                      <div className="stat-number">6</div>
                      <div className="stat-label">Criteria Categories</div>
                    </div>
                    <div className="stats-item">
                      <div className="stat-number">10</div>
                      <div className="stat-label">Scoring Scale</div>
                    </div>
                    <div className="stats-item">
                      <div className="stat-number">3</div>
                      <div className="stat-label">View Modes</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Features Tab */}
          <Tab.Pane active={activeTab === 'features'} className="tab-content">
            <Row className="g-4">
              {features.map((feature, index) => (
                <Col key={index} lg={6}>
                  <Card className="border-0 shadow-sm feature-card h-100">
                    <Card.Body className="text-center">
                      <div className={`feature-icon ${feature.color} mb-3`}>
                        <feature.icon />
                      </div>
                      <h5 className="mb-3">{feature.title}</h5>
                      <p className="text-muted">{feature.description}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab.Pane>

          {/* Workflow Tab */}
          <Tab.Pane active={activeTab === 'workflow'} className="tab-content">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <BiTrendingUp className="me-2 text-primary" />
                  Evaluation Workflow
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="workflow-steps">
                  {workflowSteps.map((step) => (
                    <div key={step.step} className="workflow-step">
                      <div className="step-header">
                        <div className="step-number">{step.step}</div>
                        <div className="step-content">
                          <h6 className="mb-2">{step.title}</h6>
                          <p className="text-muted mb-2">{step.description}</p>
                          <div className="step-actions">
                            {step.actions.map((action, index) => (
                              <Badge key={index} bg="light" text="dark" className="me-2">
                                {action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Criteria Tab */}
          <Tab.Pane active={activeTab === 'criteria'} className="tab-content">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <BiBarChart className="me-2 text-primary" />
                  Evaluation Criteria
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-4">
                  {criteriaTypes.map((criteria, index) => (
                    <Col key={index} md={6}>
                      <Card className="criteria-card border-0 shadow-sm h-100">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h6 className="mb-0">{criteria.category}</h6>
                            <Badge bg="primary">{criteria.weight}</Badge>
                          </div>
                          <p className="text-muted small mb-3">{criteria.description}</p>
                          <div className="criteria-examples">
                            <strong>Examples:</strong>
                            <ul className="mt-2 mb-0">
                              {criteria.examples.map((example, idx) => (
                                <li key={idx} className="small">{example}</li>
                              ))}
                            </ul>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Scoring Tab */}
          <Tab.Pane active={activeTab === 'scoring'} className="tab-content">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <BiAward className="me-2 text-primary" />
                  Scoring Guide
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="scoring-guide">
                  <Row className="g-3">
                    {scoringGuide.map((score) => (
                      <Col key={score.score} xs={12} sm={6} md={4}>
                        <div className={`score-item ${score.color}`}>
                          <div className="score-header">
                            <div className="score-number">{score.score}</div>
                            <div className="score-label">{score.label}</div>
                          </div>
                          <div className="score-description">{score.description}</div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Tips Tab */}
          <Tab.Pane active={activeTab === 'tips'} className="tab-content">
            <Row className="g-4">
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">
                      <BiCheckCircle className="me-2 text-success" />
                      Best Practices
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Set Clear Criteria:</strong> Define evaluation criteria that align with your organization's goals
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Use Consistent Scoring:</strong> Apply the same scoring standards across all evaluations
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Regular Reviews:</strong> Periodically review and update evaluation criteria
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Team Input:</strong> Involve multiple stakeholders in the evaluation process
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Document Decisions:</strong> Keep detailed records of evaluation rationale
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">
                      <BiInfoCircle className="me-2 text-warning" />
                      Common Mistakes
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Rushing Evaluations:</strong> Take time to thoroughly assess each criterion
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Ignoring Red Flags:</strong> Pay attention to warning signs and risk indicators
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Biased Scoring:</strong> Maintain objectivity in your evaluations
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Incomplete Analysis:</strong> Ensure all relevant factors are considered
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>No Follow-up:</strong> Track the outcomes of your decisions
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>

        {/* Footer */}
        <div className="help-footer text-center mt-5 py-4">
          <p className="text-muted mb-2">
            Need additional help? Contact our support team or check our documentation.
          </p>
          <Button variant="outline-primary" className="me-2">
            <BiDownload className="me-2" />
            Download Guide
          </Button>
          <Button variant="outline-secondary">
            <BiHelpCircle className="me-2" />
            Contact Support
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default QualificationEvaluationHelp;
