import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Alert } from 'react-bootstrap'
import { Plus, Edit, Trash2, Eye, Bell, Mail, MessageSquare, Brain, CheckCircle, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './NotificationSettings.scss'

const NotificationSettings = () => {
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
        name: 'Tender Deadline Alerts',
        description: 'Notifications for upcoming tender deadlines',
        type: 'Email',
        status: 'Active',
        frequency: 'Daily',
        recipients: ['Project Managers', 'Team Leads'],
        aiOptimization: 'Optimal timing for deadline awareness',
        aiConfidence: 92,
        priority: 'High',
        lastSent: '2024-02-10 09:00',
        nextScheduled: '2024-02-11 09:00'
      },
      {
        id: 2,
        name: 'System Status Updates',
        description: 'System maintenance and status notifications',
        type: 'SMS',
        status: 'Active',
        frequency: 'As Needed',
        recipients: ['System Admins', 'IT Team'],
        aiOptimization: 'Critical system alerts for immediate attention',
        aiConfidence: 95,
        priority: 'Critical',
        lastSent: '2024-02-10 14:30',
        nextScheduled: 'As Needed'
      },
      {
        id: 3,
        name: 'Weekly Reports',
        description: 'Weekly summary reports and analytics',
        type: 'Email',
        status: 'Active',
        frequency: 'Weekly',
        recipients: ['Management', 'Stakeholders'],
        aiOptimization: 'Weekly reporting for management oversight',
        aiConfidence: 88,
        priority: 'Medium',
        lastSent: '2024-02-09 08:00',
        nextScheduled: '2024-02-16 08:00'
      },
      {
        id: 4,
        name: 'Document Approval Requests',
        description: 'Notifications for document approval workflows',
        type: 'In-App',
        status: 'Active',
        frequency: 'Immediate',
        recipients: ['Approvers', 'Document Owners'],
        aiOptimization: 'Immediate notifications for workflow efficiency',
        aiConfidence: 94,
        priority: 'High',
        lastSent: '2024-02-10 16:45',
        nextScheduled: 'Immediate'
      },
      {
        id: 5,
        name: 'Budget Alerts',
        description: 'Budget threshold and spending alerts',
        type: 'Email',
        status: 'Active',
        frequency: 'Daily',
        recipients: ['Finance Team', 'Project Managers'],
        aiOptimization: 'Daily budget monitoring for cost control',
        aiConfidence: 90,
        priority: 'High',
        lastSent: '2024-02-10 10:00',
        nextScheduled: '2024-02-11 10:00'
      },
      {
        id: 6,
        name: 'Compliance Reminders',
        description: 'Regulatory compliance deadline reminders',
        type: 'SMS',
        status: 'Inactive',
        frequency: 'Weekly',
        recipients: ['Compliance Officers', 'Legal Team'],
        aiOptimization: 'Weekly compliance monitoring',
        aiConfidence: 85,
        priority: 'Medium',
        lastSent: '2024-02-03 09:00',
        nextScheduled: '2024-02-17 09:00'
      },
      {
        id: 7,
        name: 'User Activity Summary',
        description: 'Daily user activity and system usage reports',
        type: 'Email',
        status: 'Active',
        frequency: 'Daily',
        recipients: ['System Admins', 'IT Managers'],
        aiOptimization: 'Daily activity monitoring for security',
        aiConfidence: 87,
        priority: 'Medium',
        lastSent: '2024-02-10 18:00',
        nextScheduled: '2024-02-11 18:00'
      },
      {
        id: 8,
        name: 'Emergency Alerts',
        description: 'Critical system and security emergency notifications',
        type: 'SMS',
        status: 'Active',
        frequency: 'Immediate',
        recipients: ['Emergency Response Team', 'IT Directors'],
        aiOptimization: 'Immediate alerts for critical issues',
        aiConfidence: 98,
        priority: 'Critical',
        lastSent: '2024-01-28 03:15',
        nextScheduled: 'As Needed'
      }
    ])

    setStats({
      totalNotifications: 8,
      active: 7,
      types: 3,
      aiConfidence: 91,
      totalRecipients: 18,
      avgFrequency: 'Daily',
      criticalAlerts: 2
    })
  }, [])

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification)
    setShowModal(true)
  }

  const handleToggleNotification = (notification) => {
    const newStatus = notification.status === 'Active' ? 'Inactive' : 'Active'
    if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} "${notification.name}"?`)) {
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, status: newStatus } : n
      ))
    }
  }

  const handleEditNotification = (notification) => {
    console.log('Edit notification:', notification)
    // Navigate to edit notification or open edit modal
  }

  const handleDeleteNotification = (notification) => {
    if (window.confirm(`Are you sure you want to delete notification "${notification.name}"?`)) {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Notification Details',
      width: '25%',
      render: (value, row) => (
        <div className="notification-info">
          <div className="fw-semibold d-flex align-items-center">
            <Bell size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      width: '10%',
      render: (value) => {
        const typeIcons = {
          'Email': Mail,
          'SMS': MessageSquare,
          'In-App': Bell
        }
        const Icon = typeIcons[value] || Bell
        return (
          <div className="d-flex align-items-center">
            <Icon size={16} className="me-1" />
            <Badge bg="info">{value}</Badge>
          </div>
        )
      }
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'frequency',
      label: 'Frequency',
      width: '12%',
      render: (value) => (
        <Badge bg="secondary">{value}</Badge>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '10%',
      render: (value) => getPriorityBadge(value)
    },
    {
      key: 'recipients',
      label: 'Recipients',
      width: '15%',
      render: (value) => (
        <div className="recipients-info">
          <div className="fw-medium">{value.length} groups</div>
          <small className="text-muted">
            {value.slice(0, 2).join(', ')}
            {value.length > 2 && ` +${value.length - 2} more`}
          </small>
        </div>
      )
    },
    {
      key: 'lastSent',
      label: 'Last Sent',
      width: '12%',
      render: (value) => {
        if (value === 'Never') return <span className="text-muted">Never</span>
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    {
      key: 'nextScheduled',
      label: 'Next Scheduled',
      width: '12%',
      render: (value) => {
        if (value === 'As Needed' || value === 'Immediate') {
          return <Badge bg="warning">{value}</Badge>
        }
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Pending': 'warning',
      'Error': 'danger'
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

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalNotifications ?? 0) > 0) {
      items.push({
        title: `${stats.totalNotifications} notification programs · ${stats.active} active`,
        detail: `${stats.totalRecipients} recipients · avg frequency ${stats.avgFrequency} · ${stats.aiConfidence}% AI confidence.`,
        tone: 'info'
      })
    }
    if ((stats.criticalAlerts ?? 0) > 0) {
      items.push({
        title: `${stats.criticalAlerts} critical alert channel(s)`,
        detail: 'Validate throttles and escalation paths for on-call coverage.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Notification programs',
        detail: 'Configure channels to activate delivery intelligence.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="notification-settings-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'Notification Settings', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="Notifications command center"
        description="Configure notification preferences and delivery methods with AI optimization."
        heroMeta="Channels, throttles, routing"
        outlookTitle="Engagement outlook"
        outlookDescription={`${stats.totalNotifications ?? 0} programs · ${stats.active ?? 0} active · ${stats.totalRecipients ?? 0} recipients.`}
        outlookChips={[
          `${stats.totalNotifications ?? 0} total`,
          `${stats.active ?? 0} active`,
          `${stats.totalRecipients ?? 0} recipients`,
          `${stats.aiConfidence ?? 0}% AI`
        ]}
        insights={insightItems}
        kpiTitle="Delivery signal board"
        kpiMeta="Reach, activation, and tuning confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total notifications"
                value={stats.totalNotifications ?? 0}
                hint="Programs configured"
                tone="intel"
                trend="Catalog"
                icon={<Bell size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active"
                value={stats.active ?? 0}
                hint="Currently firing"
                tone="success"
                trend="Live"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Recipients"
                value={stats.totalRecipients ?? 0}
                hint="Mapped audiences"
                tone="intel"
                trend="Reach"
                icon={<Mail size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Tuning quality"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Notification configuration"
        tableActions={
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              New Notification
            </Button>
            <Button variant="outline-secondary">
              <Settings size={16} className="me-2" />
              Settings
            </Button>
          </>
        }
      >
        <DataTable
          data={notifications}
          columns={columns}
          title="Notification Configuration"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewNotification}
          onEdit={handleEditNotification}
          onDelete={handleDeleteNotification}
          customActions={[
            {
              type: 'custom',
              label: 'Toggle Status',
              onClick: (row) => handleToggleNotification(row)
            }
          ]}
          searchPlaceholder="Search notifications..."
          emptyMessage="No notifications found"
          loading={false}
        />
      </ExecutiveCommandCenter>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Bell size={20} className="me-2" />
              Notification Details - {selectedNotification?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedNotification && (
              <div className="notification-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedNotification.type}</p>
                    <p><strong>Frequency:</strong> {selectedNotification.frequency}</p>
                    <p><strong>Status:</strong> {selectedNotification.status}</p>
                    <p><strong>Priority:</strong> {selectedNotification.priority}</p>
                    <p><strong>Recipients:</strong> {selectedNotification.recipients.length}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Schedule Information</h6>
                    <p><strong>Last Sent:</strong> {selectedNotification.lastSent}</p>
                    <p><strong>Next Scheduled:</strong> {selectedNotification.nextScheduled}</p>
                    <p><strong>AI Confidence:</strong> {selectedNotification.aiConfidence}%</p>
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
                  <Col>
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

export default NotificationSettings
