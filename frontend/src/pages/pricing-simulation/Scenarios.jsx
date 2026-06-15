import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Calculator, FileText, Brain, CheckCircle, DollarSign, TrendingUp, BarChart, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TableActionsCell from '../../components/TableActionsCell'
import { buildTableActions, runTableAction } from '../../utils/tableActions'
import { fetchPricingScenarios, createPricingScenario, predictAIPricing, selectPricingScenarios, selectPricingStats, selectPricingLoading, deletePricingScenario } from '../../store/slices/pricingSlice'
import { fetchEvaluations, selectEvaluations } from '../../store/slices/evaluationSlice'
import { userHasAnyRole } from '../../utils/roles'
import './Scenarios.scss'

const Scenarios = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const scenarios = useSelector(selectPricingScenarios)
  const stats = useSelector(selectPricingStats)
  const loading = useSelector(selectPricingLoading)
  const evaluations = useSelector(selectEvaluations)
  const { user } = useSelector(state => state.auth)

  // Filter evaluations to only show APPROVED decisions that were BID, AND don't already have a scenario
  const availableTenders = useMemo(() => {
    if (!evaluations) return [];
    const usedTenderIds = new Set(scenarios?.map(s => s.tenderId?._id || s.tenderId) || []);
    return evaluations
      .filter(ev => ev.decision === 'BID' && ev.status === 'APPROVED' && ev.tenderId && !usedTenderIds.has(ev.tenderId._id))
      .map(ev => ev.tenderId); // Extract the populated tender object
  }, [evaluations, scenarios]);

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(null)

  // Form State
  const [selectedTenderId, setSelectedTenderId] = useState('')
  const [winProbability, setWinProbability] = useState(50)
  const [aiRecommendation, setAiRecommendation] = useState(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [items, setItems] = useState([
    { name: '', description: '', quantity: 1, unit: 'hrs', cost: 0, price: 0 }
  ])

  useEffect(() => {
    dispatch(fetchPricingScenarios({}))
    dispatch(fetchEvaluations({})) // Fetch evaluations to filter down to approved bids
  }, [dispatch])

  // Computed Form Totals
  const formTotals = useMemo(() => {
    let cost = 0;
    let price = 0;
    items.forEach(item => {
      cost += (Number(item.cost) || 0) * (Number(item.quantity) || 1);
      price += (Number(item.price) || 0) * (Number(item.quantity) || 1);
    });
    const margin = price - cost;
    const marginPct = cost > 0 ? (margin / cost) * 100 : 0;
    return { cost, price, margin, marginPct };
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { name: '', description: '', quantity: 1, unit: 'hrs', cost: 0, price: 0 }])
  }

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const handleAIPredict = async () => {
    if (!selectedTenderId) {
      alert("Please select a Tender first.");
      return;
    }
    setIsPredicting(true);
    try {
      const response = await dispatch(predictAIPricing(selectedTenderId)).unwrap();
      if (response && response.prediction) {
        setAiRecommendation(response.prediction);
        setWinProbability(response.prediction.winProbability);
      }
    } catch (e) {
      console.error(e);
      alert("AI Prediction failed.");
    } finally {
      setIsPredicting(false);
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedTenderId) {
      alert("Please select a Tender");
      return;
    }
    
    // Filter out empty items
    const validItems = items.filter(i => i.name.trim() !== '');
    if (validItems.length === 0) {
      alert("Please add at least one valid cost item.");
      return;
    }

    const pricingData = {
      tenderId: selectedTenderId,
      winProbability: Number(winProbability),
      items: validItems.map(i => ({
        ...i,
        quantity: Number(i.quantity),
        cost: Number(i.cost),
        price: Number(i.price)
      }))
    };

    dispatch(createPricingScenario(pricingData)).then(() => {
      dispatch(fetchPricingScenarios({}));
      setShowModal(false);
      resetForm();
    });
  }

  const resetForm = () => {
    setSelectedTenderId('');
    setWinProbability(50);
    setAiRecommendation(null);
    setItems([{ name: '', description: '', quantity: 1, unit: 'hrs', cost: 0, price: 0 }]);
  }

  const handleViewScenario = (scenario) => {
    setSelectedScenario(scenario)
    setShowViewModal(true)
  }

  const handleDeleteScenario = (scenario) => {
    if (window.confirm(`Are you sure you want to delete this pricing scenario for ${scenario.tenderId?.title}?`)) {
      dispatch(deletePricingScenario(scenario._id));
    }
  }

  const canEditPricing = userHasAnyRole(user, ['PRICING ANALYST', 'TENDER MANAGER', 'ADMIN', 'SYSTEM ADMINISTRATOR']);

  const getScenarioActions = () =>
    buildTableActions({
      onView: true,
      onEdit: false,
      onDelete: canEditPricing,
      onCopy: false
    })

  const handleScenarioAction = (action, scenario) => {
    runTableAction(action, scenario, {
      onView: handleViewScenario,
      onDelete: handleDeleteScenario
    })
  }

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getWinProbabilityColor = (probability) => {
    if (probability >= 80) return 'success'
    if (probability >= 60) return 'primary'
    if (probability >= 40) return 'warning'
    return 'danger'
  }

  const insightItems = useMemo(() => {
    const m = (stats?.totalValue || 0) / 1000000
    return [
      {
        title: 'AI scenario insight',
        detail: `${stats?.totalScenarios || 0} scenarios with $${m.toFixed(1)}M total value. Average win probability is ${(stats?.avgWinProbability || 0).toFixed(1)}%.`,
        tone: 'info'
      }
    ]
  }, [stats])

  const totalValueM = (stats?.totalValue || 0) / 1000000

  return (
    <>
      <ExecutiveCommandCenter
        className="scenarios-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Scenarios', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Scenarios"
        description="Create and manage pricing scenarios with AI-powered optimization"
        heroMeta="Scenario intelligence"
        outlookTitle="Scenario outlook"
        outlookDescription={`${stats?.totalScenarios || 0} scenarios — $${totalValueM.toFixed(1)}M book value.`}
        outlookChips={[
          `${stats?.totalScenarios || 0} total`,
          `$${totalValueM.toFixed(1)}M value`,
          `${(stats?.avgWinProbability || 0).toFixed(0)}% avg win prob`
        ]}
        insights={insightItems}
        kpiTitle="Scenario signal board"
        kpiMeta="Value vs win rate"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total scenarios"
                value={stats?.totalScenarios || 0}
                hint="Modeled postures"
                tone="intel"
                trend="Library"
                icon={<Calculator size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total value"
                displayValue={`$${totalValueM.toFixed(1)}M`}
                hint="Aggregate scenario value"
                tone="success"
                trend="Scale"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg win probability"
                value={(stats?.avgWinProbability || 0).toFixed(0)}
                hint="Expected capture"
                tone={(stats?.avgWinProbability || 0) >= 70 ? 'success' : 'warning'}
                trend="Momentum"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg Margin"
                value={(stats?.avgMargin || 0).toFixed(1)}
                hint="Calculated Profit"
                tone="intel"
                trend="Calibration"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Pricing scenarios (${scenarios?.length || 0})`}
        tableActions={(
          canEditPricing && (
            <Button variant="primary" className="me-2" onClick={() => { resetForm(); setShowModal(true); }}>
              <Plus size={16} className="me-2" />
              New Scenario
            </Button>
          )
        )}
      >
        <Row className="mb-4">
          <Col md={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search scenarios..."
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
                <th>Tender</th>
                <th>Client</th>
                <th>Total Cost</th>
                <th>Total Price</th>
                <th>Margin</th>
                <th>Win Probability</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scenarios && scenarios.filter(scenario => 
                !searchTerm || 
                (scenario.tenderId?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (scenario.tenderId?.organization || '').toLowerCase().includes(searchTerm.toLowerCase())
              ).map((scenario) => (
                <tr key={scenario._id}>
                  <td>
                    <div className="scenario-info">
                      <h6 className="mb-1">{scenario.tenderId?.title || 'Unknown'}</h6>
                      <small className="text-muted">
                        Created: {new Date(scenario.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div className="client-info">
                      {scenario.tenderId?.organization || 'Unknown'}
                    </div>
                  </td>
                  <td>
                    <div className="price-info">
                      <div className="fw-medium text-muted">{formatCurrency(scenario.totals?.cost || 0, scenario.currency)}</div>
                    </div>
                  </td>
                  <td>
                    <div className="price-info">
                      <div className="fw-bold text-success">{formatCurrency(scenario.totals?.price || 0, scenario.currency)}</div>
                    </div>
                  </td>
                  <td>
                    <div className="margin-info">
                      <Badge bg="primary">{(scenario.totals?.marginPercentage || 0).toFixed(1)}%</Badge>
                    </div>
                  </td>
                  <td>
                    <div className="win-probability">
                      <Badge bg={getWinProbabilityColor(scenario.winProbability)}>
                        {scenario.winProbability}%
                      </Badge>
                    </div>
                  </td>
                  <td className="table-actions-col">
                    <TableActionsCell
                      actions={getScenarioActions()}
                      onAction={(action) => handleScenarioAction(action, scenario)}
                    />
                  </td>
                </tr>
              ))}
              {(!scenarios || scenarios.length === 0) && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No scenarios created yet. Build one above!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </ExecutiveCommandCenter>

      {/* NEW SCENARIO FORM MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <Calculator size={20} className="me-2" />
            Build New Pricing Scenario
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body className="bg-light">
            <Row className="mb-4">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-bold">Target Tender</Form.Label>
                  <Form.Select 
                    value={selectedTenderId} 
                    onChange={(e) => setSelectedTenderId(e.target.value)}
                    required
                  >
                    <option value="">-- Select an Approved Tender --</option>
                    {availableTenders.map(t => (
                      <option key={t._id} value={t._id}>{t.title} ({t.organization})</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button 
                  variant="info" 
                  className="w-100 fw-bold text-white shadow-sm" 
                  onClick={handleAIPredict}
                  disabled={isPredicting || !selectedTenderId}
                >
                  <Brain size={18} className="me-2" />
                  {isPredicting ? 'Analyzing...' : '✨ AI Optimization'}
                </Button>
              </Col>
            </Row>

            {aiRecommendation && (
              <Alert variant="success" className="mb-4 shadow-sm border-0">
                <div className="d-flex align-items-center mb-2">
                  <Brain size={20} className="me-2 text-success" />
                  <h6 className="mb-0 fw-bold">AI Pricing Strategy (Confidence: {aiRecommendation.aiConfidence}%)</h6>
                </div>
                <p className="mb-2">{aiRecommendation.aiOptimization}</p>
                <div className="d-flex gap-4 fw-bold">
                  <span>Target Margin: <Badge bg="success" className="fs-6">{aiRecommendation.suggestedMarginPercentage}%</Badge></span>
                  <span>Predicted Win Rate: <Badge bg="primary" className="fs-6">{aiRecommendation.winProbability}%</Badge></span>
                </div>
              </Alert>
            )}

            <div className="bg-white p-4 rounded shadow-sm mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Cost & Pricing Breakdown</h6>
                <Button variant="outline-primary" size="sm" onClick={handleAddItem}>
                  <Plus size={16} className="me-1" /> Add Line Item
                </Button>
              </div>
              
              <Table size="sm" responsive className="align-middle border">
                <thead className="table-light">
                  <tr>
                    <th width="25%">Item Name</th>
                    <th width="15%">Qty</th>
                    <th width="15%">Unit Cost ($)</th>
                    <th width="15%">Unit Price ($)</th>
                    <th width="15%">Line Margin</th>
                    <th width="5%"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const lineCost = (Number(item.quantity) || 0) * (Number(item.cost) || 0);
                    const linePrice = (Number(item.quantity) || 0) * (Number(item.price) || 0);
                    const lineMargin = linePrice - lineCost;
                    const lineMarginPct = lineCost > 0 ? (lineMargin / lineCost) * 100 : 0;
                    
                    return (
                      <tr key={index}>
                        <td>
                          <Form.Control 
                            size="sm" 
                            placeholder="e.g. Senior Architect" 
                            value={item.name} 
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)} 
                            required 
                          />
                        </td>
                        <td>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            min="1" 
                            value={item.quantity} 
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                            required 
                          />
                        </td>
                        <td>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            min="0" 
                            value={item.cost} 
                            onChange={(e) => handleItemChange(index, 'cost', e.target.value)} 
                            required 
                          />
                        </td>
                        <td>
                          <Form.Control 
                            size="sm" 
                            type="number" 
                            min="0" 
                            value={item.price} 
                            onChange={(e) => handleItemChange(index, 'price', e.target.value)} 
                            required 
                          />
                        </td>
                        <td>
                          <Badge bg={lineMarginPct >= 0 ? "success" : "danger"}>
                            {lineMarginPct.toFixed(1)}%
                          </Badge>
                        </td>
                        <td>
                          {items.length > 1 && (
                            <Button variant="link" className="text-danger p-0" onClick={() => handleRemoveItem(index)}>
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="table-light fw-bold">
                  <tr>
                    <td colSpan="2" className="text-end">Totals:</td>
                    <td className="text-danger">{formatCurrency(formTotals.cost)}</td>
                    <td className="text-success">{formatCurrency(formTotals.price)}</td>
                    <td>
                      <Badge bg={formTotals.marginPct >= 0 ? "success" : "danger"} className="fs-6">
                        {formTotals.marginPct.toFixed(1)}% Avg
                      </Badge>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </Table>
            </div>

            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">Adjusted Win Probability (%)</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={winProbability} 
                    onChange={(e) => setWinProbability(e.target.value)} 
                  />
                  <Form.Text className="text-muted">
                    Based on your pricing above, how likely are we to win?
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Pricing Model</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* VIEW MODAL (Simplified) */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Calculator size={20} className="me-2" />
            Pricing Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedScenario && (
            <div className="scenario-details">
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p><strong>Tender:</strong> {selectedScenario.tenderId?.title}</p>
                  <p><strong>Client:</strong> {selectedScenario.tenderId?.organization}</p>
                  <p><strong>Created:</strong> {new Date(selectedScenario.createdAt).toLocaleDateString()}</p>
                </Col>
                <Col md={6}>
                  <h6>Rollup Totals</h6>
                  <p><strong>Total Cost:</strong> <span className="text-danger">{formatCurrency(selectedScenario.totals?.cost)}</span></p>
                  <p><strong>Total Price:</strong> <span className="text-success">{formatCurrency(selectedScenario.totals?.price)}</span></p>
                  <p><strong>Calculated Margin:</strong> <Badge bg="primary">{(selectedScenario.totals?.marginPercentage || 0).toFixed(1)}%</Badge></p>
                  <p><strong>Win Probability:</strong> <Badge bg={getWinProbabilityColor(selectedScenario.winProbability)}>{selectedScenario.winProbability}%</Badge></p>
                </Col>
              </Row>
              <hr />
              <h6>Cost Breakdown</h6>
              <Table size="sm" bordered>
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Unit Cost</th>
                    <th>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedScenario.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.cost)}</td>
                      <td>{formatCurrency(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Scenarios