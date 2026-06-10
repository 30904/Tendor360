import React, { useMemo, useState } from 'react'
import { Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Bot, Save, Send, Layers, Users, FileText, CalendarClock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import RFPSectionBuilder from '../../components/rfp/RFPSectionBuilder'
import RFPTeamAssignments from '../../components/rfp/RFPTeamAssignments'
import './CreateRFP.scss'

const createNewSection = () => ({
  id: `section-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title: '',
  type: '',
  owner: '',
  dueDate: '',
  required: true,
  aiAssist: true
})

const createNewTeam = () => ({
  id: `team-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  functionName: '',
  owner: '',
  email: '',
  slaDays: 3
})

const CreateRFP = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [isDraftSaved, setIsDraftSaved] = useState(false)
  const [metadata, setMetadata] = useState({
    rfpTitle: '',
    rfpNumber: '',
    businessUnit: '',
    category: '',
    issueDate: '',
    submissionDeadline: '',
    currency: 'INR',
    estimatedBudget: '',
    responseMode: 'Two Envelope',
    summary: ''
  })

  const [sections, setSections] = useState([
    {
      id: 'section-default-1',
      title: 'Scope of Work',
      type: 'Scope of Work',
      owner: '',
      dueDate: '',
      required: true,
      aiAssist: true
    }
  ])

  const [teams, setTeams] = useState([
    {
      id: 'team-default-1',
      functionName: 'Engineering',
      owner: '',
      email: '',
      slaDays: 3
    }
  ])

  const updateMetadata = (field, value) => {
    setMetadata((prev) => ({ ...prev, [field]: value }))
  }

  const updateSection = (id, field, value) => {
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, [field]: value } : section)))
  }

  const updateTeam = (id, field, value) => {
    setTeams((prev) => prev.map((team) => (team.id === id ? { ...team, [field]: value } : team))
    )
  }

  const dashboardStats = useMemo(() => {
    const requiredSections = sections.filter((section) => section.required).length
    const aiEnabledSections = sections.filter((section) => section.aiAssist).length
    const readyTeams = teams.filter((team) => team.owner && team.email).length

    return [
      {
        id: 'sections',
        label: 'Sections',
        value: sections.length,
        icon: Layers,
        tone: 'primary'
      },
      {
        id: 'required',
        label: 'Required Sections',
        value: requiredSections,
        icon: FileText,
        tone: 'success'
      },
      {
        id: 'teams',
        label: 'Teams Assigned',
        value: readyTeams,
        icon: Users,
        tone: 'info'
      },
      {
        id: 'ai',
        label: 'AI Assisted',
        value: aiEnabledSections,
        icon: Bot,
        tone: 'warning'
      }
    ]
  }, [sections, teams])

  const validate = () => {
    const nextErrors = {}

    if (!metadata.rfpTitle.trim()) nextErrors.rfpTitle = 'RFP title is required'
    if (!metadata.rfpNumber.trim()) nextErrors.rfpNumber = 'RFP number is required'
    if (!metadata.issueDate) nextErrors.issueDate = 'Issue date is required'
    if (!metadata.submissionDeadline) nextErrors.submissionDeadline = 'Submission deadline is required'
    if (!metadata.summary.trim()) nextErrors.summary = 'RFP summary is required'
    if (sections.length === 0) nextErrors.sections = 'At least one section is required'
    if (teams.length === 0) nextErrors.teams = 'At least one team assignment is required'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const insightItems = useMemo(() => {
    const items = []
    if (sections.length > 0) {
      items.push({
        title: `${sections.length} sections configured with ${teams.length} team assignments`,
        detail: metadata.rfpTitle ? `Draft: "${metadata.rfpTitle.slice(0, 48)}${metadata.rfpTitle.length > 48 ? '…' : ''}"` : 'Add a title and metadata to anchor the published package.',
        tone: 'info'
      })
    }
    if (metadata.submissionDeadline && metadata.issueDate) {
      items.push({
        title: 'Timeline captured for issuer and submission deadlines',
        detail: 'Validate envelopes and response mode before routing to publish.',
        tone: 'success'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Start with metadata and a first section',
        detail: 'Sections and SLAs keep contributors aligned before AI-assisted drafting.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [sections.length, teams.length, metadata.rfpTitle, metadata.issueDate, metadata.submissionDeadline])

  const handleSaveDraft = () => {
    setIsDraftSaved(true)
    toast.success('RFP draft saved successfully')
  }

  const handleGenerateWithAI = () => {
    toast.info('AI generation workflow will be wired in AI Copilot module')
  }

  const handleSubmitForPublish = () => {
    if (!validate()) {
      toast.error('Please complete required RFP details before publishing')
      return
    }

    toast.success('RFP validated and moved to Publish RFP workflow')
    navigate('/rfp-management/publish')
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="create-rfp-page page-enter"
        breadcrumbs={[
          { label: 'RFP Management', onClick: () => navigate('/rfp-management') },
          { label: 'Create RFP', active: true }
        ]}
        onBack={() => navigate('/rfp-management')}
        title="Create RFP command center"
        description="Build an RFP with structured sections, team ownership, and AI-assisted drafting."
        heroMeta="Structured procurement workspace"
        outlookTitle="RFP readiness outlook"
        outlookDescription={`${sections.length} sections and ${teams.length} team rows — metadata ${metadata.rfpTitle ? 'in progress' : 'pending'}.`}
        outlookChips={[
          `${sections.length} sections`,
          `${teams.filter((t) => t.owner && t.email).length} teams ready`,
          metadata.responseMode || 'Two Envelope',
          metadata.currency || 'INR'
        ]}
        insights={insightItems}
        kpiTitle="Composition signal board"
        kpiMeta="Sections, coverage, and AI assist"
        kpiContent={(
          <Row className="mb-4 g-3">
            {dashboardStats.map((card) => {
              const Icon = card.icon
              return (
                <Col key={card.id} xs={12} sm={6} xl={3}>
                  <PremiumKpiCard
                    label={card.label}
                    value={card.value}
                    hint={card.id === 'sections' ? 'Planned RFP structure' : card.id === 'required' ? 'Mandatory responses' : card.id === 'teams' ? 'Owners with contact' : 'Sections with copilot'}
                    tone={card.tone}
                    trend={card.id === 'sections' ? 'Structure' : card.id === 'required' ? 'Compliance' : card.id === 'teams' ? 'Coverage' : 'Assist'}
                    icon={<Icon size={20} />}
                  />
                </Col>
              )
            })}
          </Row>
        )}
        tableTitle="RFP builder"
      >

        {isDraftSaved && (
          <Row className="mb-3">
            <Col>
              <Alert variant="success" className="mb-0">
                Draft was saved. Continue editing and publish when ready.
              </Alert>
            </Col>
          </Row>
        )}

        {(errors.sections || errors.teams) && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger" className="mb-0">
                {errors.sections || errors.teams}
              </Alert>
            </Col>
          </Row>
        )}

        <Row className="g-4">
          <Col xl={8}>
            <Card className="content-card rfp-card">
              <Card.Header className="rfp-card-header">
                <h5 className="mb-1">RFP Metadata</h5>
                <p className="text-muted mb-0">Capture business details and response timeline for this RFP.</p>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>RFP Title *</Form.Label>
                      <Form.Control
                        type="text"
                        value={metadata.rfpTitle}
                        onChange={(event) => updateMetadata('rfpTitle', event.target.value)}
                        isInvalid={Boolean(errors.rfpTitle)}
                        placeholder="Industrial automation services RFP"
                      />
                      <Form.Control.Feedback type="invalid">{errors.rfpTitle}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>RFP Number *</Form.Label>
                      <Form.Control
                        type="text"
                        value={metadata.rfpNumber}
                        onChange={(event) => updateMetadata('rfpNumber', event.target.value)}
                        isInvalid={Boolean(errors.rfpNumber)}
                        placeholder="RFP-2026-001"
                      />
                      <Form.Control.Feedback type="invalid">{errors.rfpNumber}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Business Unit</Form.Label>
                      <Form.Control
                        type="text"
                        value={metadata.businessUnit}
                        onChange={(event) => updateMetadata('businessUnit', event.target.value)}
                        placeholder="Energy"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={metadata.category}
                        onChange={(event) => updateMetadata('category', event.target.value)}
                      >
                        <option value="">Select category</option>
                        <option value="Goods">Goods</option>
                        <option value="Services">Services</option>
                        <option value="Works">Works</option>
                        <option value="Consulting">Consulting</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Issue Date *</Form.Label>
                      <Form.Control
                        type="date"
                        value={metadata.issueDate}
                        onChange={(event) => updateMetadata('issueDate', event.target.value)}
                        isInvalid={Boolean(errors.issueDate)}
                      />
                      <Form.Control.Feedback type="invalid">{errors.issueDate}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Submission Deadline *</Form.Label>
                      <Form.Control
                        type="date"
                        value={metadata.submissionDeadline}
                        onChange={(event) => updateMetadata('submissionDeadline', event.target.value)}
                        isInvalid={Boolean(errors.submissionDeadline)}
                      />
                      <Form.Control.Feedback type="invalid">{errors.submissionDeadline}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Currency</Form.Label>
                      <Form.Select
                        value={metadata.currency}
                        onChange={(event) => updateMetadata('currency', event.target.value)}
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estimated Budget</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={metadata.estimatedBudget}
                        onChange={(event) => updateMetadata('estimatedBudget', event.target.value)}
                        placeholder="2500000"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Response Mode</Form.Label>
                      <Form.Select
                        value={metadata.responseMode}
                        onChange={(event) => updateMetadata('responseMode', event.target.value)}
                      >
                        <option value="Single Envelope">Single Envelope</option>
                        <option value="Two Envelope">Two Envelope</option>
                        <option value="Two Stage">Two Stage</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-0">
                  <Form.Label>RFP Summary *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={metadata.summary}
                    onChange={(event) => updateMetadata('summary', event.target.value)}
                    isInvalid={Boolean(errors.summary)}
                    placeholder="Provide a concise overview of objective, expected outcomes, and contract period."
                  />
                  <Form.Control.Feedback type="invalid">{errors.summary}</Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>

            <div className="mt-4">
              <RFPSectionBuilder
                sections={sections}
                onAdd={() => setSections((prev) => [...prev, createNewSection()])}
                onRemove={(id) => setSections((prev) => prev.filter((section) => section.id !== id))}
                onUpdate={updateSection}
              />
            </div>

            <div className="mt-4">
              <RFPTeamAssignments
                teams={teams}
                onAdd={() => setTeams((prev) => [...prev, createNewTeam()])}
                onRemove={(id) => setTeams((prev) => prev.filter((team) => team.id !== id))}
                onUpdate={updateTeam}
              />
            </div>
          </Col>

          <Col xl={4}>
            <Card className="content-card rfp-card sticky-summary">
              <Card.Header className="rfp-card-header">
                <h5 className="mb-1">RFP Readiness</h5>
                <p className="text-muted mb-0">Quick summary before publishing.</p>
              </Card.Header>
              <Card.Body>
                <div className="summary-item">
                  <span>Metadata</span>
                  <Badge bg={metadata.rfpTitle && metadata.rfpNumber ? 'success' : 'secondary'}>
                    {metadata.rfpTitle && metadata.rfpNumber ? 'Ready' : 'Pending'}
                  </Badge>
                </div>
                <div className="summary-item">
                  <span>Timeline</span>
                  <Badge bg={metadata.issueDate && metadata.submissionDeadline ? 'success' : 'secondary'}>
                    {metadata.issueDate && metadata.submissionDeadline ? 'Ready' : 'Pending'}
                  </Badge>
                </div>
                <div className="summary-item">
                  <span>Sections</span>
                  <Badge bg={sections.length > 0 ? 'success' : 'secondary'}>
                    {sections.length} configured
                  </Badge>
                </div>
                <div className="summary-item">
                  <span>Teams</span>
                  <Badge bg={teams.length > 0 ? 'success' : 'secondary'}>
                    {teams.length} assigned
                  </Badge>
                </div>

                <Alert variant="info" className="mt-3 mb-0">
                  <CalendarClock size={16} className="me-2" />
                  Set reminder cadence after publish from the Tracking module.
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <div className="action-bar">
              <Button variant="outline-secondary" onClick={handleSaveDraft}>
                <Save size={16} className="me-2" />
                Save Draft
              </Button>
              <Button variant="outline-primary" onClick={handleGenerateWithAI}>
                <Bot size={16} className="me-2" />
                Generate with AI
              </Button>
              <Button variant="primary" onClick={handleSubmitForPublish}>
                <Send size={16} className="me-2" />
                Validate & Move to Publish
              </Button>
            </div>
          </Col>
        </Row>
      </ExecutiveCommandCenter>
    </>
  )
}

export default CreateRFP
