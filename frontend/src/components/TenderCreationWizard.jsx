import React, { useState, useEffect } from 'react'
import {
  Row, Col, Card, Button, Form, Alert, ProgressBar, Tab, Nav,
  ListGroup, Badge, Toast, ToastContainer
} from 'react-bootstrap'
import {
  BiCheck, BiX, BiChevronRight, BiChevronLeft, BiFile, BiUser,
  BiCalendar, BiDollar, BiTrendingUp, BiShield, BiUpload
} from 'react-icons/bi'

const TenderCreationWizard = ({ tender, onSave, onCancel }) => {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: '',
    description: '',
    reference: '',
    source: '',
    estimatedValue: '',
    currency: 'USD',
    deadline: '',
    owner: '',
    
    // Step 2: Requirements & Competitors
    requirements: [],
    competitors: [],
    capturePlan: '',
    
    // Step 3: Probability & Risk
    probability: 50,
    riskLevel: 'MEDIUM',
    riskFactors: [],
    
    // Step 4: Attachments
    attachments: [],
    
    // Step 5: Review
    status: 'OPPORTUNITY'
  })

  // Wizard steps
  const steps = [
    { number: 1, title: 'Basic Information', icon: BiFile },
    { number: 2, title: 'Requirements & Competitors', icon: BiShield },
    { number: 3, title: 'Probability & Risk', icon: BiTrendingUp },
    { number: 4, title: 'Attachments', icon: BiUpload },
    { number: 5, title: 'Review & Submit', icon: BiCheck }
  ]

  // Source options
  const sourceOptions = [
    'Government Portal',
    'Corporate RFP',
    'Healthcare Portal',
    'Construction Portal',
    'Direct Client',
    'Partner Referral',
    'Public Tender',
    'Other'
  ]

  // Risk levels
  const riskLevels = [
    { key: 'LOW', label: 'Low Risk', color: 'success' },
    { key: 'MEDIUM', label: 'Medium Risk', color: 'warning' },
    { key: 'HIGH', label: 'High Risk', color: 'danger' }
  ]

  // Risk factors
  const riskFactorOptions = [
    'Technical Complexity',
    'Budget Constraints',
    'Tight Timeline',
    'Regulatory Requirements',
    'Competition Level',
    'Client Relationship',
    'Resource Availability',
    'Market Conditions'
  ]

  useEffect(() => {
    if (tender) {
      setFormData(tender)
    } else {
      // Generate reference number for new tender
      const reference = `TND-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
      setFormData(prev => ({ ...prev, reference }))
    }
  }, [tender])

  const showToast = (title, message, variant = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, title, message, variant }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 5000)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }))
  }

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }))]
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.source && formData.deadline
      case 2:
        return formData.requirements.length > 0
      case 3:
        return formData.probability >= 0 && formData.probability <= 100
      case 4:
        return true // Attachments are optional
      case 5:
        return true // Review step
      default:
        return false
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(formData)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      showToast('Error', 'Failed to save tender', 'danger')
    }
  }

  const getProgressPercentage = () => {
    return (currentStep / steps.length) * 100
  }

  const renderStep1 = () => (
    <div>
      <h5 className="mb-4">Basic Information</h5>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tender Title *</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter tender title"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Reference Number</Form.Label>
            <Form.Control
              type="text"
              value={formData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              placeholder="Auto-generated"
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label>Description *</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the tender opportunity"
        />
      </Form.Group>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Source *</Form.Label>
            <Form.Select
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
            >
              <option value="">Select source</option>
              {sourceOptions.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Owner</Form.Label>
            <Form.Control
              type="text"
              value={formData.owner}
              onChange={(e) => handleInputChange('owner', e.target.value)}
              placeholder="Enter owner name"
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Estimated Value</Form.Label>
            <Form.Control
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
              placeholder="Enter estimated value"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Currency</Form.Label>
            <Form.Select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Deadline *</Form.Label>
            <Form.Control
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h5 className="mb-4">Requirements & Competitors</h5>
      
      <Form.Group className="mb-4">
        <Form.Label>Requirements *</Form.Label>
        <div className="d-flex mb-2">
          <Form.Control
            type="text"
            placeholder="Add requirement"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (e.target.value.trim()) {
                  handleArrayChange('requirements', e.target.value.trim())
                  e.target.value = ''
                }
              }
            }}
          />
          <Button
            variant="outline-primary"
            className="ms-2"
            onClick={(e) => {
              const input = e.target.previousElementSibling
              if (input.value.trim()) {
                handleArrayChange('requirements', input.value.trim())
                input.value = ''
              }
            }}
          >
            Add
          </Button>
        </div>
        <ListGroup>
          {formData.requirements.map((req, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {req}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleArrayRemove('requirements', index)}
              >
                <BiX />
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Form.Group>
      
      <Form.Group className="mb-4">
        <Form.Label>Competitors</Form.Label>
        <div className="d-flex mb-2">
          <Form.Control
            type="text"
            placeholder="Add competitor"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (e.target.value.trim()) {
                  handleArrayChange('competitors', e.target.value.trim())
                  e.target.value = ''
                }
              }
            }}
          />
          <Button
            variant="outline-primary"
            className="ms-2"
            onClick={(e) => {
              const input = e.target.previousElementSibling
              if (input.value.trim()) {
                handleArrayChange('competitors', input.value.trim())
                input.value = ''
              }
            }}
          >
            Add
          </Button>
        </div>
        <ListGroup>
          {formData.competitors.map((comp, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {comp}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleArrayRemove('competitors', index)}
              >
                <BiX />
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Capture Plan</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={formData.capturePlan}
          onChange={(e) => handleInputChange('capturePlan', e.target.value)}
          placeholder="Describe your capture strategy"
        />
      </Form.Group>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <h5 className="mb-4">Probability & Risk Assessment</h5>
      
      <Form.Group className="mb-4">
        <Form.Label>Win Probability: {formData.probability}%</Form.Label>
        <Form.Range
          min="0"
          max="100"
          value={formData.probability}
          onChange={(e) => handleInputChange('probability', parseInt(e.target.value))}
        />
        <div className="d-flex justify-content-between">
          <small className="text-muted">0%</small>
          <small className="text-muted">100%</small>
        </div>
      </Form.Group>
      
      <Form.Group className="mb-4">
        <Form.Label>Risk Level</Form.Label>
        <div className="d-flex gap-2">
          {riskLevels.map(level => (
            <Button
              key={level.key}
              variant={formData.riskLevel === level.key ? level.color : `outline-${level.color}`}
              onClick={() => handleInputChange('riskLevel', level.key)}
            >
              {level.label}
            </Button>
          ))}
        </div>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Risk Factors</Form.Label>
        <div className="row">
          {riskFactorOptions.map(factor => (
            <div key={factor} className="col-md-6 mb-2">
              <Form.Check
                type="checkbox"
                id={`risk-${factor}`}
                label={factor}
                checked={formData.riskFactors.includes(factor)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleArrayChange('riskFactors', factor)
                  } else {
                    handleArrayRemove('riskFactors', formData.riskFactors.indexOf(factor))
                  }
                }}
              />
            </div>
          ))}
        </div>
      </Form.Group>
    </div>
  )

  const renderStep4 = () => (
    <div>
      <h5 className="mb-4">Attachments</h5>
      
      <Form.Group className="mb-4">
        <Form.Label>Upload Files</Form.Label>
        <Form.Control
          type="file"
          multiple
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        />
        <Form.Text className="text-muted">
          Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
        </Form.Text>
      </Form.Group>
      
      {formData.attachments.length > 0 && (
        <div>
          <h6>Uploaded Files</h6>
          <ListGroup>
            {formData.attachments.map((file, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{file.name}</strong>
                  <br />
                  <small className="text-muted">{(file.size / 1024).toFixed(1)} KB</small>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleArrayRemove('attachments', index)}
                >
                  <BiX />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  )

  const renderStep5 = () => (
    <div>
      <h5 className="mb-4">Review & Submit</h5>
      
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Basic Information</h6>
            </Card.Header>
            <Card.Body>
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>Reference:</strong> {formData.reference}</p>
              <p><strong>Source:</strong> {formData.source}</p>
              <p><strong>Value:</strong> {formData.currency} {formData.estimatedValue}</p>
              <p><strong>Deadline:</strong> {formData.deadline}</p>
              <p><strong>Owner:</strong> {formData.owner}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Assessment</h6>
            </Card.Header>
            <Card.Body>
              <p><strong>Probability:</strong> {formData.probability}%</p>
              <p><strong>Risk Level:</strong> 
                <Badge bg={riskLevels.find(r => r.key === formData.riskLevel)?.color} className="ms-2">
                  {riskLevels.find(r => r.key === formData.riskLevel)?.label}
                </Badge>
              </p>
              <p><strong>Requirements:</strong> {formData.requirements.length}</p>
              <p><strong>Competitors:</strong> {formData.competitors.length}</p>
              <p><strong>Attachments:</strong> {formData.attachments.length}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="mt-4">
        <Alert variant="info">
          <strong>Ready to submit!</strong> Review all information above and click "Save Tender" to create this opportunity.
        </Alert>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      case 5: return renderStep5()
      default: return null
    }
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6>Step {currentStep} of {steps.length}</h6>
          <span className="text-muted">{Math.round(getProgressPercentage())}% Complete</span>
        </div>
        <ProgressBar now={getProgressPercentage()} />
      </div>

      {/* Step Navigation */}
      <div className="mb-4">
        <Nav variant="pills" className="justify-content-center">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <Nav.Item key={step.number}>
                <Nav.Link
                  active={currentStep === step.number}
                  disabled={currentStep < step.number}
                  className="d-flex align-items-center"
                >
                  <Icon className="me-1" />
                  {step.title}
                </Nav.Link>
              </Nav.Item>
            )
          })}
        </Nav>
      </div>

      {/* Step Content */}
      <div className="mb-4">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <BiChevronLeft className="me-1" />
          Previous
        </Button>
        
        <div>
          <Button
            variant="outline-secondary"
            onClick={onCancel}
            className="me-2"
          >
            Cancel
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
            >
              Next
              <BiChevronRight className="ms-1" />
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Tender'}
              <BiCheck className="ms-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            show={true}
            bg={toast.variant}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          >
            <Toast.Header>
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  )
}

export default TenderCreationWizard
