import React, { useEffect, useMemo } from 'react'
import { Row, Col, Card, Badge, Spinner, Alert, ProgressBar, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRfpResponses } from '../../store/slices/rfpResponseSlice'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Calendar, CheckCircle, Clock } from 'lucide-react'

const TrackRFP = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { items, loading, error } = useSelector(state => state.rfpResponse)

  useEffect(() => {
    dispatch(fetchRfpResponses())
  }, [dispatch])

  // Group responses by status
  const groupedResponses = useMemo(() => {
    const groups = {
      DRAFT_IN_PROGRESS: [],
      REVIEW: [],
      SUBMITTED: []
    }

    if (!Array.isArray(items)) return groups;

    items.forEach(response => {
      const status = response.metadata?.status || 'DRAFT'
      if (status === 'SUBMITTED' || status === 'APPROVED') {
        groups.SUBMITTED.push(response)
      } else if (status === 'REVIEW') {
        groups.REVIEW.push(response)
      } else {
        groups.DRAFT_IN_PROGRESS.push(response)
      }
    })

    return groups
  }, [items])

  const renderCard = (response) => {
    const deadline = response.metadata?.submissionDeadline 
      ? new Date(response.metadata.submissionDeadline).toLocaleDateString() 
      : 'No Deadline'
      
    const readiness = response.readiness || 0;
    const isSubmitted = response.metadata?.status === 'SUBMITTED';

    return (
      <Card key={response.id || response._id} className="border-0 shadow-sm mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="mb-0 text-truncate" title={response.metadata?.projectName} style={{ maxWidth: '70%' }}>
              {response.metadata?.projectName}
            </h6>
            <Badge bg={isSubmitted ? 'success' : (response.metadata?.status === 'REVIEW' ? 'warning' : 'primary')}>
              {response.metadata?.status}
            </Badge>
          </div>
          
          <div className="text-muted small mb-3 text-truncate" title={response.tenderId?.title}>
            {response.tenderId?.title || 'Unknown Tender'}
          </div>

          <div className="d-flex align-items-center text-muted small mb-3">
            <Calendar size={14} className="me-1" />
            <span className="me-3">Due: {deadline}</span>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Section Readiness</span>
              <span>{readiness}%</span>
            </div>
            <ProgressBar now={readiness} variant={readiness === 100 ? "success" : "primary"} style={{ height: '6px' }} />
          </div>

          <Button 
            variant={isSubmitted ? "outline-success" : "outline-primary"} 
            size="sm" 
            className="w-100"
            onClick={() => navigate(`/rfp-management/editor/${response.id || response._id}`)}
          >
            {isSubmitted ? <><CheckCircle size={14} className="me-1"/> View Finalized</> : <><ExternalLink size={14} className="me-1"/> Open Workspace</>}
          </Button>
        </Card.Body>
      </Card>
    )
  }

  if (loading && (!items || items.length === 0)) {
    return (
      <div className="p-4">
        <div className="d-flex align-items-center mb-4">
          <h4 className="mb-0">Track RFP Responses</h4>
        </div>
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 h-100" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Track RFP Responses</h4>
          <p className="text-muted mb-0">Track lifecycle progress from draft to final submission.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/rfp-management/create')}>
          + New Response
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="h-100">
        <Col md={4}>
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <h6 className="d-flex justify-content-between align-items-center mb-3">
              <span><Clock size={16} className="me-2 text-primary"/> Drafting & In Progress</span>
              <Badge bg="light" text="dark">{groupedResponses.DRAFT_IN_PROGRESS.length}</Badge>
            </h6>
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }} className="pe-2">
              {groupedResponses.DRAFT_IN_PROGRESS.map(renderCard)}
              {groupedResponses.DRAFT_IN_PROGRESS.length === 0 && (
                <div className="text-center text-muted p-4 small">No drafts in progress.</div>
              )}
            </div>
          </div>
        </Col>

        <Col md={4}>
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <h6 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-warning"><Clock size={16} className="me-2"/> In Review</span>
              <Badge bg="light" text="dark">{groupedResponses.REVIEW.length}</Badge>
            </h6>
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }} className="pe-2">
              {groupedResponses.REVIEW.map(renderCard)}
              {groupedResponses.REVIEW.length === 0 && (
                <div className="text-center text-muted p-4 small">No proposals under review.</div>
              )}
            </div>
          </div>
        </Col>

        <Col md={4}>
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <h6 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-success"><CheckCircle size={16} className="me-2"/> Finalized & Submitted</span>
              <Badge bg="light" text="dark">{groupedResponses.SUBMITTED.length}</Badge>
            </h6>
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }} className="pe-2">
              {groupedResponses.SUBMITTED.map(renderCard)}
              {groupedResponses.SUBMITTED.length === 0 && (
                <div className="text-center text-muted p-4 small">No finalized documents yet.</div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default TrackRFP
