import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Breadcrumb, Form, Spinner, Alert, Badge } from 'react-bootstrap'
import { ArrowLeft, Settings, UploadCloud, CheckCircle2, XCircle, Trash2, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './GlobalSettings.scss'

const GlobalSettings = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [globalKeywordFile, setGlobalKeywordFile] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load global settings')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const res = await intelligenceAPI.uploadGlobalKeywords(formData)
      setGlobalKeywordFile(res.data?.data?.keywordFileName)
      setSelectedFile(null)
      // Reset the file input
      const fileInput = document.getElementById('global-keyword-file-input')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload keyword file')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove the global keyword file?')) return
    setLoading(true)
    try {
      await intelligenceAPI.deleteGlobalKeywords()
      setGlobalKeywordFile(null)
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

        <Row>
          <Col md={8} lg={6}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Global Discovery Settings</h5>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Loading settings...</span>
                  </div>
                ) : (
                  <div>
                    <h6 className="mb-3">Tenant Master Keyword List</h6>
                    <p className="text-muted small mb-4">
                      Upload an Excel (.xlsx) file containing keywords to be used universally across all Web Scraping Connectors and Email Scanning bots. Connectors without a specific keyword file will automatically fall back to this master list.
                    </p>

                    {globalKeywordFile ? (
                      <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light mb-3">
                        <div className="d-flex align-items-center">
                          <CheckCircle2 size={20} className="text-success me-2" />
                          <div>
                            <strong>Master List Uploaded</strong>
                            <div className="text-muted small">{globalKeywordFile}</div>
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
                        File must be an Excel spreadsheet containing a "Keywords" column.
                      </Form.Text>
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      onClick={handleUpload} 
                      disabled={!selectedFile || uploading}
                    >
                      {uploading ? (
                        <>
                          <Spinner size="sm" animation="border" className="me-2" /> Uploading...
                        </>
                      ) : (
                        <>
                          <UploadCloud size={16} className="me-2" /> Upload Keywords
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default GlobalSettings