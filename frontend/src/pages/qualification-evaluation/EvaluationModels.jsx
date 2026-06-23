import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, Alert, ProgressBar } from 'react-bootstrap'
import { Plus, Edit, Trash2, Eye, BarChart, Target, Brain, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { toast } from 'react-toastify'
import './EvaluationModels.scss'

const EvaluationModels = () => {
  const navigate = useNavigate()
  const [evaluationModels, setEvaluationModels] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedModel, setSelectedModel] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setEvaluationModels([
      {
        id: 1,
        name: 'Technical-Commercial Weighted',
        description: 'Balanced evaluation with technical and commercial criteria',
        type: 'Weighted',
        criteria: [
          { name: 'Technical Capability', weight: 40, score: 85 },
          { name: 'Commercial Proposal', weight: 35, score: 78 },
          { name: 'Past Performance', weight: 15, score: 92 },
          { name: 'Risk Assessment', weight: 10, score: 88 }
        ],
        totalWeight: 100,
        aiOptimization: 'Optimal weight distribution for balanced evaluation',
        aiConfidence: 92,
        successRate: 87,
        avgScore: 83,
        complexity: 'Medium',
        usage: 'High',
        lastUsed: '2024-02-10'
      },
      {
        id: 2,
        name: 'Price-Focused Model',
        description: 'Price-driven evaluation with minimum technical thresholds',
        type: 'Price-Focused',
        criteria: [
          { name: 'Price Competitiveness', weight: 70, score: 95 },
          { name: 'Technical Compliance', weight: 20, score: 82 },
          { name: 'Delivery Capability', weight: 10, score: 88 }
        ],
        totalWeight: 100,
        aiOptimization: 'Price optimization with quality safeguards',
        aiConfidence: 88,
        successRate: 82,
        avgScore: 88,
        complexity: 'Low',
        usage: 'Medium',
        lastUsed: '2024-02-08'
      },
      {
        id: 3,
        name: 'Quality-First Model',
        description: 'Quality-focused evaluation with premium pricing consideration',
        type: 'Quality-Focused',
        criteria: [
          { name: 'Technical Excellence', weight: 50, score: 94 },
          { name: 'Innovation & Value', weight: 25, score: 89 },
          { name: 'Commercial Viability', weight: 15, score: 76 },
          { name: 'Sustainability', weight: 10, score: 91 }
        ],
        totalWeight: 100,
        aiOptimization: 'Quality-driven selection with innovation focus',
        aiConfidence: 85,
        successRate: 79,
        avgScore: 87,
        complexity: 'High',
        usage: 'Low',
        lastUsed: '2024-02-05'
      },
      {
        id: 4,
        name: 'Risk-Adjusted Model',
        description: 'Risk-aware evaluation with comprehensive risk assessment',
        type: 'Risk-Focused',
        criteria: [
          { name: 'Risk Mitigation', weight: 35, score: 88 },
          { name: 'Technical Capability', weight: 30, score: 82 },
          { name: 'Financial Stability', weight: 20, score: 90 },
          { name: 'Commercial Terms', weight: 15, score: 85 }
        ],
        totalWeight: 100,
        aiOptimization: 'Risk-balanced evaluation with stability focus',
        aiConfidence: 90,
        successRate: 85,
        avgScore: 86,
        complexity: 'Medium',
        usage: 'Medium',
        lastUsed: '2024-02-12'
      },
      {
        id: 5,
        name: 'Innovation-Driven Model',
        description: 'Innovation-focused evaluation for cutting-edge projects',
        type: 'Innovation-Focused',
        criteria: [
          { name: 'Innovation Factor', weight: 45, score: 92 },
          { name: 'Technical Feasibility', weight: 25, score: 88 },
          { name: 'Market Potential', weight: 20, score: 85 },
          { name: 'Implementation Risk', weight: 10, score: 78 }
        ],
        totalWeight: 100,
        aiOptimization: 'Innovation-centric with feasibility validation',
        aiConfidence: 87,
        successRate: 81,
        avgScore: 86,
        complexity: 'High',
        usage: 'Low',
        lastUsed: '2024-02-09'
      },
      {
        id: 6,
        name: 'Sustainability Model',
        description: 'Environmentally conscious evaluation with sustainability focus',
        type: 'Sustainability-Focused',
        criteria: [
          { name: 'Environmental Impact', weight: 40, score: 89 },
          { name: 'Social Responsibility', weight: 25, score: 87 },
          { name: 'Economic Viability', weight: 20, score: 83 },
          { name: 'Long-term Value', weight: 15, score: 91 }
        ],
        totalWeight: 100,
        aiOptimization: 'Sustainability-balanced with economic viability',
        aiConfidence: 89,
        successRate: 84,
        avgScore: 87,
        complexity: 'Medium',
        usage: 'Medium',
        lastUsed: '2024-02-11'
      }
    ])

    setStats({
      totalModels: 6,
      active: 6,
      avgSuccessRate: 83,
      aiConfidence: 88,
      totalCriteria: 24,
      avgScore: 86
    })
  }, [])

  const handleViewModel = (model) => {
    setSelectedModel(model)
    setShowModal(true)
  }

  const handleCreateModel = () => {
    const newId = evaluationModels.length ? Math.max(...evaluationModels.map(m => m.id)) + 1 : 1
    const dummyModel = {
      id: newId,
      name: `Evaluation Model ${newId}`,
      description: 'AI-generated evaluation model for commercial proposals.',
      type: 'Weighted',
      criteria: [
        { name: 'Technical Quality', weight: 60, score: 90 },
        { name: 'Cost competitiveness', weight: 40, score: 85 }
      ],
      totalWeight: 100,
      aiOptimization: 'Optimized for high-yield tenders',
      aiConfidence: 94,
      successRate: 88,
      avgScore: 88,
      complexity: 'Low',
      usage: 'Low',
      lastUsed: new Date().toISOString().split('T')[0]
    }
    setEvaluationModels(prev => [dummyModel, ...prev])
    toast.success(`Successfully initialized model "${dummyModel.name}"!`)
  }

  const handleEditModel = (model) => {
    toast.info(`Editing model "${model.name}" is locked.`)
  }

  const handleDeleteModel = (model) => {
    if (window.confirm(`Are you sure you want to delete model "${model.name}"?`)) {
      setEvaluationModels(prev => prev.filter(m => m.id !== model.id))
    }
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
            <small className="text-muted">Type: {row.type}</small>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      width: '12%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'criteria',
      label: 'Criteria',
      width: '10%',
      render: (value) => (
        <div className="criteria-info">
          <div className="fw-bold text-primary">{value.length}</div>
          <small className="text-muted">criteria</small>
        </div>
      )
    },
    {
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '12%',
      render: (value) => (
        <div className="confidence-info">
          <div className="fw-bold text-primary">{value}%</div>
          <ProgressBar
            now={value}
            variant={value >= 90 ? 'success' : value >= 75 ? 'primary' : 'warning'}
            size="sm"
            style={{ height: '4px' }}
          />
        </div>
      )
    },
    {
      key: 'successRate',
      label: 'Success Rate',
      width: '12%',
      render: (value) => (
        <div className="success-info">
          <div className="fw-bold text-success">{value}%</div>
          <ProgressBar
            now={value}
            variant={value >= 85 ? 'success' : value >= 70 ? 'warning' : 'danger'}
            size="sm"
            style={{ height: '4px' }}
          />
        </div>
      )
    },
    {
      key: 'complexity',
      label: 'Complexity',
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
      key: 'usage',
      label: 'Usage',
      width: '8%',
      render: (value) => {
        const variants = {
          'High': 'success',
          'Medium': 'warning',
          'Low': 'secondary'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'lastUsed',
      label: 'Last Used',
      width: '11%',
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

  const getComplexityBadge = (complexity) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return <Badge bg={variants[complexity] || 'secondary'}>{complexity}</Badge>
  }

  const getUsageBadge = (usage) => {
    const variants = {
      'High': 'success',
      'Medium': 'warning',
      'Low': 'secondary'
    }
    return <Badge bg={variants[usage] || 'secondary'}>{usage}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Weighted': BarChart,
      'Price-Focused': Target,
      'Quality-Focused': CheckCircle
    }
    return icons[type] || BarChart
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 80) return 'primary'
    if (score >= 70) return 'warning'
    return 'danger'
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalModels || 0) > 0) {
      items.push({
        title: `${stats.totalModels} scoring models calibrated with ${stats.aiConfidence}% portfolio AI confidence`,
        detail: `${stats.avgSuccessRate || 0}% historical success uplift across ${stats.totalCriteria || 0} weighted criteria.`,
        tone: 'info'
      })
    }
    if ((stats.avgSuccessRate || 0) >= 82) {
      items.push({
        title: 'Model mix is outperforming benchmarks',
        detail: 'Clone top-performing skeletons into adjacent categories.',
        tone: 'success'
      })
    }
    items.push({
      title: 'Keep criterion weights audited before live committees',
      detail: 'Version every change to preserve defensibility.',
      tone: 'warning'
    })
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="evaluation-models-page"
        breadcrumbs={[
          { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
          { label: 'Evaluation models', active: true }
        ]}
        onBack={() => navigate('/qualification-evaluation')}
        backLabel="Back to modules"
        title="Evaluation models command center"
        description="Design scoring rubrics with historical lift, criterion depth, and model assurance telemetry."
        heroMeta="Methodology cockpit"
        outlookTitle="Methodology outlook"
        outlookDescription={`${stats.totalModels || 0} models — ${stats.totalCriteria || 0} pooled criteria — ${stats.avgSuccessRate || 0}% average success uplift.`}
        outlookChips={[
          `${stats.totalModels || 0} models`,
          `${stats.totalCriteria || 0} criteria`,
          `${stats.avgSuccessRate || 0}% success`,
          `${stats.aiConfidence || 0}% AI stance`
        ]}
        insights={insightItems}
        kpiTitle="Models signal board"
        kpiMeta="Coverage and uplift"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total models"
                value={stats.totalModels || 0}
                hint="Active rubrics"
                tone="intel"
                trend="Library"
                icon={<BarChart size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg success rate"
                value={stats.avgSuccessRate || 0}
                hint="Historical lift"
                tone="success"
                trend="Outcome"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total criteria"
                value={stats.totalCriteria || 0}
                hint="Across all weights"
                tone="warning"
                trend="Granularity"
                icon={<Target size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence || 0}
                hint="Optimization stance"
                tone={(stats.aiConfidence || 0) >= 88 ? 'success' : 'warning'}
                trend="Model"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Evaluation models (${evaluationModels.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateModel}>
              <Plus size={16} className="me-2" />
              New model
            </Button>
            <Button variant="outline-secondary">
              <BarChart size={16} className="me-2" />
              Export report
            </Button>
          </>
        )}
      >
        <DataTable
          data={evaluationModels}
          columns={columns}
          title="Evaluation Models & Scoring"
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
              label: 'View Details',
              onClick: (row) => {
                handleViewModel(row);
              }
            }
          ]}
          searchPlaceholder="Search evaluation models..."
          emptyMessage="No evaluation models found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <BarChart size={20} className="me-2" />
              Model Details - {selectedModel?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedModel && (
              <div className="model-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedModel.type}</p>
                    <p><strong>Complexity:</strong> {selectedModel.complexity}</p>
                    <p><strong>Usage:</strong> {selectedModel.usage}</p>
                    <p><strong>Last Used:</strong> {selectedModel.lastUsed}</p>
                    <p><strong>Total Weight:</strong> {selectedModel.totalWeight}%</p>
                  </Col>
                  <Col md={6}>
                    <h6>Performance Metrics</h6>
                    <p><strong>Success Rate:</strong> {selectedModel.successRate}%</p>
                    <p><strong>Average Score:</strong> {selectedModel.avgScore}%</p>
                    <p><strong>AI Confidence:</strong> {selectedModel.aiConfidence}%</p>
                    <p><strong>Criteria Count:</strong> {selectedModel.criteria.length}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedModel.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Evaluation Criteria & Scoring</h6>
                    <div className="criteria-list">
                      {selectedModel.criteria.map((criterion, index) => (
                        <div key={index} className="criterion-item">
                          <div className="criterion-header">
                            <div className="criterion-name">
                              <h6 className="mb-1">{criterion.name}</h6>
                              <small className="text-muted">Weight: {criterion.weight}%</small>
                            </div>
                            <div className="criterion-score">
                              <Badge bg={getScoreColor(criterion.score)}>
                                {criterion.score}%
                              </Badge>
                            </div>
                          </div>
                          <ProgressBar 
                            variant={getScoreColor(criterion.score)}
                            now={criterion.score}
                            className="mt-2"
                          />
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Assessment & Optimization</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Optimization:</strong> {selectedModel.aiOptimization}
                    </Alert>
                    <Alert variant="success">
                      <TrendingUp size={16} className="me-2" />
                      <strong>Confidence Level:</strong> {selectedModel.aiConfidence}% based on historical performance and scoring accuracy analysis
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
            <Button variant="primary" onClick={() => {
              setShowModal(false);
              handleEditModel(selectedModel);
            }}>
              <Edit size={16} className="me-2" />
              Edit Model
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default EvaluationModels
