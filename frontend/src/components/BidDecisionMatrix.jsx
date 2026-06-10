import React, { useState, useEffect } from 'react'
import {
  Row, Col, Card, Button, Form, Alert, ProgressBar, ListGroup,
  Toast, ToastContainer
} from 'react-bootstrap'
import {
  BiCheck, BiX, BiSave, BiErrorCircle, BiTrendingUp, BiShield
} from 'react-icons/bi'

const BidDecisionMatrix = ({ decision, criteria, onSave, onCancel }) => {
  // Local state
  const [formData, setFormData] = useState({
    tenderId: '',
    tenderTitle: '',
    criteria: {},
    riskLevel: 'MEDIUM',
    riskFactors: [],
    rationale: '',
    deadline: ''
  })
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  // Risk levels
  const riskLevels = [
    { key: 'LOW', label: 'Low Risk', color: 'success' },
    { key: 'MEDIUM', label: 'Medium Risk', color: 'warning' },
    { key: 'HIGH', label: 'High Risk', color: 'danger' }
  ]

  // Risk factors
  const riskFactorOptions = [
    'Tight timeline',
    'High competition',
    'Regulatory complexity',
    'Resource constraints',
    'Technical complexity',
    'Budget constraints',
    'Client relationship issues',
    'Market volatility'
  ]

  useEffect(() => {
    if (decision) {
      setFormData(decision)
    } else {
      // Initialize criteria scores
      const initialCriteria = {}
      criteria.forEach(criterion => {
        initialCriteria[criterion.key] = 5 // Default score of 5
      })
      setFormData(prev => ({
        ...prev,
        criteria: initialCriteria
      }))
    }
  }, [decision, criteria])

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

  const handleCriteriaChange = (criterionKey, value) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [criterionKey]: parseInt(value)
      }
    }))
  }

  const handleRiskFactorToggle = (factor) => {
    setFormData(prev => ({
      ...prev,
      riskFactors: prev.riskFactors.includes(factor)
        ? prev.riskFactors.filter(f => f !== factor)
        : [...prev.riskFactors, factor]
    }))
  }

  const calculateScore = () => {
    let totalScore = 0
    let totalWeight = 0
    
    criteria.forEach(criterion => {
      const score = formData.criteria[criterion.key] || 0
      totalScore += (score * criterion.weight)
      totalWeight += criterion.weight
    })
    
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  const getRecommendation = (score) => {
    if (score >= 80) return { decision: 'BID', color: 'success', text: 'Strong recommendation to bid' }
    if (score >= 60) return { decision: 'BID', color: 'warning', text: 'Moderate recommendation to bid' }
    if (score >= 40) return { decision: 'NO_BID', color: 'warning', text: 'Consider not bidding' }
    return { decision: 'NO_BID', color: 'danger', text: 'Strong recommendation not to bid' }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const score = calculateScore()
      const recommendation = getRecommendation(score)
      
      const decisionData = {
        ...formData,
        score,
        decision: recommendation.decision,
        recommendation: recommendation.text
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(decisionData)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      showToast('Error', 'Failed to save decision', 'danger')
    }
  }

  const score = calculateScore()
  const recommendation = getRecommendation(score)

  return (
    <div>
      <Row className="g-4">
        {/* Basic Information */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Basic Information</h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Tender ID</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.tenderId}
                  onChange={(e) => handleInputChange('tenderId', e.target.value)}
                  placeholder="Enter tender ID"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Tender Title</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.tenderTitle}
                  onChange={(e) => handleInputChange('tenderTitle', e.target.value)}
                  placeholder="Enter tender title"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Decision Deadline</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Score Summary */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Decision Summary</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <h2 className={`text-${getScoreColor(score)}`}>{score}%</h2>
                <p className="text-muted">Overall Score</p>
                <ProgressBar
                  now={score}
                  variant={getScoreColor(score)}
                  style={{ height: '20px' }}
                />
              </div>
              
              <Alert variant={recommendation.color}>
                <strong>Recommendation:</strong> {recommendation.text}
              </Alert>
              
              <div className="d-flex gap-2">
                <Button
                  variant={recommendation.decision === 'BID' ? 'success' : 'outline-success'}
                  size="sm"
                  className="flex-fill"
                >
                  <BiCheck className="me-1" />
                  BID
                </Button>
                <Button
                  variant={recommendation.decision === 'NO_BID' ? 'danger' : 'outline-danger'}
                  size="sm"
                  className="flex-fill"
                >
                  <BiX className="me-1" />
                  NO BID
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Evaluation Criteria */}
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Evaluation Criteria</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                {criteria.map((criterion) => (
                  <Col md={6} key={criterion.key} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span><strong>{criterion.label}</strong></span>
                      <Badge bg="info">{criterion.weight}%</Badge>
                    </div>
                    <Form.Range
                      min="1"
                      max="10"
                      value={formData.criteria[criterion.key] || 5}
                      onChange={(e) => handleCriteriaChange(criterion.key, e.target.value)}
                      className="mb-2"
                    />
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">Poor (1)</small>
                      <span className="fw-bold">{formData.criteria[criterion.key] || 5}/10</span>
                      <small className="text-muted">Excellent (10)</small>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Risk Assessment */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Risk Assessment</h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Risk Level</Form.Label>
                <div className="d-flex gap-2">
                  {riskLevels.map(level => (
                    <Button
                      key={level.key}
                      variant={formData.riskLevel === level.key ? level.color : `outline-${level.color}`}
                      size="sm"
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
                        onChange={() => handleRiskFactorToggle(factor)}
                      />
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Rationale */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Decision Rationale</h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Rationale</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  value={formData.rationale}
                  onChange={(e) => handleInputChange('rationale', e.target.value)}
                  placeholder="Provide detailed rationale for the decision..."
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          <BiSave className="me-1" />
          {loading ? 'Saving...' : 'Save Decision'}
        </Button>
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

export default BidDecisionMatrix
