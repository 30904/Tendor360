import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, ProgressBar } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, FileText, Shield, CheckCircle, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './ComplianceAuditReports.scss'
import { dummyComplianceReportPrefill } from '../../utils/testFormDummies'

const ComplianceAuditReports = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingReport, setEditingReport] = useState(null)
  const [prefillSnapshot, setPrefillSnapshot] = useState(null)
  const [modalFormKey, setModalFormKey] = useState(0)
  const [stats, setStats] = useState({})

  // Mock data for demonstration
  useEffect(() => {
    setReports([
      {
        id: 1,
        name: 'SOX Compliance Report',
        description: 'Sarbanes-Oxley compliance audit for Q4 2023',
        type: 'Compliance',
        status: 'Completed',
        generatedBy: 'John Doe',
        generatedDate: '2024-01-20',
        lastModified: '2024-01-20',
        complianceScore: 95,
        findings: 2,
        recommendations: 5
      },
      {
        id: 2,
        name: 'Data Privacy Audit',
        description: 'GDPR and data privacy compliance assessment',
        type: 'Audit',
        status: 'In Progress',
        generatedBy: 'Jane Smith',
        generatedDate: '2024-01-19',
        lastModified: '2024-01-19',
        complianceScore: 88,
        findings: 4,
        recommendations: 3
      },
      {
        id: 3,
        name: 'Security Compliance Review',
        description: 'Cybersecurity framework compliance review',
        type: 'Compliance',
        status: 'Pending',
        generatedBy: 'Mike Johnson',
        generatedDate: '2024-01-18',
        lastModified: '2024-01-18',
        complianceScore: 92,
        findings: 1,
        recommendations: 2
      },
      {
        id: 4,
        name: 'Financial Controls Audit',
        description: 'Internal financial controls and procedures audit',
        type: 'Audit',
        status: 'Completed',
        generatedBy: 'Sarah Wilson',
        generatedDate: '2024-01-17',
        lastModified: '2024-01-17',
        complianceScore: 98,
        findings: 0,
        recommendations: 1
      },
      {
        id: 5,
        name: 'Risk Assessment Report',
        description: 'Enterprise risk management assessment',
        type: 'Review',
        status: 'In Progress',
        generatedBy: 'David Brown',
        generatedDate: '2024-01-16',
        lastModified: '2024-01-16',
        complianceScore: 85,
        findings: 3,
        recommendations: 4
      },
      {
        id: 6,
        name: 'Regulatory Compliance Check',
        description: 'Industry-specific regulatory compliance verification',
        type: 'Compliance',
        status: 'Completed',
        generatedBy: 'Emily Davis',
        generatedDate: '2024-01-15',
        lastModified: '2024-01-15',
        complianceScore: 96,
        findings: 1,
        recommendations: 2
      }
    ])

    setStats({
      totalReports: 6,
      completedReports: 3,
      inProgressReports: 2,
      pendingReports: 1,
      avgComplianceScore: 94
    })
  }, [])

  const handleEditReport = (report) => {
    setPrefillSnapshot(null)
    setEditingReport(report)
    setModalFormKey((k) => k + 1)
    setShowModal(true)
  }

  const handleDeleteReport = (report) => {
    if (window.confirm(`Are you sure you want to delete report "${report.name}"?`)) {
      setReports(prev => prev.filter(r => r.id !== report.id))
    }
  }

  const handleDownloadReport = (report) => {
    // Mock download functionality
    console.log(`Downloading report: ${report.name}`)
  }

  const handleViewReport = (report) => {
    console.log('View report:', report)
    // Navigate to report details or open view modal
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Report Details',
      width: '25%',
      render: (value, row) => (
        <div className="report-info">
          <div className="fw-semibold">{value}</div>
          <small className="text-muted">{row.description}</small>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      width: '12%',
      render: (value) => getTypeBadge(value)
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'complianceScore',
      label: 'Score',
      width: '10%',
      render: (value) => (
        <div className="score-info">
          <div className="fw-bold text-primary">{value}%</div>
          <ProgressBar 
            now={value} 
            variant={value >= 90 ? 'success' : value >= 80 ? 'warning' : 'danger'}
            size="sm"
            className="mt-1"
          />
        </div>
      )
    },
    {
      key: 'generatedBy',
      label: 'Generated By',
      width: '15%'
    },
    {
      key: 'generatedDate',
      label: 'Date',
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
      key: 'findings',
      label: 'Findings',
      width: '8%',
      render: (value) => (
        <Badge bg={value === 0 ? 'success' : value <= 2 ? 'warning' : 'danger'}>
          {value}
        </Badge>
      )
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'Completed': 'success',
      'In Progress': 'warning',
      'Pending': 'info',
      'Failed': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getTypeBadge = (type) => {
    const variants = {
      'Compliance': 'primary',
      'Audit': 'info',
      'Review': 'warning'
    }
    return <Badge bg={variants[type] || 'secondary'}>{type}</Badge>
  }

  const insightItems = useMemo(() => {
    const items = []
    const total = stats.totalReports ?? 0
    if (total > 0) {
      items.push({
        title: `${total} reports in registry with ${stats.completedReports ?? 0} completed`,
        detail: `${stats.inProgressReports ?? 0} in progress, ${stats.pendingReports ?? 0} pending. Average compliance score ${stats.avgComplianceScore ?? 0}%.`,
        tone: 'info'
      })
    }
    if ((stats.pendingReports ?? 0) > 2) {
      items.push({
        title: 'Backlog of pending compliance reports',
        detail: 'Prioritize generation and sign-off for items still in pending status.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Compliance reporting workspace is ready',
        detail: 'Generate reports to populate audit trails and regulatory evidence.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const formSeed = editingReport || prefillSnapshot || {}

  const closeComplianceModal = () => {
    setShowModal(false)
    setEditingReport(null)
    setPrefillSnapshot(null)
    setModalFormKey((k) => k + 1)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="compliance-audit-reports-page"
        breadcrumbs={[
          { label: 'Reporting & Analytics', onClick: () => navigate('/reporting-analytics') },
          { label: 'Compliance & Audit Reports', active: true }
        ]}
        onBack={() => navigate('/reporting-analytics')}
        title="Compliance & audit command center"
        description="Generate compliance reports and audit trails for regulatory requirements."
        heroMeta="Regulatory & audit telemetry"
        outlookTitle="Compliance intelligence outlook"
        outlookDescription={`${stats.totalReports ?? 0} total reports — ${stats.completedReports ?? 0} completed, ${stats.inProgressReports ?? 0} in progress.`}
        outlookChips={[
          `${stats.totalReports ?? 0} total`,
          `${stats.completedReports ?? 0} completed`,
          `${stats.inProgressReports ?? 0} in progress`,
          `${stats.avgComplianceScore ?? 0}% avg score`
        ]}
        insights={insightItems}
        kpiTitle="Report signal board"
        kpiMeta="Coverage and quality"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total reports"
                value={stats.totalReports ?? 0}
                hint="Registered reports"
                tone="intel"
                trend="Registry"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Completed"
                value={stats.completedReports ?? 0}
                hint="Signed-off or finalized"
                tone="success"
                trend="Closed"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="In progress"
                value={stats.inProgressReports ?? 0}
                hint="Active generation"
                tone="warning"
                trend="Active"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg compliance score"
                value={stats.avgComplianceScore ?? 0}
                hint="Portfolio quality"
                tone={(stats.avgComplianceScore ?? 0) >= 90 ? 'success' : 'warning'}
                trend="Quality"
                suffix="%"
                icon={<Shield size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Compliance & audit reports (${reports.length})`}
        tableActions={(
          <Button
            variant="primary"
            onClick={() => {
              setEditingReport(null)
              setPrefillSnapshot(null)
              setModalFormKey((k) => k + 1)
              setShowModal(true)
            }}
            className="add-report-btn"
          >
            <Plus size={20} className="me-2" />
            Generate Report
          </Button>
        )}
      >
        <DataTable
          data={reports}
          columns={columns}
          title={`Compliance & Audit Reports (${reports.length})`}
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewReport}
          onEdit={handleEditReport}
          onDelete={handleDeleteReport}
          customActions={[
            {
              type: 'custom',
              label: 'Download',
              onClick: (row) => handleDownloadReport(row)
            }
          ]}
          searchPlaceholder="Search reports..."
          emptyMessage="No reports found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

        <FormDrawerModal
          show={showModal}
          onHide={closeComplianceModal}
          size="lg"
          onTestFill={
            showModal
              ? () => {
                  setPrefillSnapshot(dummyComplianceReportPrefill())
                  setModalFormKey((k) => k + 1)
                }
              : undefined
          }
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingReport ? 'Edit Report' : 'Generate New Report'}
            </Modal.Title>
          </Modal.Header>
          <Form key={modalFormKey}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Report Name</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={formSeed.name || ''}
                      placeholder="Enter report name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Report Type</Form.Label>
                    <Form.Select defaultValue={formSeed.type || 'Compliance'}>
                      <option value="Compliance">Compliance</option>
                      <option value="Audit">Audit</option>
                      <option value="Review">Review</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue={formSeed.description || ''}
                  placeholder="Describe the report purpose and scope"
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select defaultValue={formSeed.status || 'Pending'}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Compliance Score (%)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={formSeed.complianceScore ?? ''}
                      placeholder="0-100"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeComplianceModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingReport ? 'Update Report' : 'Generate Report'}
              </Button>
            </Modal.Footer>
          </Form>
        </FormDrawerModal>
    </>
  )
}

export default ComplianceAuditReports
