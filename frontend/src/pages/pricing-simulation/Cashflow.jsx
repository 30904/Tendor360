import React, { useState, useEffect } from 'react'
import { Button, Badge, Alert, Row, Col, Modal, Form } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { TrendingUp, Plus, DollarSign, Calendar, Target, AlertTriangle, Edit, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { toast } from 'react-toastify'
import './Cashflow.scss'

const Cashflow = () => {
  const navigate = useNavigate()
  const [cashflows, setCashflows] = useState([])
  const [stats, setStats] = useState({})
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showForecastModal, setShowForecastModal] = useState(false)
  const [selectedCashflow, setSelectedCashflow] = useState(null)

  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    totalValue: 0,
    currency: 'USD',
    status: 'Active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currentPhase: 'Planning',
    progress: 0,
    cashInflow: 0,
    cashOutflow: 0,
    netCashflow: 0,
    aiForecast: '',
    riskLevel: 'Low',
    priority: 'Medium',
    lastUpdate: new Date().toISOString().split('T')[0],
    nextMilestone: '',
    daysRemaining: 100
  })

  useEffect(() => {
    // Mock data for cashflows
    setCashflows([
      {
        id: 1,
        projectName: 'Highway Construction Phase 3',
        client: 'Ministry of Transport',
        totalValue: 25000000,
        currency: 'USD',
        status: 'Active',
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        currentPhase: 'Construction',
        progress: 45,
        cashInflow: 11250000,
        cashOutflow: 8750000,
        netCashflow: 2500000,
        aiForecast: 'Positive cashflow expected with 15% variance',
        riskLevel: 'Medium',
        priority: 'High',
        lastUpdate: '2024-02-14',
        nextMilestone: 'Phase 2 Completion',
        daysRemaining: 45
      },
      {
        id: 2,
        projectName: 'Digital Government Platform',
        client: 'Digital Transformation Authority',
        totalValue: 18000000,
        currency: 'USD',
        status: 'Active',
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        currentPhase: 'Development',
        progress: 25,
        cashInflow: 4500000,
        cashOutflow: 5200000,
        netCashflow: -700000,
        aiForecast: 'Negative cashflow in early stages, positive by Q3',
        riskLevel: 'High',
        priority: 'Medium',
        lastUpdate: '2024-02-13',
        nextMilestone: 'Alpha Release',
        daysRemaining: 60
      },
      {
        id: 3,
        projectName: 'Healthcare Infrastructure Upgrade',
        client: 'Health Ministry',
        totalValue: 32000000,
        currency: 'USD',
        status: 'Active',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        currentPhase: 'Implementation',
        progress: 65,
        cashInflow: 20800000,
        cashOutflow: 19500000,
        netCashflow: 1300000,
        aiForecast: 'Strong positive cashflow with minimal risk',
        riskLevel: 'Low',
        priority: 'Critical',
        lastUpdate: '2024-02-12',
        nextMilestone: 'System Integration',
        daysRemaining: 30
      },
      {
        id: 4,
        projectName: 'Smart City Development',
        client: 'City Development Authority',
        totalValue: 45000000,
        currency: 'USD',
        status: 'Planning',
        startDate: '2024-05-01',
        endDate: '2026-04-30',
        currentPhase: 'Design',
        progress: 15,
        cashInflow: 0,
        cashOutflow: 2500000,
        netCashflow: -2500000,
        aiForecast: 'Initial negative cashflow, positive from month 6',
        riskLevel: 'Medium',
        priority: 'High',
        lastUpdate: '2024-02-11',
        nextMilestone: 'Design Approval',
        daysRemaining: 75
      },
      {
        id: 5,
        projectName: 'Renewable Energy Project',
        client: 'Energy Ministry',
        totalValue: 28000000,
        currency: 'USD',
        status: 'Active',
        startDate: '2024-06-01',
        endDate: '2025-05-31',
        currentPhase: 'Procurement',
        progress: 30,
        cashInflow: 8400000,
        cashOutflow: 9200000,
        netCashflow: -800000,
        aiForecast: 'Negative cashflow until equipment delivery',
        riskLevel: 'Medium',
        priority: 'Medium',
        lastUpdate: '2024-02-10',
        nextMilestone: 'Equipment Delivery',
        daysRemaining: 90
      },
      {
        id: 6,
        projectName: 'Educational Technology Platform',
        client: 'Education Ministry',
        totalValue: 15000000,
        currency: 'USD',
        status: 'Active',
        startDate: '2024-02-01',
        endDate: '2024-11-30',
        currentPhase: 'Testing',
        progress: 80,
        cashInflow: 12000000,
        cashOutflow: 10500000,
        netCashflow: 1500000,
        aiForecast: 'Consistent positive cashflow with low risk',
        riskLevel: 'Low',
        priority: 'High',
        lastUpdate: '2024-02-09',
        nextMilestone: 'Beta Launch',
        daysRemaining: 15
      }
    ])

    setStats({
      totalProjects: 6,
      totalValue: 163000000,
      activeProjects: 5,
      totalCashInflow: 56950000,
      totalCashOutflow: 54650000,
      netCashflow: 2300000,
      avgProgress: 43,
      criticalDeadlines: 2
    })
  }, [])

  const handleViewCashflow = (cashflow) => {
    setSelectedCashflow(cashflow)
    setShowViewModal(true)
  }

  const handleEditCashflow = (cashflow) => {
    setSelectedCashflow(cashflow)
    setFormData({
      ...cashflow
    })
    setShowEditModal(true)
  }

  const handleDeleteCashflow = (cashflow) => {
    if (window.confirm(`Are you sure you want to delete cashflow configuration for "${cashflow.projectName}"?`)) {
      setCashflows(prev => prev.filter(c => c.id !== cashflow.id))
      toast.success(`Successfully deleted cashflow for "${cashflow.projectName}"!`)
    }
  }

  const handleCreateCashflow = () => {
    setSelectedCashflow(null)
    setFormData({
      projectName: '',
      client: '',
      totalValue: 0,
      currency: 'USD',
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currentPhase: 'Planning',
      progress: 0,
      cashInflow: 0,
      cashOutflow: 0,
      netCashflow: 0,
      aiForecast: 'Optimistic inflows expected',
      riskLevel: 'Low',
      priority: 'Medium',
      lastUpdate: new Date().toISOString().split('T')[0],
      nextMilestone: 'Kickoff',
      daysRemaining: 100
    })
    setShowEditModal(true)
  }

  const handleSaveCashflow = (e) => {
    e.preventDefault()
    if (!formData.projectName || !formData.client) {
      toast.error('Please fill in all required fields.')
      return
    }

    const calculatedNet = formData.cashInflow - formData.cashOutflow

    const updatedData = {
      ...formData,
      netCashflow: calculatedNet,
      lastUpdate: new Date().toISOString().split('T')[0]
    }

    if (selectedCashflow) {
      setCashflows(prev => prev.map(c => c.id === selectedCashflow.id ? { ...c, ...updatedData } : c))
      toast.success(`Successfully updated cashflow for "${formData.projectName}"!`)
    } else {
      const newId = cashflows.length ? Math.max(...cashflows.map(c => c.id)) + 1 : 1
      const newCashflow = {
        id: newId,
        ...updatedData
      }
      setCashflows(prev => [newCashflow, ...prev])
      toast.success(`Successfully created new cashflow program for "${formData.projectName}"!`)
    }

    setShowEditModal(false)
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'projectName',
      label: 'Project Details',
      width: '20%',
      render: (value, row) => (
        <div className="project-info">
          <div className="fw-semibold d-flex align-items-center">
            <Target size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.client}</small>
          <div className="project-meta">
            <small className="text-muted">Phase: {row.currentPhase}</small>
          </div>
        </div>
      )
    },
    {
      key: 'totalValue',
      label: 'Total Value',
      width: '10%',
      render: (value, row) => (
        <div className="total-value">
          <div className="fw-bold text-primary">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">{row.currency}</small>
        </div>
      )
    },
    {
      key: 'progress',
      label: 'Progress',
      width: '8%',
      render: (value) => (
        <div className="progress-info">
          <div className="fw-bold text-success">{value}%</div>
          <small className="text-muted">complete</small>
        </div>
      )
    },
    {
      key: 'cashInflow',
      label: 'Cash Inflow',
      width: '10%',
      render: (value) => (
        <div className="cash-inflow">
          <div className="fw-bold text-success">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">inflow</small>
        </div>
      )
    },
    {
      key: 'cashOutflow',
      label: 'Cash Outflow',
      width: '10%',
      render: (value) => (
        <div className="cash-outflow">
          <div className="fw-bold text-danger">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">outflow</small>
        </div>
      )
    },
    {
      key: 'netCashflow',
      label: 'Net Cashflow',
      width: '10%',
      render: (value) => (
        <div className="net-cashflow">
          <div className={`fw-bold ${value >= 0 ? 'text-success' : 'text-danger'}`}>
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">net</small>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '8%',
      render: (value) => (
        <Badge bg={value === 'Active' ? 'success' : 'secondary'}>
          {value}
        </Badge>
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
      key: 'daysRemaining',
      label: 'Days Remaining',
      width: '8%',
      render: (value) => (
        <div className="days-remaining">
          <div className="fw-bold text-warning">{value}</div>
          <small className="text-muted">days</small>
        </div>
      )
    },
    {
      key: 'endDate',
      label: 'End Date',
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

  const totalValM = (stats.totalValue || 0) / 1000000
  const netCfM = (stats.netCashflow || 0) / 1000000

  return (
    <>
      <ExecutiveCommandCenter
        className="cashflow-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Cashflow', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Cashflow"
        description="Manage project cashflow and financial planning with AI-powered forecasting"
        heroMeta="Liquidity"
        outlookTitle="Cashflow outlook"
        outlookDescription={`${stats.totalProjects || 0} projects — $${totalValM.toFixed(0)}M book, $${netCfM.toFixed(1)}M net cashflow, ${stats.criticalDeadlines || 0} critical deadline flags.`}
        outlookChips={[
          `${stats.totalProjects || 0} projects`,
          `$${totalValM.toFixed(0)}M value`,
          `$${netCfM.toFixed(1)}M net`,
          `${stats.criticalDeadlines || 0} critical`
        ]}
        insights={[]}
        kpiTitle="Cashflow signal board"
        kpiMeta="Projects vs runway"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total projects"
                value={stats.totalProjects || 0}
                hint="Active programs"
                tone="intel"
                trend="Coverage"
                icon={<Target size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total value"
                displayValue={`$${totalValM.toFixed(0)}M`}
                hint="Contracted book"
                tone="success"
                trend="Scale"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Net cashflow"
                displayValue={`$${netCfM.toFixed(1)}M`}
                hint="Forecast posture"
                tone="intel"
                trend="Trajectory"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Critical deadlines"
                value={stats.criticalDeadlines || 0}
                hint="Needs steering"
                tone={(stats.criticalDeadlines || 0) > 0 ? 'warning' : 'success'}
                trend="Risk"
                icon={<Calendar size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Project cashflow (${cashflows.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateCashflow}>
              <Plus size={16} className="me-2" />
              Create New Cashflow
            </Button>
            <Button variant="outline-secondary" onClick={() => toast.success("Cashflow projection report exported successfully!")}>
              <TrendingUp size={16} className="me-2" />
              Export Report
            </Button>
          </>
        )}
      >
        {stats.criticalDeadlines > 0 && (
          <Alert variant="warning" className="d-flex align-items-center mb-3">
            <AlertTriangle size={20} className="me-2" />
            <div>
              <strong>Critical Deadlines Alert:</strong> {stats.criticalDeadlines} projects have critical deadlines approaching. 
              Review cashflow projections and ensure adequate funding.
            </div>
          </Alert>
        )}
        <DataTable
          data={cashflows}
          columns={columns}
          title="Project Cashflow Management"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewCashflow}
          onEdit={handleEditCashflow}
          onDelete={handleDeleteCashflow}
          customActions={[
            {
              type: 'custom',
              label: 'AI Forecast',
              onClick: (row) => {
                setSelectedCashflow(row)
                setShowForecastModal(true)
              }
            }
          ]}
          searchPlaceholder="Search cashflows..."
          emptyMessage="No cashflows found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Calendar size={20} className="me-2 text-primary" />
            Project Cashflow Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCashflow && (
            <div className="p-2">
              <h5 className="mb-3 text-primary">{selectedCashflow.projectName}</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Client:</strong> {selectedCashflow.client}
                </Col>
                <Col md={6}>
                  <strong>Total Value:</strong> ${selectedCashflow.totalValue.toLocaleString()} {selectedCashflow.currency}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Start Date:</strong> {selectedCashflow.startDate}
                </Col>
                <Col md={6}>
                  <strong>End Date:</strong> {selectedCashflow.endDate}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Cash Inflow:</strong> ${selectedCashflow.cashInflow.toLocaleString()}
                </Col>
                <Col md={4}>
                  <strong>Cash Outflow:</strong> ${selectedCashflow.cashOutflow.toLocaleString()}
                </Col>
                <Col md={4}>
                  <strong>Net Cashflow:</strong>{' '}
                  <span className={selectedCashflow.netCashflow >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                    ${selectedCashflow.netCashflow.toLocaleString()}
                  </span>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Phase:</strong> {selectedCashflow.currentPhase} ({selectedCashflow.progress}% complete)
                </Col>
                <Col md={4}>
                  <strong>Next Milestone:</strong> {selectedCashflow.nextMilestone}
                </Col>
                <Col md={4}>
                  <strong>Days Remaining:</strong> {selectedCashflow.daysRemaining} days
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Risk Level:</strong> <Badge bg={selectedCashflow.riskLevel === 'High' ? 'danger' : selectedCashflow.riskLevel === 'Medium' ? 'warning' : 'success'}>{selectedCashflow.riskLevel}</Badge>
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> <Badge bg={selectedCashflow.status === 'Active' ? 'success' : 'secondary'}>{selectedCashflow.status}</Badge>
                </Col>
              </Row>
              <hr />
              <div>
                <h6>AI Cashflow Forecast</h6>
                <Alert variant="info" className="d-flex align-items-start mt-2">
                  <Brain size={18} className="me-2 mt-1 flex-shrink-0" />
                  <div>
                    <div><strong>Forecast Summary:</strong> {selectedCashflow.aiForecast}</div>
                    <div className="mt-1 text-muted"><small>Last updated: {selectedCashflow.lastUpdate}</small></div>
                  </div>
                </Alert>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          {selectedCashflow && (
            <Button variant="primary" onClick={() => { setShowViewModal(false); handleEditCashflow(selectedCashflow); }}>
              <Edit size={16} className="me-2" />
              Edit Projections
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Edit/Create Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCashflow ? 'Edit Cashflow Projections' : 'New Project Cashflow setup'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveCashflow}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Project Name *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.projectName}
                onChange={e => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                placeholder="e.g. Highway Construction Phase 3"
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Client *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.client}
                    onChange={e => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    placeholder="e.g. Ministry of Transport"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Total Project Value (USD) *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={formData.totalValue}
                    onChange={e => setFormData(prev => ({ ...prev, totalValue: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Cash Inflow (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.cashInflow}
                    onChange={e => setFormData(prev => ({ ...prev, cashInflow: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Cash Outflow (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.cashOutflow}
                    onChange={e => setFormData(prev => ({ ...prev, cashOutflow: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Progress (% Complete)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.progress}
                    onChange={e => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Current Phase</Form.Label>
                  <Form.Select
                    value={formData.currentPhase}
                    onChange={e => setFormData(prev => ({ ...prev, currentPhase: e.target.value }))}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Implementation">Implementation</option>
                    <option value="Testing">Testing</option>
                    <option value="Construction">Construction</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Next Milestone</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nextMilestone}
                    onChange={e => setFormData(prev => ({ ...prev, nextMilestone: e.target.value }))}
                    placeholder="e.g. Design Approval"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Days Remaining</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.daysRemaining}
                    onChange={e => setFormData(prev => ({ ...prev, daysRemaining: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
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
              <Col md={4}>
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
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Planning">Planning</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>AI Forecast & Outlook</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.aiForecast}
                onChange={e => setFormData(prev => ({ ...prev, aiForecast: e.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {selectedCashflow ? 'Save Changes' : 'Create Projection'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* AI Forecast Modal */}
      <Modal show={showForecastModal} onHide={() => setShowForecastModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Brain size={20} className="me-2 text-info" />
            AI Liquidity Analysis
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCashflow && (
            <div>
              <h6 className="text-primary">{selectedCashflow.projectName}</h6>
              <div className="mt-3">
                <strong>Projected Runway Outlook:</strong> {selectedCashflow.aiForecast}
              </div>
              <div className="mt-2">
                <strong>Net Liquid Posture:</strong>{' '}
                <span className={selectedCashflow.netCashflow >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                  ${selectedCashflow.netCashflow.toLocaleString()}
                </span>
              </div>
              <Alert variant="warning" className="mt-3">
                AI Liquidity Analysis forecasts payment delays based on historic counterparty billing timelines. Ensure milestone achievements are submitted 15 days in advance of the forecast dip.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForecastModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Cashflow