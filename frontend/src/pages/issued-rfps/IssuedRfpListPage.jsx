import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Table, Spinner, Alert } from 'react-bootstrap'
import TableActionsCell from '../../components/TableActionsCell'
import { buildTableActions, runTableAction } from '../../utils/tableActions'
import { issuedRfpAPI } from '../../services/issuedRfpAPI'

const IssuedRfpListPage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await issuedRfpAPI.list()
        const list = res.data?.data?.issuedRfps ?? []
        if (!cancelled) setItems(list)
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || 'Failed to load')
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
    <div className="page-enter">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h1 className="h4 mb-0" style={{ color: '#345c8e' }}>
            Issued RFPs
          </h1>
          <p className="text-muted small mb-0">
            Publish sourcing events and invite suppliers.
          </p>
        </div>
        <Button as={Link} to="/issued-rfps/new" variant="primary" size="sm">
          New issued RFP
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Reference</th>
                <th>Title</th>
                <th>Status</th>
                <th>Deadline</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted text-center py-4">
                    No issued RFPs yet. Create one to invite participants.
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-semibold">{r.reference}</td>
                    <td>{r.title}</td>
                    <td>
                      <span className="badge bg-secondary text-uppercase">{r.status}</span>
                    </td>
                    <td className="small">
                      {r.submissionDeadline
                        ? new Date(r.submissionDeadline).toLocaleString()
                        : '—'}
                    </td>
                    <td className="table-actions-col">
                      <TableActionsCell
                        actions={buildTableActions({ onView: true })}
                        onAction={(action) =>
                          runTableAction(action, r, {
                            onView: () => navigate(`/issued-rfps/${r.id}`)
                          })
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  )
}

export default IssuedRfpListPage
