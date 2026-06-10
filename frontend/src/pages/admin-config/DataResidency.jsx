import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import { Search, Plus, Edit, Trash2, Eye, Shield, Globe, Brain, CheckCircle, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './DataResidency.scss'

const DataResidency = () => {
  const navigate = useNavigate()
  const [residencyRules, setResidencyRules] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedRule, setSelectedRule] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setResidencyRules([
      {
        id: 1,
        name: 'GDPR Data Residency',
        description: 'European data must remain within EU borders',
        region: 'European Union',
        status: 'Active',
        dataTypes: ['Personal Data', 'Financial Data', 'Health Data'],
        aiOptimization: 'Automated compliance monitoring for EU data',
        aiConfidence: 96,
        priority: 'Critical',
        lastAudit: '2024-02-10',
        complianceScore: 98,
        regulations: ['GDPR', 'Data Protection Act']
      },
      {
        id: 2,
        name: 'US Data Localization',
        description: 'US government data must remain in US territory',
        region: 'United States',
        status: 'Active',
        dataTypes: ['Government Data', 'Classified Information'],
        aiOptimization: 'Enhanced security for sensitive US data',
        aiConfidence: 94,
        priority: 'High',
        lastAudit: '2024-02-08',
        complianceScore: 95,
        regulations: ['FedRAMP', 'FISMA', 'SOX']
      },
      {
        id: 3,
        name: 'APAC Data Sovereignty',
        description: 'Asia-Pacific data residency requirements',
        region: 'Asia-Pacific',
        status: 'Active',
        dataTypes: ['Personal Data', 'Financial Data'],
        aiOptimization: 'Multi-jurisdiction compliance management',
        aiConfidence: 89,
        priority: 'Medium',
        lastAudit: '2024-02-05',
        complianceScore: 92,
        regulations: ['PDPA', 'Privacy Act', 'Data Protection Law']
      }
    ])

    setStats({
      totalRules: 3,
      active: 3,
      regions: 3,
      aiConfidence: 93,
      avgComplianceScore: 95,
      criticalRules: 1,
      lastAudit: '2024-02-10'
    })
  }, [])

  const handleViewRule = (rule) => {
    setSelectedRule(rule)
    setShowModal(true)
  }

  const handleCreateRule = () => {
    if (window.confirm('Are you sure you want to create a new data residency rule?')) {
      console.log('Creating new data residency rule...')
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Pending': 'warning',
      'Violation': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      'Critical': 'danger',
      'High': 'warning',
      'Medium': 'primary',
      'Low': 'secondary'
    }
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  const getRegionIcon = (region) => {
    const icons = {
      'European Union': Globe,
      'United States': Shield,
      'Asia-Pacific': MapPin
    }
    return icons[region] || Globe
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalRules ?? 0) > 0) {
      items.push({
        title: `${stats.totalRules} residency rules · ${stats.regions} regions`,
        detail: `${stats.avgComplianceScore}% avg compliance · ${stats.criticalRules} critical · ${stats.aiConfidence}% AI confidence.`,
        tone: stats.criticalRules > 0 ? 'warning' : 'info'
      })
    }
    if ((stats.criticalRules ?? 0) > 0) {
      items.push({
        title: 'Critical residency policies',
        detail: 'Pair legal review with infra zoning before expanding data planes.',
        tone: 'danger'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Data residency',
        detail: 'Define regions to activate compliance intelligence.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="data-residency-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'Data Residency', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="Data residency command center"
        description="Manage data residency rules and compliance with AI-powered monitoring."
        heroMeta="Regions, regulations, audits"
        outlookTitle="Sovereignty outlook"
        outlookDescription={`${stats.totalRules ?? 0} rules · ${stats.regions ?? 0} regions · ${stats.avgComplianceScore ?? 0}% avg compliance.`}
        outlookChips={[
          `${stats.totalRules ?? 0} rules`,
          `${stats.avgComplianceScore ?? 0}% avg`,
          `${stats.criticalRules ?? 0} critical`,
          `${stats.aiConfidence ?? 0}% AI`
        ]}
        insights={insightItems}
        kpiTitle="Compliance signal board"
        kpiMeta="Rules, scores, model confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total rules"
                value={stats.totalRules ?? 0}
                hint="Scoped policies"
                tone="intel"
                trend="Coverage"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg compliance"
                value={stats.avgComplianceScore ?? 0}
                hint="Portfolio score"
                tone={
                  (stats.avgComplianceScore ?? 0) >= 90
                    ? 'success'
                    : (stats.avgComplianceScore ?? 0) >= 80
                      ? 'warning'
                      : 'danger'
                }
                trend="Quality"
                suffix="%"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Critical rules"
                value={stats.criticalRules ?? 0}
                hint="Executive scrutiny"
                tone={(stats.criticalRules ?? 0) > 0 ? 'danger' : 'success'}
                trend="Risk"
                icon={<Globe size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Monitoring models"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Data residency rules"
        tableActions={
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateRule}>
              <Plus size={16} className="me-2" />
              New Rule
            </Button>
            <Button variant="outline-secondary">
              <Shield size={16} className="me-2" />
              Compliance Report
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
                placeholder="Search residency rules..."
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
                <th>Rule Details</th>
                <th>Region</th>
                <th>Data Types</th>
                <th>Compliance Score</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {residencyRules.filter(rule =>
                !searchTerm ||
                rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rule.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rule.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((rule) => {
                const RegionIcon = getRegionIcon(rule.region)
                return (
                  <tr key={rule.id}>
                    <td>
                      <div className="rule-info">
                        <h6 className="mb-1">{rule.name}</h6>
                        <p className="text-muted mb-1">{rule.description}</p>
                        <small className="text-muted">
                          Last Audit: {rule.lastAudit} • Regulations: {rule.regulations.join(', ')}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="region-info">
                        <div className="d-flex align-items-center">
                          <RegionIcon size={16} className="me-1" />
                          <span>{rule.region}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="data-types">
                        {rule.dataTypes.map((type, index) => (
                          <Badge key={index} bg="info" className="me-1 mb-1">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="compliance-score">
                        <div className="fw-medium text-success">{rule.complianceScore}%</div>
                        <small className="text-muted">AI Confidence: {rule.aiConfidence}%</small>
                      </div>
                    </td>
                    <td>{getStatusBadge(rule.status)}</td>
                    <td>{getPriorityBadge(rule.priority)}</td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleViewRule(rule)}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-1"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Shield size={20} className="me-2" />
            Rule Details - {selectedRule?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRule && (
            <div className="rule-details">
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p><strong>Name:</strong> {selectedRule.name}</p>
                  <p><strong>Region:</strong> {selectedRule.region}</p>
                  <p><strong>Status:</strong> {selectedRule.status}</p>
                  <p><strong>Priority:</strong> {selectedRule.priority}</p>
                  <p><strong>Last Audit:</strong> {selectedRule.lastAudit}</p>
                </Col>
                <Col md={6}>
                  <h6>Compliance Metrics</h6>
                  <p><strong>Compliance Score:</strong> {selectedRule.complianceScore}%</p>
                  <p><strong>AI Confidence:</strong> {selectedRule.aiConfidence}%</p>
                  <p><strong>Data Types:</strong> {selectedRule.dataTypes.length}</p>
                  <p><strong>Regulations:</strong> {selectedRule.regulations.length}</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Description</h6>
                  <p>{selectedRule.description}</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <h6>Data Types</h6>
                  <ul className="data-types-list">
                    {selectedRule.dataTypes.map((type, index) => (
                      <li key={index} className="data-type-item">
                        <CheckCircle size={14} className="me-2 text-success" />
                        {type}
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Regulations</h6>
                  <ul className="regulations-list">
                    {selectedRule.regulations.map((regulation, index) => (
                      <li key={index} className="regulation-item">
                        <Shield size={14} className="me-2 text-primary" />
                        {regulation}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>AI Assessment & Optimization</h6>
                  <Alert variant="info">
                    <Brain size={16} className="me-2" />
                    <strong>Optimization:</strong> {selectedRule.aiOptimization}
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle size={16} className="me-2" />
                    <strong>Confidence Level:</strong> {selectedRule.aiConfidence}% based on compliance monitoring and regulatory analysis
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
            Edit Rule
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DataResidency
