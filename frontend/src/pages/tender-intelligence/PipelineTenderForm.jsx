import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'

const PipelineTenderForm = ({ formData, formErrors, onChange }) => {
  const setField = (field) => (event) => {
    const value = event.target.type === 'number' ? Number(event.target.value) : event.target.value
    onChange((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="pipeline-tender-form">
      <section className="pipeline-tender-form__section">
        <h2>Identity & scope</h2>
        <p className="pipeline-tender-form__section-copy">Core identifiers and the opportunity narrative.</p>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Reference *</Form.Label>
              <Form.Control
                type="text"
                value={formData.reference}
                onChange={setField('reference')}
                placeholder="Enter tender reference"
                isInvalid={!!formErrors.reference}
              />
              <Form.Control.Feedback type="invalid">{formErrors.reference}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={setField('title')}
                placeholder="Enter tender title"
                isInvalid={!!formErrors.title}
              />
              <Form.Control.Feedback type="invalid">{formErrors.title}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Organization *</Form.Label>
              <Form.Control
                type="text"
                value={formData.organization}
                onChange={setField('organization')}
                placeholder="Enter organization name"
                isInvalid={!!formErrors.organization}
              />
              <Form.Control.Feedback type="invalid">{formErrors.organization}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Location *</Form.Label>
              <Form.Control
                type="text"
                value={formData.location}
                onChange={setField('location')}
                placeholder="Enter location"
                isInvalid={!!formErrors.location}
              />
              <Form.Control.Feedback type="invalid">{formErrors.location}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={formData.description}
                onChange={setField('description')}
                placeholder="Enter tender description"
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </section>

      <section className="pipeline-tender-form__section">
        <h2>Commercial profile</h2>
        <p className="pipeline-tender-form__section-copy">Value, currency, and submission deadline.</p>
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Estimated value *</Form.Label>
              <Form.Control
                type="number"
                value={formData.estimatedValue}
                onChange={setField('estimatedValue')}
                placeholder="Enter estimated value"
                isInvalid={!!formErrors.estimatedValue}
              />
              <Form.Control.Feedback type="invalid">{formErrors.estimatedValue}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Currency</Form.Label>
              <Form.Select value={formData.currency} onChange={setField('currency')}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="INR">INR</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Deadline *</Form.Label>
              <Form.Control
                type="date"
                value={formData.deadline}
                onChange={setField('deadline')}
                isInvalid={!!formErrors.deadline}
              />
              <Form.Control.Feedback type="invalid">{formErrors.deadline}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </section>

      <section className="pipeline-tender-form__section">
        <h2>Classification</h2>
        <p className="pipeline-tender-form__section-copy">Tender type, therapeutic area, and source attribution.</p>
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tender type *</Form.Label>
              <Form.Select
                value={formData.tenderType}
                onChange={setField('tenderType')}
                isInvalid={!!formErrors.tenderType}
              >
                <option value="">Select tender type</option>
                <option value="Public Procurement">Public Procurement</option>
                <option value="Hospital Tender">Hospital Tender</option>
                <option value="Government RFP">Government RFP</option>
                <option value="Private Tender">Private Tender</option>
                <option value="Framework Agreement">Framework Agreement</option>
                <option value="Supply Agreement">Supply Agreement</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{formErrors.tenderType}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Therapeutic area *</Form.Label>
              <Form.Select
                value={formData.therapeuticArea}
                onChange={setField('therapeuticArea')}
                isInvalid={!!formErrors.therapeuticArea}
              >
                <option value="">Select therapeutic area</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Rare Diseases">Rare Diseases</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Oncology">Oncology</option>
                <option value="Neurology">Neurology</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{formErrors.therapeuticArea}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Source *</Form.Label>
              <Form.Control
                type="text"
                value={formData.source}
                onChange={setField('source')}
                placeholder="Enter tender source"
                isInvalid={!!formErrors.source}
              />
              <Form.Control.Feedback type="invalid">{formErrors.source}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </section>

      <section className="pipeline-tender-form__section">
        <h2>Pursuit governance</h2>
        <p className="pipeline-tender-form__section-copy">Stage, priority, urgency, and win probability.</p>
        <Row className="g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Pipeline stage</Form.Label>
              <Form.Select value={formData.pipelineStage} onChange={setField('pipelineStage')}>
                <option value="identified">Identified</option>
                <option value="evaluating">Evaluating</option>
                <option value="pursuing">Pursuing</option>
                <option value="submitted">Submitted</option>
                <option value="awarded">Awarded</option>
                <option value="lost">Lost</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Select value={formData.priority} onChange={setField('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Urgency</Form.Label>
              <Form.Select value={formData.urgency} onChange={setField('urgency')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Win probability (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={formData.winProbability}
                onChange={setField('winProbability')}
              />
            </Form.Group>
          </Col>
        </Row>
      </section>
    </div>
  )
}

export default PipelineTenderForm
