import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Button, Badge, ListGroup,
  ProgressBar, Alert, ButtonGroup, Modal
} from 'react-bootstrap';
import {
  BiTime, BiCheckCircle, BiXCircle, BiTrendingUp,
  BiTrendingDown, BiInfoCircle, BiShow
} from 'react-icons/bi';
import './QuickDecisionsPanel.scss';

const QuickDecisionsPanel = () => {
  const [quickDecisions, setQuickDecisions] = useState({
    recentEvaluations: [],
    pendingDecisions: [],
    urgentEvaluations: []
  });
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockData = {
      recentEvaluations: [
        {
          id: 1,
          tenderTitle: 'Healthcare IT Infrastructure',
          organization: 'City General Hospital',
          evaluator: 'John Smith',
          status: 'APPROVED',
          decision: 'BID',
          weightedScore: 82.5,
          deadline: '2024-02-15',
          priority: 'HIGH'
        },
        {
          id: 2,
          tenderTitle: 'Educational Software Development',
          organization: 'State University',
          evaluator: 'Sarah Johnson',
          status: 'UNDER_REVIEW',
          decision: 'PENDING',
          weightedScore: 70.5,
          deadline: '2024-02-20',
          priority: 'MEDIUM'
        }
      ],
      pendingDecisions: [
        {
          id: 3,
          tenderTitle: 'Construction Management System',
          organization: 'Metro Construction Co.',
          evaluator: 'Mike Wilson',
          status: 'DRAFT',
          decision: 'PENDING',
          weightedScore: 0,
          deadline: '2024-02-10',
          priority: 'URGENT'
        },
        {
          id: 4,
          tenderTitle: 'Financial Analytics Platform',
          organization: 'Global Bank Ltd.',
          evaluator: 'Lisa Chen',
          status: 'DRAFT',
          decision: 'PENDING',
          weightedScore: 0,
          deadline: '2024-02-25',
          priority: 'HIGH'
        }
      ],
      urgentEvaluations: [
        {
          id: 5,
          tenderTitle: 'Emergency Response System',
          organization: 'City Emergency Services',
          evaluator: 'David Brown',
          status: 'IN_PROGRESS',
          decision: 'PENDING',
          weightedScore: 45,
          deadline: '2024-02-05',
          priority: 'URGENT',
          daysLeft: 3
        },
        {
          id: 6,
          tenderTitle: 'Public Transportation App',
          organization: 'Metro Transit Authority',
          evaluator: 'Emma Davis',
          status: 'DRAFT',
          decision: 'PENDING',
          weightedScore: 0,
          deadline: '2024-02-08',
          priority: 'HIGH',
          daysLeft: 6
        }
      ]
    };
    setQuickDecisions(mockData);
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      'DRAFT': 'secondary',
      'IN_PROGRESS': 'info',
      'UNDER_REVIEW': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const getDecisionBadge = (decision) => {
    const variants = {
      'BID': 'success',
      'NO_BID': 'danger',
      'PENDING': 'warning'
    };
    return <Badge bg={variants[decision] || 'secondary'}>{decision}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      'LOW': 'secondary',
      'MEDIUM': 'warning',
      'HIGH': 'danger',
      'URGENT': 'dark'
    };
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 3) return 'danger';
    if (daysLeft <= 7) return 'warning';
    return 'info';
  };

  const handleViewDecision = (decision) => {
    setSelectedDecision(decision);
    setShowDecisionModal(true);
  };

  const getRecommendation = (score, status) => {
    if (status === 'DRAFT') return { text: 'Complete Evaluation', variant: 'info' };
    if (score >= 80) return { text: 'Strong BID Recommendation', variant: 'success' };
    if (score >= 60) return { text: 'Consider BID with Improvements', variant: 'warning' };
    return { text: 'NO BID Recommendation', variant: 'danger' };
  };

  return (
    <div className="quick-decisions-panel">
      {/* Header */}
      <div className="panel-header mb-4">
        <h5 className="mb-2">
          <BiTrendingUp className="me-2 text-primary" />
          Quick Decisions & Insights
        </h5>
        <p className="text-muted mb-0">
          Get instant insights and make informed decisions quickly
        </p>
      </div>

      <Row className="g-4">
        {/* Urgent Evaluations */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm urgent-card">
            <Card.Header className="bg-danger text-dark">
              <h6 className="mb-0">
                                 <BiTime className="me-2" />
                Urgent Evaluations
              </h6>
            </Card.Header>
            <Card.Body>
              {quickDecisions.urgentEvaluations.length > 0 ? (
                <ListGroup variant="flush">
                  {quickDecisions.urgentEvaluations.map((evaluation) => {
                    const recommendation = getRecommendation(evaluation.weightedScore, evaluation.status);
                    return (
                      <ListGroup.Item key={evaluation.id} className="urgent-item">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <div className="tender-title">{evaluation.tenderTitle}</div>
                            <div className="tender-org text-muted small">
                              {evaluation.organization}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className={`urgency-badge ${getUrgencyColor(evaluation.daysLeft)}`}>
                              {evaluation.daysLeft} days left
                            </div>
                            {getPriorityBadge(evaluation.priority)}
                          </div>
                        </div>
                        
                        <div className="evaluation-metrics">
                          <div className="metric-row">
                            <span className="metric-label">Evaluator:</span>
                            <span className="metric-value">{evaluation.evaluator}</span>
                          </div>
                          <div className="metric-row">
                            <span className="metric-label">Status:</span>
                            <span className="metric-value">{getStatusBadge(evaluation.status)}</span>
                          </div>
                          <div className="metric-row">
                            <span className="metric-label">Score:</span>
                            <span className={`metric-value ${getScoreColor(evaluation.weightedScore)}`}>
                              {evaluation.weightedScore > 0 ? `${Math.round(evaluation.weightedScore)}%` : 'Not Scored'}
                            </span>
                          </div>
                        </div>

                        <Alert variant={recommendation.variant} className="mt-2 mb-2">
                          <strong>{recommendation.text}</strong>
                        </Alert>

                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewDecision(evaluation)}
                          >
                            <BiShow className="me-1" />
                            View Details
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="ms-2"
                          >
                            <BiCheckCircle className="me-1" />
                            Complete
                          </Button>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              ) : (
                <div className="text-center text-muted py-4">
                  <BiCheckCircle className="text-success" style={{ fontSize: '3rem' }} />
                  <p className="mt-2">No urgent evaluations</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Pending Decisions */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm pending-card">
            <Card.Header className="bg-warning text-dark">
              <h6 className="mb-0">
                <BiInfoCircle className="me-2" />
                Pending Decisions
              </h6>
            </Card.Header>
            <Card.Body>
              {quickDecisions.pendingDecisions.length > 0 ? (
                <ListGroup variant="flush">
                  {quickDecisions.pendingDecisions.map((evaluation) => (
                    <ListGroup.Item key={evaluation.id} className="pending-item">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <div className="tender-title">{evaluation.tenderTitle}</div>
                          <div className="tender-org text-muted small">
                            {evaluation.organization}
                          </div>
                        </div>
                        <div className="text-end">
                          {getPriorityBadge(evaluation.priority)}
                        </div>
                      </div>
                      
                      <div className="evaluation-metrics">
                        <div className="metric-row">
                          <span className="metric-label">Evaluator:</span>
                          <span className="metric-value">{evaluation.evaluator}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Deadline:</span>
                          <span className="metric-value">
                            {new Date(evaluation.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Status:</span>
                          <span className="metric-value">{getStatusBadge(evaluation.status)}</span>
                        </div>
                      </div>

                      <Alert variant="info" className="mt-2 mb-2">
                        <BiInfoCircle className="me-2" />
                        <strong>Action Required:</strong> Complete evaluation and make decision
                      </Alert>

                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewDecision(evaluation)}
                        >
                          <BiShow className="me-1" />
                          View Details
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="ms-2"
                        >
                          <BiTrendingUp className="me-1" />
                          Start Evaluation
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center text-muted py-4">
                  <BiCheckCircle className="text-success" style={{ fontSize: '3rem' }} />
                  <p className="mt-2">No pending decisions</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0">
                <BiTrendingUp className="me-2 text-primary" />
                Recent Activity
              </h6>
            </Card.Header>
            <Card.Body>
              {quickDecisions.recentEvaluations.length > 0 ? (
                <div className="recent-activity">
                  {quickDecisions.recentEvaluations.map((evaluation) => (
                    <div key={evaluation.id} className="activity-item">
                      <div className="activity-header">
                        <div className="activity-title">
                          <span className="tender-name">{evaluation.tenderTitle}</span>
                          <span className="organization-name"> - {evaluation.organization}</span>
                        </div>
                        <div className="activity-meta">
                          <span className="evaluator">{evaluation.evaluator}</span>
                          <span className="date">
                            {new Date(evaluation.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="activity-status">
                        <div className="status-badges">
                          {getStatusBadge(evaluation.status)}
                          {getDecisionBadge(evaluation.decision)}
                        </div>
                        <div className="score-display">
                          <span className={`score-value ${getScoreColor(evaluation.weightedScore)}`}>
                            {Math.round(evaluation.weightedScore)}%
                          </span>
                          <ProgressBar
                            now={evaluation.weightedScore}
                            variant={getScoreColor(evaluation.weightedScore)}
                            style={{ height: '4px', width: '60px' }}
                            className="ms-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <BiInfoCircle className="text-info" style={{ fontSize: '3rem' }} />
                  <p className="mt-2">No recent activity</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Decision Detail Modal */}
      <Modal show={showDecisionModal} onHide={() => setShowDecisionModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <BiShow className="me-2" />
            Decision Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDecision && (
            <div className="decision-detail">
              <Row className="g-3">
                <Col md={6}>
                  <h6>Tender Information</h6>
                  <div className="detail-item">
                    <strong>Title:</strong> {selectedDecision.tenderTitle}
                  </div>
                  <div className="detail-item">
                    <strong>Organization:</strong> {selectedDecision.organization}
                  </div>
                  <div className="detail-item">
                    <strong>Evaluator:</strong> {selectedDecision.evaluator}
                  </div>
                  <div className="detail-item">
                    <strong>Deadline:</strong> {new Date(selectedDecision.deadline).toLocaleDateString()}
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Evaluation Status</h6>
                  <div className="detail-item">
                    <strong>Status:</strong> {getStatusBadge(selectedDecision.status)}
                  </div>
                  <div className="detail-item">
                    <strong>Decision:</strong> {getDecisionBadge(selectedDecision.decision)}
                  </div>
                  <div className="detail-item">
                    <strong>Priority:</strong> {getPriorityBadge(selectedDecision.priority)}
                  </div>
                  <div className="detail-item">
                    <strong>Score:</strong> 
                    <span className={`ms-2 ${getScoreColor(selectedDecision.weightedScore)}`}>
                      {selectedDecision.weightedScore > 0 ? `${Math.round(selectedDecision.weightedScore)}%` : 'Not Scored'}
                    </span>
                  </div>
                </Col>
              </Row>
              
              <div className="recommendation-section mt-4">
                <h6>Recommendation</h6>
                <Alert variant={getRecommendation(selectedDecision.weightedScore, selectedDecision.status).variant}>
                  <strong>{getRecommendation(selectedDecision.weightedScore, selectedDecision.status).text}</strong>
                </Alert>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDecisionModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            Take Action
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuickDecisionsPanel;
