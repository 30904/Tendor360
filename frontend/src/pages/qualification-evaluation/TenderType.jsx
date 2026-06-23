import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Form } from 'react-bootstrap'
import { FileType, Plus, Edit, Trash2, Eye, CheckCircle, AlertTriangle, Settings, Brain, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './TenderType.scss'

const TenderType = () => {
  const navigate = useNavigate()
  const [tenderTypes, setTenderTypes] = useState([])
  const [stats, setStats] = useState({})
  const [showViewModal, setShowViewModal] = useState(false)
  const [showConfigureModal, setShowConfigureModal] = useState(false)
  const [selectedType, setSelectedType] = useState(null)

  useEffect(() => {
    setTenderTypes([
      {
        id: 1,
        name: 'Open Tender',
        description: 'Public tender open to all qualified bidders',
        code: 'OPEN',
        category: 'Public',
        status: 'Active',
        evaluationCriteria: ['Technical', 'Financial', 'Compliance'],
        passingScore: 70,
        maxBidders: 0,
        aiOptimization: 'Enabled',
        aiConfidence: 92,
        usageCount: 45,
        lastUsed: '2024-01-20',
        priority: 'High',
        createdBy: 'Admin',
        createdDate: '2023-06-15'
      },
      {
        id: 2,
        name: 'Limited Tender',
        description: 'Restricted tender for pre-qualified bidders only',
        code: 'LIMITED',
        category: 'Restricted',
        status: 'Active',
        evaluationCriteria: ['Technical', 'Financial', 'Experience'],
        passingScore: 75,
        maxBidders: 5,
        aiOptimization: 'Enabled',
        aiConfidence: 88,
        usageCount: 28,
        lastUsed: '2024-01-18',
        priority: 'High',
        createdBy: 'Admin',
        createdDate: '2023-07-20'
      },
      {
        id: 3,
        name: 'Single Source',
        description: 'Direct procurement from single supplier',
        code: 'SINGLE',
        category: 'Direct',
        status: 'Active',
        evaluationCriteria: ['Technical', 'Financial'],
        passingScore: 60,
        maxBidders: 1,
        aiOptimization: 'Disabled',
        aiConfidence: 0,
        usageCount: 12,
        lastUsed: '2024-01-15',
        priority: 'Medium',
        createdBy: 'Admin',
        createdDate: '2023-08-10'
      },
      {
        id: 4,
        name: 'Framework Agreement',
        description: 'Long-term agreement with multiple suppliers',
        code: 'FRAMEWORK',
        category: 'Agreement',
        status: 'Active',
        evaluationCriteria: ['Technical', 'Financial', 'Performance', 'Compliance'],
        passingScore: 80,
        maxBidders: 10,
        aiOptimization: 'Enabled',
        aiConfidence: 95,
        usageCount: 8,
        lastUsed: '2024-01-12',
        priority: 'High',
        createdBy: 'Admin',
        createdDate: '2023-09-05'
      },
      {
        id: 5,
        name: 'Emergency Procurement',
        description: 'Fast-track procurement for urgent requirements',
        code: 'EMERGENCY',
        category: 'Urgent',
        status: 'Active',
        evaluationCriteria: ['Technical', 'Financial', 'Delivery'],
        passingScore: 65,
        maxBidders: 3,
        aiOptimization: 'Enabled',
        aiConfidence: 85,
        usageCount: 15,
        lastUsed: '2024-01-19',
        priority: 'Critical',
        createdBy: 'Admin',
        createdDate: '2023-10-15'
      },
      {
        id: 6,
        name: 'Design & Build',
        description: 'Combined design and construction tender',
        code: 'DESIGN_BUILD',
        category: 'Construction',
        status: 'Inactive',
        evaluationCriteria: ['Design', 'Technical', 'Financial', 'Timeline'],
        passingScore: 75,
        maxBidders: 0,
        aiOptimization: 'Enabled',
        aiConfidence: 90,
        usageCount: 6,
        lastUsed: '2023-12-20',
        priority: 'Medium',
        createdBy: 'Admin',
        createdDate: '2023-11-01'
      }
    ])

    setStats({
      totalTypes: 6,
      active: 5,
      inactive: 1,
      totalUsage: 114,
      avgAiConfidence: 75,
      categories: 5,
      highPriority: 3
    })
  }, [])

  const handleViewTenderType = (tenderType) => {
    setSelectedType(tenderType)
    setShowViewModal(true)
  }

  const handleEditTenderType = (tenderType) => {
    toast.info(`Editing tender type "${tenderType.name}" is disabled in Demo Mode.`)
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
            <FileType size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="tender-type-meta">
            <small className="text-muted">Code: {row.code}</small>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      width: '10%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
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
      key: 'evaluationCriteria',
      label: 'Criteria',
      width: '12%',
      render: (value) => (
        <div className="criteria-info">
          <div className="fw-bold text-primary">{value.length}</div>
          <small className="text-muted">criteria</small>
        </div>
      )
    },
    {
      key: 'passingScore',
      label: 'Passing Score',
      width: '10%',
      render: (value) => (
        <div className="score-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">Required</small>
        </div>
      )
    },
    {
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '10%',
      render: (value) => (
        <div className="confidence-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">AI Score</small>
        </div>
      )
    },
    {
      key: 'usageCount',
      label: 'Usage',
      width: '8%',
      render: (value) => (
        <div className="usage-info">
          <div className="fw-bold text-primary">{value}</div>
          <small className="text-muted">times</small>
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
      key: 'lastUsed',
      label: 'Last Used',
      width: '9%',
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

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalTypes || 0) > 0) {
      items.push({
        title: `${stats.totalTypes || 0} tender types drive ${stats.totalUsage || 0} cumulative usage`,
        detail: `${stats.active || 0} types are active with ${stats.avgAiConfidence || 0}% average AI confidence on configuration recommendations.`,
        tone: 'info'
      })
    }
    if ((stats.avgAiConfidence || 0) >= 85) {
      items.push({
        title: 'Model confidence supports automated tender-type guidance',
        detail: 'Use AI recommendations to shorten cycle time when launching new procurements.',
        tone: 'success'
      })
    } else if ((stats.avgAiConfidence || 0) > 0) {
      items.push({
        title: 'Refresh baseline data to lift AI confidence on tender profiles',
        detail: 'Historical usage and outcomes help the model stabilize type-level scoring.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Define your first tender type library',
        detail: 'Add types to anchor evaluation workflows and downstream scoring models.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
      className="tender-type-page"
      breadcrumbs={[
        { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
        { label: 'Tender type', active: true }
      ]}
      onBack={() => navigate('/qualification-evaluation')}
      backLabel="Back to modules"
      title="Tender type command center"
      description="Configure and manage tender types and evaluation hooks with portfolio usage and AI confidence signals."
      heroMeta="Qualification taxonomy"
      outlookTitle="Tender type outlook"
      outlookDescription={`${stats.totalTypes || 0} configured types — ${stats.active || 0} active, ${stats.totalUsage || 0} cumulative usage.`}
      outlookChips={[
        `${stats.totalTypes || 0} types`,
        `${stats.active || 0} active`,
        `${stats.totalUsage || 0} usage`,
        `${stats.avgAiConfidence || 0}% AI confidence`
      ]}
      insights={insightItems}
      kpiTitle="Tender type signal board"
      kpiMeta="Adoption and model assurance"
      kpiContent={(
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Total types"
              value={stats.totalTypes || 0}
              hint="Catalogued tender types"
              tone="intel"
              trend="Registry"
              icon={<FileType size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Active"
              value={stats.active || 0}
              hint="In production use"
              tone="success"
              trend="Live"
              icon={<CheckCircle size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Total usage"
              value={stats.totalUsage || 0}
              hint="Historical applications"
              tone="warning"
              trend="Throughput"
              icon={<Target size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Avg AI confidence"
              value={stats.avgAiConfidence || 0}
              hint="Configuration recommendations"
              tone={(stats.avgAiConfidence || 0) >= 85 ? 'success' : 'warning'}
              trend="Quality"
              suffix="%"
              icon={<Brain size={20} />}
            />
          </Col>
        </Row>
      )}
      tableTitle={`Tender types (${tenderTypes.length})`}
      tableActions={(
        <>
          <Button variant="primary" className="me-2" onClick={() => toast.info("Creating tender types is disabled in Demo Mode.")}>
            <Plus size={16} className="me-2" />
            New tender type
          </Button>
          <Button variant="outline-secondary" onClick={() => toast.info("Global settings are locked.")}>
            <Settings size={16} className="me-2" />
            Configure
          </Button>
        </>
      )}
    >
      <DataTable
        data={tenderTypes}
        columns={columns}
        title="Tender Type Management"
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
            label: 'Configure Criteria',
            onClick: (row) => {
              setSelectedType(row);
              setShowConfigureModal(true);
            }
          }
        ]}
        searchPlaceholder="Search tender types..."
        emptyMessage="No tender types found"
        loading={false}
      />
    </ExecutiveCommandCenter>

      {/* Details View Modal */}
      <Modal show={showViewModal} onHide={() => { setShowViewModal(false); setSelectedType(null); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FileType size={20} className="me-2 text-primary" />
            Tender Type Details - {selectedType?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedType && (
            <div className="tender-type-view-details">
              <Row className="mb-4">
                <Col md={6}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Details</h6>
                    <p className="mb-1"><strong>Code:</strong> {selectedType.code}</p>
                    <p className="mb-1"><strong>Category:</strong> {selectedType.category}</p>
                    <p className="mb-1"><strong>Status:</strong> <Badge bg={selectedType.status === 'Active' ? 'success' : 'secondary'}>{selectedType.status}</Badge></p>
                    <p className="mb-0"><strong>Passing Score:</strong> {selectedType.passingScore}%</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Metrics & Author</h6>
                    <p className="mb-1"><strong>Usage Count:</strong> {selectedType.usageCount} times</p>
                    <p className="mb-1"><strong>Created By:</strong> {selectedType.createdBy}</p>
                    <p className="mb-1"><strong>Created Date:</strong> {selectedType.createdDate}</p>
                    <p className="mb-0"><strong>Last Used Date:</strong> {selectedType.lastUsed}</p>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={12}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Description</h6>
                    <p className="mb-0">{selectedType.description}</p>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={12}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Evaluation Criteria Hooked</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedType.evaluationCriteria?.map((crit, idx) => (
                        <Badge bg="info" key={idx}>{crit}</Badge>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className="p-3 border rounded bg-light">
                    <h6 className="text-muted mb-2">AI Guidance Mode</h6>
                    <Alert variant={selectedType.aiOptimization === 'Enabled' ? 'success' : 'warning'} className="mb-0 d-flex align-items-center">
                      <Brain size={16} className="me-2 text-primary" />
                      <div>
                        <strong>AI Optimization:</strong> {selectedType.aiOptimization} • 
                        <strong> Model Stance Confidence:</strong> {selectedType.aiConfidence}%
                      </div>
                    </Alert>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowViewModal(false); setSelectedType(null); }}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowViewModal(false);
            handleEditTenderType(selectedType);
          }}>
            <Edit size={16} className="me-2" />
            Edit Type
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Configure Criteria Modal */}
      <Modal show={showConfigureModal} onHide={() => { setShowConfigureModal(false); setSelectedType(null); }} size="md">
        <Modal.Header closeButton>
          <Modal.Title>
            <Settings size={20} className="me-2 text-info" />
            Configure Criteria - {selectedType?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedType && (
            <div className="configure-criteria-flow">
              <p className="text-muted small">Select active scoring categories for this tender type. AI validation operates on all selected domains.</p>
              <Form onSubmit={(e) => { e.preventDefault(); setShowConfigureModal(false); toast.success("Evaluation criteria configured successfully!"); }}>
                {['Technical', 'Financial', 'Compliance', 'Experience', 'Delivery', 'Safety'].map((crit, idx) => (
                  <Form.Check 
                    type="checkbox"
                    id={`crit-check-${idx}`}
                    label={crit}
                    key={idx}
                    className="mb-2"
                    defaultChecked={selectedType.evaluationCriteria?.includes(crit) || idx < 3}
                  />
                ))}
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowConfigureModal(false); setSelectedType(null); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => { setShowConfigureModal(false); setSelectedType(null); toast.success("Evaluation criteria configured successfully!"); }}>
            Save Configuration
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TenderType