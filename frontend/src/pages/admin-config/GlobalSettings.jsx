import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Breadcrumb, Form, Spinner, Alert, Badge } from 'react-bootstrap'
import { ArrowLeft, UploadCloud, CheckCircle2, Trash2, AlertCircle, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './GlobalSettings.scss'

const GlobalSettings = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [globalKeywordFile, setGlobalKeywordFile] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [keywords, setKeywords] = useState([])
  const [keywordsLoading, setKeywordsLoading] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await intelligenceAPI.getPlatformConfig()
      const keywordsData = res.data?.data?.globalKeywords
      setGlobalKeywordFile(keywordsData?.keywordFileName || null)

      // Load stored keywords from MongoDB
      if (keywordsData?.keywordFileName) {
        fetchKeywords()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load global settings')
    } finally {
      setLoading(false)
    }
  }

  const fetchKeywords = async () => {
    setKeywordsLoading(true)
    try {
      const res = await intelligenceAPI.getGlobalKeywords()
      setKeywords(res.data?.data?.keywords || [])
    } catch {
      // Non-critical
    } finally {
      setKeywordsLoading(false)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setSuccess(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setError(null)
    setSuccess(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const res = await intelligenceAPI.uploadGlobalKeywords(formData)
      setGlobalKeywordFile(res.data?.data?.keywordFileName)
      setSuccess(`✅ ${res.data?.data?.keywordCount || 0} keywords successfully parsed and stored in MongoDB!`)
      setSelectedFile(null)
      const fileInput = document.getElementById('global-keyword-file-input')
      if (fileInput) fileInput.value = ''
      // Reload keyword list
      fetchKeywords()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload keyword file')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove all global keywords? This will affect email scanning matching.')) return
    setLoading(true)
    try {
      await intelligenceAPI.deleteGlobalKeywords()
      setGlobalKeywordFile(null)
      setKeywords([])
      setSuccess(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete keyword file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="global-settings-page">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => navigate('/admin-config')} style={{ cursor: 'pointer' }}>
                Admin & Config
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Global Settings</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <div className="header-content">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => navigate('/admin-config')}
                  className="back-btn"
                >
                  <ArrowLeft size={16} className="me-2" />
                  Back to Modules
                </Button>
                <div className="header-text">
                  <h2>Global Settings</h2>
                  <p className="text-muted">Configure system-wide settings and preferences</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            <AlertCircle size={16} className="me-2" />
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
            {success}
          </Alert>
        )}

        <Row>
          <Col md={8} lg={7}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Tenant Master Keyword List</h5>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Loading settings...</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted small mb-4">
                      Upload an Excel (.xlsx) file containing keywords. All keywords will be parsed and stored directly in MongoDB, used universally across all Email Scanning and Web Scraping connectors.
                    </p>

                    {globalKeywordFile ? (
                      <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light mb-3">
                        <div className="d-flex align-items-center">
                          <CheckCircle2 size={20} className="text-success me-2" />
                          <div>
                            <strong>Master List Active</strong>
                            <div className="text-muted small">{globalKeywordFile}</div>
                            {keywords.length > 0 && (
                              <Badge bg="success" className="mt-1">
                                {keywords.length} keywords in database
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="outline-danger" size="sm" onClick={handleDelete} disabled={loading}>
                          <Trash2 size={16} className="me-1" /> Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <Badge bg="secondary" className="mb-3">No master file configured</Badge>
                      </div>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label>{globalKeywordFile ? 'Replace Master List' : 'Upload Master List'}</Form.Label>
                      <Form.Control
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        id="global-keyword-file-input"
                      />
                      <Form.Text className="text-muted">
                        Excel spreadsheet with keywords in the first column. All keywords will be stored in MongoDB.
                      </Form.Text>
                    </Form.Group>

                    <Button
                      variant="primary"
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                    >
                      {uploading ? (
                        <>
                          <Spinner size="sm" animation="border" className="me-2" /> Parsing & Storing...
                        </>
                      ) : (
                        <>
                          <UploadCloud size={16} className="me-2" /> Upload & Parse Keywords
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Keyword Preview Card */}
            {keywords.length > 0 && (
              <Card className="mb-4">
                <Card.Header className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">
                    <Tag size={16} className="me-2" />
                    Stored Keywords ({keywords.length})
                  </h5>
                  {keywordsLoading && <Spinner animation="border" size="sm" />}
                </Card.Header>
                <Card.Body style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  <div className="d-flex flex-wrap gap-2">
                    {keywords.map((kw, i) => (
                      <Badge key={i} bg="light" text="dark" className="border px-2 py-1" style={{ fontSize: '0.8rem' }}>
                        {kw.keyword}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default GlobalSettings