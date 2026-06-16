import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Badge, Row, Col, Spinner, ProgressBar } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import { Bot, Plus, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRfpResponses } from '../../store/slices/rfpResponseSlice'

const AIRFPCopilot = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items: rfpResponses, loading } = useSelector(state => state.rfpResponse)

  useEffect(() => {
    dispatch(fetchRfpResponses())
  }, [dispatch])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DRAFT': return <Badge bg="secondary">Setup Phase</Badge>
      case 'IN_PROGRESS': return <Badge bg="primary">AI Drafting</Badge>
      case 'REVIEW': return <Badge bg="warning" text="dark">Under Review</Badge>
      case 'APPROVED': return <Badge bg="success">Approved</Badge>
      case 'SUBMITTED': return <Badge bg="info">Submitted</Badge>
      default: return <Badge bg="secondary">{status}</Badge>
    }
  }

  return (
    <ExecutiveCommandCenter
      className="page-enter"
      breadcrumbs={[
        { label: 'RFP Management', onClick: () => navigate('/rfp-management') },
        { label: 'AI Copilot Hub', active: true }
      ]}
      onBack={() => navigate('/rfp-management')}
      title="AI Proposal Writer Hub"
      description="Manage all your AI-assisted proposal writing projects in one place."
      tableTitle={`Active Proposals (${rfpResponses.length})`}
      tableActions={(
        <Button variant="primary" onClick={() => navigate('/rfp-management/create')}>
          <Plus size={18} className="me-2" />
          New Workspace
        </Button>
      )}
    >
      {loading ? (
        <div className="text-center p-5"><Spinner animation="border" /></div>
      ) : rfpResponses.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm">
          <Card.Body>
            <Bot size={48} className="text-muted mb-3 opacity-50" />
            <h5 className="text-muted">No AI workspaces active</h5>
            <p className="text-muted small">Start by creating a workspace linked to an approved tender.</p>
            <Button variant="outline-primary" onClick={() => navigate('/rfp-management/create')}>
              Create Workspace
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {rfpResponses.map(rfp => (
            <Col md={6} xl={4} key={rfp._id}>
              <Card className="border-0 shadow-sm h-100 copilot-card hover-lift">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    {getStatusBadge(rfp.metadata.status)}
                    <span className="text-muted small">
                      Deadline: {new Date(rfp.metadata.submissionDeadline).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h5 className="mb-1 text-truncate" title={rfp.metadata.projectName}>
                    {rfp.metadata.projectName}
                  </h5>
                  <p className="text-muted small mb-3 text-truncate" title={rfp.tenderId?.title}>
                    Tender: {rfp.tenderId?.title}
                  </p>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span>Completion</span>
                      <span>{rfp.readiness || 0}%</span>
                    </div>
                    <ProgressBar 
                      now={rfp.readiness || 0} 
                      variant={rfp.readiness === 100 ? 'success' : 'primary'}
                      className="mb-3"
                      style={{ height: '6px' }}
                    />

                    <Button 
                      variant="light" 
                      className="w-100 border text-primary fw-medium d-flex justify-content-between align-items-center"
                      onClick={() => navigate(`/rfp-management/editor/${rfp._id}`)}
                    >
                      Open Workspace <ArrowRight size={16} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </ExecutiveCommandCenter>
  )
}

export default AIRFPCopilot
