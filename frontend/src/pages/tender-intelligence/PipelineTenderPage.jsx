import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Breadcrumb, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { ArrowLeft, Edit, Save, Target, ExternalLink } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAltF1TestFill } from '../../hooks/useAltF1TestFill'
import { dummyPipelineTenderForm } from '../../utils/testFormDummies'
import tenderAPI from '../../services/tenderAPI'
import PipelineTenderForm from './PipelineTenderForm'
import {
  emptyPipelineTenderForm,
  formatPipelineCurrency,
  formatPipelineDate,
  formatPipelineLabel,
  mapTenderToForm,
  validatePipelineTenderForm
} from './pipelineTenderUtils'
import './PipelineTenderPage.scss'

const DetailField = ({ label, value }) => (
  <div className="pipeline-tender-detail__field">
    <span className="pipeline-tender-detail__label">{label}</span>
    <div className="pipeline-tender-detail__value">{value}</div>
  </div>
)

const PipelineTenderPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { tenderId } = useParams()
  const isCreate = location.pathname.endsWith('/new')
  const isEdit = location.pathname.endsWith('/edit')
  const isView = !isCreate && !isEdit

  const [tender, setTender] = useState(location.state?.tender || null)
  const [formData, setFormData] = useState(emptyPipelineTenderForm())
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(!isCreate)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useAltF1TestFill(isCreate || isEdit, () => {
    setFormData(dummyPipelineTenderForm())
    setFormErrors({})
  })

  useEffect(() => {
    if (isCreate) {
      setFormData(emptyPipelineTenderForm())
      setLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const response = await tenderAPI.getTenderById(tenderId)
        if (!response.success) {
          throw new Error(response.message || 'Failed to load tender')
        }
        const record = response.data?.tender || response.data
        if (!cancelled) {
          setTender(record)
          if (isEdit) {
            setFormData(mapTenderToForm(record))
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Failed to load tender')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isCreate, isEdit, tenderId])

  const pageTitle = useMemo(() => {
    if (isCreate) return 'Create tender'
    if (isEdit) return 'Edit tender'
    return tender?.title || 'Tender details'
  }, [isCreate, isEdit, tender?.title])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const errors = validatePipelineTenderForm(formData)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSaving(true)
    setError('')
    try {
      const response = isCreate
        ? await tenderAPI.createTender(formData)
        : await tenderAPI.updateTender(tenderId, formData)

      if (!response.success) {
        throw new Error(response.message || `Failed to ${isCreate ? 'create' : 'update'} tender`)
      }

      navigate('/tender-intelligence/pipeline', {
        state: {
          success: isCreate ? 'Tender created successfully' : 'Tender updated successfully'
        }
      })
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to ${isCreate ? 'create' : 'update'} tender`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="pipeline-tender-page page-enter page-bg-gradient intel-executive-page">
        <Container fluid className="py-4">
          <div className="intel-loading-skeleton mb-3" />
          <div className="intel-loading-skeleton" style={{ minHeight: 420 }} />
        </Container>
      </div>
    )
  }

  return (
    <div className="pipeline-tender-page page-enter page-bg-gradient intel-executive-page">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => navigate('/tender-intelligence')} style={{ cursor: 'pointer' }}>
                Tender Intelligence
              </Breadcrumb.Item>
              <Breadcrumb.Item onClick={() => navigate('/tender-intelligence/pipeline')} style={{ cursor: 'pointer' }}>
                Pipeline
              </Breadcrumb.Item>
              <Breadcrumb.Item active>{isCreate ? 'New tender' : tender?.reference || 'Tender'}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className="intel-executive-page__hero mb-3">
          <div>
            <Button variant="outline-secondary" size="sm" className="mb-2" onClick={() => navigate('/tender-intelligence/pipeline')}>
              <ArrowLeft size={16} className="me-2" />
              Back to pipeline
            </Button>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <Target size={18} className="text-primary" />
              {tender?.reference ? <Badge bg="light" text="dark">{tender.reference}</Badge> : null}
              {tender?.pipelineStage ? <Badge bg="info">{formatPipelineLabel(tender.pipelineStage)}</Badge> : null}
            </div>
            <h1 className="d-flex align-items-center gap-2">
              {pageTitle}
              {tender?.discovery?.externalKey && tender.discovery.externalKey.includes('http') && (
                <a 
                  href={tender.discovery.externalKey.substring(tender.discovery.externalKey.indexOf('http'))} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-primary d-inline-flex" 
                  title="View Original Source"
                >
                  <ExternalLink size={24} />
                </a>
              )}
            </h1>
            <p>
              {isCreate
                ? 'Capture a new pursuit record with full commercial, classification, and governance context.'
                : isEdit
                  ? 'Update the pursuit record with full visibility across commercial, classification, and governance fields.'
                  : tender?.organization || 'Review the full tender record without modal constraints.'}
            </p>
          </div>
          <div className="intel-executive-page__hero-actions">
            {isView && tender ? (
              <Button variant="primary" onClick={() => navigate(`/tender-intelligence/pipeline/${tenderId}/edit`)}>
                <Edit size={16} className="me-2" />
                Edit tender
              </Button>
            ) : null}
            {!isView ? (
              <small>{isCreate ? 'New pipeline record' : 'Editing existing pursuit'}</small>
            ) : (
              <small>Read-only tender workspace</small>
            )}
          </div>
        </div>

        {error ? <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert> : null}

        {isView && tender ? (
          <Row className="g-3">
            <Col xl={8}>
              <Card className="intel-chart-card pipeline-tender-detail">
                <Card.Header className="bg-white fw-semibold">Opportunity narrative</Card.Header>
                <Card.Body>
                  <p className="pipeline-tender-detail__description">{tender.description}</p>
                </Card.Body>
              </Card>

              <Card className="intel-chart-card pipeline-tender-detail mt-3">
                <Card.Header className="bg-white fw-semibold">Identity & scope</Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}><DetailField label="Reference" value={tender.reference} /></Col>
                    <Col md={6}><DetailField label="Organization" value={tender.organization} /></Col>
                    <Col md={6}><DetailField label="Location" value={tender.location} /></Col>
                    <Col md={6}><DetailField label="Source" value={tender.source} /></Col>
                    <Col md={6}><DetailField label="Tender type" value={tender.tenderType} /></Col>
                    <Col md={6}><DetailField label="Therapeutic area" value={tender.therapeuticArea} /></Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={4}>
              <Card className="intel-chart-card pipeline-tender-detail">
                <Card.Header className="bg-white fw-semibold">Commercial profile</Card.Header>
                <Card.Body>
                  <DetailField label="Estimated value" value={formatPipelineCurrency(tender.estimatedValue, tender.currency)} />
                  <DetailField label="Deadline" value={formatPipelineDate(tender.deadline)} />
                  <DetailField label="Days remaining" value={tender.daysUntilDeadline ?? '—'} />
                </Card.Body>
              </Card>

              <Card className="intel-chart-card pipeline-tender-detail mt-3">
                <Card.Header className="bg-white fw-semibold">Pursuit governance</Card.Header>
                <Card.Body>
                  <DetailField label="Pipeline stage" value={formatPipelineLabel(tender.pipelineStage)} />
                  <DetailField label="Priority" value={formatPipelineLabel(tender.priority)} />
                  <DetailField label="Urgency" value={formatPipelineLabel(tender.urgency)} />
                  <DetailField label="Win probability" value={`${tender.winProbability || 0}%`} />
                  <DetailField label="AI match score" value={`${tender.aiMatchScore || 0}%`} />
                  <DetailField label="Owner" value={tender.owner?.name || 'Unassigned'} />
                </Card.Body>
              </Card>

              <Card className="intel-chart-card pipeline-tender-detail mt-3">
                <Card.Header className="bg-white fw-semibold">Tags</Card.Header>
                <Card.Body>
                  {tender.tags?.length ? (
                    <div className="d-flex flex-wrap gap-2">
                      {tender.tags.map((tag) => (
                        <Badge key={tag} bg="secondary">{tag}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No tags assigned</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Card className="intel-chart-card pipeline-tender-editor">
              <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
                <span className="fw-semibold">{isCreate ? 'New tender workspace' : 'Edit tender workspace'}</span>
                <div className="d-flex flex-wrap gap-2">
                  <Button variant="outline-secondary" onClick={() => navigate('/tender-intelligence/pipeline')}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? <Spinner animation="border" size="sm" className="me-2" /> : <Save size={16} className="me-2" />}
                    {isCreate ? 'Create tender' : 'Update tender'}
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <PipelineTenderForm formData={formData} formErrors={formErrors} onChange={setFormData} />
              </Card.Body>
            </Card>
          </Form>
        )}
      </Container>
    </div>
  )
}

export default PipelineTenderPage
