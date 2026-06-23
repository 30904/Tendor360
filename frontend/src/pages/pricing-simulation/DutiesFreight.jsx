import React, { useState, useEffect } from 'react'
import { Button, Badge, Alert, Row, Col, Modal, Form } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Truck, Plus, DollarSign, Package, Globe, AlertTriangle, Calculator, Edit, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { toast } from 'react-toastify'
import './DutiesFreight.scss'

const DutiesFreight = () => {
  const navigate = useNavigate()
  const [dutiesFreight, setDutiesFreight] = useState([])
  const [stats, setStats] = useState({})
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Heavy Machinery',
    originCountry: '',
    destinationCountry: '',
    weight: 0,
    volume: 0.0,
    value: 0,
    currency: 'USD',
    dutyRate: 0.0,
    dutyAmount: 0.0,
    freightCost: 0,
    insuranceCost: 0,
    totalCost: 0,
    status: 'Calculated',
    aiOptimized: true,
    savings: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    createdBy: 'Admin',
    priority: 'Medium'
  })

  useEffect(() => {
    // Mock data for duties and freight
    setDutiesFreight([
      {
        id: 1,
        itemName: 'Construction Equipment - Excavator',
        category: 'Heavy Machinery',
        originCountry: 'Germany',
        destinationCountry: 'USA',
        weight: 25000,
        volume: 45.5,
        value: 450000,
        currency: 'USD',
        dutyRate: 2.5,
        dutyAmount: 11250,
        freightCost: 8500,
        insuranceCost: 2250,
        totalCost: 22000,
        status: 'Calculated',
        aiOptimized: true,
        savings: 1500,
        lastUpdated: '2024-02-14',
        createdBy: 'John Doe',
        priority: 'High'
      },
      {
        id: 2,
        itemName: 'Medical Equipment - MRI Scanner',
        category: 'Medical Devices',
        originCountry: 'Japan',
        destinationCountry: 'Canada',
        weight: 3500,
        volume: 12.8,
        value: 1200000,
        currency: 'USD',
        dutyRate: 0,
        dutyAmount: 0,
        freightCost: 12000,
        insuranceCost: 6000,
        totalCost: 18000,
        status: 'Calculated',
        aiOptimized: true,
        savings: 2000,
        lastUpdated: '2024-02-13',
        createdBy: 'Jane Smith',
        priority: 'Critical'
      },
      {
        id: 3,
        itemName: 'Electronics - Server Racks',
        category: 'IT Equipment',
        originCountry: 'China',
        destinationCountry: 'UK',
        weight: 800,
        volume: 2.5,
        value: 85000,
        currency: 'USD',
        dutyRate: 3.2,
        dutyAmount: 2720,
        freightCost: 2500,
        insuranceCost: 425,
        totalCost: 5645,
        status: 'Pending',
        aiOptimized: false,
        savings: 0,
        lastUpdated: '2024-02-12',
        createdBy: 'Mike Johnson',
        priority: 'Medium'
      },
      {
        id: 4,
        itemName: 'Automotive Parts - Engine Components',
        category: 'Automotive',
        originCountry: 'South Korea',
        destinationCountry: 'Mexico',
        weight: 1200,
        volume: 1.8,
        value: 65000,
        currency: 'USD',
        dutyRate: 5.0,
        dutyAmount: 3250,
        freightCost: 1800,
        insuranceCost: 325,
        totalCost: 5375,
        status: 'Calculated',
        aiOptimized: true,
        savings: 800,
        lastUpdated: '2024-02-11',
        createdBy: 'Sarah Wilson',
        priority: 'High'
      },
      {
        id: 5,
        itemName: 'Textile Machinery - Weaving Looms',
        category: 'Manufacturing Equipment',
        originCountry: 'Italy',
        destinationCountry: 'India',
        weight: 15000,
        volume: 28.5,
        value: 320000,
        currency: 'USD',
        dutyRate: 7.5,
        dutyAmount: 24000,
        freightCost: 15000,
        insuranceCost: 1600,
        totalCost: 40600,
        status: 'In Review',
        aiOptimized: true,
        savings: 3200,
        lastUpdated: '2024-02-10',
        createdBy: 'David Brown',
        priority: 'Medium'
      },
      {
        id: 6,
        itemName: 'Pharmaceutical Equipment - Tablet Press',
        category: 'Pharmaceutical',
        originCountry: 'Switzerland',
        destinationCountry: 'Brazil',
        weight: 5000,
        volume: 8.2,
        value: 280000,
        currency: 'USD',
        dutyRate: 4.0,
        dutyAmount: 11200,
        freightCost: 8000,
        insuranceCost: 1400,
        totalCost: 20600,
        status: 'Calculated',
        aiOptimized: true,
        savings: 1800,
        lastUpdated: '2024-02-09',
        createdBy: 'Lisa Davis',
        priority: 'High'
      }
    ])

    setStats({
      totalItems: 6,
      totalValue: 2845000,
      totalDutyAmount: 52420,
      totalFreightCost: 47800,
      totalSavings: 9500,
      aiOptimized: 5,
      pendingCalculations: 1,
      avgSavings: 1583
    })
  }, [])

  const handleViewDutiesFreight = (item) => {
    setSelectedItem(item)
    setShowViewModal(true)
  }

  const handleEditDutiesFreight = (item) => {
    setSelectedItem(item)
    setFormData({
      ...item
    })
    setShowEditModal(true)
  }

  const handleDeleteDutiesFreight = (item) => {
    if (window.confirm(`Are you sure you want to delete duties & freight for "${item.itemName}"?`)) {
      setDutiesFreight(prev => prev.filter(i => i.id !== item.id))
      toast.success(`Successfully deleted "${item.itemName}"!`)
    }
  }

  const handleCreateDutiesFreight = () => {
    setSelectedItem(null)
    setFormData({
      itemName: '',
      category: 'Heavy Machinery',
      originCountry: '',
      destinationCountry: '',
      weight: 0,
      volume: 0.0,
      value: 0,
      currency: 'USD',
      dutyRate: 2.0,
      dutyAmount: 0.0,
      freightCost: 0,
      insuranceCost: 0,
      totalCost: 0,
      status: 'Calculated',
      aiOptimized: true,
      savings: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      createdBy: 'Admin',
      priority: 'Medium'
    })
    setShowEditModal(true)
  }

  const handleSaveDutiesFreight = (e) => {
    e.preventDefault()
    if (!formData.itemName || !formData.originCountry || !formData.destinationCountry) {
      toast.error('Please fill in all required fields.')
      return
    }

    const calculatedDutyAmount = (formData.value * (formData.dutyRate / 100))
    const calculatedTotal = calculatedDutyAmount + formData.freightCost + formData.insuranceCost

    const updatedData = {
      ...formData,
      dutyAmount: calculatedDutyAmount,
      totalCost: calculatedTotal,
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    if (selectedItem) {
      setDutiesFreight(prev => prev.map(i => i.id === selectedItem.id ? { ...i, ...updatedData } : i))
      toast.success(`Successfully updated "${formData.itemName}" calculations!`)
    } else {
      const newId = dutiesFreight.length ? Math.max(...dutiesFreight.map(i => i.id)) + 1 : 1
      const newItem = {
        id: newId,
        ...updatedData
      }
      setDutiesFreight(prev => [newItem, ...prev])
      toast.success(`Successfully added new landed cost calculations for "${formData.itemName}"!`)
    }

    setShowEditModal(false)
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'itemName',
      label: 'Item Details',
      width: '20%',
      render: (value, row) => (
        <div className="item-info">
          <div className="fw-semibold d-flex align-items-center">
            <Package size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.category}</small>
          <div className="item-meta">
            <small className="text-muted">{row.originCountry} → {row.destinationCountry}</small>
          </div>
        </div>
      )
    },
    {
      key: 'value',
      label: 'Item Value',
      width: '10%',
      render: (value, row) => (
        <div className="item-value">
          <div className="fw-bold text-primary">
            ${(value / 1000).toFixed(0)}K
          </div>
          <small className="text-muted">{row.currency}</small>
        </div>
      )
    },
    {
      key: 'dutyAmount',
      label: 'Duty Amount',
      width: '10%',
      render: (value, row) => (
        <div className="duty-amount">
          <div className="fw-bold text-warning">
            ${(value / 1000).toFixed(1)}K
          </div>
          <small className="text-muted">{row.dutyRate}% rate</small>
        </div>
      )
    },
    {
      key: 'freightCost',
      label: 'Freight Cost',
      width: '10%',
      render: (value) => (
        <div className="freight-cost">
          <div className="fw-bold text-info">
            ${(value / 1000).toFixed(1)}K
          </div>
          <small className="text-muted">shipping</small>
        </div>
      )
    },
    {
      key: 'totalCost',
      label: 'Total Cost',
      width: '10%',
      render: (value) => (
        <div className="total-cost">
          <div className="fw-bold text-success">
            ${(value / 1000).toFixed(1)}K
          </div>
          <small className="text-muted">total</small>
        </div>
      )
    },
    {
      key: 'savings',
      label: 'AI Savings',
      width: '8%',
      render: (value) => (
        <div className="savings">
          <div className="fw-bold text-success">
            ${(value / 1000).toFixed(1)}K
          </div>
          <small className="text-muted">saved</small>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '8%',
      render: (value) => {
        const variants = {
          'Calculated': 'success',
          'Pending': 'warning',
          'In Review': 'info',
          'Failed': 'danger'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'aiOptimized',
      label: 'AI Optimized',
      width: '8%',
      render: (value) => (
        <div className="ai-optimized">
          {value ? (
            <Badge bg="success" className="d-flex align-items-center">
              <Calculator size={12} className="me-1" />
              Yes
            </Badge>
          ) : (
            <Badge bg="secondary">No</Badge>
          )}
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
      key: 'lastUpdated',
      label: 'Last Updated',
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
  const freightK = (stats.totalFreightCost || 0) / 1000
  const savingsK = (stats.totalSavings || 0) / 1000

  return (
    <>
      <ExecutiveCommandCenter
        className="duties-freight-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Duties & Freight', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Duties & Freight"
        description="Calculate and manage import duties and freight costs with AI-powered optimization"
        heroMeta="Landed cost"
        outlookTitle="Duties & freight outlook"
        outlookDescription={`${stats.totalItems || 0} items — $${totalValM.toFixed(1)}M value, $${freightK.toFixed(0)}K freight, $${savingsK.toFixed(1)}K AI savings signal.`}
        outlookChips={[
          `${stats.totalItems || 0} items`,
          `$${totalValM.toFixed(1)}M value`,
          `$${freightK.toFixed(0)}K freight`,
          `$${savingsK.toFixed(1)}K savings`
        ]}
        insights={[]}
        kpiTitle="Landed cost signal board"
        kpiMeta="Duty vs freight"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total items"
                value={stats.totalItems || 0}
                hint="Lines modeled"
                tone="intel"
                trend="Volume"
                icon={<Package size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total value"
                displayValue={`$${totalValM.toFixed(1)}M`}
                hint="Declared basis"
                tone="success"
                trend="Scale"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total freight"
                displayValue={`$${freightK.toFixed(0)}K`}
                hint="Logistics spend"
                tone="warning"
                trend="Lift"
                icon={<Truck size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI savings"
                displayValue={`$${savingsK.toFixed(1)}K`}
                hint="Optimization delta"
                tone="intel"
                trend="Leakage"
                icon={<Calculator size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Duties & freight (${dutiesFreight.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateDutiesFreight}>
              <Plus size={16} className="me-2" />
              Calculate Duties & Freight
            </Button>
            <Button variant="outline-secondary" onClick={() => {
              toast.info("Importing regional duty rates from customs API...");
              setTimeout(() => {
                toast.success("Successfully imported latest customs duty schedules!");
              }, 1000);
            }}>
              <Globe size={16} className="me-2" />
              Import Rates
            </Button>
          </>
        )}
      >
        {stats.pendingCalculations > 0 && (
          <Alert variant="warning" className="d-flex align-items-center mb-3">
            <AlertTriangle size={20} className="me-2" />
            <div>
              <strong>Pending Calculations:</strong> {stats.pendingCalculations} items require duty and freight calculations. 
              Review and complete calculations to optimize costs.
            </div>
          </Alert>
        )}
        <DataTable
          data={dutiesFreight}
          columns={columns}
          title="Duties & Freight Calculations"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewDutiesFreight}
          onEdit={handleEditDutiesFreight}
          onDelete={handleDeleteDutiesFreight}
          customActions={[
            {
              type: 'custom',
              label: 'Recalculate',
              onClick: (row) => {
                toast.info(`Recalculating AI routing optimization for "${row.itemName}"...`);
                setTimeout(() => {
                  const calculatedDutyAmount = (row.value * (row.dutyRate / 100));
                  const calculatedTotal = calculatedDutyAmount + row.freightCost + row.insuranceCost;
                  const savings = row.aiOptimized ? 2000 : 0;
                  
                  setDutiesFreight(prev => prev.map(i => i.id === row.id ? { 
                    ...i, 
                    totalCost: calculatedTotal - savings,
                    savings: savings,
                    aiOptimized: true,
                    status: 'Calculated' 
                  } : i));
                  toast.success(`Recalculated successfully! Saved $${(savings/1000).toFixed(1)}K via optimized AI freight routes.`);
                }, 1000);
              }
            }
          ]}
          searchPlaceholder="Search duties & freight..."
          emptyMessage="No duties & freight calculations found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Truck size={20} className="me-2 text-primary" />
            Landed Cost Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div className="p-2">
              <h5 className="mb-3 text-primary">{selectedItem.itemName}</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Category:</strong> {selectedItem.category}
                </Col>
                <Col md={6}>
                  <strong>Route:</strong> {selectedItem.originCountry} &rarr; {selectedItem.destinationCountry}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Item Declared Value:</strong> ${selectedItem.value.toLocaleString()} {selectedItem.currency}
                </Col>
                <Col md={4}>
                  <strong>Duty Cost:</strong> ${selectedItem.dutyAmount.toLocaleString()} ({selectedItem.dutyRate}% rate)
                </Col>
                <Col md={4}>
                  <strong>Freight Cost:</strong> ${selectedItem.freightCost.toLocaleString()}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Insurance Cost:</strong> ${selectedItem.insuranceCost.toLocaleString()}
                </Col>
                <Col md={4}>
                  <strong>Landed Cost:</strong> ${selectedItem.totalCost.toLocaleString()}
                </Col>
                <Col md={4}>
                  <strong>Status:</strong> <Badge bg={selectedItem.status === 'Calculated' ? 'success' : 'warning'}>{selectedItem.status}</Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Weight:</strong> {selectedItem.weight} kg
                </Col>
                <Col md={4}>
                  <strong>Volume:</strong> {selectedItem.volume} cbm
                </Col>
                <Col md={4}>
                  <strong>Priority:</strong> <Badge bg={selectedItem.priority === 'Critical' ? 'danger' : selectedItem.priority === 'High' ? 'warning' : 'info'}>{selectedItem.priority}</Badge>
                </Col>
              </Row>
              <hr />
              <div>
                <h6>AI Route Optimization</h6>
                <Alert variant="success" className="d-flex align-items-start mt-2">
                  <Brain size={18} className="me-2 mt-1 flex-shrink-0" />
                  <div>
                    <div><strong>Optimized:</strong> {selectedItem.aiOptimized ? 'Yes - Route and logistics costs optimized' : 'No - Awaiting optimization runs'}</div>
                    {selectedItem.savings > 0 && <div className="mt-1"><strong>Landed Savings:</strong> ${selectedItem.savings.toLocaleString()} realized</div>}
                  </div>
                </Alert>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          {selectedItem && (
            <Button variant="primary" onClick={() => { setShowViewModal(false); handleEditDutiesFreight(selectedItem); }}>
              <Edit size={16} className="me-2" />
              Edit Calculations
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Edit/Create Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedItem ? 'Edit Landed Cost Model' : 'New Landed Cost Calculation'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveDutiesFreight}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Item/Equipment Name *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.itemName}
                onChange={e => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                placeholder="e.g. Server Racks, MRI Scanner"
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Heavy Machinery">Heavy Machinery</option>
                    <option value="Medical Devices">Medical Devices</option>
                    <option value="IT Equipment">IT Equipment</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Manufacturing Equipment">Manufacturing Equipment</option>
                    <option value="Pharmaceutical">Pharmaceutical</option>
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
                    <option value="Calculated">Calculated</option>
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Origin Country *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.originCountry}
                    onChange={e => setFormData(prev => ({ ...prev, originCountry: e.target.value }))}
                    placeholder="e.g. Germany"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Destination Country *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.destinationCountry}
                    onChange={e => setFormData(prev => ({ ...prev, destinationCountry: e.target.value }))}
                    placeholder="e.g. USA"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Item Declared Value (USD) *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={formData.value}
                    onChange={e => setFormData(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Duty Rate (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.dutyRate}
                    onChange={e => setFormData(prev => ({ ...prev, dutyRate: parseFloat(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Freight Cost (USD) *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={formData.freightCost}
                    onChange={e => setFormData(prev => ({ ...prev, freightCost: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Insurance Cost (USD) *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={formData.insuranceCost}
                    onChange={e => setFormData(prev => ({ ...prev, insuranceCost: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Weight (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.weight}
                    onChange={e => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Volume (CBM)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={formData.volume}
                    onChange={e => setFormData(prev => ({ ...prev, volume: parseFloat(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>AI Optimization Savings</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.savings}
                    onChange={e => setFormData(prev => ({ ...prev, savings: parseInt(e.target.value) || 0 }))}
                  />
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
                <Form.Group className="mt-4 pt-2">
                  <Form.Check
                    type="checkbox"
                    label="AI Optimized"
                    checked={formData.aiOptimized}
                    onChange={e => setFormData(prev => ({ ...prev, aiOptimized: e.target.checked }))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {selectedItem ? 'Save Changes' : 'Calculate'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default DutiesFreight