import React, { useMemo, useState, useCallback } from 'react'
import { Row, Col, Button, Badge, Modal } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import DataTable from '../../components/DataTable'
import {
  Plus,
  Edit,
  Building,
  Brain,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './PreQualificationRegistry.scss'

const DEMO_REGISTRATIONS = [
  {
    id: '1',
    companyName: 'Apex Infrastructure Ltd',
    category: 'Civil Works',
    registrationNumber: 'PQR-2024-001',
    status: 'Active',
    priority: 'Medium',
    annualRevenue: 12500000,
    employeeCount: 240,
    financialRating: 'AA',
    riskLevel: 'Low',
    complianceScore: 92,
    registrationDate: '2024-06-12',
    expiryDate: '2026-06-11',
    lastAudit: '2025-01-20',
    nextAudit: '2025-07-20',
    contactPerson: 'Sarah Chen',
    contactEmail: 's.chen@apexinfra.example',
    contactPhone: '+1-555-0100',
    certifications: ['ISO 9001', 'ISO 45001'],
    aiAssessment: 'Strong compliance history with consistent document verification and stable financials.',
    aiConfidence: 91
  },
  {
    id: '2',
    companyName: 'Northwind Electrotech',
    category: 'Electrical & Systems',
    registrationNumber: 'PQR-2024-014',
    status: 'Pending',
    priority: 'High',
    annualRevenue: 4200000,
    employeeCount: 85,
    financialRating: 'BBB',
    riskLevel: 'Medium',
    complianceScore: 78,
    registrationDate: '2025-03-01',
    expiryDate: '2027-02-28',
    lastAudit: '—',
    nextAudit: '2025-06-01',
    contactPerson: 'Marcus Webb',
    contactEmail: 'm.webb@northwindelectro.example',
    contactPhone: '+1-555-0142',
    certifications: ['IEC compliant assembly'],
    aiAssessment: 'Awaiting refreshed safety manuals; financials acceptable for tier-2 qualification.',
    aiConfidence: 76
  },
  {
    id: '3',
    companyName: 'Redline Industrial Supply',
    category: 'Goods Supplier',
    registrationNumber: 'PQR-2023-881',
    status: 'Suspended',
    priority: 'Critical',
    annualRevenue: 8900000,
    employeeCount: 120,
    financialRating: 'BB',
    riskLevel: 'High',
    complianceScore: 61,
    registrationDate: '2023-11-05',
    expiryDate: '2025-05-01',
    lastAudit: '2024-09-10',
    nextAudit: 'Pending remediation',
    contactPerson: 'Elena Rostova',
    contactEmail: 'e.rostova@redline.example',
    contactPhone: '+1-555-0199',
    certifications: [],
    aiAssessment: 'Elevated risk due to delayed filings and two late delivery incidents in the past fiscal year.',
    aiConfidence: 82
  },
  {
    id: '4',
    companyName: 'Harbor Marine Services',
    category: 'Marine & Logistics',
    registrationNumber: 'PQR-2025-003',
    status: 'Active',
    priority: 'Low',
    annualRevenue: 22000000,
    employeeCount: 410,
    financialRating: 'AAA',
    riskLevel: 'Low',
    complianceScore: 96,
    registrationDate: '2025-01-18',
    expiryDate: '2027-01-17',
    lastAudit: '2025-02-01',
    nextAudit: '2026-02-01',
    contactPerson: 'James Okonkwo',
    contactEmail: 'j.okonkwo@harbormarine.example',
    contactPhone: '+1-555-0220',
    certifications: ['ISO 9001', 'ISM Code', 'MARPOL'],
    aiAssessment: 'Exemplary compliance posture; suitable for strategic framework agreements.',
    aiConfidence: 94
  }
]

const computeStats = (items) => {
  const n = items.length
  if (!n) {
    return {
      totalRegistrations: 0,
      avgComplianceScore: 0,
      highRisk: 0,
      aiConfidence: 0,
      activeRegistrations: 0,
      pendingRegistrations: 0
    }
  }
  const avgComplianceScore = Math.round(
    items.reduce((s, r) => s + (Number(r.complianceScore) || 0), 0) / n
  )
  const highRisk = items.filter((r) => r.riskLevel === 'High').length
  const aiConfidence = Math.round(
    items.reduce((s, r) => s + (Number(r.aiConfidence) || 0), 0) / n
  )
  const activeRegistrations = items.filter((r) => r.status === 'Active').length
  const pendingRegistrations = items.filter((r) => r.status === 'Pending').length
  return {
    totalRegistrations: n,
    avgComplianceScore,
    highRisk,
    aiConfidence,
    activeRegistrations,
    pendingRegistrations
  }
}

const PreQualificationRegistry = () => {
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState(() => [...DEMO_REGISTRATIONS])
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const stats = useMemo(() => computeStats(registrations), [registrations])

  const resetDemo = useCallback(() => {
    setLoading(true)
    window.setTimeout(() => {
      setRegistrations([...DEMO_REGISTRATIONS])
      setLoading(false)
    }, 280)
  }, [])

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)

  const getStatusBadge = (status) => {
    const variants = {
      Active: 'success',
      Pending: 'warning',
      Suspended: 'danger',
      Expired: 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getRiskBadge = (risk) => {
    const variants = { Low: 'success', Medium: 'warning', High: 'danger' }
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

  const getFinancialRatingColor = (rating) => {
    const colors = { AAA: 'success', AA: 'primary', A: 'info', BBB: 'warning', BB: 'danger' }
    return colors[rating] || 'secondary'
  }

  const handleViewRegistration = (registration) => {
    setSelectedRegistration(registration)
    setShowModal(true)
  }

  const handleApproveRegistration = (registration) => {
    if (
      window.confirm(`Approve pre-qualification for "${registration.companyName}"?`)
    ) {
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === registration.id ? { ...r, status: 'Active' } : r
        )
      )
    }
  }

  const handleCreateRegistration = () => {
    if (!window.confirm('Create a new demo registration row?')) return
    const nextId = String(Date.now())
    setRegistrations((prev) => [
      {
        id: nextId,
        companyName: `New Vendor ${prev.length + 1}`,
        category: 'Goods Supplier',
        registrationNumber: `PQR-DEMO-${nextId.slice(-6)}`,
        status: 'Pending',
        priority: 'Medium',
        annualRevenue: 1000000,
        employeeCount: 25,
        financialRating: 'A',
        riskLevel: 'Low',
        complianceScore: 72,
        registrationDate: new Date().toISOString().slice(0, 10),
        expiryDate: new Date(Date.now() + 86400000 * 365).toISOString().slice(0, 10),
        lastAudit: '—',
        nextAudit: 'TBD',
        contactPerson: 'Demo Contact',
        contactEmail: 'contact@demo.vendor',
        contactPhone: '+1-555-0000',
        certifications: [],
        aiAssessment: 'Draft registration — complete diligence before approval.',
        aiConfidence: 68
      },
      ...prev
    ])
  }

  const handleDeleteRegistration = (row) => {
    if (
      window.confirm(`Remove "${row.companyName}" from the registry (demo only)?`)
    ) {
      setRegistrations((prev) => prev.filter((r) => r.id !== row.id))
      if (selectedRegistration?.id === row.id) {
        setShowModal(false)
        setSelectedRegistration(null)
      }
    }
  }

  const insightItems = useMemo(() => {
    const items = []
    if (stats.totalRegistrations > 0) {
      items.push({
        title: `${stats.totalRegistrations} vendor registrations with ${stats.avgComplianceScore}% avg compliance`,
        detail: `${stats.activeRegistrations} active, ${stats.pendingRegistrations} pending; ${stats.highRisk} high-risk profile(s); model confidence avg ${stats.aiConfidence}%.`,
        tone: 'info'
      })
    }
    if (stats.highRisk > 0) {
      items.push({
        title: 'High-risk suppliers need executive review',
        detail: 'Validate remediation plans and restrict tender participation until scores stabilize.',
        tone: 'warning'
      })
    } else if (stats.avgComplianceScore >= 85) {
      items.push({
        title: 'Registry health is strong',
        detail: 'Portfolio-wide compliance scores support accelerated framework renewals.',
        tone: 'success'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Pre-qualification registry is empty',
        detail: 'Seed vendor registrations to activate AI compliance summaries and risk signals.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const columns = [
    {
      key: 'companyName',
      label: 'Company',
      width: '22%',
      render: (value, row) => (
        <div className="company-info">
          <div className="fw-semibold d-flex align-items-center">
            <Building size={16} className="me-2 text-primary" />
            {value}
          </div>
          <small className="text-muted">{row.category}</small>
          <div>
            <small className="text-muted">
              {row.employeeCount} employees · {formatCurrency(row.annualRevenue)}
            </small>
          </div>
        </div>
      )
    },
    {
      key: 'registrationNumber',
      label: 'Registration',
      width: '14%',
      render: (value, row) => (
        <div>
          <div className="fw-medium">{value}</div>
          <small className="text-muted">
            Reg: {row.registrationDate} · Exp: {row.expiryDate}
          </small>
        </div>
      )
    },
    {
      key: 'complianceScore',
      label: 'Compliance',
      width: '12%',
      render: (value, row) => (
        <div>
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">AI: {row.aiConfidence}%</small>
        </div>
      )
    },
    {
      key: 'financialRating',
      label: 'Financial',
      width: '8%',
      render: (value) => (
        <Badge bg={getFinancialRatingColor(value)}>{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'riskLevel',
      label: 'Risk / priority',
      width: '12%',
      render: (value, row) => (
        <div className="d-flex flex-column gap-1 align-items-start">
          {getRiskBadge(value)}
          {getPriorityBadge(row.priority)}
        </div>
      )
    }
  ]

  return (
    <>
      <ExecutiveCommandCenter
        className="prequalification-registry-page"
        showSkeleton={loading && !registrations.length}
        breadcrumbs={[
          {
            label: 'Tender Intelligence',
            onClick: () => navigate('/tender-intelligence')
          },
          { label: 'Pre-Qualification Registry', active: true }
        ]}
        onBack={() => navigate('/tender-intelligence')}
        backLabel="Back to modules"
        title="Pre-qualification command center"
        description="Vendor registry with compliance scoring, risk signals, and AI-assisted diligence — demo data for executive review."
        heroActions={
          <Button
            size="sm"
            variant="outline-primary"
            onClick={resetDemo}
            disabled={loading}
          >
            {loading ? (
              'Refreshing…'
            ) : (
              <>
                <RefreshCw size={16} className="me-1" /> Reset demo
              </>
            )}
          </Button>
        }
        heroMeta="Registry & compliance telemetry"
        outlookTitle="Qualification intelligence outlook"
        outlookDescription={`${stats.totalRegistrations} registrations tracked — ${stats.activeRegistrations} active, ${stats.pendingRegistrations} pending.`}
        outlookChips={[
          `${stats.totalRegistrations} total`,
          `${stats.activeRegistrations} active`,
          `${stats.pendingRegistrations} pending`,
          `${stats.highRisk} high risk`
        ]}
        insights={insightItems}
        kpiTitle="Registry signal board"
        kpiMeta="Coverage, compliance, and model confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total registrations"
                value={stats.totalRegistrations}
                hint="Vendors in pre-qualification"
                tone="intel"
                trend="Registry"
                icon={<Building size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg compliance"
                value={stats.avgComplianceScore}
                hint="Portfolio compliance score"
                tone={
                  stats.avgComplianceScore >= 85
                    ? 'success'
                    : stats.avgComplianceScore >= 70
                      ? 'warning'
                      : 'danger'
                }
                trend="Quality"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="High risk"
                value={stats.highRisk}
                hint="Risk level = High"
                tone={stats.highRisk > 0 ? 'danger' : 'success'}
                trend="Risk"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence}
                hint="Average model confidence"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle={`Pre-qualification directory (${registrations.length})`}
        tableActions={
          <Button variant="primary" onClick={handleCreateRegistration}>
            <Plus size={16} className="me-2" />
            New registration
          </Button>
        }
      >
        <DataTable
          data={registrations}
          columns={columns}
          title={`Pre-qualification directory (${registrations.length})`}
          searchable
          sortable
          exportable
          pagination
          pageSize={10}
          showActions
          showCheckboxes={false}
          onView={handleViewRegistration}
          onEdit={handleViewRegistration}
          onDelete={handleDeleteRegistration}
          customActions={[
            {
              type: 'custom',
              label: 'Approve',
              onClick: (row) => {
                if (row.status === 'Pending') handleApproveRegistration(row)
              }
            }
          ]}
          searchPlaceholder="Search company, registration #, category…"
          emptyMessage="No registrations found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Building size={20} className="me-2" />
            Registration details — {selectedRegistration?.companyName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRegistration ? (
            <div className="registration-details">
              <Row>
                <Col md={6}>
                  <h6 className="text-muted text-uppercase small">Company</h6>
                  <p className="mb-1">
                    <strong>Name:</strong> {selectedRegistration.companyName}
                  </p>
                  <p className="mb-1">
                    <strong>Category:</strong> {selectedRegistration.category}
                  </p>
                  <p className="mb-1">
                    <strong>Registration #:</strong>{' '}
                    {selectedRegistration.registrationNumber}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>{' '}
                    {getStatusBadge(selectedRegistration.status)}
                  </p>
                  <p className="mb-0">
                    <strong>Priority:</strong>{' '}
                    {getPriorityBadge(selectedRegistration.priority)}
                  </p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted text-uppercase small">Financial</h6>
                  <p className="mb-1">
                    <strong>Annual revenue:</strong>{' '}
                    {formatCurrency(selectedRegistration.annualRevenue)}
                  </p>
                  <p className="mb-1">
                    <strong>Employees:</strong>{' '}
                    {selectedRegistration.employeeCount}
                  </p>
                  <p className="mb-1">
                    <strong>Financial rating:</strong>{' '}
                    <Badge bg={getFinancialRatingColor(selectedRegistration.financialRating)}>
                      {selectedRegistration.financialRating}
                    </Badge>
                  </p>
                  <p className="mb-1">
                    <strong>Risk:</strong>{' '}
                    {getRiskBadge(selectedRegistration.riskLevel)}
                  </p>
                  <p className="mb-0">
                    <strong>Compliance:</strong>{' '}
                    {selectedRegistration.complianceScore}%
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <h6 className="text-muted text-uppercase small">Timeline</h6>
                  <p className="mb-1">
                    <strong>Registered:</strong>{' '}
                    {selectedRegistration.registrationDate}
                  </p>
                  <p className="mb-1">
                    <strong>Expires:</strong> {selectedRegistration.expiryDate}
                  </p>
                  <p className="mb-1">
                    <strong>Last audit:</strong> {selectedRegistration.lastAudit}
                  </p>
                  <p className="mb-0">
                    <strong>Next audit:</strong> {selectedRegistration.nextAudit}
                  </p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted text-uppercase small">Contact</h6>
                  <p className="mb-1">
                    <strong>Person:</strong> {selectedRegistration.contactPerson}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {selectedRegistration.contactEmail}
                  </p>
                  <p className="mb-0">
                    <strong>Phone:</strong> {selectedRegistration.contactPhone}
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6 className="text-muted text-uppercase small">
                    Certifications
                  </h6>
                  <div className="certifications-list">
                    {selectedRegistration.certifications?.length ? (
                      selectedRegistration.certifications.map((c, index) => (
                        <Badge key={index} bg="info" className="me-1 mb-1">
                          {c}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted">None on file</span>
                    )}
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6 className="text-muted text-uppercase small">
                    AI assessment & compliance
                  </h6>
                  <div className="alert alert-info d-flex align-items-start mb-2">
                    <Brain size={18} className="me-2 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Assessment:</strong>{' '}
                      {selectedRegistration.aiAssessment}
                    </div>
                  </div>
                  <div className="alert alert-success d-flex align-items-start mb-0">
                    <CheckCircle size={18} className="me-2 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Confidence:</strong>{' '}
                      {selectedRegistration.aiConfidence}% — based on compliance
                      analysis and financial stability signals (demo).
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <p className="text-muted mb-0">No row selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedRegistration?.status === 'Pending' ? (
            <Button
              variant="success"
              onClick={() => {
                handleApproveRegistration(selectedRegistration)
                setShowModal(false)
              }}
            >
              <Award size={16} className="me-2" />
              Approve
            </Button>
          ) : null}
          <Button
            variant="primary"
            onClick={() => setShowModal(false)}
            title="Wire to full edit flow when API is available"
          >
            <Edit size={16} className="me-2" />
            Edit registration
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PreQualificationRegistry
