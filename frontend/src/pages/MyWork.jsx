import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Row, Col, Card, Button, Spinner, ProgressBar } from 'react-bootstrap'
import { BiRefresh } from 'react-icons/bi'
import { toast } from 'react-toastify'

import PremiumKpiCard from '../components/intelligence/PremiumKpiCard'
import InsightStream from '../components/intelligence/InsightStream'
import {
  IconStatPending,
  IconStatApprovals,
  IconStatExpiry,
  IconStatProgress,
  IconTabTasks,
  IconTabApprovals,
  IconTabGuarantees,
  IconTypeEvaluation,
  IconTypeApproval,
  IconTypeCompliance,
  IconTypeBidDecision,
  IconTypePricing,
  IconEye,
  IconCheck,
  IconClose,
  IconPlay,
  IconRenew,
} from './my-work/MyWorkIcons'
import './MyWork.scss'

const TYPE_ICONS = {
  EVALUATION: IconTypeEvaluation,
  APPROVAL: IconTypeApproval,
  COMPLIANCE: IconTypeCompliance,
  BID_DECISION: IconTypeBidDecision,
  PRICING_EXCEPTION: IconTypePricing,
}

const MyWork = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tasks')

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review Tender TND-2024-001',
      description:
        'Evaluate technical requirements for Infrastructure Development Project',
      type: 'EVALUATION',
      priority: 'HIGH',
      status: 'PENDING',
      dueDate: '2026-06-01',
      assignedBy: 'System Administrator',
      tenderId: 'TND-2024-001',
      progress: 0,
    },
    {
      id: 2,
      title: 'Approve Pricing for TND-2024-002',
      description:
        'Review and approve commercial proposal for Software Development',
      type: 'APPROVAL',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: '2026-05-28',
      assignedBy: 'Tender Manager',
      tenderId: 'TND-2024-002',
      progress: 60,
    },
    {
      id: 3,
      title: 'Update Compliance Matrix',
      description: 'Complete compliance matrix for Healthcare Services Tender',
      type: 'COMPLIANCE',
      priority: 'HIGH',
      status: 'PENDING',
      dueDate: '2026-06-03',
      assignedBy: 'Bid Manager',
      tenderId: 'TND-2024-003',
      progress: 30,
    },
  ])

  const [approvals, setApprovals] = useState([
    {
      id: 1,
      title: 'Bid/No-Bid Decision - TND-2024-004',
      description: 'Approve bid decision for Construction Project',
      type: 'BID_DECISION',
      status: 'PENDING',
      submittedBy: 'Bid Manager',
      submittedDate: '2026-04-02',
      tenderId: 'TND-2024-004',
      amount: '$5.2M',
    },
    {
      id: 2,
      title: 'Pricing Exception Approval',
      description: 'Approve 15% discount for strategic client',
      type: 'PRICING_EXCEPTION',
      status: 'PENDING',
      submittedBy: 'Pricing Analyst',
      submittedDate: '2026-04-05',
      tenderId: 'TND-2024-005',
      amount: '$850K',
    },
  ])

  const [expiringGuarantees, setExpiringGuarantees] = useState([
    {
      id: 1,
      type: 'EMD',
      amount: '$50,000',
      expiryDate: '2026-06-08',
      tenderId: 'TND-2024-006',
      status: 'EXPIRING_SOON',
      daysRemaining: 10,
    },
    {
      id: 2,
      type: 'PBG',
      amount: '$500,000',
      expiryDate: '2026-07-20',
      tenderId: 'TND-2024-007',
      status: 'ACTIVE',
      daysRemaining: 31,
    },
  ])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 550))
    } catch {
      toast.error('Failed to load work data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const pendingTasksCount = useMemo(
    () => tasks.filter((t) => t.status === 'PENDING').length,
    [tasks]
  )
  const pendingApprovalsCount = useMemo(
    () => approvals.filter((a) => a.status === 'PENDING').length,
    [approvals]
  )
  const urgentGuaranteesCount = useMemo(
    () =>
      expiringGuarantees.filter((g) => g.daysRemaining <= 30).length,
    [expiringGuarantees]
  )
  const inProgressCount = useMemo(
    () => tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    [tasks]
  )

  const stats = [
    {
      key: 'pending',
      label: 'Pending tasks',
      value: pendingTasksCount,
      Icon: IconStatPending,
      hint: 'Awaiting action',
      tone: 'warning',
      trend: 'Priority queue',
    },
    {
      key: 'approvals',
      label: 'Pending approvals',
      value: pendingApprovalsCount,
      Icon: IconStatApprovals,
      hint: 'Signatures & gates',
      tone: 'intel',
      trend: 'Review gates',
    },
    {
      key: 'guarantees',
      label: 'Expiring guarantees',
      value: urgentGuaranteesCount,
      Icon: IconStatExpiry,
      hint: '≤ 30 days',
      tone: urgentGuaranteesCount > 0 ? 'risk' : 'success',
      trend: urgentGuaranteesCount > 0 ? 'Renew soon' : 'Healthy',
      trendDirection: urgentGuaranteesCount > 0 ? 'down' : 'up',
    },
    {
      key: 'progress',
      label: 'In progress',
      value: inProgressCount,
      Icon: IconStatProgress,
      hint: 'Active work',
      tone: 'success',
      trend: 'Active work',
    },
  ]

  const insightItems = useMemo(() => {
    const items = []

    if (pendingTasksCount > 0) {
      items.push({
        title: `${pendingTasksCount} task${pendingTasksCount === 1 ? '' : 's'} awaiting your action`,
        detail:
          'Prioritize high-severity evaluations and compliance updates before submission deadlines.',
        tone: 'warning',
      })
    }

    if (pendingApprovalsCount > 0) {
      items.push({
        title: `${pendingApprovalsCount} approval${pendingApprovalsCount === 1 ? '' : 's'} need signatures`,
        detail: 'Pricing and bid/no-bid gates should be cleared to keep pursuits moving.',
        tone: 'info',
      })
    }

    if (urgentGuaranteesCount > 0) {
      items.push({
        title: `${urgentGuaranteesCount} guarantee${urgentGuaranteesCount === 1 ? '' : 's'} expiring within 30 days`,
        detail: 'Renew EMD and PBG instruments before treasury cutoff to avoid bid disqualification.',
        tone: 'warning',
      })
    }

    if (inProgressCount > 0) {
      items.push({
        title: `${inProgressCount} active work item${inProgressCount === 1 ? '' : 's'} in progress`,
        detail: 'Complete in-flight reviews to unblock downstream approvals.',
        tone: 'success',
      })
    }

    if (!items.length) {
      items.push({
        title: 'Your work queue is clear',
        detail: 'New tasks, approvals, and guarantee renewals will appear here as they are assigned.',
        tone: 'success',
      })
    }

    return items.slice(0, 4)
  }, [pendingTasksCount, pendingApprovalsCount, urgentGuaranteesCount, inProgressCount])

  const tabs = [
    { key: 'tasks', label: 'Tasks', count: tasks.length, Icon: IconTabTasks },
    {
      key: 'approvals',
      label: 'Approvals',
      count: approvals.length,
      Icon: IconTabApprovals,
    },
    {
      key: 'guarantees',
      label: 'Guarantees',
      count: expiringGuarantees.length,
      Icon: IconTabGuarantees,
    },
  ]

  const getPriorityBadge = (priority) => {
    const map = {
      HIGH: 'my-work-tag my-work-tag--high',
      MEDIUM: 'my-work-tag my-work-tag--med',
      LOW: 'my-work-tag my-work-tag--low',
    }
    return (
      <span className={map[priority] || 'my-work-tag'}>{priority}</span>
    )
  }

  const getStatusBadge = (status) => {
    const map = {
      PENDING: 'my-work-tag my-work-tag--pending',
      IN_PROGRESS: 'my-work-tag my-work-tag--active',
      COMPLETED: 'my-work-tag my-work-tag--ok',
      OVERDUE: 'my-work-tag my-work-tag--high',
      APPROVED: 'my-work-tag my-work-tag--ok',
      REJECTED: 'my-work-tag my-work-tag--danger',
      ACTIVE: 'my-work-tag my-work-tag--med',
      EXPIRING_SOON: 'my-work-tag my-work-tag--high',
    }
    return <span className={map[status] || 'my-work-tag'}>{status.replace(/_/g, ' ')}</span>
  }

  const TypeIcon = useCallback(({ type }) => {
    const C = TYPE_ICONS[type] || IconTypeEvaluation
    return <C className="my-work-row__type-svg" aria-hidden />
  }, [])

  const handleTaskAction = (taskId, action) => {
    if (action === 'complete') {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: 'COMPLETED', progress: 100 } : task
        )
      )
      toast.success('Task marked complete.')
    } else if (action === 'start') {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: 'IN_PROGRESS' } : task
        )
      )
      toast.info('Task started.')
    }
  }

  const handleApprovalAction = (approvalId, action) => {
    if (action === 'approve') {
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId ? { ...a, status: 'APPROVED' } : a
        )
      )
      toast.success('Approval granted.')
    } else if (action === 'reject') {
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId ? { ...a, status: 'REJECTED' } : a
        )
      )
      toast.warning('Approval rejected.')
    }
  }

  const getExpiryClass = (daysRemaining) => {
    if (daysRemaining <= 7) return 'my-work-tag my-work-tag--high'
    if (daysRemaining <= 30) return 'my-work-tag my-work-tag--pending'
    return 'my-work-tag my-work-tag--ok'
  }

  const showInitialLoader = loading

  return (
    <div className="my-work-page page-enter page-bg-gradient intel-executive-page">
      <div className="intel-executive-page__hero mb-3">
        <div>
          <h1>Workbench command center</h1>
          <p>
            Your tasks, approvals, and expiring guarantees in one executive operating view.
          </p>
        </div>
        <div className="intel-executive-page__hero-actions">
          <Button size="sm" variant="outline-primary" onClick={refresh} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Refreshing
              </>
            ) : (
              <>
                <BiRefresh className="me-1" />
                Refresh
              </>
            )}
          </Button>
          <small>Personal queue telemetry</small>
        </div>
      </div>

      {showInitialLoader ? <div className="intel-loading-skeleton mb-3" /> : null}

      <div className="intel-cinematic-hero mb-3">
        <h2 className="h4 mb-2">Workbench intelligence outlook</h2>
        <p className="mb-0">
          {pendingTasksCount + pendingApprovalsCount} open actions with {urgentGuaranteesCount}{' '}
          guarantee renewal{urgentGuaranteesCount === 1 ? '' : 's'} due inside 30 days and{' '}
          {inProgressCount} pursuit{inProgressCount === 1 ? '' : 's'} actively in review.
        </p>
        <div className="intel-cinematic-hero__chips">
          <span className="intel-chip">{pendingTasksCount} pending tasks</span>
          <span className="intel-chip">{pendingApprovalsCount} pending approvals</span>
          <span className="intel-chip">{expiringGuarantees.length} guarantees tracked</span>
          <span className="intel-chip">{inProgressCount} in progress</span>
        </div>
      </div>

      <InsightStream items={insightItems} />

      <div className="intel-mission-control my-work-kpi-strip mb-3">
        <div className="pipeline-kpi-strip__head">
          <div>
            <span className="pipeline-kpi-strip__badge">Operating metrics</span>
            <h2 className="pipeline-kpi-strip__title">Workbench signal board</h2>
          </div>
          <small className="pipeline-kpi-strip__meta">Personal queue health snapshot</small>
        </div>
        <Row className="g-3">
          {stats.map(({ key, label, value, Icon, hint, tone, trend, trendDirection }) => (
            <Col key={key} xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label={label}
                value={value}
                hint={hint}
                tone={tone}
                trend={trend}
                trendDirection={trendDirection}
                icon={<Icon className="my-work-kpi-icon" />}
              />
            </Col>
          ))}
        </Row>
      </div>

      <Card className="intel-chart-card mb-3">
        <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="my-work-toolbar-title">
            <IconTabTasks className="my-work-toolbar-icon" aria-hidden />
            <span>Work queue</span>
          </div>
          <div className="d-flex flex-wrap gap-2 tab-navigation">
            {tabs.map(({ key, label, count, Icon }) => (
              <Button
                key={key}
                variant={activeTab === key ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab(key)}
              >
                <Icon className="my-work-tab-btn-icon" aria-hidden />
                <span className="ms-2">
                  {label} ({count})
                </span>
              </Button>
            ))}
          </div>
        </Card.Header>

        <Card.Body className="my-work-body p-0">
          {activeTab === 'tasks' && (
            <ul className="my-work-list list-unstyled mb-0">
              {tasks.map((task) => (
                <li key={task.id} className="my-work-row">
                  <div className="my-work-row__accent" aria-hidden />
                  <div className="my-work-row__main">
                    <div className="my-work-row__title-line">
                      <span className="my-work-row__type" title={task.type}>
                        <TypeIcon type={task.type} />
                      </span>
                      <h3 className="my-work-row__title">{task.title}</h3>
                      <div className="my-work-row__tags">
                        {getPriorityBadge(task.priority)}
                        {getStatusBadge(task.status)}
                      </div>
                    </div>
                    <p className="my-work-row__desc">{task.description}</p>
                    <div className="my-work-row__meta">
                      <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span aria-hidden className="my-work-meta-dot">
                        ·
                      </span>
                      <span>{task.assignedBy}</span>
                      <span aria-hidden className="my-work-meta-dot">
                        ·
                      </span>
                      <span>{task.tenderId}</span>
                    </div>
                    {task.status === 'IN_PROGRESS' && (
                      <div className="my-work-progress">
                        <ProgressBar now={task.progress} />
                        <span className="my-work-progress__label">
                          {task.progress}% complete
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="my-work-row__actions">
                    <Button
                      variant="outline-secondary"
                      className="my-work-action my-work-action--icon"
                      aria-label={`View ${task.title}`}
                      onClick={() => toast.info(`Opening ${task.title}…`)}
                    >
                      <IconEye />
                    </Button>
                    {task.status === 'PENDING' && (
                      <Button
                        variant="outline-primary"
                        className="my-work-action my-work-action--cta"
                        onClick={() => handleTaskAction(task.id, 'start')}
                      >
                        <IconPlay />
                        <span>Start</span>
                      </Button>
                    )}
                    {task.status === 'IN_PROGRESS' && (
                      <Button
                        variant="primary"
                        className="my-work-action my-work-action--cta"
                        onClick={() => handleTaskAction(task.id, 'complete')}
                      >
                        <IconCheck />
                        <span>Complete</span>
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'approvals' && (
            <ul className="my-work-list list-unstyled mb-0">
              {approvals.map((approval) => (
                <li key={approval.id} className="my-work-row">
                  <div className="my-work-row__accent my-work-row__accent--slate" aria-hidden />
                  <div className="my-work-row__main">
                    <div className="my-work-row__title-line">
                      <span className="my-work-row__type">
                        <TypeIcon type={approval.type} />
                      </span>
                      <h3 className="my-work-row__title">{approval.title}</h3>
                      <div className="my-work-row__tags">
                        {getStatusBadge(approval.status)}
                      </div>
                    </div>
                    <p className="my-work-row__desc">{approval.description}</p>
                    <div className="my-work-row__meta">
                      <span>
                        Submitted {new Date(approval.submittedDate).toLocaleDateString()}
                      </span>
                      <span aria-hidden className="my-work-meta-dot">
                        ·
                      </span>
                      <span>{approval.submittedBy}</span>
                      <span aria-hidden className="my-work-meta-dot">
                        ·
                      </span>
                      <span>{approval.tenderId}</span>
                      <span aria-hidden className="my-work-meta-dot">
                        ·
                      </span>
                      <span className="my-work-row__amount">{approval.amount}</span>
                    </div>
                  </div>
                  <div className="my-work-row__actions">
                    <Button
                      variant="outline-secondary"
                      className="my-work-action my-work-action--icon"
                      aria-label={`View ${approval.title}`}
                      onClick={() => toast.info(`Opening ${approval.title}…`)}
                    >
                      <IconEye />
                    </Button>
                    {approval.status === 'PENDING' && (
                      <>
                        <Button
                          variant="outline-success"
                          className="my-work-action my-work-action--icon my-work-action--ok"
                          aria-label="Approve"
                          onClick={() => handleApprovalAction(approval.id, 'approve')}
                        >
                          <IconCheck />
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="my-work-action my-work-action--icon my-work-action--danger"
                          aria-label="Reject"
                          onClick={() => handleApprovalAction(approval.id, 'reject')}
                        >
                          <IconClose />
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'guarantees' && (
            <ul className="my-work-list list-unstyled mb-0">
              {expiringGuarantees.map((g) => (
                <li key={g.id} className="my-work-row">
                  <div className="my-work-row__accent my-work-row__accent--warning" aria-hidden />
                  <div className="my-work-row__main">
                    <div className="my-work-row__title-line">
                      <span className="my-work-row__type">
                        <IconTabGuarantees className="my-work-row__type-svg" />
                      </span>
                      <h3 className="my-work-row__title">
                        {g.type} — {g.amount}
                      </h3>
                      <div className="my-work-row__tags">
                        <span className={getExpiryClass(g.daysRemaining)}>
                          {g.daysRemaining} days left
                        </span>
                        {getStatusBadge(g.status)}
                      </div>
                    </div>
                    <p className="my-work-row__desc mb-0">Tender {g.tenderId}</p>
                    <div className="my-work-row__meta">
                      <span>
                        Expires {new Date(g.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="my-work-row__actions">
                    <Button
                      variant="outline-secondary"
                      className="my-work-action my-work-action--icon"
                      aria-label="View guarantee"
                      onClick={() => toast.info(`Opening ${g.type} for ${g.tenderId}…`)}
                    >
                      <IconEye />
                    </Button>
                    {g.daysRemaining <= 30 && (
                      <Button
                        variant="outline-warning"
                        className="my-work-action my-work-action--cta"
                        onClick={() =>
                          toast.info('Renewal flow will connect to treasury workflow.')
                        }
                      >
                        <IconRenew />
                        <span>Renew</span>
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default MyWork
