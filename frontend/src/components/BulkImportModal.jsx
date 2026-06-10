import React, { useState } from 'react'
import { Modal, Form, Button, Row, Col, Alert, ProgressBar, Table } from 'react-bootstrap'
import FormDrawerModal from './FormDrawerModal'
import { BiX, BiUpload, BiDownload, BiCheckCircle, BiXCircle } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { createTender } from '../store/slices/tenderSlice'

const BulkImportModal = ({ show, onHide }) => {
  const dispatch = useDispatch()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState([])
  const [mapping, setMapping] = useState({})
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState({ success: 0, failed: 0, errors: [] })

  // Sample CSV template
  const csvTemplate = `Title,Organization,Location,Description,EstimatedValue,Currency,Deadline,TenderType,TherapeuticArea,AIMatchScore,Status,Source,Tags,TechnicalRequirements,FinancialRequirements,LegalRequirements
"Diabetes Management System","City Hospital","New York","Implementation of comprehensive diabetes management system",5.2,USD,2024-12-31,"Hospital Tender","Diabetes",85,active,"Hospital Website","diabetes,management,healthcare","EMR integration,Blood glucose monitoring","Minimum 3 years financial stability,Insurance coverage","HIPAA compliance,Data protection"`

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      parseCSV(selectedFile)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const parseCSV = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const csv = e.target.result
      const lines = csv.split('\n')
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      const data = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim())
        const row = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        return row
      })
      
      setPreview(data.slice(0, 5)) // Show first 5 rows
      setMapping({
        title: headers.find(h => h.toLowerCase().includes('title')) || headers[0],
        organization: headers.find(h => h.toLowerCase().includes('organization') || h.toLowerCase().includes('org')) || headers[1],
        location: headers.find(h => h.toLowerCase().includes('location') || h.toLowerCase().includes('city')) || headers[2],
        description: headers.find(h => h.toLowerCase().includes('description') || h.toLowerCase().includes('desc')) || headers[3],
        estimatedValue: headers.find(h => h.toLowerCase().includes('value') || h.toLowerCase().includes('budget')) || headers[4],
        currency: headers.find(h => h.toLowerCase().includes('currency')) || 'USD',
        deadline: headers.find(h => h.toLowerCase().includes('deadline') || h.toLowerCase().includes('due')) || headers[5],
        tenderType: headers.find(h => h.toLowerCase().includes('type')) || headers[6],
        therapeuticArea: headers.find(h => h.toLowerCase().includes('therapeutic') || h.toLowerCase().includes('area')) || headers[7],
        aiMatchScore: headers.find(h => h.toLowerCase().includes('ai') || h.toLowerCase().includes('match')) || headers[8],
        status: headers.find(h => h.toLowerCase().includes('status')) || 'active',
        source: headers.find(h => h.toLowerCase().includes('source')) || headers[9],
        tags: headers.find(h => h.toLowerCase().includes('tags')) || headers[10],
        technicalRequirements: headers.find(h => h.toLowerCase().includes('technical')) || headers[11],
        financialRequirements: headers.find(h => h.toLowerCase().includes('financial')) || headers[12],
        legalRequirements: headers.find(h => h.toLowerCase().includes('legal')) || headers[13]
      })
    }
    reader.readAsText(file)
  }

  const handleMappingChange = (field, value) => {
    setMapping(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tender_import_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const validateRow = (row) => {
    const errors = []
    
    if (!row[mapping.title]) errors.push('Title is required')
    if (!row[mapping.organization]) errors.push('Organization is required')
    if (!row[mapping.location]) errors.push('Location is required')
    if (!row[mapping.description]) errors.push('Description is required')
    if (!row[mapping.estimatedValue]) errors.push('Estimated value is required')
    if (!row[mapping.deadline]) errors.push('Deadline is required')
    if (!row[mapping.tenderType]) errors.push('Tender type is required')
    if (!row[mapping.therapeuticArea]) errors.push('Therapeutic area is required')
    if (!row[mapping.source]) errors.push('Source is required')
    
    return errors
  }

  const transformRow = (row) => {
    const tags = row[mapping.tags] ? row[mapping.tags].split(',').map(t => t.trim()).filter(t => t) : []
    const technicalReqs = row[mapping.technicalRequirements] ? row[mapping.technicalRequirements].split(',').map(r => r.trim()).filter(r => r) : []
    const financialReqs = row[mapping.financialRequirements] ? row[mapping.financialRequirements].split(',').map(r => r.trim()).filter(r => r) : []
    const legalReqs = row[mapping.legalRequirements] ? row[mapping.legalRequirements].split(',').map(r => r.trim()).filter(r => r) : []
    
    return {
      title: row[mapping.title],
      organization: row[mapping.organization],
      location: row[mapping.location],
      description: row[mapping.description],
      estimatedValue: parseFloat(row[mapping.estimatedValue]) * 1000000, // Convert M to actual value
      currency: row[mapping.currency] || 'USD',
      deadline: new Date(row[mapping.deadline]),
      tenderType: row[mapping.tenderType],
      therapeuticArea: row[mapping.therapeuticArea],
      aiMatchScore: parseInt(row[mapping.aiMatchScore]) || 0,
      status: row[mapping.status] || 'active',
      source: row[mapping.source],
      tags,
      requirements: {
        technical: technicalReqs,
        financial: financialReqs,
        legal: legalReqs
      },
      pipelineStage: 'identified',
      priority: 'medium',
      winProbability: 50
    }
  }

  const handleImport = async () => {
    if (!file) return
    
    setImporting(true)
    setProgress(0)
    setResults({ success: 0, failed: 0, errors: [] })
    
    const reader = new FileReader()
    reader.onload = async (e) => {
      const csv = e.target.result
      const lines = csv.split('\n')
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      const data = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim())
        const row = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        return row
      })
      
      let successCount = 0
      let failedCount = 0
      const errors = []
      
      for (let i = 0; i < data.length; i++) {
        const row = data[i]
        const validationErrors = validateRow(row)
        
        if (validationErrors.length > 0) {
          failedCount++
          errors.push(`Row ${i + 2}: ${validationErrors.join(', ')}`)
        } else {
          try {
            const tenderData = transformRow(row)
            await dispatch(createTender(tenderData)).unwrap()
            successCount++
          } catch (error) {
            failedCount++
            errors.push(`Row ${i + 2}: ${error.message || 'Import failed'}`)
          }
        }
        
        setProgress(((i + 1) / data.length) * 100)
      }
      
      setResults({ success: successCount, failed: failedCount, errors })
      setImporting(false)
    }
    reader.readAsText(file)
  }

  const resetForm = () => {
    setFile(null)
    setPreview([])
    setMapping({})
    setProgress(0)
    setResults({ success: 0, failed: 0, errors: [] })
  }

  const fillWithSampleCsv = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' })
    const sampleFile = new File([blob], 'sample-tenders.csv', { type: 'text/csv' })
    setFile(sampleFile)
    parseCSV(sampleFile)
  }

  return (
    <FormDrawerModal show={show} onHide={onHide} onTestFill={show ? fillWithSampleCsv : undefined}>
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>
          <BiUpload className="me-2" />
          Bulk Import Tenders
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Row className="g-4">
          {/* File Upload Section */}
          <Col md={12}>
            <div className="border rounded p-3">
              <h6>Step 1: Upload CSV File</h6>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={importing}
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={downloadTemplate}
                  disabled={importing}
                >
                  <BiDownload className="me-1" />
                  Download Template
                </Button>
              </div>
              {file && (
                <div className="mt-2">
                  <small className="text-muted">
                    Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                  </small>
                </div>
              )}
            </div>
          </Col>

          {/* Field Mapping Section */}
          {file && (
            <Col md={12}>
              <div className="border rounded p-3">
                <h6>Step 2: Field Mapping</h6>
                <p className="text-muted small">
                  Map your CSV columns to tender fields. The system will attempt to auto-map common fields.
                </p>
                <Row className="g-2">
                  {Object.entries(mapping).map(([field, csvColumn]) => (
                    <Col md={6} key={field}>
                      <Form.Group>
                        <Form.Label className="small text-capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </Form.Label>
                        <Form.Select
                          value={csvColumn}
                          onChange={(e) => handleMappingChange(field, e.target.value)}
                          disabled={importing}
                        >
                          {Object.keys(preview[0] || {}).map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          )}

          {/* Preview Section */}
          {preview.length > 0 && (
            <Col md={12}>
              <div className="border rounded p-3">
                <h6>Step 3: Data Preview</h6>
                <p className="text-muted small">
                  Preview of the first 5 rows to verify data structure:
                </p>
                <div className="table-responsive" style={{ maxHeight: '300px' }}>
                  <Table striped bordered size="sm">
                    <thead>
                      <tr>
                        {Object.keys(preview[0] || {}).map(header => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, i) => (
                            <td key={i} className="small">
                              {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          )}

          {/* Import Progress */}
          {importing && (
            <Col md={12}>
              <div className="border rounded p-3">
                <h6>Importing Tenders...</h6>
                <ProgressBar 
                  now={progress} 
                  label={`${Math.round(progress)}%`}
                  className="mb-2"
                />
                <small className="text-muted">
                  Please wait while we import your tenders...
                </small>
              </div>
            </Col>
          )}

          {/* Results */}
          {!importing && (results.success > 0 || results.failed > 0) && (
            <Col md={12}>
              <div className="border rounded p-3">
                <h6>Import Results</h6>
                <div className="d-flex gap-3 mb-3">
                  <div className="text-success">
                    <BiCheckCircle className="me-1" />
                    {results.success} successful
                  </div>
                  <div className="text-danger">
                    <BiXCircle className="me-1" />
                    {results.failed} failed
                  </div>
                </div>
                {results.errors.length > 0 && (
                  <div>
                    <h6 className="text-danger">Errors:</h6>
                    <div className="small text-muted" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {results.errors.map((error, index) => (
                        <div key={index} className="mb-1">• {error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          )}
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {file && !importing && (
          <Button 
            variant="outline-secondary" 
            onClick={resetForm}
          >
            Reset
          </Button>
        )}
        {file && !importing && (
          <Button 
            variant="success" 
            onClick={handleImport}
            disabled={Object.keys(mapping).length === 0}
          >
            <BiUpload className="me-1" />
            Start Import
          </Button>
        )}
      </Modal.Footer>
    </FormDrawerModal>
  )
}

export default BulkImportModal
