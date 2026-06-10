import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { issuedRfpAPI } from '../../services/issuedRfpAPI'

const IssuedRfpNewPage = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    submissionDeadline: '',
    reference: '',
    termsBody: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const body = {
        title: form.title.trim(),
        description: form.description.trim(),
        submissionDeadline: form.submissionDeadline,
        reference: form.reference.trim() || undefined,
        termsAndConditions: {
          version: '1.0',
          body: form.termsBody,
          required: true
        }
      }
      const res = await issuedRfpAPI.create(body)
      const id = res.data?.data?.issuedRfp?.id
      if (id) navigate(`/issued-rfps/${id}`)
      else navigate('/issued-rfps')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create draft')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-enter">
      <h1 className="h4 mb-3" style={{ color: '#345c8e' }}>
        New issued RFP
      </h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Supply of surgical instruments"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reference (optional)</Form.Label>
              <Form.Control
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="Auto-generated if empty"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Submission deadline</Form.Label>
              <Form.Control
                name="submissionDeadline"
                type="datetime-local"
                value={form.submissionDeadline}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Terms &amp; conditions (shown to participants)</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="termsBody"
                value={form.termsBody}
                onChange={handleChange}
                placeholder="Participants must accept before submitting."
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save draft'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default IssuedRfpNewPage
