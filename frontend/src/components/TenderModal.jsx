import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col, Badge, Alert, ProgressBar } from 'react-bootstrap'
import FormDrawerModal from './FormDrawerModal'
import { dummyTenderModalForm } from '../utils/testFormDummies'
import { BiX, BiSave, BiPlus, BiCheckCircle, BiErrorCircle, BiInfoCircle, BiEdit, BiLock } from 'react-icons/bi'
import { useSelector, useDispatch } from 'react-redux'
import { createTender, updateTender } from '../store/slices/tenderSlice'
// Modal styles are now centralized in /styles/components.scss

const TenderModal = ({ show, onHide, tender = null, mode = 'create' }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.tender)
  const { user } = useSelector(state => state.auth)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    location: '',
    description: '',
    estimatedValue: '',
    currency: 'USD',
    deadline: '',
    tenderType: '',
    therapeuticArea: '',
    aiMatchScore: 0,
    status: 'active',
    tags: [],
    source: '',
    requirements: {
      technical: [],
      financial: [],
      legal: []
    },
    pipelineStage: 'identified',
    priority: 'medium',
    winProbability: 50
  })

  // UI state
  const [activeTab, setActiveTab] = useState('basic')
  const [newTag, setNewTag] = useState('')
  const [newRequirement, setNewRequirement] = useState({ type: 'technical', content: '' })
  const [validationErrors, setValidationErrors] = useState({})
  const [formProgress, setFormProgress] = useState(0)
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusChangeReason, setStatusChangeReason] = useState('')

  // Status configuration with editing restrictions
  const tenderStatuses = {
    'draft': {
      label: 'Draft',
      color: 'secondary',
      editable: true,
      canChangeTo: ['active', 'cancelled'],
      description: 'Tender is in draft mode and can be fully edited'
    },
    'active': {
      label: 'Active',
      color: 'success',
      editable: true,
      canChangeTo: ['overdue', 'closed', 'cancelled'],
      description: 'Tender is active and accepting submissions'
    },
    'overdue': {
      label: 'Overdue',
      color: 'warning',
      editable: false,
      canChangeTo: ['closed', 'cancelled'],
      description: 'Tender deadline has passed, limited editing allowed'
    },
    'closed': {
      label: 'Closed',
      color: 'info',
      editable: false,
      canChangeTo: ['evaluating', 'cancelled'],
      description: 'Tender is closed for submissions, no editing allowed'
    },
    'evaluating': {
      label: 'Evaluating',
      color: 'primary',
      editable: false,
      canChangeTo: ['awarded', 'cancelled'],
      description: 'Tender is under evaluation, no editing allowed'
    },
    'awarded': {
      label: 'Awarded',
      color: 'success',
      editable: false,
      canChangeTo: ['cancelled'],
      description: 'Tender has been awarded, no editing allowed'
    },
    'cancelled': {
      label: 'Cancelled',
      color: 'danger',
      editable: false,
      canChangeTo: [],
      description: 'Tender has been cancelled, no editing allowed'
    }
  }

  // Pipeline stages with editing restrictions
  const pipelineStages = {
    'identified': {
      label: 'Identified',
      color: 'secondary',
      editable: true,
      description: 'Tender opportunity identified'
    },
    'evaluating': {
      label: 'Evaluating',
      color: 'info',
      editable: true,
      description: 'Under evaluation for pursuit'
    },
    'pursuing': {
      label: 'Pursuing',
      color: 'primary',
      editable: true,
      description: 'Actively pursuing the tender'
    },
    'submitted': {
      label: 'Submitted',
      color: 'warning',
      editable: false,
      description: 'Proposal submitted, limited editing'
    },
    'awarded': {
      label: 'Awarded',
      color: 'success',
      editable: false,
      description: 'Tender won, no editing allowed'
    },
    'lost': {
      label: 'Lost',
      color: 'danger',
      editable: false,
      description: 'Tender lost, no editing allowed'
    }
  }

  // Tab configuration
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📋', required: true },
    { id: 'financial', label: 'Financial', icon: '💰', required: true },
    { id: 'classification', label: 'Classification', icon: '🏷️', required: true },
    { id: 'timeline', label: 'Timeline', icon: '📅', required: true },
    { id: 'requirements', label: 'Requirements', icon: '📋', required: false },
    { id: 'ai-pipeline', label: 'AI & Pipeline', icon: '🤖', required: false }
  ]

  // Check if tender can be edited based on status
  const canEditTender = () => {
    if (mode === 'create') return true
    
    const currentStatus = formData.status
    const currentPipelineStage = formData.pipelineStage
    
    return tenderStatuses[currentStatus]?.editable && 
           pipelineStages[currentPipelineStage]?.editable
  }

  // Check if specific field can be edited
  const canEditField = (fieldName) => {
    if (mode === 'create') return true
    
    const currentStatus = formData.status
    const currentPipelineStage = formData.pipelineStage
    
    // Always editable fields
    const alwaysEditable = ['aiMatchScore', 'priority', 'winProbability', 'tags', 'notes']
    if (alwaysEditable.includes(fieldName)) return true
    
    // Status-dependent restrictions
    if (currentStatus === 'overdue' && ['title', 'description', 'requirements'].includes(fieldName)) {
      return false
    }
    
    if (['closed', 'evaluating', 'awarded', 'lost'].includes(currentStatus)) {
      return false
    }
    
    if (currentPipelineStage === 'submitted' && ['title', 'description', 'requirements'].includes(fieldName)) {
      return false
    }
    
    return true
  }

  // Initialize form data when editing
  useEffect(() => {
    if (tender && mode === 'edit') {
      setFormData({
        title: tender.title || '',
        organization: tender.organization || '',
        location: tender.location || '',
        description: tender.description || '',
        estimatedValue: tender.estimatedValue ? (tender.estimatedValue / 1000000).toString() : '',
        currency: tender.currency || 'USD',
        deadline: tender.deadline ? new Date(tender.deadline).toISOString().split('T')[0] : '',
        tenderType: tender.tenderType || '',
        therapeuticArea: tender.therapeuticArea || '',
        aiMatchScore: tender.aiMatchScore || 0,
        status: tender.status || 'active',
        tags: tender.tags || [],
        source: tender.source || '',
        requirements: tender.requirements || { technical: [], financial: [], legal: [] },
        pipelineStage: tender.pipelineStage || 'identified',
        priority: tender.priority || 'medium',
        winProbability: tender.winProbability || 50
      })
    }
  }, [tender, mode])

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ['title', 'organization', 'location', 'description', 'estimatedValue', 'deadline', 'tenderType', 'therapeuticArea', 'source']
    const filledFields = requiredFields.filter(field => {
      const value = formData[field]
      return value && value.toString().trim() !== ''
    })
    const progress = Math.round((filledFields.length / requiredFields.length) * 100)
    setFormProgress(progress)
  }, [formData])

  // Form validation
  const validateForm = () => {
    const errors = {}
    
    if (!formData.title?.trim()) errors.title = 'Tender title is required'
    if (!formData.organization?.trim()) errors.organization = 'Organization is required'
    if (!formData.location?.trim()) errors.location = 'Location is required'
    if (!formData.description?.trim()) errors.description = 'Description is required'
    if (!formData.estimatedValue || parseFloat(formData.estimatedValue) <= 0) errors.estimatedValue = 'Valid estimated value is required'
    if (!formData.deadline) errors.deadline = 'Deadline is required'
    if (!formData.tenderType) errors.tenderType = 'Tender type is required'
    if (!formData.therapeuticArea) errors.therapeuticArea = 'Therapeutic area is required'
    if (!formData.source?.trim()) errors.source = 'Source is required'
    
    // Validate deadline is not in the past
    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      errors.deadline = 'Deadline cannot be in the past'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Field validation
  const validateField = (fieldName, value) => {
    const errors = { ...validationErrors }
    
    switch (fieldName) {
      case 'title':
        if (!value?.trim()) errors.title = 'Tender title is required'
        else if (value.length > 200) errors.title = 'Title cannot exceed 200 characters'
        else delete errors.title
        break
      case 'description':
        if (!value?.trim()) errors.description = 'Description is required'
        else if (value.length > 2000) errors.description = 'Description cannot exceed 2000 characters'
        else delete errors.description
        break
      case 'estimatedValue':
        if (!value || parseFloat(value) <= 0) errors.estimatedValue = 'Valid estimated value is required'
        else delete errors.estimatedValue
        break
      case 'deadline':
        if (!value) errors.deadline = 'Deadline is required'
        else if (new Date(value) < new Date()) errors.deadline = 'Deadline cannot be in the past'
        else delete errors.deadline
        break
      default:
        if (!value?.trim()) errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
        else delete errors[fieldName]
    }
    
    setValidationErrors(errors)
  }

  const handleInputChange = (field, value) => {
    // Check if field can be edited
    if (!canEditField(field)) {
      return
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Validate field on change
    validateField(field, value)
  }

  const handleRequirementChange = (type, value) => {
    if (!canEditField('requirements')) {
      return
    }
    
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [type]: value
      }
    }))
  }

  const addTag = () => {
    if (!canEditField('tags')) {
      return
    }
    
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    if (!canEditField('tags')) {
      return
    }
    
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addRequirement = () => {
    if (!canEditField('requirements')) {
      return
    }
    
    if (newRequirement.content.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          [newRequirement.type]: [...prev.requirements[newRequirement.type], newRequirement.content.trim()]
        }
      }))
      setNewRequirement({ type: 'technical', content: '' })
    }
  }

  const removeRequirement = (type, requirementToRemove) => {
    if (!canEditField('requirements')) {
      return
    }
    
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [type]: prev.requirements[type].filter(req => req !== requirementToRemove)
      }
    }))
  }

  const handleStatusChange = () => {
    if (newStatus && statusChangeReason) {
      setFormData(prev => ({
        ...prev,
        status: newStatus
      }))
      setShowStatusChangeModal(false)
      setNewStatus('')
      setStatusChangeReason('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Show first tab with errors
      const firstErrorTab = tabs.find(tab => {
        if (tab.required) {
          const hasErrors = Object.keys(validationErrors).some(field => {
            return ['title', 'organization', 'location', 'description', 'estimatedValue', 'deadline', 'tenderType', 'therapeuticArea', 'source'].includes(field)
          })
          return hasErrors
        }
        return false
      })
      if (firstErrorTab) setActiveTab(firstErrorTab.id)
      return
    }
    
    const tenderData = {
      ...formData,
      estimatedValue: parseFloat(formData.estimatedValue) * 1000000, // Convert M to actual value
      aiMatchScore: parseInt(formData.aiMatchScore),
      winProbability: parseInt(formData.winProbability)
    }

    try {
      if (mode === 'create') {
        await dispatch(createTender(tenderData)).unwrap()
      } else {
        await dispatch(updateTender({ id: tender._id, tenderData })).unwrap()
      }
      onHide()
      resetForm()
    } catch (error) {
      // console.error('Failed to save tender:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      organization: '',
      location: '',
      description: '',
      estimatedValue: '',
      currency: 'USD',
      deadline: '',
      tenderType: '',
      therapeuticArea: '',
      aiMatchScore: 0,
      status: 'active',
      tags: [],
      source: '',
      requirements: { technical: [], financial: [], legal: [] },
      pipelineStage: 'identified',
      priority: 'medium',
      winProbability: 50
    })
    setValidationErrors({})
    setActiveTab('basic')
  }

  const getFieldError = (fieldName) => validationErrors[fieldName]

  const renderField = (fieldName, label, type = 'text', options = null, placeholder = '', required = true) => {
    const isEditable = canEditField(fieldName)
    
    return (
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold d-flex align-items-center">
          {label} {required && <span className="text-danger">*</span>}
          {!isEditable && (
            <Badge bg="warning" className="ms-2">
              <BiLock className="me-1" />
              Read Only
            </Badge>
          )}
        </Form.Label>
        {type === 'select' ? (
                     <Form.Select
             value={formData[fieldName]}
             onChange={(e) => handleInputChange(fieldName, e.target.value)}
             isInvalid={!!getFieldError(fieldName)}
             className={getFieldError(fieldName) ? 'border-danger' : ''}
             disabled={!isEditable}
             style={{
               border: '2px solid #e9ecef',
               borderRadius: '0',
               padding: '0.75rem 1rem',
               fontSize: '0.95rem',
               transition: 'all 0.2s ease',
               opacity: isEditable ? 1 : 0.6
             }}
           >
            <option value="">Select {label.toLowerCase()}</option>
            {options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Form.Select>
        ) : type === 'textarea' ? (
                     <Form.Control
             as="textarea"
             rows={4}
             value={formData[fieldName]}
             onChange={(e) => handleInputChange(fieldName, e.target.value)}
             isInvalid={!!getFieldError(fieldName)}
             className={getFieldError(fieldName) ? 'border-danger' : ''}
             placeholder={placeholder}
             disabled={!isEditable}
             style={{
               border: '2px solid #e9ecef',
               borderRadius: '0',
               padding: '0.75rem 1rem',
               fontSize: '0.95rem',
               transition: 'all 0.2s ease',
               opacity: isEditable ? 1 : 0.6
             }}
           />
        ) : type === 'date' ? (
                     <Form.Control
             type="date"
             value={formData[fieldName]}
             onChange={(e) => handleInputChange(fieldName, e.target.value)}
             isInvalid={!!getFieldError(fieldName)}
             className={getFieldError(fieldName) ? 'border-danger' : ''}
             disabled={!isEditable}
             style={{
               border: '2px solid #e9ecef',
               borderRadius: '0',
               padding: '0.75rem 1rem',
               fontSize: '0.95rem',
               transition: 'all 0.2s ease',
               opacity: isEditable ? 1 : 0.6
             }}
           />
        ) : (
                     <Form.Control
             type={type}
             value={formData[fieldName]}
             onChange={(e) => handleInputChange(fieldName, e.target.value)}
             isInvalid={!!getFieldError(fieldName)}
             className={getFieldError(fieldName) ? 'border-danger' : ''}
             placeholder={placeholder}
             step={type === 'number' ? '0.1' : undefined}
             min={type === 'number' ? '0' : undefined}
             max={type === 'number' && fieldName === 'aiMatchScore' ? '100' : undefined}
             disabled={!isEditable}
             style={{
               border: '2px solid #e9ecef',
               borderRadius: '0',
               padding: '0.75rem 1rem',
               fontSize: '0.95rem',
               transition: 'all 0.2s ease',
               opacity: isEditable ? 1 : 0.6
             }}
           />
        )}
        {getFieldError(fieldName) && (
          <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
            <BiErrorCircle className="me-1" />
            {getFieldError(fieldName)}
          </Form.Control.Feedback>
        )}
        {!isEditable && (
          <small className="text-muted">
            This field cannot be edited in the current status ({tenderStatuses[formData.status]?.label})
          </small>
        )}
      </Form.Group>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="tab-content">
            <Row className="g-3">
              <Col md={8}>
                {renderField('title', 'Tender Title', 'text', null, 'Enter a descriptive tender title')}
              </Col>
              <Col md={4}>
                {renderField('status', 'Status', 'select', Object.keys(tenderStatuses), '', false)}
              </Col>
              <Col md={6}>
                {renderField('organization', 'Organization', 'text', null, 'Enter organization name')}
              </Col>
              <Col md={6}>
                {renderField('location', 'Location', 'text', null, 'Enter location/city/country')}
              </Col>
              <Col md={12}>
                {renderField('description', 'Description', 'textarea', null, 'Provide a detailed description of the tender opportunity')}
              </Col>
            </Row>
          </div>
        )

      case 'financial':
        return (
          <div className="tab-content">
            <Row className="g-3">
              <Col md={6}>
                {renderField('estimatedValue', 'Estimated Value (M USD)', 'number', null, 'e.g., 5.2')}
              </Col>
              <Col md={6}>
                {renderField('currency', 'Currency', 'select', ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'], '', false)}
              </Col>
                             <Col md={12}>
                 <div className="info-card p-3 bg-light" style={{
                   borderLeft: '4px solid #667eea',
                   background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                   borderRadius: '0'
                 }}>
                   <h6 className="mb-2">
                     <BiInfoCircle className="me-2 text-primary" />
                     Financial Information
                   </h6>
                   <p className="mb-0 text-muted small">
                     The estimated value will be converted to the actual currency amount. 
                     For example, 5.2M USD will be stored as 5,200,000 USD.
                   </p>
                 </div>
               </Col>
            </Row>
          </div>
        )

      case 'classification':
        return (
          <div className="tab-content">
            <Row className="g-3">
              <Col md={6}>
                {renderField('tenderType', 'Tender Type', 'select', [
                  'Public Procurement', 'Hospital Tender', 'Government RFP', 
                  'Private Tender', 'Framework Agreement', 'Supply Agreement'
                ])}
              </Col>
              <Col md={6}>
                {renderField('therapeuticArea', 'Therapeutic Area', 'select', [
                  'Diabetes', 'Rare Diseases', 'Cardiovascular', 'Oncology', 
                  'Neurology', 'Respiratory', 'Other'
                ])}
              </Col>
              <Col md={12}>
                <div className="tags-section">
                  <Form.Label className="fw-semibold d-flex align-items-center">
                    Tags
                    {!canEditField('tags') && (
                      <Badge bg="warning" className="ms-2">
                        <BiLock className="me-1" />
                        Read Only
                      </Badge>
                    )}
                  </Form.Label>
                  <div className="d-flex gap-2 mb-2">
                                         <Form.Control
                       type="text"
                       value={newTag}
                       onChange={(e) => setNewTag(e.target.value)}
                       placeholder="Add a tag"
                       onKeyPress={(e) => e.key === 'Enter' && addTag()}
                       disabled={!canEditField('tags')}
                       style={{
                         border: '2px solid #e9ecef',
                         borderRadius: '0',
                         padding: '0.75rem 1rem',
                         fontSize: '0.95rem',
                         opacity: canEditField('tags') ? 1 : 0.6
                       }}
                     />
                    <Button variant="outline-primary" onClick={addTag} disabled={!newTag.trim() || !canEditField('tags')}>
                      <BiPlus />
                    </Button>
                  </div>
                                     <div className="tags-container" style={{
                     minHeight: '60px',
                     padding: '0.5rem',
                     border: '2px dashed #dee2e6',
                     borderRadius: '0',
                     backgroundColor: '#f8f9fa'
                   }}>
                                         {formData.tags.map((tag, index) => (
                       <Badge key={index} bg="primary" className="me-2 mb-2 p-2" style={{
                         borderRadius: '0',
                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important'
                       }}>
                        {tag}
                        {canEditField('tags') && (
                          <BiX 
                            className="ms-2 cursor-pointer" 
                            onClick={() => removeTag(tag)}
                            style={{ cursor: 'pointer' }}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )

      case 'timeline':
        return (
          <div className="tab-content">
            <Row className="g-3">
              <Col md={6}>
                {renderField('deadline', 'Submission Deadline', 'date')}
              </Col>
              <Col md={6}>
                {renderField('source', 'Tender Source', 'text', null, 'e.g., Government website, Email, etc.')}
              </Col>
                             <Col md={12}>
                 <div className="info-card p-3 bg-light" style={{
                   borderLeft: '4px solid #667eea',
                   background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                   borderRadius: '0'
                 }}>
                   <h6 className="mb-2">
                     <BiInfoCircle className="me-2 text-primary" />
                     Timeline Information
                   </h6>
                   <p className="mb-0 text-muted small">
                     Set the submission deadline and specify where you found this tender opportunity. 
                     This helps with tracking and future reference.
                   </p>
                 </div>
               </Col>
            </Row>
          </div>
        )

      case 'requirements':
        return (
          <div className="tab-content">
            <Row className="g-3">
              {['technical', 'financial', 'legal'].map((type) => (
                <Col md={4} key={type}>
                  <div className="requirements-section">
                    <h6 className="mb-3 text-capitalize d-flex align-items-center">
                      {type} Requirements
                      {!canEditField('requirements') && (
                        <Badge bg="warning" className="ms-2">
                          <BiLock className="me-1" />
                          Read Only
                        </Badge>
                      )}
                    </h6>
                    <div className="d-flex gap-2 mb-2">
                                             <Form.Control
                         type="text"
                         value={newRequirement.type === type ? newRequirement.content : ''}
                         onChange={(e) => setNewRequirement({ type, content: e.target.value })}
                         placeholder={`Add ${type} requirement`}
                         onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                         disabled={!canEditField('requirements')}
                         style={{
                           border: '2px solid #e9ecef',
                           borderRadius: '0',
                           padding: '0.75rem 1rem',
                           fontSize: '0.95rem',
                           opacity: canEditField('requirements') ? 1 : 0.6
                         }}
                       />
                      <Button 
                        variant="outline-primary" 
                        onClick={addRequirement}
                        disabled={!(newRequirement.type === type && newRequirement.content.trim()) || !canEditField('requirements')}
                      >
                        <BiPlus />
                      </Button>
                    </div>
                    <div className="requirements-list">
                      {formData.requirements[type].map((req, index) => (
                                                 <div key={index} className="requirement-item d-flex justify-content-between align-items-center p-2 bg-light mb-2" style={{
                           backgroundColor: '#f8f9fa',
                           border: '1px solid #e9ecef',
                           borderRadius: '0'
                         }}>
                          <span className="small">{req}</span>
                          {canEditField('requirements') && (
                            <BiX 
                              className="text-danger cursor-pointer" 
                              onClick={() => removeRequirement(type, req)}
                              style={{ cursor: 'pointer' }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )

      case 'ai-pipeline':
        return (
          <div className="tab-content">
            <Row className="g-3">
              <Col md={4}>
                {renderField('aiMatchScore', 'AI Match Score (%)', 'number', null, '0-100', false)}
              </Col>
              <Col md={4}>
                {renderField('pipelineStage', 'Pipeline Stage', 'select', Object.keys(pipelineStages), '', false)}
              </Col>
              <Col md={4}>
                {renderField('priority', 'Priority', 'select', ['low', 'medium', 'high', 'critical'], '', false)}
              </Col>
              <Col md={6}>
                {renderField('winProbability', 'Win Probability (%)', 'number', null, '0-100', false)}
              </Col>
                             <Col md={6}>
                 <div className="info-card p-3 bg-light" style={{
                   borderLeft: '4px solid #667eea',
                   background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                   borderRadius: '0'
                 }}>
                   <h6 className="mb-2">
                     <BiInfoCircle className="me-2 text-primary" />
                     AI & Pipeline
                   </h6>
                   <p className="mb-0 text-muted small">
                     Set AI match score, pipeline stage, priority, and win probability 
                     to track tender progress and success likelihood.
                   </p>
                 </div>
               </Col>
            </Row>
          </div>
        )

      default:
        return null
    }
  }

  // Status change modal
  const renderStatusChangeModal = () => (
    <Modal show={showStatusChangeModal} onHide={() => setShowStatusChangeModal(false)} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Tender Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>New Status</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select new status</option>
              {tenderStatuses[formData.status]?.canChangeTo.map(status => (
                <option key={status} value={status}>
                  {tenderStatuses[status]?.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Reason for Change</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={statusChangeReason}
              onChange={(e) => setStatusChangeReason(e.target.value)}
              placeholder="Provide a reason for the status change..."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowStatusChangeModal(false)}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleStatusChange}
          disabled={!newStatus || !statusChangeReason}
        >
          Change Status
        </Button>
      </Modal.Footer>
    </Modal>
  )

  return (
    <>
      <FormDrawerModal
        show={show}
        onHide={onHide}
        className="tender-modal"
        onTestFill={show ? () => setFormData(dummyTenderModalForm()) : undefined}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="me-2">
              {mode === 'create' ? '🚀' : '✏️'}
            </span>
            {mode === 'create' ? 'Create New Tender' : 'Edit Tender'}
            {mode === 'edit' && !canEditTender() && (
              <Badge bg="warning" className="ms-2">
                <BiLock className="me-1" />
                Limited Editing
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-0">
            {/* Progress Section */}
            <div className="progress-section">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Form Completion</span>
                <span className="text-muted">{formProgress}%</span>
              </div>
              <ProgressBar 
                now={formProgress} 
                variant={formProgress === 100 ? 'success' : formProgress > 70 ? 'info' : 'warning'}
                className="mb-2"
              />
              <small className="text-muted">
                {formProgress === 100 ? '✅ All required fields completed!' : 
                 `${Object.keys(validationErrors).length} validation errors remaining`}
              </small>
            </div>

            {/* Status Information */}
            {mode === 'edit' && (
              <div className="p-3 bg-light border-bottom">
                <Row className="g-3">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <strong className="me-2">Current Status:</strong>
                      <Badge bg={tenderStatuses[formData.status]?.color}>
                        {tenderStatuses[formData.status]?.label}
                      </Badge>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="ms-2"
                        onClick={() => setShowStatusChangeModal(true)}
                        disabled={!tenderStatuses[formData.status]?.canChangeTo?.length}
                      >
                        <BiEdit className="me-1" />
                        Change Status
                      </Button>
                    </div>
                    <small className="text-muted">
                      {tenderStatuses[formData.status]?.description}
                    </small>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <strong className="me-2">Pipeline Stage:</strong>
                      <Badge bg={pipelineStages[formData.pipelineStage]?.color}>
                        {pipelineStages[formData.pipelineStage]?.label}
                      </Badge>
                    </div>
                    <small className="text-muted">
                      {pipelineStages[formData.pipelineStage]?.description}
                    </small>
                  </Col>
                </Row>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="tab-navigation">
              <ul className="nav nav-tabs">
                {tabs.map((tab) => (
                  <li className="nav-item" key={tab.id}>
                    <a
                      href="#"
                      className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(tab.id);
                      }}
                    >
                      <span className="me-2">{tab.icon}</span>
                      {tab.label}
                      {tab.required && <span className="text-danger ms-1">*</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tab Content */}
            <div className="tab-content-container">
              {renderTabContent()}
            </div>
          </Modal.Body>
          
          <Modal.Footer>
            <div className="d-flex justify-content-between w-100">
              <Button variant="outline-secondary" onClick={onHide}>
                Cancel
              </Button>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" onClick={resetForm} type="button">
                  Reset Form
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading || formProgress < 100 || !canEditTender()}
                  className="d-flex align-items-center"
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <BiSave className="me-2" />
                      {mode === 'create' ? 'Create Tender' : 'Update Tender'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Form>
      </FormDrawerModal>

      {/* Status Change Modal */}
      {renderStatusChangeModal()}
    </>
  )
}

export default TenderModal
