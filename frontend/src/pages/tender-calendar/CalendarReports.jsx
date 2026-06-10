import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Trash2, Eye, BarChart, Download, TrendingUp, Calendar, Brain, FileText, CheckCircle, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './CalendarReports.scss'

const CalendarReports = () => {
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
        title: 'Monthly Calendar Activity Report',
        description: 'Comprehensive report on calendar activities and team productivity',
        type: 'Activity',
        period: 'Monthly',
        lastGenerated: '2024-01-31',
        nextScheduled: '2024-02-29',
        status: 'Active',
        format: 'PDF',
        aiInsights: 'Team productivity increased by 15% compared to previous month',
        aiConfidence: 92,
        metrics: [
          'Total events: 45',
          'Team participation: 89%',
          'Average meeting duration: 1.2 hours',
          'Deadline compliance: 94%'
        ],
        recipients: ['Management Team', 'HR Department'],
        frequency: 'Monthly'
      },
      {
        id: 2,
        title: 'Deadline Performance Analysis',
        description: 'Analysis of deadline adherence and project timeline performance',
        type: 'Performance',
        period: 'Weekly',
        lastGenerated: '2024-02-05',
        nextScheduled: '2024-02-12',
        status: 'Active',
        format: 'Excel',
        aiInsights: 'Deadline compliance improved by 8% with AI-optimized scheduling',
        aiConfidence: 88,
        metrics: [
          'On-time completion: 87%',
          'Average delay: 1.2 days',
          'Critical deadlines met: 95%',
          'Team efficiency score: 91%'
        ],
        recipients: ['Project Managers', 'Operations Team'],
        frequency: 'Weekly'
      },
      {
        id: 3,
        title: 'Team Collaboration Report',
        description: 'Report on team collaboration patterns and meeting effectiveness',
        type: 'Collaboration',
        period: 'Quarterly',
        lastGenerated: '2024-01-15',
        nextScheduled: '2024-04-15',
        status: 'Draft',
        format: 'PDF',
        aiInsights: 'Collaboration efficiency increased by 22% with optimized meeting schedules',
        aiConfidence: 85,
        metrics: [
          'Cross-team meetings: 23',
          'Collaboration score: 88%',
          'Meeting effectiveness: 92%',
          'Knowledge sharing: 85%'
        ],
        recipients: ['All Teams', 'Leadership'],
        frequency: 'Quarterly'
      }
    ])

    setStats({
      totalReports: 3,
      active: 2,
      draft: 1,
      aiConfidence: 88,
      totalRecipients: 8,
      avgGenerationTime: '2.3 minutes',
      lastGenerated: '2024-02-05'
    })
  }, [])

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setShowModal(true)
  }

  const handleGenerateReport = (report) => {
    if (window.confirm(`Are you sure you want to generate "${report.title}"?`)) {
      setReports(prev => prev.map(r => 
        r.id === report.id ? { ...r, status: 'Generating', lastGenerated: new Date().toISOString().split('T')[0] } : r
      ))
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Draft': 'warning',
      'Generating': 'primary',
      'Paused': 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Activity': BarChart,
      'Performance': TrendingUp,
      'Collaboration': Calendar,
      'Summary': FileText
    }
    return icons[type] || BarChart
  }

  const getFormatBadge = (format) => {
    const variants = {
      'PDF': 'danger',
      'Excel': 'success',
      'CSV': 'info',
      'HTML': 'primary'
    }
    return <Badge bg={variants[format] || 'secondary'}>{format}</Badge>
  }

  const insightItems = useMemo(() => {
    const total = stats.totalReports ?? 0
    const active = stats.active ?? 0
    const draft = stats.draft ?? 0
    const conf = stats.aiConfidence ?? 0
    const items = []
    items.push({
      title: `Reporting factory: ${total} definitions`,
      detail: `${active} active, ${draft} in draft. Avg generation ${stats.avgGenerationTime || '—'} with ${stats.totalRecipients ?? 0} recipient seats.`,
      tone: 'info'
    })
    items.push({
      title: 'AI narrative quality',
      detail: `${conf}% confidence on insight extraction from calendar telemetry.`,
      tone: 'success'
    })
    items.push({
      title: 'Distribution hygiene',
      detail: `Last major run ${stats.lastGenerated || '—'} — verify SMTP throttles before month-end.`,
      tone: 'info'
    })
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="calendar-reports-page"
        breadcrumbs={[
          { label: 'Tender Calendar', onClick: () => navigate('/tender-calendar') },
          { label: 'Calendar Reports', active: true }
        ]}
        onBack={() => navigate('/tender-calendar')}
        backLabel="Back to modules"
        title="Calendar reporting command center"
        description="Schedule and govern calendar analytics packs with AI-assisted commentary."
        heroMeta="Tender Calendar · Reporting"
        outlookTitle="Report suite outlook"
        outlookDescription={`${stats.totalReports ?? 0} definitions · ${stats.active ?? 0} active · ${stats.draft ?? 0} draft · ${stats.aiConfidence ?? 0}% AI confidence.`}
        outlookChips={[
          `${stats.totalReports ?? 0} total`,
          `${stats.active ?? 0} active`,
          `${stats.draft ?? 0} draft`,
          `${stats.totalRecipients ?? 0} recipients`
        ]}
        insights={insightItems}
        kpiTitle="Reporting signal board"
        kpiMeta="Coverage, distribution, modeling"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total reports"
                value={stats.totalReports ?? 0}
                hint="Catalogued packs"
                tone="intel"
                trend="Portfolio"
                icon={<BarChart size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active"
                value={stats.active ?? 0}
                hint="Publishing on schedule"
                tone="success"
                trend="Live"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Recipients"
                value={stats.totalRecipients ?? 0}
                hint="Downstream audiences"
                tone="primary"
                trend="Reach"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Insight quality"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Calendar report catalog"
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
                        <th>Type</th>
                        <th>Period</th>
                        <th>Format</th>
                        <th>Last Generated</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.filter(report => 
                        !searchTerm || 
                        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        report.description.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((report) => {
                        const TypeIcon = getTypeIcon(report.type)
                        return (
                          <tr key={report.id}>
                            <td>
                              <div className="report-info">
                                <h6 className="mb-1">{report.title}</h6>
                                <p className="text-muted mb-1">{report.description}</p>
                                <small className="text-muted">
                                  {report.frequency} • Next: {report.nextScheduled} • {report.recipients.length} recipients
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="type-info">
                                <div className="d-flex align-items-center">
                                  <TypeIcon size={16} className="me-1" />
                                  <span>{report.type}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="period-info">
                                <Badge bg="info">{report.period}</Badge>
                              </div>
                            </td>
                            <td>{getFormatBadge(report.format)}</td>
                            <td>
                              <div className="generated-info">
                                <div className="fw-medium">{report.lastGenerated}</div>
                              </div>
                            </td>
                            <td>{getStatusBadge(report.status)}</td>
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
                                  onClick={() => handleGenerateReport(report)}
                                >
                                  <BarChart size={14} />
                                </Button>
                                <Button 
                                  variant="outline-warning" 
                                  size="sm"
                                >
                                  <Edit size={14} />
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
              <BarChart size={20} className="me-2" />
              Report Details - {selectedReport?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReport && (
              <div className="report-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedReport.type}</p>
                    <p><strong>Period:</strong> {selectedReport.period}</p>
                    <p><strong>Format:</strong> {selectedReport.format}</p>
                    <p><strong>Status:</strong> {selectedReport.status}</p>
                    <p><strong>Frequency:</strong> {selectedReport.frequency}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Schedule Details</h6>
                    <p><strong>Last Generated:</strong> {selectedReport.lastGenerated}</p>
                    <p><strong>Next Scheduled:</strong> {selectedReport.nextScheduled}</p>
                    <p><strong>Recipients:</strong> {selectedReport.recipients.length}</p>
                    <p><strong>AI Confidence:</strong> {selectedReport.aiConfidence}%</p>
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
                  <Col md={6}>
                    <h6>Key Metrics</h6>
                    <ul className="metrics-list">
                      {selectedReport.metrics.map((metric, index) => (
                        <li key={index} className="metric-item">
                          <TrendingUp size={14} className="me-2 text-success" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>Recipients</h6>
                    <ul className="recipients-list">
                      {selectedReport.recipients.map((recipient, index) => (
                        <li key={index} className="recipient-item">
                          <Users size={14} className="me-2 text-primary" />
                          {recipient}
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Insights & Analysis</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Key Insights:</strong> {selectedReport.aiInsights}
                    </Alert>
                    <Alert variant="success">
                      <BarChart size={16} className="me-2" />
                      <strong>Confidence Level:</strong> {selectedReport.aiConfidence}% based on historical data analysis and trend identification
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
              <Download size={16} className="me-2" />
              Download Report
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default CalendarReports
