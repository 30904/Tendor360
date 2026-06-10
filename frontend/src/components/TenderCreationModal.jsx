import React, { useState } from 'react';
import { Modal, Button, Row, Col, Form, ProgressBar } from 'react-bootstrap';
import FormDrawerModal from './FormDrawerModal';
import { dummyTenderCreationModalForm } from '../utils/testFormDummies';
import { BiSave, BiX } from 'react-icons/bi';
// Modal styles are now centralized in /styles/components.scss

const TenderCreationModal = ({ show, onHide, document, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'active',
    organization: '',
    location: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState('basic');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Tender title is required.';
    if (!formData.organization?.trim()) newErrors.organization = 'Organization is required.';
    if (!formData.location?.trim()) newErrors.location = 'Location is required.';
    if (!formData.description?.trim()) newErrors.description = 'Description is required.';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onCreate(formData);
  };

  const handleClose = () => {
    setErrors({});
    setFormData({
      title: '',
      status: 'active',
      organization: '',
      location: '',
      description: ''
    });
    onHide();
  };

  const handleReset = () => {
    setFormData({
      title: '',
      status: 'active',
      organization: '',
      location: '',
      description: ''
    });
    setErrors({});
  };

  // Calculate form completion percentage
  const requiredFields = ['title', 'organization', 'location', 'description'];
  const completedFields = requiredFields.filter(field => formData[field]?.trim()).length;
  const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: '📋', required: true },
    { id: 'financial', label: 'Financial', icon: '💰', required: true },
    { id: 'classification', label: 'Classification', icon: '🏷️', required: true },
    { id: 'timeline', label: 'Timeline', icon: '📅', required: true },
    { id: 'requirements', label: 'Requirements', icon: '📄', required: true },
    { id: 'ai-pipeline', label: 'AI & Pipeline', icon: '🤖', required: true }
  ];

  return (
    <FormDrawerModal
      show={show}
      onHide={handleClose}
      className="tender-creation-modal"
      onTestFill={show ? () => setFormData(dummyTenderCreationModalForm()) : undefined}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span role="img" aria-label="rocket" className="me-2">🚀</span>
          Create New Tender
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Form Completion Section */}
        <div className="form-completion mb-4">
          <div className="completion-header">
            <span className="completion-text">Form Completion</span>
            <span className="completion-percentage">{completionPercentage}%</span>
          </div>
          <ProgressBar now={completionPercentage} className="mb-2" />
          <small className="text-muted">0 validation errors remaining</small>
        </div>

        {/* Step Navigation */}
        <div className="step-navigation mb-4">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`step-item ${activeStep === step.id ? 'active' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <div className={`step-icon ${activeStep === step.id ? 'active' : ''}`}>
                {step.icon}
              </div>
              <div className={`step-label ${activeStep === step.id ? 'active' : ''}`}>
                {step.label}
              </div>
              {step.required && <span className="required-indicator">*</span>}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Form onSubmit={handleSubmit}>
          {activeStep === 'basic' && (
            <div className="tab-content">
              <Row className="g-3">
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tender Title *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter a descriptive tender title"
                      isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="closed">Closed</option>
                      <option value="awarded">Awarded</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Organization *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      placeholder="Enter organization name"
                      isInvalid={!!errors.organization}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.organization}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter location/city/country"
                      isInvalid={!!errors.location}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.location}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Provide a detailed description of the tender opportunity"
                      isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}

          {activeStep === 'financial' && (
            <div className="tab-content">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estimated Value *</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter estimated value"
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Currency</Form.Label>
                    <Form.Select>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Budget Range</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., $100K - $500K"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}

          {activeStep === 'classification' && (
            <div className="tab-content">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tender Type *</Form.Label>
                    <Form.Select>
                      <option value="">Select tender type</option>
                      <option value="procurement">Procurement</option>
                      <option value="consulting">Consulting</option>
                      <option value="construction">Construction</option>
                      <option value="services">Services</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Therapeutic Area *</Form.Label>
                    <Form.Select>
                      <option value="">Select therapeutic area</option>
                      <option value="oncology">Oncology</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="neurology">Neurology</option>
                      <option value="general">General</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter tags separated by commas"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}

          {activeStep === 'timeline' && (
            <div className="tab-content">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Deadline *</Form.Label>
                    <Form.Control
                      type="datetime-local"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Submission Deadline</Form.Label>
                    <Form.Control
                      type="datetime-local"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Evaluation Period</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., 30 days"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Award Date</Form.Label>
                    <Form.Control
                      type="date"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}

          {activeStep === 'requirements' && (
            <div className="tab-content">
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Technical Requirements</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="List technical requirements and specifications"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Financial Requirements</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="List financial requirements and criteria"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Legal Requirements</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="List legal and compliance requirements"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}

          {activeStep === 'ai-pipeline' && (
            <div className="tab-content">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pipeline Stage</Form.Label>
                    <Form.Select>
                      <option value="identified">Identified</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="awarded">Awarded</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Win Probability (%)</Form.Label>
                    <Form.Control
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>AI Match Score</Form.Label>
                    <Form.Control
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="75"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <div>
            <Button variant="secondary" onClick={handleClose}>
              <BiX className="me-2" />
              Cancel
            </Button>
            <Button variant="outline-primary" onClick={handleReset} className="ms-2">
              Reset Form
            </Button>
          </div>
          
          <div className="d-flex gap-2">
            {activeStep !== 'basic' && (
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  const currentIndex = steps.findIndex(step => step.id === activeStep);
                  if (currentIndex > 0) {
                    setActiveStep(steps[currentIndex - 1].id);
                  }
                }}
              >
                Previous
              </Button>
            )}
            
            {activeStep !== 'ai-pipeline' ? (
              <Button 
                variant="primary" 
                onClick={() => {
                  const currentIndex = steps.findIndex(step => step.id === activeStep);
                  if (currentIndex < steps.length - 1) {
                    setActiveStep(steps[currentIndex + 1].id);
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit}>
                <BiSave className="me-2" />
                Create Tender
              </Button>
            )}
          </div>
        </div>
      </Modal.Footer>
    </FormDrawerModal>
  );
};

export default TenderCreationModal;
