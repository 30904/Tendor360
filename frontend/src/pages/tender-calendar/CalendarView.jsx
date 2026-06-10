import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Trash2, Eye, Calendar, Clock, MapPin, Users, Bell, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './CalendarView.scss'

const CalendarView = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [stats, setStats] = useState({})
  const [viewMode, setViewMode] = useState('month')

  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: 'Tender Submission Deadline',
        description: 'Final submission deadline for highway construction project',
        type: 'Deadline',
        startDate: '2024-01-25',
        endDate: '2024-01-25',
        startTime: '17:00',
        endTime: '17:00',
        location: 'Online Portal',
        attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
        priority: 'High',
        status: 'Upcoming',
        tenderId: 'TEN-2024-001',
        reminder: '1 day before',
        color: 'danger'
      },
      {
        id: 2,
        title: 'Evaluation Committee Meeting',
        description: 'Review and evaluation of submitted tenders',
        type: 'Meeting',
        startDate: '2024-01-28',
        endDate: '2024-01-28',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Conference Room A',
        attendees: ['Sarah Wilson', 'David Brown', 'Lisa Garcia'],
        priority: 'Medium',
        status: 'Scheduled',
        tenderId: 'TEN-2024-001',
        reminder: '30 minutes before',
        color: 'primary'
      },
      {
        id: 3,
        title: 'Client Presentation',
        description: 'Present final proposal to client stakeholders',
        type: 'Presentation',
        startDate: '2024-01-30',
        endDate: '2024-01-30',
        startTime: '14:00',
        endTime: '16:00',
        location: 'Client Office',
        attendees: ['John Doe', 'Jane Smith'],
        priority: 'High',
        status: 'Scheduled',
        tenderId: 'TEN-2024-002',
        reminder: '1 hour before',
        color: 'warning'
      },
      {
        id: 4,
        title: 'Document Review Session',
        description: 'Review and validate all tender documents',
        type: 'Review',
        startDate: '2024-01-22',
        endDate: '2024-01-22',
        startTime: '09:00',
        endTime: '11:00',
        location: 'Document Center',
        attendees: ['Mike Johnson', 'Sarah Wilson'],
        priority: 'Medium',
        status: 'Completed',
        tenderId: 'TEN-2024-001',
        reminder: '15 minutes before',
        color: 'success'
      }
    ])

    setStats({
      totalEvents: 4,
      upcoming: 2,
      completed: 1,
      scheduled: 1,
      highPriority: 2,
      todayEvents: 1
    })
  }, [])

  const handleViewEvent = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Upcoming': 'warning',
      'Scheduled': 'info',
      'Completed': 'success',
      'Cancelled': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'info'
    }
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Deadline': return <Clock size={16} />
      case 'Meeting': return <Users size={16} />
      case 'Presentation': return <Eye size={16} />
      case 'Review': return <Edit size={16} />
      default: return <Calendar size={16} />
    }
  }

  const insightItems = useMemo(() => {
    const total = stats.totalEvents ?? 0
    const upcoming = stats.upcoming ?? 0
    const today = stats.todayEvents ?? 0
    const hp = stats.highPriority ?? 0
    const items = []
    if (total || today || upcoming) {
      items.push({
        title: `Today: ${today} event(s); ${upcoming} upcoming`,
        detail: `${total} total tracked on the tender calendar.`,
        tone: 'info'
      })
    }
    if (hp > 0) {
      items.push({
        title: 'High priority on the runway',
        detail: `${hp} high-priority event(s); confirm owners and reminders before deadlines.`,
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Calendar readiness',
        detail: 'Seed events to activate timeline summaries and KPIs.',
        tone: 'info'
      })
    } else {
      items.push({
        title: 'Reminders',
        detail: 'Set alerts for submissions and committee meetings ahead of stakeholder reviews.',
        tone: 'success'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="calendar-view-page"
        breadcrumbs={[
          { label: 'Tender Calendar', onClick: () => navigate('/tender-calendar') },
          { label: 'Calendar View', active: true }
        ]}
        onBack={() => navigate('/tender-calendar')}
        backLabel="Back to modules"
        title="Calendar command center"
        description="View and manage tender-related events, milestones, and submission deadlines."
        heroMeta="Tender Calendar · Operational view"
        outlookTitle="Schedule outlook"
        outlookDescription={`${stats.todayEvents ?? 0} today · ${stats.upcoming ?? 0} upcoming · ${stats.totalEvents ?? 0} total events.`}
        outlookChips={[
          `${stats.totalEvents ?? 0} total`,
          `${stats.upcoming ?? 0} upcoming`,
          `${stats.scheduled ?? 0} scheduled`,
          `${stats.highPriority ?? 0} high priority`
        ]}
        insights={insightItems}
        kpiTitle="Calendar signal board"
        kpiMeta="Volume, pacing, and risk signals"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total events"
                value={stats.totalEvents ?? 0}
                hint="Across the horizon"
                tone="intel"
                trend="Workload"
                icon={<Calendar size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Upcoming"
                value={stats.upcoming ?? 0}
                hint="Ahead in the funnel"
                tone="primary"
                trend="Soon"
                icon={<Clock size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Scheduled"
                value={stats.scheduled ?? 0}
                hint="Committed slots"
                tone="intel"
                trend="Committed"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="High priority"
                value={stats.highPriority ?? 0}
                hint="Elevated visibility"
                tone={(stats.highPriority ?? 0) > 0 ? 'warning' : 'success'}
                trend="Attention"
                icon={<Bell size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Calendar events"
        tableActions={
          <div className="d-flex flex-wrap justify-content-end align-items-center gap-2">
            <Button
              variant={viewMode === 'month' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
            <Button variant="primary" size="sm">
              <Plus size={16} className="me-2" />
              New event
            </Button>
            <Button variant="outline-secondary" size="sm">
              <Filter size={16} className="me-2" />
              Filter
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
                placeholder="Search events..."
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
                        <th>Location</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Attendees</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.filter(event => 
                        !searchTerm || 
                        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.location.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((event) => (
                        <tr key={event.id}>
                          <td>
                            <div className="event-info">
                              <h6 className="mb-1">{event.title}</h6>
                              <p className="text-muted mb-1">{event.description}</p>
                              <small className="text-muted">
                                {event.tenderId} • Reminder: {event.reminder}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="event-type">
                              <div className="d-flex align-items-center">
                                {getTypeIcon(event.type)}
                                <span className="ms-1">{event.type}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="datetime-info">
                              <div className="d-flex align-items-center">
                                <Calendar size={16} className="me-1" />
                                <span>{event.startDate}</span>
                              </div>
                              <div className="d-flex align-items-center">
                                <Clock size={16} className="me-1" />
                                <span>{event.startTime} - {event.endTime}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="location-info">
                              <div className="d-flex align-items-center">
                                <MapPin size={16} className="me-1" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </td>
                          <td>{getPriorityBadge(event.priority)}</td>
                          <td>{getStatusBadge(event.status)}</td>
                          <td>
                            <div className="attendees-info">
                              <div className="d-flex align-items-center">
                                <Users size={16} className="me-1" />
                                <span>{event.attendees.length} attendees</span>
                              </div>
                            </div>
                          </td>
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
                              >
                                <Edit size={14} />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                    <p><strong>Priority:</strong> {selectedEvent.priority}</p>
                    <p><strong>Status:</strong> {selectedEvent.status}</p>
                    <p><strong>Tender ID:</strong> {selectedEvent.tenderId}</p>
                    <p><strong>Reminder:</strong> {selectedEvent.reminder}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Schedule Details</h6>
                    <p><strong>Date:</strong> {selectedEvent.startDate}</p>
                    <p><strong>Time:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                    <p><strong>Location:</strong> {selectedEvent.location}</p>
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
                  <Col>
                    <h6>Attendees</h6>
                    <div className="attendees-list">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <Badge key={index} bg="info" className="me-2 mb-2">
                          {attendee}
                        </Badge>
                      ))}
                    </div>
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

export default CalendarView