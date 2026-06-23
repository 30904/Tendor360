import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Folder, FolderOpen, FileText, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { toast } from 'react-toastify'
import './DataRooms.scss'
import { dummyDataRoomForm } from '../../utils/testFormDummies'

const DataRooms = () => {
  const navigate = useNavigate()
  const [dataRooms, setDataRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingDataRoom, setEditingDataRoom] = useState(null)
  const [selectedDataRoom, setSelectedDataRoom] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accessLevel: 'RESTRICTED',
    expiryDate: '',
    isActive: true
  })

  useEffect(() => {
    loadDataRooms()
  }, [])

  const loadDataRooms = () => {
    const mockDataRooms = [
      {
        id: 1,
        name: 'IT Infrastructure Project - Phase 1',
        description: 'Technical specifications and requirements for IT infrastructure upgrade',
        accessLevel: 'RESTRICTED',
        expiryDate: '2024-02-15',
        isActive: true,
        documentCount: 25,
        totalSize: '125.5 MB',
        lastAccessed: '2024-01-15T10:30:00Z',
        createdBy: 'Project Manager',
        accessCount: 12
      },
      {
        id: 2,
        name: 'Financial Bid Documents',
        description: 'Financial proposals and pricing information',
        accessLevel: 'CONFIDENTIAL',
        expiryDate: '2024-02-20',
        isActive: true,
        documentCount: 18,
        totalSize: '89.2 MB',
        lastAccessed: '2024-01-14T14:20:00Z',
        createdBy: 'Finance Team',
        accessCount: 8
      },
      {
        id: 3,
        name: 'Compliance Documentation',
        description: 'Regulatory compliance and certification documents',
        accessLevel: 'PUBLIC',
        expiryDate: '2024-03-01',
        isActive: false,
        documentCount: 32,
        totalSize: '156.8 MB',
        lastAccessed: '2024-01-10T09:15:00Z',
        createdBy: 'Compliance Team',
        accessCount: 25
      },
      {
        id: 4,
        name: 'Legal Contracts Repository',
        description: 'Legal contracts and agreement documents',
        accessLevel: 'CONFIDENTIAL',
        expiryDate: '2024-02-28',
        isActive: true,
        documentCount: 45,
        totalSize: '234.7 MB',
        lastAccessed: '2024-01-16T11:45:00Z',
        createdBy: 'Legal Team',
        accessCount: 18
      },
      {
        id: 5,
        name: 'Technical Specifications',
        description: 'Technical specifications and engineering drawings',
        accessLevel: 'RESTRICTED',
        expiryDate: '2024-02-25',
        isActive: true,
        documentCount: 67,
        totalSize: '445.2 MB',
        lastAccessed: '2024-01-15T16:20:00Z',
        createdBy: 'Engineering Team',
        accessCount: 22
      },
      {
        id: 6,
        name: 'HR Policies & Procedures',
        description: 'Human resources policies and procedure documents',
        accessLevel: 'INTERNAL',
        expiryDate: '2024-03-15',
        isActive: true,
        documentCount: 28,
        totalSize: '98.3 MB',
        lastAccessed: '2024-01-14T13:30:00Z',
        createdBy: 'HR Team',
        accessCount: 35
      },
      {
        id: 7,
        name: 'Marketing Materials',
        description: 'Marketing collateral and promotional materials',
        accessLevel: 'PUBLIC',
        expiryDate: '2024-04-01',
        isActive: true,
        documentCount: 52,
        totalSize: '312.6 MB',
        lastAccessed: '2024-01-13T10:15:00Z',
        createdBy: 'Marketing Team',
        accessCount: 48
      },
      {
        id: 8,
        name: 'Financial Reports Archive',
        description: 'Historical financial reports and audit documents',
        accessLevel: 'CONFIDENTIAL',
        expiryDate: '2024-02-18',
        isActive: false,
        documentCount: 89,
        totalSize: '567.4 MB',
        lastAccessed: '2024-01-12T14:45:00Z',
        createdBy: 'Finance Team',
        accessCount: 12
      }
    ]
    setDataRooms(mockDataRooms)
  }

  const stats = useMemo(() => {
    const total = dataRooms.length
    const active = dataRooms.filter(dr => dr.isActive).length
    const totalFiles = dataRooms.reduce((a, dr) => a + (dr.documentCount || 0), 0)
    const totalAccess = dataRooms.reduce((a, dr) => a + (dr.accessCount || 0), 0)
    const restricted = dataRooms.filter(dr =>
      dr.accessLevel === 'RESTRICTED' || dr.accessLevel === 'CONFIDENTIAL'
    ).length
    return { total, active, inactive: total - active, totalFiles, totalAccess, restricted }
  }, [dataRooms])

  const insightItems = useMemo(() => {
    const items = []
    if (stats.total > 0) {
      items.push({
        title: `${stats.total} secure rooms hosting ${stats.totalFiles} files with ${stats.totalAccess} access events`,
        detail: `${stats.active} rooms are live while ${stats.restricted} run elevated control tiers.`,
        tone: 'info'
      })
    }
    if (stats.inactive > 0) {
      items.push({
        title: 'Inactive rooms still carry custodial data',
        detail: 'Review archival or deletion policies for dormant collaboration spaces.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Data room fabric is ready',
        detail: 'Provision your first room to track access and document density.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextId = dataRooms.length ? Math.max(...dataRooms.map(dr => dr.id), 0) + 1 : 1
    if (editingDataRoom) {
      setDataRooms(prev => prev.map(dataRoom =>
        dataRoom.id === editingDataRoom.id ? { ...dataRoom, ...formData } : dataRoom
      ))
      toast.success(`Successfully updated data room "${formData.name}"!`)
    } else {
      const newDataRoom = {
        id: nextId,
        ...formData,
        documentCount: 0,
        totalSize: '0 MB',
        lastAccessed: null,
        createdBy: 'Current User',
        accessCount: 0
      }
      setDataRooms(prev => [...prev, newDataRoom])
      toast.success(`Successfully created data room "${formData.name}"!`)
    }
    setShowModal(false)
    setEditingDataRoom(null)
    resetForm()
  }

  const handleDelete = (id) => {
    const dataRoom = dataRooms.find(dr => dr.id === id)
    if (window.confirm(`Are you sure you want to delete data room "${dataRoom?.name}"?`)) {
      setDataRooms(prev => prev.filter(dataRoom => dataRoom.id !== id))
      toast.success(`Successfully deleted data room "${dataRoom?.name}"!`)
    }
  }

  const handleEdit = (dataRoom) => {
    setEditingDataRoom(dataRoom)
    setFormData({
      name: dataRoom.name,
      description: dataRoom.description,
      accessLevel: dataRoom.accessLevel,
      expiryDate: dataRoom.expiryDate,
      isActive: dataRoom.isActive
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      accessLevel: 'RESTRICTED',
      expiryDate: '',
      isActive: true
    })
  }

  const openCreateModal = () => {
    setEditingDataRoom(null)
    resetForm()
    setShowModal(true)
  }

  const getAccessLevelBadge = (level) => {
    const variants = {
      PUBLIC: 'success',
      RESTRICTED: 'warning',
      CONFIDENTIAL: 'danger',
      SECRET: 'dark',
      INTERNAL: 'info'
    }
    return <Badge bg={variants[level] || 'secondary'}>{level}</Badge>
  }

  const getStatusBadge = (isActive) => {
    return <Badge bg={isActive ? 'success' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>
  }

  const handleViewDataRoom = (dataRoom) => {
    setSelectedDataRoom(dataRoom)
    setShowViewModal(true)
  }

  const columns = [
    {
      key: 'name',
      label: 'Data Room Details',
      width: '25%',
      render: (value, row) => (
        <div className="data-room-info">
          <div className="fw-semibold d-flex align-items-center">
            <Folder size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
        </div>
      )
    },
    {
      key: 'accessLevel',
      label: 'Access Level',
      width: '12%',
      render: (value) => getAccessLevelBadge(value)
    },
    {
      key: 'isActive',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'documentCount',
      label: 'Documents',
      width: '10%',
      render: (value) => (
        <div className="text-center">
          <div className="fw-bold text-primary">{value}</div>
          <small className="text-muted">files</small>
        </div>
      )
    },
    {
      key: 'totalSize',
      label: 'Size',
      width: '10%'
    },
    {
      key: 'accessCount',
      label: 'Accesses',
      width: '10%',
      render: (value) => (
        <div className="text-center">
          <div className="fw-bold text-info">{value}</div>
          <small className="text-muted">times</small>
        </div>
      )
    },
    {
      key: 'createdBy',
      label: 'Created By',
      width: '12%'
    },
    {
      key: 'expiryDate',
      label: 'Expires',
      width: '10%',
      render: (value) => {
        const date = new Date(value)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
    }
  ]

  const accessLevels = ['PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET']

  return (
    <>
      <ExecutiveCommandCenter
        className="data-rooms-page"
        showSkeleton={loading && !dataRooms.length}
        breadcrumbs={[
          {
            label: 'Document Management',
            onClick: () => navigate('/document-management')
          },
          { label: 'Data Rooms', active: true }
        ]}
        onBack={() => navigate('/document-management')}
        title="Data rooms command center"
        description="Secure document storage, access tiers, and external sharing telemetry in one operational view."
        heroMeta="Collaboration perimeter"
        outlookTitle="Room portfolio outlook"
        outlookDescription={`${stats.total} collaboration spaces index ${stats.totalFiles} files with ${stats.totalAccess} historical access events.`}
        outlookChips={[
          `${stats.total} rooms`,
          `${stats.active} active`,
          `${stats.totalFiles} files`,
          `${stats.restricted} restricted`
        ]}
        insights={insightItems}
        kpiTitle="Room signal board"
        kpiMeta="Footprint, activity, and control posture"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total rooms"
                value={stats.total}
                hint="Provisioned vaults"
                tone="intel"
                trend="Registry"
                icon={<Folder size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active rooms"
                value={stats.active}
                hint="Open for collaboration"
                tone="success"
                trend="Live"
                icon={<FolderOpen size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Indexed files"
                value={stats.totalFiles}
                hint="Document objects"
                tone="warning"
                trend="Volume"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Access events"
                value={stats.totalAccess}
                hint="Historical unlocks"
                tone="intel"
                trend="Usage"
                icon={<Lock size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Data rooms (${dataRooms.length})`}
        tableActions={(
          <Button variant="primary" onClick={openCreateModal} className="add-data-room-btn">
            <Plus size={20} className="me-2" />
            Create data room
          </Button>
        )}
      >
        <DataTable
          data={dataRooms}
          columns={columns}
          title={`Data rooms (${dataRooms.length})`}
          searchable
          sortable
          exportable
          pagination
          pageSize={10}
          showActions
          showCheckboxes={false}
          onView={handleViewDataRoom}
          onEdit={handleEdit}
          onDelete={(row) => handleDelete(row.id)}
          customActions={[
            {
              type: 'custom',
              label: 'Share',
              onClick: (row) => {
                setSelectedDataRoom(row)
                setShowShareModal(true)
              }
            },
            {
              type: 'custom',
              label: 'Upload',
              onClick: (row) => {
                setSelectedDataRoom(row)
                setShowUploadModal(true)
              }
            }
          ]}
          searchPlaceholder="Search data rooms..."
          emptyMessage="No data rooms found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        onTestFill={showModal ? () => setFormData(dummyDataRoomForm()) : undefined}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDataRoom ? 'Edit Data Room' : 'Create New Data Room'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Room Name</Form.Label>
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
                  <Form.Label>Access Level</Form.Label>
                  <Form.Select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                    required
                  >
                    {accessLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingDataRoom ? 'Update' : 'Create Data Room'}
            </Button>
          </Modal.Footer>
        </Form>
      </FormDrawerModal>

      {/* Share Data Room Modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Share Data Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDataRoom && (
            <>
              <h6 className="mb-3 text-primary">{selectedDataRoom.name}</h6>
              <Form.Group className="mb-3">
                <Form.Label>Secure Access Link</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    readOnly
                    value={`https://tender360.secure-dataroom.com/room/${selectedDataRoom.id}`}
                  />
                  <Button
                    variant="outline-primary"
                    className="ms-2"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://tender360.secure-dataroom.com/room/${selectedDataRoom.id}`)
                      toast.success('Secure link copied to clipboard!')
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </Form.Group>
              <Form onSubmit={(e) => {
                e.preventDefault()
                const email = e.currentTarget.elements.shareEmail.value
                toast.success(`Access invitation sent to ${email}!`)
                e.currentTarget.reset()
              }}>
                <Form.Group className="mb-3">
                  <Form.Label>Invite Collaborator via Email</Form.Label>
                  <Form.Control
                    name="shareEmail"
                    type="email"
                    placeholder="name@company.com"
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit">Send Invite</Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => {
        if (!uploading) setShowUploadModal(false)
      }}>
        <Modal.Header closeButton={!uploading}>
          <Modal.Title>Upload to {selectedDataRoom?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <h6>Uploading files...</h6>
              <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" style={{ height: '18px' }} />
            </div>
          ) : (
            <Form onSubmit={(e) => {
              e.preventDefault()
              const fileEl = e.currentTarget.elements.uploadFile
              if (!fileEl.files.length) return
              const fileName = fileEl.files[0].name
              const fileSize = (fileEl.files[0].size / (1024 * 1024)).toFixed(1) + ' MB'
              
              setUploading(true)
              setUploadProgress(0)
              
              let progress = 0
              const interval = setInterval(() => {
                progress += 20
                setUploadProgress(progress)
                if (progress >= 100) {
                  clearInterval(interval)
                  setTimeout(() => {
                    setDataRooms(prev => prev.map(dr => dr.id === selectedDataRoom.id ? {
                      ...dr,
                      documentCount: dr.documentCount + 1,
                      totalSize: (parseFloat(dr.totalSize) + parseFloat(fileSize)).toFixed(1) + ' MB',
                      lastAccessed: new Date().toISOString()
                    } : dr))
                    
                    setUploading(false)
                    setShowUploadModal(false)
                    toast.success(`Successfully uploaded "${fileName}" to data room!`)
                  }, 500)
                }
              }, 150)
            }}>
              <Form.Group className="mb-3">
                <Form.Label>Select File</Form.Label>
                <Form.Control name="uploadFile" type="file" required />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Start Upload</Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* View Details Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <FolderOpen size={20} className="me-2 text-primary" />
            Data Room Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDataRoom && (
            <div className="p-2">
              <h5 className="mb-3 text-primary">{selectedDataRoom.name}</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Access Level:</strong> {getAccessLevelBadge(selectedDataRoom.accessLevel)}
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> {getStatusBadge(selectedDataRoom.isActive)}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Document Count:</strong> <span className="fw-semibold">{selectedDataRoom.documentCount} files</span>
                </Col>
                <Col md={6}>
                  <strong>Total Storage Size:</strong> <span className="fw-semibold">{selectedDataRoom.totalSize}</span>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Created By:</strong> {selectedDataRoom.createdBy}
                </Col>
                <Col md={6}>
                  <strong>Expires:</strong> {new Date(selectedDataRoom.expiryDate).toLocaleDateString()}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Access Events:</strong> {selectedDataRoom.accessCount} entries
                </Col>
                <Col md={6}>
                  <strong>Last Accessed:</strong> {selectedDataRoom.lastAccessed ? new Date(selectedDataRoom.lastAccessed).toLocaleString() : 'Never'}
                </Col>
              </Row>
              <div className="mb-3 mt-3">
                <strong>Description:</strong>
                <p className="text-muted mt-1">{selectedDataRoom.description}</p>
              </div>
              <div className="mb-3">
                <strong>Indexed Files:</strong>
                <ul className="mt-2 pl-3">
                  {Array.from({ length: selectedDataRoom.documentCount || 0 }).map((_, idx) => (
                    <li key={idx} className="text-muted small d-flex align-items-center mb-1">
                      <FileText size={14} className="me-2" />
                      Document_Asset_{idx + 1}.pdf
                    </li>
                  ))}
                  {selectedDataRoom.documentCount === 0 && (
                    <li className="text-muted small italic">No files indexed in this data room yet.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DataRooms
