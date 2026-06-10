import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap'
import { respondAPI } from '../../services/respondAPI'

const RespondRfpPage = () => {
  const { id } = useParams()
  const [rfp, setRfp] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [proposalText, setProposalText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const loadAll = async () => {
    const rRes = await respondAPI.getIssuedRfp(id)
    setRfp(rRes.data?.data?.issuedRfp ?? null)
    const sRes = await respondAPI.getSubmission(id)
    const sub = sRes.data?.data?.submission
    setSubmission(sub)
    setProposalText(sub?.proposalText || '')
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await loadAll()
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.message || 'Failed to load')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleAcceptTerms = async () => {
    setBusy(true)
    setError(null)
    try {
      await respondAPI.acceptTerms(id, rfp?.termsAndConditions?.version || '1.0')
      await loadAll()
    } catch (e) {
      setError(e.response?.data?.message || 'Could not accept terms')
    } finally {
      setBusy(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!submission?.id) return
    setBusy(true)
    setError(null)
    try {
      await respondAPI.updateSubmission(submission.id, { proposalText })
      await loadAll()
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const handleSubmitFinal = async () => {
    if (!submission?.id) return
    setBusy(true)
    setError(null)
    try {
      await respondAPI.submitProposal(submission.id)
      await loadAll()
    } catch (e) {
      setError(e.response?.data?.message || 'Submit failed')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (!rfp) {
    return <Alert variant="warning">RFP not available.</Alert>
  }

  const termsRequired = rfp.termsAndConditions?.required

  return (
    <div>
      <div className="mb-2">
        <Badge bg="info">{rfp.reference}</Badge>
      </div>
      <h1 className="h4 mb-2" style={{ color: '#345c8e' }}>
        {rfp.title}
      </h1>
      <p className="text-muted small">
        Deadline: {new Date(rfp.submissionDeadline).toLocaleString()}
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm mb-3">
        <Card.Body>
          <p className="mb-2">{rfp.description}</p>
          {rfp.termsAndConditions?.body ? (
            <div className="small border rounded p-2 bg-light mb-2">
              <strong>Terms v{rfp.termsAndConditions.version}</strong>
              <pre className="mb-0 mt-1" style={{ whiteSpace: 'pre-wrap' }}>
                {rfp.termsAndConditions.body}
              </pre>
              {termsRequired && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mt-2"
                  onClick={handleAcceptTerms}
                  disabled={busy}
                >
                  Accept terms
                </Button>
              )}
            </div>
          ) : null}
        </Card.Body>
      </Card>

      {submission && (
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <span className="fw-semibold">Your proposal</span>
            <Badge bg={submission.status === 'submitted' ? 'success' : 'secondary'}>
              {submission.status}
            </Badge>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Proposal</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
                disabled={submission.status !== 'draft'}
              />
            </Form.Group>
            {submission.status === 'draft' && (
              <div className="d-flex gap-2 flex-wrap">
                <Button variant="primary" size="sm" onClick={handleSaveDraft} disabled={busy}>
                  Save draft
                </Button>
                <Button variant="success" size="sm" onClick={handleSubmitFinal} disabled={busy}>
                  Submit proposal
                </Button>
              </div>
            )}
            {submission.status === 'submitted' && submission.submittedAt && (
              <p className="small text-success mb-0">
                Submitted at {new Date(submission.submittedAt).toLocaleString()}
              </p>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  )
}

export default RespondRfpPage
