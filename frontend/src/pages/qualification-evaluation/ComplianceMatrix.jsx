import React, { useState, useMemo } from 'react'
import { Row, Col, Badge, Button, Form, Modal, ProgressBar, Table } from 'react-bootstrap'
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Plus,
  Download,
  Clock,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './ComplianceMatrix.scss'

const ComplianceMatrix = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTender, setSelectedTender] = useState(null)

  // Realistic dummy data
  const complianceData = [
    {
      id: 1,
      tenderName: "Highway Infrastructure Development - Phase 2",
      client: "Ministry of Transport",
      value: "$45.2M",
      status: "In Progress",
      complianceScore: 87,
      requirements: 24,
      completed: 21,
      pending: 3,
      riskLevel: "Low",
      lastUpdated: "2024-01-15",
      assignedTo: "Sarah Johnson",
      category: "Infrastructure"
    },
    {
      id: 2,
      tenderName: "Smart City Technology Implementation",
      client: "City Development Authority",
      value: "$28.7M",
      status: "Under Review",
      complianceScore: 92,
      requirements: 18,
      completed: 17,
      pending: 1,
      riskLevel: "Low",
      lastUpdated: "2024-01-14",
      assignedTo: "Michael Chen",
      category: "Technology"
    },
    {
      id: 3,
      tenderName: "Healthcare Facility Construction",
      client: "Health Ministry",
      value: "$67.8M",
      status: "Compliance Issues",
      complianceScore: 65,
      requirements: 32,
      completed: 21,
      pending: 11,
      riskLevel: "High",
      lastUpdated: "2024-01-13",
      assignedTo: "Emily Rodriguez",
      category: "Healthcare"
    },
    {
      id: 4,
      tenderName: "Renewable Energy Power Plant",
      client: "Energy Corporation",
      value: "$125.4M",
      status: "In Progress",
      complianceScore: 78,
      requirements: 28,
      completed: 22,
      pending: 6,
      riskLevel: "Medium",
      lastUpdated: "2024-01-12",
      assignedTo: "David Kim",
      category: "Energy"
    },
    {
      id: 5,
      tenderName: "Educational Campus Development",
      client: "Education Board",
      value: "$34.6M",
      status: "Completed",
      complianceScore: 95,
      requirements: 15,
      completed: 15,
      pending: 0,
      riskLevel: "Low",
      lastUpdated: "2024-01-10",
      assignedTo: "Lisa Wang",
      category: "Education"
    },
    {
      id: 6,
      tenderName: "Financial Services Platform",
      client: "Banking Authority",
      value: "$52.3M",
      status: "In Progress",
      complianceScore: 72,
      requirements: 22,
      completed: 16,
      pending: 6,
      riskLevel: "Medium",
      lastUpdated: "2024-01-16",
      assignedTo: "James Wilson",
      category: "Financial"
    },
    {
      id: 7,
      tenderName: "Manufacturing Equipment Supply",
      client: "Manufacturing Corp",
      value: "$89.1M",
      status: "Under Review",
      complianceScore: 88,
      requirements: 19,
      completed: 17,
      pending: 2,
      riskLevel: "Low",
      lastUpdated: "2024-01-17",
      assignedTo: "Maria Garcia",
      category: "Manufacturing"
    },
    {
      id: 8,
      tenderName: "Real Estate Development",
      client: "Development Authority",
      value: "$156.7M",
      status: "Compliance Issues",
      complianceScore: 58,
      requirements: 35,
      completed: 20,
      pending: 15,
      riskLevel: "High",
      lastUpdated: "2024-01-18",
      assignedTo: "Robert Taylor",
      category: "Real Estate"
    }
  ]

  const complianceRequirements = [
    {
      id: 1,
      requirement: "ISO 9001:2015 Quality Management System",
      category: "Quality",
      status: "Completed",
      dueDate: "2024-01-20",
      assignedTo: "Quality Team",
      documents: 3,
      riskLevel: "Low"
    },
    {
      id: 2,
      requirement: "Environmental Impact Assessment",
      category: "Environmental",
      status: "In Progress",
      dueDate: "2024-01-25",
      assignedTo: "Environmental Team",
      documents: 1,
      riskLevel: "Medium"
    },
    {
      id: 3,
      requirement: "Financial Stability Certificate",
      category: "Financial",
      status: "Pending",
      dueDate: "2024-01-30",
      assignedTo: "Finance Team",
      documents: 0,
      riskLevel: "High"
    },
    {
      id: 4,
      requirement: "Technical Capability Statement",
      category: "Technical",
      status: "Completed",
      dueDate: "2024-01-15",
      assignedTo: "Technical Team",
      documents: 5,
      riskLevel: "Low"
    },
    {
      id: 5,
      requirement: "Safety Management System",
      category: "Safety",
      status: "Under Review",
      dueDate: "2024-01-28",
      assignedTo: "Safety Team",
      documents: 2,
      riskLevel: "Medium"
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'Completed': 'success',
      'In Progress': 'primary',
      'Under Review': 'warning',
      'Compliance Issues': 'danger',
      'Pending': 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const handleViewCompliance = (tender) => {
    console.log('View compliance:', tender)
    // Navigate to view compliance or open view modal
  }

  const handleEditCompliance = (tender) => {
    console.log('Edit compliance:', tender)
    // Navigate to edit compliance or open edit modal
  }

  const handleDeleteCompliance = (tender) => {
    if (window.confirm(`Are you sure you want to delete compliance for "${tender.tenderName}"?`)) {
      console.log('Delete compliance:', tender)
      // Add delete logic here
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'tenderName',
      label: 'Tender Details',
      width: '25%',
      render: (value, row) => (
        <div className="tender-info">
          <div className="fw-semibold d-flex align-items-center">
            <Shield size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">Client: {row.client}</small>
          <div className="tender-meta">
            <small className="text-muted">Category: {row.category}</small>
          </div>
        </div>
      )
    },
    {
      key: 'value',
      label: 'Value',
      width: '10%',
      render: (value) => (
        <div className="value-info">
          <div className="fw-bold text-primary">{value}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'complianceScore',
      label: 'Compliance Score',
      width: '15%',
      render: (value) => (
        <div className="score-info">
          <div className="fw-bold text-primary">{value}%</div>
          <ProgressBar
            now={value}
            variant={value >= 90 ? 'success' : value >= 75 ? 'primary' : value >= 60 ? 'warning' : 'danger'}
            size="sm"
            style={{ height: '6px' }}
          />
        </div>
      )
    },
    {
      key: 'requirements',
      label: 'Requirements',
      width: '12%',
      render: (value, row) => (
        <div className="requirements-info">
          <div className="fw-medium">{value} total</div>
          <small className="text-muted">
            {row.completed} completed, {row.pending} pending
          </small>
        </div>
      )
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      width: '10%',
      render: (value) => {
        const variants = {
          'Low': 'success',
          'Medium': 'warning',
          'High': 'danger'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      width: '12%'
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      width: '12%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    }
  ]

  const getRiskBadge = (risk) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return <Badge bg={variants[risk] || 'secondary'}>{risk} Risk</Badge>
  }

  const filteredData = complianceData.filter(item => {
    const matchesSearch = item.tenderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const tenderCount = complianceData.length
  const avgCompliance = tenderCount ? Math.round(complianceData.reduce((s, r) => s + (r.complianceScore || 0), 0) / tenderCount) : 0
  const highRiskCount = complianceData.filter((r) => r.riskLevel === 'High').length
  const totalReq = complianceData.reduce((s, r) => s + (r.requirements || 0), 0)

  const insightItems = useMemo(() => {
    const items = []
    if (tenderCount > 0) {
      items.push({
        title: `${tenderCount} tenders with ${totalReq} discrete requirement checkpoints`,
        detail: `Average compliance posture ${avgCompliance}% with ${highRiskCount} tenders in elevated remediation.`,
        tone: highRiskCount > 0 ? 'warning' : 'info'
      })
    }
    if (highRiskCount > 0) {
      items.push({
        title: 'Focus reviewer capacity on weakest score bands',
        detail: 'Pair legal and technical owners on high-risk lines before approvals.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Stand up per-tender matrices',
        detail: 'Map clauses to artifact owners so evidence survives audit.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [tenderCount, avgCompliance, highRiskCount, totalReq])

  const handleViewDetails = (tender) => {
    setSelectedTender(tender)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="compliance-matrix-page"
        breadcrumbs={[
          { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
          { label: 'Compliance matrix', active: true }
        ]}
        onBack={() => navigate('/qualification-evaluation')}
        backLabel="Back to modules"
        title="Compliance matrix command center"
        description="Trace obligations, evidence maturity, and risk concentration across every tender in qualification."
        heroMeta="Obligation telemetry"
        outlookTitle="Score & risk outlook"
        outlookDescription={`${tenderCount} tenders — ${avgCompliance}% average compliance — ${highRiskCount} high-risk profiles.`}
        outlookChips={[
          `${tenderCount} tenders`,
          `${avgCompliance}% avg score`,
          `${highRiskCount} high risk`,
          `${totalReq} requirements`
        ]}
        insights={insightItems}
        kpiTitle="Compliance signal board"
        kpiMeta="Coverage vs exposure"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Tenders tracked"
                value={tenderCount}
                hint="Active matrix rows"
                tone="intel"
                trend="Coverage"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg compliance"
                value={avgCompliance}
                hint="Blended portfolio score"
                tone={avgCompliance >= 80 ? 'success' : 'warning'}
                trend="Quality"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="High risk"
                value={highRiskCount}
                hint="Tenders needing focus"
                tone={highRiskCount > 0 ? 'warning' : 'success'}
                trend="Exposure"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Requirements"
                value={totalReq}
                hint="Checkpoint volume"
                tone="warning"
                trend="Density"
                icon={<TrendingUp size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Compliance matrix (${filteredData.length})`}
        tableActions={(
          <>
            <Button variant="outline-primary" className="me-2">
              <Download size={16} className="me-2" />
              Export report
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} className="me-2" />
              Add compliance
            </Button>
          </>
        )}
      >
        <Row className="g-3 mb-3">
          <Col xs={12} md={6} lg={4}>
            <Form.Group>
              <Form.Label className="small text-muted mb-1">Search</Form.Label>
              <Form.Control
                placeholder="Tender or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Form.Group>
              <Form.Label className="small text-muted mb-1">Status</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="In Progress">In progress</option>
                <option value="Under Review">Under review</option>
                <option value="Compliance Issues">Compliance issues</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <DataTable
          data={filteredData}
          columns={columns}
          title="Compliance Matrix Overview"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewCompliance}
          onEdit={handleEditCompliance}
          onDelete={handleDeleteCompliance}
          customActions={[
            {
              type: 'custom',
              label: 'View Analytics',
              onClick: (row) => {
                console.log('View analytics for:', row.tenderName);
              }
            }
          ]}
          searchPlaceholder="Search tenders or clients..."
          emptyMessage="No compliance data found"
          loading={false}
        />
      </ExecutiveCommandCenter>

        {/* Detailed Requirements Modal */}
        <Modal show={selectedTender !== null} onHide={() => setSelectedTender(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Shield size={20} className="me-2" />
              Compliance Requirements - {selectedTender?.tenderName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTender && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Client:</strong> {selectedTender.client}
                  </Col>
                  <Col md={6}>
                    <strong>Value:</strong> {selectedTender.value}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Status:</strong> {getStatusBadge(selectedTender.status)}
                  </Col>
                  <Col md={6}>
                    <strong>Risk Level:</strong> {getRiskBadge(selectedTender.riskLevel)}
                  </Col>
                </Row>
                
                <hr />
                
                <h6>Compliance Requirements</h6>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Requirement</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Assigned To</th>
                      <th>Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceRequirements.map((req) => (
                      <tr key={req.id}>
                        <td>{req.requirement}</td>
                        <td>
                          <Badge bg="info">{req.category}</Badge>
                        </td>
                        <td>{getStatusBadge(req.status)}</td>
                        <td>
                          <Clock size={14} className="me-1" />
                          {req.dueDate}
                        </td>
                        <td>{req.assignedTo}</td>
                        <td>
                          <Badge bg={req.documents > 0 ? 'success' : 'secondary'}>
                            {req.documents} docs
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedTender(null)}>
              Close
            </Button>
            <Button variant="primary">
              <Download size={16} className="me-2" />
              Export Details
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default ComplianceMatrix