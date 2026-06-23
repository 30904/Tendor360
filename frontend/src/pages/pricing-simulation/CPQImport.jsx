import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Upload, Brain, CheckCircle, FileText, Database, Settings, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { toast } from 'react-toastify'
import './CPQImport.scss'
import { dummyCpqImportPrefill } from '../../utils/testFormDummies'

const CPQImport = () => {
  const navigate = useNavigate()
  const [imports, setImports] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingImport, setEditingImport] = useState(null)
  const [prefillSnapshot, setPrefillSnapshot] = useState(null)
  const [modalFormKey, setModalFormKey] = useState(0)
  const [stats, setStats] = useState({})
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedImport, setSelectedImport] = useState(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  useEffect(() => {
    setImports([
      {
        id: 1,
        name: 'SAP CPQ Import - Q1 2024',
        description: 'Quarterly pricing data import from SAP CPQ system',
        source: 'SAP CPQ',
        status: 'Completed',
        progress: 100,
        records: 1250,
        imported: 1250,
        failed: 0,
        lastRun: '2024-01-20',
        nextRun: '2024-04-20',
        createdBy: 'John Doe',
        createdDate: '2024-01-15',
        aiOptimized: true,
        accuracy: 98
      },
      {
        id: 2,
        name: 'Oracle CPQ Import - Product Catalog',
        description: 'Product catalog and pricing import from Oracle CPQ',
        source: 'Oracle CPQ',
        status: 'In Progress',
        progress: 75,
        records: 850,
        imported: 638,
        failed: 12,
        lastRun: '2024-01-19',
        nextRun: '2024-01-26',
        createdBy: 'Jane Smith',
        createdDate: '2024-01-10',
        aiOptimized: true,
        accuracy: 95
      },
      {
        id: 3,
        name: 'Salesforce CPQ Import - Custom Pricing',
        description: 'Custom pricing rules and discount matrices',
        source: 'Salesforce CPQ',
        status: 'Scheduled',
        progress: 0,
        records: 450,
        imported: 0,
        failed: 0,
        lastRun: null,
        nextRun: '2024-01-25',
        createdBy: 'Mike Johnson',
        createdDate: '2024-01-18',
        aiOptimized: false,
        accuracy: 0
      },
      {
        id: 4,
        name: 'Microsoft Dynamics CPQ Import - Enterprise',
        description: 'Enterprise pricing and configuration data',
        source: 'Microsoft Dynamics',
        status: 'Completed',
        progress: 100,
        records: 2100,
        imported: 2100,
        failed: 0,
        lastRun: '2024-01-22',
        nextRun: '2024-04-22',
        createdBy: 'Sarah Wilson',
        createdDate: '2024-01-12',
        aiOptimized: true,
        accuracy: 99
      },
      {
        id: 5,
        name: 'HubSpot CPQ Import - SMB Pricing',
        description: 'Small business pricing models and packages',
        source: 'HubSpot CPQ',
        status: 'In Progress',
        progress: 60,
        records: 750,
        imported: 450,
        failed: 5,
        lastRun: '2024-01-21',
        nextRun: '2024-01-28',
        createdBy: 'David Brown',
        createdDate: '2024-01-14',
        aiOptimized: true,
        accuracy: 92
      },
      {
        id: 6,
        name: 'Pipedrive CPQ Import - Sales Pipeline',
        description: 'Sales pipeline pricing and deal configurations',
        source: 'Pipedrive CPQ',
        status: 'Failed',
        progress: 30,
        records: 320,
        imported: 96,
        failed: 224,
        lastRun: '2024-01-20',
        nextRun: '2024-01-27',
        createdBy: 'Lisa Davis',
        createdDate: '2024-01-16',
        aiOptimized: false,
        accuracy: 30
      }
    ])

    setStats({
      totalImports: 6,
      completed: 2,
      inProgress: 2,
      scheduled: 1,
      failed: 1,
      totalRecords: 5720,
      totalImported: 4334,
      avgAccuracy: 69
    })
  }, [])

  const handleEditImport = (importItem) => {
    setPrefillSnapshot(null)
    setEditingImport(importItem)
    setModalFormKey((k) => k + 1)
    setShowModal(true)
  }

  const handleDeleteImport = (importItem) => {
    if (window.confirm(`Are you sure you want to delete import "${importItem.name}"?`)) {
      setImports(prev => prev.filter(i => i.id !== importItem.id))
      toast.success(`Successfully deleted import job "${importItem.name}"!`)
    }
  }

  const handleViewImport = (importItem) => {
    setSelectedImport(importItem)
    setShowViewModal(true)
  }

  const handleEditImportProfile = (importItem) => {
    handleEditImport(importItem)
  }

  const handleDeleteImportProfile = (importItem) => {
    handleDeleteImport(importItem)
  }

  const handleSaveImportForm = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const name = data.get('name')
    const source = data.get('source')
    const description = data.get('description')
    const connectionString = data.get('connectionString')
    const schedule = data.get('schedule')
    const aiOptimized = e.target.elements.aiOptimized.checked

    if (!name || !source) {
      toast.error('Please enter an Import Name and select a Source System.')
      return
    }

    const updatedData = {
      name,
      source,
      description,
      connectionString,
      schedule,
      aiOptimized,
      progress: editingImport ? editingImport.progress : 0,
      records: editingImport ? editingImport.records : 100,
      imported: editingImport ? editingImport.imported : 0,
      failed: editingImport ? editingImport.failed : 0,
      accuracy: editingImport ? editingImport.accuracy : 90,
      status: editingImport ? editingImport.status : 'Scheduled',
      lastRun: editingImport ? editingImport.lastRun : null,
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: editingImport ? editingImport.createdBy : 'John Doe'
    }

    if (editingImport) {
      setImports(prev => prev.map(i => i.id === editingImport.id ? { ...i, ...updatedData } : i))
      toast.success(`Successfully updated import configuration "${name}"!`)
    } else {
      const newId = imports.length ? Math.max(...imports.map(i => i.id)) + 1 : 1
      const newImport = {
        id: newId,
        ...updatedData
      }
      setImports(prev => [newImport, ...prev])
      toast.success(`Successfully created CPQ import job "${name}"!`)
    }

    closeCpqModal()
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Import Details',
      width: '25%',
      render: (value, row) => (
        <div className="import-info">
          <div className="fw-semibold d-flex align-items-center">
            <Database size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="import-meta">
            <small className="text-muted">Source: {row.source}</small>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => {
        const variants = {
          'Completed': 'success',
          'In Progress': 'primary',
          'Scheduled': 'warning',
          'Failed': 'danger'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'progress',
      label: 'Progress',
      width: '10%',
      render: (value) => (
        <div className="progress-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">complete</small>
        </div>
      )
    },
    {
      key: 'records',
      label: 'Records',
      width: '8%',
      render: (value, row) => (
        <div className="records-info">
          <div className="fw-bold text-info">{value}</div>
          <small className="text-muted">total</small>
        </div>
      )
    },
    {
      key: 'imported',
      label: 'Imported',
      width: '8%',
      render: (value, row) => (
        <div className="imported-info">
          <div className="fw-bold text-success">{value}</div>
          <small className="text-muted">success</small>
        </div>
      )
    },
    {
      key: 'failed',
      label: 'Failed',
      width: '8%',
      render: (value) => (
        <div className="failed-info">
          <div className={`fw-bold ${value > 0 ? 'text-danger' : 'text-muted'}`}>{value}</div>
          <small className="text-muted">failed</small>
        </div>
      )
    },
    {
      key: 'aiOptimized',
      label: 'AI Optimized',
      width: '8%',
      render: (value) => (
        <div className="ai-optimized">
          {value ? (
            <Badge bg="success" className="d-flex align-items-center">
              <Brain size={12} className="me-1" />
              Yes
            </Badge>
          ) : (
            <Badge bg="secondary">No</Badge>
          )}
        </div>
      )
    },
    {
      key: 'accuracy',
      label: 'Accuracy',
      width: '8%',
      render: (value) => (
        <div className="accuracy-info">
          <div className="fw-bold text-success">{value}%</div>
          <small className="text-muted">accuracy</small>
        </div>
      )
    },
    {
      key: 'lastRun',
      label: 'Last Run',
      width: '10%',
      render: (value) => {
        if (!value) return <span className="text-muted">Never</span>
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      key: 'createdBy',
      label: 'Created By',
      width: '5%',
      render: (value) => (
        <div className="created-by">
          <small className="text-muted">{value}</small>
        </div>
      )
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'Completed': 'success',
      'In Progress': 'primary',
      'Scheduled': 'warning',
      'Failed': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const insightItems = useMemo(() => [
    {
      title: 'Import accuracy',
      detail: `Your CPQ imports have an average accuracy of ${stats.avgAccuracy}%. Consider enabling AI optimization for scheduled imports to improve data quality and reduce manual validation.`,
      tone: 'info'
    }
  ], [stats.avgAccuracy])

  const formSeed = editingImport || prefillSnapshot || {}

  const closeCpqModal = () => {
    setShowModal(false)
    setEditingImport(null)
    setPrefillSnapshot(null)
    setModalFormKey((k) => k + 1)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="cpq-import-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'CPQ/Costing Import', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="CPQ/Costing Import"
        description="Import pricing data from CPQ systems with AI-powered data validation and mapping"
        heroMeta="CPQ intake"
        outlookTitle="Import outlook"
        outlookDescription={`${stats.totalImports || 0} jobs — ${stats.totalRecords || 0} records tracked, ${stats.totalImported || 0} rows imported.`}
        outlookChips={[
          `${stats.totalImports || 0} imports`,
          `${stats.totalRecords || 0} records`,
          `${stats.totalImported || 0} imported`,
          `${stats.avgAccuracy || 0}% avg accuracy`
        ]}
        insights={insightItems}
        kpiTitle="Import signal board"
        kpiMeta="Volume vs accuracy"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total imports"
                value={stats.totalImports || 0}
                hint="Configured jobs"
                tone="intel"
                trend="Pipeline"
                icon={<Database size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total records"
                value={stats.totalRecords || 0}
                hint="Across all sources"
                tone="success"
                trend="Volume"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Imported"
                value={stats.totalImported || 0}
                hint="Successfully loaded"
                tone="warning"
                trend="Throughput"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg accuracy"
                value={stats.avgAccuracy || 0}
                hint="AI validation quality"
                tone={(stats.avgAccuracy || 0) >= 80 ? 'success' : 'warning'}
                trend="Quality"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`CPQ import jobs (${imports.length})`}
        tableActions={(
          <>
            <Button
              variant="primary"
              className="me-2"
              onClick={() => {
                setEditingImport(null)
                setPrefillSnapshot(null)
                setModalFormKey((k) => k + 1)
                setShowModal(true)
              }}
            >
              <Plus size={16} className="me-2" />
              New Import
            </Button>
            <Button variant="outline-secondary" onClick={() => setShowSettingsModal(true)}>
              <Settings size={16} className="me-2" />
              Settings
            </Button>
          </>
        )}
      >
        <DataTable
          data={imports}
          columns={columns}
          title="CPQ Import Jobs"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewImport}
          onEdit={handleEditImportProfile}
          onDelete={handleDeleteImportProfile}
          customActions={[
            {
              type: 'custom',
              label: 'Run Import',
              onClick: (row) => {
                toast.info(`Initializing CPQ import pipeline for "${row.name}"...`);
                setImports(prev => prev.map(i => i.id === row.id ? { ...i, status: 'In Progress', progress: 10 } : i));
                
                setTimeout(() => {
                  toast.info(`Parsing records from "${row.source}"...`);
                  setImports(prev => prev.map(i => i.id === row.id ? { ...i, progress: 50 } : i));
                }, 1000);

                setTimeout(() => {
                  toast.success(`Successfully completed import "${row.name}"! ${row.records} records loaded.`);
                  setImports(prev => prev.map(i => i.id === row.id ? { ...i, status: 'Completed', progress: 100, lastRun: new Date().toISOString().split('T')[0] } : i));
                }, 2000);
              }
            }
          ]}
          searchPlaceholder="Search imports..."
          emptyMessage="No imports found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={closeCpqModal}
        size="lg"
        onTestFill={
          showModal
            ? () => {
                setPrefillSnapshot(dummyCpqImportPrefill())
                setModalFormKey((k) => k + 1)
              }
            : undefined
        }
      >
          <Modal.Header closeButton>
            <Modal.Title>
              <Upload size={20} className="me-2" />
              {editingImport ? 'Edit CPQ Import' : 'New CPQ Import'}
            </Modal.Title>
          </Modal.Header>
          <Form key={modalFormKey} onSubmit={handleSaveImportForm}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Import Name *</Form.Label>
                    <Form.Control
                      name="name"
                      type="text"
                      required
                      placeholder="Enter import name"
                      defaultValue={formSeed.name || ''}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Source System *</Form.Label>
                    <Form.Select name="source" required defaultValue={formSeed.source || ''}>
                      <option value="">Select source system</option>
                      <option value="SAP CPQ">SAP CPQ</option>
                      <option value="Oracle CPQ">Oracle CPQ</option>
                      <option value="Salesforce CPQ">Salesforce CPQ</option>
                      <option value="Microsoft CPQ">Microsoft CPQ</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  name="description"
                  as="textarea"
                  rows={3}
                  placeholder="Enter import description"
                  defaultValue={formSeed.description || ''}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Connection String</Form.Label>
                    <Form.Control
                      name="connectionString"
                      type="text"
                      placeholder="Enter connection string"
                      defaultValue={formSeed.connectionString || ''}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Schedule</Form.Label>
                    <Form.Select name="schedule" defaultValue={formSeed.schedule || ''}>
                      <option value="">Select schedule</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Check
                  name="aiOptimized"
                  type="checkbox"
                  label="Enable AI optimization for data validation and mapping"
                  defaultChecked={formSeed.aiOptimized || false}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeCpqModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingImport ? 'Update Import' : 'Create Import'}
              </Button>
            </Modal.Footer>
          </Form>
        </FormDrawerModal>

      {/* View Import Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Database size={20} className="me-2 text-primary" />
            CPQ Import Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImport && (
            <div className="p-2">
              <h5 className="mb-3 text-primary">{selectedImport.name}</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Source System:</strong> {selectedImport.source}
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> <Badge bg={selectedImport.status === 'Completed' ? 'success' : selectedImport.status === 'In Progress' ? 'primary' : 'warning'}>{selectedImport.status}</Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Last Run:</strong> {selectedImport.lastRun || 'Never'}
                </Col>
                <Col md={6}>
                  <strong>Next Scheduled Run:</strong> {selectedImport.nextRun || 'None'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Total Records:</strong> {selectedImport.records}
                </Col>
                <Col md={4}>
                  <strong>Imported Successfully:</strong> {selectedImport.imported}
                </Col>
                <Col md={4}>
                  <strong>Failed Records:</strong> <span className={selectedImport.failed > 0 ? 'text-danger fw-bold' : ''}>{selectedImport.failed}</span>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>AI Optimized:</strong> <Badge bg={selectedImport.aiOptimized ? 'success' : 'secondary'}>{selectedImport.aiOptimized ? 'Yes' : 'No'}</Badge>
                </Col>
                <Col md={6}>
                  <strong>Accuracy Level:</strong> {selectedImport.accuracy}%
                </Col>
              </Row>
              <hr />
              <div>
                <h6>Description</h6>
                <p className="mt-1">{selectedImport.description || 'No description provided.'}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          {selectedImport && (
            <Button variant="primary" onClick={() => { setShowViewModal(false); handleEditImport(selectedImport); }}>
              <Edit size={16} className="me-2" />
              Edit Import Profile
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Settings Modal */}
      <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Settings size={20} className="me-2 text-primary" />
            Import Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); setShowSettingsModal(false); toast.success("Import settings saved successfully!"); }}>
            <Form.Group className="mb-3">
              <Form.Label>Default Sync Frequency</Form.Label>
              <Form.Select defaultValue="weekly">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Auto-resolve mapping conflicts using AI" defaultChecked />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Send email notification on import failure" defaultChecked />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Save Settings</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CPQImport
