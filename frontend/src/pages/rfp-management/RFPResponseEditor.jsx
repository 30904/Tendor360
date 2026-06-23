import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Card, Button, Badge, Spinner, Alert, ListGroup, ProgressBar, Form, Modal, Table } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import { Bot, CheckCircle, FileText, RefreshCw, AlertTriangle, Send, Activity, Save } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchRfpResponse, 
  extractRequirements, 
  generateAllSections, 
  generateSection, 
  updateSection, 
  approveSection, 
  validateResponse, 
  submitResponse,
  updateRfpResponseMetadata
} from '../../store/slices/rfpResponseSlice'
import { toast } from 'react-toastify'

const getApiErrorMessage = (err) => {
  if (!err) return 'Request failed';
  if (typeof err === 'string') return err;
  return err.message || err.error || 'Request failed';
};

const RFPResponseEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentResponse, loading, aiProcessing, error } = useSelector(state => state.rfpResponse)
  const { user } = useSelector(state => state.auth)

  const [activeSectionId, setActiveSectionId] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [showReqsModal, setShowReqsModal] = useState(false)

  const userRoles = user?.roles || [];
  const isAdmin = userRoles.includes('ADMIN');
  const isReviewerOrApprover = isAdmin || userRoles.includes('REVIEWER') || userRoles.includes('APPROVER');
  const isApprover = isAdmin || userRoles.includes('APPROVER');
  const isTenderManager = isAdmin || userRoles.includes('TENDER MANAGER');

  useEffect(() => {
    dispatch(fetchRfpResponse(id))
  }, [dispatch, id])

  useEffect(() => {
    if (currentResponse?.sections?.length > 0 && !activeSectionId) {
      setActiveSectionId(currentResponse.sections[0]._id)
    }
  }, [currentResponse, activeSectionId])

  const activeSection = currentResponse?.sections?.find(s => s._id === activeSectionId)

  const handleExtractRequirements = async () => {
    try {
      const action = await dispatch(extractRequirements(id)).unwrap()
      toast.success(`Extracted ${action.requirements.length} requirements`)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleGenerateAll = async () => {
    try {
      await dispatch(generateAllSections(id)).unwrap()
      toast.success('Generated all pending sections')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleGenerateSingle = async (sectionType) => {
    try {
      await dispatch(generateSection({ id, sectionType })).unwrap()
      toast.success('Section generated successfully')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleSaveEdit = async () => {
    try {
      await dispatch(updateSection({ 
        id, 
        sectionId: activeSectionId, 
        data: { content: editedContent } 
      })).unwrap()
      setEditMode(false)
      toast.success('Changes saved')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleApprove = async () => {
    try {
      await dispatch(approveSection({ id, sectionId: activeSectionId, comments: 'Approved' })).unwrap()
      toast.success('Section approved')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleValidate = async () => {
    try {
      const action = await dispatch(validateResponse(id)).unwrap()
      toast.success(`Audit complete: ${action.complianceAudit.coveragePercentage}% coverage`)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleSendForReview = async () => {
    try {
      await dispatch(updateRfpResponseMetadata({ id, data: { status: 'REVIEW' } })).unwrap()
      toast.success('Sent for review successfully')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const handleSubmit = async () => {
    try {
      await dispatch(submitResponse(id)).unwrap()
      toast.success('Proposal submitted successfully')
      navigate('/rfp-management')
    } catch (err) {
      toast.error(err.message || 'Submit failed. Make sure all sections are approved.')
    }
  }

  if (loading && !currentResponse) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>
  }

  if (!currentResponse) {
    return <Alert variant="danger">Response project not found.</Alert>
  }

  const { metadata, sections, extractedRequirements, complianceAudit } = currentResponse
  const hasRequirements = extractedRequirements?.length > 0

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <Badge bg="success">Approved</Badge>
      case 'DRAFT': return <Badge bg="primary">Draft</Badge>
      case 'MANUALLY_WRITTEN': return <Badge bg="info">Manual</Badge>
      case 'NEEDS_REVIEW': return <Badge bg="warning" text="dark">Review Needed</Badge>
      case 'GENERATING': return <Badge bg="secondary"><Spinner size="sm"/> Generating</Badge>
      default: return <Badge bg="secondary">Pending</Badge>
    }
  }

  const getConfidenceBadge = (score) => {
    if (!score) return null
    if (score >= 80) return <Badge bg="success">AI Confidence: {score}%</Badge>
    if (score >= 60) return <Badge bg="warning" text="dark">AI Confidence: {score}%</Badge>
    return <Badge bg="danger">AI Confidence: {score}%</Badge>
  }

  return (
    <ExecutiveCommandCenter
      className="page-enter"
      breadcrumbs={[
        { label: 'RFP Management', onClick: () => navigate('/rfp-management') },
        { label: metadata.projectName, active: true }
      ]}
      onBack={() => navigate('/rfp-management')}
      title="RFP Response Copilot Workspace"
      description={`Writing proposal for: ${currentResponse.tenderId?.title}`}
      kpiTitle="Project Health"
      kpiContent={(
        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-muted small">Requirements Extracted</div>
                    <div className="h4 mb-0">{extractedRequirements?.length || 0}</div>
                  </div>
                  {extractedRequirements?.length > 0 && (
                    <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => setShowReqsModal(true)}>
                      View List
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="text-muted small">Sections Ready</div>
                <div className="h4 mb-0">
                  {sections.filter(s => s.status === 'APPROVED').length} / {sections.length}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="text-muted small mb-2">Overall Compliance Coverage</div>
                <ProgressBar 
                  now={complianceAudit?.coveragePercentage || 0} 
                  label={`${complianceAudit?.coveragePercentage || 0}%`} 
                  variant={complianceAudit?.coveragePercentage === 100 ? 'success' : 'primary'}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    >
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Global Action Bar */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="d-flex justify-content-between align-items-center bg-light rounded">
          <div>
            <h6 className="mb-0">Copilot Actions</h6>
            <span className="text-muted small">Current status: <Badge bg={metadata.status === 'SUBMITTED' ? 'success' : 'primary'}>{metadata.status}</Badge></span>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={handleExtractRequirements} 
              disabled={aiProcessing || metadata.status === 'REVIEW' || metadata.status === 'APPROVED' || metadata.status === 'SUBMITTED'}
            >
              <Bot size={16} className="me-2" /> 
              {hasRequirements ? 'Re-extract Requirements' : '1. Extract Requirements'}
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={handleGenerateAll} 
              disabled={aiProcessing || !hasRequirements || metadata.status === 'REVIEW' || metadata.status === 'APPROVED' || metadata.status === 'SUBMITTED'}
            >
              <RefreshCw size={16} className="me-2" /> 
              2. Generate All
            </Button>
            <Button 
              variant="outline-info" 
              onClick={handleValidate} 
              disabled={aiProcessing}
            >
              <Activity size={16} className="me-2" /> 
              3. Run Compliance Audit
            </Button>
            {isTenderManager && !isReviewerOrApprover && (metadata.status === 'DRAFT' || metadata.status === 'IN_PROGRESS') && (
              <Button 
                variant="warning" 
                onClick={handleSendForReview} 
                disabled={aiProcessing}
              >
                <Send size={16} className="me-2" /> 
                Send for Review
              </Button>
            )}
            {isApprover && (
              <Button 
                variant="success" 
                onClick={handleSubmit} 
                disabled={aiProcessing || metadata.status === 'SUBMITTED'}
              >
                <CheckCircle size={16} className="me-2" /> 
                Final Submit
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Row>
        {/* Sidebar: Sections List */}
        <Col md={3}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom-0 pt-3">
              <h6 className="mb-0">Proposal Outline</h6>
            </Card.Header>
            <ListGroup variant="flush">
              {sections.map(section => (
                <ListGroup.Item 
                  key={section._id}
                  action
                  active={activeSectionId === section._id}
                  onClick={() => {
                    setActiveSectionId(section._id)
                    setEditMode(false)
                  }}
                  className="d-flex justify-content-between align-items-center py-3"
                >
                  <div className="text-truncate me-2" title={section.title}>
                    <span className="fw-medium">{section.title}</span>
                  </div>
                  <div>
                    {getStatusBadge(section.status)}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Main Content Area */}
        <Col md={9}>
          {activeSection ? (
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-bottom pt-3 pb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1">{activeSection.title}</h5>
                    <div className="d-flex gap-2 align-items-center">
                      {getStatusBadge(activeSection.status)}
                      {getConfidenceBadge(activeSection.aiMetadata?.confidenceScore)}
                      {activeSection.wordCount > 0 && <span className="text-muted small">{activeSection.wordCount} words</span>}
                      {activeSection.aiMetadata?.model && <Badge bg="light" text="dark" className="border">🤖 {activeSection.aiMetadata.model}</Badge>}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {editMode ? (
                      <>
                        <Button variant="outline-secondary" size="sm" onClick={() => setEditMode(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                          <Save size={16} className="me-1" /> Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => {
                            setEditedContent(activeSection.content)
                            setEditMode(true)
                          }}
                        >
                          <FileText size={16} className="me-1" /> Edit
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleGenerateSingle(activeSection.type)}
                          disabled={aiProcessing || metadata.status === 'REVIEW' || metadata.status === 'APPROVED' || metadata.status === 'SUBMITTED'}
                        >
                          <RefreshCw size={16} className="me-1" /> Regenerate
                        </Button>
                        {isReviewerOrApprover && activeSection.status !== 'APPROVED' && (
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={handleApprove}
                            disabled={!activeSection.content}
                          >
                            <CheckCircle size={16} className="me-1" /> Approve
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card.Header>
              
              <Card.Body style={{ minHeight: '500px', backgroundColor: '#fafafa' }}>
                {activeSection.status === 'GENERATING' ? (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p>AI Copilot is drafting this section...</p>
                  </div>
                ) : !activeSection.content && !editMode ? (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                    <Bot size={48} className="mb-3 opacity-50" />
                    <p>No content generated yet.</p>
                    <Button variant="outline-primary" onClick={() => handleGenerateSingle(activeSection.type)}>
                      Generate with AI
                    </Button>
                  </div>
                ) : editMode ? (
                  <Form.Control
                    as="textarea"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    style={{ height: '500px', fontFamily: 'monospace' }}
                  />
                ) : (
                  <div className="bg-white p-4 rounded border shadow-sm markdown-preview" style={{ minHeight: '100%' }}>
                    {/* Basic markdown rendering without library for simplicity */}
                    {activeSection.content.split('\n').map((line, i) => {
                      if (line.startsWith('### ')) return <h5 key={i} className="mt-3">{line.substring(4)}</h5>
                      if (line.startsWith('## ')) return <h4 key={i} className="mt-4">{line.substring(3)}</h4>
                      if (line.startsWith('# ')) return <h3 key={i} className="mt-4">{line.substring(2)}</h3>
                      if (line.startsWith('- ')) return <li key={i}>{line.substring(2)}</li>
                      if (line.trim() === '') return <br key={i} />
                      return <p key={i} className="mb-2">{line}</p>
                    })}
                  </div>
                )}
              </Card.Body>

              {/* AI Metadata Footer */}
              {activeSection.aiMetadata?.generatedAt && (
                <Card.Footer className="bg-white text-muted small py-3">
                  <Row>
                    <Col md={6}>
                      <strong>Last Generated:</strong> {new Date(activeSection.aiMetadata.generatedAt).toLocaleString()}
                      {activeSection.aiMetadata.retryCount > 0 && <span className="text-warning ms-2">({activeSection.aiMetadata.retryCount} schema retries)</span>}
                    </Col>
                    <Col md={6} className="text-end">
                      <strong>Addressed Requirements:</strong> {activeSection.aiMetadata.addressedRequirements?.length || 0}
                    </Col>
                  </Row>
                  {activeSection.aiMetadata.groundingSources?.length === 0 && (
                    <Alert variant="warning" className="mt-2 mb-0 py-2">
                      <AlertTriangle size={14} className="me-1" /> 
                      <strong>Ungrounded Section:</strong> No Content Library matches found. LLM relied on base knowledge. Review carefully.
                    </Alert>
                  )}
                </Card.Footer>
              )}
            </Card>
          ) : (
            <Card className="border-0 shadow-sm h-100 d-flex align-items-center justify-content-center text-muted">
              Select a section to view content
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showReqsModal} onHide={() => setShowReqsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Extracted Requirements</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th>Requirement</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {extractedRequirements?.map((req, i) => (
                <tr key={i}>
                  <td><Badge bg="secondary">{req.category}</Badge></td>
                  <td>
                    <strong>{req.requirement}</strong>
                    {req.description && <div className="text-muted small mt-1">{req.description}</div>}
                  </td>
                  <td>{req.mandatory ? <Badge bg="danger">Mandatory</Badge> : <Badge bg="info">Optional</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </ExecutiveCommandCenter>
  )
}

export default RFPResponseEditor
