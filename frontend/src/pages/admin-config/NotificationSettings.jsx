import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Alert, Form } from 'react-bootstrap'
import { Plus, Edit, Bell, Mail, MessageSquare, Brain, CheckCircle, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import AdminWorkspaceModal from '../../components/admin/AdminWorkspaceModal'
import { showToast } from '../../utils/toast'
import { loadAdminConfig, saveAdminConfig } from '../../utils/adminConfigStorage'
import './NotificationSettings.scss'

const GLOBAL_PREFS_KEY = 'tender360_notification_global_prefs'

const DEFAULT_GLOBAL_PREFS = {
  emailEnabled: true,
  smsEnabled: true,
  inAppEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  defaultSenderEmail: 'notifications@tender360.com',
  digestMode: 'immediate'
}

const NOTIFICATION_FORM_FIELDS = [
  { name: 'name', label: 'Name', required: true },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    required: true,
    options: [
      { value: 'Email', label: 'Email' },
      { value: 'SMS', label: 'SMS' },
      { value: 'In-App', label: 'In-App' }
    ]
  },
  { name: 'frequency', label: 'Frequency', required: true, placeholder: 'Daily, Weekly, Immediate...' },
  { name: 'description', label: 'Description', type: 'textarea', required: true }
]

const NotificationSettings = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [stats, setStats] = useState({})
  const [showGlobalSettings, setShowGlobalSettings] = useState(false)
  const [globalPrefs, setGlobalPrefs] = useState(DEFAULT_GLOBAL_PREFS)

  useEffect(() => {
    setGlobalPrefs(loadAdminConfig(GLOBAL_PREFS_KEY, DEFAULT_GLOBAL_PREFS))
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
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, status: newStatus } : n))
      )
    }
  }

  const handleEditNotification = (notification) => {
    setEditingItem(notification)
    setShowFormModal(true)
  }

  const handleNewNotification = () => {
    setEditingItem(null)
    setShowFormModal(true)
  }

  const handleCreateNotification = (formData) => {
    if (editingItem) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === editingItem.id
            ? { ...n, name: formData.name, type: formData.type, frequency: formData.frequency, description: formData.description }
            : n
        )
      )
      showToast.success(`${formData.name} updated`)
    } else {
      const newNotification = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        status: 'Active',
        frequency: formData.frequency,
        recipients: [],
        aiOptimization: 'Pending AI analysis',
        aiConfidence: 80,
        priority: 'Medium',
        lastSent: 'Never',
        nextScheduled: 'As Needed'
      }
      setNotifications((prev) => [...prev, newNotification])
      setStats((prev) => ({
        ...prev,
        totalNotifications: (prev.totalNotifications ?? 0) + 1,
        active: (prev.active ?? 0) + 1
      }))
      showToast.success(`${formData.name} created`)
    }
    setShowFormModal(false)
    setEditingItem(null)
  }

  const handleDeleteNotification = (notification) => {
    if (window.confirm(`Are you sure you want to delete notification "${notification.name}"?`)) {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
    }
  }

  const handleGlobalPrefChange = (field, value) => {
    setGlobalPrefs((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveGlobalPrefs = () => {
    saveAdminConfig(GLOBAL_PREFS_KEY, globalPrefs)
    setShowGlobalSettings(false)
    showToast.success('Global notification preferences saved')
  }

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
          Email: Mail,
          SMS: MessageSquare,
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
      render: (value) => <Badge bg="secondary">{value}</Badge>
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
        const date = new Date(value)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
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
        const date = new Date(value)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      Active: 'success',
      Inactive: 'secondary',
      Pending: 'warning',
      Error: 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      Critical: 'danger',
      High: 'warning',
      Medium: 'primary',
      Low: 'secondary'
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
            <Button variant="primary" className="me-2" onClick={handleNewNotification}>
              <Plus size={16} className="me-2" />
              New Notification
            </Button>
            <Button variant="outline-secondary" onClick={() => setShowGlobalSettings(true)}>
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
                  <p>
                    <strong>Type:</strong> {selectedNotification.type}
                  </p>
                  <p>
                    <strong>Frequency:</strong> {selectedNotification.frequency}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedNotification.status}
                  </p>
                  <p>
                    <strong>Priority:</strong> {selectedNotification.priority}
                  </p>
                  <p>
                    <strong>Recipients:</strong> {selectedNotification.recipients.length}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Schedule Information</h6>
                  <p>
                    <strong>Last Sent:</strong> {selectedNotification.lastSent}
                  </p>
                  <p>
                    <strong>Next Scheduled:</strong> {selectedNotification.nextScheduled}
                  </p>
                  <p>
                    <strong>AI Confidence:</strong> {selectedNotification.aiConfidence}%
                  </p>
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
                    <strong>Confidence Level:</strong> {selectedNotification.aiConfidence}% based on
                    recipient behavior and optimal timing analysis
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
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false)
              handleEditNotification(selectedNotification)
            }}
          >
            <Edit size={16} className="me-2" />
            Edit Notification
          </Button>
        </Modal.Footer>
      </Modal>

      <AdminWorkspaceModal
        show={showFormModal}
        onHide={() => {
          setShowFormModal(false)
          setEditingItem(null)
        }}
        title={editingItem ? `Edit Notification — ${editingItem.name}` : 'New Notification'}
        description={
          editingItem
            ? 'Update notification channel and delivery settings.'
            : 'Create a new notification program.'
        }
        submitLabel={editingItem ? 'Save changes' : 'Create notification'}
        fields={NOTIFICATION_FORM_FIELDS}
        initialValues={
          editingItem
            ? {
                name: editingItem.name,
                type: editingItem.type,
                frequency: editingItem.frequency,
                description: editingItem.description
              }
            : {}
        }
        onSubmit={handleCreateNotification}
      />

      <Modal show={showGlobalSettings} onHide={() => setShowGlobalSettings(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Settings size={20} className="me-2" />
            Global Notification Preferences
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Check
                type="switch"
                id="pref-email"
                label="Email notifications enabled"
                checked={globalPrefs.emailEnabled}
                onChange={(e) => handleGlobalPrefChange('emailEnabled', e.target.checked)}
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="pref-sms"
                label="SMS notifications enabled"
                checked={globalPrefs.smsEnabled}
                onChange={(e) => handleGlobalPrefChange('smsEnabled', e.target.checked)}
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="pref-inapp"
                label="In-app notifications enabled"
                checked={globalPrefs.inAppEnabled}
                onChange={(e) => handleGlobalPrefChange('inAppEnabled', e.target.checked)}
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="pref-quiet"
                label="Quiet hours enabled"
                checked={globalPrefs.quietHoursEnabled}
                onChange={(e) => handleGlobalPrefChange('quietHoursEnabled', e.target.checked)}
              />
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Quiet hours start</Form.Label>
                <Form.Control
                  type="time"
                  value={globalPrefs.quietHoursStart}
                  disabled={!globalPrefs.quietHoursEnabled}
                  onChange={(e) => handleGlobalPrefChange('quietHoursStart', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Quiet hours end</Form.Label>
                <Form.Control
                  type="time"
                  value={globalPrefs.quietHoursEnd}
                  disabled={!globalPrefs.quietHoursEnabled}
                  onChange={(e) => handleGlobalPrefChange('quietHoursEnd', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Default sender email</Form.Label>
                <Form.Control
                  type="email"
                  value={globalPrefs.defaultSenderEmail}
                  onChange={(e) => handleGlobalPrefChange('defaultSenderEmail', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Delivery mode</Form.Label>
                <Form.Select
                  value={globalPrefs.digestMode}
                  onChange={(e) => handleGlobalPrefChange('digestMode', e.target.value)}
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly digest</option>
                  <option value="daily">Daily digest</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={() => setShowGlobalSettings(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleSaveGlobalPrefs}>
            Save preferences
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default NotificationSettings
