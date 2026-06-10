import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Card, Button, Nav, Tab, Badge, Alert, Spinner } from 'react-bootstrap'
import {
  LifeBuoy,
  Plus,
  MessageCircle,
  Ticket,
  CircleDot,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Archive,
  LayoutDashboard,
  ListTodo,
  BookOpen,
  Bot,
  Book,
  Video,
  GraduationCap,
  Inbox,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import ExecutiveCommandCenter from '../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../components/intelligence/PremiumKpiCard'
import { fetchSupportDashboard, fetchTicketStats, setModal } from '../store/slices/supportSlice'
import TicketList from '../components/support/TicketList'
import FAQSection from '../components/support/FAQSection'
import SupportChatbot from '../components/support/SupportChatbot'
import CreateTicketModal from '../components/support/CreateTicketModal'
import './HelpSupport.scss'

const KPI_CARDS = [
  { field: 'total', label: 'Total tickets', hint: 'All time', tone: 'intel', trend: 'Volume', Icon: Ticket },
  { field: 'open', label: 'Open', hint: 'Needs attention', tone: 'warning', trend: 'Queue', Icon: CircleDot },
  { field: 'inProgress', label: 'In progress', hint: 'Being worked', tone: 'intel', trend: 'Active', Icon: Clock },
  { field: 'resolved', label: 'Resolved', hint: 'Completed', tone: 'success', trend: 'Closed loop', Icon: CheckCircle2 },
  { field: 'urgent', label: 'Urgent', hint: 'Critical SLA', tone: 'risk', trend: 'Escalations', Icon: AlertTriangle },
  { field: 'closed', label: 'Closed', hint: 'Archived', tone: 'intel', trend: 'History', Icon: Archive }
]

const HelpSupport = () => {
  const dispatch = useDispatch()
  const showCreateTicket = useSelector((state) => state.support.modals.showCreateTicket)
  const { dashboard, ticketStats, dashboardLoading, ticketsLoading, error } = useSelector(
    (state) => state.support
  )
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isInitialized, setIsInitialized] = useState(false)
  const [timeoutError, setTimeoutError] = useState(false)

  useEffect(() => {
    if (!isInitialized && !dashboardLoading && !ticketsLoading) {
      setIsInitialized(true)
      const timeoutId = setTimeout(() => {
        if (!dashboard || !ticketStats) {
          setTimeoutError(true)
        }
      }, 10000)

      if (!dashboard) dispatch(fetchSupportDashboard())
      if (!ticketStats) dispatch(fetchTicketStats())

      return () => clearTimeout(timeoutId)
    }
  }, [isInitialized, dashboardLoading, ticketsLoading, dashboard, ticketStats, dispatch])

  const handleCreateTicket = () => {
    dispatch(setModal({ modal: 'showCreateTicket', show: true }))
  }

  const handleRetry = () => {
    setTimeoutError(false)
    setIsInitialized(false)
    dispatch(fetchSupportDashboard())
    dispatch(fetchTicketStats())
  }

  const getStatusColor = (status) => {
    const colors = {
      OPEN: 'primary',
      IN_PROGRESS: 'info',
      WAITING_FOR_CUSTOMER: 'warning',
      RESOLVED: 'success',
      CLOSED: 'secondary',
      CANCELLED: 'danger'
    }
    return colors[status] || 'secondary'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: 'success',
      MEDIUM: 'info',
      HIGH: 'warning',
      URGENT: 'danger',
      CRITICAL: 'dark'
    }
    return colors[priority] || 'secondary'
  }

  const insightItems = useMemo(() => {
    if (!ticketStats) return []
    return [
      {
        title: 'Support desk insight',
        detail: `${ticketStats.open ?? 0} open tickets and ${ticketStats.inProgress ?? 0} in progress. Use the AI assistant for instant answers or raise a ticket for complex issues.`,
        tone: ticketStats.urgent > 0 ? 'warning' : 'info'
      }
    ]
  }, [ticketStats])

  const outlookChips = useMemo(() => {
    if (!ticketStats) return []
    return [
      `${ticketStats.total ?? 0} total`,
      `${ticketStats.open ?? 0} open`,
      `${ticketStats.resolved ?? 0} resolved`,
      `${ticketStats.urgent ?? 0} urgent`
    ]
  }, [ticketStats])

  const heroActions = (
    <>
      <Button variant="outline-primary" size="sm" onClick={handleCreateTicket}>
        <Plus size={16} className="me-2" />
        New ticket
      </Button>
      <Button variant="primary" size="sm" onClick={handleCreateTicket}>
        <MessageCircle size={16} className="me-2" />
        Contact support
      </Button>
    </>
  )

  const kpiContent = ticketStats ? (
    <Row className="g-3">
      {KPI_CARDS.map(({ field, label, hint, tone, trend, Icon }) => (
        <Col key={field} xs={6} md={4} xl={2}>
          <PremiumKpiCard
            label={label}
            value={ticketStats[field] ?? 0}
            hint={hint}
            tone={tone}
            trend={trend}
            icon={<Icon size={20} />}
          />
        </Col>
      ))}
    </Row>
  ) : null

  if (timeoutError || error) {
    return (
      <ExecutiveCommandCenter
        className="help-support-hub"
        title="Help & Support"
        description="Tickets, FAQs, and the AI assistant—aligned to your Tender360 workspace."
        heroMeta="Support desk"
      >
        <Alert variant="danger" className="help-support-alert">
          <h5 className="mb-2">Unable to load support dashboard</h5>
          <p className="mb-3 small">
            {timeoutError
              ? 'The request timed out. Please check your connection and try again.'
              : error || 'An error occurred while loading the support dashboard.'}
          </p>
          <Button variant="primary" size="sm" onClick={handleRetry}>
            <RefreshCw size={16} className="me-2" />
            Retry
          </Button>
        </Alert>
      </ExecutiveCommandCenter>
    )
  }

  if ((dashboardLoading || ticketsLoading) && !dashboard && !ticketStats) {
    return (
      <ExecutiveCommandCenter
        className="help-support-hub"
        showSkeleton
        title="Help & Support"
      />
    )
  }

  return (
    <ExecutiveCommandCenter
      className="help-support-hub"
      title="Help & Support"
      description="Tickets, FAQs, and the AI assistant—aligned to your Tender360 workspace."
      heroActions={heroActions}
      heroMeta="Workspace support desk"
      outlookTitle="Support outlook"
      outlookDescription={
        ticketStats
          ? `${ticketStats.total ?? 0} tickets tracked — ${ticketStats.open ?? 0} open, ${ticketStats.inProgress ?? 0} in progress, ${ticketStats.resolved ?? 0} resolved.`
          : 'Loading support metrics…'
      }
      outlookChips={outlookChips}
      insights={insightItems}
      kpiTitle="Ticket signal board"
      kpiMeta="Queue health & SLA"
      kpiContent={kpiContent}
    >
      <div className="help-support-tabs">
        <Nav
          variant="tabs"
          activeKey={activeTab}
          onSelect={(k) => k != null && setActiveTab(k)}
          className="help-support-tabs__nav"
        >
          <Nav.Item>
            <Nav.Link eventKey="dashboard">
              <LayoutDashboard size={16} />
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="tickets">
              <ListTodo size={16} />
              Tickets
              {ticketStats?.open > 0 && (
                <Badge bg="danger" pill className="ms-2">
                  {ticketStats.open}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="faqs">
              <BookOpen size={16} />
              FAQs
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chatbot">
              <Bot size={16} />
              AI assistant
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Container activeKey={activeTab} onSelect={(k) => k != null && setActiveTab(k)}>
          <Tab.Content className="help-support-tabs__body">
            <Tab.Pane eventKey="dashboard" className="help-support-dashboard">
              <Row className="g-3">
                <Col lg={8}>
                  <Card className="help-support-panel">
                    <Card.Header className="help-support-panel__head">
                      <span>Recent tickets</span>
                      <Button variant="link" size="sm" className="p-0" onClick={() => setActiveTab('tickets')}>
                        View all
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      {dashboard?.tickets?.length > 0 ? (
                        <div className="help-support-ticket-feed">
                          {dashboard.tickets.slice(0, 5).map((ticket) => (
                            <div key={ticket._id} className="help-support-ticket-feed__item">
                              <div className="help-support-ticket-feed__avatar">
                                {ticket.createdBy?.name?.charAt(0) || 'U'}
                              </div>
                              <div className="help-support-ticket-feed__main">
                                <div className="help-support-ticket-feed__top">
                                  <h6>{ticket.title}</h6>
                                  <time>{new Date(ticket.createdAt).toLocaleDateString()}</time>
                                </div>
                                <p>
                                  {(ticket.description || '').substring(0, 120)}
                                  {(ticket.description || '').length > 120 ? '…' : ''}
                                </p>
                                <div className="help-support-ticket-feed__meta">
                                  <Badge bg={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                                  <Badge bg={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                                  <span>{ticket.createdBy?.name}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="help-support-empty">
                          <Inbox size={40} strokeWidth={1.25} />
                          <p>No tickets yet—open one when you need us.</p>
                          <Button variant="primary" size="sm" onClick={handleCreateTicket}>
                            <Plus size={16} className="me-2" />
                            Create your first ticket
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="help-support-panel mb-3">
                    <Card.Header className="help-support-panel__head">
                      <span>Quick actions</span>
                    </Card.Header>
                    <Card.Body className="help-support-quick-actions">
                      <Button variant="primary" onClick={handleCreateTicket}>
                        <Plus size={16} className="me-2" />
                        Create ticket
                      </Button>
                      <Button variant="outline-primary" onClick={() => setActiveTab('faqs')}>
                        <BookOpen size={16} className="me-2" />
                        Browse FAQs
                      </Button>
                      <Button variant="outline-primary" onClick={() => setActiveTab('chatbot')}>
                        <Bot size={16} className="me-2" />
                        Open AI assistant
                      </Button>
                    </Card.Body>
                  </Card>
                  <Card className="help-support-panel">
                    <Card.Header className="help-support-panel__head">
                      <span>Resources</span>
                    </Card.Header>
                    <Card.Body className="help-support-resources">
                      <div className="help-support-resources__item">
                        <Book size={18} />
                        <div>
                          <strong>User guide</strong>
                          <span>Platform documentation</span>
                        </div>
                      </div>
                      <div className="help-support-resources__item">
                        <Video size={18} />
                        <div>
                          <strong>Video tutorials</strong>
                          <span>Short walkthroughs</span>
                        </div>
                      </div>
                      <div className="help-support-resources__item">
                        <GraduationCap size={18} />
                        <div>
                          <strong>Live training</strong>
                          <span>Scheduled sessions</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="tickets">
              <TicketList />
            </Tab.Pane>

            <Tab.Pane eventKey="faqs" className="help-support-faqs-pane">
              <FAQSection />
            </Tab.Pane>

            <Tab.Pane eventKey="chatbot" className="help-support-ai-pane">
              <div className="help-support-ai-intro">
                <div className="help-support-ai-intro__icon">
                  <Bot size={28} />
                </div>
                <h2>AI support assistant</h2>
                <p>
                  Get instant answers on navigation, tickets, and workflows. Use the chat bubble in the
                  bottom-right corner—available 24/7.
                </p>
                <Card className="help-support-panel help-support-ai-card">
                  <Card.Body>
                    <p className="help-support-ai-card__label">Try asking about</p>
                    <div className="help-support-ai-grid">
                      {[
                        { Icon: LayoutDashboard, text: 'Platform navigation' },
                        { Icon: ListTodo, text: 'Raising tickets' },
                        { Icon: BookOpen, text: 'FAQs & how-tos' },
                        { Icon: LifeBuoy, text: 'Feature tips' }
                      ].map(({ Icon, text }) => (
                        <div key={text} className="help-support-ai-chip">
                          <Icon size={17} />
                          {text}
                        </div>
                      ))}
                    </div>
                    <div className="help-support-ai-cta">
                      <Button variant="primary" size="sm">
                        <Sparkles size={16} className="me-2" />
                        Open chat widget (bottom right)
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>

      <SupportChatbot />
      <CreateTicketModal
        show={showCreateTicket}
        onHide={() => dispatch(setModal({ modal: 'showCreateTicket', show: false }))}
      />
    </ExecutiveCommandCenter>
  )
}

export default HelpSupport
