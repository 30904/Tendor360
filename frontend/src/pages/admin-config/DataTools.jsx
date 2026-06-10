import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Alert } from 'react-bootstrap'
import { Plus, Edit, Database, Download, Upload, Brain, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './DataTools.scss'

const DataTools = () => {
  const navigate = useNavigate()
  const [dataTools, setDataTools] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setDataTools([
      {
        id: 1,
        name: 'Data Export Tool',
        description: 'Export system data to various formats',
        type: 'Export',
        status: 'Active',
        lastUsed: '2024-02-10 14:30',
        frequency: 'Daily',
        aiOptimization: 'Automated export scheduling for efficiency',
        aiConfidence: 91,
        priority: 'High',
        formats: ['CSV', 'Excel', 'JSON', 'XML'],
        size: '2.5 GB',
        records: 125000
      },
      {
        id: 2,
        name: 'Data Import Tool',
        description: 'Import data from external sources',
        type: 'Import',
        status: 'Active',
        lastUsed: '2024-02-09 09:15',
        frequency: 'Weekly',
        aiOptimization: 'Data validation and error detection',
        aiConfidence: 88,
        priority: 'Medium',
        formats: ['CSV', 'Excel', 'JSON'],
        size: '1.2 GB',
        records: 45000
      },
      {
        id: 3,
        name: 'Data Backup Tool',
        description: 'Automated system backup and recovery',
        type: 'Backup',
        status: 'Active',
        lastUsed: '2024-02-10 02:00',
        frequency: 'Daily',
        aiOptimization: 'Intelligent backup scheduling and compression',
        aiConfidence: 95,
        priority: 'Critical',
        formats: ['SQL', 'Archive'],
        size: '15.8 GB',
        records: 500000
      },
      {
        id: 4,
        name: 'Data Validation Tool',
        description: 'Validate and clean imported data',
        type: 'Validation',
        status: 'Active',
        lastUsed: '2024-02-08 16:45',
        frequency: 'On Demand',
        aiOptimization: 'AI-powered data quality assessment',
        aiConfidence: 92,
        priority: 'High',
        formats: ['CSV', 'Excel', 'JSON'],
        size: '800 MB',
        records: 75000
      },
      {
        id: 5,
        name: 'Data Migration Tool',
        description: 'Migrate data between systems',
        type: 'Migration',
        status: 'Inactive',
        lastUsed: '2024-01-28 10:20',
        frequency: 'Monthly',
        aiOptimization: 'Intelligent mapping and transformation',
        aiConfidence: 89,
        priority: 'Medium',
        formats: ['SQL', 'CSV', 'JSON'],
        size: '3.2 GB',
        records: 200000
      },
      {
        id: 6,
        name: 'Data Archival Tool',
        description: 'Archive old data for compliance',
        type: 'Archival',
        status: 'Active',
        lastUsed: '2024-02-09 23:30',
        frequency: 'Weekly',
        aiOptimization: 'Smart archival based on access patterns',
        aiConfidence: 94,
        priority: 'Medium',
        formats: ['Archive', 'Compressed'],
        size: '8.5 GB',
        records: 300000
      }
    ])

    setStats({
      totalTools: 6,
      active: 5,
      types: 6,
      aiConfidence: 92,
      totalSize: '32.0 GB',
      totalRecords: 1245000,
      lastBackup: '2024-02-10 02:00'
    })
  }, [])

  const handleViewTool = (tool) => {
    setSelectedTool(tool)
    setShowModal(true)
  }

  const handleRunTool = (tool) => {
    if (window.confirm(`Are you sure you want to run "${tool.name}"?`)) {
      // Implementation for running tool
      console.log(`Running tool: ${tool.name}`)
    }
  }

  const handleEditTool = (tool) => {
    console.log('Edit tool:', tool)
    // Navigate to edit tool or open edit modal
  }

  const handleDeleteTool = (tool) => {
    if (window.confirm(`Are you sure you want to delete "${tool.name}"?`)) {
      setDataTools(prev => prev.filter(t => t.id !== tool.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Tool Details',
      width: '30%',
      render: (value, row) => (
        <div className="tool-info">
          <h6 className="mb-1">{value}</h6>
          <p className="text-muted mb-1">{row.description}</p>
          <small className="text-muted">
            Frequency: {row.frequency} • Records: {row.records.toLocaleString()}
          </small>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      width: '15%',
      render: (value) => {
        const TypeIcon = getTypeIcon(value)
        return (
          <div className="type-info">
            <div className="d-flex align-items-center">
              <TypeIcon size={16} className="me-1" />
              <span>{value}</span>
            </div>
          </div>
        )
      }
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'lastUsed',
      label: 'Last Used',
      width: '15%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    {
      key: 'size',
      label: 'Size',
      width: '10%'
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '12%',
      render: (value) => getPriorityBadge(value)
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Running': 'primary',
      'Error': 'danger'
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

  const getTypeIcon = (type) => {
    const icons = {
      'Export': Download,
      'Import': Upload,
      'Backup': Database
    }
    return icons[type] || Database
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalTools ?? 0) > 0) {
      items.push({
        title: `${stats.totalTools} data tools · ${stats.active} active`,
        detail: `${stats.totalSize} footprint · ${(stats.totalRecords ?? 0).toLocaleString()} records · last backup ${stats.lastBackup}.`,
        tone: 'info'
      })
    }
    if ((stats.active ?? 0) < (stats.totalTools ?? 0)) {
      items.push({
        title: 'Inactive tools on file',
        detail: 'Re-validate schedules or retire unused jobs to reduce operational drift.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Data operations',
        detail: 'Register tools to unlock pipeline intelligence.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
        className="data-tools-page"
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'Data Tools', active: true }
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to modules"
        title="Data operations command center"
        description="Manage data import, export, and backup tools with AI-powered optimization."
        heroMeta="Imports, exports, resilience"
        outlookTitle="Pipeline outlook"
        outlookDescription={`${stats.totalTools ?? 0} tools · ${stats.active ?? 0} active · ${stats.totalSize ?? '—'} staged.`}
        outlookChips={[
          `${stats.totalTools ?? 0} tools`,
          `${stats.active ?? 0} active`,
          `${stats.totalSize ?? '—'}`,
          `${stats.aiConfidence ?? 0}% AI`
        ]}
        insights={insightItems}
        kpiTitle="Throughput signal board"
        kpiMeta="Volume, storage, and confidence"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total tools"
                value={stats.totalTools ?? 0}
                hint="Registered utilities"
                tone="intel"
                trend="Catalog"
                icon={<Database size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total size"
                value={0}
                hint="Aggregate footprint"
                tone="intel"
                trend="Storage"
                displayValue={stats.totalSize ?? '—'}
                icon={<Download size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total records"
                value={stats.totalRecords ?? 0}
                hint="Rows under management"
                tone="intel"
                trend="Scale"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence ?? 0}
                hint="Optimization signals"
                tone="intel"
                trend="Models"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Data tools management"
        tableActions={
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              New Tool
            </Button>
            <Button variant="outline-secondary">
              <Database size={16} className="me-2" />
              System Status
            </Button>
          </>
        }
      >
        <DataTable
          data={dataTools}
          columns={columns}
          title="Data Tools Management"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewTool}
          onEdit={handleEditTool}
          onDelete={handleDeleteTool}
          customActions={[
            {
              type: 'custom',
              label: 'Run Tool',
              onClick: (row) => handleRunTool(row)
            }
          ]}
          searchPlaceholder="Search data tools..."
          emptyMessage="No data tools found"
          loading={false}
        />
      </ExecutiveCommandCenter>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Database size={20} className="me-2" />
              Tool Details - {selectedTool?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTool && (
              <div className="tool-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedTool.type}</p>
                    <p><strong>Status:</strong> {selectedTool.status}</p>
                    <p><strong>Priority:</strong> {selectedTool.priority}</p>
                    <p><strong>Frequency:</strong> {selectedTool.frequency}</p>
                    <p><strong>Last Used:</strong> {selectedTool.lastUsed}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Data Information</h6>
                    <p><strong>Size:</strong> {selectedTool.size}</p>
                    <p><strong>Records:</strong> {selectedTool.records.toLocaleString()}</p>
                    <p><strong>AI Confidence:</strong> {selectedTool.aiConfidence}%</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedTool.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Supported Formats</h6>
                    <div className="formats-list">
                      {selectedTool.formats.map((format, index) => (
                        <Badge key={index} bg="info" className="me-1 mb-1">
                          {format}
                        </Badge>
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
                      <strong>Optimization:</strong> {selectedTool.aiOptimization}
                    </Alert>
                    <Alert variant="success">
                      <CheckCircle size={16} className="me-2" />
                      <strong>Confidence Level:</strong> {selectedTool.aiConfidence}% based on data processing efficiency and error analysis
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
              Edit Tool
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default DataTools
