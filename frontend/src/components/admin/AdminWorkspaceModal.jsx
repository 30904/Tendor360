import React, { useEffect, useRef, useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'

const EMPTY_INITIAL_VALUES = Object.freeze({})

const buildFormState = (fields, initialValues) => {
  const next = {}
  fields.forEach((field) => {
    next[field.name] = initialValues[field.name] ?? field.defaultValue ?? ''
  })
  return next
}

const AdminWorkspaceModal = ({
  show,
  onHide,
  title,
  description,
  submitLabel = 'Submit',
  fields = [],
  initialValues = EMPTY_INITIAL_VALUES,
  onSubmit
}) => {
  const [form, setForm] = useState({})
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (show && !wasOpenRef.current) {
      setForm(buildFormState(fields, initialValues))
    }
    wasOpenRef.current = show
  }, [show, fields, initialValues])

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal show={show} onHide={onHide} centered enforceFocus={false}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {description ? <p className="text-muted">{description}</p> : null}
          {fields.map((field) => (
            <Form.Group className="mb-3" key={field.name}>
              <Form.Label>
                {field.label}
                {field.required ? ' *' : ''}
              </Form.Label>
              {field.type === 'textarea' ? (
                <Form.Control
                  as="textarea"
                  rows={field.rows || 3}
                  value={form[field.name] ?? ''}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : field.type === 'select' ? (
                <Form.Select
                  value={form[field.name] ?? ''}
                  required={field.required}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {(field.options || []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  type={field.type || 'text'}
                  value={form[field.name] ?? ''}
                  placeholder={field.placeholder}
                  required={field.required}
                  min={field.min}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {submitLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AdminWorkspaceModal
