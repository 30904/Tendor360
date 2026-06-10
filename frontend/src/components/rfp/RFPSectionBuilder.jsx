import React from 'react'
import { Card, Row, Col, Form, Button, Badge } from 'react-bootstrap'
import { Plus, Trash2, Brain } from 'lucide-react'

const sectionTypes = [
  'Executive Summary',
  'Scope of Work',
  'Technical Requirements',
  'Commercial Terms',
  'Evaluation Criteria',
  'Legal & Compliance'
]

const RFPSectionBuilder = ({ sections, onAdd, onRemove, onUpdate }) => {
  return (
    <Card className="content-card rfp-card">
      <Card.Header className="rfp-card-header d-flex align-items-center justify-content-between">
        <div>
          <h5 className="mb-1">Section Builder</h5>
          <p className="text-muted mb-0">Define sections and ownership for multi-team collaboration.</p>
        </div>
        <Button size="sm" variant="outline-primary" onClick={onAdd}>
          <Plus size={14} className="me-1" />
          Add Section
        </Button>
      </Card.Header>
      <Card.Body>
        {sections.length === 0 ? (
          <p className="text-muted mb-0">No sections added yet.</p>
        ) : (
          <div className="rfp-list">
            {sections.map((section, index) => (
              <div className="rfp-list-item" key={section.id}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="mb-0">Section {index + 1}</h6>
                  <div className="d-flex align-items-center gap-2">
                    {section.aiAssist && (
                      <Badge bg="info" className="d-flex align-items-center">
                        <Brain size={12} className="me-1" />
                        AI
                      </Badge>
                    )}
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-danger"
                      onClick={() => onRemove(section.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Section Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={section.title}
                        onChange={(event) => onUpdate(section.id, 'title', event.target.value)}
                        placeholder="Enter section name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Section Type</Form.Label>
                      <Form.Select
                        value={section.type}
                        onChange={(event) => onUpdate(section.id, 'type', event.target.value)}
                      >
                        <option value="">Select type</option>
                        {sectionTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Section Owner</Form.Label>
                      <Form.Control
                        type="text"
                        value={section.owner}
                        onChange={(event) => onUpdate(section.id, 'owner', event.target.value)}
                        placeholder="Owner name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Due Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={section.dueDate}
                        onChange={(event) => onUpdate(section.id, 'dueDate', event.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex flex-wrap gap-4">
                  <Form.Check
                    type="switch"
                    id={`required-${section.id}`}
                    label="Required section"
                    checked={section.required}
                    onChange={(event) => onUpdate(section.id, 'required', event.target.checked)}
                  />
                  <Form.Check
                    type="switch"
                    id={`ai-assist-${section.id}`}
                    label="AI-assisted drafting"
                    checked={section.aiAssist}
                    onChange={(event) => onUpdate(section.id, 'aiAssist', event.target.checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default RFPSectionBuilder
