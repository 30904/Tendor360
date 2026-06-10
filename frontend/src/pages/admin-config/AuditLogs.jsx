import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Alert } from 'react-bootstrap'
import { Download, Filter, Calendar, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './AuditLogs.scss'

const AuditLogs = () => {
  const navigate = useNavigate()
  const [auditLogs, setAuditLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setAuditLogs([
      {
        id: 1,
        action: 'User Login',
        description: 'User successfully logged into the system',
        user: 'John Doe',
        userRole: 'Tender Manager',
        timestamp: '2024-01-21 10:30:15',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'Success',
        severity: 'Info',
        module: 'Authentication',
        details: 'Login successful from office network'
      },
      {
        id: 2,
        action: 'Tender Created',
        description: 'New tender document created and submitted',
        user: 'Jane Smith',
        userRole: 'Tender Specialist',
        timestamp: '2024-01-21 09:45:30',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'Success',
        severity: 'Info',
        module: 'Tender Management',
        details: 'Tender TEN-2024-001 created with 15 documents'
      },
      {
        id: 3,
        action: 'Failed Login Attempt',
        description: 'Invalid credentials provided during login',
        user: 'Unknown',
        userRole: 'N/A',
        timestamp: '2024-01-21 08:15:45',
        ipAddress: '203.0.113.50',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'Failed',
        severity: 'Warning',
        module: 'Authentication',
        details: 'Multiple failed login attempts detected'
      },
      {
        id: 4,
        action: 'Document Deleted',
        description: 'Sensitive document permanently deleted',
        user: 'Mike Johnson',
        userRole: 'System Administrator',
        timestamp: '2024-01-21 07:20:10',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'Success',
        severity: 'High',
        module: 'Document Management',
        details: 'Document ID: DOC-2024-001 deleted from tender TEN-2024-002'
      },
      {
        id: 5,
        action: 'User Role Changed',
        description: 'User role permissions updated',
        user: 'Sarah Wilson',
        userRole: 'HR Manager',
        timestamp: '2024-01-21 06:45:20',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'Success',
        severity: 'Medium',
        module: 'User Management',
        details: 'User role changed from User to Manager for employee ID: EMP-001'
      },
      {
        id: 6,
        action: 'Data Export',
        description: 'Sensitive data exported to external system',
        user: 'David Brown',
        userRole: 'Data Analyst',
        timestamp: '2024-01-21 05:30:15',
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'Success',
        severity: 'High',
        module: 'Data Management',
        details: 'Export of 10,000 tender records to external BI system'
      },
      {
        id: 7,
        action: 'System Configuration',
        description: 'System settings modified',
        user: 'Emily Davis',
        userRole: 'System Administrator',
        timestamp: '2024-01-21 04:15:30',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'Success',
        severity: 'Medium',
        module: 'System Configuration',
        details: 'Updated backup frequency from daily to hourly'
      },
      {
        id: 8,
        action: 'API Access',
        description: 'External API accessed with invalid token',
        user: 'Unknown',
        userRole: 'N/A',
        timestamp: '2024-01-21 03:00:45',
        ipAddress: '203.0.113.100',
        userAgent: 'PostmanRuntime/7.28.4',
        status: 'Failed',
        severity: 'Warning',
        module: 'API Management',
        details: 'Unauthorized API access attempt from external IP'
      }
    ])

    setStats({
      totalLogs: 8,
      success: 6,
      failed: 2,
      highSeverity: 2,
      warningSeverity: 2,
      infoSeverity: 4,
      todayLogs: 8
    })
  }, [])

  const handleViewLog = (log) => {
    setSelectedLog(log)
    setShowModal(true)
  }

  const handleEditLog = (log) => {
    console.log('Edit log:', log)
    // Navigate to edit log or open edit modal
  }

  const handleDeleteLog = (log) => {
    if (window.confirm(`Are you sure you want to delete this audit log entry?`)) {
      setAuditLogs(prev => prev.filter(l => l.id !== log.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'action',
      label: 'Action',
      width: '20%',
      render: (value, row) => (
        <div className="action-info">
          <div className="fw-semibold">{value}</div>
          <small className="text-muted">{row.description}</small>
        </div>
      )
    },
    {
      key: 'user',
      label: 'User',
      width: '15%',
      render: (value, row) => (
        <div className="user-info">
          <div className="fw-medium">{value}</div>
          <small className="text-muted">{row.userRole}</small>
        </div>
      )
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      width: '15%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'severity',
      label: 'Severity',
      width: '10%',
      render: (value) => getSeverityBadge(value)
    },
    {
      key: 'module',
      label: 'Module',
      width: '15%'
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      width: '12%'
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'Success': 'success',
      'Failed': 'danger',
      'Warning': 'warning',
      'Error': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getSeverityBadge = (severity) => {
    const variants = {
      'High': 'danger',
      'Warning': 'warning',
      'Info': 'info',
      'Low': 'secondary'
    }
    return <Badge bg={variants[severity] || 'secondary'}>{severity}</Badge>
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'High': return <AlertTriangle size={16} className="text-danger" />
      case 'Warning': return <AlertTriangle size={16} className="text-warning" />
      case 'Info': return <CheckCircle size={16} className="text-info" />
      default: return <Clock size={16} className="text-secondary" />
    }
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalLogs ?? 0) > 0) {
      items.push({
        title: `${stats.totalLogs} audit events · ${stats.success} successful`,
        detail: `${stats.failed} failed attempts today · ${stats.highSeverity} high-severity event(s) need review.`,
        tone: stats.failed > 0 || stats.highSeverity > 0 ? 'warning' : 'info'
      })
    }
    if ((stats.highSeverity ?? 0) > 0) {
      items.push({
        title: 'High-severity events flagged',
        detail: 'Escalate to security operations and validate access paths.',
        tone: 'danger'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Audit trail ready',
        detail: 'Ingest logs to populate intelligence summaries.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="audit-logs-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'Audit Logs', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="Audit & security command center"
        description="Monitor system activities and security events with a comprehensive audit trail."
        heroMeta="Immutable activity telemetry"
        outlookTitle="Trust & observability outlook"
        outlookDescription={`${stats.totalLogs ?? 0} events · ${stats.todayLogs ?? 0} today · ${stats.failed ?? 0} failed.`}
        outlookChips={[
          `${stats.totalLogs ?? 0} total`,
          `${stats.success ?? 0} success`,
          `${stats.failed ?? 0} failed`,
          `${stats.highSeverity ?? 0} high sev.`
        ]}
        insights={insightItems}
        kpiTitle="Audit signal board"
        kpiMeta="Volume, outcomes, and daily load"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total logs"
                value={stats.totalLogs ?? 0}
                hint="Indexed events"
                tone="intel"
                trend="Volume"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Successful"
                value={stats.success ?? 0}
                hint="Completed actions"
                tone="success"
                trend="Healthy"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Failed"
                value={stats.failed ?? 0}
                hint="Needs investigation"
                tone={stats.failed > 0 ? 'danger' : 'success'}
                trend="Risk"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Today"
                value={stats.todayLogs ?? 0}
                hint="Last 24h window"
                tone="intel"
                trend="Pulse"
                icon={<Calendar size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Audit logs"
        tableActions={
          <>
            <Button variant="outline-primary" className="me-2">
              <Filter size={16} className="me-2" />
              Filter
            </Button>
            <Button variant="outline-secondary">
              <Download size={16} className="me-2" />
              Export
            </Button>
          </>
        }
      >
        <DataTable
          data={auditLogs}
          columns={columns}
          title="Audit Logs"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewLog}
          onEdit={handleEditLog}
          onDelete={handleDeleteLog}
          customActions={[
            {
              type: 'custom',
              label: 'Export Details',
              onClick: (row) => {
                console.log('Export log details:', row);
              }
            }
          ]}
          searchPlaceholder="Search audit logs..."
          emptyMessage="No audit logs found"
          loading={false}
        />
      </ExecutiveCommandCenter>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Shield size={20} className="me-2" />
              Audit Log Details - {selectedLog?.action}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedLog && (
              <div className="audit-log-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Action:</strong> {selectedLog.action}</p>
                    <p><strong>User:</strong> {selectedLog.user?.firstName} {selectedLog.user?.lastName}</p>
                    <p><strong>User Role:</strong> {selectedLog.userRole}</p>
                    <p><strong>Timestamp:</strong> {selectedLog.timestamp}</p>
                    <p><strong>Status:</strong> {selectedLog.status}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Technical Details</h6>
                    <p><strong>IP Address:</strong> {selectedLog.ipAddress}</p>
                    <p><strong>Severity:</strong> {selectedLog.severity}</p>
                    <p><strong>Module:</strong> {selectedLog.module}</p>
                    <p><strong>User Agent:</strong> {selectedLog.userAgent}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedLog.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Additional Details</h6>
                    <Alert variant="info">
                      <strong>Details:</strong> {selectedLog.details}
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
              <Download size={16} className="me-2" />
              Export Log
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default AuditLogs