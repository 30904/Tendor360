import React from 'react'
import { Modal, Button, Row, Col, Badge, Card, Table } from 'react-bootstrap'
import { 
  BiBuilding, BiMapPin, BiCalendar, BiDollar, BiAward,
  BiCheckCircle, BiXCircle, BiTime, BiUser, BiFile
} from 'react-icons/bi'
// Modal styles are now centralized in /styles/components.scss

const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDaysUntilDeadline = (deadline) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getUrgencyStatus = (deadline) => {
  const daysUntil = getDaysUntilDeadline(deadline)
  if (daysUntil < 0) return { status: 'Overdue', variant: 'danger', icon: '⚠️' }
  if (daysUntil <= 7) return { status: 'Urgent', variant: 'warning', icon: '🚨' }
  if (daysUntil <= 30) return { status: 'Due Soon', variant: 'info', icon: '⏰' }
  return { status: 'Active', variant: 'success', icon: '✅' }
}

const getAIMatchColor = (score) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'info'
  if (score >= 70) return 'warning'
  return 'danger'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'draft': return 'secondary'
    case 'overdue': return 'warning'
    case 'closed': return 'info'
    case 'awarded': return 'success'
    case 'cancelled': return 'danger'
    default: return 'secondary'
  }
}

const TenderViewModal = ({ show, onHide, tender }) => {
  if (!tender) return null

  const urgencyStatus = getUrgencyStatus(tender.deadline)
  const daysUntil = getDaysUntilDeadline(tender.deadline)

    return (
    <Modal show={show} onHide={onHide} size="xl" centered className="tender-view-modal">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <BiFile className="me-2" />
          Tender Details
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4" style={{ minHeight: '600px' }}>
                 {/* Print Title - Hidden on screen, visible in print */}
         <div className="print-title d-none" style={{ 
           display: 'none',
           '@media print': { display: 'block !important' }
         }}>
           <h1 className="text-center mb-4" style={{ 
             fontSize: '28px', 
             fontWeight: 'bold',
             borderBottom: '3px solid #000',
             paddingBottom: '20px'
           }}>
             Tender Details
           </h1>
         </div>
         
         {/* Top Spacing */}
         <div style={{ height: '1rem' }}></div>
        
                 {/* Header Section */}
         <Row className="mb-4 header-section">
          <Col lg={8}>
            <h3 className="mb-3">{tender.title}</h3>
            <p className="text-muted mb-3">{tender.description}</p>
            
            {/* Status and AI Match Row */}
            <Row className="g-3 mb-3">
              <Col xs={6}>
                <Badge bg={getStatusColor(tender.status)} className="fs-6 px-3 py-2">
                  {tender.status?.toUpperCase() || 'DRAFT'}
                </Badge>
              </Col>
              <Col xs={6}>
                <Badge bg={getAIMatchColor(tender.aiMatchScore)} className="fs-6 px-3 py-2">
                  AI Match: {tender.aiMatchScore}%
                </Badge>
              </Col>
            </Row>

            {/* Organization and Location */}
            <Row className="g-3 mb-3">
              <Col xs={6}>
                <div className="d-flex align-items-center">
                  <BiBuilding className="me-2 text-muted" />
                  <span className="fw-semibold">{tender.organization}</span>
                </div>
              </Col>
              <Col xs={6}>
                <div className="d-flex align-items-center">
                  <BiMapPin className="me-2 text-muted" />
                  <span className="fw-semibold">{tender.location}</span>
                </div>
              </Col>
            </Row>
          </Col>
          
                     <Col lg={4}>
             <Card className="border-0 shadow-sm metrics-card">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <div className="display-6 text-primary fw-bold">
                    {formatCurrency(tender.estimatedValue)}
                  </div>
                  <small className="text-muted">Estimated Value</small>
                </div>
                
                <div className="mb-3">
                  <div className="h5 text-info fw-bold">
                    {tender.pipelineStage || 'N/A'}
                  </div>
                  <small className="text-muted">Pipeline Stage</small>
                </div>
                
                <div className="mb-3">
                  <div className="h5 text-warning fw-bold">
                    {tender.priority || 'Medium'}
                  </div>
                  <small className="text-muted">Priority</small>
                </div>
                
                <div>
                  <div className="h5 text-success fw-bold">
                    {tender.winProbability || 0}%
                  </div>
                  <small className="text-muted">Win Probability</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Key Information */}
        <Row className="mb-4">
          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-light">
                <h6 className="mb-0">
                  <BiCalendar className="me-2" />
                  Timeline Information
                </h6>
              </Card.Header>
              <Card.Body>
                <Table borderless className="mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted">Published Date:</td>
                      <td className="fw-semibold">{formatDate(tender.publishedDate)}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Updated Date:</td>
                      <td className="fw-semibold">{formatDate(tender.updatedDate)}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Submission Deadline:</td>
                      <td className="fw-semibold">
                        {formatDate(tender.deadline)}
                        <Badge 
                          bg={urgencyStatus.variant} 
                          className="ms-2"
                          title={`${Math.abs(daysUntil)} days ${daysUntil < 0 ? 'overdue' : 'remaining'}`}
                        >
                          {urgencyStatus.icon} {urgencyStatus.status}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Evaluation Period:</td>
                      <td className="fw-semibold">{tender.evaluationPeriod || 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-light">
                                 <h6 className="mb-2">
                   <BiAward className="me-2" />
                   Requirements & Criteria
                 </h6>
              </Card.Header>
              <Card.Body>
                <Table borderless className="mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted">Experience Required:</td>
                      <td className="fw-semibold">{tender.experienceRequired || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Technical Requirements:</td>
                      <td className="fw-semibold">{tender.technicalRequirements || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Certifications:</td>
                      <td className="fw-semibold">{tender.certifications || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Financial Capacity:</td>
                      <td className="fw-semibold">{tender.financialCapacity || 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tags and Categories */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                                 <h6 className="mb-0">
                   <BiFile className="me-2" />
                   Categories & Tags
                 </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong className="text-muted me-2">Therapeutic Areas:</strong>
                  {tender.therapeuticAreas?.map((area, index) => (
                    <Badge key={index} bg="primary" className="me-1">
                      {area}
                    </Badge>
                  )) || 'N/A'}
                </div>
                
                <div className="mb-3">
                  <strong className="text-muted me-2">Tender Type:</strong>
                  {tender.tenderType && (
                    <Badge bg="info" className="me-1">
                      {tender.tenderType}
                    </Badge>
                  )}
                </div>
                
                <div>
                  <strong className="text-muted me-2">Tags:</strong>
                  {tender.tags?.map((tag, index) => (
                    <Badge key={index} bg="light" text="dark" className="me-1">
                      {tag}
                    </Badge>
                  )) || 'N/A'}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Details */}
        {tender.additionalDetails && (
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light">
                                     <h6 className="mb-0">
                     <BiFile className="me-2" />
                     Additional Details
                   </h6>
                </Card.Header>
                <Card.Body>
                  <p className="mb-0">{tender.additionalDetails}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Contact Information */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h6 className="mb-0">
                  <BiUser className="me-2" />
                  Contact Information
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong className="text-muted">Contact Person:</strong>
                      <div>{tender.contactPerson || 'N/A'}</div>
                    </div>
                    <div className="mb-2">
                      <strong className="text-muted">Email:</strong>
                      <div>{tender.contactEmail || 'N/A'}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong className="text-muted">Phone:</strong>
                      <div>{tender.contactPhone || 'N/A'}</div>
                    </div>
                    <div className="mb-2">
                      <strong className="text-muted">Website:</strong>
                      <div>{tender.website || 'N/A'}</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
                 <Button variant="primary" onClick={() => window.print()}>
           <BiFile className="me-2" />
           Print Details
         </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TenderViewModal
