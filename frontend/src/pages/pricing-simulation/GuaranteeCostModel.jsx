import React, { useState, useEffect } from 'react'
import { Button, Badge, Alert, Row, Col, Modal, Form } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Shield, Plus, DollarSign, AlertTriangle, Calculator, TrendingUp, FileText, Edit, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { toast } from 'react-toastify'
import './GuaranteeCostModel.scss'

const GuaranteeCostModel = () => {
  const navigate = useNavigate()
  const [guaranteeModels, setGuaranteeModels] = useState([])
  const [stats, setStats] = useState({})
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRiskModal, setShowRiskModal] = useState(false)
  const [selectedGuarantee, setSelectedGuarantee] = useState(null)

  // For form inputs
  const [formData, setFormData] = useState({
    guaranteeName: '',
    guaranteeType: 'Performance Bond',
    projectValue: 1000000,
    guaranteeAmount: 100000,
    guaranteePercentage: 10.0,
    currency: 'USD',
    duration: 12,
    durationUnit: 'months',
    riskLevel: 'Low',
    status: 'Active',
    issuer: '',
    beneficiary: '',
    premiumRate: 1.0,
    premiumAmount: 1000,
    aiRiskAssessment: 'Low risk profile',
    aiConfidence: 90,
    lastReview: new Date().toISOString().split('T')[0],
    nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdBy: 'Admin',
    priority: 'Medium'
  })

  useEffect(() => {
    // Mock data for guarantee cost models
    setGuaranteeModels([
      {
        id: 1,
        guaranteeName: 'Performance Guarantee - Highway Project',
        guaranteeType: 'Performance Bond',
        projectValue: 25000000,
        guaranteeAmount: 2500000,
        guaranteePercentage: 10.0,
        currency: 'USD',
        duration: 24,
        durationUnit: 'months',
        riskLevel: 'Medium',
        status: 'Active',
        issuer: 'Bank of America',
        beneficiary: 'Ministry of Transport',
        premiumRate: 1.5,
        premiumAmount: 37500,
        aiRiskAssessment: 'Moderate risk with stable project parameters',
        aiConfidence: 85,
        lastReview: '2024-02-14',
        nextReview: '2024-05-14',
        createdBy: 'John Doe',
        priority: 'High'
      },
      {
        id: 2,
        guaranteeName: 'Advance Payment Guarantee - Digital Platform',
        guaranteeType: 'Advance Payment',
        projectValue: 18000000,
        guaranteeAmount: 3600000,
        guaranteePercentage: 20.0,
        currency: 'USD',
        duration: 18,
        durationUnit: 'months',
        riskLevel: 'High',
        status: 'Active',
        issuer: 'JPMorgan Chase',
        beneficiary: 'Digital Transformation Authority',
        premiumRate: 2.2,
        premiumAmount: 79200,
        aiRiskAssessment: 'High risk due to technology complexity',
        aiConfidence: 78,
        lastReview: '2024-02-13',
        nextReview: '2024-05-13',
        createdBy: 'Jane Smith',
        priority: 'Critical'
      },
      {
        id: 3,
        guaranteeName: 'Warranty Guarantee - Medical Equipment',
        guaranteeType: 'Warranty Bond',
        projectValue: 32000000,
        guaranteeAmount: 1600000,
        guaranteePercentage: 5.0,
        currency: 'USD',
        duration: 36,
        durationUnit: 'months',
        riskLevel: 'Low',
        status: 'Active',
        issuer: 'Wells Fargo',
        beneficiary: 'Health Ministry',
        premiumRate: 0.8,
        premiumAmount: 12800,
        aiRiskAssessment: 'Low risk with proven equipment reliability',
        aiConfidence: 92,
        lastReview: '2024-02-12',
        nextReview: '2024-05-12',
        createdBy: 'Mike Johnson',
        priority: 'Medium'
      },
      {
        id: 4,
        guaranteeName: 'Bid Guarantee - Smart City Development',
        guaranteeType: 'Bid Bond',
        projectValue: 45000000,
        guaranteeAmount: 900000,
        guaranteePercentage: 2.0,
        currency: 'USD',
        duration: 6,
        durationUnit: 'months',
        riskLevel: 'Medium',
        status: 'Pending',
        issuer: 'Citibank',
        beneficiary: 'City Development Authority',
        premiumRate: 1.0,
        premiumAmount: 9000,
        aiRiskAssessment: 'Medium risk with complex urban requirements',
        aiConfidence: 80,
        lastReview: '2024-02-11',
        nextReview: '2024-05-11',
        createdBy: 'Sarah Wilson',
        priority: 'High'
      },
      {
        id: 5,
        guaranteeName: 'Retention Guarantee - Energy Project',
        guaranteeType: 'Retention Bond',
        projectValue: 28000000,
        guaranteeAmount: 1400000,
        guaranteePercentage: 5.0,
        currency: 'USD',
        duration: 12,
        durationUnit: 'months',
        riskLevel: 'Low',
        status: 'Active',
        issuer: 'Goldman Sachs',
        beneficiary: 'Energy Ministry',
        premiumRate: 0.9,
        premiumAmount: 12600,
        aiRiskAssessment: 'Low risk with established energy sector',
        aiConfidence: 88,
        lastReview: '2024-02-10',
        nextReview: '2024-05-10',
        createdBy: 'David Brown',
        priority: 'Medium'
      },
      {
        id: 6,
        guaranteeName: 'Maintenance Guarantee - Educational Platform',
        guaranteeType: 'Maintenance Bond',
        projectValue: 15000000,
        guaranteeAmount: 750000,
        guaranteePercentage: 5.0,
        currency: 'USD',
        duration: 24,
        durationUnit: 'months',
        riskLevel: 'Low',
        status: 'Active',
        issuer: 'Morgan Stanley',
        beneficiary: 'Education Ministry',
        premiumRate: 0.7,
        premiumAmount: 5250,
        aiRiskAssessment: 'Low risk with proven educational technology',
        aiConfidence: 90,
        lastReview: '2024-02-09',
        nextReview: '2024-05-09',
        createdBy: 'Lisa Davis',
        priority: 'Low'
      }
    ])

    setStats({
      totalGuarantees: 6,
      totalGuaranteeAmount: 10850000,
      totalPremiumAmount: 156350,
      activeGuarantees: 5,
      pendingGuarantees: 1,
      avgRiskLevel: 'Medium',
      totalProjectValue: 163000000,
      avgAiConfidence: 85
    })
  }, [])

  const handleViewGuarantee = (guarantee) => {
    setSelectedGuarantee(guarantee)
    setShowViewModal(true)
  }

  const handleEditGuarantee = (guarantee) => {
    setSelectedGuarantee(guarantee)
    setFormData({
      ...guarantee
    })
    setShowEditModal(true)
  }

  const handleDeleteGuarantee = (guarantee) => {
    if (window.confirm(`Are you sure you want to delete guarantee "${guarantee.guaranteeName}"?`)) {
      setGuaranteeModels(prev => prev.filter(g => g.id !== guarantee.id))
      toast.success(`Successfully deleted guarantee "${guarantee.guaranteeName}"!`)
    }
  }

  const handleCreateGuarantee = () => {
    setSelectedGuarantee(null)
    setFormData({
      guaranteeName: '',
      guaranteeType: 'Performance Bond',
      projectValue: 1000000,
      guaranteeAmount: 100000,
      guaranteePercentage: 10.0,
      currency: 'USD',
      duration: 12,
      durationUnit: 'months',
      riskLevel: 'Low',
      status: 'Active',
      issuer: '',
      beneficiary: '',
      premiumRate: 1.0,
      premiumAmount: 1000,
      aiRiskAssessment: 'Low risk profile',
      aiConfidence: 90,
      lastReview: new Date().toISOString().split('T')[0],
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: 'Admin',
      priority: 'Medium'
    })
    setShowEditModal(true)
  }

  const handleSaveGuarantee = (e) => {
    e.preventDefault()
    if (!formData.guaranteeName || !formData.issuer || !formData.beneficiary) {
      toast.error('Please fill in all required fields.')
      return
    }

    const calculatedPremium = (formData.guaranteeAmount * (formData.premiumRate / 100))
    const calculatedPercentage = ((formData.guaranteeAmount / formData.projectValue) * 100)

    const updatedData = {
      ...formData,
      premiumAmount: calculatedPremium,
      guaranteePercentage: parseFloat(calculatedPercentage.toFixed(2))
    }

    if (selectedGuarantee) {
      setGuaranteeModels(prev => prev.map(g => g.id === selectedGuarantee.id ? { ...g, ...updatedData } : g))
      toast.success(`Successfully updated guarantee "${formData.guaranteeName}"!`)
    } else {
      const newId = guaranteeModels.length ? Math.max(...guaranteeModels.map(g => g.id)) + 1 : 1
      const newGuarantee = {
        id: newId,
        ...updatedData
      }
      setGuaranteeModels(prev => [newGuarantee, ...prev])
      toast.success(`Successfully created new guarantee "${formData.guaranteeName}"!`)
    }

    setShowEditModal(false)
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'guaranteeName',
      label: 'Guarantee Details',
      width: '20%',
      render: (value, row) => (
        <div className="guarantee-info">
          <div className="fw-semibold d-flex align-items-center">
            <Shield size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.guaranteeType}</small>
          <div className="guarantee-meta">
            <small className="text-muted">Issuer: {row.issuer}</small>
          </div>
        </div>
      )
    },
    {
      key: 'projectValue',
      label: 'Project Value',
      width: '10%',
      render: (value, row) => (
        <div className="project-value">
          <div className="fw-bold text-primary">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">{row.currency}</small>
        </div>
      )
    },
    {
      key: 'guaranteeAmount',
      label: 'Guarantee Amount',
      width: '12%',
      render: (value, row) => (
        <div className="guarantee-amount">
          <div className="fw-bold text-warning">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">{row.guaranteePercentage}%</small>
        </div>
      )
    },
    {
      key: 'premiumAmount',
      label: 'Premium Amount',
      width: '10%',
      render: (value, row) => (
        <div className="premium-amount">
          <div className="fw-bold text-success">
            ${(value / 1000).toFixed(0)}K
          </div>
          <small className="text-muted">{row.premiumRate}% rate</small>
        </div>
      )
    },
    {
      key: 'duration',
      label: 'Duration',
      width: '8%',
      render: (value, row) => (
        <div className="duration">
          <div className="fw-bold text-info">{value}</div>
          <small className="text-muted">{row.durationUnit}</small>
        </div>
      )
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      width: '8%',
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
      key: 'status',
      label: 'Status',
      width: '8%',
      render: (value) => (
        <Badge bg={value === 'Active' ? 'success' : 'warning'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '8%',
      render: (value) => (
        <div className="ai-confidence">
          <div className="fw-bold text-info">{value}%</div>
          <small className="text-muted">confidence</small>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '8%',
      render: (value) => {
        const variants = {
          'Critical': 'danger',
          'High': 'warning',
          'Medium': 'info',
          'Low': 'success'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'nextReview',
      label: 'Next Review',
      width: '8%',
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

  const guaranteeM = (stats.totalGuaranteeAmount || 0) / 1000000
  const premiumK = (stats.totalPremiumAmount || 0) / 1000

  return (
    <>
      <ExecutiveCommandCenter
        className="guarantee-cost-model-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Guarantee Cost Model', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Guarantee Cost Model"
        description="Manage guarantee costs and risk assessment with AI-powered analysis"
        heroMeta="Risk capital"
        outlookTitle="Guarantee outlook"
        outlookDescription={`${stats.totalGuarantees || 0} programs — $${guaranteeM.toFixed(1)}M exposure, $${premiumK.toFixed(0)}K premium stack, ${stats.avgAiConfidence || 0}% AI confidence.`}
        outlookChips={[
          `${stats.totalGuarantees || 0} guarantees`,
          `$${guaranteeM.toFixed(1)}M exposure`,
          `$${premiumK.toFixed(0)}K premium`,
          `${stats.avgAiConfidence || 0}% AI confidence`
        ]}
        insights={[]}
        kpiTitle="Guarantee signal board"
        kpiMeta="Exposure vs premium"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total guarantees"
                value={stats.totalGuarantees || 0}
                hint="Booked instruments"
                tone="intel"
                trend="Coverage"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Guarantee amount"
                displayValue={`$${guaranteeM.toFixed(1)}M`}
                hint="Notional exposure"
                tone="success"
                trend="Scale"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total premium"
                displayValue={`$${premiumK.toFixed(0)}K`}
                hint="Cost of carry"
                tone="warning"
                trend="Spend"
                icon={<Calculator size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.avgAiConfidence || 0}
                hint="Risk model trust"
                tone="intel"
                trend="Assurance"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Guarantee cost models (${guaranteeModels.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateGuarantee}>
              <Plus size={16} className="me-2" />
              Create New Guarantee
            </Button>
            <Button variant="outline-secondary" onClick={() => toast.success("Guarantee Cost Report generated and downloaded successfully!")}>
              <FileText size={16} className="me-2" />
              Generate Report
            </Button>
          </>
        )}
      >
        {stats.pendingGuarantees > 0 && (
          <Alert variant="warning" className="d-flex align-items-center mb-3">
            <AlertTriangle size={20} className="me-2" />
            <div>
              <strong>Pending Guarantees:</strong> {stats.pendingGuarantees} guarantee(s) require review and approval. 
              Complete the approval process to activate guarantees.
            </div>
          </Alert>
        )}
        <DataTable
          data={guaranteeModels}
          columns={columns}
          title="Guarantee Cost Models"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewGuarantee}
          onEdit={handleEditGuarantee}
          onDelete={handleDeleteGuarantee}
          customActions={[
            {
              type: 'custom',
              label: 'Risk Assessment',
              onClick: (row) => {
                setSelectedGuarantee(row)
                setShowRiskModal(true)
              }
            }
          ]}
          searchPlaceholder="Search guarantee models..."
          emptyMessage="No guarantee cost models found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Shield size={20} className="me-2 text-primary" />
            Guarantee Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGuarantee && (
            <div className="p-2">
              <h5 className="mb-3 text-primary">{selectedGuarantee.guaranteeName}</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Guarantee Type:</strong> {selectedGuarantee.guaranteeType}
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> <Badge bg={selectedGuarantee.status === 'Active' ? 'success' : 'warning'}>{selectedGuarantee.status}</Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Issuer Bank:</strong> {selectedGuarantee.issuer}
                </Col>
                <Col md={6}>
                  <strong>Beneficiary:</strong> {selectedGuarantee.beneficiary}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Project Value:</strong> ${selectedGuarantee.projectValue.toLocaleString()} {selectedGuarantee.currency}
                </Col>
                <Col md={4}>
                  <strong>Guarantee Amount:</strong> ${selectedGuarantee.guaranteeAmount.toLocaleString()} ({selectedGuarantee.guaranteePercentage}%)
                </Col>
                <Col md={4}>
                  <strong>Premium Cost:</strong> ${selectedGuarantee.premiumAmount.toLocaleString()} ({selectedGuarantee.premiumRate}% rate)
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Duration:</strong> {selectedGuarantee.duration} {selectedGuarantee.durationUnit}
                </Col>
                <Col md={4}>
                  <strong>Risk Level:</strong> <Badge bg={selectedGuarantee.riskLevel === 'High' ? 'danger' : selectedGuarantee.riskLevel === 'Medium' ? 'warning' : 'success'}>{selectedGuarantee.riskLevel}</Badge>
                </Col>
                <Col md={4}>
                  <strong>Priority:</strong> <Badge bg={selectedGuarantee.priority === 'Critical' ? 'danger' : selectedGuarantee.priority === 'High' ? 'warning' : 'info'}>{selectedGuarantee.priority}</Badge>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>AI Risk Assessment</h6>
                  <Alert variant="info" className="d-flex align-items-start mt-2">
                    <Brain size={18} className="me-2 mt-1 flex-shrink-0" />
                    <div>
                      <div><strong>Analysis:</strong> {selectedGuarantee.aiRiskAssessment}</div>
                      <div className="mt-1 text-muted"><small>Confidence Level: {selectedGuarantee.aiConfidence}%</small></div>
                    </div>
                  </Alert>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          {selectedGuarantee && (
            <Button variant="primary" onClick={() => { setShowViewModal(false); handleEditGuarantee(selectedGuarantee); }}>
              <Edit size={16} className="me-2" />
              Edit Guarantee
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Edit/Create Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedGuarantee ? 'Edit Guarantee Cost Model' : 'Create New Guarantee Cost Model'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveGuarantee}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Guarantee Name *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.guaranteeName}
                onChange={e => setFormData(prev => ({ ...prev, guaranteeName: e.target.value }))}
                placeholder="e.g. Performance Guarantee - Highway Project"
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Guarantee Type</Form.Label>
                  <Form.Select
                    value={formData.guaranteeType}
                    onChange={e => setFormData(prev => ({ ...prev, guaranteeType: e.target.value }))}
                  >
                    <option value="Performance Bond">Performance Bond</option>
                    <option value="Advance Payment">Advance Payment</option>
                    <option value="Warranty Bond">Warranty Bond</option>
                    <option value="Bid Bond">Bid Bond</option>
                    <option value="Retention Bond">Retention Bond</option>
                    <option value="Maintenance Bond">Maintenance Bond</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Issuer Bank *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={e => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="e.g. Bank of America"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Beneficiary *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.beneficiary}
                    onChange={e => setFormData(prev => ({ ...prev, beneficiary: e.target.value }))}
                    placeholder="e.g. Ministry of Transport"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Project Value (USD) *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={formData.projectValue}
                    onChange={e => setFormData(prev => ({ ...prev, projectValue: parseFloat(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Guarantee Amount (USD) *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={formData.guaranteeAmount}
                    onChange={e => setFormData(prev => ({ ...prev, guaranteeAmount: parseFloat(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Premium Rate (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.premiumRate}
                    onChange={e => setFormData(prev => ({ ...prev, premiumRate: parseFloat(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.duration}
                    onChange={e => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Duration Unit</Form.Label>
                  <Form.Select
                    value={formData.durationUnit}
                    onChange={e => setFormData(prev => ({ ...prev, durationUnit: e.target.value }))}
                  >
                    <option value="months">months</option>
                    <option value="years">years</option>
                    <option value="days">days</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Risk Level</Form.Label>
                  <Form.Select
                    value={formData.riskLevel}
                    onChange={e => setFormData(prev => ({ ...prev, riskLevel: e.target.value }))}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>AI Confidence (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.aiConfidence}
                    onChange={e => setFormData(prev => ({ ...prev, aiConfidence: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>AI Risk Assessment Narrative</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.aiRiskAssessment}
                onChange={e => setFormData(prev => ({ ...prev, aiRiskAssessment: e.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {selectedGuarantee ? 'Save Changes' : 'Create Guarantee'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Risk Assessment Modal */}
      <Modal show={showRiskModal} onHide={() => setShowRiskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Brain size={20} className="me-2 text-info" />
            AI Risk Assessment Overview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGuarantee && (
            <div>
              <h6 className="text-primary">{selectedGuarantee.guaranteeName}</h6>
              <div className="mt-3">
                <strong>Model Confidence:</strong> {selectedGuarantee.aiConfidence}%
              </div>
              <div className="mt-2">
                <strong>Assessed Risk Category:</strong>{' '}
                <Badge bg={selectedGuarantee.riskLevel === 'High' ? 'danger' : selectedGuarantee.riskLevel === 'Medium' ? 'warning' : 'success'}>
                  {selectedGuarantee.riskLevel} Risk
                </Badge>
              </div>
              <div className="mt-3">
                <strong>Risk Analysis Narrative:</strong>
                <p className="mt-1 p-2 bg-light rounded text-dark">{selectedGuarantee.aiRiskAssessment}</p>
              </div>
              <Alert variant="warning" className="mt-3">
                <AlertTriangle size={16} className="me-2" />
                This analysis is generated based on standard exposure parameters and is meant for advisory purposes.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRiskModal(false)}>Dismiss</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default GuaranteeCostModel