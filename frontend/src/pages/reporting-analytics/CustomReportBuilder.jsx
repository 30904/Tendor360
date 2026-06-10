import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Trash2, Eye, FileText, Brain, Download, Settings, BarChart, PieChart, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './CustomReportBuilder.scss'

const CustomReportBuilder = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setReports([
      {
        id: 1,
        name: 'Tender Performance Dashboard',
        description: 'Comprehensive dashboard showing tender performance metrics and KPIs',
        category: 'Performance',
        type: 'Dashboard',
        status: 'Active',
        createdBy: 'John Doe',
        createdDate: '2024-01-20',
        lastRun: '2024-01-21',
        nextRun: '2024-01-22',
        aiOptimized: true,
        aiInsights: 'Report shows 15% improvement in win rate over last quarter',
        charts: 8,
        dataSources: 5
      },
      {
        id: 2,
        name: 'Financial Analysis Report',
        description: 'Detailed financial analysis of tender costs and profitability',
        category: 'Financial',
        type: 'Analytical',
        status: 'Draft',
        createdBy: 'Jane Smith',
        createdDate: '2024-01-19',
        lastRun: null,
        nextRun: null,
        aiOptimized: false,
        aiInsights: 'Consider adding cost trend analysis for better insights',
        charts: 6,
        dataSources: 3
      },
      {
        id: 3,
        name: 'Compliance Monitoring Report',
        description: 'Real-time compliance monitoring and audit trail report',
        category: 'Compliance',
        type: 'Monitoring',
        status: 'Active',
        createdBy: 'Mike Johnson',
        createdDate: '2024-01-18',
        lastRun: '2024-01-21',
        nextRun: '2024-01-22',
        aiOptimized: true,
        aiInsights: 'All compliance metrics are within acceptable ranges',
        charts: 4,
        dataSources: 7
      }
    ])

    setStats({
      totalReports: 3,
      active: 2,
      draft: 1,
      totalCharts: 18,
      totalDataSources: 15,
      aiOptimized: 2
    })
  }, [])

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setShowModal(true)
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Draft': 'warning',
      'Inactive': 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getCategoryBadge = (category) => {
    const variants = {
      'Performance': 'primary',
      'Financial': 'success',
      'Compliance': 'info',
      'Operational': 'warning'
    }
    return <Badge bg={variants[category] || 'secondary'}>{category}</Badge>
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Dashboard': return <BarChart size={16} />
      case 'Analytical': return <TrendingUp size={16} />
      case 'Monitoring': return <PieChart size={16} />
      default: return <FileText size={16} />
    }
  }

  const insightItems = useMemo(() => {
    const total = stats.totalReports ?? 0
    const active = stats.active ?? 0
    const draft = stats.draft ?? 0
    const charts = stats.totalCharts ?? 0
    const optimized = stats.aiOptimized ?? 0
    const items = []
    items.push({
      title: `Analytic studio: ${charts} visual nodes`,
      detail: `${total} blueprints (${active} production, ${draft} draft). ${optimized} enriched with AI narration.`,
      tone: 'info'
    })
    items.push({
      title: 'Coverage pressure',
      detail: `${stats.totalDataSources ?? 0} federated sources powering these canvases — audit stale joins quarterly.`,
      tone: 'success'
    })
    items.push({
      title: 'Recommendation',
      detail: draft > 0 ? `${draft} drafts idle — promote or archive to reduce noise.` : 'Maintain refresh SLAs on active packs.',
      tone: draft > 0 ? 'warning' : 'info'
    })
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="custom-report-builder-page"
        breadcrumbs={[
          { label: 'Reporting & Analytics', onClick: () => navigate('/reporting-analytics') },
          { label: 'Custom Report Builder', active: true }
        ]}
        onBack={() => navigate('/reporting-analytics')}
        backLabel="Back to modules"
        title="Custom analytics command center"
        description="Compose governed dashboards and deep-dive packs with AI-guided chart selection."
        heroMeta="Reporting & Analytics · Builder"
        outlookTitle="Workbench outlook"
        outlookDescription={`${stats.totalReports ?? 0} artifacts · ${stats.active ?? 0} active · ${stats.draft ?? 0} draft · ${stats.totalCharts ?? 0} charts · ${stats.aiOptimized ?? 0} AI-enhanced.`}
        outlookChips={[
          `${stats.totalReports ?? 0} reports`,
          `${stats.totalCharts ?? 0} charts`,
          `${stats.totalDataSources ?? 0} data sources`,
          `${stats.aiOptimized ?? 0} AI optimized`
        ]}
        insights={insightItems}
        kpiTitle="Builder signal board"
        kpiMeta="Depth, reuse, AI assist"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total reports"
                value={stats.totalReports ?? 0}
                hint="Workspace assets"
                tone="intel"
                trend="Inventory"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Charts"
                value={stats.totalCharts ?? 0}
                hint="Visual primitives"
                tone="primary"
                trend="Density"
                icon={<BarChart size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Data sources"
                value={stats.totalDataSources ?? 0}
                hint="Model joins"
                tone="intel"
                trend="Lineage"
                icon={<Settings size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI optimized"
                value={stats.aiOptimized ?? 0}
                hint="Narrative + layout assist"
                tone="success"
                trend="Assist"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Report catalog"
        tableActions={
          <div className="d-flex flex-wrap gap-2 justify-content-end">
            <Button variant="primary" size="sm">
              <Plus size={16} className="me-2" />
              New report
            </Button>
            <Button variant="outline-secondary" size="sm">
              <Download size={16} className="me-2" />
              Export all
            </Button>
          </div>
        }
      >
        <Row className="mb-3">
          <Col md={12} lg={6}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search reports..."
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
                        <th>Report Details</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Charts</th>
                        <th>Data Sources</th>
                        <th>AI Optimized</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.filter(report => 
                        !searchTerm || 
                        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        report.type.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((report) => (
                        <tr key={report.id}>
                          <td>
                            <div className="report-info">
                              <h6 className="mb-1">{report.name}</h6>
                              <p className="text-muted mb-1">{report.description}</p>
                              <small className="text-muted">
                                Created by {report.createdBy} • {report.createdDate} • Last run: {report.lastRun || 'Never'}
                              </small>
                            </div>
                          </td>
                          <td>{getCategoryBadge(report.category)}</td>
                          <td>
                            <div className="report-type">
                              <div className="d-flex align-items-center">
                                {getTypeIcon(report.type)}
                                <span className="ms-1">{report.type}</span>
                              </div>
                            </div>
                          </td>
                          <td>{getStatusBadge(report.status)}</td>
                          <td>
                            <div className="chart-count">
                              <BarChart size={16} className="me-1" />
                              {report.charts}
                            </div>
                          </td>
                          <td>
                            <div className="data-sources">
                              <Settings size={16} className="me-1" />
                              {report.dataSources}
                            </div>
                          </td>
                          <td>
                            <div className="ai-status">
                              {report.aiOptimized ? (
                                <div className="d-flex align-items-center">
                                  <Brain size={16} className="me-1 text-success" />
                                  <span className="text-success">Yes</span>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center">
                                  <Brain size={16} className="me-1 text-muted" />
                                  <span className="text-muted">No</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-1"
                                onClick={() => handleViewReport(report)}
                              >
                                <Eye size={14} />
                              </Button>
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="me-1"
                              >
                                <Edit size={14} />
                              </Button>
                              <Button 
                                variant="outline-info" 
                                size="sm" 
                                className="me-1"
                              >
                                <Download size={14} />
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
                      ))}
                    </tbody>
                  </Table>
        </div>
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <FileText size={20} className="me-2" />
              Report Details - {selectedReport?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReport && (
              <div className="report-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Category:</strong> {selectedReport.category}</p>
                    <p><strong>Type:</strong> {selectedReport.type}</p>
                    <p><strong>Status:</strong> {selectedReport.status}</p>
                    <p><strong>Created By:</strong> {selectedReport.createdBy}</p>
                    <p><strong>Created Date:</strong> {selectedReport.createdDate}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Report Configuration</h6>
                    <p><strong>Charts:</strong> {selectedReport.charts}</p>
                    <p><strong>Data Sources:</strong> {selectedReport.dataSources}</p>
                    <p><strong>Last Run:</strong> {selectedReport.lastRun || 'Never'}</p>
                    <p><strong>Next Run:</strong> {selectedReport.nextRun || 'Not scheduled'}</p>
                    <p><strong>AI Optimized:</strong> {selectedReport.aiOptimized ? 'Yes' : 'No'}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedReport.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Insights</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Insights:</strong> {selectedReport.aiInsights}
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
              Edit Report
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default CustomReportBuilder
