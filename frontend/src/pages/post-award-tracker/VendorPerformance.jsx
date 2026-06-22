import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert, ProgressBar } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import PostAwardWorkspaceModal from './components/PostAwardWorkspaceModal'
import { exportRowsToExcel } from './utils/exportReport'
import { Search, Plus, Edit, Trash2, Eye, Users, Brain, CheckCircle, Star, FileText, Award, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast'
import './VendorPerformance.scss'

const VENDOR_FIELDS = [
  { name: 'name', label: 'Vendor name', placeholder: 'ABC Construction Ltd.', required: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    required: true,
    options: [
      { value: 'Construction', label: 'Construction' },
      { value: 'Technology', label: 'Technology' },
      { value: 'Logistics', label: 'Logistics' },
      { value: 'Professional Services', label: 'Professional Services' }
    ]
  },
  { name: 'contractValue', label: 'Contract value (USD)', type: 'number', min: 0, required: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Under Review', label: 'Under Review' },
      { value: 'Suspended', label: 'Suspended' }
    ]
  }
]

const createVendorFromForm = (formData, id) => ({
  id,
  name: formData.name,
  category: formData.category,
  contractValue: Number(formData.contractValue) || 0,
  performanceScore: 80,
  onTimeDelivery: 85,
  qualityRating: 4.0,
  costEfficiency: 80,
  status: formData.status,
  projects: 1,
  completed: 0,
  inProgress: 1,
  lastEvaluation: new Date().toISOString().split('T')[0],
  nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  aiInsights: 'New vendor added — schedule baseline performance review.',
  aiRecommendation: 'Collect delivery metrics during first project cycle.',
  riskLevel: 'Medium'
})

const VendorPerformance = () => {
  const navigate = useNavigate()
  const [vendors, setVendors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [editingVendor, setEditingVendor] = useState(null)

  useEffect(() => {
    setVendors([
      {
        id: 1,
        name: 'ABC Construction Ltd.',
        category: 'Construction',
        contractValue: 2500000,
        performanceScore: 92,
        onTimeDelivery: 95,
        qualityRating: 4.8,
        costEfficiency: 88,
        status: 'Active',
        projects: 3,
        completed: 2,
        inProgress: 1,
        lastEvaluation: '2024-01-20',
        nextReview: '2024-04-20',
        aiInsights: 'Excellent performance across all metrics. Consider for future high-value projects.',
        aiRecommendation: 'Extend contract and increase project allocation',
        riskLevel: 'Low'
      },
      {
        id: 2,
        name: 'Tech Solutions Inc.',
        category: 'Technology',
        contractValue: 1800000,
        performanceScore: 78,
        onTimeDelivery: 82,
        qualityRating: 4.2,
        costEfficiency: 75,
        status: 'Active',
        projects: 2,
        completed: 1,
        inProgress: 1,
        lastEvaluation: '2024-01-18',
        nextReview: '2024-04-18',
        aiInsights: 'Good performance but showing signs of resource constraints. Monitor closely.',
        aiRecommendation: 'Provide additional support and review resource allocation',
        riskLevel: 'Medium'
      },
      {
        id: 3,
        name: 'Global Logistics Corp.',
        category: 'Logistics',
        contractValue: 1200000,
        performanceScore: 65,
        onTimeDelivery: 70,
        qualityRating: 3.8,
        costEfficiency: 68,
        status: 'Under Review',
        projects: 4,
        completed: 2,
        inProgress: 2,
        lastEvaluation: '2024-01-15',
        nextReview: '2024-02-15',
        aiInsights: 'Performance below expectations. Multiple delivery delays and quality issues.',
        aiRecommendation: 'Implement improvement plan or consider contract termination',
        riskLevel: 'High'
      }
    ])
  }, [])

  const stats = useMemo(() => {
    const n = vendors.length
    if (!n) {
      return {
        totalVendors: 0,
        active: 0,
        underReview: 0,
        avgPerformanceScore: 0,
        avgOnTimeDelivery: 0,
        totalContractValue: 0,
        highPerformers: 0
      }
    }
    const avgPerformanceScore = Math.round(
      vendors.reduce((s, v) => s + (Number(v.performanceScore) || 0), 0) / n
    )
    const avgOnTimeDelivery = Math.round(
      vendors.reduce((s, v) => s + (Number(v.onTimeDelivery) || 0), 0) / n
    )
    const totalContractValue = vendors.reduce((s, v) => s + (Number(v.contractValue) || 0), 0)
    const highPerformers = vendors.filter((v) => (Number(v.performanceScore) || 0) >= 90).length
    return {
      totalVendors: n,
      active: vendors.filter((v) => v.status === 'Active').length,
      underReview: vendors.filter((v) => v.status === 'Under Review').length,
      avgPerformanceScore,
      avgOnTimeDelivery,
      totalContractValue,
      highPerformers
    }
  }, [vendors])

  const insights = useMemo(() => {
    const items = [
      {
        title: `${stats.totalVendors} vendors under performance management`,
        detail: `Avg score ${stats.avgPerformanceScore} with ${stats.avgOnTimeDelivery}% on-time delivery; ${stats.highPerformers} high performer(s).`,
        tone: 'info'
      }
    ]
    if (stats.underReview > 0) {
      items.push({
        title: `${stats.underReview} vendor(s) under review`,
        detail: 'Prioritize remediation plans and executive checkpoints before renewals.',
        tone: 'warning'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleViewVendor = (vendor) => {
    setSelectedVendor(vendor)
    setShowModal(true)
  }

  const handleDeleteVendor = (vendor) => {
    if (window.confirm(`Are you sure you want to remove vendor "${vendor.name}"?`)) {
      setVendors((prev) => prev.filter((v) => v.id !== vendor.id))
      showToast.success(`Vendor "${vendor.name}" removed`)
    }
  }

  const handleAddVendor = () => {
    setEditingVendor(null)
    setShowFormModal(true)
  }

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor)
    setShowFormModal(true)
  }

  const handleSaveVendor = (formData) => {
    if (editingVendor) {
      setVendors((prev) =>
        prev.map((vendor) =>
          vendor.id === editingVendor.id
            ? {
                ...vendor,
                name: formData.name,
                category: formData.category,
                contractValue: Number(formData.contractValue) || vendor.contractValue,
                status: formData.status
              }
            : vendor
        )
      )
      if (selectedVendor?.id === editingVendor.id) {
        setSelectedVendor((prev) =>
          prev
            ? {
                ...prev,
                name: formData.name,
                category: formData.category,
                contractValue: Number(formData.contractValue) || prev.contractValue,
                status: formData.status
              }
            : prev
        )
      }
      showToast.success(`Vendor "${formData.name}" updated`)
    } else {
      const newVendor = createVendorFromForm(formData, Date.now())
      setVendors((prev) => [...prev, newVendor])
      showToast.success(`Vendor "${formData.name}" added`)
    }
    setShowFormModal(false)
    setEditingVendor(null)
  }

  const handleExportReport = () => {
    exportRowsToExcel(
      vendors.map((vendor) => ({
        Name: vendor.name,
        Category: vendor.category,
        'Contract Value': vendor.contractValue,
        'Performance Score': vendor.performanceScore,
        'On-Time Delivery': vendor.onTimeDelivery,
        'Quality Rating': vendor.qualityRating,
        Status: vendor.status,
        'Risk Level': vendor.riskLevel
      })),
      { sheetName: 'Vendor Performance', fileName: 'vendor_performance_report.xlsx' }
    )
  }

  const handleUpdatePerformance = () => {
    if (!selectedVendor) return
    setShowModal(false)
    handleEditVendor(selectedVendor)
  }

  const getStatusBadge = (status) => {
    const variants = {
      Active: 'success',
      'Under Review': 'warning',
      Suspended: 'danger',
      Inactive: 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getRiskBadge = (risk) => {
    const variants = {
      Low: 'success',
      Medium: 'warning',
      High: 'danger'
    }
    return <Badge bg={variants[risk] || 'secondary'}>{risk} Risk</Badge>
  }

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 75) return 'primary'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="vendor-performance-page"
        breadcrumbs={[
          { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
          { label: 'Vendor Performance', active: true }
        ]}
        onBack={() => navigate('/post-award-tracker')}
        backLabel="Back to modules"
        title="Vendor performance command center"
        description="Monitor and evaluate vendor performance with AI-assisted insights across the portfolio."
        heroMeta="Delivery & quality signals"
        outlookTitle="Supplier performance outlook"
        outlookDescription={`${stats.totalVendors} vendors — avg score ${stats.avgPerformanceScore}, ${stats.avgOnTimeDelivery}% on-time delivery.`}
        outlookChips={[
          `${stats.totalVendors} vendors`,
          `${stats.active} active`,
          `${stats.underReview} under review`,
          `${stats.highPerformers} top tier`
        ]}
        insights={insights}
        kpiTitle="Performance signal board"
        kpiMeta="Scores, punctuality, and portfolio value"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total vendors"
                value={stats.totalVendors}
                hint="Tracked suppliers"
                tone="intel"
                trend="Portfolio"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg performance"
                value={stats.avgPerformanceScore}
                hint="Composite score"
                tone={
                  stats.avgPerformanceScore >= 85 ? 'success' : stats.avgPerformanceScore >= 70 ? 'warning' : 'danger'
                }
                trend="Score"
                suffix="%"
                icon={<Award size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="On-time delivery"
                value={stats.avgOnTimeDelivery}
                hint="Rolling punctuality"
                tone={stats.avgOnTimeDelivery >= 85 ? 'success' : 'warning'}
                trend="Delivery"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Portfolio value"
                value={stats.totalContractValue}
                hint="Active commitments"
                tone="primary"
                trend="Spend"
                displayValue={formatCurrency(stats.totalContractValue)}
                icon={<FileText size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle={`Vendor performance overview (${vendors.length})`}
        tableActions={
          <>
            <Button variant="primary" className="me-2" onClick={handleAddVendor}>
              <Plus size={16} className="me-2" />
              Add Vendor
            </Button>
            <Button variant="outline-secondary" onClick={handleExportReport}>
              <FileText size={16} className="me-2" />
              Export Report
            </Button>
          </>
        }
      >
        <Row className="mb-3">
          <Col md={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search vendors..."
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
                <th>Vendor Details</th>
                <th>Category</th>
                <th>Performance Score</th>
                <th>On-Time Delivery</th>
                <th>Quality Rating</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors
                .filter(
                  (vendor) =>
                    !searchTerm ||
                    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((vendor) => (
                  <tr key={vendor.id}>
                    <td>
                      <div className="vendor-info">
                        <h6 className="mb-1">{vendor.name}</h6>
                        <p className="text-muted mb-1">
                          {formatCurrency(vendor.contractValue)} • {vendor.projects} projects
                        </p>
                        <small className="text-muted">
                          Last evaluation: {vendor.lastEvaluation} • Next review: {vendor.nextReview}
                        </small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info" className="category-badge">
                        {vendor.category}
                      </Badge>
                    </td>
                    <td>
                      <div className="performance-score">
                        <Badge bg={getPerformanceColor(vendor.performanceScore)}>{vendor.performanceScore}%</Badge>
                      </div>
                    </td>
                    <td>
                      <div className="delivery-metric">
                        <ProgressBar
                          now={vendor.onTimeDelivery}
                          variant={
                            vendor.onTimeDelivery >= 90 ? 'success' : vendor.onTimeDelivery >= 75 ? 'primary' : 'warning'
                          }
                          className="mb-1"
                        />
                        <small>{vendor.onTimeDelivery}%</small>
                      </div>
                    </td>
                    <td>
                      <div className="quality-rating">
                        <div className="d-flex align-items-center">
                          <Star size={16} className="me-1 text-warning" />
                          <span>{vendor.qualityRating}</span>
                        </div>
                      </div>
                    </td>
                    <td>{getStatusBadge(vendor.status)}</td>
                    <td>{getRiskBadge(vendor.riskLevel)}</td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleViewVendor(vendor)}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button variant="outline-success" size="sm" className="me-1" onClick={() => handleEditVendor(vendor)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteVendor(vendor)}>
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
            <Users size={20} className="me-2" />
            Vendor Performance Details - {selectedVendor?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVendor && (
            <div className="vendor-details">
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p>
                    <strong>Category:</strong> {selectedVendor.category}
                  </p>
                  <p>
                    <strong>Contract Value:</strong> {formatCurrency(selectedVendor.contractValue)}
                  </p>
                  <p>
                    <strong>Projects:</strong> {selectedVendor.projects} ({selectedVendor.completed} completed,{' '}
                    {selectedVendor.inProgress} in progress)
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedVendor.status}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Performance Metrics</h6>
                  <p>
                    <strong>Performance Score:</strong> {selectedVendor.performanceScore}%
                  </p>
                  <p>
                    <strong>On-Time Delivery:</strong> {selectedVendor.onTimeDelivery}%
                  </p>
                  <p>
                    <strong>Quality Rating:</strong> {selectedVendor.qualityRating}/5.0
                  </p>
                  <p>
                    <strong>Cost Efficiency:</strong> {selectedVendor.costEfficiency}%
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>AI Insights & Recommendations</h6>
                  <Alert variant="info">
                    <Brain size={16} className="me-2" />
                    <strong>Insights:</strong> {selectedVendor.aiInsights}
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle size={16} className="me-2" />
                    <strong>Recommendation:</strong> {selectedVendor.aiRecommendation}
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
          <Button variant="primary" onClick={handleUpdatePerformance}>
            <Edit size={16} className="me-2" />
            Update Performance
          </Button>
        </Modal.Footer>
      </Modal>

      <PostAwardWorkspaceModal
        show={showFormModal}
        onHide={() => {
          setShowFormModal(false)
          setEditingVendor(null)
        }}
        title={editingVendor ? 'Edit vendor' : 'Add vendor'}
        description="Capture supplier details for performance tracking."
        submitLabel={editingVendor ? 'Save changes' : 'Add vendor'}
        fields={VENDOR_FIELDS}
        initialValues={
          editingVendor
            ? {
                name: editingVendor.name,
                category: editingVendor.category,
                contractValue: editingVendor.contractValue,
                status: editingVendor.status
              }
            : { status: 'Active' }
        }
        onSubmit={handleSaveVendor}
      />
    </>
  )
}

export default VendorPerformance
