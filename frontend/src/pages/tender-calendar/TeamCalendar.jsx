import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Trash2, Eye, Users, Calendar, CheckCircle, AlertTriangle, Clock, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './TeamCalendar.scss'

const TeamCalendar = () => {
  const navigate = useNavigate()
  const [teamEvents, setTeamEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setTeamEvents([
      {
        id: 1,
        title: 'Weekly Team Standup',
        description: 'Weekly standup meeting for all project teams',
        type: 'Meeting',
        startDate: '2024-02-12',
        startTime: '09:00',
        endTime: '10:00',
        attendees: ['Project Team Alpha', 'Project Team Beta', 'Management Team'],
        location: 'Conference Room A',
        organizer: 'Project Manager',
        status: 'Scheduled',
        priority: 'High',
        aiOptimization: 'Optimal timing for team coordination',
        aiConfidence: 90,
        recurring: 'Weekly',
        category: 'Team Meeting'
      },
      {
        id: 2,
        title: 'Tender Review Session',
        description: 'Review session for highway construction tender',
        type: 'Review',
        startDate: '2024-02-14',
        startTime: '14:00',
        endTime: '16:00',
        attendees: ['Technical Team', 'Legal Team', 'Finance Team'],
        location: 'Meeting Room B',
        organizer: 'Technical Lead',
        status: 'Scheduled',
        priority: 'Critical',
        aiOptimization: 'Strategic timing before submission deadline',
        aiConfidence: 95,
        recurring: 'One-time',
        category: 'Tender Review'
      },
      {
        id: 3,
        title: 'Client Presentation Prep',
        description: 'Preparation session for client presentation',
        type: 'Preparation',
        startDate: '2024-02-15',
        startTime: '10:00',
        endTime: '12:00',
        attendees: ['Presentation Team', 'Subject Matter Experts'],
        location: 'Presentation Room',
        organizer: 'Business Development',
        status: 'In Progress',
        priority: 'Medium',
        aiOptimization: 'Adequate preparation time allocated',
        aiConfidence: 85,
        recurring: 'One-time',
        category: 'Presentation'
      }
    ])

    setStats({
      totalEvents: 3,
      scheduled: 2,
      inProgress: 1,
      critical: 1,
      aiConfidence: 90,
      totalAttendees: 12,
      avgDuration: '1.5 hours'
    })
  }, [])

  const handleViewEvent = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const handleJoinEvent = (event) => {
    if (window.confirm(`Are you sure you want to join "${event.title}"?`)) {
      setTeamEvents(prev => prev.map(e => 
        e.id === event.id ? { ...e, status: 'In Progress' } : e
      ))
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Scheduled': 'success',
      'In Progress': 'primary',
      'Completed': 'info',
      'Cancelled': 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      'Critical': 'danger',
      'High': 'warning',
      'Medium': 'primary',
      'Low': 'secondary'
    }
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Meeting': Users,
      'Review': CheckCircle,
      'Preparation': AlertTriangle,
      'Presentation': Calendar
    }
    return icons[type] || Calendar
  }

  const insightItems = useMemo(() => {
    const total = stats.totalEvents ?? 0
    const attendees = stats.totalAttendees ?? 0
    const crit = stats.critical ?? 0
    const conf = stats.aiConfidence ?? 0
    const avg = stats.avgDuration || ''
    const items = []
    items.push({
      title: `Team throughput: ${total} sessions`,
      detail: `${attendees} attendee-hours engaged; avg duration ${avg}. ${crit} critical block(s).`,
      tone: crit > 0 ? 'warning' : 'info'
    })
    items.push({
      title: 'Scheduling cohesion',
      detail: `${conf}% AI confidence in proposed slots vs. workloads.`,
      tone: 'success'
    })
    items.push({
      title: 'Next actions',
      detail: 'Reconcile overlaps before tender review freezes.',
      tone: 'info'
    })
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="team-calendar-page"
        breadcrumbs={[
          { label: 'Tender Calendar', onClick: () => navigate('/tender-calendar') },
          { label: 'Team Calendar', active: true }
        ]}
        onBack={() => navigate('/tender-calendar')}
        backLabel="Back to modules"
        title="Team collaboration command center"
        description="Shared calendar across squads with AI-assisted scheduling cohesion."
        heroMeta="Tender Calendar · Collaboration"
        outlookTitle="Collective horizon"
        outlookDescription={`${stats.totalEvents ?? 0} sessions · ${stats.totalAttendees ?? 0} attendees · ${stats.scheduled ?? 0} scheduled · avg ${stats.avgDuration || '—'} · ${stats.aiConfidence ?? 0}% AI confidence.`}
        outlookChips={[
          `${stats.totalEvents ?? 0} events`,
          `${stats.scheduled ?? 0} scheduled`,
          `${stats.inProgress ?? 0} in progress`,
          `${stats.critical ?? 0} critical`
        ]}
        insights={insightItems}
        kpiTitle="Collaboration signal board"
        kpiMeta="Attendance, duration, model fit"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Team events"
                value={stats.totalEvents ?? 0}
                hint="Coordinated milestones"
                tone="intel"
                trend="Workload"
                icon={<Calendar size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total attendees"
                value={stats.totalAttendees ?? 0}
                hint="Unique engagements"
                tone="primary"
                trend="Reach"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg duration"
                displayValue={stats.avgDuration || '—'}
                value={0}
                hint="Per session"
                tone="intel"
                trend="Cadence"
                icon={<Clock size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Slot optimization"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Team event registry"
        tableActions={
          <div className="d-flex flex-wrap gap-2 justify-content-end">
            <Button variant="primary" size="sm">
              <Plus size={16} className="me-2" />
              New event
            </Button>
            <Button variant="outline-secondary" size="sm">
              <Calendar size={16} className="me-2" />
              View calendar
            </Button>
          </div>
        }
      >
        <Row className="mb-3">
          <Col md={12} lg={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search team events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
        </Row>
        <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Event Details</th>
                        <th>Type</th>
                        <th>Date & Time</th>
                        <th>Attendees</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamEvents.filter(event => 
                        !searchTerm || 
                        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((event) => {
                        const TypeIcon = getTypeIcon(event.type)
                        return (
                          <tr key={event.id}>
                            <td>
                              <div className="event-info">
                                <h6 className="mb-1">{event.title}</h6>
                                <p className="text-muted mb-1">{event.description}</p>
                                <small className="text-muted">
                                  {event.location} • Organized by: {event.organizer} • {event.recurring}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="type-info">
                                <div className="d-flex align-items-center">
                                  <TypeIcon size={16} className="me-1" />
                                  <span>{event.type}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="datetime-info">
                                <div className="fw-medium">{event.startDate}</div>
                                <small className="text-muted">{event.startTime} - {event.endTime}</small>
                              </div>
                            </td>
                            <td>
                              <div className="attendees-info">
                                <div className="fw-medium">{event.attendees.length} attendees</div>
                                <small className="text-muted">
                                  {event.attendees.slice(0, 2).join(', ')}
                                  {event.attendees.length > 2 && '...'}
                                </small>
                              </div>
                            </td>
                            <td>{getPriorityBadge(event.priority)}</td>
                            <td>{getStatusBadge(event.status)}</td>
                            <td>
                              <div className="action-buttons">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => handleViewEvent(event)}
                                >
                                  <Eye size={14} />
                                </Button>
                                <Button 
                                  variant="outline-success" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => handleJoinEvent(event)}
                                >
                                  <Users size={14} />
                                </Button>
                                <Button 
                                  variant="outline-warning" 
                                  size="sm"
                                >
                                  <Edit size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
        </div>
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Calendar size={20} className="me-2" />
              Event Details - {selectedEvent?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEvent && (
              <div className="event-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedEvent.type}</p>
                    <p><strong>Category:</strong> {selectedEvent.category}</p>
                    <p><strong>Priority:</strong> {selectedEvent.priority}</p>
                    <p><strong>Status:</strong> {selectedEvent.status}</p>
                    <p><strong>Recurring:</strong> {selectedEvent.recurring}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Schedule Details</h6>
                    <p><strong>Date:</strong> {selectedEvent.startDate}</p>
                    <p><strong>Time:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                    <p><strong>Location:</strong> {selectedEvent.location}</p>
                    <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
                    <p><strong>Attendees:</strong> {selectedEvent.attendees.length}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedEvent.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={6}>
                    <h6>Attendees</h6>
                    <ul className="attendees-list">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <li key={index} className="attendee-item">
                          <Users size={14} className="me-2 text-primary" />
                          {attendee}
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>AI Assessment & Optimization</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Optimization:</strong> {selectedEvent.aiOptimization}
                    </Alert>
                    <Alert variant="success">
                      <CheckCircle size={16} className="me-2" />
                      <strong>Confidence Level:</strong> {selectedEvent.aiConfidence}% based on team availability and optimal scheduling analysis
                    </Alert>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary">
              <Edit size={16} className="me-2" />
              Edit Event
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default TeamCalendar
