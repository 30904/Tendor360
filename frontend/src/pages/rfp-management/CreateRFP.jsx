import React, { useEffect, useState, useMemo } from 'react'
import { Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import { FileText, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTenders } from '../../store/slices/tenderSlice'
import { fetchEvaluations } from '../../store/slices/evaluationSlice'
import { fetchPricingScenarios } from '../../store/slices/pricingSlice'
import { createRfpResponse, fetchRfpResponses } from '../../store/slices/rfpResponseSlice'

const CreateRFP = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { tenders, loading: tendersLoading } = useSelector(state => state.tender)
  const { evaluations, loading: evalsLoading } = useSelector(state => state.evaluation)
  const { scenarios: pricingScenarios, loading: pricingLoading } = useSelector(state => state.pricing)
  const { items: existingResponses, loading: submitting } = useSelector(state => state.rfpResponse)

  const [selectedTender, setSelectedTender] = useState('')
  const [selectedEval, setSelectedEval] = useState('')
  const [selectedPricing, setSelectedPricing] = useState('')
  const [metadata, setMetadata] = useState({
    projectName: '',
    rfpNumber: '',
    submissionDeadline: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    dispatch(fetchTenders({ pagination: { limit: 100 } }))
    dispatch(fetchEvaluations({ limit: 100 }))
    dispatch(fetchPricingScenarios({ limit: 100 }))
    dispatch(fetchRfpResponses())
  }, [dispatch])

  // Filter for approved tenders
  const approvedEvaluations = useMemo(() => {
    return (evaluations || []).filter(e => e.decision === 'BID' && e.status === 'APPROVED')
  }, [evaluations])
  
  const approvedTenderIds = useMemo(() => {
    return new Set(
      approvedEvaluations.map(e => {
        const id = e.tenderId?._id || e.tenderId
        return id ? id.toString() : null
      }).filter(Boolean)
    )
  }, [approvedEvaluations])

  const eligibleTenders = useMemo(() => {
    // Get array of tender IDs that already have an RFP response
    const usedTenderIds = new Set((existingResponses || []).map(r => 
      (r.tenderId?._id || r.tenderId || '').toString()
    ));

    return (tenders || []).filter(t => {
      const tId = t.id || t._id;
      return tId && approvedTenderIds.has(tId.toString()) && !usedTenderIds.has(tId.toString())
    })
  }, [tenders, approvedTenderIds, existingResponses])

  useEffect(() => {
    console.log('DEBUG REDUX STATE:', {
      tenders,
      evaluations,
      pricingScenarios,
      approvedEvaluations,
      approvedTenderIds: Array.from(approvedTenderIds),
      eligibleTenders
    })
  }, [tenders, evaluations, pricingScenarios, approvedEvaluations, approvedTenderIds, eligibleTenders])

  // When tender changes, auto-select eval and pricing if available
  useEffect(() => {
    if (selectedTender) {
      const tenderObj = (tenders || []).find(t => (t.id || t._id) === selectedTender)
      if (tenderObj) {
        setMetadata({
          projectName: `${tenderObj.title} - Proposal`,
          rfpNumber: tenderObj.reference || tenderObj.referenceNumber || '',
          submissionDeadline: tenderObj.deadline ? new Date(tenderObj.deadline).toISOString().split('T')[0] : ''
        })
      }

      const matchingEval = approvedEvaluations.find(e => (e.tenderId?._id || e.tenderId) === selectedTender)
      if (matchingEval) setSelectedEval(matchingEval._id)

      const matchingPricing = (pricingScenarios || []).find(p => (p.tenderId?._id || p.tenderId) === selectedTender && p.status === 'APPROVED')
      if (matchingPricing) setSelectedPricing(matchingPricing._id)
    } else {
      setSelectedEval('')
      setSelectedPricing('')
      setMetadata({ projectName: '', rfpNumber: '', submissionDeadline: '' })
    }
  }, [selectedTender, tenders, approvedEvaluations, pricingScenarios])

  const validate = () => {
    const nextErrors = {}
    if (!selectedTender) nextErrors.tender = 'You must select an approved tender'
    if (!metadata.projectName.trim()) nextErrors.projectName = 'Project name is required'
    if (!metadata.submissionDeadline) nextErrors.submissionDeadline = 'Submission deadline is required'
    
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleCreateWorkspace = async () => {
    if (!validate()) return

    try {
      const action = await dispatch(createRfpResponse({
        tenderId: selectedTender,
        evaluationId: selectedEval || null,
        pricingId: selectedPricing || null,
        projectName: metadata.projectName,
        rfpNumber: metadata.rfpNumber,
        submissionDeadline: metadata.submissionDeadline
      })).unwrap()

      toast.success('Response workspace created successfully')
      navigate(`/rfp-management/editor/${action.rfpResponse._id}`)
    } catch (err) {
      toast.error(err || 'Failed to create workspace')
    }
  }

  if (tendersLoading || evalsLoading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>
  }

  return (
    <ExecutiveCommandCenter
      className="create-rfp-page page-enter"
      breadcrumbs={[
        { label: 'RFP Management', onClick: () => navigate('/rfp-management') },
        { label: 'Create Response Workspace', active: true }
      ]}
      onBack={() => navigate('/rfp-management')}
      title="Initialize Proposal Workspace"
      description="Select an approved tender to begin drafting your proposal response. The AI Copilot will use the tender details, evaluation, and pricing model to generate accurate content."
    >
      <Row className="justify-content-center">
        <Col xl={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom pt-4 pb-3">
              <div className="d-flex align-items-center">
                <FileText className="text-primary me-2" size={24} />
                <h5 className="mb-0">Link Source Data</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              
              {errors.tender && <Alert variant="danger">{errors.tender}</Alert>}

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Select Approved Tender <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  value={selectedTender} 
                  onChange={e => setSelectedTender(e.target.value)}
                  isInvalid={!!errors.tender}
                  size="lg"
                >
                  <option value="">-- Choose a tender --</option>
                  {eligibleTenders.map(t => (
                    <option key={t.id || t._id} value={t.id || t._id}>{t.reference || t.referenceNumber} - {t.title} ({t.organization})</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Only tenders that have passed the Bid/No-Bid qualification phase are shown here.
                </Form.Text>
              </Form.Group>

              {selectedTender && (
                <div className="bg-light p-3 rounded mb-4 border">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted small mb-1">Linked Qualification</Form.Label>
                        <Form.Control 
                          disabled 
                          value={selectedEval ? 'Qualification Approved' : 'No Qualification Found'} 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted small mb-1">Linked Pricing Scenario</Form.Label>
                        <Form.Select 
                          value={selectedPricing} 
                          onChange={e => setSelectedPricing(e.target.value)}
                        >
                          <option value="">None / Pending</option>
                          {pricingScenarios
                            .filter(p => (p.tenderId?._id || p.tenderId) === selectedTender)
                            .map(p => (
                            <option key={p._id} value={p._id}>{p.name} (Margin: {p.totals?.marginPercentage?.toFixed(1)}%)</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              <hr className="my-4" />
              <h6 className="mb-3">Project Metadata</h6>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={metadata.projectName}
                      onChange={e => setMetadata({...metadata, projectName: e.target.value})}
                      isInvalid={!!errors.projectName}
                    />
                    <Form.Control.Feedback type="invalid">{errors.projectName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Client RFP Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={metadata.rfpNumber}
                      onChange={e => setMetadata({...metadata, rfpNumber: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Submission Deadline <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="date"
                      value={metadata.submissionDeadline}
                      onChange={e => setMetadata({...metadata, submissionDeadline: e.target.value})}
                      isInvalid={!!errors.submissionDeadline}
                    />
                    <Form.Control.Feedback type="invalid">{errors.submissionDeadline}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleCreateWorkspace}
                  disabled={submitting || !selectedTender}
                >
                  {submitting ? <Spinner size="sm" className="me-2" /> : null}
                  Create Workspace <ChevronRight size={18} className="ms-1" />
                </Button>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </ExecutiveCommandCenter>
  )
}

export default CreateRFP
