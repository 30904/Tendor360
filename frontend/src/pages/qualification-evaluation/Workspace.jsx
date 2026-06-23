import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, ProgressBar, Alert } from 'react-bootstrap'
import { Briefcase, Plus, Edit, Trash2, Users, Clock, CheckCircle, AlertTriangle, Settings, Brain, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './Workspace.scss'

const Workspace = () => {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [stats, setStats] = useState({})
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedWorkspaceForView, setSelectedWorkspaceForView] = useState(null)

  useEffect(() => {
    setWorkspaces([
      {
        id: 1,
        name: 'IT Infrastructure Evaluation',
        description: 'Comprehensive evaluation of IT infrastructure proposals',
        type: 'Technical Evaluation',
        status: 'Active',
        participants: 8,
        progress: 75,
        priority: 'High',
        createdBy: 'John Smith',
        createdDate: '2024-01-15',
        lastActivity: '2024-01-20',
        dueDate: '2024-02-15',
        aiOptimization: 'Enabled',
        aiConfidence: 92,
        tasksCompleted: 15,
        totalTasks: 20,
        riskLevel: 'Low'
      },
      {
        id: 2,
        name: 'Construction Services Review',
        description: 'Evaluation of construction and maintenance services',
        type: 'Service Evaluation',
        status: 'In Progress',
        participants: 12,
        progress: 45,
        priority: 'High',
        createdBy: 'Sarah Johnson',
        createdDate: '2024-01-10',
        lastActivity: '2024-01-19',
        dueDate: '2024-02-28',
        aiOptimization: 'Enabled',
        aiConfidence: 88,
        tasksCompleted: 9,
        totalTasks: 20,
        riskLevel: 'Medium'
      },
      {
        id: 3,
        name: 'Software Licensing Assessment',
        description: 'Assessment of software licensing and support proposals',
        type: 'Commercial Evaluation',
        status: 'Active',
        participants: 6,
        progress: 60,
        priority: 'Medium',
        createdBy: 'Mike Davis',
        createdDate: '2024-01-12',
        lastActivity: '2024-01-18',
        dueDate: '2024-02-10',
        aiOptimization: 'Enabled',
        aiConfidence: 95,
        tasksCompleted: 12,
        totalTasks: 20,
        riskLevel: 'Low'
      },
      {
        id: 4,
        name: 'Consulting Services Evaluation',
        description: 'Evaluation of management consulting services',
        type: 'Service Evaluation',
        status: 'Pending',
        participants: 10,
        progress: 20,
        priority: 'Medium',
        createdBy: 'Lisa Wilson',
        createdDate: '2024-01-18',
        lastActivity: '2024-01-18',
        dueDate: '2024-03-15',
        aiOptimization: 'Enabled',
        aiConfidence: 85,
        tasksCompleted: 4,
        totalTasks: 20,
        riskLevel: 'Medium'
      },
      {
        id: 5,
        name: 'Equipment Procurement Review',
        description: 'Review of equipment procurement and maintenance',
        type: 'Technical Evaluation',
        status: 'Active',
        participants: 7,
        progress: 85,
        priority: 'High',
        createdBy: 'David Brown',
        createdDate: '2024-01-08',
        lastActivity: '2024-01-20',
        dueDate: '2024-02-05',
        aiOptimization: 'Enabled',
        aiConfidence: 90,
        tasksCompleted: 17,
        totalTasks: 20,
        riskLevel: 'Low'
      },
      {
        id: 6,
        name: 'Training Services Assessment',
        description: 'Assessment of training and development services',
        type: 'Service Evaluation',
        status: 'Completed',
        participants: 5,
        progress: 100,
        priority: 'Low',
        createdBy: 'Emma Taylor',
        createdDate: '2023-12-20',
        lastActivity: '2024-01-15',
        dueDate: '2024-01-15',
        aiOptimization: 'Enabled',
        aiConfidence: 93,
        tasksCompleted: 20,
        totalTasks: 20,
        riskLevel: 'Low'
      }
    ])

    setStats({
      totalWorkspaces: 6,
      active: 4,
      completed: 1,
      pending: 1,
      totalParticipants: 48,
      avgProgress: 64,
      avgAiConfidence: 91,
      highPriority: 3
    })
  }, [])

  const handleViewWorkspace = (workspace) => {
    setSelectedWorkspaceForView(workspace)
    setShowViewModal(true)
  }

  const handleEditWorkspace = (workspace) => {
    toast.info(`Editing workspace "${workspace.name}" is disabled in Demo Mode.`)
  }

  const handleDeleteWorkspace = (workspace) => {
    if (window.confirm(`Are you sure you want to delete workspace "${workspace.name}"?`)) {
      setWorkspaces(prev => prev.filter(w => w.id !== workspace.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Workspace Details',
      width: '25%',
      render: (value, row) => (
        <div className="workspace-info">
          <div className="fw-semibold d-flex align-items-center">
            <Briefcase size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="workspace-meta">
            <small className="text-muted">Type: {row.type}</small>
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
          'Active': 'success',
          'In Progress': 'warning',
          'Pending': 'info',
          'Completed': 'secondary'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'progress',
      label: 'Progress',
      width: '12%',
      render: (value) => (
        <div className="progress-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">Complete</small>
        </div>
      )
    },
    {
      key: 'participants',
      label: 'Participants',
      width: '10%',
      render: (value) => (
        <div className="participants-info">
          <div className="fw-bold text-primary">{value}</div>
          <small className="text-muted">members</small>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '8%',
      render: (value) => {
        const variants = {
          'High': 'danger',
          'Medium': 'warning',
          'Low': 'success'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '10%',
      render: (value) => (
        <div className="ai-confidence">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">AI Score</small>
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      width: '10%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
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
    },
    {
      key: 'lastActivity',
      label: 'Last Activity',
      width: '7%',
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
    if ((stats.totalWorkspaces || 0) > 0) {
      items.push({
        title: `${stats.totalWorkspaces} workspaces with ${stats.totalParticipants || 0} participants`,
        detail: `${stats.active || 0} active, ${stats.pending || 0} pending, ${stats.completed || 0} completed — average progress ${stats.avgProgress || 0}% and ${stats.avgAiConfidence || 0}% AI confidence.`,
        tone: 'info'
      })
    }
    if ((stats.highPriority || 0) > 0) {
      items.push({
        title: `${stats.highPriority} high-priority workspaces need leadership attention`,
        detail: 'Sequence resourcing and deadline reviews for high-priority evaluation tracks.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Stand up your first evaluation workspace',
        detail: 'Create a workspace to align evaluators, tasks, and AI-assisted scoring in one place.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <>
      <ExecutiveCommandCenter
      className="workspace-page"
      breadcrumbs={[
        { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
        { label: 'Workspace', active: true }
      ]}
      onBack={() => navigate('/qualification-evaluation')}
      backLabel="Back to modules"
      title="Evaluation workspace command center"
      description="Collaborative workspace for qualification and evaluation activities with portfolio-level progress and AI confidence signals."
      heroMeta="Qualification & evaluation operating picture"
      outlookTitle="Workspace intelligence outlook"
      outlookDescription={`${stats.totalWorkspaces || 0} workspaces are tracked with ${stats.active || 0} active, averaging ${stats.avgProgress || 0}% progress across the portfolio.`}
      outlookChips={[
        `${stats.totalWorkspaces || 0} workspaces`,
        `${stats.active || 0} active`,
        `${stats.totalParticipants || 0} participants`,
        `${stats.avgAiConfidence || 0}% AI confidence`
      ]}
      insights={insightItems}
      kpiTitle="Workspace signal board"
      kpiMeta="Capacity, activity, and model confidence"
      kpiContent={(
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Total workspaces"
              value={stats.totalWorkspaces || 0}
              hint="Registered evaluation workspaces"
              tone="intel"
              trend="Registry"
              icon={<Briefcase size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Active"
              value={stats.active || 0}
              hint="Currently in flight"
              tone="success"
              trend="Live"
              icon={<CheckCircle size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Participants"
              value={stats.totalParticipants || 0}
              hint="Evaluators & stakeholders"
              tone="warning"
              trend="Collaboration"
              icon={<Users size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Avg AI confidence"
              value={stats.avgAiConfidence || 0}
              hint="Portfolio model confidence"
              tone={(stats.avgAiConfidence || 0) >= 85 ? 'success' : 'warning'}
              trend="Quality"
              suffix="%"
              icon={<Brain size={20} />}
            />
          </Col>
        </Row>
      )}
      tableTitle={`Evaluation workspaces (${workspaces.length})`}
      tableActions={(
        <>
          <Button variant="primary" className="me-2" onClick={() => toast.info("Creating workspaces is disabled in Demo Mode. Custom workspaces are synchronized from active solicitation runs.")}>
            <Plus size={16} className="me-2" />
            New workspace
          </Button>
          <Button variant="outline-secondary" onClick={() => toast.info("Workspace management features are coming soon.")}>
            <Settings size={16} className="me-2" />
            Manage
          </Button>
        </>
      )}
    >
      <DataTable
        data={workspaces}
        columns={columns}
        title="Evaluation Workspaces"
        searchable={true}
        sortable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        showActions={true}
        showCheckboxes={false}
        onView={handleViewWorkspace}
        onEdit={handleEditWorkspace}
        onDelete={handleDeleteWorkspace}
        customActions={[
          {
            type: 'custom',
            label: 'View Progress',
            onClick: (row) => {
              handleViewWorkspace(row);
            }
          }
        ]}
        searchPlaceholder="Search workspaces..."
        emptyMessage="No workspaces found"
        loading={false}
      />
    </ExecutiveCommandCenter>

      {/* View Workspace Details Modal */}
      <Modal show={showViewModal} onHide={() => { setShowViewModal(false); setSelectedWorkspaceForView(null); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Briefcase size={20} className="me-2 text-primary" />
            Workspace Details - {selectedWorkspaceForView?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWorkspaceForView && (
            <div className="workspace-view-details">
              <Row className="mb-4">
                <Col md={6}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Basic Info</h6>
                    <p className="mb-1"><strong>Type:</strong> {selectedWorkspaceForView.type}</p>
                    <p className="mb-1"><strong>Status:</strong> <Badge bg={selectedWorkspaceForView.status === 'Active' ? 'success' : 'secondary'}>{selectedWorkspaceForView.status}</Badge></p>
                    <p className="mb-1"><strong>Priority:</strong> <Badge bg={selectedWorkspaceForView.priority === 'High' ? 'danger' : 'info'}>{selectedWorkspaceForView.priority}</Badge></p>
                    <p className="mb-0"><strong>Participants:</strong> {selectedWorkspaceForView.participants} members</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Timeline & Ownership</h6>
                    <p className="mb-1"><strong>Created By:</strong> {selectedWorkspaceForView.createdBy}</p>
                    <p className="mb-1"><strong>Created Date:</strong> {selectedWorkspaceForView.createdDate}</p>
                    <p className="mb-1"><strong>Last Activity:</strong> {selectedWorkspaceForView.lastActivity}</p>
                    <p className="mb-0"><strong>Due Date:</strong> {selectedWorkspaceForView.dueDate}</p>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={12}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Progress</h6>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold">{selectedWorkspaceForView.progress}% Completed</span>
                      <small className="text-muted">{selectedWorkspaceForView.tasksCompleted} of {selectedWorkspaceForView.totalTasks} tasks finished</small>
                    </div>
                    <ProgressBar
                      now={selectedWorkspaceForView.progress}
                      variant={selectedWorkspaceForView.progress >= 70 ? 'success' : selectedWorkspaceForView.progress >= 40 ? 'warning' : 'danger'}
                      style={{ height: '10px' }}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className="p-3 border rounded bg-light mb-3">
                    <h6 className="text-muted mb-2">Description</h6>
                    <p className="mb-0">{selectedWorkspaceForView.description}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className="p-3 border rounded bg-light">
                    <h6 className="text-muted mb-2">AI Optimization Stance</h6>
                    <Alert variant="info" className="mb-0 d-flex align-items-center">
                      <Brain size={16} className="me-2 text-primary" />
                      <div>
                        <strong>AI Optimization:</strong> {selectedWorkspaceForView.aiOptimization} • 
                        <strong> Model Confidence:</strong> {selectedWorkspaceForView.aiConfidence}% • 
                        <strong> Risk level:</strong> <Badge bg={selectedWorkspaceForView.riskLevel === 'Low' ? 'success' : 'warning'}>{selectedWorkspaceForView.riskLevel}</Badge>
                      </div>
                    </Alert>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowViewModal(false); setSelectedWorkspaceForView(null); }}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowViewModal(false);
            handleEditWorkspace(selectedWorkspaceForView);
          }}>
            <Edit size={16} className="me-2" />
            Edit Workspace
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Workspace