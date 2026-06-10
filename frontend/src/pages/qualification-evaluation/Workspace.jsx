import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge } from 'react-bootstrap'
import { Briefcase, Plus, Edit, Trash2, Users, Clock, CheckCircle, AlertTriangle, Settings, Brain, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './Workspace.scss'

const Workspace = () => {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [stats, setStats] = useState({})

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
    console.log('View workspace:', workspace)
    // Navigate to view workspace or open view modal
  }

  const handleEditWorkspace = (workspace) => {
    console.log('Edit workspace:', workspace)
    // Navigate to edit workspace or open edit modal
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
          <Button variant="primary" className="me-2">
            <Plus size={16} className="me-2" />
            New workspace
          </Button>
          <Button variant="outline-secondary">
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
              console.log('View Progress:', row);
            }
          }
        ]}
        searchPlaceholder="Search workspaces..."
        emptyMessage="No workspaces found"
        loading={false}
      />
    </ExecutiveCommandCenter>
  )
}

export default Workspace