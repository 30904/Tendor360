import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Trash2, Eye, Bell, Settings, CheckCircle, AlertTriangle, Clock, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Notifications.scss'

const Notifications = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: 'Deadline Reminder: Highway Construction Bid',
        description: 'Reminder: Highway construction bid submission due in 2 days',
        type: 'Deadline',
        priority: 'High',
        status: 'Active',
        createdDate: '2024-01-20',
        scheduledDate: '2024-02-13',
        scheduledTime: '09:00',
        recipients: ['Project Team Alpha', 'Management Team'],
        triggerConditions: [
          '2 days before deadline',
          'Business hours (9 AM)',
          'Active tender status'
        ],
        aiOptimization: 'Optimal timing for team preparation',
        aiConfidence: 88,
        deliveryMethod: 'Email + SMS',
        frequency: 'Once'
      },
      {
        id: 2,
        title: 'Weekly Progress Update',
        description: 'Weekly progress update for all active tenders',
        type: 'Progress',
        priority: 'Medium',
        status: 'Active',
        createdDate: '2024-01-15',
        scheduledDate: '2024-02-12',
        scheduledTime: '08:00',
        recipients: ['All Project Teams', 'Stakeholders'],
        triggerConditions: [
          'Every Monday',
          '8 AM start time',
          'Active projects only'
        ],
        aiOptimization: 'Consistent weekly reporting schedule',
        aiConfidence: 92,
        deliveryMethod: 'Email',
        frequency: 'Weekly'
      },
      {
        id: 3,
        title: 'Critical Alert: Overdue Deadline',
        description: 'URGENT: Infrastructure project site visit is overdue',
        type: 'Alert',
        priority: 'Critical',
        status: 'Sent',
        createdDate: '2024-01-10',
        scheduledDate: '2024-02-08',
        scheduledTime: '10:00',
        recipients: ['Field Team Gamma', 'Project Manager'],
        triggerConditions: [
          'Deadline exceeded',
          'Immediate notification',
          'Critical priority items'
        ],
        aiOptimization: 'Immediate escalation for overdue items',
        aiConfidence: 95,
        deliveryMethod: 'Email + SMS + Phone',
        frequency: 'Immediate'
      }
    ])

    setStats({
      totalNotifications: 3,
      active: 2,
      sent: 1,
      critical: 1,
      aiConfidence: 92,
      avgDeliveryTime: '8:30 AM',
      totalRecipients: 8
    })
  }, [])

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification)
    setShowModal(true)
  }

  const handleToggleStatus = (notification) => {
    const newStatus = notification.status === 'Active' ? 'Paused' : 'Active'
    if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} "${notification.title}"?`)) {
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, status: newStatus } : n
      ))
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Paused': 'warning',
      'Sent': 'info',
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
      'Deadline': Clock,
      'Progress': CheckCircle,
      'Alert': AlertTriangle,
      'Reminder': Bell
    }
    return icons[type] || Bell
  }

  const insightItems = useMemo(() => {
    const total = stats.totalNotifications ?? 0
    const active = stats.active ?? 0
    const critical = stats.critical ?? 0
    const conf = stats.aiConfidence ?? 0
    const items = []
    items.push({
      title: `Notification coverage: ${total} rules`,
      detail: `${active} active; ${critical} critical lanes. ${stats.totalRecipients ?? 0} recipient touchpoints with ${conf}% AI confidence.`,
      tone: critical > 0 ? 'warning' : 'info'
    })
    items.push({
      title: `Average send window: ${stats.avgDeliveryTime || '—'}`,
      detail: 'AI suggests optimal cadence aligned to business hours.',
      tone: 'success'
    })
    items.push({
      title: 'Review escalation paths',
      detail: 'Confirm SMS and phone trees for breached deadlines remain staffed.',
      tone: 'info'
    })
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="notifications-page"
        breadcrumbs={[
          { label: 'Tender Calendar', onClick: () => navigate('/tender-calendar') },
          { label: 'Notifications', active: true }
        ]}
        onBack={() => navigate('/tender-calendar')}
        backLabel="Back to modules"
        title="Notification command center"
        description="Configure alerts and reminders for tender dates with AI timing recommendations."
        heroMeta="Tender Calendar · Alerting"
        outlookTitle="Programs & escalation outlook"
        outlookDescription={`${stats.totalNotifications ?? 0} programs · ${stats.active ?? 0} active · ${stats.critical ?? 0} critical · ${stats.aiConfidence ?? 0}% AI confidence.`}
        outlookChips={[
          `${stats.totalNotifications ?? 0} total`,
          `${stats.active ?? 0} active`,
          `${stats.sent ?? 0} sent`,
          `${stats.critical ?? 0} critical`
        ]}
        insights={insightItems}
        kpiTitle="Alert signal board"
        kpiMeta="Coverage, urgency, modeling"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total notifications"
                value={stats.totalNotifications ?? 0}
                hint="Configured workflows"
                tone="intel"
                trend="Programs"
                icon={<Bell size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active"
                value={stats.active ?? 0}
                hint="Publishing now"
                tone="success"
                trend="Live"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Critical"
                value={stats.critical ?? 0}
                hint="Escalations"
                tone={(stats.critical ?? 0) > 0 ? 'danger' : 'success'}
                trend="Exposure"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Send-time optimization"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Notification registry"
        tableActions={
          <div className="d-flex flex-wrap gap-2 justify-content-end">
            <Button variant="primary" size="sm">
              <Plus size={16} className="me-2" />
              New notification
            </Button>
            <Button variant="outline-secondary" size="sm">
              <Settings size={16} className="me-2" />
              Settings
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
                placeholder="Search notifications..."
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
                        <th>Notification Details</th>
                        <th>Type</th>
                        <th>Scheduled</th>
                        <th>Recipients</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.filter(notification => 
                        !searchTerm || 
                        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        notification.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        notification.description.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((notification) => {
                        const TypeIcon = getTypeIcon(notification.type)
                        return (
                          <tr key={notification.id}>
                            <td>
                              <div className="notification-info">
                                <h6 className="mb-1">{notification.title}</h6>
                                <p className="text-muted mb-1">{notification.description}</p>
                                <small className="text-muted">
                                  Created: {notification.createdDate} • {notification.deliveryMethod} • {notification.frequency}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="type-info">
                                <div className="d-flex align-items-center">
                                  <TypeIcon size={16} className="me-1" />
                                  <span>{notification.type}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="scheduled-info">
                                <div className="fw-medium">{notification.scheduledDate}</div>
                                <small className="text-muted">{notification.scheduledTime}</small>
                              </div>
                            </td>
                            <td>
                              <div className="recipients-info">
                                <div className="fw-medium">{notification.recipients.length} recipients</div>
                                <small className="text-muted">
                                  {notification.recipients.slice(0, 2).join(', ')}
                                  {notification.recipients.length > 2 && '...'}
                                </small>
                              </div>
                            </td>
                            <td>{getPriorityBadge(notification.priority)}</td>
                            <td>{getStatusBadge(notification.status)}</td>
                            <td>
                              <div className="action-buttons">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => handleViewNotification(notification)}
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
                                  variant={notification.status === 'Active' ? 'outline-warning' : 'outline-success'}
                                  size="sm"
                                  onClick={() => handleToggleStatus(notification)}
                                >
                                  <Settings size={14} />
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
              <Bell size={20} className="me-2" />
              Notification Details - {selectedNotification?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedNotification && (
              <div className="notification-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedNotification.type}</p>
                    <p><strong>Priority:</strong> {selectedNotification.priority}</p>
                    <p><strong>Status:</strong> {selectedNotification.status}</p>
                    <p><strong>Created:</strong> {selectedNotification.createdDate}</p>
                    <p><strong>Frequency:</strong> {selectedNotification.frequency}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Scheduling Details</h6>
                    <p><strong>Scheduled Date:</strong> {selectedNotification.scheduledDate}</p>
                    <p><strong>Scheduled Time:</strong> {selectedNotification.scheduledTime}</p>
                    <p><strong>Delivery Method:</strong> {selectedNotification.deliveryMethod}</p>
                    <p><strong>Recipients:</strong> {selectedNotification.recipients.length}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedNotification.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={6}>
                    <h6>Recipients</h6>
                    <ul className="recipients-list">
                      {selectedNotification.recipients.map((recipient, index) => (
                        <li key={index} className="recipient-item">
                          <CheckCircle size={14} className="me-2 text-success" />
                          {recipient}
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>Trigger Conditions</h6>
                    <ul className="conditions-list">
                      {selectedNotification.triggerConditions.map((condition, index) => (
                        <li key={index} className="condition-item">
                          <AlertTriangle size={14} className="me-2 text-primary" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Assessment & Optimization</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Optimization:</strong> {selectedNotification.aiOptimization}
                    </Alert>
                    <Alert variant="success">
                      <CheckCircle size={16} className="me-2" />
                      <strong>Confidence Level:</strong> {selectedNotification.aiConfidence}% based on recipient behavior and optimal timing analysis
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
              Edit Notification
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default Notifications
