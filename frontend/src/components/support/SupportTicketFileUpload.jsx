import React, { useCallback, useRef, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Upload, FileText, X } from 'lucide-react'
import './SupportTicketFileUpload.scss'

export const SUPPORT_TICKET_MAX_FILES = 5
export const SUPPORT_TICKET_MAX_BYTES = 10 * 1024 * 1024

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/webp'
]

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const SupportTicketFileUpload = ({ files = [], onChange, disabled = false, error = '' }) => {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [localError, setLocalError] = useState('')

  const validateAndAdd = useCallback(
    (incoming) => {
      const list = Array.from(incoming || [])
      if (!list.length) return

      const next = [...files]
      const messages = []

      for (const file of list) {
        if (next.length >= SUPPORT_TICKET_MAX_FILES) {
          messages.push(`Maximum ${SUPPORT_TICKET_MAX_FILES} files allowed.`)
          break
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          messages.push(`"${file.name}" is not an allowed file type.`)
          continue
        }
        if (file.size > SUPPORT_TICKET_MAX_BYTES) {
          messages.push(`"${file.name}" exceeds 10 MB.`)
          continue
        }
        if (next.some((f) => f.name === file.name && f.size === file.size)) {
          continue
        }
        next.push(file)
      }

      setLocalError(messages[0] || '')
      onChange(next)
    },
    [files, onChange]
  )

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
    if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (disabled) return
    validateAndAdd(e.dataTransfer.files)
  }

  const removeFile = (index) => {
    const next = files.filter((_, i) => i !== index)
    onChange(next)
    setLocalError('')
  }

  const displayError = error || localError

  return (
    <Form.Group className="support-ticket-upload mb-3">
      <Form.Label>Attachments</Form.Label>
      <p className="support-ticket-upload__hint text-muted small mb-2">
        Upload screenshots, PDFs, or documents (max {SUPPORT_TICKET_MAX_FILES} files, 10 MB each).
      </p>

      <div
        className={`support-ticket-upload__dropzone ${dragActive ? 'is-active' : ''} ${disabled ? 'is-disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload support ticket attachments"
      >
        <Upload size={22} className="support-ticket-upload__icon" />
        <span className="support-ticket-upload__title">Drag & drop files here</span>
        <span className="support-ticket-upload__sub">or click to browse</span>
        <span className="support-ticket-upload__types">PDF, Word, Excel, TXT, PNG, JPG</span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.webp"
          className="d-none"
          disabled={disabled}
          onChange={(e) => {
            validateAndAdd(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {displayError ? (
        <div className="text-danger small mt-2">{displayError}</div>
      ) : null}

      {files.length > 0 ? (
        <ul className="support-ticket-upload__list">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${index}`} className="support-ticket-upload__item">
              <FileText size={16} className="text-primary flex-shrink-0" />
              <div className="support-ticket-upload__meta">
                <span className="support-ticket-upload__name">{file.name}</span>
                <span className="support-ticket-upload__size">{formatSize(file.size)}</span>
              </div>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="support-ticket-upload__remove p-0"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                aria-label={`Remove ${file.name}`}
              >
                <X size={16} />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </Form.Group>
  )
}

export default SupportTicketFileUpload
