import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, Alert } from 'react-bootstrap'
import { Plus, Edit, Trash2, Eye, FileText, Building, Users, Brain, CheckCircle, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './TenderTypeStructure.scss'

const TenderTypeStructure = () => {
  const navigate = useNavigate()
  const [tenderTypes, setTenderTypes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setTenderTypes([
      {
        id: 1,
        name: 'Open Tender',
        description: 'Public invitation to all eligible bidders',
        category: 'Public',
        structure: 'Single Stage',
        evaluationMethod: 'Lowest Price',
        complexity: 'Low',
        duration: '30-45 days',
        requirements: [
          'Basic qualification criteria',
          'Technical specifications compliance',
          'Price competitiveness',
          'Delivery timeline'
        ],
        aiRecommendation: 'Suitable for standard goods and services',
        aiConfidence: 92,
        successRate: 85,
        avgBidders: 12,
        complianceScore: 94,
        riskLevel: 'Low'
      },
      {
        id: 2,
        name: 'Limited Tender',
        description: 'Invitation to pre-selected bidders only',
        category: 'Restricted',
        structure: 'Two Stage',
        evaluationMethod: 'Best Value',
        complexity: 'Medium',
        duration: '45-60 days',
        requirements: [
          'Pre-qualification criteria',
          'Technical capability assessment',
          'Financial stability proof',
          'Past performance records'
        ],
        aiRecommendation: 'Ideal for specialized services with limited suppliers',
        aiConfidence: 88,
        successRate: 78,
        avgBidders: 6,
        complianceScore: 89,
        riskLevel: 'Medium'
      },
      {
        id: 3,
        name: 'Negotiated Tender',
        description: 'Direct negotiation with selected suppliers',
        category: 'Negotiated',
        structure: 'Multi Stage',
        evaluationMethod: 'Technical + Commercial',
        complexity: 'High',
        duration: '60-90 days',
        requirements: [
          'Detailed technical proposals',
          'Commercial negotiations',
          'Risk assessment',
          'Contract terms alignment'
        ],
        aiRecommendation: 'Best for complex projects requiring customization',
        aiConfidence: 85,
        successRate: 72,
        avgBidders: 3,
        complianceScore: 82,
        riskLevel: 'High'
      },
      {
        id: 4,
        name: 'Framework Agreement',
        description: 'Long-term agreement with multiple suppliers',
        category: 'Agreement',
        structure: 'Multi Stage',
        evaluationMethod: 'Best Value',
        complexity: 'Medium',
        duration: '90-120 days',
        requirements: [
          'Framework qualification',
          'Call-off procedures',
          'Performance monitoring',
          'Contract management'
        ],
        aiRecommendation: 'Optimal for recurring services and supplies',
        aiConfidence: 90,
        successRate: 88,
        avgBidders: 8,
        complianceScore: 91,
        riskLevel: 'Low'
      },
      {
        id: 5,
        name: 'Design & Build',
        description: 'Combined design and construction tender',
        category: 'Construction',
        structure: 'Two Stage',
        evaluationMethod: 'Technical + Price',
        complexity: 'High',
        duration: '75-105 days',
        requirements: [
          'Design proposals',
          'Technical specifications',
          'Construction methodology',
          'Price competitiveness'
        ],
        aiRecommendation: 'Suitable for construction projects with design elements',
        aiConfidence: 87,
        successRate: 75,
        avgBidders: 5,
        complianceScore: 86,
        riskLevel: 'Medium'
      },
      {
        id: 6,
        name: 'Emergency Procurement',
        description: 'Fast-track procurement for urgent requirements',
        category: 'Urgent',
        structure: 'Single Stage',
        evaluationMethod: 'Lowest Price',
        complexity: 'Low',
        duration: '7-14 days',
        requirements: [
          'Basic qualification',
          'Price competitiveness',
          'Delivery capability',
          'Emergency response'
        ],
        aiRecommendation: 'Ideal for urgent situations requiring quick procurement',
        aiConfidence: 95,
        successRate: 92,
        avgBidders: 4,
        complianceScore: 89,
        riskLevel: 'Low'
      }
    ])

    setStats({
      totalTypes: 6,
      active: 6,
      avgSuccessRate: 82,
      aiConfidence: 90,
      totalBidders: 38,
      avgCompliance: 88
    })
  }, [])

  const handleViewType = (type) => {
    setSelectedType(type)
    setShowModal(true)
  }

  const handleCreateType = () => {
    if (window.confirm('Are you sure you want to create a new tender type?')) {
      // Implementation for creating new tender type
      console.log('Creating new tender type...')
    }
  }

  const getComplexityBadge = (complexity) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return <Badge bg={variants[complexity] || 'secondary'}>{complexity}</Badge>
  }

  const getRiskBadge = (risk) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return <Badge bg={variants[risk] || 'secondary'}>{risk}</Badge>
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Public': FileText,
      'Restricted': Building,
      'Negotiated': Users,
      'Agreement': Building,
      'Construction': Building,
      'Urgent': AlertTriangle
    }
    return icons[category] || FileText
  }

  const handleViewTenderType = (tenderType) => {
    handleViewType(tenderType)
  }

  const handleEditTenderType = (tenderType) => {
    console.log('Edit tender type:', tenderType)
    // Navigate to edit tender type or open edit modal
  }

  const handleDeleteTenderType = (tenderType) => {
    if (window.confirm(`Are you sure you want to delete tender type "${tenderType.name}"?`)) {
      setTenderTypes(prev => prev.filter(t => t.id !== tenderType.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Tender Type Details',
      width: '25%',
      render: (value, row) => (
        <div className="tender-type-info">
          <div className="fw-semibold d-flex align-items-center">
            <FileText size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="tender-type-meta">
            <small className="text-muted">Category: {row.category}</small>
          </div>
        </div>
      )
    },
    {
      key: 'structure',
      label: 'Structure',
      width: '12%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'evaluationMethod',
      label: 'Evaluation Method',
      width: '15%',
      render: (value) => (
        <div className="evaluation-method">
          <div className="fw-bold text-primary">{value}</div>
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
      key: 'duration',
      label: 'Duration',
      width: '10%',
      render: (value) => (
        <div className="duration-info">
          <div className="fw-bold text-primary">{value}</div>
        </div>
      )
    },
    {
      key: 'successRate',
      label: 'Success Rate',
      width: '10%',
      render: (value) => (
        <div className="success-rate">
          <div className="fw-bold text-success">{value}%</div>
        </div>
      )
    },
    {
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '10%',
      render: (value) => (
        <div className="ai-confidence">
          <div className="fw-bold text-primary">{value}%</div>
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
    }
  ]

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalTypes || 0) > 0) {
      items.push({
        title: `${stats.totalTypes} tender structures mapped with ${stats.aiConfidence}% model confidence`,
        detail: `Average historical success runs at ${stats.avgSuccessRate}% with ${stats.totalBidders} bidder observations and ${stats.avgCompliance}% blended compliance.`,
        tone: 'info'
      })
    }
    if ((stats.avgSuccessRate || 0) < 78) {
      items.push({
        title: 'Some structures trail the portfolio on success rate',
        detail: 'Review evaluation method and bidder pool for weaker-performing types.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Launch structure templates before the next solicitation wave',
        detail: 'Publishing types here unlocks consistent evaluation paths and bidder guidance.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="tender-type-structure-page"
        breadcrumbs={[
          { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
          { label: 'Tender type & structure', active: true }
        ]}
        onBack={() => navigate('/qualification-evaluation')}
        backLabel="Back to modules"
        title="Tender structure command center"
        description="Define tender types, stages, and evaluation methods with success-rate visibility and bidder coverage."
        heroMeta="Structure intelligence"
        outlookTitle="Structure & bidder outlook"
        outlookDescription={`${stats.totalTypes || 0} types — average success ${stats.avgSuccessRate || 0}% with ${stats.totalBidders || 0} observed bidders.`}
        outlookChips={[
          `${stats.totalTypes || 0} types`,
          `${stats.avgSuccessRate || 0}% success`,
          `${stats.totalBidders || 0} bidders`,
          `${stats.avgCompliance || 0}% compliance blend`
        ]}
        insights={insightItems}
        kpiTitle="Structure signal board"
        kpiMeta="Performance and bidder depth"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total types"
                value={stats.totalTypes || 0}
                hint="Structure catalog"
                tone="intel"
                trend="Coverage"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg success rate"
                value={stats.avgSuccessRate || 0}
                hint="Historical wins"
                tone="success"
                trend="Momentum"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total bidders"
                value={stats.totalBidders || 0}
                hint="Across structures"
                tone="warning"
                trend="Liquidity"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence || 0}
                hint="Structural recommendations"
                tone={(stats.aiConfidence || 0) >= 88 ? 'success' : 'warning'}
                trend="Model"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Tender types & structures (${tenderTypes.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateType}>
              <Plus size={16} className="me-2" />
              New tender type
            </Button>
            <Button variant="outline-secondary">
              <FileText size={16} className="me-2" />
              Export report
            </Button>
          </>
        )}
      >
        <DataTable
          data={tenderTypes}
          columns={columns}
          title="Tender Types & Structures"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewTenderType}
          onEdit={handleEditTenderType}
          onDelete={handleDeleteTenderType}
          customActions={[
            {
              type: 'custom',
              label: 'View Structure',
              onClick: (row) => {
                console.log('View Structure:', row);
              }
            }
          ]}
          searchPlaceholder="Search tender types..."
          emptyMessage="No tender types found"
          loading={false}
        />
      </ExecutiveCommandCenter>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <FileText size={20} className="me-2" />
              Tender Type Details - {selectedType?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedType && (
              <div className="type-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Category:</strong> {selectedType.category}</p>
                    <p><strong>Structure:</strong> {selectedType.structure}</p>
                    <p><strong>Evaluation Method:</strong> {selectedType.evaluationMethod}</p>
                    <p><strong>Complexity:</strong> {selectedType.complexity}</p>
                    <p><strong>Duration:</strong> {selectedType.duration}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Performance Metrics</h6>
                    <p><strong>Success Rate:</strong> {selectedType.successRate}%</p>
                    <p><strong>Average Bidders:</strong> {selectedType.avgBidders}</p>
                    <p><strong>Compliance Score:</strong> {selectedType.complianceScore}%</p>
                    <p><strong>Risk Level:</strong> {selectedType.riskLevel}</p>
                    <p><strong>AI Confidence:</strong> {selectedType.aiConfidence}%</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedType.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={6}>
                    <h6>Requirements</h6>
                    <ul className="requirements-list">
                      {selectedType.requirements.map((requirement, index) => (
                        <li key={index} className="requirement-item">
                          <CheckCircle size={14} className="me-2 text-success" />
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>AI Assessment & Recommendation</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Recommendation:</strong> {selectedType.aiRecommendation}
                    </Alert>
                    <Alert variant="success">
                      <CheckCircle size={16} className="me-2" />
                      <strong>Confidence Level:</strong> {selectedType.aiConfidence}% based on historical performance and market analysis
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
            <Button variant="primary">
              <Edit size={16} className="me-2" />
              Edit Type
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default TenderTypeStructure
