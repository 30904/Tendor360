import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Alert, ProgressBar } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Edit, Trash2, Eye, Briefcase, CheckCircle, Brain, AlertTriangle, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './WorkspaceTasks.scss'

const WorkspaceTasks = () => {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    setWorkspaces([
      {
        id: 1,
        name: 'Highway Construction Tender',
        description: 'Workspace for highway construction project evaluation',
        type: 'Tender Evaluation',
        status: 'Active',
        assignedTo: 'Evaluation Team Alpha',
        tasks: [
          { name: 'Technical Proposal Review', status: 'Completed', progress: 100, priority: 'High', dueDate: '2024-02-10' },
          { name: 'Commercial Analysis', status: 'In Progress', progress: 75, priority: 'High', dueDate: '2024-02-12' },
          { name: 'Risk Assessment', status: 'Pending', progress: 0, priority: 'Medium', dueDate: '2024-02-15' },
          { name: 'Compliance Check', status: 'In Progress', progress: 60, priority: 'High', dueDate: '2024-02-14' }
        ],
        totalTasks: 4,
        completedTasks: 1,
        inProgressTasks: 2,
        pendingTasks: 1,
        overallProgress: 59,
        aiOptimization: 'Optimal task sequencing for efficient evaluation',
        aiConfidence: 91,
        deadline: '2024-02-20',
        daysRemaining: 8,
        riskLevel: 'Low',
        createdDate: '2024-01-15',
        lastActivity: '2024-02-10'
      },
      {
        id: 2,
        name: 'Software Implementation Project',
        description: 'Workspace for software implementation tender evaluation',
        type: 'Technical Evaluation',
        status: 'Active',
        assignedTo: 'Technical Team Beta',
        tasks: [
          { name: 'Architecture Review', status: 'Completed', progress: 100, priority: 'Critical', dueDate: '2024-02-08' },
          { name: 'Security Assessment', status: 'In Progress', progress: 80, priority: 'High', dueDate: '2024-02-11' },
          { name: 'Performance Testing', status: 'Pending', progress: 0, priority: 'Medium', dueDate: '2024-02-16' },
          { name: 'Documentation Review', status: 'In Progress', progress: 40, priority: 'Low', dueDate: '2024-02-18' }
        ],
        totalTasks: 4,
        completedTasks: 1,
        inProgressTasks: 2,
        pendingTasks: 1,
        overallProgress: 55,
        aiOptimization: 'Technical evaluation optimized for quality assessment',
        aiConfidence: 88,
        deadline: '2024-02-25',
        daysRemaining: 13,
        riskLevel: 'Medium',
        createdDate: '2024-01-20',
        lastActivity: '2024-02-09'
      },
      {
        id: 3,
        name: 'Healthcare Infrastructure',
        description: 'Workspace for healthcare infrastructure project evaluation',
        type: 'Compliance Evaluation',
        status: 'Planning',
        assignedTo: 'Compliance Team Gamma',
        tasks: [
          { name: 'Regulatory Compliance Check', status: 'Pending', progress: 0, priority: 'Critical', dueDate: '2024-02-20' },
          { name: 'Safety Standards Review', status: 'Pending', progress: 0, priority: 'High', dueDate: '2024-02-22' },
          { name: 'Environmental Impact Assessment', status: 'Pending', progress: 0, priority: 'Medium', dueDate: '2024-02-25' }
        ],
        totalTasks: 3,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 3,
        overallProgress: 0,
        aiOptimization: 'Compliance-focused evaluation with regulatory expertise',
        aiConfidence: 85,
        deadline: '2024-03-01',
        daysRemaining: 19,
        riskLevel: 'Medium',
        createdDate: '2024-02-01',
        lastActivity: '2024-02-01'
      },
      {
        id: 4,
        name: 'Educational Technology Platform',
        description: 'Workspace for educational technology platform evaluation',
        type: 'Technical Evaluation',
        status: 'Active',
        assignedTo: 'Tech Team Delta',
        tasks: [
          { name: 'Platform Architecture Review', status: 'Completed', progress: 100, priority: 'High', dueDate: '2024-02-05' },
          { name: 'User Experience Assessment', status: 'In Progress', progress: 70, priority: 'High', dueDate: '2024-02-13' },
          { name: 'Scalability Testing', status: 'In Progress', progress: 50, priority: 'Medium', dueDate: '2024-02-17' },
          { name: 'Integration Compatibility', status: 'Pending', progress: 0, priority: 'Medium', dueDate: '2024-02-19' },
          { name: 'Security Audit', status: 'Pending', progress: 0, priority: 'High', dueDate: '2024-02-21' }
        ],
        totalTasks: 5,
        completedTasks: 1,
        inProgressTasks: 2,
        pendingTasks: 2,
        overallProgress: 44,
        aiOptimization: 'Technology-focused evaluation with performance metrics',
        aiConfidence: 92,
        deadline: '2024-02-28',
        daysRemaining: 16,
        riskLevel: 'Low',
        createdDate: '2024-01-25',
        lastActivity: '2024-02-10'
      },
      {
        id: 5,
        name: 'Environmental Services Contract',
        description: 'Workspace for environmental services contract evaluation',
        type: 'Service Evaluation',
        status: 'Active',
        assignedTo: 'Service Team Epsilon',
        tasks: [
          { name: 'Service Quality Assessment', status: 'In Progress', progress: 85, priority: 'High', dueDate: '2024-02-14' },
          { name: 'Cost Analysis', status: 'Completed', progress: 100, priority: 'High', dueDate: '2024-02-08' },
          { name: 'Environmental Impact Review', status: 'In Progress', progress: 60, priority: 'Medium', dueDate: '2024-02-16' },
          { name: 'Compliance Verification', status: 'Pending', progress: 0, priority: 'High', dueDate: '2024-02-18' }
        ],
        totalTasks: 4,
        completedTasks: 1,
        inProgressTasks: 2,
        pendingTasks: 1,
        overallProgress: 61,
        aiOptimization: 'Service evaluation optimized for quality and compliance',
        aiConfidence: 89,
        deadline: '2024-02-25',
        daysRemaining: 13,
        riskLevel: 'Low',
        createdDate: '2024-01-28',
        lastActivity: '2024-02-09'
      },
      {
        id: 6,
        name: 'Financial Services Platform',
        description: 'Workspace for financial services platform evaluation',
        type: 'Compliance Evaluation',
        status: 'Planning',
        assignedTo: 'Finance Team Zeta',
        tasks: [
          { name: 'Regulatory Compliance Check', status: 'Pending', progress: 0, priority: 'Critical', dueDate: '2024-02-22' },
          { name: 'Security Standards Review', status: 'Pending', progress: 0, priority: 'Critical', dueDate: '2024-02-24' },
          { name: 'Data Protection Assessment', status: 'Pending', progress: 0, priority: 'High', dueDate: '2024-02-26' },
          { name: 'Audit Trail Verification', status: 'Pending', progress: 0, priority: 'Medium', dueDate: '2024-02-28' }
        ],
        totalTasks: 4,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 4,
        overallProgress: 0,
        aiOptimization: 'Financial compliance evaluation with regulatory expertise',
        aiConfidence: 87,
        deadline: '2024-03-05',
        daysRemaining: 23,
        riskLevel: 'High',
        createdDate: '2024-02-05',
        lastActivity: '2024-02-05'
      }
    ])

    setStats({
      totalWorkspaces: 6,
      active: 4,
      planning: 2,
      totalTasks: 24,
      completedTasks: 4,
      inProgressTasks: 8,
      pendingTasks: 12,
      avgProgress: 35,
      aiConfidence: 89
    })
  }, [])

  const handleViewWorkspace = (workspace) => {
    setSelectedWorkspace(workspace)
    setShowModal(true)
  }

  const handleCreateWorkspace = () => {
    if (window.confirm('Are you sure you want to create a new workspace?')) {
      // Implementation for creating new workspace
      console.log('Creating new workspace...')
    }
  }

  const handleViewWorkspaceTask = (workspace) => {
    handleViewWorkspace(workspace)
  }

  const handleEditWorkspaceTask = (workspace) => {
    console.log('Edit workspace task:', workspace)
    // Navigate to edit workspace task or open edit modal
  }

  const handleDeleteWorkspaceTask = (workspace) => {
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
          'Planning': 'info',
          'Completed': 'secondary'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'overallProgress',
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
      key: 'totalTasks',
      label: 'Tasks',
      width: '10%',
      render: (value, row) => (
        <div className="tasks-info">
          <div className="fw-bold text-primary">{value}</div>
          <small className="text-muted">
            {row.completedTasks} completed, {row.pendingTasks} pending
          </small>
        </div>
      )
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      width: '12%',
      render: (value) => (
        <div className="assigned-info">
          <div className="fw-bold text-primary">{value}</div>
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
          <small className="text-muted">AI Score</small>
        </div>
      )
    },
    {
      key: 'daysRemaining',
      label: 'Days Remaining',
      width: '10%',
      render: (value) => (
        <div className="days-remaining">
          <div className="fw-bold text-primary">{value}</div>
          <small className="text-muted">days</small>
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
    },
    {
      key: 'lastActivity',
      label: 'Last Activity',
      width: '8%',
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
        title: `${stats.totalWorkspaces} workspaces orchestrating ${stats.totalTasks || 0} evaluation tasks`,
        detail: `${stats.completedTasks || 0} completed, ${stats.inProgressTasks || 0} in-flight, ${stats.pendingTasks || 0} queued — blended progress ${stats.avgProgress || 0}% with ${stats.aiConfidence || 0}% workflow confidence.`,
        tone: 'info'
      })
    }
    if ((stats.avgProgress || 0) < 45 && (stats.totalWorkspaces || 0) > 0) {
      items.push({
        title: 'Task velocity sits below the halfway mark',
        detail: 'Tighten ownership and sequencing on workspaces trending behind plan.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Stand up your first workspace',
        detail: 'Create workspaces to align evaluators, tasks, and AI-guided sequencing.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Planning': 'warning',
      'Completed': 'info',
      'On Hold': 'secondary'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getRiskBadge = (risk) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return <Badge bg={variants[risk] || 'secondary'}>{risk}</Badge>
  }

  const getTaskStatusBadge = (status) => {
    const variants = {
      'Completed': 'success',
      'In Progress': 'primary',
      'Pending': 'warning',
      'Overdue': 'danger'
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
      'Tender Evaluation': Briefcase,
      'Technical Evaluation': CheckCircle,
      'Compliance Evaluation': AlertTriangle
    }
    return icons[type] || Briefcase
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="workspace-tasks-page"
        breadcrumbs={[
          { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
          { label: 'Workspace & tasks', active: true }
        ]}
        onBack={() => navigate('/qualification-evaluation')}
        backLabel="Back to modules"
        title="Workspace & task command center"
        description="Manage evaluation workspaces and task assignments with AI-powered workflow optimization."
        heroMeta="Task orchestration telemetry"
        outlookTitle="Workload outlook"
        outlookDescription={`${stats.totalWorkspaces || 0} workspaces — ${stats.totalTasks || 0} tasks with ${stats.avgProgress || 0}% average progress.`}
        outlookChips={[
          `${stats.totalWorkspaces || 0} workspaces`,
          `${stats.totalTasks || 0} tasks`,
          `${stats.avgProgress || 0}% avg progress`,
          `${stats.aiConfidence || 0}% AI confidence`
        ]}
        insights={insightItems}
        kpiTitle="Workspace signal board"
        kpiMeta="Throughput and sequencing health"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Workspaces"
                value={stats.totalWorkspaces || 0}
                hint="Active orchestration units"
                tone="intel"
                trend="Coverage"
                icon={<Briefcase size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total tasks"
                value={stats.totalTasks || 0}
                hint="Across all workspaces"
                tone="success"
                trend="Inventory"
                trendDirection="up"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg progress"
                value={stats.avgProgress || 0}
                hint="Portfolio completion"
                tone={(stats.avgProgress || 0) >= 50 ? 'success' : 'warning'}
                trend="Velocity"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence || 0}
                hint="Workflow optimization stance"
                tone={(stats.aiConfidence || 0) >= 85 ? 'success' : 'warning'}
                trend="Model"
                suffix="%"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Workspaces & tasks (${workspaces.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2" onClick={handleCreateWorkspace}>
              <Plus size={16} className="me-2" />
              New workspace
            </Button>
            <Button variant="outline-secondary">
              <Briefcase size={16} className="me-2" />
              Export report
            </Button>
          </>
        )}
      >
        <DataTable
          data={workspaces}
          columns={columns}
          title="Workspaces & Tasks"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewWorkspaceTask}
          onEdit={handleEditWorkspaceTask}
          onDelete={handleDeleteWorkspaceTask}
          customActions={[
            {
              type: 'custom',
              label: 'View Tasks',
              onClick: (row) => {
                console.log('View Tasks:', row);
              }
            }
          ]}
          searchPlaceholder="Search workspaces..."
          emptyMessage="No workspaces found"
          loading={false}
        />
      </ExecutiveCommandCenter>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <Briefcase size={20} className="me-2" />
              Workspace Details - {selectedWorkspace?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedWorkspace && (
              <div className="workspace-details">
                <Row>
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Type:</strong> {selectedWorkspace.type}</p>
                    <p><strong>Status:</strong> {selectedWorkspace.status}</p>
                    <p><strong>Assigned To:</strong> {selectedWorkspace.assignedTo}</p>
                    <p><strong>Created:</strong> {selectedWorkspace.createdDate}</p>
                    <p><strong>Last Activity:</strong> {selectedWorkspace.lastActivity}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Project Details</h6>
                    <p><strong>Deadline:</strong> {selectedWorkspace.deadline}</p>
                    <p><strong>Days Remaining:</strong> {selectedWorkspace.daysRemaining}</p>
                    <p><strong>Risk Level:</strong> {selectedWorkspace.riskLevel}</p>
                    <p><strong>Overall Progress:</strong> {selectedWorkspace.overallProgress}%</p>
                    <p><strong>AI Confidence:</strong> {selectedWorkspace.aiConfidence}%</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Description</h6>
                    <p>{selectedWorkspace.description}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h6>Tasks & Progress</h6>
                    <div className="tasks-list">
                      {selectedWorkspace.tasks.map((task, index) => (
                        <div key={index} className="task-item">
                          <div className="task-header">
                            <div className="task-info">
                              <h6 className="mb-1">{task.name}</h6>
                              <small className="text-muted">Due: {task.dueDate}</small>
                            </div>
                            <div className="task-status">
                              {getTaskStatusBadge(task.status)}
                              {getPriorityBadge(task.priority)}
                            </div>
                          </div>
                          <ProgressBar 
                            variant={task.progress >= 80 ? 'success' : task.progress >= 60 ? 'primary' : 'warning'}
                            now={task.progress}
                            label={`${task.progress}%`}
                            className="mt-2"
                          />
                        </div>
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
                      <strong>Optimization:</strong> {selectedWorkspace.aiOptimization}
                    </Alert>
                    <Alert variant="success">
                      <TrendingUp size={16} className="me-2" />
                      <strong>Confidence Level:</strong> {selectedWorkspace.aiConfidence}% based on task sequencing and resource allocation analysis
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
              Edit Workspace
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default WorkspaceTasks
