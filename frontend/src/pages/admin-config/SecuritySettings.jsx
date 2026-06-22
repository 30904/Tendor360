import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Alert } from 'react-bootstrap'
import { Edit, Shield, Lock, Brain, CheckCircle, AlertTriangle, Key, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import AdminWorkspaceModal from '../../components/admin/AdminWorkspaceModal'
import { showToast } from '../../utils/toast'
import { exportRowsToExcel } from '../../utils/exportReport'
import './SecuritySettings.scss'

const SECURITY_FORM_FIELDS = [
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

const SecuritySettings = () => {
  const navigate = useNavigate()
  const [securitySettings, setSecuritySettings] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setSecuritySettings([
      {
        id: 1,
        name: 'Password Policy',
        description: 'Configure password complexity and expiration rules',
        category: 'Authentication',
        status: 'Active',
        lastModified: '2024-02-10',
        modifiedBy: 'Security Admin',
        aiRecommendation: 'Strong password policy reduces security risks',
        aiConfidence: 94,
        riskLevel: 'Low',
        priority: 'Critical',
        requirements: [
          'Minimum 8 characters',
          'At least 1 uppercase letter',
          'At least 1 lowercase letter',
          'At least 1 number',
          'At least 1 special character',
          'Password expires every 90 days'
        ],
        impact: 'User Security',
        compliance: 'SOX, GDPR'
      },
      {
        id: 2,
        name: 'Two-Factor Authentication',
        description: 'Enable two-factor authentication for enhanced security',
        category: 'Authentication',
        status: 'Active',
        lastModified: '2024-02-08',
        modifiedBy: 'Security Admin',
        aiRecommendation: '2FA significantly improves account security',
        aiConfidence: 96,
        riskLevel: 'Low',
        priority: 'High',
        requirements: [
          'SMS-based verification',
          'Email-based verification',
          'Authenticator app support',
          'Backup codes available',
          'Mandatory for admin accounts'
        ],
        impact: 'Account Security',
        compliance: 'SOX, GDPR, ISO 27001'
      },
      {
        id: 3,
        name: 'Session Management',
        description: 'Configure session timeout and concurrent session limits',
        category: 'Session Security',
        status: 'Active',
        lastModified: '2024-02-05',
        modifiedBy: 'Security Admin',
        aiRecommendation: 'Proper session management prevents unauthorized access',
        aiConfidence: 89,
        riskLevel: 'Medium',
        priority: 'High',
        requirements: [
          'Session timeout: 30 minutes',
          'Maximum 3 concurrent sessions',
          'Session invalidation on logout',
          'Secure session cookies',
          'Session activity logging'
        ],
        impact: 'Session Security',
        compliance: 'SOX, GDPR'
      },
      {
        id: 4,
        name: 'IP Whitelisting',
        description: 'Restrict access to specific IP addresses or ranges',
        category: 'Network Security',
        status: 'Inactive',
        lastModified: '2024-01-20',
        modifiedBy: 'Network Admin',
        aiRecommendation: 'IP whitelisting provides additional security layer',
        aiConfidence: 82,
        riskLevel: 'Medium',
        priority: 'Medium',
        requirements: [
          'Office IP ranges allowed',
          'VPN IP ranges allowed',
          'Block suspicious IPs',
          'Geographic restrictions',
          'Emergency access procedures'
        ],
        impact: 'Network Security',
        compliance: 'ISO 27001'
      },
      {
        id: 5,
        name: 'Data Encryption',
        description: 'Encrypt sensitive data at rest and in transit',
        category: 'Data Security',
        status: 'Active',
        lastModified: '2024-02-12',
        modifiedBy: 'Data Security Admin',
        aiRecommendation: 'AES-256 encryption provides strong data protection',
        aiConfidence: 97,
        riskLevel: 'Low',
        priority: 'Critical',
        requirements: [
          'AES-256 encryption for data at rest',
          'TLS 1.3 for data in transit',
          'Key rotation every 90 days',
          'Encrypted database backups',
          'Secure key management'
        ],
        impact: 'Data Protection',
        compliance: 'SOX, GDPR, ISO 27001'
      },
      {
        id: 6,
        name: 'Access Logging',
        description: 'Comprehensive logging of user access and activities',
        category: 'Audit & Monitoring',
        status: 'Active',
        lastModified: '2024-02-09',
        modifiedBy: 'Audit Admin',
        aiRecommendation: 'Detailed logging enables security monitoring',
        aiConfidence: 91,
        riskLevel: 'Low',
        priority: 'High',
        requirements: [
          'Login/logout events',
          'Data access logging',
          'Failed access attempts',
          'Privilege escalation events',
          '7-year retention period'
        ],
        impact: 'Compliance & Monitoring',
        compliance: 'SOX, GDPR, ISO 27001'
      },
      {
        id: 7,
        name: 'API Security',
        description: 'Secure API endpoints and rate limiting',
        category: 'API Security',
        status: 'Active',
        lastModified: '2024-02-07',
        modifiedBy: 'API Security Admin',
        aiRecommendation: 'API security prevents unauthorized access',
        aiConfidence: 88,
        riskLevel: 'Medium',
        priority: 'High',
        requirements: [
          'OAuth 2.0 authentication',
          'API rate limiting',
          'Request validation',
          'HTTPS only',
          'API key rotation'
        ],
        impact: 'API Security',
        compliance: 'ISO 27001'
      },
      {
        id: 8,
        name: 'Backup Security',
        description: 'Secure backup storage and recovery procedures',
        category: 'Data Security',
        status: 'Active',
        lastModified: '2024-02-05',
        modifiedBy: 'Backup Admin',
        aiRecommendation: 'Secure backups ensure data recovery capability',
        aiConfidence: 93,
        riskLevel: 'Low',
        priority: 'Critical',
        requirements: [
          'Encrypted backup storage',
          'Offsite backup copies',
          'Regular backup testing',
          'Access control for backups',
          'Disaster recovery procedures'
        ],
        impact: 'Business Continuity',
        compliance: 'SOX, ISO 27001'
      }
    ])

    setStats({
      totalSettings: 8,
      active: 7,
      inactive: 1,
      categories: 6,
      aiConfidence: 91,
      lastSecurityAudit: '2024-02-01',
      securityScore: 96,
      criticalSettings: 4
    })
  }, [])

  const handleViewSetting = (setting) => {
    setSelectedSetting(setting)
    setShowModal(true)
  }

  const handleEnableSetting = (setting) => {
    if (window.confirm(`Are you sure you want to enable "${setting.name}"?`)) {
      setSecuritySettings((prev) =>
        prev.map((s) => (s.id === setting.id ? { ...s, status: 'Active' } : s))
      )
    }
  }

  const handleRunSecurityAudit = () => {
    const today = new Date().toISOString().split('T')[0]
    setStats((prev) => ({ ...prev, lastSecurityAudit: today }))
    showToast.success('Security audit completed successfully')
  }

  const handleEditSetting = (setting) => {
    setEditingItem(setting)
    setShowFormModal(true)
  }

  const handleFormSubmit = (formData) => {
    if (!editingItem) return

    setSecuritySettings((prev) =>
      prev.map((s) =>
        s.id === editingItem.id
          ? { ...s, status: formData.status, lastModified: new Date().toISOString().split('T')[0] }
          : s
      )
    )
    showToast.success(`${editingItem.name} updated`)
    setShowFormModal(false)
    setEditingItem(null)
  }

  const handleExportReport = () => {
    exportRowsToExcel(
      securitySettings.map(
        ({ id, name, category, status, priority, riskLevel, compliance, lastModified, modifiedBy, impact }) => ({
          id,
          name,
          category,
          status,
          priority,
          riskLevel,
          compliance,
          lastModified,
          modifiedBy,
          impact
        })
      ),
      { sheetName: 'Security Settings', fileName: 'security_settings_report.xlsx' }
    )
  }

  const handleDeleteSetting = (setting) => {
    if (window.confirm(`Are you sure you want to delete setting "${setting.name}"?`)) {
      setSecuritySettings((prev) => prev.filter((s) => s.id !== setting.id))
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Security Setting',
      width: '25%',
      render: (value, row) => (
        <div className="security-setting-info">
          <div className="fw-semibold d-flex align-items-center">
            <Shield size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      width: '15%',
      render: (value) => {
        const CategoryIcon = getCategoryIcon(value)
        return (
          <div className="d-flex align-items-center">
            <CategoryIcon size={16} className="me-1" />
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
      key: 'compliance',
      label: 'Compliance',
      width: '15%',
      render: (value) => (
        <div className="compliance-info">
          <small className="text-muted">{value}</small>
        </div>
      )
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

  const getCategoryIcon = (category) => {
    const icons = {
      Authentication: Key,
      'Session Security': UserCheck,
      'Network Security': Shield
    }
    return icons[category] || Shield
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalSettings ?? 0) > 0) {
      items.push({
        title: `${stats.totalSettings} security controls · score ${stats.securityScore}%`,
        detail: `${stats.criticalSettings} critical setting(s) · ${stats.aiConfidence}% AI confidence in posture analysis.`,
        tone: stats.criticalSettings > 0 ? 'warning' : 'info'
      })
    }
    if ((stats.criticalSettings ?? 0) > 0) {
      items.push({
        title: 'Critical controls need review',
        detail: 'Validate MFA, session, and perimeter policies before go-live changes.',
        tone: 'danger'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Security posture',
        detail: 'Load policies to populate threat intelligence.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="security-settings-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'Security Settings', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="Security policy command center"
        description="Configure security policies and access controls with AI-powered threat assessment."
        heroMeta="Posture, MFA, session policy"
        outlookTitle="Defense outlook"
        outlookDescription={`${stats.totalSettings ?? 0} settings · ${stats.securityScore ?? 0}% score · ${stats.criticalSettings ?? 0} critical.`}
        outlookChips={[
          `${stats.totalSettings ?? 0} controls`,
          `${stats.securityScore ?? 0}% score`,
          `${stats.criticalSettings ?? 0} critical`,
          `${stats.aiConfidence ?? 0}% AI`
        ]}
        insights={insightItems}
        kpiTitle="Threat signal board"
        kpiMeta="Coverage, score, and model confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Security settings"
                value={stats.totalSettings ?? 0}
                hint="Registered controls"
                tone="intel"
                trend="Scope"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Security score"
                value={stats.securityScore ?? 0}
                hint="Composite posture"
                tone={
                  (stats.securityScore ?? 0) >= 85
                    ? 'success'
                    : (stats.securityScore ?? 0) >= 70
                      ? 'warning'
                      : 'danger'
                }
                trend="Posture"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Critical"
                value={stats.criticalSettings ?? 0}
                hint="Needs validation"
                tone={(stats.criticalSettings ?? 0) > 0 ? 'danger' : 'success'}
                trend="Risk"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Assessment models"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Security settings configuration"
        tableActions={
          <>
            <Button variant="primary" className="me-2" onClick={handleRunSecurityAudit}>
              <Shield size={16} className="me-2" />
              Run Security Audit
            </Button>
            <Button variant="outline-secondary" onClick={handleExportReport}>
              <Lock size={16} className="me-2" />
              Export Report
            </Button>
          </>
        }
      >
        <DataTable
          data={securitySettings}
          columns={columns}
          title="Security Settings Configuration"
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
              label: 'Enable Setting',
              onClick: (row) => {
                if (row.status === 'Inactive') {
                  handleEnableSetting(row)
                }
              }
            }
          ]}
          searchPlaceholder="Search security settings..."
          emptyMessage="No security settings found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Shield size={20} className="me-2" />
            Security Setting Details - {selectedSetting?.name}
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
                    <strong>Status:</strong> {selectedSetting.status}
                  </p>
                  <p>
                    <strong>Priority:</strong> {selectedSetting.priority}
                  </p>
                  <p>
                    <strong>Impact:</strong> {selectedSetting.impact}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Security Metrics</h6>
                  <p>
                    <strong>Risk Level:</strong> {selectedSetting.riskLevel}
                  </p>
                  <p>
                    <strong>AI Confidence:</strong> {selectedSetting.aiConfidence}%
                  </p>
                  <p>
                    <strong>Compliance:</strong> {selectedSetting.compliance}
                  </p>
                  <p>
                    <strong>Last Modified:</strong> {selectedSetting.lastModified}
                  </p>
                  <p>
                    <strong>Modified By:</strong> {selectedSetting.modifiedBy}
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
                <Col>
                  <h6>Security Requirements</h6>
                  <ul className="requirements-list">
                    {selectedSetting.requirements.map((requirement, index) => (
                      <li key={index} className="requirement-item">
                        <CheckCircle size={14} className="me-2 text-success" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>AI Assessment & Recommendation</h6>
                  <Alert variant="info">
                    <Brain size={16} className="me-2" />
                    <strong>Recommendation:</strong> {selectedSetting.aiRecommendation}
                  </Alert>
                  <Alert variant="success">
                    <Shield size={16} className="me-2" />
                    <strong>Confidence Level:</strong> {selectedSetting.aiConfidence}% based on security
                    best practices and threat analysis
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
        title={`Edit Security Setting — ${editingItem?.name ?? ''}`}
        description={editingItem?.description}
        submitLabel="Save changes"
        fields={SECURITY_FORM_FIELDS}
        initialValues={editingItem ? { status: editingItem.status } : {}}
        onSubmit={handleFormSubmit}
      />
    </>
  )
}

export default SecuritySettings
