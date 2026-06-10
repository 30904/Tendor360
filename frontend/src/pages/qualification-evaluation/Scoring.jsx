import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, ProgressBar, Alert } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Edit, Trash2, BarChart, Target, Award, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './Scoring.scss'
import { dummyScoringEvaluationModelForm } from '../../utils/testFormDummies'

const Scoring = () => {
  const navigate = useNavigate()
  const [evaluationModels, setEvaluationModels] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingModel, setEditingModel] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: [],
    weights: {},
    passingScore: 70,
    isActive: true
  })

  useEffect(() => {
    loadEvaluationModels()
  }, [])

  const loadEvaluationModels = () => {
    // Mock data for demonstration
    const mockModels = [
      {
        id: 1,
        name: 'Technical Evaluation Model',
        description: 'Comprehensive technical assessment for IT projects',
        criteria: [
          { id: 1, name: 'Technical Approach', weight: 30, maxScore: 100 },
          { id: 2, name: 'Team Experience', weight: 25, maxScore: 100 },
          { id: 3, name: 'Project Management', weight: 20, maxScore: 100 },
          { id: 4, name: 'Innovation', weight: 15, maxScore: 100 },
          { id: 5, name: 'Risk Management', weight: 10, maxScore: 100 }
        ],
        weights: {
          'Technical Approach': 30,
          'Team Experience': 25,
          'Project Management': 20,
          'Innovation': 15,
          'Risk Management': 10
        },
        passingScore: 75,
        isActive: true,
        usageCount: 15,
        lastUsed: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'Price-Quality Ratio Model',
        description: 'Balanced evaluation considering both price and quality factors',
        criteria: [
          { id: 6, name: 'Price Competitiveness', weight: 40, maxScore: 100 },
          { id: 7, name: 'Quality Standards', weight: 35, maxScore: 100 },
          { id: 8, name: 'Delivery Timeline', weight: 15, maxScore: 100 },
          { id: 9, name: 'After-sales Support', weight: 10, maxScore: 100 }
        ],
        weights: {
          'Price Competitiveness': 40,
          'Quality Standards': 35,
          'Delivery Timeline': 15,
          'After-sales Support': 10
        },
        passingScore: 70,
        isActive: true,
        usageCount: 8,
        lastUsed: '2024-01-14T14:20:00Z'
      },
      {
        id: 3,
        name: 'Compliance-Focused Model',
        description: 'Emphasis on regulatory compliance and certifications',
        criteria: [
          { id: 10, name: 'Regulatory Compliance', weight: 35, maxScore: 100 },
          { id: 11, name: 'Certifications', weight: 25, maxScore: 100 },
          { id: 12, name: 'Security Standards', weight: 20, maxScore: 100 },
          { id: 13, name: 'Environmental Standards', weight: 20, maxScore: 100 }
        ],
        weights: {
          'Regulatory Compliance': 35,
          'Certifications': 25,
          'Security Standards': 20,
          'Environmental Standards': 20
        },
        passingScore: 80,
        isActive: false,
        usageCount: 3,
        lastUsed: '2024-01-10T09:15:00Z'
      },
      {
        id: 4,
        name: 'Innovation-Driven Model',
        description: 'Focus on innovation and cutting-edge solutions',
        criteria: [
          { id: 14, name: 'Innovation Factor', weight: 40, maxScore: 100 },
          { id: 15, name: 'Technology Advancement', weight: 30, maxScore: 100 },
          { id: 16, name: 'Research & Development', weight: 20, maxScore: 100 },
          { id: 17, name: 'Future Scalability', weight: 10, maxScore: 100 }
        ],
        weights: {
          'Innovation Factor': 40,
          'Technology Advancement': 30,
          'Research & Development': 20,
          'Future Scalability': 10
        },
        passingScore: 75,
        isActive: true,
        usageCount: 12,
        lastUsed: '2024-01-18T16:45:00Z'
      },
      {
        id: 5,
        name: 'Sustainability Model',
        description: 'Environmental and social responsibility evaluation',
        criteria: [
          { id: 18, name: 'Environmental Impact', weight: 35, maxScore: 100 },
          { id: 19, name: 'Social Responsibility', weight: 25, maxScore: 100 },
          { id: 20, name: 'Energy Efficiency', weight: 20, maxScore: 100 },
          { id: 21, name: 'Waste Management', weight: 20, maxScore: 100 }
        ],
        weights: {
          'Environmental Impact': 35,
          'Social Responsibility': 25,
          'Energy Efficiency': 20,
          'Waste Management': 20
        },
        passingScore: 70,
        isActive: true,
        usageCount: 7,
        lastUsed: '2024-01-16T11:30:00Z'
      },
      {
        id: 6,
        name: 'Performance Excellence Model',
        description: 'Comprehensive performance and quality assessment',
        criteria: [
          { id: 22, name: 'Performance Metrics', weight: 30, maxScore: 100 },
          { id: 23, name: 'Quality Assurance', weight: 25, maxScore: 100 },
          { id: 24, name: 'Reliability', weight: 20, maxScore: 100 },
          { id: 25, name: 'Maintenance Support', weight: 15, maxScore: 100 },
          { id: 26, name: 'Documentation', weight: 10, maxScore: 100 }
        ],
        weights: {
          'Performance Metrics': 30,
          'Quality Assurance': 25,
          'Reliability': 20,
          'Maintenance Support': 15,
          'Documentation': 10
        },
        passingScore: 80,
        isActive: true,
        usageCount: 20,
        lastUsed: '2024-01-20T14:20:00Z'
      }
    ]
    setEvaluationModels(mockModels)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingModel) {
      setEvaluationModels(prev => prev.map(model =>
        model.id === editingModel.id ? { ...model, ...formData } : model
      ))
    } else {
      const newModel = {
        id: Math.max(...evaluationModels.map(m => m.id)) + 1,
        ...formData,
        usageCount: 0,
        lastUsed: null
      }
      setEvaluationModels(prev => [...prev, newModel])
    }
    setShowModal(false)
    setEditingModel(null)
    resetForm()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this evaluation model?')) {
      setEvaluationModels(prev => prev.filter(model => model.id !== id))
    }
  }

  const handleEdit = (model) => {
    setEditingModel(model)
    setFormData({
      name: model.name,
      description: model.description,
      criteria: model.criteria,
      weights: model.weights,
      passingScore: model.passingScore,
      isActive: model.isActive
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      criteria: [],
      weights: {},
      passingScore: 70,
      isActive: true
    })
  }

  const handleViewModel = (model) => {
    console.log('View model:', model)
    // Navigate to view model or open view modal
  }

  const handleEditModel = (model) => {
    handleEdit(model)
  }

  const handleDeleteModel = (model) => {
    handleDelete(model.id)
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Model Details',
      width: '25%',
      render: (value, row) => (
        <div className="model-info">
          <div className="fw-semibold d-flex align-items-center">
            <BarChart size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="model-meta">
            <small className="text-muted">Criteria: {row.criteria.length}</small>
          </div>
        </div>
      )
    },
    {
      key: 'criteria',
      label: 'Criteria Count',
      width: '10%',
      render: (value) => (
        <div className="criteria-count">
          <div className="fw-bold text-primary">{value.length}</div>
          <small className="text-muted">criteria</small>
        </div>
      )
    },
    {
      key: 'passingScore',
      label: 'Passing Score',
      width: '12%',
      render: (value) => (
        <div className="score-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">Required</small>
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      width: '10%',
      render: (value) => (
        <Badge bg={value ? 'success' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'usageCount',
      label: 'Usage',
      width: '10%',
      render: (value) => (
        <div className="usage-info">
          <div className="fw-bold text-primary">{value}</div>
          <small className="text-muted">times</small>
        </div>
      )
    },
    {
      key: 'lastUsed',
      label: 'Last Used',
      width: '12%',
      render: (value) => {
        if (!value) return <span className="text-muted">Never</span>;
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      key: 'weights',
      label: 'Top Criteria',
      width: '21%',
      render: (value) => {
        const sortedWeights = Object.entries(value).sort((a, b) => b[1] - a[1]);
        const topCriteria = sortedWeights.slice(0, 2);
        return (
          <div className="top-criteria">
            {topCriteria.map(([criteria, weight], index) => (
              <div key={index} className="criteria-item">
                <small className="text-muted">{criteria}: {weight}%</small>
              </div>
            ))}
          </div>
        );
      }
    }
  ]

  const addCriterion = () => {
    const newCriterion = {
      id: Date.now(),
      name: '',
      weight: 0,
      maxScore: 100
    }
    setFormData(prev => ({
      ...prev,
      criteria: [...prev.criteria, newCriterion]
    }))
  }

  const updateCriterion = (index, field, value) => {
    const updatedCriteria = [...formData.criteria]
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value }
    
    // Update weights object
    const updatedWeights = { ...formData.weights }
    if (field === 'name') {
      const oldName = formData.criteria[index].name
      if (oldName) delete updatedWeights[oldName]
      if (value) updatedWeights[value] = updatedCriteria[index].weight
    } else if (field === 'weight') {
      updatedWeights[updatedCriteria[index].name] = value
    }
    
    setFormData(prev => ({
      ...prev,
      criteria: updatedCriteria,
      weights: updatedWeights
    }))
  }

  const removeCriterion = (index) => {
    const updatedCriteria = formData.criteria.filter((_, i) => i !== index)
    const updatedWeights = { ...formData.weights }
    delete updatedWeights[formData.criteria[index].name]
    
    setFormData(prev => ({
      ...prev,
      criteria: updatedCriteria,
      weights: updatedWeights
    }))
  }

  const getTotalWeight = () => {
    return formData.criteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0)
  }

  const getStatusBadge = (isActive) => {
    return <Badge bg={isActive ? 'success' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>
  }

  const modelStats = useMemo(() => {
    const n = evaluationModels.length
    return {
      total: n,
      active: evaluationModels.filter((m) => m.isActive).length,
      usage: evaluationModels.reduce((s, m) => s + (m.usageCount || 0), 0),
      avgPass: n ? Math.round(evaluationModels.reduce((s, m) => s + (m.passingScore || 0), 0) / n) : 0
    }
  }, [evaluationModels])

  const insightItems = useMemo(() => {
    const items = []
    if (modelStats.total > 0) {
      items.push({
        title: `${modelStats.total} models — ${modelStats.active} publishable`,
        detail: `${modelStats.usage} historical runs anchored on a ${modelStats.avgPass}% average passing gate.`,
        tone: 'info'
      })
    }
    if ((modelStats.active || 0) < modelStats.total) {
      items.push({
        title: 'Inactive models are still occupying version space',
        detail: 'Archive superseded rubrics to reduce evaluator confusion.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Author your first scoring archetype',
        detail: 'Models centralize weights, criteria, and passing rules for committee-ready scoring.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [modelStats])

  return (
    <>
      <ExecutiveCommandCenter
        className="scoring-page"
        showSkeleton={loading && !evaluationModels.length}
        breadcrumbs={[
          { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
          { label: 'Scoring models', active: true }
        ]}
        onBack={() => navigate('/qualification-evaluation')}
        backLabel="Back to modules"
        title="Evaluation models & scoring"
        description="Create and administer scoring rubrics with adoption, thresholds, and usage telemetry."
        heroMeta="Technical scoring"
        outlookTitle="Model inventory outlook"
        outlookDescription={`${modelStats.total} models — ${modelStats.active} active — ${modelStats.usage} aggregated uses.`}
        outlookChips={[
          `${modelStats.total} models`,
          `${modelStats.active} active`,
          `${modelStats.usage} uses`,
          `${modelStats.avgPass}% avg pass`
        ]}
        insights={insightItems}
        kpiTitle="Model signal board"
        kpiMeta="Adoption and rigor"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total models"
                value={modelStats.total}
                hint="Configurable rubrics"
                tone="intel"
                trend="Library"
                icon={<BarChart size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active"
                value={modelStats.active}
                hint="Eligible for tenders"
                tone="success"
                trend="Live"
                icon={<Award size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total usage"
                value={modelStats.usage}
                hint="Historical applications"
                tone="warning"
                trend="Demand"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg passing score"
                value={modelStats.avgPass}
                hint="Threshold blend"
                tone="success"
                trend="Bar"
                suffix="%"
                icon={<Target size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Evaluation models (${evaluationModels.length})`}
        tableActions={(
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            <Plus size={20} className="me-2" />
            Add model
          </Button>
        )}
      >
        <DataTable
          data={evaluationModels}
          columns={columns}
          title={`Evaluation Models (${evaluationModels.length})`}
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewModel}
          onEdit={handleEditModel}
          onDelete={handleDeleteModel}
          customActions={[
            {
              type: 'custom',
              label: 'View Analytics',
              onClick: (row) => {
                console.log('View Analytics:', row);
              }
            }
          ]}
          searchPlaceholder="Search evaluation models..."
          emptyMessage="No evaluation models found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        onTestFill={showModal ? () => setFormData(dummyScoringEvaluationModelForm()) : undefined}
      >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingModel ? 'Edit Evaluation Model' : 'Add New Evaluation Model'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Model Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Passing Score (%)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      value={formData.passingScore}
                      onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Form.Group>

              <div className="criteria-section">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6>Evaluation Criteria</h6>
                  <Button variant="outline-primary" size="sm" onClick={addCriterion}>
                    <Plus size={16} className="me-1" />
                    Add Criterion
                  </Button>
                </div>

                {formData.criteria.map((criterion, index) => (
                  <div key={criterion.id} className="criterion-item mb-3 p-3 border rounded">
                    <Row>
                      <Col md={5}>
                        <Form.Group>
                          <Form.Label>Criterion Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={criterion.name}
                            onChange={(e) => updateCriterion(index, 'name', e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Weight (%)</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            max="100"
                            value={criterion.weight}
                            onChange={(e) => updateCriterion(index, 'weight', parseInt(e.target.value) || 0)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Max Score</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            value={criterion.maxScore}
                            onChange={(e) => updateCriterion(index, 'maxScore', parseInt(e.target.value) || 100)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={1} className="d-flex align-items-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeCriterion(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}

                {formData.criteria.length > 0 && (
                  <div className="weight-summary">
                    <Alert variant={getTotalWeight() === 100 ? 'success' : 'warning'}>
                      Total Weight: {getTotalWeight()}% 
                      {getTotalWeight() !== 100 && ' (Should be 100%)'}
                    </Alert>
                  </div>
                )}
              </div>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={getTotalWeight() !== 100 || formData.criteria.length === 0}
              >
                {editingModel ? 'Update' : 'Add Model'}
              </Button>
            </Modal.Footer>
          </Form>
        </FormDrawerModal>
    </>
  )
}

export default Scoring
