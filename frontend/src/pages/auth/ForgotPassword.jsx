import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { BiMailSend, BiArrowBack, BiShield, BiLock, BiCheckCircle } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authAPI } from '../../services/authAPI'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authAPI.forgotPassword(email.trim())
      setIsSubmitted(true)
      toast.success('If an account exists, reset instructions have been sent.')
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to send reset link. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="brand-content">
                <div className="brand-logo">
                  <div className="logo-icon">T</div>
                </div>
                <h1 className="brand-title">Tender360</h1>
                <p className="brand-subtitle">World-Class Tender Management</p>
              </div>
            </div>

            <div className="auth-form">
              <div className="form-header">
                <div className="text-center mb-4">
                  <BiCheckCircle className="text-success mb-3" style={{ fontSize: '3rem' }} />
                  <h2 className="form-title">Check Your Email</h2>
                  <p className="form-subtitle">
                    If an account exists for this address, we sent password reset instructions to
                  </p>
                  <div className="alert alert-info d-flex align-items-center">
                    <BiMailSend className="me-2" />
                    <strong>{email}</strong>
                  </div>
                  <p className="text-muted">
                    Please check your inbox and follow the instructions to reset your password.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link to="/login" className="btn btn-outline-primary">
                  <BiArrowBack className="me-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-content">
              <div className="brand-logo">
                <div className="logo-icon">T</div>
              </div>
              <h1 className="brand-title">Tender360</h1>
              <p className="brand-subtitle">World-Class Tender Management</p>
            </div>
          </div>

          <div className="auth-form">
            <div className="form-header">
              <div className="text-center mb-4">
                <BiShield className="text-primary mb-3" style={{ fontSize: '2.5rem' }} />
                <h2 className="form-title">Forgot Password?</h2>
                <p className="form-subtitle">
                  Don't worry! Enter your email address and we'll send you a secure link to reset your password.
                </p>
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">
                  <BiMailSend className="me-2" />
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="form-control"
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <BiLock className="me-2" />
                    Send Reset Link
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link to="/login" className="forgot-password">
                  <BiArrowBack className="me-1" />
                  Back to Login
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
