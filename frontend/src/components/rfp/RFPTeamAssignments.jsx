import React from 'react'
import { Card, Row, Col, Form, Button } from 'react-bootstrap'
import { Plus, Trash2 } from 'lucide-react'

const RFPTeamAssignments = ({ teams, onAdd, onRemove, onUpdate }) => {
  return (
    <Card className="content-card rfp-card">
      <Card.Header className="rfp-card-header d-flex align-items-center justify-content-between">
        <div>
          <h5 className="mb-1">Team Assignments</h5>
          <p className="text-muted mb-0">Map functional teams to responsibilities for this RFP.</p>
        </div>
        <Button size="sm" variant="outline-primary" onClick={onAdd}>
          <Plus size={14} className="me-1" />
          Add Team
        </Button>
      </Card.Header>
      <Card.Body>
        {teams.length === 0 ? (
          <p className="text-muted mb-0">No teams assigned yet.</p>
        ) : (
          <div className="rfp-list">
            {teams.map((team, index) => (
              <div className="rfp-list-item" key={team.id}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="mb-0">Team {index + 1}</h6>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-danger"
                    onClick={() => onRemove(team.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Function</Form.Label>
                      <Form.Control
                        type="text"
                        value={team.functionName}
                        onChange={(event) => onUpdate(team.id, 'functionName', event.target.value)}
                        placeholder="Engineering, Legal..."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Owner</Form.Label>
                      <Form.Control
                        type="text"
                        value={team.owner}
                        onChange={(event) => onUpdate(team.id, 'owner', event.target.value)}
                        placeholder="Owner name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={team.email}
                        onChange={(event) => onUpdate(team.id, 'email', event.target.value)}
                        placeholder="owner@company.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Target SLA (days)</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={team.slaDays}
                        onChange={(event) => onUpdate(team.id, 'slaDays', event.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default RFPTeamAssignments
