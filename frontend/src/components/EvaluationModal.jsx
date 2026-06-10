import React, { useState, useEffect } from 'react';
import {
  Modal, Form, Button, Row, Col, Card, Badge,
  Alert, ProgressBar, ListGroup, ButtonGroup
} from 'react-bootstrap';
import FormDrawerModal from './FormDrawerModal';
import { dummyEvaluationModalForm } from '../utils/testFormDummies';
import {
  BiPlus, BiTrash, BiEdit, BiSave, BiX, BiCheck,
  BiAward, BiStar, BiDollar, BiBuilding, BiChevronLeft, BiChevronRight
} from 'react-icons/bi';
// Modal styles are now centralized in /styles/components.scss

const EvaluationModal = ({ show, onHide, onSubmit, evaluation = null, tender = null }) => {
  const [formData, setFormData] = useState({
    evaluationName: '',
    evaluationType: 'COMPREHENSIVE',
    criteria: [],
    notes: '',
    priority: 'MEDIUM'
  });

  const [activeStep, setActiveStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [stepValidation, setStepValidation] = useState({
    1: true, // Step 1 should be valid by default since it has default values
    2: false,
    3: false,
    4: false
  });

  const evaluationTypes = [
    { value: 'PRELIMINARY', label: 'Preliminary', icon: BiAward },
    { value: 'TECHNICAL', label: 'Technical', icon: BiAward },
    { value: 'FINANCIAL', label: 'Financial', icon: BiDollar },
    { value: 'COMPREHENSIVE', label: 'Comprehensive', icon: BiStar }
  ];

  const priorityLevels = [
    { value: 'LOW', label: 'Low', color: 'secondary' },
    { value: 'MEDIUM', label: 'Medium', color: 'warning' },
    { value: 'HIGH', label: 'High', color: 'danger' },
    { value: 'URGENT', label: 'Urgent', color: 'dark' }
  ];

  const defaultCriteria = [
    { category: 'TECHNICAL', name: 'Technical Capability', weight: 25, score: 0, description: 'Technical expertise and capabilities' },
    { category: 'FINANCIAL', name: 'Financial Stability', weight: 20, score: 0, description: 'Financial health and stability' },
    { category: 'EXPERIENCE', name: 'Relevant Experience', weight: 20, score: 0, description: 'Past experience in similar projects' },
    { category: 'CAPACITY', name: 'Resource Capacity', weight: 15, score: 0, description: 'Available resources and capacity' },
    { category: 'COMPLIANCE', name: 'Regulatory Compliance', weight: 10, score: 0, description: 'Compliance with regulations' },
    { category: 'RISK', name: 'Risk Assessment', weight: 10, score: 0, description: 'Risk factors and mitigation' }
  ];

  useEffect(() => {
    if (evaluation) {
      setFormData({
        evaluationName: evaluation.evaluationName || '',
        evaluationType: evaluation.evaluationType || 'COMPREHENSIVE',
        criteria: evaluation.criteria || [],
        notes: evaluation.notes || '',
        priority: evaluation.priority || 'MEDIUM'
      });
    } else {
      setFormData({
        evaluationName: tender ? `Evaluation for ${tender.title}` : '',
        evaluationType: 'COMPREHENSIVE',
        criteria: [...defaultCriteria],
        notes: '',
        priority: 'MEDIUM'
      });
    }
    
    // Validate Step 1 after form data is set
    setTimeout(() => validateStep1(), 100);
  }, [evaluation, tender]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Real-time validation for Step 1
    if (activeStep === 1) {
      validateStep1();
    }
  };

  const handleCriteriaChange = (index, field, value) => {
    const newCriteria = [...formData.criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setFormData(prev => ({ ...prev, criteria: newCriteria }));
    
    // Real-time validation for Steps 2 and 3
    if (activeStep === 2) {
      validateStep(2);
    } else if (activeStep === 3) {
      validateStep(3);
    }
  };

  const addCriteria = () => {
    const newCriteria = {
      category: 'TECHNICAL',
      name: '',
      weight: 0,
      score: 0,
      description: '',
      isRequired: true
    };
    setFormData(prev => ({
      ...prev,
      criteria: [...prev.criteria, newCriteria]
    }));
    
    // Validate Step 2 after adding criteria
    setTimeout(() => validateStep(2), 100);
  };

  const removeCriteria = (index) => {
    const newCriteria = formData.criteria.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, criteria: newCriteria }));
  };

  const validateStep1 = () => {
    const isValid = formData.evaluationName.trim().length > 0;
    setStepValidation(prev => ({
      ...prev,
      1: isValid
    }));
    return isValid;
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1:
        if (!formData.evaluationName.trim()) {
          errors.evaluationName = 'Evaluation name is required';
        }
        break;
        
      case 2:
        if (formData.criteria.length === 0) {
          errors.criteria = 'At least one criterion is required';
        }
        
        // Check if at least one criterion has a name
        const hasValidCriteria = formData.criteria.some(criterion => criterion.name.trim());
        if (!hasValidCriteria) {
          errors.criteria = 'At least one criterion must have a name';
        }
        
        // Don't require exact 100% weight for Step 2 - just basic validation
        formData.criteria.forEach((criterion, index) => {
          if (criterion.name.trim() && (criterion.weight < 0 || criterion.weight > 100)) {
            errors[`criteria_${index}_weight`] = 'Weight must be between 0 and 100';
          }
        });
        break;
        
      case 3:
        // Only validate scores if criteria have names
        formData.criteria.forEach((criterion, index) => {
          if (criterion.name.trim() && (criterion.score < 0 || criterion.score > 10)) {
            errors[`criteria_${index}_score`] = 'Score must be between 0 and 10';
          }
        });
        break;
        
      default:
        break;
    }
    
    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    
    setStepValidation(prev => ({
      ...prev,
      [step]: isValid
    }));
    
    return isValid;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.evaluationName.trim()) {
      errors.evaluationName = 'Evaluation name is required';
    }

    if (formData.criteria.length === 0) {
      errors.criteria = 'At least one criterion is required';
    }

    formData.criteria.forEach((criterion, index) => {
      if (!criterion.name.trim()) {
        errors[`criteria_${index}_name`] = 'Criterion name is required';
      }
      if (criterion.weight < 0 || criterion.weight > 100) {
        errors[`criteria_${index}_weight`] = 'Weight must be between 0 and 100';
      }
      if (criterion.score < 0 || criterion.score > 10) {
        errors[`criteria_${index}_score`] = 'Score must be between 0 and 100';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const totalWeight = formData.criteria.reduce((sum, c) => sum + c.weight, 0);
      if (totalWeight !== 100) {
        alert('Total weight must equal 100%');
        return;
      }

      const submissionData = {
        ...formData,
        tenderId: tender?._id || evaluation?.tenderId,
        criteria: formData.criteria.map(c => ({
          ...c,
          maxScore: 10,
          scoringMethod: 'NUMERIC'
        }))
      };

      onSubmit(submissionData);
    }
  };

  const calculateTotalScore = () => {
    if (formData.criteria.length === 0) return 0;
    const totalWeight = formData.criteria.reduce((sum, c) => sum + c.weight, 0);
    if (totalWeight === 0) return 0;
    
    const weightedScore = formData.criteria.reduce((sum, c) => {
      return sum + (c.score * c.weight / totalWeight);
    }, 0);
    
    return Math.round(weightedScore * 10) / 10;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'success';
    if (score >= 6) return 'warning';
    return 'danger';
  };

  const getRecommendation = (score) => {
    if (score >= 8) return { text: 'Strong BID Recommendation', variant: 'success' };
    if (score >= 6) return { text: 'Consider BID with Improvements', variant: 'warning' };
    return { text: 'NO BID Recommendation', variant: 'danger' };
  };

  const totalScore = calculateTotalScore();
  const recommendation = getRecommendation(totalScore);

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

  const canProceedToStep = (step) => {
    if (step === 1) return true;
    if (step === 2) return stepValidation[1];
    if (step === 3) return stepValidation[1] && stepValidation[2];
    if (step === 4) return stepValidation[1] && stepValidation[2] && stepValidation[3];
    return false;
  };

  return (
    <FormDrawerModal
      show={show}
      onHide={onHide}
      className="evaluation-modal"
      onTestFill={
        show
          ? () => {
              setFormData(dummyEvaluationModalForm());
              setActiveStep(1);
            }
          : undefined
      }
    >
      <Modal.Header closeButton style={{
        background: 'var(--primary-color)',
        border: 'none',
        padding: '1.5rem'
      }}>
        <Modal.Title style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: '600',
          fontSize: '1.25rem'
        }}>
          <BiAward className="me-2" />
          {evaluation ? 'Edit Evaluation' : 'Create New Evaluation'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Progress Steps */}
        <div className="progress-steps p-3" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            {['Basic Info', 'Criteria Setup', 'Scoring', 'Review'].map((step, index) => (
              <div
                key={step}
                className={`step ${activeStep > index + 1 ? 'completed' : activeStep === index + 1 ? 'active' : ''} ${canProceedToStep(index + 1) ? 'clickable' : 'disabled'}`}
                onClick={() => canProceedToStep(index + 1) && setActiveStep(index + 1)}
              >
                <div className="step-number">
                  {activeStep > index + 1 ? <BiCheck /> : index + 1}
                </div>
                <div className="step-label">{step}</div>
                {stepValidation[index + 1] && (
                  <div className="step-status">
                    <BiCheck className="text-success" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <ProgressBar
            now={(activeStep / 4) * 100}
            className="mt-3"
            variant="primary"
            style={{ borderRadius: '0' }}
          />
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="p-4">
            {/* Step Progress Indicator */}
            <div className="step-indicator mb-4">
              <div className="d-flex align-items-center">
                <span className="step-counter me-3" style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  Step {activeStep} of 4
                </span>
                <div className="step-progress" style={{
                  flex: '1',
                  height: '6px',
                  background: 'var(--border-color)',
                  borderRadius: '0',
                  overflow: 'hidden'
                }}>
                  <div 
                    className="step-progress-bar" 
                    style={{ 
                      width: `${(activeStep / 4) * 100}%`,
                      height: '100%',
                      background: 'var(--primary-color)',
                      transition: 'width 0.3s ease',
                      borderRadius: '0'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Step 1: Basic Info */}
            {activeStep === 1 && (
              <div className="step-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0" style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>Basic Information</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      borderRadius: '0'
                    }}
                  >
                    <BiStar className="me-1" />
                    Use Template
                  </Button>
                </div>
                
                {showTemplateSelector && (
                  <Alert variant="info" className="mb-3">
                    <strong>Template Selection:</strong> Choose from predefined evaluation templates to speed up your setup.
                  </Alert>
                )}
                
                <Row className="g-3">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}>Evaluation Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.evaluationName}
                        onChange={(e) => handleInputChange('evaluationName', e.target.value)}
                        isInvalid={!!validationErrors.evaluationName}
                        placeholder="Enter evaluation name"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          borderRadius: '0',
                          border: '2px solid var(--border-color)'
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.evaluationName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}>Evaluation Type</Form.Label>
                      <Form.Select
                        value={formData.evaluationType}
                        onChange={(e) => handleInputChange('evaluationType', e.target.value)}
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          borderRadius: '0',
                          border: '2px solid var(--border-color)'
                        }}
                      >
                        {evaluationTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}>Priority Level</Form.Label>
                      <div className="priority-buttons">
                        {priorityLevels.map(level => (
                          <Button
                            key={level.value}
                            variant={formData.priority === level.value ? level.color : 'outline-' + level.color}
                            size="sm"
                            onClick={() => handleInputChange('priority', level.value)}
                            className="me-2"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              borderRadius: '0'
                            }}
                          >
                            {level.label}
                          </Button>
                        ))}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}>Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Additional notes..."
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          borderRadius: '0',
                          border: '2px solid var(--border-color)'
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            {/* Step 2: Criteria Setup */}
            {activeStep === 2 && (
              <div className="step-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Evaluation Criteria</h5>
                  <Button variant="outline-primary" onClick={addCriteria}>
                    <BiPlus className="me-1" />
                    Add Criterion
                  </Button>
                </div>

                {formData.criteria.map((criterion, index) => (
                  <Card key={index} className="mb-3 criterion-card">
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                              value={criterion.category}
                              onChange={(e) => handleCriteriaChange(index, 'category', e.target.value)}
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
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={criterion.name}
                              onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                              isInvalid={!!validationErrors[`criteria_${index}_name`]}
                              placeholder="Criterion name"
                            />
                            <Form.Control.Feedback type="invalid">
                              {validationErrors[`criteria_${index}_name`]}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>Weight (%)</Form.Label>
                            <Form.Control
                              type="number"
                              value={criterion.weight}
                              onChange={(e) => handleCriteriaChange(index, 'weight', parseFloat(e.target.value) || 0)}
                              isInvalid={!!validationErrors[`criteria_${index}_weight`]}
                              min="0"
                              max="100"
                            />
                            <Form.Control.Feedback type="invalid">
                              {validationErrors[`criteria_${index}_weight`]}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>Score</Form.Label>
                            <Form.Control
                              type="number"
                              value={criterion.score}
                              onChange={(e) => handleCriteriaChange(index, 'score', parseFloat(e.target.value) || 0)}
                              isInvalid={!!validationErrors[`criteria_${index}_score`]}
                              min="0"
                              max="10"
                              step="0.5"
                            />
                            <Form.Control.Feedback type="invalid">
                              {validationErrors[`criteria_${index}_score`]}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={1}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeCriteria(index)}
                            className="mt-4"
                          >
                            <BiTrash />
                          </Button>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={criterion.description}
                            onChange={(e) => handleCriteriaChange(index, 'description', e.target.value)}
                            placeholder="Description (optional)"
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}

                {validationErrors.criteria && (
                  <Alert variant="danger">{validationErrors.criteria}</Alert>
                )}

                <div className="weight-summary mt-3">
                  <strong>Total Weight: {formData.criteria.reduce((sum, c) => sum + c.weight, 0)}%</strong>
                  {formData.criteria.reduce((sum, c) => sum + c.weight, 0) !== 100 && (
                    <Alert variant="warning" className="mt-2">
                      Total weight must equal 100%
                    </Alert>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Scoring */}
            {activeStep === 3 && (
              <div className="step-content">
                <h5 className="mb-4">Scoring & Analysis</h5>
                
                <Row className="g-4">
                  <Col md={8}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0">Criteria Scoring</h6>
                      </Card.Header>
                      <Card.Body>
                        <ListGroup variant="flush">
                          {formData.criteria.map((criterion, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="fw-semibold">{criterion.name}</div>
                                <div className="text-muted small">{criterion.category}</div>
                              </div>
                              <div className="text-end">
                                <div className="fw-bold text-primary">{criterion.score}/10</div>
                                <div className="text-muted small">Weight: {criterion.weight}%</div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={4}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0">Score Summary</h6>
                      </Card.Header>
                      <Card.Body className="text-center">
                        <div className="total-score mb-3">
                          <div className="score-number">{totalScore}</div>
                          <div className="score-label">Total Score</div>
                        </div>
                        
                        <Alert variant={recommendation.variant}>
                          <strong>{recommendation.text}</strong>
                        </Alert>
                        
                        <div className="score-breakdown">
                          <div className="score-item">
                            <span className="score-label">Technical:</span>
                            <span className="score-value">
                              {formData.criteria.filter(c => c.category === 'TECHNICAL').reduce((sum, c) => sum + c.score, 0).toFixed(1)}
                            </span>
                          </div>
                          <div className="score-item">
                            <span className="score-label">Financial:</span>
                            <span className="score-value">
                              {formData.criteria.filter(c => c.category === 'FINANCIAL').reduce((sum, c) => sum + c.score, 0).toFixed(1)}
                            </span>
                          </div>
                          <div className="score-item">
                            <span className="score-label">Experience:</span>
                            <span className="score-value">
                              {formData.criteria.filter(c => c.category === 'EXPERIENCE').reduce((sum, c) => sum + c.score, 0).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {/* Step 4: Review */}
            {activeStep === 4 && (
              <div className="step-content">
                <h5 className="mb-4">Review & Submit</h5>
                
                <Row className="g-4">
                  <Col md={6}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0">Evaluation Details</h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="review-item">
                          <strong>Name:</strong> {formData.evaluationName}
                        </div>
                        <div className="review-item">
                          <strong>Type:</strong> {formData.evaluationType}
                        </div>
                        <div className="review-item">
                          <strong>Priority:</strong> 
                          <Badge bg={priorityLevels.find(p => p.value === formData.priority)?.color} className="ms-2">
                            {formData.priority}
                          </Badge>
                        </div>
                        <div className="review-item">
                          <strong>Total Score:</strong> 
                          <span className={`ms-2 fw-bold text-${getScoreColor(totalScore)}`}>
                            {totalScore}/10
                          </span>
                        </div>
                        {formData.notes && (
                          <div className="review-item">
                            <strong>Notes:</strong> {formData.notes}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0">Final Recommendation</h6>
                      </Card.Header>
                      <Card.Body className="text-center">
                        <div className={`recommendation-badge ${recommendation.variant}`}>
                          <h4 className="mb-2">{recommendation.text}</h4>
                          <div className="score-display">
                            <div className="score-circle">
                              {totalScore}
                            </div>
                            <div className="score-text">out of 10</div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <div>
            {activeStep > 1 && (
              <Button 
                variant="outline-secondary" 
                onClick={handlePreviousStep}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '0'
                }}
              >
                <BiChevronLeft className="me-2" />
                Previous
              </Button>
            )}
          </div>
          
          <div className="d-flex gap-2">
            {activeStep < 4 ? (
              <Button 
                variant="primary" 
                onClick={handleNextStep}
                disabled={!stepValidation[activeStep]}
                title={`Step ${activeStep} validation: ${stepValidation[activeStep] ? 'Valid' : 'Invalid'}`}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '0',
                  background: 'var(--primary-color)',
                  border: '1px solid var(--primary-color)'
                }}
              >
                Next
                <BiChevronRight className="ms-2" />
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={handleSubmit}
                disabled={!stepValidation[1] || !stepValidation[2] || !stepValidation[3]}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '0'
                }}
              >
                <BiSave className="me-2" />
                {evaluation ? 'Update Evaluation' : 'Create Evaluation'}
              </Button>
            )}
            
            <Button 
              variant="outline-secondary" 
              onClick={onHide}
              style={{
                fontFamily: 'Inter, sans-serif',
                borderRadius: '0'
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </FormDrawerModal>
  );
};

export default EvaluationModal;
