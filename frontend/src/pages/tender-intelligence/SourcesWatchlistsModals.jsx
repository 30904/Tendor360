import React from 'react'
import { Alert, Badge, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import { Bell, Brain, Globe, Link2, Radar, Tag } from 'lucide-react'

const SourcesWatchlistsModals = ({
  activeTab,
  showModal,
  setShowModal,
  selectedItem,
  handleEditSource,
  handleEditWatchlist,
  showFormModal,
  setShowFormModal,
  isEditing,
  loading,
  sourceFormData,
  setSourceFormData,
  watchlistFormData,
  setWatchlistFormData,
  handleSaveForm,
  onTestFill
}) => (
  <>
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      centered
      className="intel-executive-modal"
      dialogClassName="intel-executive-modal__dialog"
      contentClassName="intel-executive-modal__content"
    >
      <Modal.Header closeButton className="intel-executive-modal__header">
        <div className="intel-executive-modal__header-copy">
          <div className="intel-executive-modal__icon">
            {activeTab === 'sources' ? <Globe size={22} /> : <Bell size={22} />}
          </div>
          <div>
            <Modal.Title>{activeTab === 'sources' ? 'Source details' : 'Watchlist details'}</Modal.Title>
            <p className="intel-executive-modal__subtitle">
              {selectedItem?.name || 'Review connector telemetry and monitoring configuration.'}
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="intel-executive-modal__body">
        {selectedItem ? (
          <div className="intel-executive-modal__detail-grid">
            <div className="intel-executive-modal__detail-card">
              <h6>Overview</h6>
              <p><span>Status</span><strong>{selectedItem.statusLabel || selectedItem.status}</strong></p>
              <p><span>AI confidence</span><strong>{selectedItem.aiConfidence}%</strong></p>
              <p><span>Description</span><strong>{selectedItem.description}</strong></p>
            </div>
            <div className="intel-executive-modal__detail-card">
              <h6>{activeTab === 'sources' ? 'Connector' : 'Monitoring'}</h6>
              {activeTab === 'sources' ? (
                <>
                  <p><span>Type</span><strong>{selectedItem.type}</strong></p>
                  <p><span>URL</span><strong>{selectedItem.url}</strong></p>
                  <p><span>New tenders</span><strong>{selectedItem.newTenders}</strong></p>
                </>
              ) : (
                <>
                  <p><span>Alerts</span><strong>{selectedItem.alerts}</strong></p>
                  <p><span>Matches</span><strong>{selectedItem.matches}</strong></p>
                  <div className="keywords-list">
                    {(selectedItem.keywords || []).map((keyword) => (
                      <Badge key={keyword} bg="primary" className="me-1 mb-1">{keyword}</Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Alert variant="info" className="intel-executive-modal__insight mb-0">
              <Brain size={16} className="me-2" />
              {selectedItem.aiOptimization}
            </Alert>
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer className="intel-executive-modal__footer">
        <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Close</Button>
        <Button
          variant="primary"
          onClick={() => {
            setShowModal(false)
            if (activeTab === 'sources') {
              handleEditSource(selectedItem)
            } else {
              handleEditWatchlist(selectedItem)
            }
          }}
        >
          Edit
        </Button>
      </Modal.Footer>
    </Modal>

    <FormDrawerModal
      show={showFormModal}
      onHide={() => setShowFormModal(false)}
      className="intel-executive-modal"
      contentClassName="intel-executive-modal__content"
      onTestFill={onTestFill}
    >
      <Modal.Header closeButton className="intel-executive-modal__header">
        <div className="intel-executive-modal__header-copy">
          <div className="intel-executive-modal__icon">
            {activeTab === 'sources' ? <Globe size={22} /> : <Radar size={22} />}
          </div>
          <div>
            <Modal.Title>
              {isEditing ? 'Edit' : 'Create'} {activeTab === 'sources' ? 'source' : 'watchlist'}
            </Modal.Title>
            <p className="intel-executive-modal__subtitle">
              {activeTab === 'sources'
                ? 'Configure a connector feed with sync cadence, priority, and ingestion URL.'
                : 'Define keywords, categories, and alert cadence for automated opportunity monitoring.'}
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="intel-executive-modal__body">
        {activeTab === 'sources' ? (
          <Form className="intel-executive-modal__form">
            <div className="intel-executive-modal__section">
              <h6>Source identity</h6>
              <Row className="g-3">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      value={sourceFormData.name}
                      onChange={(e) => setSourceFormData({ ...sourceFormData, name: e.target.value })}
                      placeholder="SAM.gov federal feed"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={sourceFormData.description}
                      onChange={(e) => setSourceFormData({ ...sourceFormData, description: e.target.value })}
                      placeholder="Describe what this source monitors and how it is used."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <div className="intel-executive-modal__section">
              <h6>Connector settings</h6>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={sourceFormData.type}
                      onChange={(e) => setSourceFormData({ ...sourceFormData, type: e.target.value })}
                    >
                      <option>Government</option>
                      <option>Industry</option>
                      <option>Private</option>
                      <option>Direct</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={sourceFormData.priority}
                      onChange={(e) => setSourceFormData({ ...sourceFormData, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Reliability</Form.Label>
                    <Form.Select
                      value={sourceFormData.reliability}
                      onChange={(e) => setSourceFormData({ ...sourceFormData, reliability: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Sync frequency</Form.Label>
                    <Form.Select
                      value={sourceFormData.frequency}
                      onChange={(e) => setSourceFormData({ ...sourceFormData, frequency: e.target.value })}
                    >
                      <option value="realtime">Realtime</option>
                      <option value="hourly">Hourly</option>
                      <option value="every_4_hours">Every 4 hours</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="d-flex align-items-center gap-2">
                      <Link2 size={15} />
                      Source URL
                    </Form.Label>
                    <Form.Control
                      value={sourceFormData.url}
                      onChange={(e) => setSourceFormData({ ...sourceFormData, url: e.target.value })}
                      placeholder="https://example.gov/opportunities"
                    />
                    <Form.Text>Use a valid HTTPS endpoint for connector ingestion.</Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Form>
        ) : (
          <Form className="intel-executive-modal__form">
            <div className="intel-executive-modal__section">
              <h6>Watchlist identity</h6>
              <Row className="g-3">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      value={watchlistFormData.name}
                      onChange={(e) => setWatchlistFormData({ ...watchlistFormData, name: e.target.value })}
                      placeholder="Biotech GMP instrumentation"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={watchlistFormData.description}
                      onChange={(e) => setWatchlistFormData({ ...watchlistFormData, description: e.target.value })}
                      placeholder="Describe the opportunity profile this watchlist should track."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <div className="intel-executive-modal__section">
              <h6>Monitoring rules</h6>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={watchlistFormData.priority}
                      onChange={(e) => setWatchlistFormData({ ...watchlistFormData, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Alert frequency</Form.Label>
                    <Form.Select
                      value={watchlistFormData.frequency}
                      onChange={(e) => setWatchlistFormData({ ...watchlistFormData, frequency: e.target.value })}
                    >
                      <option value="realtime">Realtime</option>
                      <option value="hourly">Hourly</option>
                      <option value="every_4_hours">Every 4 hours</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="d-flex align-items-center gap-2">
                      <Tag size={15} />
                      Keywords
                    </Form.Label>
                    <Form.Control
                      value={watchlistFormData.keywordsText}
                      onChange={(e) => setWatchlistFormData({ ...watchlistFormData, keywordsText: e.target.value })}
                      placeholder="GMP, cold chain, diagnostics"
                    />
                    <Form.Text>Separate keywords with commas.</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Categories</Form.Label>
                    <Form.Control
                      value={watchlistFormData.categoriesText}
                      onChange={(e) => setWatchlistFormData({ ...watchlistFormData, categoriesText: e.target.value })}
                      placeholder="Laboratory, Life Sciences"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Regions</Form.Label>
                    <Form.Control
                      value={watchlistFormData.regionsText}
                      onChange={(e) => setWatchlistFormData({ ...watchlistFormData, regionsText: e.target.value })}
                      placeholder="US, MD, TX"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className="intel-executive-modal__footer">
        <Button variant="outline-secondary" onClick={() => setShowFormModal(false)}>Cancel</Button>
        <Button variant="primary" onClick={handleSaveForm} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
          {isEditing ? 'Save changes' : activeTab === 'sources' ? 'Create source' : 'Create watchlist'}
        </Button>
      </Modal.Footer>
    </FormDrawerModal>
  </>
)

export default SourcesWatchlistsModals
