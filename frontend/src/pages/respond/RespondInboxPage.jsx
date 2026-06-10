import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Spinner, Alert, Badge } from 'react-bootstrap'
import { respondAPI } from '../../services/respondAPI'

const RespondInboxPage = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await respondAPI.listInvitations()
        const list = res.data?.data?.invitations ?? []
        if (!cancelled) setRows(list)
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || 'Failed to load inbox')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="h4 mb-3" style={{ color: '#345c8e' }}>
        Invitations
      </h1>
      <p className="text-muted small">
        RFPs you have been invited to (by email). Redeem an invitation link first if needed.
      </p>
      {error && <Alert variant="danger">{error}</Alert>}
      {rows.map((row) => (
        <Card key={row.id} className="border-0 shadow-sm mb-2">
          <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <div className="fw-semibold">{row.issuedRfp?.title || 'RFP'}</div>
              <div className="small text-muted">{row.issuerCompany}</div>
              <Badge bg="secondary" className="mt-1">
                {row.status}
              </Badge>
            </div>
            {row.issuedRfp?.id && row.status === 'accepted' && (
              <Link to={`/respond/rfp/${row.issuedRfp.id}`} className="btn btn-sm btn-primary">
                Open
              </Link>
            )}
          </Card.Body>
        </Card>
      ))}
      {rows.length === 0 && !error && (
        <p className="text-muted">No invitations yet. Use your redeem link from the buyer.</p>
      )}
    </div>
  )
}

export default RespondInboxPage
