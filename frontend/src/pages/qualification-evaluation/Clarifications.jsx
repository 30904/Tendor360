import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Send, Plus, MessageCircle, Clock, CheckCircle, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './Clarifications.scss'
import { dummyClarificationReply } from '../../utils/testFormDummies'
import { toast } from 'react-toastify'

const Clarifications = () => {
  const navigate = useNavigate()
  const [clarifications, setClarifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedClarification, setSelectedClarification] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingClarification, setViewingClarification] = useState(null)

  useEffect(() => {
    loadClarifications()
  }, [])

  const loadClarifications = () => {
    // Mock data for demonstration
    const mockClarifications = [
      {
        id: 1,
        tenderId: 'T2024-001',
        tenderTitle: 'IT Infrastructure Upgrade Project',
        question: 'What is the expected timeline for project completion?',
        askedBy: 'TechCorp Solutions',
        askedDate: '2024-01-15T10:30:00Z',
        status: 'PENDING',
        priority: 'HIGH',
        category: 'TIMELINE',
        replies: []
      },
      {
        id: 2,
        tenderId: 'T2024-002',
        tenderTitle: 'Office Supplies Procurement',
        question: 'Are there any specific brand requirements for office equipment?',
        askedBy: 'OfficeMax Ltd',
        askedDate: '2024-01-14T14:20:00Z',
        status: 'ANSWERED',
        priority: 'MEDIUM',
        category: 'SPECIFICATIONS',
        replies: [
          {
            id: 1,
            reply: 'No specific brand requirements. Any brand meeting the technical specifications is acceptable.',
            repliedBy: 'Procurement Team',
            repliedDate: '2024-01-14T16:45:00Z'
          }
        ]
      },
      {
        id: 3,
        tenderId: 'T2024-003',
        tenderTitle: 'Cleaning Services Contract',
        question: 'What are the working hours for the cleaning staff?',
        askedBy: 'CleanPro Services',
        askedDate: '2024-01-13T09:15:00Z',
        status: 'ANSWERED',
        priority: 'LOW',
        category: 'SCOPE',
        replies: [
          {
            id: 2,
            reply: 'Cleaning services are required Monday to Friday, 6:00 AM to 8:00 PM.',
            repliedBy: 'Facilities Manager',
            repliedDate: '2024-01-13T11:30:00Z'
          }
        ]
      },
      {
        id: 4,
        tenderId: 'T2024-004',
        tenderTitle: 'Software Development Services',
        question: 'What programming languages are preferred for this project?',
        askedBy: 'DevTech Solutions',
        askedDate: '2024-01-16T08:45:00Z',
        status: 'PENDING',
        priority: 'HIGH',
        category: 'TECHNICAL',
        replies: []
      },
      {
        id: 5,
        tenderId: 'T2024-005',
        tenderTitle: 'Construction Materials Supply',
        question: 'Are there any environmental certifications required?',
        askedBy: 'EcoBuild Materials',
        askedDate: '2024-01-15T13:20:00Z',
        status: 'ANSWERED',
        priority: 'MEDIUM',
        category: 'COMPLIANCE',
        replies: [
          {
            id: 3,
            reply: 'Yes, all materials must have ISO 14001 environmental certification.',
            repliedBy: 'Environmental Officer',
            repliedDate: '2024-01-15T15:30:00Z'
          }
        ]
      },
      {
        id: 6,
        tenderId: 'T2024-006',
        tenderTitle: 'Marketing Campaign Services',
        question: 'What is the target audience for this campaign?',
        askedBy: 'Creative Agency Ltd',
        askedDate: '2024-01-17T11:10:00Z',
        status: 'PENDING',
        priority: 'MEDIUM',
        category: 'SCOPE',
        replies: []
      },
      {
        id: 7,
        tenderId: 'T2024-007',
        tenderTitle: 'Security Services Contract',
        question: 'What are the security clearance requirements for personnel?',
        askedBy: 'SecureGuard Inc',
        askedDate: '2024-01-18T09:30:00Z',
        status: 'ANSWERED',
        priority: 'HIGH',
        category: 'COMPLIANCE',
        replies: [
          {
            id: 4,
            reply: 'All security personnel must have valid security clearance and background checks.',
            repliedBy: 'Security Manager',
            repliedDate: '2024-01-18T14:15:00Z'
          }
        ]
      },
      {
        id: 8,
        tenderId: 'T2024-008',
        tenderTitle: 'Transportation Services',
        question: 'What are the insurance requirements for vehicles?',
        askedBy: 'TransLogistics Co',
        askedDate: '2024-01-19T16:45:00Z',
        status: 'PENDING',
        priority: 'LOW',
        category: 'INSURANCE',
        replies: []
      }
    ]
    setClarifications(mockClarifications)
  }

  const handleReply = (clarification) => {
    setSelectedClarification(clarification)
    setReplyText('')
    setShowModal(true)
  }

  const handleSubmitReply = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const newReply = {
      id: Date.now(),
      reply: replyText,
      repliedBy: 'Current User',
      repliedDate: new Date().toISOString()
    }

    setClarifications(prev => prev.map(clarification =>
      clarification.id === selectedClarification.id
        ? {
            ...clarification,
            status: 'ANSWERED',
            replies: [...clarification.replies, newReply]
          }
        : clarification
    ))

    setShowModal(false)
    setSelectedClarification(null)
    setReplyText('')
  }

  const handleViewClarification = (clarification) => {
    setViewingClarification(clarification)
    setShowViewModal(true)
  }

  const handleEditClarification = (clarification) => {
    toast.info(`Editing clarification "${clarification.tenderTitle}" is disabled in Demo Mode. To reply, click the Reply button.`)
  }

  const handleDeleteClarification = (clarification) => {
    if (window.confirm(`Are you sure you want to delete clarification for "${clarification.tenderTitle}"?`)) {
      setClarifications(prev => prev.filter(c => c.id !== clarification.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'tenderTitle',
      label: 'Tender Details',
      width: '25%',
      render: (value, row) => (
        <div className="tender-info">
          <div className="fw-semibold d-flex align-items-center">
            <MessageCircle size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">Tender ID: {row.tenderId}</small>
          <div className="question-preview">
            <small className="text-muted">
              Q: {row.question.length > 60 ? `${row.question.substring(0, 60)}...` : row.question}
            </small>
          </div>
        </div>
      )
    },
    {
      key: 'askedBy',
      label: 'Asked By',
      width: '15%',
      render: (value) => (
        <div className="asked-by">
          <span className="fw-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      width: '12%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => {
        const variants = {
          'PENDING': 'warning',
          'ANSWERED': 'success',
          'CLOSED': 'secondary'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '10%',
      render: (value) => {
        const variants = {
          'HIGH': 'danger',
          'MEDIUM': 'warning',
          'LOW': 'success'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'replies',
      label: 'Replies',
      width: '8%',
      render: (value) => (
        <div className="replies-count">
          <div className="fw-bold text-primary">{value.length}</div>
          <small className="text-muted">replies</small>
        </div>
      )
    },
    {
      key: 'askedDate',
      label: 'Asked Date',
      width: '12%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      key: 'lastReply',
      label: 'Last Reply',
      width: '12%',
      render: (value, row) => {
        if (row.replies && row.replies.length > 0) {
          const lastReply = row.replies[row.replies.length - 1];
          const date = new Date(lastReply.repliedDate);
          return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          });
        }
        return <span className="text-muted">No replies</span>;
      }
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'warning',
      ANSWERED: 'success',
      CLOSED: 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      HIGH: 'danger',
      MEDIUM: 'warning',
      LOW: 'info'
    }
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  const getCategoryBadge = (category) => {
    const variants = {
      TIMELINE: 'primary',
      SPECIFICATIONS: 'info',
      SCOPE: 'success',
      PRICING: 'warning',
      TECHNICAL: 'secondary'
    }
    return <Badge bg={variants[category] || 'secondary'}>{category}</Badge>
  }

  const categories = ['TIMELINE', 'SPECIFICATIONS', 'SCOPE', 'PRICING', 'TECHNICAL', 'OTHER']
  const priorities = ['HIGH', 'MEDIUM', 'LOW']

  const pendingCount = clarifications.filter((c) => c.status === 'PENDING').length
  const answeredCount = clarifications.filter((c) => c.status === 'ANSWERED').length
  const highPriorityOpen = clarifications.filter((c) => c.priority === 'HIGH').length

  const insightItems = useMemo(() => {
    const items = []
    items.push({
      title: `${pendingCount} clarification threads awaiting responses`,
      detail: `${answeredCount} answered of ${clarifications.length}, including ${highPriorityOpen} flagged high urgency.`,
      tone: pendingCount > 3 ? 'warning' : 'info'
    })
    if ((pendingCount || 0) > 4) {
      items.push({
        title: 'Queue depth may slow issuer feedback',
        detail: 'Route technical vs commercial clarifications to domain owners.',
        tone: 'warning'
      })
    }
    items.push({
      title: 'Keep responses auditable alongside tender versions',
      detail: 'Link each reply chronologically to solicitation amendments.',
      tone: 'info'
    })
    return items.slice(0, 3)
  }, [pendingCount, answeredCount, clarifications.length, highPriorityOpen])

  return (
    <>
      <ExecutiveCommandCenter
        className="clarifications-page"
        breadcrumbs={[
          { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
          { label: 'Q&A / clarifications', active: true }
        ]}
        onBack={() => navigate('/qualification-evaluation')}
        backLabel="Back to modules"
        title="Q&A & clarifications command center"
        description="Operate tender clarification traffic with SLA visibility and conversation-level tracking."
        heroMeta="Buyer–bidder discourse"
        outlookTitle="Clarifications outlook"
        outlookDescription={`${clarifications.length} threads tracked — ${pendingCount} awaiting response.`}
        outlookChips={[
          `${clarifications.length} threads`,
          `${pendingCount} pending`,
          `${answeredCount} answered`,
          `${highPriorityOpen} high priority`
        ]}
        insights={insightItems}
        kpiTitle="Conversation signal board"
        kpiMeta="Backlog concentration"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total threads"
                value={clarifications.length}
                hint="Captured Q&A"
                tone="intel"
                trend="Volume"
                icon={<MessageCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Pending"
                value={pendingCount}
                hint="Issuer response owed"
                tone={pendingCount > 3 ? 'warning' : 'success'}
                trend="Queue"
                icon={<Clock size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Answered"
                value={answeredCount}
                hint="Published responses"
                tone="success"
                trend="Throughput"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="High priority"
                value={highPriorityOpen}
                hint="Needs fast routing"
                tone={highPriorityOpen > 2 ? 'warning' : 'intel'}
                trend="Heat"
                icon={<HelpCircle size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Clarifications (${clarifications.length})`}
        tableActions={(
          <>
            <Badge bg="warning" text="dark" className="me-2">{pendingCount} pending</Badge>
            <Badge bg="success">{answeredCount} answered</Badge>
          </>
        )}
      >
        <DataTable
          data={clarifications}
          columns={columns}
          title={`Clarifications (${clarifications.length})`}
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewClarification}
          onEdit={handleEditClarification}
          onDelete={handleDeleteClarification}
          customActions={[
            {
              type: 'custom',
              label: 'Reply',
              onClick: (row) => {
                handleReply(row);
              }
            }
          ]}
          searchPlaceholder="Search clarifications..."
          emptyMessage="No clarifications found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        onTestFill={showModal ? () => setReplyText(dummyClarificationReply()) : undefined}
      >
          <Modal.Header closeButton>
            <Modal.Title>
              Reply to Clarification
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedClarification && (
              <div className="clarification-details">
                <div className="tender-info mb-3">
                  <h6>{selectedClarification.tenderId} - {selectedClarification.tenderTitle}</h6>
                  <p className="text-muted mb-2">
                    <strong>Question:</strong> {selectedClarification.question}
                  </p>
                  <p className="text-muted">
                    <strong>Asked by:</strong> {selectedClarification.askedBy} on{' '}
                    {new Date(selectedClarification.askedDate).toLocaleString()}
                  </p>
                </div>

                {selectedClarification.replies.length > 0 && (
                  <div className="existing-replies mb-3">
                    <h6>Previous Replies:</h6>
                    {selectedClarification.replies.map((reply, index) => (
                      <div key={reply.id} className="reply-item mb-2 p-2 bg-light rounded">
                        <div className="reply-text">{reply.reply}</div>
                        <small className="text-muted">
                          By {reply.repliedBy} on {new Date(reply.repliedDate).toLocaleString()}
                        </small>
                      </div>
                    ))}
                  </div>
                )}

                <Form onSubmit={handleSubmitReply}>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Reply</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Enter your reply..."
                      required
                    />
                  </Form.Group>
                </Form>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
            >
              <Send size={16} className="me-2" />
              Send Reply
            </Button>
          </Modal.Footer>
        </FormDrawerModal>

      {/* Details View Modal */}
      <Modal show={showViewModal} onHide={() => { setShowViewModal(false); setViewingClarification(null); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <MessageCircle size={20} className="me-2 text-primary" />
            Clarification Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingClarification && (
            <div className="clarification-view-details">
              <Row className="mb-3">
                <Col md={12}>
                  <h6>{viewingClarification.tenderId} - {viewingClarification.tenderTitle}</h6>
                  <p><strong>Asked By:</strong> {viewingClarification.askedBy} on {new Date(viewingClarification.askedDate).toLocaleString()}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Status:</strong> {getStatusBadge(viewingClarification.status)}
                </Col>
                <Col md={4}>
                  <strong>Priority:</strong> {getPriorityBadge(viewingClarification.priority)}
                </Col>
                <Col md={4}>
                  <strong>Category:</strong> {getCategoryBadge(viewingClarification.category)}
                </Col>
              </Row>
              <hr />
              <div className="p-3 border rounded bg-light mb-3">
                <h6 className="text-muted mb-2">Question Asked</h6>
                <p className="mb-0 text-dark fw-medium">{viewingClarification.question}</p>
              </div>
              
              {viewingClarification.replies && viewingClarification.replies.length > 0 ? (
                <div className="existing-replies mb-3">
                  <h6>Replies:</h6>
                  {viewingClarification.replies.map((reply) => (
                    <div key={reply.id} className="reply-item mb-2 p-2 border rounded bg-white">
                      <div className="reply-text text-dark">{reply.reply}</div>
                      <small className="text-muted">
                        By {reply.repliedBy} on {new Date(reply.repliedDate).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant="info" className="mb-0">No replies logged yet for this clarification request.</Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowViewModal(false); setViewingClarification(null); }}>
            Close
          </Button>
          {viewingClarification && viewingClarification.status === 'PENDING' && (
            <Button variant="primary" onClick={() => {
              setShowViewModal(false);
              handleReply(viewingClarification);
            }}>
              <Send size={16} className="me-2" />
              Reply Now
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Clarifications
