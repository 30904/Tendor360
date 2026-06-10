import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Trash2, Eye, Database, Brain, CheckCircle, AlertTriangle, Settings, Link, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './BIConnectors.scss'

const BIConnectors = () => {
  const navigate = useNavigate()
  const [connectors, setConnectors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedConnector, setSelectedConnector] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setConnectors([
      {
        id: 1,
        name: 'Power BI Connector',
        description: 'Connect to Microsoft Power BI for advanced analytics and visualization',
        type: 'Power BI',
        status: 'Connected',
        lastSync: '2024-01-21 10:30:00',
        nextSync: '2024-01-21 11:30:00',
        dataSources: 12,
        dashboards: 8,
        aiOptimized: true,
        aiInsights: 'Connection stable with 99.8% uptime. Consider adding real-time data feeds.',
        syncFrequency: 'Hourly',
        createdBy: 'John Doe',
        createdDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Tableau Connector',
        description: 'Integration with Tableau for interactive dashboards and reports',
        type: 'Tableau',
        status: 'Connected',
        lastSync: '2024-01-21 09:45:00',
        nextSync: '2024-01-21 10:45:00',
        dataSources: 8,
        dashboards: 5,
        aiOptimized: true,
        aiInsights: 'Performance optimized. Data refresh time reduced by 25%.',
        syncFrequency: 'Hourly',
        createdBy: 'Jane Smith',
        createdDate: '2024-01-10'
      },
      {
        id: 3,
        name: 'Qlik Sense Connector',
        description: 'Connect to Qlik Sense for self-service analytics and data discovery',
        type: 'Qlik Sense',
        status: 'Disconnected',
        lastSync: '2024-01-20 15:20:00',
        nextSync: null,
        dataSources: 6,
        dashboards: 3,
        aiOptimized: false,
        aiInsights: 'Connection lost. Check network connectivity and credentials.',
        syncFrequency: 'Daily',
        createdBy: 'Mike Johnson',
        createdDate: '2024-01-05'
      }
    ])

    setStats({
      totalConnectors: 3,
      connected: 2,
      disconnected: 1,
      totalDataSources: 26,
      totalDashboards: 16,
      aiOptimized: 2
    })
  }, [])

  const handleViewConnector = (connector) => {
    setSelectedConnector(connector)
    setShowModal(true)
  }

  const handleConnect = (connector) => {
    if (window.confirm(`Are you sure you want to connect "${connector.name}"?`)) {
      setConnectors(prev => prev.map(c => 
        c.id === connector.id ? { ...c, status: 'Connected' } : c
      ))
    }
  }

  const handleDisconnect = (connector) => {
    if (window.confirm(`Are you sure you want to disconnect "${connector.name}"?`)) {
      setConnectors(prev => prev.map(c => 
        c.id === connector.id ? { ...c, status: 'Disconnected' } : c
      ))
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Connected': 'success',
      'Disconnected': 'danger',
      'Connecting': 'warning',
      'Error': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Power BI': return <Database size={16} />
      case 'Tableau': return <Zap size={16} />
      case 'Qlik Sense': return <Link size={16} />
      default: return <Database size={16} />
    }
  }

  const insightItems = useMemo(() => {
    const total = stats.totalConnectors ?? 0
    const connected = stats.connected ?? 0
    const disco = stats.disconnected ?? 0
    const optimized = stats.aiOptimized ?? 0
    const sources = stats.totalDataSources ?? 0
    const items = []
    items.push({
      title: `Connector fabric: ${connected}/${total} green`,
      detail: disco > 0 ? `${disco} connector(s) disconnected — validate credentials and VPN paths.` : `All feeds stable across ${sources} mapped sources.`,
      tone: disco > 0 ? 'warning' : 'success'
    })
    items.push({
      title: 'AI orchestration',
      detail: `${optimized} connector(s) tuned for autonomous refresh windows.`,
      tone: 'info'
    })
    items.push({
      title: 'Throughput',
      detail: `${stats.totalDashboards ?? 0} dashboards rely on these pipes — monitor queue depth during ETL peaks.`,
      tone: 'info'
    })
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="bi-connectors-page"
        breadcrumbs={[
          { label: 'Reporting & Analytics', onClick: () => navigate('/reporting-analytics') },
          { label: 'BI Connectors', active: true }
        ]}
        onBack={() => navigate('/reporting-analytics')}
        backLabel="Back to modules"
        title="BI integration command center"
        description="Operate Power BI, Tableau, and Qlik pipelines with health telemetry and AI-assisted tuning."
        heroMeta="Reporting & Analytics · Connectivity"
        outlookTitle="Warehouse & BI mesh"
        outlookDescription={`${stats.totalConnectors ?? 0} connectors · ${stats.connected ?? 0} connected · ${stats.disconnected ?? 0} offline · ${stats.totalDataSources ?? 0} sources · ${stats.aiOptimized ?? 0} AI-optimized.`}
        outlookChips={[
          `${stats.totalConnectors ?? 0} total`,
          `${stats.connected ?? 0} connected`,
          `${stats.totalDataSources ?? 0} sources`,
          `${stats.totalDashboards ?? 0} dashboards`
        ]}
        insights={insightItems}
        kpiTitle="Integration signal board"
        kpiMeta="Uptime, lineage breadth, AI tuning"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Connectors"
                value={stats.totalConnectors ?? 0}
                hint="Licensed endpoints"
                tone="intel"
                trend="Footprint"
                icon={<Database size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Connected"
                value={stats.connected ?? 0}
                hint="Healthy feeds"
                tone="success"
                trend="Green"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Data sources"
                value={stats.totalDataSources ?? 0}
                hint="Registered assets"
                tone="primary"
                trend="Coverage"
                icon={<Settings size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI optimized"
                value={stats.aiOptimized ?? 0}
                hint="Autonomic refresh"
                tone="intel"
                trend="Models"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Connector registry"
        tableActions={
          <div className="d-flex flex-wrap gap-2 justify-content-end">
            <Button variant="primary" size="sm">
              <Plus size={16} className="me-2" />
              New connector
            </Button>
            <Button variant="outline-secondary" size="sm">
              <Settings size={16} className="me-2" />
              Settings
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
                placeholder="Search connectors..."
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
                        <th>Connector Details</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Data Sources</th>
                        <th>Dashboards</th>
                        <th>Last Sync</th>
                        <th>AI Optimized</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {connectors.filter(connector => 
                        !searchTerm || 
                        connector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        connector.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        connector.status.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((connector) => (
                        <tr key={connector.id}>
                          <td>
                            <div className="connector-info">
                              <h6 className="mb-1">{connector.name}</h6>
                              <p className="text-muted mb-1">{connector.description}</p>
                              <small className="text-muted">
                                Created by {connector.createdBy} • {connector.createdDate} • Sync: {connector.syncFrequency}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="connector-type">
                              <div className="d-flex align-items-center">
                                {getTypeIcon(connector.type)}
                                <span className="ms-1">{connector.type}</span>
                              </div>
                            </div>
                          </td>
                          <td>{getStatusBadge(connector.status)}</td>
                          <td>
                            <div className="data-sources">
                              <Database size={16} className="me-1" />
                              {connector.dataSources}
                            </div>
                          </td>
                          <td>
                            <div className="dashboards">
                              <Settings size={16} className="me-1" />
                              {connector.dashboards}
                            </div>
                          </td>
                          <td>
                            <div className="sync-info">
                              <small className="text-muted">
                                {connector.lastSync}
                              </small>
                              {connector.nextSync && (
                                <div>
                                  <small className="text-primary">
                                    Next: {connector.nextSync}
                                  </small>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="ai-status">
                              {connector.aiOptimized ? (
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
                                onClick={() => handleViewConnector(connector)}
                              >
                                <Eye size={14} />
                              </Button>
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="me-1"
                                onClick={() => handleConnect(connector)}
                                disabled={connector.status === 'Connected'}
                              >
                                <CheckCircle size={14} />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDisconnect(connector)}
                                disabled={connector.status === 'Disconnected'}
                              >
                                <AlertTriangle size={14} />
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
              <Database size={20} className="me-2" />
              Connector Details - {selectedConnector?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedConnector && (
              <div className="connector-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedConnector.type}</p>
                    <p><strong>Status:</strong> {selectedConnector.status}</p>
                    <p><strong>Created By:</strong> {selectedConnector.createdBy}</p>
                    <p><strong>Created Date:</strong> {selectedConnector.createdDate}</p>
                    <p><strong>Sync Frequency:</strong> {selectedConnector.syncFrequency}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Connection Details</h6>
                    <p><strong>Data Sources:</strong> {selectedConnector.dataSources}</p>
                    <p><strong>Dashboards:</strong> {selectedConnector.dashboards}</p>
                    <p><strong>Last Sync:</strong> {selectedConnector.lastSync}</p>
                    <p><strong>Next Sync:</strong> {selectedConnector.nextSync || 'Not scheduled'}</p>
                    <p><strong>AI Optimized:</strong> {selectedConnector.aiOptimized ? 'Yes' : 'No'}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedConnector.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>AI Insights</h6>
                    <Alert variant="info">
                      <Brain size={16} className="me-2" />
                      <strong>Insights:</strong> {selectedConnector.aiInsights}
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
              <Settings size={16} className="me-2" />
              Configure
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default BIConnectors
