import React, { useState, useEffect } from 'react'
import { Button, Badge, Alert, Row, Col, Modal, Form } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { DollarSign, Plus, TrendingUp, Globe, AlertTriangle, Calculator, Percent, Edit, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { toast } from 'react-toastify'
import './FXTaxes.scss'

const FXTaxes = () => {
  const navigate = useNavigate()
  const [fxTaxes, setFxTaxes] = useState([])
  const [stats, setStats] = useState({})
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showForecastModal, setShowForecastModal] = useState(false)
  const [selectedFxTax, setSelectedFxTax] = useState(null)

  const [formData, setFormData] = useState({
    currencyPair: '',
    baseCurrency: '',
    targetCurrency: '',
    currentRate: 1.0,
    previousRate: 1.0,
    changePercent: 0.0,
    taxRate: 0.0,
    taxType: 'VAT',
    country: '',
    region: '',
    status: 'Active',
    lastUpdated: new Date().toISOString().split('T')[0],
    aiForecast: '',
    aiConfidence: 90,
    volatility: 'Low',
    priority: 'Medium',
    createdBy: 'Admin'
  })

  useEffect(() => {
    // Mock data for FX and taxes
    setFxTaxes([
      {
        id: 1,
        currencyPair: 'USD/EUR',
        baseCurrency: 'USD',
        targetCurrency: 'EUR',
        currentRate: 0.9234,
        previousRate: 0.9187,
        changePercent: 0.51,
        taxRate: 19.0,
        taxType: 'VAT',
        country: 'Germany',
        region: 'EU',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Stable with slight upward trend',
        aiConfidence: 85,
        volatility: 'Low',
        priority: 'High',
        createdBy: 'John Doe'
      },
      {
        id: 2,
        currencyPair: 'USD/GBP',
        baseCurrency: 'USD',
        targetCurrency: 'GBP',
        currentRate: 0.7892,
        previousRate: 0.7856,
        changePercent: 0.46,
        taxRate: 20.0,
        taxType: 'VAT',
        country: 'UK',
        region: 'Europe',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Moderate volatility expected',
        aiConfidence: 78,
        volatility: 'Medium',
        priority: 'High',
        createdBy: 'Jane Smith'
      },
      {
        id: 3,
        currencyPair: 'USD/JPY',
        baseCurrency: 'USD',
        targetCurrency: 'JPY',
        currentRate: 149.85,
        previousRate: 150.12,
        changePercent: -0.18,
        taxRate: 10.0,
        taxType: 'Consumption Tax',
        country: 'Japan',
        region: 'Asia',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Continued weakness expected',
        aiConfidence: 82,
        volatility: 'High',
        priority: 'Critical',
        createdBy: 'Mike Johnson'
      },
      {
        id: 4,
        currencyPair: 'USD/CAD',
        baseCurrency: 'USD',
        targetCurrency: 'CAD',
        currentRate: 1.3567,
        previousRate: 1.3523,
        changePercent: 0.33,
        taxRate: 13.0,
        taxType: 'HST',
        country: 'Canada',
        region: 'North America',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Stable with minor fluctuations',
        aiConfidence: 90,
        volatility: 'Low',
        priority: 'Medium',
        createdBy: 'Sarah Wilson'
      },
      {
        id: 5,
        currencyPair: 'USD/AUD',
        baseCurrency: 'USD',
        targetCurrency: 'AUD',
        currentRate: 1.5234,
        previousRate: 1.5189,
        changePercent: 0.30,
        taxRate: 10.0,
        taxType: 'GST',
        country: 'Australia',
        region: 'Oceania',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Commodity-driven movements',
        aiConfidence: 75,
        volatility: 'Medium',
        priority: 'Medium',
        createdBy: 'David Brown'
      },
      {
        id: 6,
        currencyPair: 'USD/CHF',
        baseCurrency: 'USD',
        targetCurrency: 'CHF',
        currentRate: 0.8765,
        previousRate: 0.8723,
        changePercent: 0.48,
        taxRate: 7.7,
        taxType: 'VAT',
        country: 'Switzerland',
        region: 'Europe',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Safe haven demand increasing',
        aiConfidence: 88,
        volatility: 'Low',
        priority: 'High',
        createdBy: 'Lisa Davis'
      }
    ])

    setStats({
      totalCurrencies: 6,
      totalTaxRates: 6,
      avgVolatility: 'Medium',
      highVolatility: 2,
      aiConfidence: 83,
      activeRates: 6,
      lastUpdate: '2024-02-14',
      totalRegions: 4
    })
  }, [])

  const handleViewFxTax = (fxTax) => {
    setSelectedFxTax(fxTax)
    setShowViewModal(true)
  }

  const handleEditFxTax = (fxTax) => {
    setSelectedFxTax(fxTax)
    setFormData({
      ...fxTax
    })
    setShowEditModal(true)
  }

  const handleDeleteFxTax = (fxTax) => {
    if (window.confirm(`Are you sure you want to delete FX & Tax configuration for "${fxTax.currencyPair}"?`)) {
      setFxTaxes(prev => prev.filter(i => i.id !== fxTax.id))
      toast.success(`Successfully deleted FX & Tax configuration for "${fxTax.currencyPair}"!`)
    }
  }

  const handleCreateFxTax = () => {
    setSelectedFxTax(null)
    setFormData({
      currencyPair: '',
      baseCurrency: '',
      targetCurrency: '',
      currentRate: 1.0,
      previousRate: 1.0,
      changePercent: 0.0,
      taxRate: 0.0,
      taxType: 'VAT',
      country: '',
      region: '',
      status: 'Active',
      lastUpdated: new Date().toISOString().split('T')[0],
      aiForecast: 'Stable forecast expected',
      aiConfidence: 85,
      volatility: 'Low',
      priority: 'Medium',
      createdBy: 'Admin'
    })
    setShowEditModal(true)
  }

  const handleSaveFxTax = (e) => {
    e.preventDefault()
    if (!formData.currencyPair || !formData.country || !formData.region) {
      toast.error('Please fill in all required fields.')
      return
    }

    const calculatedChange = formData.previousRate ? parseFloat((((formData.currentRate - formData.previousRate) / formData.previousRate) * 100).toFixed(2)) : 0.0

    const updatedData = {
      ...formData,
      changePercent: calculatedChange,
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    if (selectedFxTax) {
      setFxTaxes(prev => prev.map(i => i.id === selectedFxTax.id ? { ...i, ...updatedData } : i))
      toast.success(`Successfully updated FX & Tax configuration for "${formData.currencyPair}"!`)
    } else {
      const newId = fxTaxes.length ? Math.max(...fxTaxes.map(i => i.id)) + 1 : 1
      const newFxTax = {
        id: newId,
        ...updatedData
      }
      setFxTaxes(prev => [newFxTax, ...prev])
      toast.success(`Successfully created FX & Tax configuration for "${formData.currencyPair}"!`)
    }

    setShowEditModal(false)
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'currencyPair',
      label: 'Currency Pair',
      width: '12%',
      render: (value, row) => (
        <div className="currency-pair">
          <div className="fw-semibold d-flex align-items-center">
            <DollarSign size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.country}</small>
        </div>
      )
    },
    {
      key: 'currentRate',
      label: 'Current Rate',
      width: '10%',
      render: (value) => (
        <div className="current-rate">
          <div className="fw-bold text-primary">{value}</div>
        </div>
      )
    },
    {
      key: 'changePercent',
      label: 'Change %',
      width: '8%',
      render: (value) => (
        <div className="change-percent">
          <div className={`fw-bold ${value >= 0 ? 'text-success' : 'text-danger'}`}>
            {value >= 0 ? '+' : ''}{value}%
          </div>
        </div>
      )
    },
    {
      key: 'taxRate',
      label: 'Tax Rate',
      width: '8%',
      render: (value, row) => (
        <div className="tax-rate">
          <div className="fw-bold text-warning">{value}%</div>
          <small className="text-muted">{row.taxType}</small>
        </div>
      )
    },
    {
      key: 'volatility',
      label: 'Volatility',
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
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '10%',
      render: (value) => (
        <div className="ai-confidence">
          <div className="fw-bold text-info">{value}%</div>
          <small className="text-muted">confidence</small>
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
      key: 'region',
      label: 'Region',
      width: '8%',
      render: (value) => (
        <div className="region">
          <small className="text-muted">{value}</small>
        </div>
      )
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      width: '10%',
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
      key: 'aiForecast',
      label: 'AI Forecast',
      width: '12%',
      render: (value) => (
        <div className="ai-forecast">
          <small className="text-muted">{value}</small>
        </div>
      )
    }
  ]

  return (
    <>
      <ExecutiveCommandCenter
        className="fx-taxes-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'FX & Taxes', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="FX & Taxes"
        description="Manage foreign exchange rates and tax calculations with AI-powered forecasting"
        heroMeta="FX desk"
        outlookTitle="FX & tax outlook"
        outlookDescription={`${stats.totalCurrencies || 0} pairs — ${stats.totalTaxRates || 0} tax regimes, ${stats.highVolatility || 0} volatile, ${stats.aiConfidence || 0}% AI confidence.`}
        outlookChips={[
          `${stats.totalCurrencies || 0} pairs`,
          `${stats.totalTaxRates || 0} tax rates`,
          `${stats.highVolatility || 0} high volatility`,
          `${stats.aiConfidence || 0}% AI confidence`
        ]}
        insights={[]}
        kpiTitle="FX signal board"
        kpiMeta="Volatility vs compliance"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Currency pairs"
                value={stats.totalCurrencies || 0}
                hint="Tracked crosses"
                tone="intel"
                trend="Coverage"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Tax rates"
                value={stats.totalTaxRates || 0}
                hint="Active schedules"
                tone="success"
                trend="Compliance"
                icon={<Percent size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="High volatility"
                value={stats.highVolatility || 0}
                hint="Pairs in stress"
                tone={(stats.highVolatility || 0) > 0 ? 'warning' : 'success'}
                trend="Hedge"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence || 0}
                hint="Forecast trust"
                tone="intel"
                trend="Signal"
                suffix="%"
                icon={<Calculator size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`FX & tax rates (${fxTaxes.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateFxTax}>
              <Plus size={16} className="me-2" />
              Add Currency Pair
            </Button>
            <Button variant="outline-secondary" onClick={() => {
              toast.info("Connecting to market rate API...");
              setTimeout(() => {
                toast.success("Successfully updated FX rates to latest market values!");
              }, 1000);
            }}>
              <Globe size={16} className="me-2" />
              Update Rates
            </Button>
          </>
        )}
      >
        {stats.highVolatility > 0 && (
          <Alert variant="warning" className="d-flex align-items-center mb-3">
            <AlertTriangle size={20} className="me-2" />
            <div>
              <strong>High Volatility Alert:</strong> {stats.highVolatility} currency pairs are experiencing high volatility. 
              Monitor rates closely and consider hedging strategies.
            </div>
          </Alert>
        )}
        <DataTable
          data={fxTaxes}
          columns={columns}
          title="FX & Tax Rates Management"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewFxTax}
          onEdit={handleEditFxTax}
          onDelete={handleDeleteFxTax}
          customActions={[
            {
              type: 'custom',
              label: 'AI Forecast',
              onClick: (row) => {
                setSelectedFxTax(row)
                setShowForecastModal(true)
              }
            }
          ]}
          searchPlaceholder="Search FX & taxes..."
          emptyMessage="No FX & tax rates found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <DollarSign size={20} className="me-2 text-primary" />
            FX & Tax Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFxTax && (
            <div className="p-2">
              <h5 className="mb-3 text-primary">{selectedFxTax.currencyPair} ({selectedFxTax.country})</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Current Rate:</strong> {selectedFxTax.currentRate}
                </Col>
                <Col md={6}>
                  <strong>Previous Rate:</strong> {selectedFxTax.previousRate}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Daily Change:</strong>{' '}
                  <span className={selectedFxTax.changePercent >= 0 ? 'text-success fw-bold' : 'text-danger'}>
                    {selectedFxTax.changePercent >= 0 ? '+' : ''}{selectedFxTax.changePercent}%
                  </span>
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> <Badge bg={selectedFxTax.status === 'Active' ? 'success' : 'secondary'}>{selectedFxTax.status}</Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Tax Rate:</strong> {selectedFxTax.taxRate}% ({selectedFxTax.taxType})
                </Col>
                <Col md={6}>
                  <strong>Region / Jurisdiction:</strong> {selectedFxTax.region}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Volatility:</strong> <Badge bg={selectedFxTax.volatility === 'High' ? 'danger' : selectedFxTax.volatility === 'Medium' ? 'warning' : 'success'}>{selectedFxTax.volatility}</Badge>
                </Col>
                <Col md={6}>
                  <strong>Priority:</strong> <Badge bg={selectedFxTax.priority === 'Critical' ? 'danger' : selectedFxTax.priority === 'High' ? 'warning' : 'info'}>{selectedFxTax.priority}</Badge>
                </Col>
              </Row>
              <hr />
              <div>
                <h6>AI Market Forecast</h6>
                <Alert variant="info" className="d-flex align-items-start mt-2">
                  <Brain size={18} className="me-2 mt-1 flex-shrink-0" />
                  <div>
                    <div><strong>Outlook:</strong> {selectedFxTax.aiForecast}</div>
                    <div className="mt-1 text-muted"><small>Confidence Level: {selectedFxTax.aiConfidence}%</small></div>
                  </div>
                </Alert>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          {selectedFxTax && (
            <Button variant="primary" onClick={() => { setShowViewModal(false); handleEditFxTax(selectedFxTax); }}>
              <Edit size={16} className="me-2" />
              Edit Details
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Edit/Create Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedFxTax ? 'Edit FX & Tax Configuration' : 'Add New Currency Pair & Tax'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveFxTax}>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Currency Pair *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.currencyPair}
                    onChange={e => setFormData(prev => ({ ...prev, currencyPair: e.target.value }))}
                    placeholder="e.g. USD/EUR"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Country *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.country}
                    onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="e.g. Germany"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Base Currency</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.baseCurrency}
                    onChange={e => setFormData(prev => ({ ...prev, baseCurrency: e.target.value }))}
                    placeholder="e.g. USD"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Target Currency</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.targetCurrency}
                    onChange={e => setFormData(prev => ({ ...prev, targetCurrency: e.target.value }))}
                    placeholder="e.g. EUR"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Current Rate *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.0001"
                    required
                    value={formData.currentRate}
                    onChange={e => setFormData(prev => ({ ...prev, currentRate: parseFloat(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Previous Rate *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.0001"
                    required
                    value={formData.previousRate}
                    onChange={e => setFormData(prev => ({ ...prev, previousRate: parseFloat(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tax Rate (%) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    required
                    value={formData.taxRate}
                    onChange={e => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tax Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.taxType}
                    onChange={e => setFormData(prev => ({ ...prev, taxType: e.target.value }))}
                    placeholder="e.g. VAT, GST, HST"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Region / Continent *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.region}
                    onChange={e => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    placeholder="e.g. EU, Asia, North America"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Volatility</Form.Label>
                  <Form.Select
                    value={formData.volatility}
                    onChange={e => setFormData(prev => ({ ...prev, volatility: e.target.value }))}
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
                    <option value="Secondary">Secondary</option>
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
              {selectedFxTax ? 'Save Changes' : 'Create Configuration'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* AI Forecast Modal */}
      <Modal show={showForecastModal} onHide={() => setShowForecastModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Brain size={20} className="me-2 text-info" />
            AI Exchange Rate Prediction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFxTax && (
            <div>
              <h6 className="text-primary">Currency Pair: {selectedFxTax.currencyPair}</h6>
              <div className="mt-3">
                <strong>Projected Outlook:</strong> {selectedFxTax.aiForecast}
              </div>
              <div className="mt-2">
                <strong>Model Confidence:</strong> {selectedFxTax.aiConfidence}%
              </div>
              <div className="mt-2">
                <strong>Assessed Volatility:</strong>{' '}
                <Badge bg={selectedFxTax.volatility === 'High' ? 'danger' : selectedFxTax.volatility === 'Medium' ? 'warning' : 'success'}>
                  {selectedFxTax.volatility} Volatility
                </Badge>
              </div>
              <Alert variant="info" className="mt-3">
                Forecast models predict potential macro-economic indicators and interest rate announcements. Use hedging instruments for projects with durations exceeding 6 months.
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

export default FXTaxes