import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Button, Alert, Card } from 'react-bootstrap'
import { respondAPI } from '../../services/respondAPI'

const RespondRedeemPage = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const t = params.get('token')
    if (t) setToken(t)
  }, [params])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const res = await respondAPI.redeem(token.trim())
      const rfpId = res.data?.data?.issuedRfp?.id
      if (rfpId) navigate(`/respond/rfp/${rfpId}`)
      else navigate('/respond/inbox')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not redeem invitation')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h1 className="h5 mb-3" style={{ color: '#345c8e' }}>
        Redeem invitation
      </h1>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <p className="small text-muted">
            Paste the token from your invitation link (logged in as the invited email).
          </p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Invitation token</Form.Label>
              <Form.Control
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token"
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={busy}>
              {busy ? 'Working…' : 'Redeem'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default RespondRedeemPage
