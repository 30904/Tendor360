import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Button, Form, Table, Badge,
  ProgressBar, Alert, ButtonGroup, Modal
} from 'react-bootstrap';
import FormDrawerModal from './FormDrawerModal';
import { dummyEvaluationMatrixPatch } from '../utils/testFormDummies';
import {
  BiPlus, BiEdit, BiTrash, BiShow, BiDownload,
  BiUpload, BiBarChart, BiPieChart, BiTrendingUp,
  BiXCircle, BiCheckCircle
} from 'react-icons/bi';
import './EvaluationMatrix.scss';

const EvaluationMatrix = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, chart, grid
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  
  // Edit and Delete functionality
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEvaluation, setDeletingEvaluation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockEvaluations = [
      {
        id: 1,
        tenderTitle: 'Healthcare IT Infrastructure',
        organization: 'City General Hospital',
        evaluator: 'John Smith',
        status: 'APPROVED',
        decision: 'BID',
        totalScore: 85,
        weightedScore: 82.5,
        criteria: [
          { name: 'Technical Capability', category: 'TECHNICAL', weight: 25, score: 8.5 },
          { name: 'Financial Stability', category: 'FINANCIAL', weight: 20, score: 8.0 },
          { name: 'Experience', category: 'EXPERIENCE', weight: 20, score: 9.0 },
          { name: 'Capacity', category: 'CAPACITY', weight: 15, score: 8.0 },
          { name: 'Compliance', category: 'COMPLIANCE', weight: 10, score: 8.5 },
          { name: 'Risk Assessment', category: 'RISK', weight: 10, score: 7.5 }
        ],
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        tenderTitle: 'Educational Software Development',
        organization: 'State University',
        evaluator: 'Sarah Johnson',
        status: 'UNDER_REVIEW',
        decision: 'PENDING',
        totalScore: 72,
        weightedScore: 70.5,
        criteria: [
          { name: 'Technical Capability', category: 'TECHNICAL', weight: 30, score: 7.5 },
          { name: 'Financial Stability', category: 'FINANCIAL', weight: 20, score: 7.0 },
          { name: 'Experience', category: 'EXPERIENCE', weight: 25, score: 8.0 },
          { name: 'Capacity', category: 'CAPACITY', weight: 15, score: 6.5 },
          { name: 'Compliance', category: 'COMPLIANCE', weight: 5, score: 7.0 },
          { name: 'Risk Assessment', category: 'RISK', weight: 5, score: 7.5 }
        ],
        createdAt: '2024-01-14'
      },
      {
        id: 3,
        tenderTitle: 'Construction Management System',
        organization: 'Metro Construction Co.',
        evaluator: 'Mike Wilson',
        status: 'DRAFT',
        decision: 'PENDING',
        totalScore: 0,
        weightedScore: 0,
        criteria: [
          { name: 'Technical Capability', category: 'TECHNICAL', weight: 25, score: 0 },
          { name: 'Financial Stability', category: 'FINANCIAL', weight: 20, score: 0 },
          { name: 'Experience', category: 'EXPERIENCE', weight: 20, score: 0 },
          { name: 'Capacity', category: 'CAPACITY', weight: 15, score: 0 },
          { name: 'Compliance', category: 'COMPLIANCE', weight: 10, score: 0 },
          { name: 'Risk Assessment', category: 'RISK', weight: 10, score: 0 }
        ],
        createdAt: '2024-01-13'
      }
    ];
    setEvaluations(mockEvaluations);
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const handleViewMatrix = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowMatrixModal(true);
  };

  const handleEditEvaluation = (evaluation) => {
    setEditingEvaluation({ ...evaluation });
    setShowEditModal(true);
  };

  const handleDeleteEvaluation = (evaluation) => {
    setDeletingEvaluation(evaluation);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingEvaluation) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from local state
      setEvaluations(prev => prev.filter(evaluation => evaluation.id !== deletingEvaluation.id));
      
      // Close modal and reset state
      setShowDeleteModal(false);
      setDeletingEvaluation(null);
      
      // Show success message
      setSuccessMessage('Evaluation deleted successfully!');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (error) {
      // console.error('Error deleting evaluation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingEvaluation) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setEvaluations(prev => prev.map(evaluation => 
        evaluation.id === editingEvaluation.id ? editingEvaluation : evaluation
      ));
      
      // Close modal and reset state
      setShowEditModal(false);
      setEditingEvaluation(null);
      
      // Show success message
      setSuccessMessage('Evaluation updated successfully!');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (error) {
      // console.error('Error updating evaluation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditingEvaluation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCriteriaEdit = (index, field, value) => {
    setEditingEvaluation(prev => {
      const updatedCriteria = prev.criteria.map((criterion, i) => 
        i === index ? { ...criterion, [field]: value } : criterion
      );
      
      // Recalculate weighted score
      const weightedScore = updatedCriteria.reduce((sum, c) => {
        return sum + (c.score * c.weight / 10);
      }, 0);
      
      return {
        ...prev,
        criteria: updatedCriteria,
        weightedScore: Math.round(weightedScore * 10) / 10
      };
    });
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    if (filterStatus === 'all') return true;
    return evaluation.status === filterStatus;
  });

  const sortedEvaluations = [...filteredEvaluations].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.weightedScore - a.weightedScore;
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'tender':
        return a.tenderTitle.localeCompare(b.tenderTitle);
      default:
        return 0;
    }
  });

  return (
    <div className="evaluation-matrix">
      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert 
          variant="success" 
          className="mb-3 d-flex align-items-center justify-content-between"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
        >
          <div className="d-flex align-items-center">
            <BiCheckCircle className="me-2" />
            {successMessage}
          </div>
        </Alert>
      )}
      
      {/* Header Controls */}
      <div className="matrix-controls mb-4">
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">
              <BiBarChart className="me-2 text-primary" />
              Evaluation Matrix
            </h5>
            <p className="text-muted mb-0">
              Interactive scoring matrix and decision framework
            </p>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2">
              <Form.Select
                size="sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </Form.Select>
              
              <Form.Select
                size="sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="score">Sort by Score</option>
                <option value="date">Sort by Date</option>
                <option value="tender">Sort by Tender</option>
              </Form.Select>
            </div>
          </Col>
        </Row>
      </div>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle mb-3">
        <ButtonGroup>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('table')}
          >
            <BiBarChart className="me-1" />
            Table View
          </Button>
          <Button
            variant={viewMode === 'chart' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('chart')}
          >
            <BiPieChart className="me-1" />
            Chart View
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('grid')}
          >
            <BiTrendingUp className="me-1" />
            Grid View
          </Button>
        </ButtonGroup>
      </div>

      {/* Matrix Content */}
      {viewMode === 'table' && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <Table responsive className="matrix-table mb-0">
              <thead>
                <tr>
                  <th>Tender</th>
                  <th>Evaluator</th>
                  <th>Score</th>
                  <th>Decision</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedEvaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="matrix-row">
                    <td>
                      <div className="tender-info">
                        <div className="tender-title">{evaluation.tenderTitle}</div>
                        <div className="tender-org text-muted small">
                          {evaluation.organization}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="evaluator-info">
                        {evaluation.evaluator}
                      </div>
                    </td>
                    <td>
                      <div className="score-display">
                        <div className={`score-badge ${getScoreColor(evaluation.weightedScore)}`}>
                          {evaluation.weightedScore > 0 ? Math.round(evaluation.weightedScore) : 'N/A'}%
                        </div>
                        {evaluation.weightedScore > 0 && (
                          <ProgressBar
                            now={evaluation.weightedScore}
                            variant={getScoreColor(evaluation.weightedScore)}
                            className="mt-1"
                            style={{ height: '4px' }}
                          />
                        )}
                      </div>
                    </td>
                    <td>{getDecisionBadge(evaluation.decision)}</td>
                    <td>{getStatusBadge(evaluation.status)}</td>
                    <td>
                      <div className="date-info">
                        {new Date(evaluation.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <ButtonGroup>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewMatrix(evaluation)}
                          title="View Matrix"
                        >
                          <BiShow />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEditEvaluation(evaluation)}
                          title="Edit"
                        >
                          <BiEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteEvaluation(evaluation)}
                          title="Delete"
                        >
                          <BiTrash />
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {viewMode === 'chart' && (
        <Row className="g-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h6 className="mb-0">Score Distribution</h6>
              </Card.Header>
              <Card.Body className="text-center">
                <div className="chart-placeholder">
                  <BiPieChart className="text-muted" style={{ fontSize: '4rem' }} />
                  <p className="text-muted mt-2">Chart visualization will be implemented here</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h6 className="mb-0">Category Performance</h6>
              </Card.Header>
              <Card.Body>
                <div className="category-stats">
                  {['Technical', 'Financial', 'Experience', 'Capacity', 'Compliance', 'Risk'].map((category) => (
                    <div key={category} className="category-item">
                      <div className="category-label">{category}</div>
                      <div className="category-score">
                        <ProgressBar
                          now={Math.random() * 100}
                          variant="primary"
                          className="me-2"
                          style={{ height: '8px' }}
                        />
                        <span className="score-text">{Math.round(Math.random() * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {viewMode === 'grid' && (
        <Row className="g-3">
          {sortedEvaluations.map((evaluation) => (
            <Col key={evaluation.id} md={6} lg={4}>
              <Card className="matrix-card border-0 shadow-sm h-100">
                <Card.Header className="bg-light">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{evaluation.tenderTitle}</h6>
                      <small className="text-muted">{evaluation.organization}</small>
                    </div>
                    {getStatusBadge(evaluation.status)}
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="matrix-card-content">
                    <div className="evaluator-info mb-2">
                      <strong>Evaluator:</strong> {evaluation.evaluator}
                    </div>
                    
                    <div className="score-summary mb-3">
                      <div className="score-circle">
                        {evaluation.weightedScore > 0 ? Math.round(evaluation.weightedScore) : 'N/A'}
                      </div>
                      <div className="score-label">Weighted Score</div>
                    </div>
                    
                    <div className="decision-display mb-3">
                      {getDecisionBadge(evaluation.decision)}
                    </div>
                    
                    <div className="criteria-preview">
                      <small className="text-muted">Top Criteria:</small>
                      {evaluation.criteria.slice(0, 3).map((criterion, index) => (
                        <div key={index} className="criterion-preview">
                          <span className="criterion-name">{criterion.name}</span>
                          <span className="criterion-score">{criterion.score}/10</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {new Date(evaluation.createdAt).toLocaleDateString()}
                    </small>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewMatrix(evaluation)}
                    >
                      View Matrix
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Matrix Detail Modal */}
      <Modal show={showMatrixModal} onHide={() => setShowMatrixModal(false)} size="xl">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <BiBarChart className="me-2" />
            Evaluation Matrix - {selectedEvaluation?.tenderTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvaluation && (
            <div className="matrix-detail">
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Evaluation Summary</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="summary-item">
                        <strong>Tender:</strong> {selectedEvaluation.tenderTitle}
                      </div>
                      <div className="summary-item">
                        <strong>Organization:</strong> {selectedEvaluation.organization}
                      </div>
                      <div className="summary-item">
                        <strong>Evaluator:</strong> {selectedEvaluation.evaluator}
                      </div>
                      <div className="summary-item">
                        <strong>Status:</strong> {getStatusBadge(selectedEvaluation.status)}
                      </div>
                      <div className="summary-item">
                        <strong>Decision:</strong> {getDecisionBadge(selectedEvaluation.decision)}
                      </div>
                      <div className="summary-item">
                        <strong>Total Score:</strong> 
                        <span className={`ms-2 fw-bold text-${getScoreColor(selectedEvaluation.totalScore)}`}>
                          {selectedEvaluation.totalScore}/10
                        </span>
                      </div>
                      <div className="summary-item">
                        <strong>Weighted Score:</strong> 
                        <span className={`ms-2 fw-bold text-${getScoreColor(selectedEvaluation.weightedScore)}`}>
                          {selectedEvaluation.weightedScore}%
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Score Breakdown</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="score-breakdown">
                        {selectedEvaluation.criteria.map((criterion, index) => (
                          <div key={index} className="criterion-score-item">
                            <div className="criterion-info">
                              <div className="criterion-name">{criterion.name}</div>
                              <div className="criterion-category">
                                <Badge bg="secondary" size="sm">{criterion.category}</Badge>
                              </div>
                            </div>
                            <div className="criterion-metrics">
                              <div className="score-display">
                                <span className="score-value">{criterion.score}/10</span>
                                <span className="weight-value">({criterion.weight}%)</span>
                              </div>
                              <ProgressBar
                                now={criterion.score * 10}
                                variant={getScoreColor(criterion.score * 10)}
                                style={{ height: '6px' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light">
                  <h6 className="mb-0">Detailed Matrix</h6>
                </Card.Header>
                <Card.Body>
                  <Table responsive className="detailed-matrix-table">
                    <thead>
                      <tr>
                        <th>Criteria</th>
                        <th>Category</th>
                        <th>Weight</th>
                        <th>Score</th>
                        <th>Weighted Score</th>
                        <th>Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEvaluation.criteria.map((criterion, index) => (
                        <tr key={index}>
                          <td>{criterion.name}</td>
                          <td>
                            <Badge bg="secondary" size="sm">{criterion.category}</Badge>
                          </td>
                          <td>{criterion.weight}%</td>
                          <td>{criterion.score}/10</td>
                          <td>{(criterion.score * criterion.weight / 10).toFixed(1)}</td>
                          <td>
                            <div className="performance-indicator">
                              <ProgressBar
                                now={criterion.score * 10}
                                variant={getScoreColor(criterion.score * 10)}
                                style={{ height: '8px' }}
                              />
                              <span className="performance-text ms-2">
                                {criterion.score >= 8 ? 'Excellent' : 
                                 criterion.score >= 6 ? 'Good' : 
                                 criterion.score >= 4 ? 'Fair' : 'Poor'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMatrixModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <BiDownload className="me-2" />
            Export Matrix
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Evaluation Modal */}
      <FormDrawerModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onTestFill={
          showEditModal && editingEvaluation
            ? () =>
                setEditingEvaluation((prev) =>
                  prev ? { ...prev, ...dummyEvaluationMatrixPatch(prev) } : prev
                )
            : undefined
        }
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <BiEdit className="me-2" />
            Edit Evaluation - {editingEvaluation?.tenderTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingEvaluation && (
            <div className="edit-evaluation-form">
              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tender Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingEvaluation.tenderTitle}
                      onChange={(e) => handleEditInputChange('tenderTitle', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Organization</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingEvaluation.organization}
                      onChange={(e) => handleEditInputChange('organization', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Evaluator</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingEvaluation.evaluator}
                      onChange={(e) => handleEditInputChange('evaluator', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={editingEvaluation.status}
                      onChange={(e) => handleEditInputChange('status', e.target.value)}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Decision</Form.Label>
                    <Form.Select
                      value={editingEvaluation.decision}
                      onChange={(e) => handleEditInputChange('decision', e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="BID">BID</option>
                      <option value="NO_BID">NO BID</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Total Score</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={editingEvaluation.totalScore}
                      onChange={(e) => handleEditInputChange('totalScore', parseFloat(e.target.value) || 0)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light">
                  <h6 className="mb-0">Evaluation Criteria</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    {editingEvaluation.criteria.map((criterion, index) => (
                      <Col key={index} md={6}>
                        <Card className="criterion-edit-card">
                          <Card.Body>
                            <Row className="g-2">
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label>Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={criterion.name}
                                    onChange={(e) => handleCriteriaEdit(index, 'name', e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label>Category</Form.Label>
                                  <Form.Select
                                    value={criterion.category}
                                    onChange={(e) => handleCriteriaEdit(index, 'category', e.target.value)}
                                  >
                                    <option value="TECHNICAL">Technical</option>
                                    <option value="FINANCIAL">Financial</option>
                                    <option value="EXPERIENCE">Experience</option>
                                    <option value="CAPACITY">Capacity</option>
                                    <option value="COMPLIANCE">Compliance</option>
                                    <option value="RISK">Risk</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group>
                                  <Form.Label>Weight (%)</Form.Label>
                                  <Form.Control
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={criterion.weight}
                                    onChange={(e) => handleCriteriaEdit(index, 'weight', parseFloat(e.target.value) || 0)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group>
                                  <Form.Label>Score</Form.Label>
                                  <Form.Control
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={criterion.score}
                                    onChange={(e) => handleCriteriaEdit(index, 'score', parseFloat(e.target.value) || 0)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group>
                                  <Form.Label>Weighted Score</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={((criterion.score * criterion.weight) / 10).toFixed(1)}
                                    readOnly
                                    className="bg-light"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              <Alert variant="info">
                <strong>Note:</strong> Changes will be saved immediately when you click "Save Changes".
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveEdit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <BiCheckCircle className="me-2" />
                Save Changes
              </>
            )}
          </Button>
        </Modal.Footer>
      </FormDrawerModal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <BiXCircle className="me-2" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <BiXCircle className="text-danger" style={{ fontSize: '3rem' }} />
            <h5 className="mt-3">Are you sure you want to delete this evaluation?</h5>
            <p className="text-muted">
              This action cannot be undone. The evaluation for <strong>{deletingEvaluation?.tenderTitle}</strong> 
              will be permanently removed from the system.
            </p>
            <div className="alert alert-warning">
              <strong>Warning:</strong> Deleting this evaluation will also remove all associated criteria scores, 
              decision data, and evaluation history.
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Deleting...
              </>
            ) : (
              <>
                <BiTrash className="me-2" />
                Delete Permanently
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EvaluationMatrix;
