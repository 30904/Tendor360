import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Alert } from 'react-bootstrap'
import { Edit, Settings, Shield, Brain, CheckCircle, AlertTriangle, Save, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import AdminWorkspaceModal from '../../components/admin/AdminWorkspaceModal'
import { showToast } from '../../utils/toast'
import { exportRowsToExcel } from '../../utils/exportReport'
import { loadAdminConfig, saveAdminConfig } from '../../utils/adminConfigStorage'
import './SystemSettings.scss'

const SETTINGS_STORAGE_KEY = 'tender360_system_settings'

const INITIAL_SETTINGS = [
  {
    id: 1,
    name: 'System Timeout',
    description: 'Automatic session timeout duration in minutes',
    category: 'Security',
    value: '30',
    unit: 'minutes',
    type: 'Number',
    status: 'Active',
    lastModified: '2024-02-10',
    modifiedBy: 'System Admin',
    aiRecommendation: 'Optimal timeout for security and user experience',
    aiConfidence: 92,
    riskLevel: 'Low',
    priority: 'High',
    validation: 'Must be between 15-120 minutes',
    impact: 'User Experience'
  },
  {
    id: 2,
    name: 'File Upload Limit',
    description: 'Maximum file size allowed for uploads',
    category: 'Storage',
    value: '100',
    unit: 'MB',
    type: 'Number',
    status: 'Active',
    lastModified: '2024-02-08',
    modifiedBy: 'Storage Admin',
    aiRecommendation: 'Balanced limit for performance and usability',
    aiConfidence: 88,
    riskLevel: 'Medium',
    priority: 'Medium',
    validation: 'Must be between 10-500 MB',
    impact: 'Performance'
  },
  {
    id: 3,
    name: 'Backup Frequency',
    description: 'How often system backups are performed',
    category: 'Data Management',
    value: 'Daily',
    unit: '',
    type: 'Select',
    status: 'Active',
    lastModified: '2024-02-05',
    modifiedBy: 'Data Admin',
    aiRecommendation: 'Daily backups ensure data protection',
    aiConfidence: 95,
    riskLevel: 'Low',
    priority: 'Critical',
    validation: 'Must be Daily, Weekly, or Monthly',
    impact: 'Data Protection'
  },
  {
    id: 4,
    name: 'Email Notifications',
    description: 'Enable or disable email notifications',
    category: 'Communication',
    value: 'Enabled',
    unit: '',
    type: 'Boolean',
    status: 'Active',
    lastModified: '2024-02-01',
    modifiedBy: 'Communication Admin',
    aiRecommendation: 'Notifications improve user engagement',
    aiConfidence: 85,
    riskLevel: 'Low',
    priority: 'Medium',
    validation: 'Must be Enabled or Disabled',
    impact: 'User Engagement'
  },
  {
    id: 5,
    name: 'API Rate Limit',
    description: 'Maximum API requests per minute',
    category: 'Performance',
    value: '1000',
    unit: 'requests/min',
    type: 'Number',
    status: 'Active',
    lastModified: '2024-01-28',
    modifiedBy: 'API Admin',
    aiRecommendation: 'Optimal rate limit for system stability',
    aiConfidence: 90,
    riskLevel: 'Medium',
    priority: 'High',
    validation: 'Must be between 100-5000 requests/min',
    impact: 'System Performance'
  },
  {
    id: 6,
    name: 'Database Connection Pool',
    description: 'Maximum database connections',
    category: 'Database',
    value: '50',
    unit: 'connections',
    type: 'Number',
    status: 'Active',
    lastModified: '2024-01-25',
    modifiedBy: 'Database Admin',
    aiRecommendation: 'Balanced pool size for optimal performance',
    aiConfidence: 87,
    riskLevel: 'High',
    priority: 'Critical',
    validation: 'Must be between 10-100 connections',
    impact: 'Database Performance'
  },
  {
    id: 7,
    name: 'Log Retention Period',
    description: 'How long to keep system logs',
    category: 'Logging',
    value: '90',
    unit: 'days',
    type: 'Number',
    status: 'Active',
    lastModified: '2024-01-20',
    modifiedBy: 'System Admin',
    aiRecommendation: '90 days provides good audit trail',
    aiConfidence: 82,
    riskLevel: 'Low',
    priority: 'Medium',
    validation: 'Must be between 30-365 days',
    impact: 'Storage Management'
  },
  {
    id: 8,
    name: 'Cache Expiration',
    description: 'How long to cache data',
    category: 'Performance',
    value: '15',
    unit: 'minutes',
    type: 'Number',
    status: 'Inactive',
    lastModified: '2024-01-15',
    modifiedBy: 'Performance Admin',
    aiRecommendation: '15 minutes balances performance and freshness',
    aiConfidence: 78,
    riskLevel: 'Medium',
    priority: 'Medium',
    validation: 'Must be between 5-60 minutes',
    impact: 'Data Freshness'
  }
]

const SETTING_DEFAULT_VALUES = {
  'System Timeout': '30',
  'File Upload Limit': '100',
  'Backup Frequency': 'Daily',
  'Email Notifications': 'Enabled',
  'API Rate Limit': '1000',
  'Database Connection Pool': '50',
  'Log Retention Period': '90',
  'Cache Expiration': '15'
}

const SETTING_FORM_FIELDS = [
  { name: 'value', label: 'Value', required: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' }
    ]
  }
]

const SystemSettings = () => {
  const navigate = useNavigate()
  const [settings, setSettings] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    const saved = loadAdminConfig(SETTINGS_STORAGE_KEY, null)
    setSettings(saved ? saved : INITIAL_SETTINGS.map((s) => ({ ...s })))

    setStats({
      totalSettings: 8,
      active: 7,
      categories: 6,
      aiConfidence: 87,
      lastBackup: '2024-02-10 02:00',
      systemUptime: '99.9%',
      criticalSettings: 2
    })
  }, [])

  const handleViewSetting = (setting) => {
    setSelectedSetting(setting)
    setShowModal(true)
  }

  const handleEditSetting = (setting) => {
    setEditingItem(setting)
    setShowFormModal(true)
  }

  const handleFormSubmit = (formData) => {
    if (!editingItem) return

    setSettings((prev) =>
      prev.map((s) =>
        s.id === editingItem.id
          ? {
              ...s,
              value: formData.value,
              status: formData.status,
              lastModified: new Date().toISOString().split('T')[0]
            }
          : s
      )
    )
    showToast.success(`${editingItem.name} updated`)
    setShowFormModal(false)
    setEditingItem(null)
  }

  const handleDeleteSetting = (setting) => {
    if (window.confirm(`Are you sure you want to delete setting "${setting.name}"?`)) {
      setSettings((prev) => prev.filter((s) => s.id !== setting.id))
    }
  }

  const handleSaveSettings = () => {
    saveAdminConfig(SETTINGS_STORAGE_KEY, settings)
    showToast.success('All system settings saved')
  }

  const handleResetSettings = () => {
    setSettings(INITIAL_SETTINGS.map((s) => ({ ...s })))
    showToast.info('All settings reset to defaults')
  }

  const handleExportConfig = () => {
    exportRowsToExcel(
      settings.map(({ id, name, category, value, unit, type, status, priority, riskLevel, lastModified, modifiedBy }) => ({
        id,
        name,
        category,
        value,
        unit,
        type,
        status,
        priority,
        riskLevel,
        lastModified,
        modifiedBy
      })),
      { sheetName: 'System Settings', fileName: 'system_settings_config.xlsx' }
    )
  }

  const handleResetSingleSetting = (row) => {
    const defaultValue = SETTING_DEFAULT_VALUES[row.name]
    if (!defaultValue) return

    setSettings((prev) =>
      prev.map((s) =>
        s.id === row.id
          ? { ...s, value: defaultValue, lastModified: new Date().toISOString().split('T')[0] }
          : s
      )
    )
    showToast.success(`"${row.name}" reset to default`)
  }

  const columns = [
    {
      key: 'name',
      label: 'Setting Details',
      width: '25%',
      render: (value, row) => (
        <div className="setting-info">
          <div className="fw-semibold d-flex align-items-center">
            <Settings size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      width: '12%',
      render: (value) => <Badge bg="info">{value}</Badge>
    },
    {
      key: 'value',
      label: 'Current Value',
      width: '15%',
      render: (value, row) => (
        <div className="value-info">
          <div className="fw-bold text-primary">
            {value} {row.unit && <span className="text-muted">{row.unit}</span>}
          </div>
          <small className="text-muted">{row.type}</small>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '10%',
      render: (value) => getPriorityBadge(value)
    },
    {
      key: 'riskLevel',
      label: 'Risk',
      width: '8%',
      render: (value) => getRiskBadge(value)
    },
    {
      key: 'lastModified',
      label: 'Modified',
      width: '12%',
      render: (value) => {
        const date = new Date(value)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      width: '12%'
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

  const getRiskBadge = (risk) => {
    const variants = {
      Low: 'success',
      Medium: 'warning',
      High: 'danger'
    }
    return <Badge bg={variants[risk] || 'secondary'}>{risk}</Badge>
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
    if (stats.totalSettings > 0) {
      items.push({
        title: `${stats.totalSettings} system settings across ${stats.categories} categories`,
        detail: `Uptime ${stats.systemUptime} with ${stats.aiConfidence}% AI confidence in optimization.`,
        tone: 'info'
      })
    }
    if (stats.criticalSettings > 0) {
      items.push({
        title: `${stats.criticalSettings} critical setting(s) flagged`,
        detail: 'Validate change windows and approvers before edits.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Configuration overview',
        detail: 'Load settings to populate AI summaries.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="system-settings-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'System Settings', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="System settings command center"
        description="Configure system-wide settings with AI-powered optimization recommendations."
        heroMeta="Core parameters & feature flags"
        outlookTitle="Configuration outlook"
        outlookDescription={`${stats.totalSettings ?? '—'} settings · ${stats.categories ?? '—'} categories · uptime ${stats.systemUptime ?? '—'}.`}
        outlookChips={[
          `${stats.totalSettings ?? 0} total`,
          `${stats.categories ?? 0} categories`,
          `${stats.systemUptime ?? '—'} uptime`,
          `${stats.aiConfidence ?? 0}% AI`
        ]}
        insights={insightItems}
        kpiBadge="Operating metrics"
        kpiTitle="Configuration signal board"
        kpiMeta="Coverage, resilience, and model confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total settings"
                value={stats.totalSettings ?? 0}
                hint="Keys in catalog"
                tone="intel"
                trend="Registry"
                icon={<Settings size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Categories"
                value={stats.categories ?? 0}
                hint="Functional groupings"
                tone="intel"
                trend="Scope"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="System uptime"
                value={stats.systemUptime ?? '—'}
                hint="Service availability"
                tone="success"
                trend="Health"
                icon={<CheckCircle size={20} />}
                displayValue={stats.systemUptime ?? '—'}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Optimization signals"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="System settings configuration"
        tableActions={
          <>
            <Button variant="success" className="me-2" onClick={handleSaveSettings}>
              <Save size={16} className="me-2" />
              Save All
            </Button>
            <Button variant="outline-warning" className="me-2" onClick={handleResetSettings}>
              <RefreshCw size={16} className="me-2" />
              Reset to Default
            </Button>
            <Button variant="outline-secondary" onClick={handleExportConfig}>
              <Settings size={16} className="me-2" />
              Export Config
            </Button>
          </>
        }
      >
        <DataTable
          data={settings}
          columns={columns}
          title="System Settings Configuration"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewSetting}
          onEdit={handleEditSetting}
          onDelete={handleDeleteSetting}
          customActions={[
            {
              type: 'custom',
              label: 'Reset to Default',
              onClick: (row) => handleResetSingleSetting(row)
            }
          ]}
          searchPlaceholder="Search settings..."
          emptyMessage="No settings found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Settings size={20} className="me-2" />
            Setting Details - {selectedSetting?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSetting && (
            <div className="setting-details">
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p>
                    <strong>Name:</strong> {selectedSetting.name}
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedSetting.category}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedSetting.type}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedSetting.status}
                  </p>
                  <p>
                    <strong>Priority:</strong> {selectedSetting.priority}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Current Configuration</h6>
                  <p>
                    <strong>Value:</strong> {selectedSetting.value} {selectedSetting.unit}
                  </p>
                  <p>
                    <strong>Validation:</strong> {selectedSetting.validation}
                  </p>
                  <p>
                    <strong>Impact:</strong> {selectedSetting.impact}
                  </p>
                  <p>
                    <strong>Risk Level:</strong> {selectedSetting.riskLevel}
                  </p>
                  <p>
                    <strong>AI Confidence:</strong> {selectedSetting.aiConfidence}%
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Description</h6>
                  <p>{selectedSetting.description}</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <h6>Modification History</h6>
                  <div className="history-info">
                    <p>
                      <strong>Last Modified:</strong> {selectedSetting.lastModified}
                    </p>
                    <p>
                      <strong>Modified By:</strong> {selectedSetting.modifiedBy}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <h6>AI Assessment & Recommendation</h6>
                  <Alert variant="info">
                    <Brain size={16} className="me-2" />
                    <strong>Recommendation:</strong> {selectedSetting.aiRecommendation}
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle size={16} className="me-2" />
                    <strong>Confidence Level:</strong> {selectedSetting.aiConfidence}% based on system
                    performance analysis and best practices
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
              handleEditSetting(selectedSetting)
            }}
          >
            <Edit size={16} className="me-2" />
            Edit Setting
          </Button>
        </Modal.Footer>
      </Modal>

      <AdminWorkspaceModal
        show={showFormModal}
        onHide={() => {
          setShowFormModal(false)
          setEditingItem(null)
        }}
        title={`Edit Setting — ${editingItem?.name ?? ''}`}
        description={editingItem?.description}
        submitLabel="Save changes"
        fields={SETTING_FORM_FIELDS}
        initialValues={
          editingItem ? { value: editingItem.value, status: editingItem.status } : {}
        }
        onSubmit={handleFormSubmit}
      />
    </>
  )
}

export default SystemSettings
