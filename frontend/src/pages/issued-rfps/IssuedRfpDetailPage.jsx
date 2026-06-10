import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Button,
  Card,
  Form,
  Table,
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap'
import { issuedRfpAPI } from '../../services/issuedRfpAPI'

const IssuedRfpDetailPage = () => {
  const { id } = useParams()
  const [rfp, setRfp] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteResult, setInviteResult] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    const [rRes, sRes] = await Promise.all([
      issuedRfpAPI.getById(id),
      issuedRfpAPI.listSubmissions(id).catch(() => ({ data: { data: { submissions: [] } } }))
    ])
    setRfp(rRes.data?.data?.issuedRfp ?? null)
    setSubmissions(sRes.data?.data?.submissions ?? [])
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await load()
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const handlePublish = async () => {
    setBusy(true)
    setError(null)
    try {
      await issuedRfpAPI.publish(id)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Publish failed')
    } finally {
      setBusy(false)
    }
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    setBusy(true)
    setInviteResult(null)
    setError(null)
    try {
      const res = await issuedRfpAPI.createInvitation(id, { email: inviteEmail })
      setInviteResult(res.data?.data?.invitation ?? null)
      setInviteEmail('')
    } catch (e) {
      setError(e.response?.data?.message || 'Invitation failed')
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
    return <Alert variant="warning">Issued RFP not found.</Alert>
  }

  const isDraft = rfp.status === 'draft'

  return (
    <div className="page-enter">
      <div className="mb-3">
        <Link to="/issued-rfps" className="small">
          ← Back to list
        </Link>
      </div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <div>
          <h1 className="h4 mb-1" style={{ color: '#345c8e' }}>
            {rfp.title}
          </h1>
          <div className="text-muted small">
            {rfp.reference} ·{' '}
            <Badge bg={rfp.status === 'published' ? 'success' : 'secondary'}>{rfp.status}</Badge>
          </div>
        </div>
        {isDraft && (
          <Button variant="primary" size="sm" onClick={handlePublish} disabled={busy}>
            Publish
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm mb-3">
        <Card.Body>
          <p className="mb-2">{rfp.description || '—'}</p>
          <p className="small text-muted mb-0">
            Submission deadline:{' '}
            {rfp.submissionDeadline
              ? new Date(rfp.submissionDeadline).toLocaleString()
              : '—'}
          </p>
          {rfp.termsAndConditions?.body ? (
            <div className="mt-3 small border rounded p-2 bg-light">
              <strong>Terms (v{rfp.termsAndConditions.version})</strong>
              <pre className="mb-0 mt-1" style={{ whiteSpace: 'pre-wrap' }}>
                {rfp.termsAndConditions.body}
              </pre>
            </div>
          ) : null}
        </Card.Body>
      </Card>

      {!isDraft && (
        <Card className="border-0 shadow-sm mb-3">
          <Card.Header className="bg-white fw-semibold">Invite participant</Card.Header>
          <Card.Body>
            <Form onSubmit={handleInvite} className="d-flex flex-wrap gap-2 align-items-end">
              <Form.Group>
                <Form.Label className="small">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="supplier@company.com"
                  required
                  style={{ minWidth: '240px' }}
                />
              </Form.Group>
              <Button type="submit" variant="outline-primary" size="sm" disabled={busy}>
                Send invitation
              </Button>
            </Form>
            {inviteResult?.rawToken && (
              <Alert variant="info" className="mt-3 mb-0 small">
                <strong>Development:</strong> share redeem link{' '}
                <code>
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}${inviteResult.redeemPath}`
                    : inviteResult.redeemPath}
                </code>{' '}
                or raw token once.
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {!isDraft && (
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white fw-semibold">Submissions</Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-muted text-center py-3">
                      No submissions yet.
                    </td>
                  </tr>
                ) : (
                  submissions.map((s) => (
                    <tr key={s.id}>
                      <td>{s.supplierCompanyName || '—'}</td>
                      <td>
                        <Badge bg={s.status === 'submitted' ? 'primary' : 'secondary'}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="small">
                        {s.submittedAt
                          ? new Date(s.submittedAt).toLocaleString()
                          : new Date(s.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}

export default IssuedRfpDetailPage
